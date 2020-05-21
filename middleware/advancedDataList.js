const advancedDataList = (model, AppID, populate) => async (req, res, next) => {
  // Read New Configuration from File......
  const App = require("../models/appSetup/App");
  let app = await App.findOne({ applicationID: AppID });
  //var button = require("../bot/Supplier_button.json");

  const newConfig =
    "../NewConfig/" + AppID + "_" + req.headers.businessrole + "_config.json";
  var config1 = require(newConfig);
  let config = {};
  fl1 = {};
  fl2 = [];
  lf = [];
  if (req.headers.mode == "BOTList") {
    config1["ListBOTFields"]["Title"].forEach((element1) => {
      lf.push(element1);
    });
    config1["ListBOTFields"]["SubTitle"].forEach((element1) => {
      lf.push(element1);
    });
    config1["ListBOTFields"]["Description"].forEach((element1) => {
      lf.push(element1);
    });
  }
  switch (req.headers.mode) {
    case "BOTList":
      config1["FieldDef"].forEach((element) => {
        lf.forEach((element2) => {
          if (element["name"] == element2) {
            fl1["name"] = element["name"];
            fl1["SLabel"] = element["SLabel"];
            fl2.push({ ...fl1 });
            fl1 = {};
          }
        });
      });
      config["Title"] = config1["Title"];
      config["ListBOTFields"] = config1["ListBOTFields"];
      config["FieldDef"] = fl2;
      // config["Buttons"] = button[AppID];
      break;

    case "BOTDetail":
      config["Title"] = config1["Title"];
      config["Tabs"] = config1["Tabs"];
      config["DetailFields"] = config1["DetailFields"];
      config["FieldDef"] = fl2;
      break;
    default:
      config = config1;
  }

  let query;
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = model.find(JSON.parse(queryStr));
  if (req.headers.mode == "BOTList") {
    const fields = lf.join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  let results = await query;

  if (req.body.ItemFilter) {
    // console.log("ItemFilter", req.body.ItemFilter);
    for (let index = 0; index < req.body.ItemFilter.length; index++) {
      const element = req.body.ItemFilter[index]["field"];

      for (const kk in results.ItemData) {
        if (results.ItemData.hasOwnProperty(kk)) {
          const ee = results.ItemData[kk];
          console.log(ee);
        }
      }
      console.log(element);
    }
  }
  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedDataList = {
    success: true,
    count: results.length,
    pagination,
    data: results,
    cardImage: app["photo"],
    config: config,
  };

  next();
};

module.exports = advancedDataList;
