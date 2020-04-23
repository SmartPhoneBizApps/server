const express = require("express");
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompaniesInRadius,
  companyPhotoUpload,
} = require("../../controllers/orgSetup/companies");

const Company = require("../../models/orgSetup/Company");

// Include other resource routers
const areasRouter = require("./areas");
const branchRouter = require("./branches");
const reviewRouter = require("../reviews");

const router = express.Router();

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

// Re-route into other resource routers
router.use("/:companyId/branches", branchRouter);
router.use("/:companyId/areas", areasRouter);
router.use("/:companyId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getCompaniesInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("CompanyAdmin", "SuperAdmin"), companyPhotoUpload);

router
  .route("/")
  .get(advancedResults(Company, "branches"), getCompanies)
  .post(protect, authorize("SuperAdmin"), createCompany);

router
  .route("/:id")
  .get(getCompany)
  .put(protect, authorize("CompanyAdmin", "SuperAdmin"), updateCompany)
  .delete(protect, authorize("SuperAdmin"), deleteCompany);

module.exports = router;
