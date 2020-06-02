const axios = require("axios").default;
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.getaddress = (req, res, next) => {
  //  req.params["api-key"] = "g0Obs9X3fE-Fqvt59gA3vA26300";
  key = "?api-key=g0Obs9X3fE-Fqvt59gA3vA26300";
  myURL = "api.getaddress.io/find/" + req.params.id + key;
  ProcessOut = [];
  ProcessLog = {};
  console.log(myURL);

  $.ajax({
    type: "GET",
    url: myURL,
    timeout: 600000,
    success: function (data) {
      console.log("SUCCESS : ", data);
      res.status(200).json(data);
    },
    error: function (e) {
      console.log("ERROR : ", e);
      res.status(400).json(e);
    },
  });

  /*   https: axios({
    method: "get",
    url: myURL,
    //  params: { "api-key": "g0Obs9X3fE-Fqvt59gA3vA26300" },
  })
    .then(function (response) {
      ProcessLog["sucess"] = response["sucess"];
      ProcessOut.push(ProcessLog);
      res.status(200).json(response);
    })
    .catch((error) => {
      ProcessLog["error"] = error.message;
      console.log("Error Message", error.message);
      ProcessOut.push(ProcessLog);
      res.status(400).json(error);
    }); */
};
