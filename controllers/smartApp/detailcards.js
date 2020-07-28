const { readData } = require("../../modules/config2");
const {
  getCard,
  findOneAppDatabyid,
  getNewConfig,
} = require("../../modules/config");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  // Read Global Card Configuration
  let t_item = {};
  let t_type = "";
  let xjson = {};
  let timeline1_json = [];
  var mycard = {};
  let json = [];
  let rec1 = {};
  let outStru = {};
  let list2_json = [];
  let donut_content = [];
  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);

  // Read Data
  let query = readData(req.params.app, req, appconfig);
  let results = await query;

  // Global Cards
  let fileName2q = "../../cards/cardConfig/ALL_cardConfig.json";
  var GlobalCardConfig = require(fileName2q);

  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);

  // Read Color Configuration
  let fileNameColor = "../../config/colorConfig.json";
  var colorConfig = require(fileNameColor);
  let json_table1 = [];
  let xj_table1 = {};
  let col_table1 = [];
  let xc_table1 = {};
  for (let m = 0; m < results.length; m++) {
    // App Specific Cards...(Table cards)
    t_type = "table1";
    for (const key in appconfig["tableConfig"]) {
      tabFields = appconfig["tableConfig"][key]["DisplayFields"];
      for (let w = 0; w < results[m][key].length; w++) {
        mycard["businessrole"] = req.params.role;
        mycard["applicationid"] = req.params.app;
        mycard["title"] = appconfig["tableConfig"][key]["title"];
        mycard["subTitle"] = "Recent Transactions";

        if (results[m]["ID"] == appData["ID"]) {
          for (let b = 0; b < tabFields.length; b++) {
            xc_table1["title"] = tabFields[b];
            xc_table1["value"] = "{" + tabFields[b] + "}";
            xc_table1["identifier"] = false;
            col_table1.push({ ...xc_table1 });
            xj_table1[tabFields[b]] = results[m][key][w][tabFields[b]];
          }
          json_table1.push({ ...xj_table1 });
          xj_table1 = {};
          rec1 = getCard(
            mycard,
            t_type,
            results,
            json,
            t_item,
            list2_json,
            donut_content,
            timeline1_json,
            col_table1,
            json_table1
          );
          let st1 = t_type + "_" + results[m]["ID"] + "_" + key;
          outStru[st1] = { ...rec1 };
          console.log(rec1);
          rec1 = {};
        }
      }
    }

    // Global Cards...
    for (let a = 0; a < GlobalCardConfig.length; a++) {
      t_type = GlobalCardConfig[a]["cardType"];
      mycard["title"] = GlobalCardConfig[a]["title"];
      mycard["subTitle"] = GlobalCardConfig[a]["subTitle"];
      mycard["HeaderActionURL"] = GlobalCardConfig[a]["HeaderActionURL"];
      mycard["statusText"] = GlobalCardConfig[a]["statusText"];
      mycard["HeaderIcon"] = GlobalCardConfig[a]["HeaderIcon"];
      if (GlobalCardConfig[a]["cardType"] == "timeline1") {
        t_item = GlobalCardConfig[a]["ListItem"]["item"];

        if (results[m]["ID"] == appData["ID"]) {
          timeline1_json = [];
          for (let n = 0; n < results[m]["TransLog"].length; n++) {
            xjson["Icon"] = "sap-icon://accept";
            xjson["Title"] = results[m]["TransLog"][n]["Comment"];
            if (results[m]["TransLog"][n].hasOwnProperty("buttonName")) {
              xjson["Title"] =
                xjson["Title"] +
                " >> " +
                results[m]["TransLog"][n]["buttonName"];
              xjson["Icon"] =
                GlobalCardConfig[a]["Icons"][
                  results[m]["TransLog"][n]["buttonName"]
                ];
            }
            xjson["Time"] = new Date(results[m]["TransLog"][n]["TimeStamp"]);
            xjson["Description"] = results[m]["TransLog"][n]["UserName"];
            if (results[m]["TransLog"][n].hasOwnProperty("UserComment")) {
              xjson["Description"] =
                xjson["Description"] +
                " >> " +
                results[m]["TransLog"][n]["UserComment"];
            }
            timeline1_json.push({ ...xjson });
            xjson = {};
          }
          rec1 = getCard(
            mycard,
            t_type,
            results,
            json,
            t_item,
            list2_json,
            donut_content,
            timeline1_json,
            col_table1,
            json_table1
          );
          let st1 = t_type + "_" + results[m]["ID"];
          outStru[st1] = { ...rec1 };
          rec1 = {};
        }
      }
    }
  }

  res.status(200).json({ success: true, data: outStru });
};
