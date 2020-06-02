var randomstring = require("randomstring");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.addressCheck = (req, res, next) => {
  req.params["api-key"] = "g0Obs9X3fE-Fqvt59gA3vA26300";
  myURL = "api.getaddress.io/find/" + req.body.postcode;

  //sl15dg?api-key=
  https: axios({
    method: "post",
    url: myURL,
    data: mydata,
    headers: {
      applicationid: req.headers.applicationid,
      Authorization: req.headers.authorization,
      businessrole: req.headers.businessrole,
      //   fieldnames: req.headers.fieldnames,
    },
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

  var rand = randomstring.generate({
    length: 9,
  });
  let data = req.params.data;
  let buff = new Buffer(data);
  let base64data = buff.toString("base64");
  var base64dataSocialID = rand + base64data;
  res.status(200).json(base64dataSocialID);
};
