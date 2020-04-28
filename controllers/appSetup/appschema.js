const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");

const Appschema = require("../../models/appSetup/Appschema");

// @desc      Get appschemas
// @route     GET /api/v1/appschemas
// @route     GET /api/v1/companies/:companyId/appschemas
// @access    Public
exports.getAppschemas = asyncHandler(async (req, res, next) => {});

// @desc      Get single appschema
// @route     GET /api/v1/appschemas/:id
// @access    Public
exports.getAppschema = asyncHandler(async (req, res, next) => {});

// @desc      Add appschema
// @route     POST /api/v1/companies/appschema
// @access    Private
exports.addAppschema = asyncHandler(async (req, res, next) => {
  const AppSchema1 = await Appschema.create(req.body);
  res.status(201).json({
    success: true,
    data: AppSchema1,
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
