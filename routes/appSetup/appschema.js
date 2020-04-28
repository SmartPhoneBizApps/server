const express = require("express");
const { addAppschema } = require("../../controllers/appSetup/appschema");
const Appschema = require("../../models/appSetup/Appschema");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

//router.use("/:smartappId/reviews", reviewRouter);

router.route("/").post(protect, authorize("SuperAdmin"), addAppschema);
module.exports = router;
