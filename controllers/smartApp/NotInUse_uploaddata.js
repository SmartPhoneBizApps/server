const ErrorResponse = require("../../utils/errorResponse");
const Papa = require("papaparse");
const axios = require("axios").default;
const { getNewConfig } = require("../../modules/config");
const path = require("path");

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

  const header = req.files.header;
  output_header = [];
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!header.mimetype.startsWith("text/csv")) {
    return next(new ErrorResponse(`Please upload an csv file(header)`, 400));
  }
  if (header.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  var cardConfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  header.name = `data_${req.user.id}${path.parse(header.name).ext}`;
  const headercsvFilePath = "./public/uploadFiles/" + header.name;
  const headercsvFilePath1 = "../public/uploadFiles/" + header.name;
  header.mv(`${process.env.DATA_UPLOAD_PATH}/${header.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    // const filedata = require(headercsvFilePath1);
    // Parse CSV
    var data = Papa.parse(headercsvFilePath1, papaConfig);
    console.log(data);
  });

  // Loop the records
  for (const key in data["data"]) {
    if (data["data"].hasOwnProperty(key)) {
      element = data["data"][key];
      mydata = {};
      //  var cardConfig = require(fileName);
      for (const key in element) {
        cardConfig["FieldDef"].forEach((element1) => {
          if (element.hasOwnProperty(key) & (element1["SLabel"] == key)) {
            mydata[element1["name"]] = element[key];
          }
        });
      }
      console.log("Atul Data");
      ProcessLog["ID"] = mydata["ID"];
      //---------------------------
      // Perform Calculations ....
      //---------------------------
      /*       if (req.headers.calculation == "Yes") {
        var Handler = new calfunction();
        mydata = Handler["datacalculation"](
          mydata,
          cardConfig["CalculatedFields"]
        );
      } */
      //---------------------------
      //    dg01 = JSON.stringify(mydata);
      /*       axios({
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
        }); */
      //     console.log("ProcessLog", ProcessLog);
      //   dg01 = {};
      //   ProcessLog = {};
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
