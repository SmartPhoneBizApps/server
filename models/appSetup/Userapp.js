const mongoose = require("mongoose");

const UserappSchema = new mongoose.Schema({
  UserSettings: [],
  Roles: [],
});

module.exports = mongoose.model("Userapp", UserappSchema);
