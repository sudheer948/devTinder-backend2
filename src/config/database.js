const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
// changing default dns server to google's dns to resolve dns issue

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://muhammedsudheer121_db_user:yPx6uco1Fj11fCzA@cluster0.3vda2j5.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
