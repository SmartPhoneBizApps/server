const express = require("express");
const { getaddress } = require("../../controllers/utilities/address.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").get(getaddress);

module.exports = router;
