const mongoose = require("mongoose");
const {
  getRegExValidation,
  getFixedData,
} = require("../../modules/validations/validations");
json = getRegExValidation("HC0001");
var fixed1 = getFixedData();
scmc = [];
scmc.push(json);
scmc.push(fixed1);
const XSchema = new mongoose.Schema(scmc);
module.exports = mongoose.model("HC0001", XSchema);
