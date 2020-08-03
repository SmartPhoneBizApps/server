// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.getjsonFile = (req, res, next) => {
  let fn01 = "";
  var config = {};
  if (req.params.group == "questioner") {
    fn01 = "../../questioner/LEARNING_" + req.params.id + ".json";
    config = require(fn01);
  }

  res.status(201).json({
    success: true,
    data: config,
  });
};
