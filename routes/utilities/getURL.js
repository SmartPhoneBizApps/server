const express = require("express");
const { getURL } = require("../../controllers/utilities/getURL.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, getURL);

module.exports = router;
