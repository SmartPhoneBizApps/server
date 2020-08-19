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
  getCard,
  findOneAppDatabyid,
  getNewConfig,
} = require("../../modules/config");

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  iStatus = 0;
  iMessage = "";

  outStru = {};
  let appData = {};
  // Read New Config File
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
    // Get the Record
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
    for (let k = 0; k < mycard.length; k++) {
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
  }

  //----------------------------------------------
  // Table Cards...
  for (const key in appconfig["tableConfig"]) {
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
  if (appData["TransLog"].length > 0) {
    jCard1 = {};
    jCard1 = await globalCard(appData["TransLog"], GlobalCardConfig);
    outStru["TransLog"] = { ...jCard1 };
  }

  res.status(200).json({ success: true, data: outStru });
};
