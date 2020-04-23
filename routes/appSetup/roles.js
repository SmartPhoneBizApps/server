const express = require("express");
const {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  rolePhotoUpload,
} = require("../../controllers/appSetup/roles");

const Role = require("../../models/appSetup/Role");

// Include other resource routers
//Atul (Link to Roles Later) - Start
//const branchRouter = require('./branches');
//Atul (Link to Roles Later) - End
const reviewRouter = require("../reviews");

const router = express.Router();

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

// Re-route into other resource routers
//Atul (Link to Roles Later) - S
//router.use('/:roleId/branches', branchRouter);
//Atul (Link to Roles Later) - End

router.use("/:roleId/reviews", reviewRouter);

//router.route('/radius/:zipcode/:distance').get(getRolesInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("SuperAdmin"), rolePhotoUpload);

router
  .route("/")
  //Atul (Link to Roles Later) - S
  .get(advancedResults(Role, "roles"), getRoles)
  //Atul (Link to Roles Later) - End
  .post(protect, authorize("SuperAdmin"), createRole);

router
  .route("/:id")
  .get(getRole)
  .put(protect, authorize("SuperAdmin"), updateRole)
  .delete(protect, authorize("SuperAdmin"), deleteRole);

module.exports = router;
