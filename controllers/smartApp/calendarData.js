const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { getPVConfig, getPVQuery, findOneApp } = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.calendarData = asyncHandler(async (req, res, next) => {
  const application = await findOneApp(req.params.id);
  let fn1 =
    "../../NewConfig/" +
    req.params.id +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);
  /// Possible values..
  pvconfig1 = getPVConfig(req.params.id, req.headers.businessrole);
  qPV = getPVQuery(req.params.id, req.headers.businessrole, pvconfig1);
  let resPV = await qPV;

  // Get Table Schema
  let path = "../../models/smartApp/" + req.params.id;
  const model = require(path);

  // Get total Count
  let query_c = getTotalCount(req.params.id, req, config1);
  let rec = await query_c;
  const count = rec.length;

  let query = readData(req.params.id, req, config1);
  let results = await query;

  temp = {};
  temp2 = [];
  person = {};
  person1 = {};
  people = [];
  let fn = "../../cards/calendarCard/calendarTemplate.json";
  var res2 = require(fn);

  for (let i = 0; i < results.length; i++) {
    const element = results[i];

    if (element.calendar !== undefined) {
      person["name"] = element["Title"];
      person["role"] = element["SubGroup"];
      person["pic"] =
        "https://www.espncricinfo.com/inline/content/image/1224532.html";
      for (let x = 0; x < element.calendar.length; x++) {
        temp = { ...element.calendar[x] };
        if (element.calendar[x].title) {
          temp["icon"] = "sap-icon://desktop-mobile";
          temp["type"] = "Type06";
          temp["start"] = temp["startDate"];
          temp["end"] = temp["endDate"];
          temp["ID"] = element.ID;
          temp2.push(temp);
          temp = {};
        }
      }
    }

    person["appointments"] = temp2;

    if (temp2.length > 0) {
      people.push(person);
    }
    temp2 = [];
    person = {};
    person1["title"] = "Training Calendar";
    person1["startDate"] = "2020-07-09T08:00";
    person1["people"] = people;
  }
  let fn2 = "../../cards/calendarCard/TRAIN008_EmployeeLearn_new.json";
  var res1 = require(fn2);
  res.status(200).json({
    success: true,
    data: person1,
  });
});
