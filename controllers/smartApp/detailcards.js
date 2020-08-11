const {
  donutCard,
  lineCard,
  stackedcolumnCard,
  tableCard,
  globalCard,
  adaptivecardCard,
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
  console.log("--------** HEADER CARDS **---------");
  counter = 0;
  let cardKey =
    "H" +
    req.params.app.substring(0, 3) +
    req.params.app.slice(-2) +
    req.params.role.substring(0, 3) +
    counter;
  counter = counter + 1;

  if (appconfig.hasOwnProperty("cards")) {
    var mycard = appconfig["cards"];
    for (let k = 0; k < mycard.length; k++) {
      let cardConfigFile1 = "../../cards/cardConfig/" + mycard[k]["template"];
      var cardData = JSON.stringify(require(cardConfigFile1));
      if (mycard[k].title != undefined) {
        cardData = cardData.replace("@Title", mycard[k].title);
      } else {
        cardData = cardData.replace(
          "@Title",
          appconfig["Title"]["ApplicationTitle"]
        );
      }
      if (mycard[k].subTitle != undefined) {
        cardData = cardData.replace("@subTitle", mycard[k].subtitle);
      } else {
        cardData = cardData.replace(
          "@subTitle",
          appconfig["Title"]["DetailTitle"]
        );
      }
      cardData = cardData.replace(
        "@unitOfMeasurement",
        mycard[k].unitOfMeasurement
      );
      cardData = cardData.replace("@HeaderActionURL", "applicationTile");
      var anacardConfig = JSON.parse(cardData);

      switch (mycard[k]["type"]) {
        case "Analytical":
          console.log("Header Card", anacardConfig);
          break;
        case "Adaptive":
          console.log("Header Card", anacardConfig);
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
  console.log("--------** TABLE CARDS **---------");
  for (const key in appconfig["tableConfig"]) {
    for (let g = 0; g < appconfig["tableConfig"][key]["cards"].length; g++) {
      let cardKey =
        "T" +
        req.params.app.substring(0, 3) +
        req.params.app.slice(-2) +
        req.params.role.substring(0, 3) +
        counter;
      counter = counter + 1;

      var mycard = appconfig["tableConfig"][key]["cards"][g];
      let cardConfigFile1 = "../../cards/cardConfig/" + mycard["template"];
      // Set Title

      var cardData = JSON.stringify(require(cardConfigFile1));
      if (mycard.title != undefined) {
        cardData = cardData.replace("@Title", mycard.title);
      } else {
        cardData = cardData.replace(
          "@Title",
          appconfig["tableConfig"][key]["title"]
        );
      }
      if (mycard.subTitle != undefined) {
        cardData = cardData.replace("@subTitle", mycard.subtitle);
      } else {
        cardData = cardData.replace(
          "@subTitle",
          appconfig["tableConfig"][key]["subtitle"]
        );
      }

      cardData = cardData.replace(
        "@unitOfMeasurement",
        mycard.unitOfMeasurement
      );
      cardData = cardData.replace("@HeaderActionURL", key);

      var anacardConfig = JSON.parse(cardData);
      switch (mycard["type"]) {
        case "Analytical":
          if (mycard["analyticsCard"]["chartType"] == "donut") {
            jCard1 = {};
            jCard1 = await donutCard(
              mycard["analyticsCard"],
              appData[key],
              anacardConfig
            );
            outStru[cardKey] = { ...jCard1 };
          }
          if (mycard["analyticsCard"]["chartType"] == "line") {
            jCard1 = {};
            jCard1 = await lineCard(
              mycard["analyticsCard"],
              appData[key],
              anacardConfig
            );
            outStru[cardKey] = { ...jCard1 };
          }
          if (mycard["analyticsCard"]["chartType"] == "stackedcolumn") {
            jCard1 = {};
            jCard1 = await stackedcolumnCard(
              mycard["analyticsCard"],
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

  // Global Cards
  //
  let fg1 = "../../cards/cardConfig/template_timeline.json";
  var GlobalCardConfig = require(fg1);

  jCard1 = {};
  jCard1 = await globalCard(appData["TransLog"], GlobalCardConfig);
  outStru["TransLog"] = { ...jCard1 };

  res.status(200).json({ success: true, data: outStru });
};
