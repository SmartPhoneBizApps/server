const fs = require("fs");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.getjsonFile = async (req, res, next) => {
  let fn01 = "";
  var config = {};
  if (req.params.group == "questioner") {
    fn01 = "../../questioner/LEARNING_" + req.params.id + ".json";
    config["questioner"] = require(fn01);
  }
  if (req.params.group == "examQuestions2") {
    config = {
      Name: "Atul Gupta",
      Phone: "078123123133",
    };
  }
  res.status(201).json({
    success: true,
    data: config,
  });
};
