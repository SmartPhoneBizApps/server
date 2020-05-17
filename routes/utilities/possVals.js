const express = require("express");
const {
  getPossVal,
  addPossValFile,
} = require("../../controllers/utilities/possVal.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:PossibleValues/:applicationID/:Role").get(getPossVal);
router.route("/").post(addPossValFile);

module.exports = router;
