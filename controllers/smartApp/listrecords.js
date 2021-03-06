const {
  adaptiveNew,
  analyticalNew,
  countAnalyticalCard,
  sumAnalyticalCard,
  buildAnalyticalCard,
  numericHeader,
} = require("../../modules/moduleCards");
const {
  getPVConfig,
  getPVQuery,

  getInitialValues,
  getDateValues,
  findOneApp,
  cardReplace,
  getNewConfig,
  getPVField,
  getAppRoles,
} = require("../../modules/config");
const {
  readData,
  getTotalCount,
  getButtonData,
} = require("../../modules/config2");
const asyncHandler = require("../../middleware/async");
// @desc      Get all records
// @route     GET /api/v1/listrecords
// @access    Private
exports.getListrecords1 = asyncHandler(async (req, res, next) => {
  outStru = {};
  const applicationId = req.headers.applicationid;
  const businessrole = req.headers.businessrole;
  const mode = req.headers.mode;
  // Read Color Configuration
  let fileNameColor = "../../config/colorConfig.json";
  var colorConfig = require(fileNameColor);

  const application = await findOneApp(applicationId);
  var appconfig = getNewConfig(applicationId, businessrole);

  /// Possible values..
  pvappconfig = getPVConfig(applicationId, businessrole);
  qPV = getPVQuery(applicationId, businessrole, pvappconfig);
  let resPV = await qPV;

  /// Possible values for Status..
  sPV = getPVField(applicationId, "Status");
  let statusPV = await sPV;
  // Initial values
  var ivalue = getInitialValues(applicationId, businessrole, req.user);
  let ival_out = [];
  let ival = {};
  let out = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }
  //// Data Source is JSON Data
  if (req.params.id == "OPENSAP" || req.params.id == "EXTLEARN") {
    outData = {};
    // Read JSON source file
    let results = [];
    let results1 = [];
    let res1 = {};

    let fn = "../../NewConfig/openSAP_courses.json";
    res1 = require(fn);
    results1 = res1["courses"];

    let t_image = [];
    tCount = 0;

    for (let i1 = 0; i1 < results1.length; i1++) {
      let results2 = {};
      tCount = tCount + 1;
      t_image = [];
      results2 = { ...results1[i1] };

      results2["cardImage"] = application["photo"];
      results2["ReferenceID"] = results1[i1].id;
      results2["Group"] = "ExternalCatalog";
      results2["SubGroup"] = "OpenSAP";
      t_image.push(results1[i1]["image"]);
      results2["image"] = t_image;
      t_image = [];
      if (mode == "Web" || mode == "web") {
        if (appconfig["Controls"]["USP"] == "UserProfile") {
          results2["USP_Name"] = "OpenSAP course catalog";
          results2["USP_Role"] = "copyright - SAP®";
          results2["USP_Image"] = process.env.APPURL + "logos/logo_opensap.png";
        }
      }
      results.push(results2);
    }

    const limit = parseInt(req.query.limit, 10) || 100;
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    if (endIndex < tCount) {
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

    oResult = [];
    for (let q = startIndex; q < endIndex; q++) {
      if (results[q] !== undefined) {
        results[q]["cardImage"] =
          "https://images.unsplash.com/photo-1585776462170-f6f0e680e1c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80";
        oResult.push(results[q]);
      }
    }
    outData["success"] = true;
    outData["count"] = tCount;
    outData["pagination"] = pagination;
    outData["data"] = oResult;
    outData["config"] = appconfig;

    if (mode == "Web" || mode == "web") {
      res.status(200).json({
        outData,
        possibleValues: resPV,
        statusValues: statusPV,
        defaultValues: ival_out,
      });
    } else {
      res.status(200).json({
        outData,
      });
    }
  } else {
    //// Data Source is mongoDB....
    // Get Table Schema
    let path = "../../models/smartApp/" + applicationId;
    const model = require(path);
    if (appconfig["itemData"] == "Yes") {
      app2 = applicationId + "_Itm";
      let path2 = "../../models/smartApp/" + app2;
      model2 = require(path2);
    } else {
      model2 = model;
    }
    // Get total Count
    let query_c = getTotalCount(applicationId, req, appconfig);
    let rec = await query_c;
    const count = rec.length;
    let query = readData(applicationId, req, appconfig);
    let results = await query;
    tabObj = {};
    tabArr = [];
    if (appconfig["Controls"]["SearchString"]["Search"] == true) {
      tableString = appconfig["Controls"]["SearchString"]["table"];
      for (const key in tableString) {
        tabObj["table"] = key;
        for (let k = 0; k < tableString[key].length; k++) {
          tabObj["field"] = tableString[key][k];
          tabArr.push({ ...tabObj });
          tabObj = {};
        }
      }
    }
    // If Items are present...
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
        results[i1].cardImage = application["photo"];
        if (mode !== "BOTList") {
          results[i1]["ItemData"] = results2;
        }
        results[i1].cardImage = application["photo"];
        if (mode == "Web" || mode == "web") {
          if (appconfig["Controls"]["USP"] == "UserProfile") {
            results[i1].USP_Name = "Atul Gupta";
            results[i1].USP_Role = businessrole;
            results[i1].USP_Image =
              "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
          }
          if (appconfig["Controls"]["StatusColor"] == "Yes") {
            results[i1].StatusState =
              colorConfig["Status"][results[i1]["Status"]];
          }
        }
      }
      // If Items are NOT present...
    } else {
      for (let i1 = 0; i1 < results.length; i1++) {
        if (results[i1]["ReferenceID"] == undefined) {
          results[i1]["ReferenceID"] = results[i1].ID;
        }
        //   results[i1].cardImage = application["photo"];
        results[i1].cardImage =
          "https://images.unsplash.com/photo-1585776462170-f6f0e680e1c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80";

        if (mode == "") {
          mode = "Web";
        }
        if (mode == "Web" || mode == "web") {
          if (appconfig["Controls"]["USP"] == "UserProfile") {
            results[i1].USP_Name = "Atul Gupta";
            results[i1].USP_Role = businessrole;
            results[i1].USP_Image =
              "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
          }

          if (appconfig["Controls"]["StatusColor"] == "Yes") {
            if (colorConfig["Status"][results[i1]["Status"]] == undefined) {
              results[i1]["StatusState"] = "None";
            } else {
              results[i1]["StatusState"] =
                colorConfig["Status"][results[i1]["Status"]];
            }
          }
          results[i1].SearchString = "";
          for (let l = 0; l < tabArr.length; l++) {
            for (let x = 0; x < results[i1][tabArr[l]["table"]].length; x++) {
              results[i1].SearchString =
                results[i1].SearchString +
                results[i1][tabArr[l]["table"]][x][tabArr[l]["field"]] +
                " ";
            }
          }
        }
      }
    }
    /////////////////////////////////////////////////////////////////
    const limit = parseInt(req.query.limit, 10) || 25;
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Pagination result
    const pagination = {};
    if (endIndex < count) {
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
    oResult = [];
    for (let q = startIndex; q < endIndex; q++) {
      if (results[q] !== undefined) {
        oResult.push(results[q]);
      }
    }
    //let config = nConfig(applicationId, req, appconfig);

    if (mode == "BOTList") {
      // Get list of Roles for the App
      AppRoles = await getAppRoles(applicationId);
      applicationRoles = [];
      for (let k = 0; k < AppRoles.length; k++) {
        applicationRoles.push(AppRoles[k]["role"]);
      }

      for (let w = 0; w < oResult.length; w++) {
        buttonData = getButtonData(
          statusPV,
          applicationId,
          businessrole,
          oResult[w],
          req.user,
          applicationRoles
        );
        let myButton = [];
        if (oResult[w]["Status"] !== undefined) {
          myButton = buttonData[oResult[w]["Status"]];
        }
        if (myButton == undefined) {
          myButton = [];
        }
        oResult[w]["buttons"] = myButton;
      }
    }
    outData = {};
    outData["success"] = true;
    outData["count"] = results.length;
    outData["pagination"] = pagination;
    outData["config"] = appconfig;
    outData["data"] = oResult;
    if (mode == "BOTList") {
      res.status(200).json({
        outData,
        buttons: buttonData,
        defaultValues: ival_out,
      });
    }
    if (mode == "BOTDetail") {
      res.status(200).json({
        outData,
        defaultValues: ival_out,
      });
    }
    if (mode == "Web" || mode == "web") {
      res.status(200).json({
        outData,
        possibleValues: resPV,
        statusValues: statusPV,
        defaultValues: ival_out,
      });
    }
    if (mode == "listcards") {
      for (let w = 0; w < appconfig["MButtons"].length; w++) {
        if (appconfig["MButtons"][w]["type"] == "ADD") {
          aCard = {};
          aCard = await adaptiveNew(
            appconfig,
            resPV,
            ival_out,
            "header",
            appconfig["PossibleValues"],
            "Tab1"
          );
          var cardData = JSON.stringify(aCard);
          cardData = cardReplace({}, cardData, appconfig, "header", "Tab1");
          cardData = cardReplace({}, cardData, appconfig, "header", "Tab1");
          cardData = cardReplace({}, cardData, appconfig, "header", "Tab1");
          aCard = JSON.parse(cardData);
          outStru["ADD01"] = { ...aCard };
        }
      }

      aCard = {};
      aCard = await analyticalNew(appconfig, outData["data"], "SAP");
      outStru["ANA01"] = { ...aCard };

      if (appconfig.hasOwnProperty("listCards")) {
        for (let x = 0; x < appconfig["listCards"].length; x++) {
          myCard = appconfig["listCards"][x];
          aCard = {};
          switch (myCard["Data"]["operation"]) {
            case "COUNT":
              list = await countAnalyticalCard(
                myCard,
                outData["data"],
                "COUNT",
                appconfig["FieldDef"]
              );
              numheader = await numericHeader(myCard, list, "COUNT");
              aCard = await buildAnalyticalCard(
                myCard,
                list,
                numheader,
                "SAP",
                "DCHART-A" + "-" + x
              );
              var cardData = JSON.stringify(aCard);
              cardData = cardReplace(
                myCard,
                cardData,
                appconfig,
                "header",
                "Tab1"
              );
              aCard = JSON.parse(cardData);
              outStru["ANAX" + x] = { ...aCard };
              break;
            case "COLLECTIVE_COUNT":
              list = await countAnalyticalCard(
                appconfig["listCards"][x],
                outData["data"],
                "COLLECTIVE_COUNT",
                appconfig["FieldDef"],
                "SAP",
                req
              );
              numheader = await numericHeader(myCard, list, "COLLECTIVE");
              aCard = await buildAnalyticalCard(
                myCard,
                list,
                numheader,
                "SAP",
                "DCHART-A" + "-" + x
              );
              var cardData = JSON.stringify(aCard);
              cardData = cardReplace(
                myCard,
                cardData,
                appconfig,
                "header",
                "Tab1"
              );
              aCard = JSON.parse(cardData);
              outStru["ANAL" + x] = { ...aCard };
              break;
            case "SUM":
              list = await sumAnalyticalCard(
                appconfig["listCards"][x],
                outData["data"]
              );
              break;

            default:
              list = await countAnalyticalCard(
                myCard,
                outData["data"],
                "COUNT",
                appconfig["FieldDef"]
              );
              numheader = await numericHeader(myCard, list, "COUNT");
              aCard = await buildAnalyticalCard(
                myCard,
                list,
                numheader,
                "SAP",
                "DCHART-A" + "-" + x
              );
              var cardData = JSON.stringify(aCard);
              cardData = cardReplace(
                myCard,
                cardData,
                appconfig,
                "header",
                "Tab1"
              );
              aCard = JSON.parse(cardData);
              outStru["ANAX" + x] = { ...aCard };
              break;
          }
        }
      }
      res.status(200).json({
        outData,
        possibleValues: resPV,
        defaultValues: ival_out,
        statusValues: statusPV,
        listCards: outStru,
      });
    }
  }
});
