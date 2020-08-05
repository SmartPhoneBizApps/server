const fs = require("fs");
const { updateFile } = require("../../modules/config");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.getjsonFile = async (req, res, next) => {
  let fn01 = "";
  var config = {};
  let out = {};
  out["resCode"] = 400;
  if (req.params.group == "questioner") {
    fn01 = "././questioner/LEARNING_" + req.params.id + ".json";

    if (fs.existsSync(fn01)) {
      console.log("The file exists.");
      fn02 = "../../questioner/LEARNING_" + req.params.id + ".json";
      config["questioner"] = require(fn02);
      out["resCode"] = 201;
      out["success"] = true;
      out["message"] = "The file exists.";
    } else {
      console.log("The file does not exist.");
      out["resCode"] = 400;
      out["success"] = false;
      out["message"] = "The file does not exist.";
    }
  }
  if (req.params.group == "examQuestions2") {
    config["examQuestions2"] = {
      Name: "Atul Gupta",
      Phone: "078123123133",
    };
    out["resCode"] = 201;
    out["success"] = true;
    out["message"] = "The file exists.";
  }
  res.status(out["resCode"]).json({
    success: out["success"],
    message: out["message"],
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
  let out = {};
  out["resCode"] = 400;
  if (req.params.group == "questioner") {
    fn01 = "././questioner/LEARNING_" + req.params.id + ".json";
    if (fs.existsSync(fn01)) {
      console.log("The file exists.");
      fn02 = "../../questioner/LEARNING_" + req.params.id + ".json";
      config = req.body;
      // Update file....
      var s1 = updateFile(fn01, config);
      console.log(s1);
      out["resCode"] = 201;
      out["success"] = true;
      out["message"] = "The file exists & updated..";

      console.log("AG02", out);
    } else {
      console.log("The file does not exist.");
      out["resCode"] = 400;
      out["success"] = false;
      out["message"] = "The file does not exist.";
      out["error"] = {};
    }
  }

  if (req.params.group == "examQuestions2") {
    config["examQuestions2"] = {
      Name: "Atul Gupta",
      Phone: "078123123133",
    };
    out["resCode"] = 201;
    out["success"] = true;
    out["message"] = "File updated";
    out["error"] = {};
  }
  console.log(out);
  res.status(out["resCode"]).json({
    success: out["success"],
    message: out["message"],
    error: out["error"],
    //    data: config,
  });
};
