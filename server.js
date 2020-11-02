const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
//  -------------------------------------------------
//  ----------  ***** BUSINESS USERS *****  ---------
//  -------------------------------------------------
//Users and Authorizations
app.use("/api/v1/auth", require("./routes/access/auth"));
app.use("/api/v1/users", require("./routes/access/users"));
app.use("/api/v1/socialmedia", require("./routes/access/socialmedia"));
app.use("/api/v1/agent", require("./routes/access/agent"));
app.use(
  "/api/v1/socialmediacheck",
  require("./routes/access/socialmediacheck")
);
app.use("/api/v1/socialmediacards", require("./routes/bot/cardsSocialmedia"));
app.use("/api/v1/auth/checkbotpin", require("./routes/access/checkBotPin"));
app.use("/api/v1/botoptions", require("./routes/smartApp/botOptions"));
app.use("/api/v1/util/botgroups", require("./routes/utilities/botGroup"));
app.use("/api/v1/util/botbuttons", require("./routes/utilities/botButtons"));
app.use(
  "/api/v1/util/googleplaceaddress",
  require("./routes/utilities/googlePlaceAddress")
);
app.use("/api/v1/util/geturl", require("./routes/utilities/getURL"));

//  ----------------------------------------------------------
//  ----------  ***** ORGNIZATION SETUP DATA *****  ----------
//  ----------------------------------------------------------
// Setup Company
app.use("/api/v1/companies", require("./routes/orgSetup/companies"));
// Setup Branch
app.use("/api/v1/branches", require("./routes/orgSetup/branches"));
// Setup Company / Branches
app.use(
  "/api/v1/companybranches",
  require("./routes/orgSetup/companybranches")
);
/////////
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
/////////
// Setup Area
app.use("/api/v1/areas", require("./routes/orgSetup/areas"));
// Setup Company / Area
//???????????????

//  --------------------------------------------------
//  ----------  ***** APP SETUP DATA *****  ----------
//  --------------------------------------------------
//App Setup
app.use("/api/v1/apps", require("./routes/appSetup/apps"));
app.use("/api/v1/numberRange", require("./routes/appSetup/NumberRange"));
// Roles
app.use("/api/v1/roles", require("./routes/appSetup/roles"));
// App and Roles
app.use("/api/v1/approles", require("./routes/appSetup/approles"));
// Users >> Roles >> Apps
app.use("/api/v1/userapps", require("./routes/appSetup/userapps"));

//  -------------------------------------------------
//  ----------  ***** BUSINESS DATA *****  ----------
//  -------------------------------------------------
// Listing of Data Records with Config Data
app.use("/api/v1/test", require("./routes/smartApp/test"));
app.use("/api/v1/vision", require("./routes/smartApp/visionAPI"));
app.use("/api/v1/deletedata", require("./routes/smartApp/deleteRecord"));
app.use("/api/v1/deleteall", require("./routes/smartApp/deleteAll"));
app.use("/api/v1/listrecords", require("./routes/smartApp/listrecords"));
app.use("/api/v1/listrecordsnew", require("./routes/smartApp/listrecordsnew"));
// Create a new Record
app.use("/api/v1/datarecords", require("./routes/smartApp/datarecords"));
app.use("/api/v1/filterdata", require("./routes/smartApp/filterData"));

app.use("/api/v1/createwithref", require("./routes/smartApp/createwithref"));
//app.use("/api/v1/addwithref", require("./routes/smartApp/addwithref"));
// Route to get the Overview Cards (a Seperate Tile for every role)
app.use("/api/v1/cards", require("./routes/smartApp/overviewcard"));
app.use("/api/v1/cardsNew", require("./routes/smartApp/overviewcardNew"));
// Route to get the cards for application Tab (only one tab can have cards)
app.use("/api/v1/detailcards/", require("./routes/smartApp/detailcards"));
// Route to get the cards for application Tab (only one tab can have cards)

app.use("/api/v1/generatePDF/", require("./routes/utilities/generatePDF"));

app.use(
  "/api/v1/uploadHeaderFile/",
  require("./routes/smartApp/uploadHeaderFile")
);
app.use("/api/v1/uploadFile/", require("./routes/utilities/fileuploadonly"));
app.use(
  "/api/v1/emailAttachment/",
  require("./routes/utilities/emailAttachment")
);
app.use("/api/v1/scan-email/", require("./routes/utilities/scanEmail"));
app.use(
  "/api/v1/uploadHeaderItemFile/",
  require("./routes/smartApp/uploadHeaderItemFile")
);
app.use("/api/v1/detaillist/", require("./routes/smartApp/detaillist"));
app.use("/api/v1/dataFilter/", require("./routes/smartApp/dataFilters"));
app.use("/api/v1/dummyUpload/", require("./routes/utilities/dummyUpload"));

//  -------------------------------------------------
//  ----------  ***** UTILITIES *****  ----------
//  -------------------------------------------------
// Route to get the Overview Cards (a Seperate Tile for every role)
app.use("/api/v1/util/encode", require("./routes/utilities/utilities"));
app.use("/api/v1/util/calculation", require("./routes/utilities/calculation"));
app.use("/api/v1/util/validations", require("./routes/utilities/validations"));
app.use(
  "/api/v1/util/validateAppSetup",
  require("./routes/utilities/validateAppSetup")
);
app.use(
  "/api/v1/util/validateAppSetup2",
  require("./routes/utilities/validateAppSetup2")
);
app.use(
  "/api/v1/smartApp/appointmentsGet",
  require("./routes/smartApp/appointmentsGet")
);
app.use(
  "/api/v1/smartApp/tilecountGet",
  require("./routes/smartApp/tilecountGet")
);
app.use("/api/v1/util/getjsonFile/", require("./routes/utilities/getjsonFile"));
app.use("/api/v1/util/possval", require("./routes/utilities/possVals"));
app.use("/api/v1/util/fileupload/", require("./routes/utilities/fileupload"));
app.use(
  "/api/v1/createAdaptive/",
  require("./routes/smartApp/createAdaptiveCard")
);
app.use(
  "/api/v1/util/messengerNotify/",
  require("./routes/utilities/messengerNotify")
);
app.use(
  "/api/v1/util/oneDriveUpload/",
  require("./routes/utilities/oneDriveUpload")
);
app.use(
  "/api/v1/util/assignCourseUser/",
  require("./routes/utilities/assignCourseUser")
);
app.use(
  "/api/v1/util/createInvoice/",
  require("./routes/utilities/createInvoice")
);
app.use(
  "/api/v1/util/assignCourseRole/",
  require("./routes/utilities/assignCourseRole")
);

app.use("/api/v1/util/copyCourse/", require("./routes/utilities/copyCourse"));
app.use(
  "/api/v1/util/addCourseCatalog/",
  require("./routes/utilities/addCourseCatalog")
);
app.use(
  "/api/v1/util/getQuestioner/",
  require("./routes/utilities/getQuestioner")
);

app.use(
  "/api/v1/smartApp/calendarData/",
  require("./routes/smartApp/calendarData")
);
app.use("/api/v1/util/addTraining/", require("./routes/utilities/addTraining"));
app.use("/api/v1/util/addHCP/", require("./routes/utilities/addHCP"));
app.use("/api/v1/sendEmailHtml/", require("./routes/smartApp/sendEmailHtml"));
//app.use("/api/v1/util/createPDF/", require("./routes/utilities/createPDF"));

//  -------------------------------------------------
//  --  ***** UTILITIES / External APIs *****  ------
//  -------------------------------------------------
// https://api.getaddress.io/find/
app.use("/api/v1/util/address", require("./routes/utilities/address"));
// Google Place APIs
app.use(
  "/api/v1/util/placeDetails",
  require("./routes/utilities/placeDetails")
);
app.use("/api/v1/util/placeFind", require("./routes/utilities/placeFind"));
app.use(
  "/api/v1/util/dentalCharting",
  require("./routes/utilities/dentalCharting")
);
app.use(
  "/api/v1/util/nhsfindPatient",
  require("./routes/utilities/nhsfindPatient")
);

//  -------------------------------------------------
//  ----------  ***** IGNORE *****  ---------
//  -------------------------------------------------
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
app.use("/api/v1/courses", require("./routes/courses"));
app.use("/api/v1/reviews", require("./routes/reviews"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
