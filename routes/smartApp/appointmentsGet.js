const express = require("express");
const { appointmentsGet } = require("../../controllers/smartApp/appointments");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/").get(protect, appointmentsGet);
module.exports = router;
