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
  reason: {
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
    //  required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userSettings: {},
  Role_User: {},
  Role_Purchaser: {},
  Role_Project: {},
  Role_Finance: {},
  Role_Approver: {},
  Role_Manager: {},
  Role_Student: {},
  Role_Employee: {},
  Role_Technician: {},
  Role_Operator: {},
  Role_Candidate: {},
  Role_HRManager: {},
  Role_Interviewer: {},
  Role_Citizen: {},
  Role_ITManager: {},
  Role_ITTechnician: {},
  Role_TreeInspector: {},
  Role_Coder: {},
  Role_APTeam: {},
  Role_System: {},
  Role_Stores: {},
  Role_Shopper: {},
  Role_FleetSup: {},
  Role_SchoolAdmin: {},
  Role_ITSupervisor: {},
  Role_FleetMgm: {},
  Role_CouncilAdmin: {},
  Role_CouncilManager: {},
  Role_Teacher: {},
  Role_HR: {},
  Role_HealthcareAdmin: {},
  Role_Patient: {},
  Role_Park: {},
  Role_Transporter: {},
  Role_LogisticUser: {},
  Role_Broker: {},
  Role_PApprover: {},
  Role_Supplier: {},
  Role_DocManager: {},
  Role_Receptionist: {},
  Role_OrthopaedicDoctor: {},
  Role_Dentist: {},
  Role_Orthodontist: {},
  Role_Parent: {},
  Role_Visitor: {},
  Role_AccessAdmin: {},
  Role_CollegeTeacher: {},
  Role_CollegeStudent: {},
  Role_CollegeAdmin: {},
  Role_CollegeParent: {},
  Role_TrainingTeam: {},
  Role_EmployeeLearn: {},
  Role_ScrumMaster: {},
  Role_HealthCareProfessional: {},
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  // Password ///////
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  /*   // PIN /////////
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; */
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword);
  console.log(this.password);
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
