const express = require("express");
const {
  getApproles,
  getApprole,
  createApprole,
  updateApprole,
  deleteApprole,
  approlePhotoUpload,
} = require("../../controllers/appSetup/approles");

const Approle = require("../../models/appSetup/Approle");

// Include other resource routers
//Atul (Link to Approles Later) - Start
//const branchRouter = require('./branches');
//Atul (Link to Approles Later) - End
const reviewRouter = require("../reviews");

const router = express.Router();

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

// Re-route into other resource routers
//Atul (Link to Approles Later) - S
//router.use('/:roleId/branches', branchRouter);
//Atul (Link to Approles Later) - End

router.use("/:roleId/reviews", reviewRouter);

//router.route('/radius/:zipcode/:distance').get(getApprolesInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("SuperAdmin"), approlePhotoUpload);

router
  .route("/")
  //Atul (Link to Approles Later) - S
  .get(advancedResults(Approle, "roles"), getApproles)
  //Atul (Link to Approles Later) - End
  .post(protect, authorize("SuperAdmin"), createApprole);

router
  .route("/:id")
  .get(getApprole)
  .put(protect, authorize("SuperAdmin"), updateApprole)
  .delete(protect, authorize("SuperAdmin"), deleteApprole);

module.exports = router;
