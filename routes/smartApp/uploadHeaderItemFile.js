const express = require("express");
const {
  uploadHeaderItemFile,
} = require("../../controllers/smartApp/uploadHeaderItemFile");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

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
    uploadHeaderItemFile
  );

module.exports = router;
