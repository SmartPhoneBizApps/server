const mongoose = require("mongoose");
const {
  getRegExValidation,
  getFixedData,
} = require("../../modules/validations/validations");
json = getRegExValidation("LOG00002");
var fixed1 = getFixedData();
scmc = [];
scmc.push(json);
scmc.push(fixed1);
const XSchema = new mongoose.Schema(scmc);
module.exports = mongoose.model("LOG00002", XSchema);
