const express = require("express");
const {
  adaptiveCard_card,
} = require("../../controllers/smartApp/overviewcard");

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
    adaptiveCard_card
  );
module.exports = router;
