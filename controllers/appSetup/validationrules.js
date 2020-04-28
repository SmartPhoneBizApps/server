const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");

const Validationrule = require("../../models/appSetup/Validationrule");

// @desc      Get single app
// @route     GET /api/v1/appschemas
// @access    Public
exports.getValidationrule = asyncHandler(async (req, res, next) => {
  const validationrules = await Validationrule.findOne({ rule: req.body.rule });
  res.status(201).json({
    success: true,
    data: validationrules,
  });
});

// @desc      Get single appschema
// @route     GET /api/v1/appschemas/:id
// @access    Public
exports.getAppschema = asyncHandler(async (req, res, next) => {});

// @desc      Add appschema
// @route     POST /api/v1/validationrule
// @access    Private
exports.addValidationrule = asyncHandler(async (req, res, next) => {
  const AppValidation1 = await Validationrule.create(req.body);
  res.status(201).json({
    success: true,
    data: AppValidation1,
  });
});

// @desc      Update appschema
// @route     PUT /api/v1/appschemas/:id
// @access    Private
exports.updateAppschema = asyncHandler(async (req, res, next) => {});

// @desc      Delete appschema
// @route     DELETE /api/v1/appschemas/:id
// @access    Private
exports.deleteAppschema = asyncHandler(async (req, res, next) => {});

// @desc      Get appschemas within a radius
// @route     GET /api/v1/appschemas/radius/:zipcode/:distance
// @access    Private
exports.getAppschemasInRadius = asyncHandler(async (req, res, next) => {});

// @desc      Upload photo for appschema
// @route     PUT /api/v1/appschemas/:id/photo
// @access    Private
exports.appschemaPhotoUpload = asyncHandler(async (req, res, next) => {});
