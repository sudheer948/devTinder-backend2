const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit Request");
    }

    const loggedInUser = req.user; // Get the logged-in user's document

    Object.keys(req.body).forEach((key) => {
      // Get each field sent in req.body
      loggedInUser[key] = req.body[key]; // Update that field in the user document
    });

    await loggedInUser.save(); // Save the updated user document to MongoDB

    /* Since you're learning Node.js/Mongoose right now, keep this version in your DevTinder project.

       Later, when you're comfortable with Mongoose, findByIdAndUpdate() is a useful alternative for simpler direct updates.*/

    res.send({
      message: `${loggedInUser.firstName} ${loggedInUser.lastName}'s profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err);
  }
});

module.exports = profileRouter;
