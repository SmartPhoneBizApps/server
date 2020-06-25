const express = require("express");
const { copyCourse } = require("../../controllers/utilities/copyCourse.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:fromApp/:toApp/:ID/:role").post(protect, copyCourse);

module.exports = router;
