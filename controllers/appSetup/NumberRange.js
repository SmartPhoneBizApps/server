const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const NumberRange = require("../../models/appSetup/NumberRange");

// @desc      Get all numberRanges
// @route     GET /api/v1/numberRanges
// @access    Public
exports.getNumberRanges = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single numberRange
// @route     GET /api/v1/numberRanges/:id
// @access    Public
exports.getNumberRange = asyncHandler(async (req, res, next) => {
  const numberRange = await NumberRange.findById(req.params.id);

  if (!numberRange) {
    return next(
      new ErrorResponse(
        `NumberRange not found with id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({ success: true, data: numberRange });
});

// @desc      Create new numberRange
// @route     POST /api/v1/numberRanges
// @access    Private
exports.createNumberRange = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // If the user is not an SuperAdmin, they can only add one numberRange
  if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} can't create a new NumberRange`,
        400
      )
    );
  }

  const numberRange = await NumberRange.create(req.body);

  res.status(201).json({
    success: true,
    data: numberRange,
  });
});

// @desc      Update numberRange
// @route     PUT /api/v1/numberRanges/:id
// @access    Private
exports.updateNumberRange = asyncHandler(async (req, res, next) => {
  let numberRange = await NumberRange.findById(req.params.id);

  if (!numberRange) {
    return next(
      new ErrorResponse(
        `NumberRange not found with id of ${req.params.id}`,
        404
      )
    );
  }

  numberRange = await NumberRange.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: numberRange });
});

// @desc      Delete numberRange
// @route     DELETE /api/v1/numberRanges/:id
// @access    Private
exports.deleteNumberRange = asyncHandler(async (req, res, next) => {
  const numberRange = await NumberRange.findById(req.params.id);

  if (!numberRange) {
    return next(
      new ErrorResponse(
        `NumberRange not found with id of ${req.params.id}`,
        404
      )
    );
  }

  /*   // Make sure user is numberRange owner
  if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this numberRange`,
        401
      )
    );
  } */

  numberRange.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for numberRange
// @route     PUT /api/v1/numberRanges/:id/photo
// @access    Private
exports.numberRangePhotoUpload = asyncHandler(async (req, res, next) => {
  const numberRange = await NumberRange.findById(req.params.id);

  if (!numberRange) {
    return next(
      new ErrorResponse(
        `NumberRange not found with id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is numberRange owner
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this numberRange`,
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
  file.name = `photo_${numberRange._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await NumberRange.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
