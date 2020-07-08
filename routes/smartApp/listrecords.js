const express = require("express");
const { getListrecords1 } = require("../../controllers/smartApp/listrecords");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/:id").get(protect, getListrecords1);
module.exports = router;
