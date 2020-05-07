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

// Mount routers
//Course
app.use("/api/v1/bootcamps", require("./routes/bootcamps"));
app.use("/api/v1/courses", require("./routes/courses"));
app.use("/api/v1/reviews", require("./routes/reviews"));

//Users and Authorizations
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/users", require("./routes/users"));

//Organization Setup
app.use("/api/v1/companies", require("./routes/orgSetup/companies"));
app.use("/api/v1/branches", require("./routes/orgSetup/branches"));
app.use(
  "/api/v1/companybranches",
  require("./routes/orgSetup/companybranches")
);
app.use("/api/v1/areas", require("./routes/orgSetup/areas"));

//App Setup
app.use("/api/v1/apps", require("./routes/appSetup/apps"));
app.use("/api/v1/roles", require("./routes/appSetup/roles"));
app.use("/api/v1/approles", require("./routes/appSetup/approles"));
app.use("/api/v1/userapps", require("./routes/appSetup/userapps"));
app.use("/api/v1/appschema", require("./routes/appSetup/appschema"));
app.use("/api/v1/validationrule", require("./routes/appSetup/validationrules"));

//Business Data (Overview Cards)
app.use("/api/v1/cards", require("./routes/cards/cards"));
app.use("/api/v1/detailcards/", require("./routes/smartApp/detailcards"));
app.use("/api/v1/detaillist/", require("./routes/smartApp/detaillist"));

app.use("/api/v1/smartapps", require("./routes/smartApp/smartapps"));
app.use("/api/v1/datarecords", require("./routes/smartApp/datarecords"));
app.use("/api/v1/listrecords", require("./routes/smartApp/listrecords"));

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
