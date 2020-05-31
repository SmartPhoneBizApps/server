const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Agent = require("../../models/access/Agent");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/access/User");
const sendEmail = require("../../utils/sendEmail");
const { findOneAgent } = require("../../modules/config");
// @desc      Get all agents
// @route     GET /api/v1/auth/agents
// @access    Private/Admin
exports.getAgents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc      Get single agent
// @route     GET /api/v1/auth/agents/:id
// @access    Private/Admin
exports.getAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: agent,
  });
});

// @desc      Create agent
// @route     POST /api/v1/auth/agents
// @access    Private/Admin
exports.createAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.create(req.body);
  res.status(201).json({
    success: true,
    data: agent,
  });
  /////////
});

// @desc      Update agent
// @route     PUT /api/v1/auth/agents/:id
// @access    Private/Admin
exports.updateAgent = asyncHandler(async (req, res, next) => {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: agent,
  });
});

// @desc      Delete agent
// @route     DELETE /api/v1/auth/agents/:id
// @access    Private/Admin
exports.deleteAgent = asyncHandler(async (req, res, next) => {
  var base64data = req.params.id;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  const smedia = await findOneAgent(SMediaAccountID);
  await Agent.findByIdAndDelete(smedia.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
