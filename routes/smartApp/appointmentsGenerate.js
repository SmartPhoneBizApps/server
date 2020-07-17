const express = require("express");
const {
  appointmentsGenerate,
} = require("../../controllers/smartApp/appointments");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/:date/:chr").post(protect, appointmentsGenerate);
module.exports = router;
