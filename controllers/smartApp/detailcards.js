const {
  donutCard,
  lineCard,
  StackedColumnCard,
  tableCard,
  globalCard,
  exampleCard,
  adaptivecardCard,
  getCardKey,
  analyticalCard,
  listCard,
  adaptivetableCard,
  countAnalyticalCard,
  adaptiveNew,
  sumAnalyticalCard,
  buildAnalyticalCard,
  numericHeader,
} = require("../../modules/moduleCards");
const {
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
  // 01 -  Possible values..
  console.log("01 -  Possible values..");
  pvappconfig = getPVConfig(req.params.app, req.params.role);
  qPV = getPVQuery(req.params.app, req.params.role, pvappconfig);
  let resPV = await qPV;

  // 02 -  Initial values..
  console.log("02 -  Initial values..");
  var ivalue = getInitialValues(req.params.app, req.params.role, req.user);
  let ival_out = [];
  let ival = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }
  iStatus = 0;
  iMessage = "";
  let appData = [];
  console.log("03 -  Few Validations..");
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

  // 03 -  Tab details..
  console.log("04 -  Tab details..");
  cTab = {};
  iTab = [];
  for (let n = 0; n < appconfig["Tabs"].length; n++) {
    cTab["tabName"] = appconfig["Tabs"][n]["name"];
    cTab["tab"] = appconfig["Tabs"][n]["value"];
    cTab["style"] = appconfig["Tabs"][n]["style"];
    cTab["type"] = appconfig["Tabs"][n]["type"];
    cTab["Table"] = "";
    iTab.push({ ...cTab });
    cTab = {};
  }

  outStru = {};
  outStru2 = {};
  // Header Cards...
  // Collect Charts & Graphs
  if (appconfig.hasOwnProperty("detailCharts")) {
    var mycard = appconfig["detailCharts"];
    for (let k = 0; k < mycard.length; k++) {
      if (mycard[k]["cardType"] == "Analytical") {
        let cardTemplate = {};
        if (appconfig["Controls"]["style"] == "SAP") {
          console.log("05 -  Header SAP Card..", myCard[k]["cardsubType"]);
          cardTemplate =
            "../../cards/cardConfig/template_sap_" +
            myCard[k]["cardsubType"] +
            ".json";
        } else {
          console.log("05 -  Header Google Card..", myCard[k]["cardsubType"]);
          cardTemplate =
            "../../cards/cardConfig/template_google_" +
            myCard[k]["cardsubType"] +
            ".json";
        }
        var cardData = JSON.stringify(require(cardTemplate));
        cardData = cardReplace(
          myCard[k],
          cardData,
          appconfig,
          "header",
          "Tab1"
        );
        var anacardConfig = JSON.parse(cardData);
        jCard1 = {};
        jCard1 = await analyticalCard(
          mycard[k],
          appData,
          anacardConfig,
          appconfig["Controls"]["style"]
        );
        outStru2["HCHART" + k] = { ...jCard1 };
      }
    }
  }
  // Header Cards...
  // Collect Charts & Graphs
  if (appconfig.hasOwnProperty("cards")) {
    var mycard = appconfig["cards"];
    for (let k = 0; k < mycard.length; k++) {
      //   let cardKey = "HDR" + k;
      let cardConfigFile1 = "../../cards/cardConfig/" + mycard[k]["template"];
      var cardData = JSON.stringify(require(cardConfigFile1));
      cardData = cardReplace(mycard[k], cardData, appconfig, "header", "Tab1");
      var anacardConfig = JSON.parse(cardData);
      switch (mycard[k]["type"]) {
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

  // Table and Item level Cards...
  let cardkey = "";
  tab = "Tab1";

  // Collect Detail Fields for Adaptive Card
  for (const key in appconfig["tableConfig"]) {
    for (let i = 0; i < appconfig["DetailFields"].length; i++) {
      for (const kc1 in appconfig["DetailFields"][i]) {
        appconfig["DetailFields"][i][kc1].forEach((element) => {
          if (element == key) {
            tab = kc1;
            console.log("06 -  Table / Tab : ", key, tab);
          }
        });
      }
    }

    // Add Adaptive Card..
    if (appconfig["tableConfig"][key]["ItemButtons"]["itemAdd"] == true) {
      aCard = {};
      console.log("07 -  Table Adaptive Card : ", key, tab);
      aCard = await adaptiveNew(
        appconfig["tableConfig"][key],
        resPV,
        ival_out,
        key,
        appconfig["PossibleValues"],
        tab
      );
      var cardData = JSON.stringify(aCard);
      cardData = cardReplace({}, cardData, appconfig, key, tab);
      cardData = cardReplace({}, cardData, appconfig, key, tab);
      cardData = cardReplace({}, cardData, appconfig, key, tab);
      aCard = JSON.parse(cardData);
      cardkey = "ADD_" + key;

      outStru[cardkey] = { ...aCard };
    }

    // Build data cards...
    // Step T1 - Check if data for the table is in the record
    if (appData.hasOwnProperty(key)) {
      if (appData[key] == undefined) {
        appData[key] = [];
      }
    }
    // Step T2 - Find the tab ID Tab1, Tab2 etc from field name
    let tabx = "";
    for (const k1 in appconfig["DetailFields"]) {
      appconfig["DetailFields"][k1].forEach((e4) => {
        if (key == e4) {
          tabx = k1;
          console.log("07 -  Again table and tab found : ", key, tabx);
        }
      });
    }

    if (appconfig["tableConfig"][key].hasOwnProperty("detailCharts")) {
      for (
        let x = 0;
        x < appconfig["tableConfig"][key]["detailCharts"].length;
        x++
      ) {
        console.log("08 -  detailCharts : ", key);
        var myCard = appconfig["tableConfig"][key]["detailCharts"][x];
        aCard = {};
        dt = new Date(0, 0, 0, 12, 0, 0);
        console.log("myDate", dt);
        switch (myCard["Data"]["operation"]) {
          case "COUNT":
            list = await countAnalyticalCard(
              myCard,
              appData[key],
              "COUNT",
              appconfig["tableConfig"][key]["ItemFieldDefinition"],
              appconfig["Controls"]["style"]
            );

            if (appconfig["Controls"]["style"] == "SAP") {
              numheader = await numericHeader(myCard, list, "COUNT");
            } else {
              numheader = {};
              r1 = [];
              r2 = [];

              switch (myCard["cardsubType"]) {
                case "StackedBar":
                  kg = { role: "style" };
                  r1.push("Col");
                  r1.push("Val");
                  r1.push(kg);
                  r2.push(r1);
                  console.log(r1);
                  r1 = [];
                  for (let y = 0; y < list.length; y++) {
                    var randomColor = Math.floor(
                      Math.random() * 16777215
                    ).toString(16);
                    r1.push(list[y]["Area"]);
                    r1.push(list[y]["Value1"]);
                    r1.push(randomColor);
                    r2.push(r1);
                    console.log(r1);
                    r1 = [];
                  }
                  list = r2;
                  break;
                case "StackedColumn":
                  kg = { role: "style" };
                  r1.push("Col");
                  r1.push("Val");
                  r1.push(kg);
                  r2.push(r1);
                  console.log(r1);
                  r1 = [];
                  for (let y = 0; y < list.length; y++) {
                    var randomColor = Math.floor(
                      Math.random() * 16777215
                    ).toString(16);
                    r1.push(list[y]["Area"]);
                    r1.push(list[y]["Value1"]);
                    r1.push(randomColor);
                    r2.push(r1);
                    console.log(r1);
                    r1 = [];
                  }
                  list = r2;
                  break;
                case "Line":
                  list = r2;
                  break;
                case "Gauge":
                  r1.push("Label");
                  r1.push("Value");
                  r2.push(r1);
                  console.log(r1);
                  r1 = [];
                  for (let y = 0; y < list.length; y++) {
                    var randomColor = Math.floor(
                      Math.random() * 16777215
                    ).toString(16);
                    r1.push(list[y]["Area"]);
                    r1.push(list[y]["Value1"]);
                    r2.push(r1);
                    console.log(r1);
                    r1 = [];
                  }
                  list = r2;
                  break;
                case "Histogram":
                  break;
                case "addressMap":
                  break;
                case "TimeLine":
                  //  list = r2;
                  break;
                default:
                  //    list = r2;
                  break;
              }

              console.log(
                "10 - card data - List : ",
                list,
                "DCHART-A" + "-" + key + x
              );
            }
            aCard = await buildAnalyticalCard(
              myCard,
              list,
              numheader,
              appconfig["Controls"]["style"],
              "DCHART-A" + "-" + key + x
            );
            var cardData = JSON.stringify(aCard);
            cardData = cardReplace(myCard, cardData, appconfig, key, tabx);
            aCard = JSON.parse(cardData);
            outStru2["DCHART-A" + "-" + key + x] = { ...aCard };
            aCard = {};
            list = [];
            break;
          case "COLLECTIVE":
            list = await countAnalyticalCard(
              myCard,
              appData[key],
              "COLLECTIVE",
              appconfig["tableConfig"][key]["ItemFieldDefinition"],
              appconfig["Controls"]["style"]
            );
            numheader = await numericHeader(myCard, list, "COLLECTIVE");
            aCard = await buildAnalyticalCard(
              myCard,
              list,
              numheader,
              appconfig["Controls"]["style"],
              "DCHART-A" + "-" + key + x
            );
            var cardData = JSON.stringify(aCard);
            cardData = cardReplace(myCard, cardData, appconfig, key, tabx);
            aCard = JSON.parse(cardData);
            outStru2["DCHART-B" + x] = { ...aCard };
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
              appData[key],
              "COUNT",
              appconfig["tableConfig"][key]["ItemFieldDefinition"],
              appconfig["Controls"]["style"]
            );
            numheader = await numericHeader(myCard, list, "COUNT");
            aCard = await buildAnalyticalCard(
              myCard,
              list,
              numheader,
              appconfig["Controls"]["style"],
              "DCHART-A" + "-" + key + x
            );
            var cardData = JSON.stringify(aCard);
            cardData = cardReplace(myCard, cardData, appconfig, key, tabx);
            aCard = JSON.parse(cardData);
            outStru2["DCHART-C" + x] = { ...aCard };
            break;
        }
      }
    }

    // Step T3A - check if card setup is there for the table and loop the cards in the config file
    if (appconfig["tableConfig"][key]["cards"] != undefined) {
      if (appconfig["tableConfig"][key].hasOwnProperty("cards")) {
        if (appconfig["tableConfig"][key]["cards"].length > 0) {
          for (
            let g = 0;
            g < appconfig["tableConfig"][key]["cards"].length;
            g++
          ) {
            console.log("08 -  Build Tables and Lists if Any : ", key);
            let cardKey = "";
            var mycard = appconfig["tableConfig"][key]["cards"][g];
            // Step T4 - Identify the CardID
            if (mycard["cardID"] !== undefined) {
              cardKey = getCardKey(
                req.params.app,
                req.params.role,
                mycard["cardID"],
                "T"
              );
            } else {
              cardKey = getCardKey(req.params.app, req.params.role, g, "T");
            }
            // Step T5 - Read card Template, Stringify, replace @values then parse back to javaObject
            // if (mycard["cardType"] != "AdaptiveForm") {

            let cardConfigFile1 =
              "../../cards/cardConfig/" + mycard["template"];
            var cardData = JSON.stringify(require(cardConfigFile1));
            cardData = cardReplace(mycard, cardData, appconfig, key, "Tab1");
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
                console.log(
                  "Setup Error : Analytical should not be added in cards!"
                );
                //  jCard1 = {};
                // jCard1 = await analyticalCard(
                //   mycard,
                //   appData[key],
                //   anacardConfig,
                //   appconfig["Controls"]["style"]
                // );
                //  jCard1 = await analyticalNew(appconfig, appData[key], "SAP");
                // outStru2[cardKey] = { ...jCard1 };
                //   console.log("CardKey", cardKey);
                break;

              case "List":
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
                jCard1 = {};
                jCard1 = await exampleCard(mycard, appData[key], anacardConfig);
                outStru[cardKey] = { ...jCard1 };
                break;
              case "Analytical":
                if (mycard["analyticsCard"]["chartType"] == "donut") {
                  jCard1 = {};
                  jCard1 = await donutCard(mycard, appData[key], anacardConfig);
                  outStru2[cardKey] = { ...jCard1 };
                }
                if (mycard["analyticsCard"]["chartType"] == "line") {
                  jCard1 = {};
                  jCard1 = await lineCard(mycard, appData[key], anacardConfig);
                  outStru[cardKey] = { ...jCard1 };
                }
                if (mycard["analyticsCard"]["chartType"] == "StackedColumn") {
                  jCard1 = {};
                  jCard1 = await StackedColumnCard(
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
    }
  }

  // Global Cards
  let fg1 = "../../cards/cardConfig/template_timeline.json";
  var GlobalCardConfig = require(fg1);
  if (appData["TransLog"].length > 0) {
    jCard1 = {};
    jCard1 = await globalCard(appData["TransLog"], GlobalCardConfig);
    outStru["TransLog"] = { ...jCard1 };
  }

  res.status(200).json({
    success: true,
    record: appData,
    data: outStru,
    tabs: iTab,
    charts: outStru2,
    config: appconfig,
  });
};
