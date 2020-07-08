const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { getNewConfig, createMultipleDocument } = require("../modules/config");
let csvToJson = require("convert-csv-to-json");
const App = require("../models/appSetup/App");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.uploadFile = asyncHandler(async (req, res, next) => {
  // Note the logic currently supports only one file at a time..
  console.log("Inside Upload...");

  const file = req.files.file;
  /////////////////////////////////////////////////////////////////////////
  //   --------  Input - Validations  -------------------
  /////////////////////////////////////////////////////////////////////////
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!req.files.file) {
    return next(new ErrorResponse(`No file with parameter file`, 400));
  }
  const header = req.files.file;
  console.log(header.mimetype);
  if (req.headers.filetype == "csv") {
    if (header && !header.mimetype.startsWith("text/csv")) {
      return next(new ErrorResponse(`Please upload an csv file(header)`, 400));
    }
  }
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  if (!req.headers.applicationid) {
    return next(
      new ErrorResponse(`Please provide header data applicationid`, 400)
    );
  }
  if (!req.headers.businessrole) {
    return next(
      new ErrorResponse(`Please provide header data businessrole`, 400)
    );
  }
  if (!req.headers.mode) {
    return next(new ErrorResponse(`Please provide header data mode`, 400));
  }
  if (req.headers.mode != "File") {
    if (req.headers.mode != "Record") {
      if (req.headers.mode != "RecordItems") {
        return next(
          new ErrorResponse(`mode should be File or Record or RecordItems`, 400)
        );
      }
    }
  }
  let version = 1;

  if (req.headers.type == "NewVersion") {
    version = req.headers.version + 1;
  }
  let statuses = [];
  console.log(req.body.text);
  rg01 = req.body.text.split(",");
  st1 = {};
  st1["title"] = rg01[0];
  st1["text"] = rg01[1];
  st1["state"] = rg01[2];
  statuses.push(st1);

  // let statuses = [
  //   {
  //     title: "Status",
  //     text: "Approved",
  //     state: "Success",
  //   },
  //   {
  //     title: "DocumentType",
  //     text: "Attachment",
  //     state: "None",
  //   },
  // ];
  /////////////////////////////////////////////////////////////////////////
  //   --------  App Data  -------------------
  /////////////////////////////////////////////////////////////////////////
  /// App Details
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  var cardConfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  if (req.headers.mode == "File") {
    let Multiattachment = false;
    for (let index = 0; index < cardConfig["Tabs"].length; index++) {
      const element = cardConfig["Tabs"][index];
      if (element["type"] == "MultiAttachments") {
        Multiattachment = true;
      }
    }
    if (!Multiattachment) {
      return next(
        new ErrorResponse(
          `Attachment setup missing for App :  ${req.headers.applicationid}`,
          400
        )
      );
    }
  }
  if (req.headers.mode == "Record" && cardConfig["Create"] == "No") {
    return next(
      new ErrorResponse(`App do not allow to upload or create new record`, 400)
    );
  }

  console.log("All validations passed");

  let mydata = {};
  let outdata = [];
  let myitem = {};
  let outItem = [];
  counter = Math.floor(10000 + Math.random() * 90000);

  //file.name = "abc.csv";
  file.name = `file_${req.user.id}${counter}${path.parse(file.name).ext}`;
  const filecsvFilePath = "./public/uploadFiles/" + file.name;
  const outFileName = "uploadFiles/" + file.name;
  file.mv(`${process.env.DATA_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    if (req.headers.mode == "Record") {
      csvToJson.fieldDelimiter(",").getJsonFromCsv(filecsvFilePath);
      let json_header = csvToJson.getJsonFromCsv(filecsvFilePath);
      for (let index = 0; index < json_header.length; index++) {
        for (const key in json_header[index]) {
          cardConfig["FieldDef"].forEach((element1) => {
            if (element1["SLabel"].replace(/\s/g, "") == key) {
              mydata[element1["name"]] = json_header[index][key];
            }
          });
        }
        mydata.appId = BodyApp.id;
        mydata.applicationId = BodyApp.applicationID;
        mydata.user = req.user.id;
        mydata.userName = req.user.name;
        mydata.userEmail = req.user.email;
        mydata.company = req.user.company;
        mydata.branch = req.user.branch;
        mydata.area = req.user.area;
        outdata.push(mydata);
        mydata = {};
      }
      result = await createMultipleDocument(req.headers.applicationid, outdata);
      if (!result) {
        return next(new ErrorResponse(`Problem with the file data`), 404);
      }

      res.status(200).json({
        success: true,
        fileName: outFileName,
        fileType: file.mimetype,
        data: result,
      });
    }
    res.status(200).json({
      success: true,
      fileName: outFileName,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: req.user.name,
      version: version,
      statuses: statuses,
    });
  });
});
