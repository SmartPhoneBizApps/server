const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  UserPIN: {
    type: String,
  },
  userType: {
    type: String,
  },
  userAccess: {
    type: String,
    default: "own",
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
  },
  area: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
  },
  role: {
    type: String,
    enum: [
      "user",
      "publisher",
      "admin",
      "SuperAdmin",
      "CompanyAdmin",
      "BranchAdmin",
      "AreaAdmin",
      "CompanyUser",
      "BranchUser",
      "AreaUser",
      "Supplier",
      "Patient",
    ],
    default: "user",
  },
  businessRoles: [],
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(this.password);
  console.log(enteredPassword);
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
