const express = require("express");
const { tilecountGet } = require("../../controllers/smartApp/tilecountGet");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/").get(protect, tilecountGet);
module.exports = router;
