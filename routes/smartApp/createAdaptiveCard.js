const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
  createAdaptiveCard,
} = require("../../controllers/smartApp/createAdaptiveCard");
router.route("/:app/:businessrole").get(protect, createAdaptiveCard);

module.exports = router;
