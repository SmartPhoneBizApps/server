const express = require("express");
const { getUserapps } = require("../../controllers/appSetup/userapps");

const Userapp = require("../../models/appSetup/Userapp");

const router = express.Router();

const { protect, authorize } = require("../../middleware/auth");

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
    getUserapps
  );

module.exports = router;
