const express = require("express");
const { dummyUpload } = require("../../utils/dummyUpload.js");
const router = express.Router({ mergeParams: true });

router.route("/").get(dummyUpload);

module.exports = router;
