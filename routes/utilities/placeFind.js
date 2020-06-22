const express = require("express");
const { placeFind } = require("../../controllers/utilities/placeFind.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:id").get(protect, placeFind);

module.exports = router;
