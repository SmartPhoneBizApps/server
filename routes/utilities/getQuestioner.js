const express = require("express");
const {
  getQuestioner,
} = require("../../controllers/utilities/getQuestioner.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:area/:ID").get(protect, getQuestioner);

module.exports = router;
