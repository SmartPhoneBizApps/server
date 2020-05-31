const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Branch = require("../../models/orgSetup/Branch");
const Company = require("../../models/orgSetup/Company");
const geocoder = require("../../utils/geocoder");
const path = require("path");

// @desc      Get branches /getCompanyBranches
// @route     GET /api/v1/branches
// @route     GET /api/v1/companies/:companyId/branches
// @access    Public
exports.getCompanyBranches = asyncHandler(async (req, res, next) => {
  if (req.params.companyId) {
    const branches = await Branch.find({ companyId: req.params.companyId });
    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get branches
// @route     GET /api/v1/branches
// @route     GET /api/v1/companies/:companyId/branches
// @access    Public
exports.getBranches = asyncHandler(async (req, res, next) => {
  if (req.params.companyId) {
    const branches = await Branch.find({ companyId: req.params.companyId });
    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single branch
// @route     GET /api/v1/branches/:id
// @access    Public
exports.getBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id).populate({
    path: "company",
    select: "companyName email status sector subSector address",
  });

  if (!branch) {
    return next(
      new ErrorResponse(`No branch with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: branch,
  });
});

// @desc      Add branch
// @route     POST /api/v1/companies/:companyId/branches
// @access    Private
exports.addBranch = asyncHandler(async (req, res, next) => {
  req.body.companyId = req.params.companyId;
  req.body.user = req.user.id;
  const company = await Company.findById(req.params.companyId);
  if (!company) {
    return next(
      new ErrorResponse(`No company with the id of ${req.params.companyId}`),
      404
    );
  }
  const branch = await Branch.create(req.body);
  res.status(200).json({
    success: true,
    data: branch,
  });
});

// @desc      Update branch
// @route     PUT /api/v1/branches/:id
// @access    Private
exports.updateBranch = asyncHandler(async (req, res, next) => {
  let branch = await Branch.findById(req.params.id);
  if (!branch) {
    return next(
      new ErrorResponse(`No branch with the id of ${req.params.id}`),
      404
    );
  }
  branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: branch,
  });
});

// @desc      Delete branch
// @route     DELETE /api/v1/branches/:id
// @access    Private
exports.deleteBranch = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return next(
      new ErrorResponse(`No branch with the id of ${req.params.id}`),
      404
    );
  }
  await branch.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get branches within a radius
// @route     GET /api/v1/branches/radius/:zipcode/:distance
// @access    Private
exports.getBranchesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const branches = await Branch.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: branches.length,
    data: branches,
  });
});

// @desc      Upload photo for branch
// @route     PUT /api/v1/branches/:id/photo
// @access    Private
exports.branchPhotoUpload = asyncHandler(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);

  if (!branch) {
    return next(
      new ErrorResponse(`Branch not found with id of ${req.params.id}`, 404)
    );
  }

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
  file.name = `photo_${branch._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Branch.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
