const mongoose = require("mongoose");

const SmartappSchema = new mongoose.Schema({
  transactionID: {
    type: String,
    required: [true, "Please add transactionID (DDMMYYY-HHMMSS-C)"],
    unique: true,
    trim: true,
    maxlength: [20, "Name can not be more than 20 characters"],
  },
  transactionType: {
    type: String,
  },
  description: {
    type: String,
  },
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: "App",
    required: true,
  },
  applicationID: {
    type: String,
  },

  data: {},

  dataStore: {
    type: String,
  },
  icon: {
    type: String,
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  attachment: {
    type: String,
    default: "no-attachment.pdf",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "New",
  },
  areaId: {
    type: mongoose.Schema.ObjectId,
    ref: "Area",
    required: true,
  },
  areaName: {
    type: String,
  },
  branchId: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  branchName: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
  companyName: {
    type: String,
  },
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Smartapp", SmartappSchema);
