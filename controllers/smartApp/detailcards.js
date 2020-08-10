const {
  donutCard,
  lineCard,
  stackedcolumnCard,
  tableCard,
  globalCard,
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
    "A" +
    req.params.app.substring(0, 3) +
    req.params.app.slice(-2) +
    req.params.role.substring(0, 3) +
    counter;
  counter = counter + 1;

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
      console.log("myCard", mycard);
      var cardData = JSON.stringify(require(cardConfigFile1));
      if (mycard.title != undefined) {
        cardData = cardData.replace("@Title", mycard.title);
      } else {
        cardData = cardData.replace(
          "@Title",
          appconfig["tableConfig"][key]["title"]
        );
      }
      if (mycard.title != undefined) {
        cardData = cardData.replace("@subTitle", mycard.subtitle);
      } else {
        cardData = cardData.replace(
          "@Title",
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
