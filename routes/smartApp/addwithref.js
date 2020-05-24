const express = require("express");
const { addWithRef } = require("../../controllers/smartApp/addwithref");
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
    addWithRef
  );
module.exports = router;
