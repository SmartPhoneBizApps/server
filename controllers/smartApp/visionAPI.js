const asyncHandler = require("../../middleware/async");
const fs = require("fs");
var base64ToImage = require("base64-to-image");
const { checkFile } = require("../../modules/config");
const {
  aggregateCount,
  aggregateSum,
  tileCount,
} = require("../../modules/config2");
exports.visionAPI = asyncHandler(async (req, res, next) => {
  mout = [];
  let googleAPIFile = "./config/apikey.json";
  // var googleAPI = require(googleAPIFile);

  // Imports the Google Cloud client library
  const vision = require("@google-cloud/vision");

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: googleAPIFile,
  });
  // const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file..
  fileName = "./public/uploadFiles/" + req.headers.filename;
  landmark = {};
  label = {};
  face = {};
  logo = {};
  text = {};

  if (req.headers.imagetype == "Place") {
    [landmark] = await client.landmarkDetection(fileName);
    [label] = await client.labelDetection(fileName);
  }
  //People
  if (req.headers.imagetype == "People") {
    [face] = await client.faceDetection(fileName);
    [label] = await client.labelDetection(fileName);
  }
  //logo
  if (req.headers.imagetype == "Logo") {
    [logo] = await client.logoDetection(fileName);
    [label] = await client.labelDetection(fileName);
  }
  //Invoice
  //Bill
  //PurchaseOrder
  //PO
  //Receipt
  if (
    req.headers.imagetype == "Invoice" ||
    req.headers.imagetype == "Bill" ||
    req.headers.imagetype == "PurchaseOrder" ||
    req.headers.imagetype == "PO" ||
    req.headers.imagetype == "Receipt"
  ) {
    const [text] = await client.textDetection(fileName);
    //  console.log("Text :", text["description"], text["boundingPoly"]);
    if (text.textAnnotations.length > 0) {
      TR = 0;
      BL = 0;
      BR = 0;
      textArray = [];

      // Get Description....
      myText = text.textAnnotations[0]["description"];
      textArray = myText.split("\n");

      // Collect Rows
      var row = new Set();
      for (let d = 0; d < text.textAnnotations.length; d++) {
        row.add(text.textAnnotations[d]["boundingPoly"]["vertices"][0]["y"]);
      }

      myRows = [];
      Row = {};
      Row["row"] = 0;
      Row["y"] = 0;
      lineNumber = 0;

      // Identify Rows...
      row.forEach((val) => {
        if (val - Row["y"] > 3) {
          lineNumber = lineNumber + 1;
          Row["row"] = lineNumber;
        }
        Row["y"] = val;
        myRows.push({ ...Row });
      });

      nRow = {};
      myRows2 = [];
      X2 = 0;
      R1 = 0;
      col = 1;
      console.log(myRows);
      console.log("--------------------------");
      for (let d = 0; d < text.textAnnotations.length; d++) {
        if (d != 0) {
          lst = text.textAnnotations[d];
          nRow["description"] = lst["description"];
          for (let j = 0; j < myRows.length; j++) {
            if (lst["boundingPoly"]["vertices"][0]["y"] == myRows[j]["y"]) {
              nRow["row"] = myRows[j]["row"];
              nRow["y"] = myRows[j]["y"];

              if (nRow["row"] != R1) {
                nRow["diff"] = 0;
                col = 1;
                nRow["col"] = 1;
                R1 = nRow["row"];
              } else {
                nRow["diff"] = lst["boundingPoly"]["vertices"][0]["x"] - X2;
                if (nRow["diff"] > 8) {
                  col = col + 1;
                }
                nRow["col"] = col;
              }
              nRow["x1"] = lst["boundingPoly"]["vertices"][0]["x"];
              nRow["x2"] = lst["boundingPoly"]["vertices"][1]["x"];
              nRow["w"] = nRow["x2"] - nRow["x1"];
              X2 = nRow["x2"];
              console.log(
                "description",
                nRow["description"],
                "row",
                nRow["row"],
                "col",
                nRow["col"],
                "diff",
                nRow["diff"],
                "X2",
                X2,
                "y",
                nRow["y"],
                "x1",
                nRow["x1"],
                "x2",
                nRow["x2"],
                "w",
                nRow["w"]
              );
            }
          }
          myRows2.push({ ...nRow });
          nRow = {};
        }
      }
      counter = 0;

      for (let j = 1; j < lineNumber + 1; j++) {
        mString = [];
        mRow = {};
        col = 0;
        for (let f = 0; f < myRows2.length; f++) {
          if (myRows2[f]["row"] == j) {
            if (col != myRows2[f]["col"]) {
              col = col + 1;
              mRow[col] = myRows2[f]["description"];
            } else {
              mRow[col] = mRow[col] + " " + myRows2[f]["description"];
            }
            mRow["row"] = myRows2[f]["row"];
            mString.push(myRows2[f]["description"]);
          }
        }
        mRow["description"] = mString;
        mout.push({ ...mRow });
        mRow = {};
      }
    }
  }
  //-----------------------------------------
  //                   OCR
  //-----------------------------------------

  res.status(200).json({
    success: true,
    label: label.labelAnnotations,
    logo: logo.logoAnnotations,
    landmark: landmark.landmarkAnnotations,
    face: face.faceAnnotations,
    text: text.textAnnotations,
    // web: web.webAnnotations,
    ocr: mout,
  });
});
