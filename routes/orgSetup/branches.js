const express = require("express");
const {
  getBranches,
  getBranch,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchesInRadius,
  branchPhotoUpload,
} = require("../../controllers/orgSetup/branches");

const Branch = require("../../models/orgSetup/Branch");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router.route("/radius/:zipcode/:distance").get(getBranchesInRadius);
router
  .route("/:id/photo")
  .put(
    protect,
    authorize("CompanyAdmin", "BranchAdmin", "SuperAdmin"),
    branchPhotoUpload
  );
router
  .route("/")
  .get(
    advancedResults(Branch, {
      path: "company",
      select: "name description",
    }),
    getBranches
  )
  .post(protect, authorize("CompanyAdmin", "SuperAdmin"), addBranch);

router
  .route("/:id")
  .get(getBranch)
  .put(
    protect,
    authorize("CompanyAdmin", "BranchAdmin", "SuperAdmin"),
    updateBranch
  )
  .delete(protect, authorize("CompanyAdmin", "SuperAdmin"), deleteBranch);

module.exports = router;
