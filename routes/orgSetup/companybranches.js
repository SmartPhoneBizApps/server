const express = require("express");
const { getCompanyBranches } = require("../../controllers/orgSetup/branches");

const Branch = require("../../models/orgSetup/Branch");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router.route("/:companyId").get(getCompanyBranches);

module.exports = router;
