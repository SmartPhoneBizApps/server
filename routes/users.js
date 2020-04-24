const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.use(authorize("SuperAdmin"));

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(protect, authorize("SuperAdmin"), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("SuperAdmin"), updateUser)
  .delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
