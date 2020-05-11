const express = require("express");
const { checkBotPin } = require("../../controllers/access/auth");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:resettoken").put(checkBotPin);

module.exports = router;
