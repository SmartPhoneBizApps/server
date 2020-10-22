const express = require("express");
const {
  googlePlaceAddress,
} = require("../../controllers/utilities/googlePlaceAddress.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:address").get(protect, googlePlaceAddress);

module.exports = router;
