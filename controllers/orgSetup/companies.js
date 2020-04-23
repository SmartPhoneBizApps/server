const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const Company = require("../../models/orgSetup/Company");

// @desc      Get all companies
// @route     GET /api/v1/companies
// @access    Public
exports.getCompanies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single company
// @route     GET /api/v1/companies/:id
// @access    Public
exports.getCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: company });
});

// @desc      Create new company
// @route     POST /api/v1/companies
// @access    Private
exports.createCompany = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published company
  const publishedCompany = await Company.findOne({
    companyName: req.body.companyName,
  });

  // If the user is not an admin, they can only add one company
  /*   if (publishedCompany && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a company`,
        400
      )
    );
  } */
  console.log(req.body);
  const company = await Company.create(req.body);

  res.status(201).json({
    success: true,
    data: company,
  });
});

// @desc      Update company
// @route     PUT /api/v1/companies/:id
// @access    Private
exports.updateCompany = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  let company = await Company.findById(req.params.id);
  console.log(req.body);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is company owner
  /*   if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this company`,
        401
      )
    );
  } */
  console.log(req.body);
  company = await Company.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: company });
});

// @desc      Delete company
// @route     DELETE /api/v1/companies/:id
// @access    Private
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is company owner
  /*   if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this company`,
        401
      )
    );
  } */

  company.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Get companies within a radius
// @route     GET /api/v1/companies/radius/:zipcode/:distance
// @access    Private
exports.getCompaniesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const companies = await Company.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: companies.length,
    data: companies,
  });
});

// @desc      Upload photo for company
// @route     PUT /api/v1/companies/:id/photo
// @access    Private
exports.companyPhotoUpload = asyncHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return next(
      new ErrorResponse(`Company not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is company owner
  /*   if (company.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this company`,
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
  file.name = `photo_${company._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Company.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
