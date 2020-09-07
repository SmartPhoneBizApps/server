const express = require("express");
const { botButtons } = require("../../controllers/utilities/botButtons.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");
router.route("/:applicationID/:Role/:PValue").get(protect, botButtons);
module.exports = router;
