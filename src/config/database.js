const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
// changing default dns server to google's dns to resolve dns issue

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET,
  );
};

module.exports = connectDB;
