const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  createMultipleDocument,
} = require("../../modules/config");
let csvToJson = require("convert-csv-to-json");
const App = require("../../models/appSetup/App");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.uploadHeaderItemFile = asyncHandler(async (req, res, next) => {
  const header = req.files.header;
  const item = req.files.item;
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!header.mimetype.startsWith("text/csv")) {
    return next(new ErrorResponse(`Please upload an csv file(header)`, 400));
  }
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
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

  let mydata = {};
  let outdata = [];
  let myitem = {};
  let outItem = [];
  header.name = `header_${req.user.id}${path.parse(header.name).ext}`;
  const headercsvFilePath = "./public/uploadFiles/" + header.name;
  header.mv(`${process.env.DATA_UPLOAD_PATH}/${header.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    csvToJson.fieldDelimiter(",").getJsonFromCsv(headercsvFilePath);
    let json_header = csvToJson.getJsonFromCsv(headercsvFilePath);
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

    if (item) {
      if (!item.mimetype.startsWith("text/csv")) {
        return next(new ErrorResponse(`Please upload an csv file(item)`, 400));
      }
      if (item.size > process.env.MAX_FILE_UPLOAD) {
        return next(
          new ErrorResponse(
            `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400
          )
        );
      }
      item.name = `item_${req.user.id}${path.parse(item.name).ext}`;
      const itemcsvFilePath = "./public/uploadFiles/" + item.name;
      item.mv(`${process.env.DATA_UPLOAD_PATH}/${item.name}`, async (err) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        csvToJson.fieldDelimiter(",").getJsonFromCsv(itemcsvFilePath);
        let json_item = csvToJson.getJsonFromCsv(itemcsvFilePath);

        for (let index = 0; index < json_item.length; index++) {
          for (const k2 in json_item[index]) {
            cardConfig["itemConfig"]["ItemFieldDefinition"].forEach(
              (element2) => {
                if (element2["SLabel"].replace(/\s/g, "") == k2) {
                  myitem[element2["name"]] = json_item[index][k2];
                }
              }
            );
          }
          outItem.push(myitem);
          myitem = {};
        }
        finalData = {
          ItemData: [],
        };
        finalOutput = [];
        X1 = {};
        X1 = outdata;
        for (let i1 = 0; i1 < outdata.length; i1++) {
          finalData = {};
          finalData = outdata[i1];
          // to filter Item data.........
          finalData["ItemData"] = outItem.filter(
            (outItem) => outItem.ID == X1[i1]["ID"]
          );
          finalOutput.push(finalData);
        }
        result = await createMultipleDocument(
          req.headers.applicationid,
          finalOutput
        );
        if (outItem) {
          ItmTable = req.headers.applicationid + "_Itm";
          result2 = await createMultipleDocument(ItmTable, outItem);
        }
        res.status(200).json({
          success: true,
          data: finalOutput,
        });
      });
    }
  });
});
