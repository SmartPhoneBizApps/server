const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Role = require("../../models/appSetup/Role");

// @desc      Get all roles
// @route     GET /api/v1/roles
// @access    Public
exports.getRoles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single role
// @route     GET /api/v1/roles/:id
// @access    Public
exports.getRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: role });
});

// @desc      Create new role
// @route     POST /api/v1/roles
// @access    Private
exports.createRole = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;
  console.log(req.user.id);
  console.log(req.user.role);
  // Check for published role
  //const publishedRole = await Role.findOne({ user: req.user.id });

  // If the user is not an SuperAdmin, they can't add a role
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a role`,
        400
      )
    );
  } */

  const role = await Role.create(req.body);

  res.status(201).json({
    success: true,
    data: role,
  });
});

// @desc      Update role
// @route     PUT /api/v1/roles/:id
// @access    Private
exports.updateRole = asyncHandler(async (req, res, next) => {
  let role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  // If the user is not an SuperAdmin, they can't update a role
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this role`,
        401
      )
    );
  } */

  role = await Role.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: role });
});

// @desc      Delete role
// @route     DELETE /api/v1/roles/:id
// @access    Private
exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  // If the user is not an SuperAdmin, they can't delete a role
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this role`,
        401
      )
    );
  } */

  role.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for role
// @route     PUT /api/v1/roles/:id/photo
// @access    Private
exports.rolePhotoUpload = asyncHandler(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(
      new ErrorResponse(`Role not found with id of ${req.params.id}`, 404)
    );
  }

  // If the user is not an SuperAdmin, they can't update photo of a role
  /*   if (req.user.role !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this role`,
        401
      )
    );
  }
 */
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
  file.name = `photo_${role._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Role.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
