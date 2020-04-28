const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");

const Record = require("../../models/orgSetup/Record");

// @desc      Get records
// @route     GET /api/v1/records
// @route     GET /api/v1/companies/:companyId/records
// @access    Public
exports.getRecords = asyncHandler(async (req, res, next) => {});

// @desc      Get single record
// @route     GET /api/v1/records/:id
// @access    Public
exports.getRecord = asyncHandler(async (req, res, next) => {});

// @desc      Add record
// @route     POST /api/v1/companies/:companyId/records
// @access    Private
exports.addRecord = asyncHandler(async (req, res, next) => {});

// @desc      Update record
// @route     PUT /api/v1/records/:id
// @access    Private
exports.updateRecord = asyncHandler(async (req, res, next) => {});

// @desc      Delete record
// @route     DELETE /api/v1/records/:id
// @access    Private
exports.deleteRecord = asyncHandler(async (req, res, next) => {});

// @desc      Get records within a radius
// @route     GET /api/v1/records/radius/:zipcode/:distance
// @access    Private
exports.getRecordsInRadius = asyncHandler(async (req, res, next) => {});

// @desc      Upload photo for record
// @route     PUT /api/v1/records/:id/photo
// @access    Private
exports.recordPhotoUpload = asyncHandler(async (req, res, next) => {});
