const {
  donutCard,
  donutCardHead,
  lineCard,
  stackedcolumnCard,
  tableCard,
  globalCard,
  exampleCard,
  adaptivecardCard,
  getCardKey,
  cardReplace,
  analyticalCard,
  listCard,
  adaptivetableCard,
} = require("../../modules/config2");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
  getNewConfig,
  getPVField,
} = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
const asyncHandler = require("../../middleware/async");
// @desc      Get all records
// @route     GET /api/v1/listrecords
// @access    Private
exports.listrecordsnew = asyncHandler(async (req, res, next) => {
  outStru = {};
  const applicationId = req.params.app;
  const businessrole = req.params.businessrole;
  const mode = req.params.mode;
  // Read Color Configuration
  let fileNameColor = "../../config/colorConfig.json";
  var colorConfig = require(fileNameColor);

  const application = await findOneApp(applicationId);
  var appconfig = getNewConfig(applicationId, businessrole);
  let path = "../../models/smartApp/" + applicationId;
  const model = require(path);
  if (appconfig["itemData"] == "Yes") {
    app2 = applicationId + "_Itm";
    let path2 = "../../models/smartApp/" + app2;
    model2 = require(path2);
  } else {
    model2 = model;
  }
  let query_c = getTotalCount(applicationId, req, appconfig);
  let rec = await query_c;
  const count = rec.length;
  let query = readData(applicationId, req, appconfig);
  let results = await query;
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
      results[i1].cardImage = application["photo"];
      if (mode !== "BOTList") {
        results[i1]["ItemData"] = results2;
      }
    }
  } else {
    for (let i1 = 0; i1 < results.length; i1++) {
      results[i1].cardImage = application["photo"];

      if (mode == "") {
        mode = "Web";
      }
      if (mode == "Web" || mode == "web") {
        if (config1["Controls"]["USP"] == "UserProfile") {
          results[i1].USP_Name = "Atul Gupta";
          results[i1].USP_Role = businessrole;
          results[i1].USP_Image =
            "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
        }

        if (config1["Controls"]["StatusColor"] == "Yes") {
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
  let config = nConfig(applicationId, req, appconfig);
  var ivalue = getInitialValues(applicationId, businessrole, req.user);
  ival_out = [];
  ival = {};
  out = {};

  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }
  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  pvappconfig = getPVConfig(applicationId, businessrole);
  qPV = getPVQuery(applicationId, businessrole, pvappconfig);
  let resPV = await qPV;
  /// Possible values for Status..
  sPV = getPVField(applicationId, "Status");
  let statusPV = await sPV;

  if (mode == "BOTList") {
    if (applicationId == "SUPP00018" || applicationId == "SUPP00028") {
      for (let w = 0; w < oResult.length; w++) {
        buttonData = getButtonData(
          resPV,
          applicationId,
          businessrole,
          oResult[w],
          req.user
        );
        let myButton = [];
        if (oResult[w].hasOwnProperty("CurrentStatus")) {
          myButton = buttonData[oResult[w]["CurrentStatus"]];
        }
        if (myButton == undefined) {
          myButton = [];
        }
        oResult[w]["buttons"] = myButton;
      }
    } else {
      for (let w = 0; w < oResult.length; w++) {
        console.log("AG", oResult[w]);
        buttonData = getButtonData(
          statusPV,
          applicationId,
          businessrole,
          oResult[w],
          req.user
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
  }
  outData = {};
  outData["success"] = true;
  outData["count"] = results.length;
  outData["pagination"] = pagination;
  outData["data"] = oResult;
  outData["config"] = appconfig;

  if (mode == "BOTList") {
    buttonData = getButtonData(resPV, applicationId, businessrole);
  }
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
    console.log("mode", mode);
    let lCards = [];
    if (appconfig.hasOwnProperty("listCards")) {
      var mycard = appconfig["listCards"];
      for (let k = 0; k < mycard.length; k++) {
        counter = counter + 1;
        let cardKey = getCardKey(applicationId, businessrole, counter, "L");
        let cardConfigFile1 = "../../cards/cardConfig/" + mycard[k]["template"];
        var cardData = JSON.stringify(require(cardConfigFile1));
        cardData = cardReplace(mycard[k], cardData, appconfig);
        var anacardConfig = JSON.parse(cardData);
        switch (mycard[k]["type"]) {
          case "Analytical":
            if (mycard[k]["analyticsCard"]["chartType"] == "donut") {
              jCard1 = {};
              jCard1 = await donutCardHead(mycard[k], appData, anacardConfig);
              outStru[cardKey] = { ...jCard1 };
            }
            break;
          case "Adaptive":
            jCard1 = {};
            jCard1 = await adaptivecardCard(
              applicationId,
              businessrole,
              anacardConfig
            );
            outStru[cardKey] = { ...jCard1 };
            break;
          default:
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
});
