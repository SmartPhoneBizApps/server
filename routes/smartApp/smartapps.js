const express = require("express");
const {
  getSmartapps,
  getSmartapp,
  createSmartapp,
  updateSmartapp,
  deleteSmartapp,
  smartappPhotoUpload,
} = require("../../controllers/smartApp/smartapps");

const Smartapp = require("../../models/smartApp/Smartapp");

// Include other resource routers
//Atul (Link to Smartapps Later) - Start
//const branchRouter = require('./branches');
//Atul (Link to Smartapps Later) - End
const reviewRouter = require("../reviews");

const router = express.Router();

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

// Re-route into other resource routers
//Atul (Link to Smartapps Later) - S
//router.use('/:smartappId/branches', branchRouter);
//Atul (Link to Smartapps Later) - End

router.use("/:smartappId/reviews", reviewRouter);

//router.route('/radius/:zipcode/:distance').get(getSmartappsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("admin"), smartappPhotoUpload);

router
  .route("/")
  //Atul (Link to Smartapps Later) - S
  .get(
    protect,
    authorize(
      "CompanyAdmin",
      "BranchAdmin",
      "AreaAdmin",
      "CompanyUser",
      "BranchUser",
      "AreaUser",
      "user"
    ),
    advancedResults(Smartapp, "smartapps"),
    getSmartapps
  )
  //Atul (Link to Smartapps Later) - End
  .post(
    protect,
    authorize(
      "CompanyAdmin",
      "BranchAdmin",
      "AreaAdmin",
      "CompanyUser",
      "BranchUser",
      "AreaUser",
      "user"
    ),
    createSmartapp
  );

router
  .route("/:id")
  .get(
    protect,
    authorize(
      "CompanyAdmin",
      "BranchAdmin",
      "AreaAdmin",
      "CompanyUser",
      "BranchUser",
      "AreaUser",
      "user"
    ),
    getSmartapp
  )
  .put(
    protect,
    authorize(
      "CompanyAdmin",
      "BranchAdmin",
      "AreaAdmin",
      "CompanyUser",
      "BranchUser",
      "AreaUser",
      "user"
    ),
    updateSmartapp
  )
  .delete(
    protect,
    authorize("CompanyAdmin", "BranchAdmin", "AreaAdmin", "CompanyUser"),
    deleteSmartapp
  );

module.exports = router;
