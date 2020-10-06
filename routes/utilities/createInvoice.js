const express = require("express");
const {
  createInvoice,
} = require("../../controllers/utilities/createInvoice.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/:sourceRole/:targetRole/:fromApp/:toApp/:ID/:user")
  .post(protect, createInvoice);

module.exports = router;
