const express = require("express");
const {
  getAreas,
  getArea,
  addArea,
  updateArea,
  deleteArea,
  areaPhotoUpload,
} = require("../../controllers/orgSetup/areas");

const Area = require("../../models/orgSetup/Area");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("CompanyAdmin", "AreaAdmin", "SuperAdmin"),
    areaPhotoUpload
  );
router
  .route("/")
  .get(
    advancedResults(Area, {
      path: "company",
      select:
        "companyName email sector status photo address website description",
    }),
    getAreas
  )
  .post(protect, authorize("CompanyAdmin", "SuperAdmin"), addArea);

router
  .route("/:id")
  .get(getArea)
  .put(
    protect,
    authorize("CompanyAdmin", "AreaAdmin", "SuperAdmin"),
    updateArea
  )
  .delete(protect, authorize("CompanyAdmin", "SuperAdmin"), deleteArea);

module.exports = router;
