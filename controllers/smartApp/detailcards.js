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
  analyticalCard,
  listCard,
  adaptivetableCard,
  adaptiveNew,
} = require("../../modules/moduleCards");
const {
  getCard,
  findOneAppDatabyid,
  cardReplace,
  getNewConfig,
  getInitialValues,
  getPVConfig,
  getPVQuery,
  getDateValues,
} = require("../../modules/config");

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  iStatus = 0;
  iMessage = "";

  /// Possible values..
  pvappconfig = getPVConfig(req.params.app, req.params.role);
  qPV = getPVQuery(req.params.app, req.params.role, pvappconfig);
  let resPV = await qPV;

  // Initial values
  var ivalue = getInitialValues(req.params.app, req.params.role, req.user);
  let ival_out = [];
  let ival = {};
  let out = {};
  console.log("A2");
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }

  outStru = {};
  let appData = {};
  if (
    req.params.app !== undefined &&
    req.params.app !== "" &&
    req.params.app !== null
  ) {
    iMessage = "Please provide app ID";
    iStatus = 400;
  }
  if (
    req.params.role !== undefined &&
    req.params.role !== "" &&
    req.params.role !== null
  ) {
    iMessage = "Please provide role";
    iStatus = 400;
  }
  var appconfig = getNewConfig(req.params.app, req.params.role);
  if (
    req.params.record !== undefined &&
    req.params.role !== "" &&
    req.params.role !== null
  ) {
    appData = await findOneAppDatabyid(req.params.record, req.params.app);
    if (appData != undefined) {
      iMessage = "Data found";
      iStatus = 400;
    }
  } else {
    // Get list of records
  }

  // Header Cards...
  counter = 0;
  if (appconfig.hasOwnProperty("cards")) {
    var mycard = appconfig["cards"];

    console.log(mycard);
    for (let k = 0; k < mycard.length; k++) {
      console.log("A3");
      counter = counter + 1;
      let cardKey = getCardKey(req.params.app, req.params.role, counter, "H");
      let cardConfigFile1 = "../../cards/cardConfig/" + mycard[k]["template"];
      var cardData = JSON.stringify(require(cardConfigFile1));
      // replace values
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
            req.params.app,
            req.params.role,
            anacardConfig
          );
          outStru[cardKey] = { ...jCard1 };
          break;
        default:
          break;
      }
    }
    console.log("A3");
  }

  //----------------------------------------------
  // Table Cards...
  for (const key in appconfig["tableConfig"]) {
    if (appconfig["tableConfig"][key]["ItemButtons"]["itemAdd"] == true) {
      aCard = {};
      aCard = await adaptiveNew(
        appconfig["tableConfig"][key],
        resPV,
        ival_out,
        "table",
        appconfig["PossibleValues"],
        appconfig
      );
      outStru["ADD01"] = { ...aCard };
    }
    // Step T1 - Check if data for the table is in the record
    if (appData[key] == undefined) {
      appData[key] = [];
    }
    // Step T2 - Find the tab ID Tab1, Tab2 etc from field name
    let tabx = "";
    for (const k1 in appconfig["DetailFields"]) {
      appconfig["DetailFields"][k1].forEach((e4) => {
        if (key == e4) {
          tabx = k1;
        }
      });
    }

    // Step T3 - check if card setup is there for the table and loop the cards in the config file
    if (appconfig["tableConfig"][key].hasOwnProperty("cards")) {
      console.log("A4");
      for (let g = 0; g < appconfig["tableConfig"][key]["cards"].length; g++) {
        let cardKey = "";
        var mycard = appconfig["tableConfig"][key]["cards"][g];
        counter = counter + 1;
        // Step T4 - Identify the CardID
        if (mycard["cardID"] !== undefined) {
          cardKey = getCardKey(
            req.params.app,
            req.params.role,
            mycard["cardID"],
            "T"
          );
        } else {
          cardKey = getCardKey(req.params.app, req.params.role, counter, "T");
        }
        // Step T5 - Read card Template, Stringify, replace @values then parse back to javaObject
        // if (mycard["cardType"] != "AdaptiveForm") {
        let cardConfigFile1 = "../../cards/cardConfig/" + mycard["template"];
        var cardData = JSON.stringify(require(cardConfigFile1));
        cardData = cardReplace(mycard, cardData, appconfig);
        var anacardConfig = JSON.parse(cardData);
        // }

        // Step T6 - Handle different card Types..
        switch (mycard["cardType"]) {
          case "AdaptiveForm":
            jCard1 = {};
            jCard1 = await adaptivetableCard(
              req.params.app,
              req.params.role,
              key,
              anacardConfig
            );
            outStru[cardKey] = { ...jCard1 };
            break;
          case "Analytical":
            //        console.log(cardKey, anacardConfig);
            jCard1 = {};
            jCard1 = await analyticalCard(mycard, appData[key], anacardConfig);
            outStru[cardKey] = { ...jCard1 };
            break;

          case "List":
            //         console.log(cardKey, anacardConfig);
            jCard1 = {};
            jCard1 = await listCard(mycard, appData[key], anacardConfig);
            outStru[cardKey] = { ...jCard1 };
            break;

          case "timeLine":
            break;
          case "Table":
            break;
          case "Adaptive":
            break;
          case "Object":
            break;
          case "Calander":
            break;
          default:
            break;
        }

        switch (mycard["type"]) {
          case "Example":
            //        console.log(cardKey, anacardConfig);
            jCard1 = {};
            jCard1 = await exampleCard(mycard, appData[key], anacardConfig);
            outStru[cardKey] = { ...jCard1 };
            break;
          case "Analytical":
            if (mycard["analyticsCard"]["chartType"] == "donut") {
              jCard1 = {};
              jCard1 = await donutCard(mycard, appData[key], anacardConfig);
              outStru[cardKey] = { ...jCard1 };
            }
            if (mycard["analyticsCard"]["chartType"] == "line") {
              jCard1 = {};
              jCard1 = await lineCard(mycard, appData[key], anacardConfig);
              outStru[cardKey] = { ...jCard1 };
            }
            if (mycard["analyticsCard"]["chartType"] == "stackedcolumn") {
              jCard1 = {};
              jCard1 = await stackedcolumnCard(
                mycard,
                appData[key],
                anacardConfig
              );
              outStru[cardKey] = { ...jCard1 };
            }
            break;
          case "Table":
            jCard1 = {};
            jCard1 = await tableCard(mycard, appData[key], anacardConfig);
            outStru[cardKey] = { ...jCard1 };
            break;

          default:
            break;
        }
      }
    }
  }

  // Global Cards
  //
  let fg1 = "../../cards/cardConfig/template_timeline.json";
  var GlobalCardConfig = require(fg1);
  console.log("A1");
  if (appData["TransLog"].length > 0) {
    jCard1 = {};
    jCard1 = await globalCard(appData["TransLog"], GlobalCardConfig);
    outStru["TransLog"] = { ...jCard1 };
  }

  res.status(200).json({
    success: true,
    record: appData,
    data: outStru,
    config: appconfig,
  });
};
