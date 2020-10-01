const express = require("express");
const { visionAPI } = require("../../controllers/smartApp/visionAPI");
const router = express.Router();
router.route("/").get(visionAPI);
module.exports = router;
