const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { getNewConfig } = require("../modules/config");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const csv = require("csvtojson");
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
  header.mv(`${process.env.DATA_UPLOAD_PATH}/${header.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    //output_header = await csv2json(headercsvFilePath);
    csv()
      .fromFile(headercsvFilePath)
      .then((jsonObj) => {
        data = jsonObj;
        console.log("AG", data);
        // Read New Config File
        mydata = {};
        outdata = [];

        if (req.headers.mode == "Header") {
          for (let index = 0; index < data.length; index++) {
            console.log("AG1", data[index]);
            for (const key in data[index]) {
              // const element = data[index][key];
              //  console.log(key);
              cardConfig["FieldDef"].forEach((element1) => {
                if (element1["SLabel"] == key) {
                  mydata[element1["name"]] = data[index][key];
                }
              });
            }
            outdata.push(mydata);
            mydata = {};
          }
        }
        if (req.headers.mode == "ItemData") {
          for (let index = 0; index < data.length; index++) {
            console.log("AG1", data[index]);
            for (const key in data[index]) {
              // const element = data[index][key];
              //  console.log(key);
              cardConfig["itemConfig"]["ItemFieldDefinition"].forEach(
                (element1) => {
                  if (element1["SLabel"] == key) {
                    mydata[element1["name"]] = data[index][key];
                  }
                }
              );
            }
            outdata.push(mydata);
            mydata = {};
          }
        }

        console.log("MyData", outdata);

        /*         for (const key in data["data"]) {
          //---------------------------
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
        } */

        res.status(200).json({
          success: true,
          file: header.name,
          data: outdata,
        });
      });
  });
});
