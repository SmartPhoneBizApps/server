const express = require("express");
const { deleteRecord } = require("../../controllers/smartApp/deleteRecord");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/:mode/:app/:ID").delete(protect, deleteRecord);
module.exports = router;
