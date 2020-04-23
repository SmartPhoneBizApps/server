const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Smartapp = require("../../models/smartApp/Smartapp");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");

// @desc      Get all smartapps
// @route     GET /api/v1/smartapps
// @access    Public
exports.getSmartapps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single app
// @route     GET /api/v1/smartapps/:id
// @access    Public
exports.getSmartapp = asyncHandler(async (req, res, next) => {
  const smartapp = await Smartapp.findById(req.params.id);

  if (!smartapp) {
    return next(
      new ErrorResponse(`Smartapp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: smartapp });
});

// @desc      Create new app
// @route     POST /api/v1/smartapps
// @access    Private
exports.createSmartapp = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;
  req.body.partner = req.user.id;

  const publishedCompany = await Company.findOne({
    companyName: req.body.companyName,
  });
  req.body.companyId = publishedCompany.id;

  const publishedArea = await Area.findOne({
    areaName: req.body.areaName,
  });
  req.body.areaId = publishedArea.id;

  const publishedBranch = await Branch.findOne({
    branchName: req.body.branchName,
  });
  req.body.branchId = publishedBranch.id;

  const publishedApp = await App.findOne({
    applicationID: req.body.applicationID,
  });
  req.body.appId = publishedApp.id;

  console.log(req.body);

  // Check for published app
  //const publishedSmartapp = await Smartapp.findOne({ user: req.user.id });

  // If the user is not an SuperAdmin, they can only add one app
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a smartapp`,
        400
      )
    );
  } */

  const smartapp = await Smartapp.create(req.body);

  res.status(201).json({
    success: true,
    data: smartapp,
  });
});

// @desc      Update smartapp
// @route     PUT /api/v1/smartapps/:id
// @access    Private
exports.updateSmartapp = asyncHandler(async (req, res, next) => {
  let smartapp = await Smartapp.findById(req.params.id);

  if (!smartapp) {
    return next(
      new ErrorResponse(`Smartapp not found with id of ${req.params.id}`, 404)
    );
  }

  /*  // Make sure user is app owner
  if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this app`,
        401
      )
    );
  } */

  smartapp = await Smartapp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: smartapp });
});

// @desc      Delete smartapp
// @route     DELETE /api/v1/smartapps/:id
// @access    Private
exports.deleteSmartapp = asyncHandler(async (req, res, next) => {
  const smartapp = await Smartapp.findById(req.params.id);

  if (!smartapp) {
    return next(
      new ErrorResponse(`Smartapp not found with id of ${req.params.id}`, 404)
    );
  }

  /*   // Make sure user is app owner
  if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this app`,
        401
      )
    );
  } */

  smartapp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for app
// @route     PUT /api/v1/smartapps/:id/photo
// @access    Private
exports.smartappPhotoUpload = asyncHandler(async (req, res, next) => {
  const smartapp = await Smartapp.findById(req.params.id);

  if (!smartapp) {
    return next(
      new ErrorResponse(`Smartapp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is app owner
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this app`,
        401
      )
    );
  } */

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${smartapp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Smartapp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
