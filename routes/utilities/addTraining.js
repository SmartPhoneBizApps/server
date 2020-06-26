const express = require("express");
const { addTraining } = require("../../controllers/utilities/addTraining.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/:table/:fromApp/:toApp/:ID/:ReferenceID/:role")
  .post(protect, addTraining);

module.exports = router;
