const express = require("express");
const {
  assignCourseUser,
} = require("../../controllers/utilities/assignCourseUser.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:fromApp/:toApp/:ID/:user").post(protect, assignCourseUser);

module.exports = router;
