const express = require("express");
const { dataFilters } = require("../../controllers/smartApp/dataFilters");
const router = express.Router({ mergeParams: true });
const { protect } = require("../../middleware/auth");
router.route("/").get(protect, dataFilters);
module.exports = router;
