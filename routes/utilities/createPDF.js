const express = require("express");
const { createPDF } = require("../../controllers/utilities/createPDF.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, createPDF);

module.exports = router;
