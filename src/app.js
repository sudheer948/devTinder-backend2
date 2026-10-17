const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(cors({ origin: "http://localhost:5173", credentials: true })); // whitelisting the domain name
app.use(express.json()); // this is a middleware
// it reads the json object, converts into js object and adds that js object to the req

app.use(cookieParser()); // to parse the cookies, so that we can read the cookies

// go to every router, checks all api's or routes

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("database not connected");
    console.error(err);
  });
