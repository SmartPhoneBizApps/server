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
    res.status(201).json({
      success: true,
      data: config,
    });

    // try {
    //   await fs.promises.access(fn01);
    //   console.log("Success");
    // } catch (error) {
    //   console.log("Fail");
    // }

    // fs.access(fn01, (err) => {
    //   if (err) {
    //     console.error(err);
    //     res.status(201).json({
    //       success: false,
    //       message: err,
    //       data: config,
    //     });
    //     return;
    //   }
    //   console.log(fn01);
    //   config = require(fn01);
    //   res.status(201).json({
    //     success: true,
    //     data: config,
    //   });
    // });
  }
};
