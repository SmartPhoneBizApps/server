const express = require("express");
const {
  getcalculation,
} = require("../../controllers/utilities/calculation.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");
router.route("/").post(getcalculation);
module.exports = router;
