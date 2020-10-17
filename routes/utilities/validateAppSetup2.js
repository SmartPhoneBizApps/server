const express = require("express");
const {
  validateAppSetup2,
} = require("../../controllers/utilities/validateAppSetup2.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(protect, validateAppSetup2);

module.exports = router;
