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
  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);
  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);
  // Read Global Card Configuration for the Role (X1)
  let fileName =
    "../../cards/cardConfig/" + req.params.role + "_detailCardConfig.json";
  var cardConfig = require(fileName);
  // Read Color Configuration
  let fileNameColor = "../../config/colorConfig.json";
  var colorConfig = require(fileNameColor);

  // Read Global Card Configuration
  let t_item = {};
  let t_type = "";
  let t_title = "";
  let xjson = {};
  let timeline1_json = [];
  var mycard = {};
  let json = [];
  let rec1 = {};
  let outStru = {};
  let list2_json = [];
  let donut_content = [];

  // Read Data
  let query = readData(req.params.app, req, appconfig);
  let results = await query;

  let fileName2q = "../../cards/cardConfig/ALL_cardConfig.json";
  var GlobalCardConfig = require(fileName2q);

  for (let m = 0; m < results.length; m++) {
    for (let a = 0; a < GlobalCardConfig.length; a++) {
      t_type = GlobalCardConfig[a]["cardType"];
      mycard["businessrole"] = req.params.role;
      mycard["applicationid"] = req.params.app;
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
            xjson["Title"] = results[m]["TransLog"][n]["Comment"];

            if (results[m]["TransLog"][n].hasOwnProperty("buttonName")) {
              xjson["Title"] =
                xjson["Title"] +
                " >> " +
                results[m]["TransLog"][n]["buttonName"];
            }

            xjson["Title"] = results[m]["TransLog"][n]["Comment"];
            xjson["Icon"] = "sap-icon://outgoing-call";
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
            timeline1_json
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
