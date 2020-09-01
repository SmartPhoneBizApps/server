const express = require("express");
const { filterData } = require("../../controllers/smartApp/filterData");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/:app/:businessrole").get(protect, filterData);
module.exports = router;
