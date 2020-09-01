const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Approle = require("../../models/appSetup/Approle");
const Role = require("../../models/appSetup/Role");
const App = require("../../models/appSetup/App");
const { getApplication, getRole } = require("../../modules/config");

// @desc      Get all approles
// @route     GET /api/v1/approles
// @access    Public
exports.getApproles = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single approle
// @route     GET /api/v1/approles/:id
// @access    Public
exports.getApprole = asyncHandler(async (req, res, next) => {
  const approle = await Approle.findById(req.params.id);

  if (!approle) {
    return next(
      new ErrorResponse(`Approle not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: approle });
});

// @desc      Create new approle
// @route     POST /api/v1/approles
// @access    Private
exports.createApprole = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;
  const roleX = await Role.findOne({ role: req.body.appRole });
  if (!roleX) {
    return next(
      new ErrorResponse(`Role ${req.body.appRole} is not created`, 400)
    );
  }
  req.body.appRole = roleX.id;
  req.body.role = roleX.role;
  req.body.descriptions = roleX.descriptions;
  let appList = [];
  i = 0;
  for (i = 0; i < req.body.Apps.length; i++) {
    let appX = {};
    appX = await getApplication(req.body.Apps[i]);
    if (appX) {
      req.body.Apps[i] = appX;
    } else {
      return next(
        new ErrorResponse(`App ${req.body.apps[i]} is not created`, 400)
      );
    }
  }
  const approle = await Approle.create(req.body);
  res.status(201).json({
    success: true,
    data: approle,
  });
});

// @desc      Update approle
// @route     PUT /api/v1/approles/:id
// @access    Private
exports.updateApprole = asyncHandler(async (req, res, next) => {
  // let approle = await Approle.findById(req.params.id);
  let approle = await Approle.findOne({ role: req.params.id });
  if (!approle) {
    return next(
      new ErrorResponse(
        `No record for Role and Apps found for  ${req.params.id}`,
        404
      )
    );
  }
  amg = {};
  if (req.body.appID) {
    if (req.headers.addapp == "Yes") {
      let app01 = await App.findOne({ applicationID: req.body.appID });
      if (!app01) {
        return next(
          new ErrorResponse(`App not found with id of ${req.body.appID}`, 404)
        );
      }

      if (approle.hasOwnProperty("Apps")) {
        for (let index = 0; index < approle["Apps"].length; index++) {
          const element = approle["Apps"][index].applicationID;
          if (element == req.body.appID) {
            return next(
              new ErrorResponse(
                `App with id  ${req.body.appID} is already added to the Role ${approle["role"]}`,
                404
              )
            );
          }
        }
      }

      amg = app01;
      approle["Apps"].push(amg);
      req.body["Apps"] = approle["Apps"];
    }
  }

  if (!approle) {
    return next(
      new ErrorResponse(`Approle not found with id of ${req.params.id}`, 404)
    );
  }

  //  updateApp = {}
  //  updateApp["Apps"] = req.body["Apps"]

  approle = await Approle.findByIdAndUpdate(approle.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: approle });
});

// @desc      Delete approle
// @route     DELETE /api/v1/approles/:id
// @access    Private
exports.deleteApprole = asyncHandler(async (req, res, next) => {
  const approle = await Approle.findById(req.params.id);

  if (!approle) {
    return next(
      new ErrorResponse(`Approle not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is Admin
  /*   if (req.user.approle !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this approle`,
        401
      )
    );
  }
 */
  approle.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc      Upload photo for approle
// @route     PUT /api/v1/approles/:id/photo
// @access    Private
exports.approlePhotoUpload = asyncHandler(async (req, res, next) => {
  const approle = await Approle.findById(req.params.id);

  if (!approle) {
    return next(
      new ErrorResponse(`Approle not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is Admin
  /*   if (req.user.approle !== "SuperAdmin") {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this approle`,
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
  file.name = `photo_${approle._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Approle.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
