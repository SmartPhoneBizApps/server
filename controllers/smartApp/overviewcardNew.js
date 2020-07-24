const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");
const { getCard } = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
const { json } = require("express");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.overviewcardNew = async (req, res, next) => {
  let result = {};
  // Read Color Configuration
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

  //mycard["Type"] = "sap-icon://form";
  let query = readData("EMP00001", req, config1);
  let results = await query;

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
  let xjson = {};
  let json = [];
  //console.log(results);
  if (config1["cardSetup"]) {
    for (let k = 0; k < config1["cardSetup"].length; k++) {
      if (config1["cardSetup"][k]["cardType"] == req.headers.mycard) {
        t_item = config1["cardSetup"][k]["item"];
        console.log(config1["cardSetup"][k]["json"]);

        if (
          req.headers.mycard == "list1" ||
          req.headers.mycard == "list2" ||
          req.headers.mycard == "timeline1"
        ) {
          for (let n = 0; n < results.length; n++) {
            for (let m = 0; m < config1["cardSetup"][k]["json"].length; m++) {
              var ele1 = config1["cardSetup"][k]["json"][m];
              for (const key in ele1) {
                console.log("222", key, ele1[key]);
                arr1 = ele1[key].split("+");
                for (let s = 0; s < arr1.length; s++) {
                  if (key == "infoState") {
                    xjson["infoState"] = arr1[s];
                  }
                  if (results[n][arr1[s]] != undefined) {
                    console.log(results[n][arr1[s]]);
                    if (key == "name") {
                      xjson["name"] = results[n][arr1[s]];
                    }
                    if (key == "icon") {
                      xjson["icon"] = "sap-icon://" + results[n][arr1[s]];
                    }
                    if (key == "info") {
                      xjson["info"] = results[n][arr1[s]];
                    }

                    if (key == "description") {
                      //    arr2 = String(results[n][arr1[s]]).split("T")[0];
                      //   console.log(arr2);
                      if (s == 0) {
                        xjson["description"] = results[n][arr1[s]];
                      } else {
                        xjson["description"] =
                          xjson["description"] + " " + results[n][arr1[s]];
                      }
                    }
                  }
                }
                console.log("KK", arr1);
                arr1 = [];
              }
            }
            json.push({ ...xjson });
            xjson = {};
            console.log("jsonData", json);
          }
        }

        mycard["TableFields"] = config1["cardSetup"][k]["TableFields"];
        result = getCard(
          mycard,
          req.headers.mycard,
          results,
          json,
          t_item,
          list2_json,
          donut_content,
          timeline1_json
        );
      }
    }
  }

  res.status(200).json({ success: true, data: result });
};
