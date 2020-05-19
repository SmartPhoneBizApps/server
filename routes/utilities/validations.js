const express = require("express");
const {
  getvalidations,
} = require("../../controllers/utilities/validations.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(getvalidations);

module.exports = router;
