const mongoose = require("mongoose");

const Validationruleschema = new mongoose.Schema({
  rule: {
    type: String,
    required: [true, "Please add ruleID"],
    unique: true,
  },
  type: {
    type: String,
    required: [true, "Please add applicationID"],
    default: "regEx",
  },
  value: {
    type: String,
  },
});
module.exports = mongoose.model("Validationrule", Validationruleschema);
