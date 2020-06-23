const express = require("express");
const {
  nhsfindPatient,
} = require("../../controllers/utilities/nhsfindPatient.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(protect, nhsfindPatient);

module.exports = router;
