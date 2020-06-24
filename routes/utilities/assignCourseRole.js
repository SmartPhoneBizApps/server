const express = require("express");
const {
  assignCourseRole,
} = require("../../controllers/utilities/assignCourseRole.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, assignCourseRole);

module.exports = router;
