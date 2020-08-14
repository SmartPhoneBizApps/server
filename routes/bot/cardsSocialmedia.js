const express = require("express");
const { cardsSocialmedia } = require("../../controllers/bot/cardsSocialmedia");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:socialmedia").get(cardsSocialmedia);

module.exports = router;
