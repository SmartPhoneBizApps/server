const express = require("express");
const {
  checkSocialmedia,
} = require("../../controllers/access/socialmediacheck");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:socialmedia").get(protect, checkSocialmedia);

module.exports = router;
