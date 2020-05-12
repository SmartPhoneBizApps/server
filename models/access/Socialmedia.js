const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SocialmediaSchema = new mongoose.Schema({
  SocialMediaAccountID: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  SocialMediaType: {
    type: String,
    enum: [
      "email",
      "facebook",
      "google",
      "skype",
      "googlePhone",
      "web",
      "dialogflowMessenger",
      "hangout",
      "slack",
      "viber",
      "twitter",
      "twilio",
      "telegram",
      "kik",
      "line",
      "alexa",
    ],
  },

  businessRole: {
    type: mongoose.Schema.ObjectId,
    ref: "Role",
    required: true,
  },
  businessRoleName: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  accessToken: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Socialmedia", SocialmediaSchema);
