const express = require("express");
const { sendEmailHtml } = require("../../controllers/smartApp/sendEmailHtml");

const router = express.Router({ mergeParams: true });

router.route("/").post(sendEmailHtml);
module.exports = router;
