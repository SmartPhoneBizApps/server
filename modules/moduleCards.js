const asyncHandler = require("../middleware/async");
const { date1, string, integer } = require("./config");
const { aggregateCount, aggregateSum } = require("../modules/config2");

module.exports = {
  getCardKey: function (a, b, c, d) {
    cKey = d + a.substring(0, 3) + a.slice(-2) + b.substring(0, 3) + c;
    return cKey;
  },
  donutCardHead: async function (mycard, appData1, anacardConfig) {
    measures1 = [];
    let mydc2 = {};
    let json1 = {};
    var set1 = new Set();
    set1.add(appData1[mycard["cardsDonut"]["measureName"]]);
    set1.forEach((val) => {
      mydc2["measureName"] = val;
      mydc2["value"] = 0;
      if (
        appData1[mycard["cardsDonut"]["measureName"]] == val &&
        mycard["cardsDonut"]["function"] == "SUM"
      ) {
        mydc2["value"] =
          Number(mydc2["value"]) +
          Number(appData1[mycard["cardsDonut"]["value"]]);
      }
      measures1.push({ ...mydc2 });
      mydc2 = {};
    });
    // Measurements...
    json1 = { ...anacardConfig["sap.card"].content.data.json };
    json1["measures"] = measures1;
    anacardConfig["sap.card"].content.data.json = {
      ...json1,
    };
    measures1 = [];
    json1 = {};
    return anacardConfig;
  },
  exampleCard: async function (mycard, appData1, anacardConfig) {
    return anacardConfig;
  },
  adaptivetableCard: async function (appID, role, key, adCard) {
    let path1 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_" + key + ".json";
    let path2 =
      "../cards/adaptivecardforms/" +
      appID +
      "_" +
      role +
      "_" +
      key +
      "_actions.json";
    let path3 =
      "../cards/adaptivecardforms/" +
      appID +
      "_" +
      role +
      "_" +
      key +
      "_additional.json";
    //    let path3 = "../cards/cardConfig/template_adaptiveForm.json";
    const cardbody = require(path1);
    const cardaction = require(path2);
    const cardadditional = require(path3);

    for (let z = 0; z < cardbody["body"].length; z++) {
      if (cardbody["body"][z].hasOwnProperty("value")) {
        if (cardbody["body"][z]["value"] == "@currentDate") {
          let ag1 = new Date();
          cardbody["body"][z]["value"] = "2020-08-19";
        }
      }
    }
    for (let z = 0; z < cardadditional["body"].length; z++) {
      if (cardadditional["body"][z].hasOwnProperty("value")) {
        if (cardadditional["body"][z]["value"] == "@currentDate") {
          let ag1 = new Date();
          cardadditional["body"][z]["value"] = "2020-08-19";
        }
      }
    }
    for (let y = 0; y < cardaction["actions"].length; y++) {
      if (cardaction["actions"][y]["type"] == "Action.ShowCard") {
        cardaction["actions"][y]["card"]["body"] = cardadditional["body"];
      }
    }

    adCard["sap.card"]["content"]["body"] = cardbody["body"];
    adCard["sap.card"]["content"]["actions"] = cardaction["actions"];
    return adCard;
  },
  analyticalCard: async function (mycard, appData1, anacardConfig, style) {
    let mydc2 = {};
    let json1 = {};
    list1 = [];
    list1x = {};
    var set1 = new Set();
    if (style == "SAP") {
      if (mycard["cardsubType"] == "Donut") {
        for (let q = 0; q < appData1.length; q++) {
          set1.add(
            appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]]
          );
        }
        set1.forEach((val) => {
          mydc2["measureName"] = val;
          mydc2["Value2"] = 0;
          for (let q = 0; q < appData1.length; q++) {
            if (
              appData1[q][
                mycard["analyticsCard"]["cardsDonut"]["measureName"]
              ] == val &&
              mycard["analyticsCard"]["cardsDonut"]["function"] == "SUM"
            ) {
              mydc2["Value2"] =
                Number(mydc2["Value2"]) +
                Number(
                  appData1[q][mycard["analyticsCard"]["cardsDonut"]["Value2"]]
                );
            }
            if (
              appData1[q][
                mycard["analyticsCard"]["cardsDonut"]["measureName"]
              ] == val &&
              mycard["analyticsCard"]["cardsDonut"]["function"] == "COUNT"
            ) {
              mydc2["Value2"] = Number(mydc2["Value2"]) + 1;
            }
          }
          list1.push({ ...mydc2 });
          mydc2 = {};
        });
        json1 = { ...anacardConfig["sap.card"].content.data.json };
        json1["list"] = list1;
        anacardConfig["sap.card"].content.data.json = {
          ...json1,
        };
      }
      if (
        mycard["cardsubType"] == "Line" ||
        mycard["cardsubType"] == "StackedBar" ||
        mycard["cardsubType"] == "StackedColumn"
      ) {
        let j_number = 10;
        let trend1 = "Down";
        let state1 = "Error";
        let details1 = "2019-2020";
        head1 = {};
        head1 = { ...anacardConfig["sap.card"].header };
        json1 = {
          ...anacardConfig["sap.card"].content.data.json,
        };
        for (let q = 0; q < appData1.length; q++) {
          for (const k1 in mycard["itemvalueMap"]) {
            const ek1 = mycard["itemvalueMap"][k1];
            if (appData1[q][ek1] != undefined) {
              list1x[k1] = appData1[q][ek1];
            } else {
              list1x[k1] = 0;
            }
          }
          for (const k1 in mycard["itemkeyMap"]) {
            const ek1 = mycard["itemkeyMap"][k1];
            if (appData1[q][ek1] != undefined) {
              list1x[k1] = appData1[q][ek1];
            } else {
              list1x[k1] = "NA";
            }
          }
          list1.push({ ...list1x });
        }
        json1["list"] = list1;
        anacardConfig["sap.card"].content.data.json.list = list1;
        js1 = {};
        js1 = { ...anacardConfig["sap.card"].header.data.json };
        js1["number"] = j_number;
        js1["trend"] = trend1;
        js1["state"] = state1;
        js1["details"] = details1;
        head1["data"]["json"] = { ...js1 };
        js1 = {};
        anacardConfig["sap.card"].header = { ...head1 };
        head1 = {};
      }
    } else {
    }

    list1 = [];
    json1 = {};
    list1x = {};
    return anacardConfig;
  },
  donutCard: async function (mycard, appData1, anacardConfig) {
    measures1 = [];
    let mydc2 = {};
    let json1 = {};

    var set1 = new Set();
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      set1.add(
        appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]]
      );
      filterSet.add(appData1[q][mycard["filterKey"]]);
    }
    // Measurements...
    set1.forEach((val) => {
      mydc2["measureName"] = val;
      mydc2["value"] = 0;
      for (let q = 0; q < appData1.length; q++) {
        if (
          appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
            val &&
          mycard["analyticsCard"]["cardsDonut"]["function"] == "SUM"
        ) {
          mydc2["value"] =
            Number(mydc2["value"]) +
            Number(appData1[q][mycard["analyticsCard"]["cardsDonut"]["value"]]);
        }
        if (
          appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
            val &&
          mycard["analyticsCard"]["cardsDonut"]["function"] == "COUNT"
        ) {
          mydc2["value"] = Number(mydc2["value"]) + 1;
        }
      }
      measures1.push({ ...mydc2 });
      mydc2 = {};
    });

    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    json1 = { ...anacardConfig["sap.card"].content.data.json };
    json1["measures"] = measures1;
    anacardConfig["sap.card"].content.data.json = {
      ...json1,
    };
    measures1 = [];
    json1 = {};
    return anacardConfig;
  },
  lineCard: async function (mycard, appData1, anacardConfig) {
    list1x = {};
    list1 = [];
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let details1 = "2019-2020";
    head1 = {};
    head1 = { ...anacardConfig["sap.card"].header };
    json1 = {
      ...anacardConfig["sap.card"].content.data.json,
    };
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      for (const k1 in mycard["analyticsCard"]["itemvalueMap"]) {
        filterSet.add(appData1[q][mycard["filterKey"]]);
        const ek1 = mycard["analyticsCard"]["itemvalueMap"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = 0;
        }
      }
      for (const k1 in mycard["analyticsCard"]["itemkeyMap"]) {
        const ek1 = mycard["analyticsCard"]["itemkeyMap"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = "NA";
        }
      }
      list1.push({ ...list1x });
    }
    json1["list"] = list1;
    anacardConfig["sap.card"].content.data.json.list = list1;
    js1 = {};
    js1 = { ...anacardConfig["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["details"] = details1;
    head1["data"]["json"] = { ...js1 };
    js1 = {};
    anacardConfig["sap.card"].header = { ...head1 };
    // Filters
    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    list1 = [];
    json1 = {};
    head1 = {};
    stru1 = anacardConfig;
    t_type = "Analytical";
    return stru1;
  },
  StackedColumnCard: async function (mycard, appData1, anacardConfig) {
    stru1 = anacardConfig;
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let unitOfMeasurement = "GBP";
    let details1 = "2019-2020";
    head1 = {};
    head1 = { ...anacardConfig["sap.card"].header };

    json1 = {
      ...anacardConfig["sap.card"].content.data.json,
    };
    js1 = {};
    js1 = { ...anacardConfig["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["unit"] = unitOfMeasurement;
    head1["data"]["json"] = { ...js1 };
    anacardConfig["sap.card"].header = { ...head1 };

    js1 = {};
    list1 = [];
    list1x = {};
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      list1x["Category"] =
        appData1[q][mycard["analyticsCard"]["colKey"]["Category"]];
      for (let t = 0; t < mycard["analyticsCard"]["colValues"].length; t++) {
        filterSet.add(appData1[q][mycard["filterKey"]]);
        list1x[mycard["analyticsCard"]["colValues"][t]] =
          appData1[q][mycard["analyticsCard"]["colValues"][t]];
      }
      for (const k1 in mycard["analyticsCard"]["colValues"]) {
        const ek1 = mycard["analyticsCard"]["colValues"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = 0;
        }
      }
      list1.push({ ...list1x });
    }
    // Filters...
    rk = {};

    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    anacardConfig["sap.card"].content.data.json.list = list1;

    list1 = [];
    json1 = {};
    head1 = {};

    return stru1;
  },
  listCard: async function (mycard, appData1, anacardConfig) {
    let fileNameColor = "../config/colorConfig.json";
    var colorConfig = require(fileNameColor);

    mergedFields = mycard["mergedFields"];
    fieldMap = mycard["fieldMap"];
    colorStatus = mycard["colorStatus"];
    out1 = [];
    outx = {};

    for (let u = 0; u < appData1.length; u++) {
      for (const kl in mergedFields) {
        outx[kl] = "";
        for (let i = 0; i < mergedFields[kl].length; i++) {
          switch (mergedFields[kl][i]) {
            case "@£":
              outx[kl] = outx[kl] + "£";
              break;
            case "@$":
              outx[kl] = outx[kl] + "$";
              break;
            case "@ ":
              outx[kl] = outx[kl] + " ";
              break;
            case "@>>":
              outx[kl] = outx[kl] + ">>";
              break;

            case "@>>":
              outx[kl] = outx[kl] + ">>";
              break;

            case "@Score:":
              outx[kl] = outx[kl] + "Score:";
              break;
            default:
              outx[kl] = outx[kl] + appData1[u][mergedFields[kl][i]];
              break;
          }
        }
      }
      for (const kl in fieldMap) {
        if (appData1[u].hasOwnProperty(fieldMap[kl])) {
          // switch (fieldMap[kl]) {
          //   case value:
          //     break;

          //   default:
          //     break;
          // }

          outx[kl] = appData1[u][fieldMap[kl]];
        }
      }
      outx["State"] = colorConfig["Status"][appData1[u][colorStatus]];
      outx["Highlight"] = colorConfig["Status"][appData1[u][colorStatus]];
      if (outx["State"] == undefined) {
        outx["State"] = "Warning";
      }
      if (outx["Highlight"] == undefined) {
        outx["Highlight"] = "Warning";
      }
      switch (outx["State"]) {
        case "Error":
          outx["ChartColor"] = "Error";
          break;
        case "Warning":
          outx["ChartColor"] = "Neutral";
          break;
        case "Information":
          outx["ChartColor"] = "Neutral";
          break;
        case "Success":
          outx["ChartColor"] = "Good";
          break;
        case "None":
          outx["ChartColor"] = "Neutral";
          break;
        default:
          break;
      }

      out1.push({ ...outx });
      outx = {};
    }

    anacardConfig["sap.card"]["content"]["data"]["json"] = out1;
    return anacardConfig;
  },
  tableCard: async function (mycard, appData1, anacardConfig) {
    t_type = "table1";
    stru = anacardConfig;
    tabFields = mycard["tableCardFields"];
    xc_table1 = {};
    col_table1 = [];
    for (let b = 0; b < tabFields.length; b++) {
      xc_table1["title"] = tabFields[b];
      xc_table1["value"] = "{" + tabFields[b] + "}";
      xc_table1["identifier"] = false;
      col_table1.push({ ...xc_table1 });
      xc_table1 = {};
    }
    xj_table1 = {};
    json_table1 = [];
    tdata = [];
    xrow1 = {};
    xrow = {};
    var filterSet = new Set();
    for (let u = 0; u < appData1.length; u++) {
      filterSet.add(appData1[u][mycard["filterKey"]]);
      for (let b = 0; b < tabFields.length; b++) {
        xj_table1[tabFields[b]] = appData1[u][tabFields[b]];
      }
      json_table1.push({ ...xj_table1 });
      xj_table1 = {};
    }
    tdata["json"] = json_table1;
    json_table1 = [];
    xrow1["columns"] = col_table1;
    xrow["row"] = { ...xrow1 };
    xrow1 = {};
    col_table1 = [];
    stru["sap.card"]["content"] = { ...xrow };
    xrow = {};
    stru["sap.card"]["type"] = "Table";
    stru["sap.card"]["data"] = { ...tdata };
    // Filters....
    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    stru["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    tdata = {};
    return stru;
  },
  globalCard: async function (appData1, GlobalCardConfig) {
    stru = GlobalCardConfig;
    stru["sap.card"]["header"]["title"] = "Processing Log";
    stru["sap.card"]["header"]["subTitle"] = "Historic Changes";

    let fg3 = "../cards/cardConfig/template_icon.json";
    var gicon = require(fg3);
    let timeline1_json = [];
    let xj1 = {};
    for (let n = 0; n < appData1.length; n++) {
      xj1["Icon"] = "sap-icon://accept";
      xj1["Title"] = appData1[n]["Comment"];
      xj1["Time"] = new Date(appData1[n]["TimeStamp"]);
      xj1["Description"] = appData1[n]["UserName"];
      if (appData1[n].hasOwnProperty("buttonName")) {
        xj1["Title"] = xj1["Title"] + " >> " + appData1[n]["buttonName"];
        xj1["Icon"] = gicon[appData1[n]["buttonName"]];
      }
      if (appData1[n].hasOwnProperty("UserComment")) {
        xj1["Description"] =
          xj1["Description"] + " >> " + appData1[n]["UserComment"];
      }
      timeline1_json.push({ ...xj1 });
      xj1 = {};
    }
    stru["sap.card"]["content"]["data"]["json"] = timeline1_json;
    timeline1_json = [];
    return stru;
  },
  adaptivecardCard: async function (appID, role, adCard) {
    let path1 = "../cards/adaptivecardforms/" + appID + "_" + role + ".json";
    let path2 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_actions.json";
    let path3 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_additional.json";
    //    let path3 = "../cards/cardConfig/template_adaptiveForm.json";
    const cardbody = require(path1);
    const cardaction = require(path2);
    const cardadditional = require(path3);
    for (let z = 0; z < cardbody["body"].length; z++) {
      if (cardbody["body"][z].hasOwnProperty("value")) {
        if (cardbody["body"][z]["value"] == "@currentDate") {
          let ag1 = new Date();
          cardbody["body"][z]["value"] = "2020-08-19";
        }
      }
    }
    for (let z = 0; z < cardadditional["body"].length; z++) {
      if (cardadditional["body"][z].hasOwnProperty("value")) {
        if (cardadditional["body"][z]["value"] == "@currentDate") {
          let ag1 = new Date();
          cardadditional["body"][z]["value"] = "2020-08-19";
        }
      }
    }
    for (let y = 0; y < cardaction["actions"].length; y++) {
      if (cardaction["actions"][y]["type"] == "Action.ShowCard") {
        cardaction["actions"][y]["card"]["body"] = cardadditional["body"];
      }
    }

    adCard["sap.card"]["content"]["body"] = cardbody["body"];
    adCard["sap.card"]["content"]["actions"] = cardaction["actions"];
    return adCard;
  },
  adaptiveNew: async function (
    appconfig,
    resPV,
    ival_out,
    mode,
    poss_val,
    tab
  ) {
    body = [];
    body2 = [];
    body2 = [];
    body1x = {};
    body2x = {};
    let cardConfigFile1 = "../cards/cardConfig/template_adaptiveForm.json";
    let aCard = require(cardConfigFile1);
    if (mode == "header") {
      for (let l = 0; l < appconfig["Wizard"].length; l++) {
        const rkg = appconfig["Wizard"][l];
        rkg["fields"].forEach((e1) => {
          for (let a = 0; a < appconfig["FieldDef"].length; a++) {
            if (appconfig["FieldDef"][a]["name"] == e1["name"]) {
              switch (appconfig["FieldDef"][a]["type"]) {
                case "string":
                  // Text >> Input.Text
                  //"style": "text",
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["style"] = "text";
                  body1x["type"] = "Input.Text";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  //"isMultiline"
                  if (appconfig["FieldDef"][a]["width"] > 100) {
                    body1x["isMultiline"] = true;
                  } else {
                    body1x["isMultiline"] = false;
                  }
                  break;
                case "Date":
                  // Date >> Input.Date
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Date";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  //           body1x["value"] = "@currentDate";

                  break;

                case "hyperlink":
                  //"style": "url",
                  // Text >> Input.Text
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["style"] = "url";
                  body1x["type"] = "Input.Text";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = "Website Url";

                  break;

                case "Email":
                  //"style": "email",
                  // Text >> Input.Text
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["style"] = "email";
                  body1x["type"] = "Input.Text";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = "youremail@example.com";

                  break;
                case "Time":
                  // Time >> Input.Time
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Time";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  break;
                case "Num,0":
                  // Number >> Input.Number
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Number";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  break;
                case "Num,1":
                  // Number >> Input.Number
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Number";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  break;
                case "Num,2":
                  // Number >> Input.Number
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Number";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  break;
                case "Num,3":
                  // Number >> Input.Number
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["type"] = "Input.Number";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  break;
                default:
                  body2x["size"] = "medium";
                  body2x["isSubtle"] = true;
                  body2x["type"] = "TextBlock";
                  body2x["text"] = e1["name"];

                  body1x["style"] = "text";
                  body1x["type"] = "Input.Text";
                  body1x["id"] = e1["name"];
                  body1x["placeholder"] = e1["name"];
                  //"isMultiline"
                  if (appconfig["FieldDef"]["width"] > 100) {
                    body1x["isMultiline"] = true;
                  } else {
                    body1x["isMultiline"] = false;
                  }
                  break;
              }
            }
          }
          for (let a = 0; a < poss_val.length; a++) {
            if (poss_val[a] == e1["name"]) {
              // Possible Values >> Input.ChoiceSet
              //"style": "expanded",
              body1x = {};
              body2x = {};

              body2x["isSubtle"] = true;
              body2x["type"] = "TextBlock";
              body2x["text"] = e1["name"];

              body1x["style"] = "expanded";
              body1x["type"] = "Input.ChoiceSet";
              body1x["id"] = e1["name"];

              x_ch = [];
              for (let j = 0; j < resPV.length; j++) {
                if (resPV[j]["PossibleValues"] == e1["name"]) {
                  x_choices = {};
                  x_choices["title"] = resPV[j]["Description"];
                  x_choices["value"] = resPV[j]["Value"];
                  x_ch.push(x_choices);
                }
              }
              body1x["choices"] = x_ch;
            }
          }
          for (let d = 0; d < ival_out.length; d++) {
            if (ival_out[d]["Field"] == e1["name"]) {
              body2x["size"] = "medium";
              body2x["isSubtle"] = true;
              body2x["type"] = "TextBlock";
              body2x["text"] = e1["name"];

              body1x["id"] = e1["name"];
              body1x["value"] = ival_out[d]["Value"];
              for (let a = 0; a < appconfig["FieldDef"].length; a++) {
                if (appconfig["FieldDef"][a]["name"] == e1["name"]) {
                  switch (appconfig["FieldDef"][a]["type"]) {
                    case "string":
                      body1x["type"] = "Input.Text";
                      body1x["style"] = "text";
                      break;
                    case "Date":
                      //  Input.Date
                      body1x["type"] = "Input.Date";
                      body1x["style"] = "";
                      break;
                    case "hyperlink":
                      // Input.Text
                      body1x["type"] = "Input.Text";
                      body1x["style"] = "url";
                      break;
                    case "Email":
                      //"style": "email",
                      // Text >> Input.Text
                      body1x["type"] = "Input.Text";
                      body1x["style"] = "email";
                      break;

                    case "Time":
                      // Time >> Input.Time
                      body1x["type"] = "Input.Time";
                      body1x["style"] = "";
                      break;
                    case "Num,0":
                      // Number >> Input.Number
                      body1x["type"] = "Input.Number";
                      body1x["style"] = "";
                      break;
                    case "Num,1":
                      // Number >> Input.Number
                      body1x["type"] = "Input.Number";
                      body1x["style"] = "";
                      break;
                    case "Num,2":
                      // Number >> Input.Number
                      body1x["type"] = "Input.Number";
                      body1x["style"] = "";
                      break;
                    case "Num,3":
                      // Number >> Input.Number
                      body1x["type"] = "Input.Number";
                      body1x["style"] = "";
                      break;
                    default:
                      body1x["type"] = "Input.Text";
                      body1x["style"] = "text";
                      break;
                  }
                }
              }
            }
          }
          //"style": "tel",
          // Toggle >> Input.Toggle
          // "type": "Input.Toggle",
          //"title": "I accept the terms and conditions",
          //"id": "Checked",
          //"wrap": true,
          //"value": "false",
          //"valueOn": "true",
          //"valueOff": "false"
          for (let a = 0; a < appconfig["FieldDef"].length; a++) {
            if (appconfig["FieldDef"][a]["name"] == e1["name"]) {
              if (appconfig["FieldDef"][a]["adaptiveCard"] == "Main") {
                body.push(body2x);
                body2x = {};
                body.push(body1x);
                body1x = {};
              }
              if (appconfig["FieldDef"][a]["adaptiveCard"] == "Additional") {
                body2.push(body2x);
                body2x = {};
                body2.push(body1x);
                body1x = {};
              }
            }
          }
        });
      }
    } else {
      appconfig["CreateFields"].forEach((e1) => {
        for (let a = 0; a < appconfig["ItemFieldDefinition"].length; a++) {
          if (appconfig["ItemFieldDefinition"][a]["name"] == e1) {
            switch (appconfig["ItemFieldDefinition"][a]["type"]) {
              case "string":
                // Text >> Input.Text
                //"style": "text",
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["style"] = "text";
                body1x["type"] = "Input.Text";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                //"isMultiline"
                if (appconfig["ItemFieldDefinition"][a]["width"] > 100) {
                  body1x["isMultiline"] = true;
                } else {
                  body1x["isMultiline"] = false;
                }
                break;
              case "Date":
                // Date >> Input.Date
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Date";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                //           body1x["value"] = "@currentDate";

                break;
              case "hyperlink":
                //"style": "url",
                // Text >> Input.Text
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["style"] = "url";
                body1x["type"] = "Input.Text";
                body1x["id"] = e1;
                body1x["placeholder"] = "Website Url";

                break;
              case "Email":
                //"style": "email",
                // Text >> Input.Text
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["style"] = "email";
                body1x["type"] = "Input.Text";
                body1x["id"] = e1;
                body1x["placeholder"] = "youremail@example.com";

                break;
              case "Time":
                // Time >> Input.Time
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Time";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                break;
              case "Num,0":
                // Number >> Input.Number
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Number";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                break;
              case "Num,1":
                // Number >> Input.Number
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Number";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                break;
              case "Num,2":
                // Number >> Input.Number
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Number";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                break;
              case "Num,3":
                // Number >> Input.Number
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["type"] = "Input.Number";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                break;
              default:
                body2x["size"] = "medium";
                body2x["isSubtle"] = true;
                body2x["type"] = "TextBlock";
                body2x["text"] = e1;

                body1x["style"] = "text";
                body1x["type"] = "Input.Text";
                body1x["id"] = e1;
                body1x["placeholder"] = e1;
                //"isMultiline"
                if (appconfig["ItemFieldDefinition"]["width"] > 100) {
                  body1x["isMultiline"] = true;
                } else {
                  body1x["isMultiline"] = false;
                }
                break;
            }
          }
        }
        for (let a = 0; a < poss_val.length; a++) {
          if (poss_val[a] == e1) {
            // Possible Values >> Input.ChoiceSet
            //"style": "expanded",
            body1x = {};
            body2x = {};
            body2x["isSubtle"] = true;
            body2x["type"] = "TextBlock";
            body2x["text"] = e1;
            body1x["style"] = "expanded";
            body1x["type"] = "Input.ChoiceSet";
            body1x["id"] = e1;
            x_ch = [];
            for (let j = 0; j < resPV.length; j++) {
              if (resPV[j]["PossibleValues"] == e1) {
                x_choices = {};
                x_choices["title"] = resPV[j]["Description"];
                x_choices["value"] = resPV[j]["Value"];
                x_ch.push(x_choices);
              }
            }
            body1x["choices"] = x_ch;
          }
        }
        for (let d = 0; d < ival_out.length; d++) {
          if (ival_out[d]["Field"] == e1) {
            body2x["size"] = "medium";
            body2x["isSubtle"] = true;
            body2x["type"] = "TextBlock";
            body2x["text"] = e1;
            body1x["id"] = e1;
            body1x["value"] = ival_out[d]["Value"];
            for (let a = 0; a < appconfig["ItemFieldDefinition"].length; a++) {
              if (appconfig["ItemFieldDefinition"][a]["name"] == e1) {
                switch (appconfig["ItemFieldDefinition"][a]["type"]) {
                  case "string":
                    body1x["type"] = "Input.Text";
                    body1x["style"] = "text";
                    break;
                  case "Date":
                    //  Input.Date
                    body1x["type"] = "Input.Date";
                    body1x["style"] = "";
                    break;
                  case "hyperlink":
                    // Input.Text
                    body1x["type"] = "Input.Text";
                    body1x["style"] = "url";
                    break;
                  case "Email":
                    //"style": "email",
                    // Text >> Input.Text
                    body1x["type"] = "Input.Text";
                    body1x["style"] = "email";
                    break;
                  case "Time":
                    // Time >> Input.Time
                    body1x["type"] = "Input.Time";
                    body1x["style"] = "";
                    break;
                  case "Num,0":
                    // Number >> Input.Number
                    body1x["type"] = "Input.Number";
                    body1x["style"] = "";
                    break;
                  case "Num,1":
                    // Number >> Input.Number
                    body1x["type"] = "Input.Number";
                    body1x["style"] = "";
                    break;
                  case "Num,2":
                    // Number >> Input.Number
                    body1x["type"] = "Input.Number";
                    body1x["style"] = "";
                    break;
                  case "Num,3":
                    // Number >> Input.Number
                    body1x["type"] = "Input.Number";
                    body1x["style"] = "";
                    break;
                  default:
                    body1x["type"] = "Input.Text";
                    body1x["style"] = "text";
                    break;
                }
              }
            }
          }
        }
        //"style": "tel",
        // Toggle >> Input.Toggle
        // "type": "Input.Toggle",
        //"title": "I accept the terms and conditions",
        //"id": "Checked",
        //"wrap": true,
        //"value": "false",
        //"valueOn": "true",
        //"valueOff": "false"
        for (let a = 0; a < appconfig["ItemFieldDefinition"].length; a++) {
          if (appconfig["ItemFieldDefinition"][a]["name"] == e1) {
            if (appconfig["ItemFieldDefinition"][a]["adaptiveCard"] == "Main") {
              body.push(body2x);
              body2x = {};
              body.push(body1x);
              body1x = {};
            }
            if (
              appconfig["ItemFieldDefinition"][a]["adaptiveCard"] ==
              "Additional"
            ) {
              body2.push(body2x);
              body2x = {};
              body2.push(body1x);
              body1x = {};
            }
          }
        }
      });
    }

    aCard["sap.card"]["content"]["body"] = body;
    for (let m = 0; m < aCard["sap.card"]["content"]["actions"].length; m++) {
      if (
        aCard["sap.card"]["content"]["actions"][m]["type"] == "Action.ShowCard"
      ) {
        aCard["sap.card"]["content"]["actions"][m]["card"]["body"] = body2;
      }
      if (
        aCard["sap.card"]["content"]["actions"][m]["type"] == "Action.Submit"
      ) {
        console.log("table", mode);
        aCard["sap.card"]["content"]["actions"][m]["table"] = mode;
      }
    }
    return aCard;
  },
  analyticalNew: async function (appconfig, outData, style) {
    var deCard;
    let cardConfigFile1;
    if (appconfig["Controls"].hasOwnProperty("defaultGraph")) {
      deCard = appconfig["Controls"]["defaultGraph"];
    } else {
      deCard = "StackedBar";
    }
    if (style == "SAP") {
      switch (deCard) {
        case "StackedBar":
          cardConfigFile1 = "../cards/cardConfig/template_sap_StackedBar.json";
          break;
        case "StackedColumn":
          cardConfigFile1 =
            "../cards/cardConfig/template_sap_StackedColumn.json";
          break;
        case "Line":
          cardConfigFile1 = "../cards/cardConfig/template_sap_line.json";
          break;
        default:
          break;
      }
    } else {
      switch (deCard) {
        case "StackedBar":
          cardConfigFile1 =
            "../cards/cardConfig/template_google_StackedBar.json";
          break;
        case "StackedColumn":
          cardConfigFile1 =
            "../cards/cardConfig/template_google_StackedColumn.json";
          break;
        case "Line":
          cardConfigFile1 = "../cards/cardConfig/template_google_line.json";
          break;
        case "Gauge":
          cardConfigFile1 = "../cards/cardConfig/template_google_Gauge.json";
          break;
        case "addressMap":
          cardConfigFile1 =
            "../cards/cardConfig/template_google_addressMap.json";
          break;
        case "Histogram":
          cardConfigFile1 =
            "../cards/cardConfig/template_google_Histogram.json";
          break;
        case "TimeLine":
          cardConfigFile1 = "../cards/cardConfig/template_google_TimeLine.json";
          break;
        default:
          break;
      }
    }
    // Common Logic..
    let anacardConfig = require(cardConfigFile1);
    list1x = {};
    list1 = [];
    let s_dimension = new Set();
    for (let k = 0; k < outData.length; k++) {
      s_dimension.add(outData[k]["Status"]);
    }
    s_dimension.forEach((dim) => {
      dim_c = 0;
      list1x["Area"] = dim;
      for (let k = 0; k < outData.length; k++) {
        if (outData[k]["Status"] != undefined) {
          if (outData[k]["Status"] == dim) {
            dim_c = dim_c + 1;
            list1x["Value1"] = dim_c;
          }
        }
      }
      list1.push({ ...list1x });
      list1x = {};
    });
    if (style == "SAP") {
      let j_number = 10;
      let trend1 = "Down";
      let state1 = "Error";
      let details1 = "2019-2020";
      head1 = {};
      head1 = { ...anacardConfig["sap.card"].header };
      json1 = {
        ...anacardConfig["sap.card"].content.data.json,
      };
      anacardConfig["sap.card"].content.data.json.list = list1;
      js1 = {};
      js1 = { ...anacardConfig["sap.card"].header.data.json };
      js1["number"] = j_number;
      js1["trend"] = trend1;
      js1["state"] = state1;
      js1["details"] = details1;
      head1["data"]["json"] = { ...js1 };
      js1 = {};
      anacardConfig["sap.card"].header = { ...head1 };
      head1 = {};
      list1 = [];
      list1x = {};
    } else {
      switch (deCard) {
        case "StackedBar":
          // Google card ("StackedBar")
          anacardConfig["rows"];

          break;
        case "StackedColumn":
          // Google card ("StackedColumn")

          break;
        case "Line":
          // Google card ("Line")

          break;
        default:
          break;
      }
    }

    return anacardConfig;
  },
  sumAnalyticalCard: async function (myCard, outData, mode, FieldDef, style) {},
  countAnalyticalCard_hdr: async function (
    myCard,
    outData,
    mode,
    FieldDef,
    style,
    req,
    config1,
    ivalue
  ) {
    myData = [];
    if (myCard["Data"]["aggregate"] == "Yes") {
      if (
        myCard["Data"]["operation"] == "COUNT" ||
        myCard["Data"]["operation"] == "COLLECTIVE_COUNT"
      ) {
        // Aggregate data
        myData = await aggregateCount(
          req,
          myCard["Data"]["dimension"],
          myCard["Data"]["sorting"],
          config1,
          ivalue
        );
      } else {
        // Aggregate data
        myData = await aggregateSum(
          req,
          myCard["Data"]["dimension"],
          myCard["Data"]["fact"],
          myCard["Data"]["sorting"],
          config1,
          ivalue
        );
      }
    } else {
      // List data
      outData;

      switch (myCard["Data"]["dType"]) {
        case "string":
          //    outData = string(outData, myCard["Data"]["dimension"], "D");
          break;
        case "Date":
          outData = date1(
            outData,
            myCard["Data"]["dimension"],
            myCard["Data"]["sorting"]
          );
          break;
        case "Num,0":
          if (
            myCard["Data"]["sortField"] == "Count" ||
            myCard["Data"]["sortField"] == "Value"
          ) {
            outData = integer(
              outData,
              myCard["Data"]["dimension"],
              myCard["Data"]["sorting"]
            );
          } else {
          }

          break;
        default:
          break;
      }
    }
    myResult = [];
    myResultx = {};
    myResulty = {};
    t_total = 0;
    if (
      myCard["cardsubType"] == "StackedColumn" ||
      myCard["cardsubType"] == "StackedBar" ||
      myCard["cardsubType"] == "Line" ||
      myCard["cardsubType"] == "Donut"
    ) {
      for (let i = 0; i < myData.length; i++) {
        // Check if data type is Date
        if (myCard["Data"]["dType"] == "Date") {
          myResultx["Area"] = String(myData[i]["_id"]).substring(0, 10);
        } else {
          myResultx["Area"] = myData[i]["_id"];
        }
        // Check Operation..

        switch (myCard["Data"]["operation"]) {
          case "COUNT":
            myResultx["Value1"] = myData[i]["count"];
            break;
          case "COLLECTIVE_COUNT":
            t_total = t_total + myData[i]["count"];
            myResultx["Value1"] = t_total;
            myResultx["Value2"] = myData[i]["count"];
            break;
          case "SUM":
            myResultx["Value1"] = myData[i]["total"];
            break;
          case "COLLECTIVE_SUM":
            t_total = t_total + myData[i]["total"];
            myResultx["Value1"] = t_total;
            myResultx["Value2"] = myData[i]["total"];

            break;
          default:
            myResultx["Value1"] = myData[i]["count"];
            break;
        }
        myResult.push({ ...myResultx });
        myResultx = {};
      }
    }

    console.log("New Card Data", myResult);
    return myResult;

    //   f_typ = myCard["Data"]["dType"];

    // for (let g = 0; g < FieldDef.length; g++) {
    //   if (FieldDef[g]["name"] == myCard["Data"]["dimension"]) {
    //     f_typ = FieldDef[g]["type"];
    //   }
    // }
    // Perform Sorting..
    // switch (f_typ) {
    //   case "string":
    //     //    outData = string(outData, myCard["Data"]["dimension"], "D");
    //     break;
    //   case "Date":
    //     outData = date1(outData, myCard["Data"]["dimension"], "A");
    //     break;
    //   case "Num,0":
    //     outData = integer(outData, myCard["Data"]["dimension"], "A");
    //     break;
    //   default:
    //     break;
    // }
    //collect Date..
    // let d_dimension = new Set();
    // let s_dimension = new Set();
    // if (f_typ == "Date") {
    //   if (outData != undefined) {
    //     for (let k = 0; k < outData.length; k++) {
    //       d_dimension.add(
    //         String(outData[k][myCard["Data"]["dimension"]]).substring(0, 10)
    //       );
    //     }
    //   }
    // } else {
    //   if (outData != undefined) {
    //     for (let k = 0; k < outData.length; k++) {
    //       s_dimension.add(outData[k][myCard["Data"]["dimension"]]);
    //     }
    //   }
    // }
    // Collect unique values
    // list1x = {};
    // list1y = {};
    // list1 = [];
    // list1y["Value1"] = 0;
    // sTotal = 0;
    // if (f_typ == "Date") {
    //   d_dimension.forEach((dim) => {
    //     dim_c = 0;
    //     list1x["Area"] = dim;
    //     list1y["Area"] = dim;
    //     list1x["Value1"] = 0;
    //     if (outData != undefined) {
    //       for (let k = 0; k < outData.length; k++) {
    //         if (outData[k][myCard["Data"]["dimension"]] != undefined) {
    //           X1 = String(outData[k][myCard["Data"]["dimension"]]).substring(
    //             0,
    //             10
    //           );
    //           if (X1 == dim) {
    //             dim_c = dim_c + 1;
    //             sTotal = sTotal + 1;
    //             list1x["Value1"] = dim_c;
    //             list1y["Value1"] = sTotal;
    //           }
    //         }
    //       }
    //     }
    //     dim_c = 0;
    //     switch (mode) {
    //       case "COUNT":
    //         list1.push({ ...list1x });
    //         list1x = {};
    //         break;
    //       case "COLLECTIVE_COUNT":
    //         list1.push({ ...list1y });
    //         list1y = {};
    //         break;
    //       default:
    //         list1.push({ ...list1x });
    //         list1x = {};
    //         break;
    //     }
    //   });
    // } else {
    //   s_dimension.forEach((dim) => {
    //     dim_c = 0;
    //     list1x["Area"] = dim;
    //     list1y["Area"] = dim;
    //     list1x["Value1"] = 0;
    //     for (let k = 0; k < outData.length; k++) {
    //       if (outData[k][myCard["Data"]["dimension"]] != undefined) {
    //         if (outData[k][myCard["Data"]["dimension"]] == dim) {
    //           dim_c = dim_c + 1;
    //           sTotal = sTotal + 1;
    //           list1x["Value1"] = dim_c;
    //           list1y["Value1"] = sTotal;
    //         }
    //       }
    //     }
    //     dim_c = 0;
    //     switch (mode) {
    //       case "COUNT":
    //         list1.push({ ...list1x });
    //         list1x = {};
    //         break;
    //       case "COLLECTIVE_COUNT":
    //         list1.push({ ...list1y });
    //         list1y = {};
    //         break;
    //       default:
    //         list1.push({ ...list1x });
    //         list1x = {};
    //         break;
    //     }
    //   });
    // }
    //    return list1;
  },
  countAnalyticalCard: async function (
    myCard,
    outData,
    mode,
    FieldDef,
    style,
    req,
    config1,
    ivalue
  ) {
    aggCount = await aggregateCount(
      req,
      myCard["Data"]["dimension"],
      "Descending",
      config1,
      ivalue
    );
    f_typ = "string";

    for (let g = 0; g < FieldDef.length; g++) {
      if (FieldDef[g]["name"] == myCard["Data"]["dimension"]) {
        f_typ = FieldDef[g]["type"];
      }
    }
    // Perform Sorting..
    switch (f_typ) {
      case "string":
        //    outData = string(outData, myCard["Data"]["dimension"], "D");
        break;
      case "Date":
        outData = date1(outData, myCard["Data"]["dimension"], "A");
        break;
      case "Num,0":
        outData = integer(outData, myCard["Data"]["dimension"], "A");
        break;
      default:
        break;
    }
    //collect Date..
    let d_dimension = new Set();
    let s_dimension = new Set();
    if (f_typ == "Date") {
      if (outData != undefined) {
        for (let k = 0; k < outData.length; k++) {
          d_dimension.add(
            String(outData[k][myCard["Data"]["dimension"]]).substring(0, 10)
          );
        }
      }
    } else {
      if (outData != undefined) {
        for (let k = 0; k < outData.length; k++) {
          s_dimension.add(outData[k][myCard["Data"]["dimension"]]);
        }
      }
    }
    // Collect unique values
    list1x = {};
    list1y = {};
    list1 = [];
    list1y["Value1"] = 0;
    sTotal = 0;
    if (f_typ == "Date") {
      d_dimension.forEach((dim) => {
        dim_c = 0;
        list1x["Area"] = dim;
        list1y["Area"] = dim;
        list1x["Value1"] = 0;
        if (outData != undefined) {
          for (let k = 0; k < outData.length; k++) {
            if (outData[k][myCard["Data"]["dimension"]] != undefined) {
              X1 = String(outData[k][myCard["Data"]["dimension"]]).substring(
                0,
                10
              );
              if (X1 == dim) {
                dim_c = dim_c + 1;
                sTotal = sTotal + 1;
                list1x["Value1"] = dim_c;
                list1y["Value1"] = sTotal;
              }
            }
          }
        }
        dim_c = 0;
        switch (mode) {
          case "COUNT":
            list1.push({ ...list1x });
            list1x = {};
            break;
          case "COLLECTIVE_COUNT":
            list1.push({ ...list1y });
            list1y = {};
            break;
          default:
            list1.push({ ...list1x });
            list1x = {};
            break;
        }
      });
    } else {
      s_dimension.forEach((dim) => {
        dim_c = 0;
        list1x["Area"] = dim;
        list1y["Area"] = dim;
        list1x["Value1"] = 0;
        for (let k = 0; k < outData.length; k++) {
          if (outData[k][myCard["Data"]["dimension"]] != undefined) {
            if (outData[k][myCard["Data"]["dimension"]] == dim) {
              dim_c = dim_c + 1;
              sTotal = sTotal + 1;
              list1x["Value1"] = dim_c;
              list1y["Value1"] = sTotal;
            }
          }
        }
        dim_c = 0;
        switch (mode) {
          case "COUNT":
            list1.push({ ...list1x });
            list1x = {};
            break;
          case "COLLECTIVE_COUNT":
            list1.push({ ...list1y });
            list1y = {};
            break;
          default:
            list1.push({ ...list1x });
            list1x = {};
            break;
        }
      });
    }
    return list1;
    //const sortedActivities = string(activities,"string");
    //const sortedActivities = integer(activities,"integer");
    // // Change Date Format
    // if (f_typ == "Date") {
    //   for (let k = 0; k < outData.length; k++) {
    //     outData[k]["dimension"] = String(
    //       outData[k][myCard["Data"]["dimension"]]
    //     ).substring(0, 10);
    //   }
    // }

    // switch (f_typ) {
    //   case "string":
    //     break;
    //   case "Date":
    //     let d_dimension = new Set();
    //     for (let k = 0; k < outData.length; k++) {
    //       d_dimension.add(
    //         String(outData[k][myCard["Data"]["dimension"]]).substring(0, 10)
    //       );
    //     }
    //     break;

    //   default:
    //     //string
    //     break;
    // }
    // Count

    // fl = [];
    // s_dimension.forEach((dim) => {
    //   if (fl.length == 0) {
    //     fl.push(dim);
    //   }
    //   match = false;
    //   fl.forEach((l1) => {
    //     if (l1 === dim) {
    //       match = true;
    //     }
    //   });
    //   if (match == false) {
    //     fl.push(dim);
    //   }
    // });
    // fl = fl.sort();
  },
  numericHeader: async function (myCard, list, mode) {
    hdr = {};
    hdr["number"] = 0;
    switch (myCard["numericHeader"]["headerNumber"]["Operation"]) {
      case "COUNT":
        for (let m = 0; m < list.length; m++) {
          hdr["number"] = hdr["number"] + list[m]["Value1"];
        }
        break;
      case "COLLECTIVE":
        for (let m = 0; m < list.length; m++) {
          hdr["number"] = list[m]["Value1"];
        }
        break;
      default:
        for (let m = 0; m < list.length; m++) {
          hdr["number"] = hdr["number"] + list[m]["Value1"];
        }
        break;
    }

    if (hdr["number"] <= myCard["numericHeader"]["trend"]["value"]) {
      hdr["trend"] = "DOWN";
    } else {
      hdr["trend"] = "UP";
    }
    if (hdr["number"] <= myCard["numericHeader"]["status"]["value"]) {
      hdr["state"] = "Success";
    } else {
      hdr["state"] = "Error";
    }
    hdr["details"] = myCard["numericHeader"]["details"];
    return hdr;
  },
  buildAnalyticalCard: async function (myCard, list, numheader, style, kl) {
    let cardTemplate = {};
    if (style == "SAP") {
      cardTemplate =
        "../cards/cardConfig/template_sap_" + myCard["cardsubType"] + ".json";
    } else {
      cardTemplate =
        "../cards/cardConfig/template_google_" +
        myCard["cardsubType"] +
        ".json";
    }
    let anacardConfig = require(cardTemplate);
    if (style == "SAP") {
      anacardConfig["sap.card"].content.data.json.list = list;
      js1 = { ...anacardConfig["sap.card"].header.data.json };
      js1["number"] = numheader["number"];
      js1["trend"] = numheader["trend"];
      js1["state"] = numheader["state"];
      js1["details"] = numheader["details"];
      anacardConfig["sap.card"]["header"]["data"]["json"] = { ...js1 };
      js1 = {};
    } else {
      if (
        myCard["cardsubType"] == "StackedBar" ||
        myCard["cardsubType"] == "StackedColumn" ||
        myCard["cardsubType"] == "gauge"
      ) {
        anacardConfig["rows"] = list;
      }

      anacardConfig["cardid"] = kl;
    }
    return anacardConfig;
  },
};
