const express = require("express");
const { deleteAll } = require("../../controllers/smartApp/deleteAll");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/:mode/:app").delete(protect, deleteAll);
module.exports = router;
