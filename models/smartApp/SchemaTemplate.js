const mongoose = require("mongoose");

const XXXSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: [true, "Please add transactionID (DDMMYYY-HHMMSS-C)"],
    unique: true,
    trim: true,
    maxlength: [20, "Name can not be more than 20 characters"],
  },

  applicationID: { type: String },
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: "App",
    required: true,
  },

  areaName: { type: String },
  areaId: {
    type: mongoose.Schema.ObjectId,
    ref: "Area",
    required: true,
  },

  branchName: { type: String },
  branchId: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  companyName: { type: String },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  dataStore: {
    type: String,
  },
  photo: {
    type: [String],
    default: "no-photo.jpg",
  },
  attachment: {
    type: [String],
    default: "no-attachment.pdf",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Smartapp", XXXSchema);
