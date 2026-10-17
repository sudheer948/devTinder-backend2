const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      // returns an array
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName photoUrl age gender about skills",
    ); // first ref, then populate;

    if (connectionRequests.length === 0) {
      // because connectionRequestModel.find returns an array
      return res.status(404).json({ message: "No pending requests found!!!" });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA); // because we also want the sender's data like akshay to me, virat to me etc

    /* 
      {
        fromUserId: {
          _id: "VIRAT_ID",
          firstName: "Virat",
        },
        toUserId: {
          _id: "AKSHAY_ID",
          firstName: "Akshay",
        },
        status: "accepted",
      },

      {
        fromUserId: {
          _id: "AKSHAY_ID",
          firstName: "Akshay",
        },
        toUserId: {
          _id: "DHONI_ID",
          firstName: "Dhoni",
        },
        status: "accepted",
      },
    */

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        // we cannot compare two objectId's directly
        return row.toUserId;
      }
      return row.fromUserId;
    }); // because we want the data of the sender's if receiver is us or reciever's if sender is us
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  // User should see all the user cards except
  // his own card
  // his connections
  // ignored people
  // already sent the connection request
  // basically own, interested, ignored, accepted, rejected

  try {
    const loggedInUser = req.user;

    // query means /feed?page=1&limit=10 and params means /request/send/:status/:toUserId  - IMPORTANT
    const page = parseInt(req.query.page) || 1; // when we receive the page, it will be in strings.so we need to convert into numbers
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // what if the user types 1 million here, so it is very important to sanitize this

    const skip = (page - 1) * limit;

    // Find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); // we don't want the whole data, we only want fromUserId and toUserId

    const hideUsersFromFeed = new Set(); // only store unique elements and here we are storing ID's of users
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()); // toString because we don't want ObjectId like ObjectId('232324')
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } }, // function to convert Set into Array // nin => not in, ne => not equal to
        { _id: { $ne: loggedInUser._id } }, // if we don't have requests, then we should need to avoid our own details explicitly
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;

// pagination
// feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
// feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
// feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
