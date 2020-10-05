const express = require("express");
const { addHCP } = require("../../controllers/utilities/addHCP.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/:table/:fromApp/:toApp/:ID/:ReferenceID/:role")
  .post(protect, addHCP);

module.exports = router;
