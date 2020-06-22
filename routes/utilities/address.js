const express = require("express");
const { getaddress } = require("../../controllers/utilities/address.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/:id").get(protect, getaddress);

module.exports = router;
