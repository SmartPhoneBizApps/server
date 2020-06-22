const express = require("express");
const {
  dentalCharting,
} = require("../../controllers/utilities/dentalCharting.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:id").get(protect, dentalCharting);

module.exports = router;
