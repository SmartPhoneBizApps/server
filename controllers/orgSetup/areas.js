const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Area = require("../../models/orgSetup/Area");
const Company = require("../../models/orgSetup/Company");
const path = require("path");
// @desc      Get areas
// @route     GET /api/v1/areas
// @route     GET /api/v1/companies/:companyId/areas
// @access    Public
exports.getAreas = asyncHandler(async (req, res, next) => {
  if (req.params.companyId) {
    const areas = await Area.find({ companyId: req.params.companyId });

    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single area
// @route     GET /api/v1/areas/:id
// @access    Public
exports.getArea = asyncHandler(async (req, res, next) => {
  const area = await Area.findById(req.params.id).populate({
    path: "company",
    select: "name description",
  });

  if (!area) {
    return next(
      new ErrorResponse(`No area with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: area,
  });
});

// @desc      Add area
// @route     POST /api/v1/companies/:companyId/areas
// @access    Private
exports.addArea = asyncHandler(async (req, res, next) => {
  req.body.companyId = req.params.companyId;
  req.body.user = req.user.id;

  const company = await Company.findById(req.params.companyId);
  console.log(company);
  if (!company) {
    return next(
      new ErrorResponse(`No company with the id of ${req.params.companyId}`),
      404
    );
  }

  /*   // Make sure user is company owner
  if (req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a area to company ${company._id}`,
        401
      )
    );
  } */

  const area = await Area.create(req.body);

  res.status(200).json({
    success: true,
    data: area,
  });
});

// @desc      Update area
// @route     PUT /api/v1/areas/:id
// @access    Private
exports.updateArea = asyncHandler(async (req, res, next) => {
  let area = await Area.findById(req.params.id);

  if (!area) {
    return next(
      new ErrorResponse(`No area with the id of ${req.params.id}`),
      404
    );
  }

  /*  // Make sure user is area owner
  if (area.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update area ${area._id}`,
        401
      )
    );
  } */

  area = await Area.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: area,
  });
});

// @desc      Delete area
// @route     DELETE /api/v1/areas/:id
// @access    Private
exports.deleteArea = asyncHandler(async (req, res, next) => {
  const area = await Area.findById(req.params.id);

  if (!area) {
    return next(
      new ErrorResponse(`No area with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is area owner
  /*  if (area.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete area ${area._id}`,
        401
      )
    );
  } */

  await area.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Upload photo for area
// @route     PUT /api/v1/areas/:id/photo
// @access    Private
exports.areaPhotoUpload = asyncHandler(async (req, res, next) => {
  const area = await Area.findById(req.params.id);

  if (!area) {
    return next(
      new ErrorResponse(`Area not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is area owner
  /*   if (area.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this area`,
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
  file.name = `photo_${area._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Area.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
