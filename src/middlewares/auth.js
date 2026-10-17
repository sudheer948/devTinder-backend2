const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req.cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!"); // 401 means unauthorized
    }

    // validate the token
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790"); // this decodedMessage has _id and iat (which we are not bothered about)

    const { _id } = decodedMessage;

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // attach the user to the request
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
