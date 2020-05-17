const mongoose = require("mongoose");

const PossiblevalueSchema = new mongoose.Schema({
  PossibleValues: {
    type: String,
    required: [true, "Please add a PossibleValues"],
  },
  Role: {
    type: String,
    required: [true, "Please add a Role"],
  },
  ApplicationID: {
    type: String,
    required: [true, "Please add a ApplicationID"],
  },
  Value: {
    type: String,
    required: [true, "Please add a Value"],
  },
  Description: {
    type: String,
    required: [true, "Please add a Description"],
  },
  ColorSAP: {
    type: String,
  },
  Score: {
    type: String,
  },
  EditLock: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Possval", PossiblevalueSchema);
