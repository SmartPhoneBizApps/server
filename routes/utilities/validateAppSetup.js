const express = require("express");
const {
  validateAppSetup,
} = require("../../controllers/utilities/validateAppSetup.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(protect, validateAppSetup);

module.exports = router;
