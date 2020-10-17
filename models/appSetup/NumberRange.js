const mongoose = require("mongoose");

const numberRange = new mongoose.Schema({
  numberRange: {
    type: String,
    required: [true, "Please add numberRangeID"],
    unique: true,
  },
  applicationID: {
    type: String,
    required: [true, "Please add applicationID"],
    maxlength: [20, "Name can not be more than 20 characters"],
  },
  maxLen: {
    type: Number,
  },
  preString: {
    type: String,
  },
  year: {
    type: String,
  },
  current: {
    type: String,
  },
  dataStore: {
    type: String,
  },
  inUse: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "New",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("numberRange", numberRange);
