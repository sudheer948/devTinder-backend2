const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema( // basically it defines the user
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, // mongodb automatically creates an index for that, so our finding api should be faster like if i want to find akshay in the database when login, it or the query would become much faster with index or you could write index = true
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is incorrect status type`,
      },
      // validate(value) {               // it is not mandatory here because we already implemented this using enum
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL : " + value);
        }
      },
    },
    about: {
      type: String,
      default: "default testing",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

// best practice
// it will attach to the userSchema, so that every user has their own jwt token
// Don't use arrow function here because this keyword will not work

userSchema.methods.getJWT = async function () {
  const user = this; // it will point to the instance of the User model of that particular user

  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    // {hide data}, private key that only we know
    expiresIn: "7d", // after token expired, it will say jwt expired
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
// model should start with a capital letter (Pascalcase)

module.exports = User;
