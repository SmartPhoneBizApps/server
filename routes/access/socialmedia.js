const express = require("express");
const {
  getSocialmedias,
  getSocialmedia,
  createSocialmedia,
  updateSocialmedia,
  deleteSocialmedia,
} = require("../../controllers/access/socialmedia");
const Socialmedia = require("../../models/access/Socialmedia");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/")
  .get(
    protect,
    authorize("SuperAdmin"),
    advancedResults(Socialmedia),
    getSocialmedias
  )
  .post(createSocialmedia);

router
  .route("/:id")
  .get(getSocialmedia)
  .put(updateSocialmedia)
  .delete(deleteSocialmedia);

module.exports = router;
