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
  fileName = "./resources/" + req.headers.filename;
  console.log(req);
  console.log(fileName);

  //Receipt
  //Place
  //PurchaseOrder
  //People
  //Invoice

  const [landmark] = await client.landmarkDetection(fileName);
  const [label] = await client.labelDetection(fileName);
  const [logo] = await client.logoDetection(fileName);
  const [face] = await client.faceDetection(fileName);
  const [text] = await client.textDetection(fileName);
  const [web] = await client.webDetection(fileName);

  console.log(label);
  const labels = label.labelAnnotations;
  console.log("Labels:");
  labels.forEach((label) => console.log(label.description));

  if (text.textAnnotations.length > 0) {
    myText = text.textAnnotations[0]["description"];
    arr1 = myText.split("\n");
  }

  res.status(200).json({
    success: true,
    label: label.labelAnnotations,
    logo: logo.logoAnnotations,
    landmark: landmark.landmarkAnnotations,
    face: face.faceAnnotations,
    text: text.textAnnotations,
    web: web.webAnnotations,
    ocr: arr1,
  });
});
