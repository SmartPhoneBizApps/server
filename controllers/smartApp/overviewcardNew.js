const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");
const { getCard } = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.overviewcardNew = async (req, res, next) => {
  let result = {};
  // Read Color Configuration
  console.log(req.headers.mycard);

  var mycard = {};
  mycard["title"] = "SmartApp App";
  mycard["subTitle"] = "List of Items";
  mycard["headerIcon"] = "sap-icon://form";
  mycard["businessrole"] = req.headers.businessrole;
  mycard["applicationid"] = "EMP00001";
  mycard["HeaderIcon"] = "sap-icon://bus-public-transport";
  mycard["HeaderActionURL"] = "https://smartphonebizapps.com/";
  mycard["statusText"] = "Status Text 001";

  let fn1 =
    "../../NewConfig/" +
    "EMP00001" +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);
  console.log(fn1);

  //mycard["Type"] = "sap-icon://form";
  let query = readData("EMP00001", req, config1);
  let results = await query;
  list1_item = {
    icon: {
      src: "{icon}",
    },
    title: {
      value: "{name}",
    },
    description: {
      value: "{description}",
    },
    info: {
      value: "{info}",
      state: "{infoState}",
    },
  };

  list2_item = {
    icon: {
      src: "{icon}",
    },
    title: {
      value: "{name}",
    },
    description: {
      value: "{description}",
    },
    actions: [
      {
        type: "Navigation",
        parameters: {
          url: "/appID/{name}",
        },
      },
    ],
  };
  list2_json = [
    {
      name: "Alain Chevalier",
      icon: "sap-icon://sap-ui5",
      description: "On Site",
    },
    {
      name: "Yolanda Barrueco",
      icon: "sap-icon://sap-ui5",
      description: "Travelling to Idaho",
    },
    {
      name: "Arend Pellewever",
      icon: "sap-icon://sap-ui5",
      description: "Travelling to Idaho",
    },
    {
      name: "Lean Pulp",
      icon: "sap-icon://sap-ui5",
      description: "Headquaters Support",
    },
  ];
  list1_json = [
    {
      name: "Teico Inc.",
      icon: "sap-icon://inbox",
      description: "Sun Valley, Idaho",
      info: "2456",
      infoState: "Error",
    },
    {
      name: "Freshhh LTD.",
      icon: "sap-icon://sap-ui5",
      description: "Dayville, Oregon",
      info: "1264",
      infoState: "Warning",
    },
    {
      name: "Lean Pulp",
      icon: "http://localhost/smartphonebizapps/appattachment/158644357443.png",
      description: "Raymond, Callifornia",
      info: "236",
      infoState: "None",
    },
  ];

  timeline1_json = [
    {
      Title: "Call Donna Mendez",
      Icon: "sap-icon://outgoing-call",
      Time: "9:15 AM",
    },
    {
      Title: "Incidents Status - Online",
      Icon: "sap-icon://my-view",
      Time: "10:00 - 11:00",
    },
    {
      Title: "Site Visit - Peach Valley",
      Description: "San Joaquin valley",
      Icon: "sap-icon://appointment-2",
      Time: "12:00 - 17:00",
    },
  ];

  donut_content = {
    chartType: "Donut",
    legend: {
      visible: true,
      position: "Bottom",
      alignment: "Left",
    },
    plotArea: {
      dataLabel: {
        visible: true,
        showTotal: true,
      },
    },
    title: {
      visible: false,
    },
    measureAxis: "size",
    dimensionAxis: "color",
    data: {
      json: {
        measures: [
          {
            measureName: "Storm Wind",
            value: 1564235.29,
          },
          {
            measureName: "Storm Wind",
            value: 157913.07,
          },
          {
            measureName: "Rain",
            value: 1085567.22,
          },
          {
            measureName: "Rain",
            value: 245609.486884,
          },
          {
            measureName: "Temperature",
            value: 345292.06,
          },
          {
            measureName: "Temperature",
            value: 82922.07,
          },
        ],
      },
      path: "/measures",
    },
    dimensions: [
      {
        label: "Measure Name",
        value: "{measureName}",
      },
    ],
    measures: [
      {
        label: "Value",
        value: "{value}",
      },
    ],
  };

  //console.log(results);
  if (config1["cardData"]) {
    for (let k = 0; k < config1["cardData"].length; k++) {
      if (config1["cardData"][k]["table1"]) {
        mycard["TableFields"] = config1["cardData"][k]["TableFields"];
        result = getCard(
          mycard,
          req.headers.mycard,
          results,
          list1_json,
          list1_item,
          list2_json,
          list2_item,
          donut_content
        );
      }
    }
  }

  res.status(200).json({ success: true, data: result });
};
