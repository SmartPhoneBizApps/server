const express = require("express");
const { calendarData } = require("../../controllers/smartApp/calendarData");

const router = express.Router({ mergeParams: true });

router.route("/:appID").post(calendarData);
module.exports = router;
