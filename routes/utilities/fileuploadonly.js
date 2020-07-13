const express = require("express");
const { uploadFileOnly } = require("../../utils/fileuploadonly.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:mode/:ID").post(protect, uploadFileOnly);
router.route("/:mode").post(protect, uploadFileOnly);

module.exports = router;
