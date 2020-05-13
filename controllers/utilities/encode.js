var randomstring = require("randomstring");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.getEncoding = (req, res, next) => {
  var rand = randomstring.generate({
    length: 9,
  });
  let data = req.params.data;
  let buff = new Buffer(data);
  let base64data = buff.toString("base64");
  var base64dataSocialID = rand + base64data;
  res.status(200).json(base64dataSocialID);
};
