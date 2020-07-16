const express = require("express");
const {
  appointmentsGenerate,
} = require("../../controllers/smartApp/appointments");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/").post(protect, appointmentsGenerate);
module.exports = router;
