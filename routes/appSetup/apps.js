const express = require("express");
const {
  getApps,
  getApp,
  createApp,
  updateApp,
  deleteApp,
  appPhotoUpload,
} = require("../../controllers/appSetup/apps");

const App = require("../../models/appSetup/App");

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
//router.use('/:appId/branches', branchRouter);
//Atul (Link to Roles Later) - End

router.use("/:appId/reviews", reviewRouter);

//router.route('/radius/:zipcode/:distance').get(getAppsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("SuperAdmin"), appPhotoUpload);

router
  .route("/")
  //Atul (Link to Roles Later) - S
  .get(advancedResults(App, "apps"), getApps)
  //Atul (Link to Roles Later) - End
  .post(protect, authorize("SuperAdmin"), createApp);

router
  .route("/:id")
  .get(getApp)
  .put(protect, authorize("SuperAdmin"), updateApp)
  .delete(protect, authorize("SuperAdmin"), deleteApp);

module.exports = router;
