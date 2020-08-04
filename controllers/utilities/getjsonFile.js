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
    config["examQuestions2"] = {
      Name: "Atul Gupta",
      Phone: "078123123133",
    };
  }
  res.status(201).json({
    success: true,
    data: config,
  });
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
exports.updatejsonFile = async (req, res, next) => {
  let fn01 = "";
  var config = {};
  if (req.params.group == "questioner") {
    fn01 = "././questioner/LEARNING_" + req.params.id + ".json";
    fn02 = "../../questioner/LEARNING_" + req.params.id + ".json";
    config = require(fn02);
    config = req.body;
  }
  console.log(config);
  if (req.params.group == "examQuestions2") {
    config["examQuestions2"] = {
      Name: "Atul Gupta",
      Phone: "078123123133",
    };
  }

  fs.writeFile(fn01, JSON.stringify(config), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(JSON.stringify(config));
    console.log("writing to " + fn01);
  });

  res.status(201).json({
    success: true,
    message: "File updated",
    data: config,
  });
};
