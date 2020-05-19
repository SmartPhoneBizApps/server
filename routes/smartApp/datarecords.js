const express = require("express");
const {
  addDataRecords,
  updateDataRecords,
} = require("../../controllers/smartApp/datarecords");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

//router.use("/:smartappId/reviews", reviewRouter);

router
  .route("/")
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
    addDataRecords
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
    updateDataRecords
  );

module.exports = router;
