const express = require("express");
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
} = require("../../controllers/access/agent");
const Agent = require("../../models/access/Agent");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../../middleware/advancedResults");
const { protect, authorize } = require("../../middleware/auth");

router
  .route("/")
  .get(protect, authorize("SuperAdmin"), advancedResults(Agent), getAgents)
  .post(createAgent);

router.route("/:id").get(getAgent).put(updateAgent).delete(deleteAgent);

module.exports = router;
