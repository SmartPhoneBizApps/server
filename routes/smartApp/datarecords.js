const express = require("express");
const {
  addDataRecords,
  getRecords,
} = require("../../controllers/smartApp/datarecords");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

//router.use("/:smartappId/reviews", reviewRouter);

router
  .route("/")
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
    getRecords
  )
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
  );

module.exports = router;
