const express = require("express");
const {
  getjsonFile,
  updatejsonFile,
} = require("../../controllers/utilities/getjsonFile.js");
const router = express.Router({ mergeParams: true });
const { protect } = require("../../middleware/auth");

router.route("/:group/:id").get(protect, getjsonFile);
router.route("/:group/:id").put(protect, updatejsonFile);

module.exports = router;
