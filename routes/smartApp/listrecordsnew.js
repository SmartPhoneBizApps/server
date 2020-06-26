const express = require("express");
const router = express.Router();
const advancedDataList = require("../../middleware/advancedDataList");
const { protect, authorize } = require("../../middleware/auth");
const { listrecordsnew } = require("../../controllers/smartApp/listrecordsnew");
router.route("/:mode/:app/:businessrole").get(protect, listrecordsnew);

module.exports = router;
