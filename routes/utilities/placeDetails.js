const express = require("express");
const { placeDetails } = require("../../controllers/utilities/placeDetails.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:id").get(protect, placeDetails);

module.exports = router;
