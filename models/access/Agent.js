const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AgentSchema = new mongoose.Schema({
  agent: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  agentName: {
    type: String,
  },
  nlp: {
    type: String,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
  },
  companyName: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
  },
  branchName: {
    type: String,
  },
  area: {
    type: mongoose.Schema.ObjectId,
    ref: "Area",
  },
  areaName: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Agent", AgentSchema);
