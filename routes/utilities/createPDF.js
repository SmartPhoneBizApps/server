const express = require("express");
const router = express.Router({ mergeParams: true });
//var fs = require("fs");
//const pdfMake = require("pdfMake");
// Define font files
/* var fonts = {
  Roboto: {
    normal: "fonts/Roboto-Regular.ttf",
    bold: "fonts/Roboto-Medium.ttf",
    italics: "fonts/Roboto-Italic.ttf",
    bolditalics: "fonts/Roboto-MediumItalic.ttf",
  },
};
var PdfPrinter = require("../src/printer");
var printer = new PdfPrinter(fonts);
var fs = require("fs");
*/
router.post("/", (req, res, next) => {
  //   var docDefinition = {
  //     content: [
  //       "First paragraph",
  //       "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
  //     ],
  //   };
  //   var pdfDoc = printer.createPdfKitDocument(docDefinition);
  //   pdfDoc.pipe(fs.createWriteStream("pdfs/basics.pdf"));
  //   pdfDoc.end();
  /*  //console.log(vfsFonts);
  // const pdfMake = require("../../controllers/utilities/pdfmake"); // this points to pdfmake.js in CreatePDF folder
  const vfsFonts = require("../../controllers/utilities/vfs_fonts"); // this points to vfs_fonts.js in CreatePDF folder
  pdfMake.vfs = vfsFonts.pdfMake.vfs;
  let pdfData = {};
  pdfData["CourseID"] = req.body.CourseID;
  pdfData["CourseTitle"] = req.body.CourseTitle;
  pdfData["Overview"] = req.body.Overview;
  pdfData["name"] = req.body.name;
  pdfData["email"] = req.body.email;
  pdfData["ID"] = req.body.ID;
  pdfData["date"] = req.body.date;

  console.log("Course ID : ", pdfData["CourseID"]);
  console.log("Course Title : ", pdfData["CourseTitle"]);
  console.log("Course Overview : ", pdfData["Overview"]);
  console.log("Employee Name : ", pdfData["name"]);
  console.log("Employee Email : ", pdfData["email"]);
  console.log("Execution ID : ", pdfData["ID"]);
  console.log("Completed On : ", pdfData["date"]);

  //res.send('PDF');

  const fname = pdfData["CourseID"];
  const lname = pdfData["CourseTitle"];
  //const imageFromFile= require('../public/images/fish.png');
  // playground requires you to assign document definition to a variable called dd

  var certificate = {
    pageOrientation: "landscape",
    pageSize: "LETTER",
    background: [
      {
        image:
          "data:image/png;base64,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",
        width: 792,
      },
    ],
    content: [
      {
        text: "\nCertificate of Achievement\n",
        style: ["header", "tableExample"],
      },
      {
        text: "Congratulations !!\n\n",

        style: ["header", "tableExample"],
      },
      {
        table: {
          widths: ["*"],
          heights: [200],
          margin: [20, 0, 20, 8],
          alignment: "center",
          body: [
            [
              `\n\nThis is to certify that ${fname} ${lname} has successfully completed XYZ course .\n\n`,
            ], // quotes used here are below ESC key on keypad !!!!!!!
          ],
        },
        layout: "noBorders",
      },
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        justifyContent: "center",
        alignment: "center",
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 14,
      },
      tableExample: {
        margin: [10, 5, 10, 15],
      },
    },
  };

  const pdfDoc = pdfMake.createPdf(certificate);
  pdfDoc.getBase64((data) => {
    res.writeHead(200, {
      "content-Type": "application/pdf",
      "content-Disposition": 'attachment;filename="filename.pdf"',
    });
    const download = Buffer.from(data.toString("utf-8"), "base64");
    res.end(download);
  });
 */
});

module.exports = router;
