const express = require("express");
const { upLoadData } = require("../../controllers/smartApp/uploaddata");

const router = express.Router({ mergeParams: true });
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
    upLoadData
  );
module.exports = router;
