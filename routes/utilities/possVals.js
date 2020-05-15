const express = require("express");
const { getPossVal } = require("../../controllers/utilities/possVal.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(getPossVal);

module.exports = router;
