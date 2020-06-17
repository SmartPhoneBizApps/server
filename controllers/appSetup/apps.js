const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const App = require("../../models/appSetup/App");

// @desc      Get all apps
// @route     GET /api/v1/apps
// @access    Public
exports.getApps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single app
// @route     GET /api/v1/apps/:id
// @access    Public
exports.getApp = asyncHandler(async (req, res, next) => {
  const app = await App.findById(req.params.id);

  if (!app) {
    return next(
      new ErrorResponse(`App not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: app });
});

// @desc      Create new app
// @route     POST /api/v1/apps
// @access    Private
exports.createApp = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // If the user is not an SuperAdmin, they can only add one app
  if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} can't create a new App`,
        400
      )
    );
  }

  const app = await App.create(req.body);

  res.status(201).json({
    success: true,
    data: app,
  });
});

// @desc      Update app
// @route     PUT /api/v1/apps/:id
// @access    Private
exports.updateApp = asyncHandler(async (req, res, next) => {
  let app = await App.findById(req.params.id);

  if (!app) {
    return next(
      new ErrorResponse(`App not found with id of ${req.params.id}`, 404)
    );
  }

  app = await App.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: app });
});

// @desc      Delete app
// @route     DELETE /api/v1/apps/:id
// @access    Private
exports.deleteApp = asyncHandler(async (req, res, next) => {
  const app = await App.findById(req.params.id);

  if (!app) {
    return next(
      new ErrorResponse(`App not found with id of ${req.params.id}`, 404)
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

  app.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for app
// @route     PUT /api/v1/apps/:id/photo
// @access    Private
exports.appPhotoUpload = asyncHandler(async (req, res, next) => {
  const app = await App.findById(req.params.id);

  if (!app) {
    return next(
      new ErrorResponse(`App not found with id of ${req.params.id}`, 404)
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
  file.name = `photo_${app._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await App.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
