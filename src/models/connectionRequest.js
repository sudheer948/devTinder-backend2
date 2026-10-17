const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // building relation from the connectionrequest collection to the user collection or reference to the user collection
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"], // it will just validate the value
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true },
);

const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);
// we are querying both and so it would become slower if we have millions of connection requests in the db and so we need to index them both.that's why we are creating compound index.
// compound index because of checking fromUserId and toUserId
// now the queries become very fast
// please note that creating indexes uneseccarily comes with a lot of cost
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // 1 ascending order and -1 decending order and there are more things.

// this is not mandatory to do and you can implement this on the api itself and this is the job of schema and that's why we implement it here.
// this is kind of like a middleware where it will be called everytime when the connection request is saved.
connectionRequestSchema.pre("save", function (next) {
  // basically before i save connectionRequest, this will be called.
  // don't write arrow functions
  const connectionRequest = this;

  // check if the fromUserId is same as toUserId

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }

  next();
});

module.exports = ConnectionRequestModel;
