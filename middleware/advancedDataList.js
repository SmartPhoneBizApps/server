const {
  getNewConfig,
  getBotListFields,
  findOneApp,
} = require("../modules/config");

const advancedDataList = (model, model2, AppID, populate) => async (
  req,
  res,
  next
) => {
  let config = {};
  fl1 = {};
  fl2 = [];

  const app = await findOneApp(AppID);
  // Read New Config File
  var config1 = getNewConfig(AppID, req.headers.businessrole);

  if (req.headers.mode == "BOTList") {
    let lf = getBotListFields(config1);
  }

  // check the Mode
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
      config["ListBOTItemFields"] = config1["itemConfig"]["ListBOTItemFields"];
      config["FieldDef"] = fl2;
      break;

    case "BOTDetail":
      config["Title"] = config1["Title"];
      config["Tabs"] = config1["Tabs"];
      config["DetailFields"] = config1["DetailFields"];
      config["ListBOTItemFields"] = config1["itemConfig"]["ListBOTItemFields"];
      config["FieldDef"] = fl2;
      break;
    default:
      config = config1;
  }

  let query;
  const reqQuery1 = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((param) => delete reqQuery1[param]);
  reqQuery2 = {};
  reqQuery = {};
  /////////////////////////////////////////////////////////////////
  /// Split Header and Item Queries
  rn = {};
  for (const key in reqQuery1) {
    var n = key.includes("ItemData");
    if ((n == true) & (model !== model2)) {
      const fList = key.split("_");
      reqQuery2[fList[1]] = reqQuery1[key];

      var r1 = reqQuery1[key].includes("ne"); // Add the logic for gt, lt etc...
      if (r1 == true) {
        rg01 = reqQuery1[key].split("|");
        rn[rg01[0]] = rg01[1];
        reqQuery2[fList[1]] = rn;
      }
    } else {
      reqQuery[key] = reqQuery1[key];
    }
  }

  /////////////////////////////////////////////////////////////////
  // Create query string (Header)
  let queryStr = JSON.stringify(reqQuery);
  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  /////////////////////////////////////////////////////////////////
  // Finding resource
  query = model.find(JSON.parse(queryStr));
  if (req.headers.mode == "BOTList") {
    const fields = lf.join(" ");
    query = query.select(fields);
  }
  /////////////////////////////////////////////////////////////////
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  /////////////////////////////////////////////////////////////////
  const limit = parseInt(req.query.limit, 10) || 25;
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  //const total = await model.countDocuments();
  query2 = query;
  let result2 = await query2;

  const total = result2.length;
  query = query.skip(startIndex).limit(limit);
  if (populate) {
    query = query.populate(populate);
  }
  /////////////////////////////////////////////////////////////////
  // Executing query
  let results = await query;

  rag = [];
  for (let a = 0; a < results.length; a++) {
    const el1 = results[a];
    // console.log("el1", el1);
    for (const key in el1) {
      //   console.log("key", key);
      const el2 = results[a][key];
      for (let b = 0; b < config1.FieldDef.length; b++) {
        const cl1 = config1.FieldDef[b];
        if ((cl1["type"] == "Date") & (cl1["name"] == key)) {
          rag = results[a][key].toString().split(" ");
          ndt = rag[0] + " " + rag[1] + " " + rag[2] + " " + rag[3];
          console.log(ndt);
          var d = new Date();
          var n = d.toLocaleDateString();
          console.log(typeof results[a][key]);
          console.log(n);
          // results[a][key].toLocaleDateString();
          results[a][key] = n + " ";
          console.log(results[a][key]);
          console.log("----------");
          break;
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////
  if (model2 !== model) {
    // Create query string (Item)
    for (let i1 = 0; i1 < results.length; i1++) {
      let results2 = [];
      reqQuery2["ID"] = results[i1]["ID"];
      let queryStr2 = JSON.stringify(reqQuery2);

      // let queryStr2 = reqQuery2;
      // Create operators ($gt, $gte, etc)
      queryStr2 = queryStr2.replace(
        /\b(gt|gte|lt|lte|in|ne)\b/g,
        (match) => `$${match}`
      );
      query2 = model2.find(JSON.parse(queryStr2));
      results2 = await query2;
      results[i1].cardImage = app["photo"];
      if (req.headers.mode !== "BOTList") {
        results[i1]["ItemData"] = results2;
      }
    }
  } else {
    for (let i1 = 0; i1 < results.length; i1++) {
      results[i1].cardImage = app["photo"];
      if (req.headers.mode == "Web" || req.headers.mode == "web") {
        if (config["Controls"]["USP"] == "UserProfile") {
          results[i1].USP_Name = "Atul Gupta";
          results[i1].USP_Role = req.headers.businessrole;
          results[i1].USP_Image =
            "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
        }
      }

      /*       console.log(results[i1].carouselImage);
      if (
        results[i1].MultiAttachments &
        (results[i1].MultiAttachments.length > 0)
      ) {
        console.log("MultiAttachments");
        tr1 = [];
        to1 = "";
        for (
          let index = 0;
          index < results[i1].MultiAttachments.length;
          index++
        ) {
          to1 =
            config["Controls"]["AttachmentURL"] +
            results[i1].MultiAttachments[index];
          tr1.push(to1);
        }
        results[i1].MultiAttachments[index] = { ...tr1 };
        tr1 = [];
      }*/
      /*       console.log(results[i1]);
      results[i1].carouselImage.forEach((element) => {
        console.log("AG", element);
      }); */

      /*       if (results[i1].carouselImage) {
        for (let index = 0; index < results[i1].carouselImage.length; index++) {
          const element = results[i1].carouselImage[index];
          results[i1].carouselImage[index] =
            config["Controls"]["AttachmentURL"] +
            results[i1].carouselImage[index];
        }
      } */
    }
  }

  /////////////////////////////////////////////////////////////////
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
    // cardImage: app["photo"],
    config: config,
  };

  next();
};

module.exports = advancedDataList;
