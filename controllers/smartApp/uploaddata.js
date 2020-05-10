const ErrorResponse = require("../../utils/errorResponse");
const Papa = require("papaparse");
const axios = require("axios").default;

let papaConfig = {
  delimiter: "", // auto-detect
  newline: "", // auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: true,
  transformHeader: undefined,
  dynamicTyping: false,
  preview: 0,
  encoding: "",
  worker: false,
  comments: false,
  step: undefined,
  complete: undefined,
  error: undefined,
  download: false,
  downloadRequestHeaders: undefined,
  downloadRequestBody: undefined,
  skipEmptyLines: false,
  chunk: undefined,
  fastMode: undefined,
  beforeFirstChunk: undefined,
  withCredentials: undefined,
  transform: undefined,
  delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP],
};
// @desc      Post adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.upLoadData = async (req, res, next) => {
  dg01 = {};
  let myURL = "http://localhost:5000/api/v1/datarecords/";
  ProcessLog = { ID: "", success: false, error: "" };
  ProcessOut = [];
  let fileName =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";

  // Parse CSV
  var data = Papa.parse(req.body.FileData, papaConfig);
  // Loop the records
  for (const key in data["data"]) {
    if (data["data"].hasOwnProperty(key)) {
      element = data["data"][key];
      mydata = {};
      var cardConfig = require(fileName);
      for (const key in element) {
        cardConfig["FieldDef"].forEach((element1) => {
          if (element.hasOwnProperty(key) & (element1["SLabel"] == key)) {
            mydata[element1["name"]] = element[key];
          }
        });
      }
      ProcessLog["ID"] = mydata["ID"];

      dg01 = JSON.stringify(mydata);
      axios({
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
      console.log("ProcessLog", ProcessLog);
      dg01 = {};
      ProcessLog = {};
    }
  }

  //res.writeHead(status, statusText, headers);
  //res.end(JSON.stringify(result));

  let result = {};
  console.log("Output", ProcessOut);
  res.status(201).json({
    success: true,
    data: ProcessOut,
  });
  ProcessOut = [];
};
