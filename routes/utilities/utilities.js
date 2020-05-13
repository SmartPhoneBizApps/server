const express = require("express");
const { getEncoding } = require("../../controllers/utilities/encode.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:data").get(getEncoding);

module.exports = router;
