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
  outStru = {};
  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);
  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);
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
    if (appData[key] == undefined) {
      appData[key] = [];
    }
    let tabx = "";
    for (const k1 in appconfig["DetailFields"]) {
      appconfig["DetailFields"][k1].forEach((e4) => {
        if (key == e4) {
          tabx = k1;
        }
      });
    }

    if (appconfig["tableConfig"][key].hasOwnProperty("cards")) {
      for (let g = 0; g < appconfig["tableConfig"][key]["cards"].length; g++) {
        counter = counter + 1;
        let cardKey = getCardKey(req.params.app, req.params.role, counter, "T");
        var mycard = appconfig["tableConfig"][key]["cards"][g];
        let cardConfigFile1 = "../../cards/cardConfig/" + mycard["template"];
        var cardData = JSON.stringify(require(cardConfigFile1));
        // replace values
        cardData = cardReplace(mycard, cardData, appconfig);
        var anacardConfig = JSON.parse(cardData);
        switch (mycard["type"]) {
          case "Example":
            console.log(cardKey, anacardConfig);
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
