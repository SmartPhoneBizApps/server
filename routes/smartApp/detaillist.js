const express = require("express");
const { getDetailList } = require("../../controllers/smartApp/detaillist");
//const reviewRouter = require("../reviews");
const router = express.Router();
//const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

//router.use("/:smartappId/reviews", reviewRouter);

router
  .route("/:app/:role/:record")
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
    getDetailList
  );

module.exports = router;
