const express = require("express");
const { scanEmail } = require("../../controllers/utilities/scanEmail.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(protect, scanEmail);

module.exports = router;
