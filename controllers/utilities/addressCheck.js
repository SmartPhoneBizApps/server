var randomstring = require("randomstring");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.address = (req, res, next) => {
  //  req.params["api-key"] = "g0Obs9X3fE-Fqvt59gA3vA26300";
  myURL = "api.getaddress.io/find/" + req.body.postcode;
  ProcessOut = [];
  ProcessLog = {};

  https: axios({
    method: "get",
    url: myURL,
    prams: { "api-key": "g0Obs9X3fE-Fqvt59gA3vA26300" },
  })
    .then(function (response) {
      ProcessLog["sucess"] = response["sucess"];
      ProcessOut.push(ProcessLog);
    })
    .catch((error) => {
      ProcessLog["error"] = error.message;
      console.log("Error Message", error.message);
      ProcessOut.push(ProcessLog);
    });

  res.status(200).json(response);
};
