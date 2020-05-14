const advancedDataList = (model, AppID, populate) => async (req, res, next) => {
  console.log("AppID is:", AppID);
  console.log("BusinessRole:", req.headers.businessrole);

  // Read New Configuration from File......

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

  console.log(config1);
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

      config["ListBOTFields"] = config1["ListBOTFields"];
      config["FieldDef"] = fl2;
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

  /*   // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  } */

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
  const results = await query;

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
    config: config,
  };

  next();
};

module.exports = advancedDataList;
