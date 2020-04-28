const express = require("express");
const {
  addValidationrule,
} = require("../../controllers/appSetup/validationrules");
const Validationrule = require("../../models/appSetup/Validationrule");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

//router.use("/:smartappId/reviews", reviewRouter);

router.route("/").post(protect, authorize("SuperAdmin"), addValidationrule);
module.exports = router;
