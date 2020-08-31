const express = require("express");
const { botGroup } = require("../../controllers/utilities/botGroup.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");
router.route("/:bot").get(protect, botGroup);
module.exports = router;
