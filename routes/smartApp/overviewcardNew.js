const express = require("express");
const {
  overviewcardNew,
} = require("../../controllers/smartApp/overviewcardNew");

const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/:role/:tab")
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
    overviewcardNew
  );
module.exports = router;
