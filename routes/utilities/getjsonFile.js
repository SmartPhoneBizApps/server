const express = require("express");
const { getjsonFile } = require("../../controllers/utilities/getjsonFile.js");
const router = express.Router({ mergeParams: true });
const { protect } = require("../../middleware/auth");

router.route("/:group/:id").get(protect, getjsonFile);

module.exports = router;
