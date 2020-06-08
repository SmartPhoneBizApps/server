const mongoose = require("mongoose");

const UserappSchema = new mongoose.Schema({
  userSettings: [],
  Roles: [],
});

module.exports = mongoose.model("Userapp", UserappSchema);
