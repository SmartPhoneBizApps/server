const express = require("express");
const { calendarData } = require("../../controllers/smartApp/calendarData");

const router = express.Router({ mergeParams: true });
const { protect } = require("../../middleware/auth");

router.route("/:id").get(protect, calendarData);
module.exports = router;
