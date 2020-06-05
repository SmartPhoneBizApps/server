const express = require("express");
const { getItems } = require("../../controllers/smartApp/detaillist");
const router = express.Router();
const { protect, authorize } = require("../../middleware/auth");
router
  .route("/:appID/:Role/:id")
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
    getItems
  );

module.exports = router;
