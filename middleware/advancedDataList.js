const advancedDataList = (model, AppID, populate) => async (req, res, next) => {
  console.log("AppID is:", AppID);
  console.log("BusinessRole:", req.headers.businessrole);

  // Read New Configuration from File......

  const newConfig =
    "../NewConfig/" + AppID + "_" + req.headers.businessrole + "_config.json";
  var config = require(newConfig);

  /*   // Read List screen Configuration from File......
  const AppRole =
    "../applicationJSON/" + AppID + "_" + req.headers.businessrole + "_LS.json";

  const LS = require(AppRole);
  try {
    for (let p1 in LS) {
      ListField2 = LS[p1];
    }
  } catch (error) {
    return next(new ErrorResponse(`ListScreen Config Missing`, 400));
  } */

  /* // Read Old Config File...
  var filepath =
    "../JSONOUT/" + AppID + "_" + req.headers.businessrole + "_config.json";
  console.log("FilePath:", filepath);
  var config = require(filepath);

  var TitleOut = { ApplicationTitle: "", DetailTitle: "" };

  const Title = config["Title"];
  const DetailScreen = config["DetailScreen"];

  const Tab = config["DetailPageControl"]["TabDetails"][0];
  const FieldDefinition = config["FieldDefinition"];
  console.log("FieldDefinition", FieldDefinition);
  i = 0;
  for (let propl in Title) {
    if (i == 0) {
      TitleOut.ApplicationTitle = Title[propl];
    }
    if (i == 1) {
      TitleOut.DetailTitle = Title[propl];
    }
    i = i + 1;
  }
  Tab1 = Tab[0];
  console.log("Tab1", Tab1);
  lTab = [];
  for (let px in Tab) {
    lTab.push(Tab[px].value);
  }

  TabArr = [];

  Tab1 = [];
  Tab2 = [];
  Tab3 = [];
  Tab4 = [];
  Tab5 = [];
  Tab6 = [];
  Tab7 = [];
  Tab8 = [];
  Tab9 = [];
  None = [];

  for (let ix in DetailScreen) {
    for (let py in DetailScreen[ix]) {
      console.log(DetailScreen[ix][py]);
      if (DetailScreen[ix][py].Tab == "None") {
        None.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab1") {
        Tab1.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab2") {
        Tab2.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab3") {
        Tab3.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab4") {
        Tab4.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab5") {
        Tab5.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab6") {
        Tab6.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab7") {
        Tab7.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab8") {
        Tab8.push(DetailScreen[ix][py].name);
      }

      if (DetailScreen[ix][py].Tab == "Tab9") {
        Tab9.push(DetailScreen[ix][py].name);
      }
    }
  }
  TabNone = {};
  TabTab1 = {};
  TabTab2 = {};
  TabTab3 = {};
  TabTab4 = {};
  TabTab5 = {};
  TabTab6 = {};
  TabTab7 = {};
  TabTab8 = {};
  TabTab9 = {};

  console.log(Tab1);
  if (None.length > 0) {
    TabNone.None = None;
    TabArr.push(TabNone);
  }
  if (Tab1.length > 0) {
    TabTab1.Tab1 = Tab1;
    TabArr.push(TabTab1);
  }
  if (Tab2.length > 0) {
    TabTab2.Tab2 = Tab2;
    TabArr.push(TabTab2);
  }
  if (Tab3.length > 0) {
    TabTab3.Tab3 = Tab3;
    TabArr.push(TabTab3);
  }
  if (Tab4.length > 0) {
    TabTab4.Tab4 = Tab4;
    TabArr.push(TabTab4);
  }
  if (Tab5.length > 0) {
    TabTab5.Tab5 = Tab5;
    TabArr.push(TabTab5);
  }
  if (Tab6.length > 0) {
    TabTab6.Tab6 = Tab6;
    TabArr.push(TabTab6);
  }
  if (Tab7.length > 0) {
    TabTab7.Tab7 = Tab7;
    TabArr.push(TabTab7);
  }
  if (Tab8.length > 0) {
    TabTab8.Tab8 = Tab8;
    TabArr.push(TabTab8);
  }
  if (Tab9.length > 0) {
    TabTab9.Tab9 = Tab9;
    TabArr.push(TabTab9);
  }

  console.log(TabArr); */
  /*   config = {};
  config.Title = TitleOut;
  config.ListFields = ListField2;
  config.MButtons = [];
  config.DButtons = [];
  config.Tabs = Tab;
  config.DetailFields = TabArr; */

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

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
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
