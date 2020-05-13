const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  sendEmail,
  pinLogin,
  checkPin,
  updateArea,
  updateBranch,
  deleteUser,
} = require("../../controllers/access/auth");

const router = express.Router();

const { protect } = require("../../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatebranch", protect, updateBranch);
router.put("/updatearea", protect, updateArea);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.post("/sendemail", protect, sendEmail);
router.post("/pinLogin", pinLogin);
router.put("/checkpin/:resettoken", checkPin);
router.delete("/:email", deleteUser);

module.exports = router;
