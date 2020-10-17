const express = require("express");
const {
  getNumberRanges,
  getNumberRange,
  createNumberRange,
  updateNumberRange,
  deleteNumberRange,
} = require("../../controllers/appSetup/NumberRange");

const NumberRange = require("../../models/appSetup/NumberRange");

// Include other resource routers
//Atul (Link to Roles Later) - Start
//const branchRouter = require('./branches');
//Atul (Link to Roles Later) - End
const reviewRouter = require("../reviews");

const router = express.Router();

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router.use("/:numberRangeId/reviews", reviewRouter);

//router.route('/radius/:zipcode/:distance').get(getNumberRangesInRadius);

router
  .route("/")
  .get(advancedResults(NumberRange, "numberRanges"), getNumberRanges)
  .post(protect, authorize("SuperAdmin"), createNumberRange);

router
  .route("/:id")
  .get(getNumberRange)
  .put(protect, authorize("SuperAdmin"), updateNumberRange)
  .delete(protect, authorize("SuperAdmin"), deleteNumberRange);

module.exports = router;
