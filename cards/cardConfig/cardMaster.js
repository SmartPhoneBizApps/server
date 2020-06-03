card = {};
cardSub1 = {};
header = {};
content = {};
actions = {};
body = {};
icon = {};

const cardbody = require("../../cards/adaptivecardforms/SUPP00018.json");
const cardaction = require("../../cards/adaptivecardforms/SUPP00018_action.json");

card["sap.app"] = {
  type: "card",
  id: "smartphoneapps",
};

card["cardMinRows"] = 4;
card["cardColumn"] = 4;

header["title"] = "Book Taxi";
header["subTitle"] = "Booking App for Taxi";
icon["src"] = "sap-icon://form";
header["icon"] = icon;
cardSub1["header"] = header;

cardSub1["type"] = "AdaptiveCard";

content["$schema"] = "http://adaptivecards.io/schemas/adaptive-card.json";
content["type"] = "AdaptiveCard";
content["version"] = "1.0";
content["body"] = cardbody;
content["body"] = cardaction;
cardSub1["content"] = content;

card["sap.card"] = cardSub1;
