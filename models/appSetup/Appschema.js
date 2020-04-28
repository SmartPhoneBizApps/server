const mongoose = require("mongoose");

const Appschema = new mongoose.Schema({
  appID: {
    type: String,
    required: [true, "Please add applicationID"],
    unique: true,
  },
  schemaApp: {
    type: String,
  },
});
module.exports = mongoose.model("Appschema", Appschema);
