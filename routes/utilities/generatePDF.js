const express = require("express");
const { generatePDF } = require("../../controllers/utilities/generatePDF.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(protect, generatePDF);

module.exports = router;
