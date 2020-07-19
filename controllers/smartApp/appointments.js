const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
} = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.appointmentsGenerate = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.appointmentsGet = asyncHandler(async (req, res, next) => {
  console.log(req.query);

  let fn3 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn3);

  // Get Table Schema
  //  let path = "../../models/smartApp/" + req.headers.applicationid;
  // const model = require(path);

  let query = readData(req.headers.applicationid, req, config1);
  let results = await query;
  // console.log(results);

  slot = {};
  let drSch = [];
  let SlotLen = 0;
  // Appointment Schedule
  let fn1 = "../../NewConfig/appointmentSchedule.json";
  var appSchedule = require(fn1);
  // Doctor Schedule
  let fn2 = "../../NewConfig/appointmentDoctors.json";
  var drSchedule = require(fn2);
  // Appointment Date
  startTime = new Date(req.query.Date);
  endTime = new Date(req.query.Date);
  drstartTime = new Date(req.query.Date);
  drendTime = new Date(req.query.Date);
  // Find Day
  day1 = startTime.getDay();
  console.log(day1);

  for (let a = 0; a < appSchedule["Chairs"].length; a++) {
    for (const key in appSchedule["Chairs"][a]) {
      //     console.log("AG", appSchedule["Chairs"][a][key]);
      if (key == req.query.ChairID) {
        console.log("AA", appSchedule["Chairs"][a][key]);
        console.log("AG", key);
        console.log("AG", appSchedule["Chairs"][a][key]);
        BeginTime = appSchedule["Chairs"][a][key][day1]["BeginTime"];
        CloseTime = appSchedule["Chairs"][a][key][day1]["CloseTime"];
        SlotLen = appSchedule["Chairs"][a][key]["SlotLen"];
        startTime.setMinutes(BeginTime.split(":")[1]);
        startTime.setHours(BeginTime.split(":")[0]);
        endTime.setMinutes(CloseTime.split(":")[1]);
        endTime.setHours(CloseTime.split(":")[0]);
      }
    }
  }
  for (let a = 0; a < drSchedule["Chairs"].length; a++) {
    drSch = drSchedule["Chairs"][a][req.query.ChairID][day1];
  }

  data = [];
  stHrs =
    startTime.getHours() > 9
      ? "" + startTime.getHours()
      : "0" + startTime.getHours();
  stMin =
    startTime.getMinutes() > 9
      ? "" + startTime.getMinutes()
      : "0" + startTime.getMinutes();

  slotStart = stHrs + ":" + stMin;
  let cnt = 0;
  while (startTime < endTime) {
    scStart = startTime;
    scEnd = startTime.setMinutes(startTime.getMinutes() + SlotLen);

    for (let p = 0; p < drSch.length; p++) {
      const ep = drSch[p];
      drBeginTime = drSch[p]["BeginTime"];
      drCloseTime = drSch[p]["CloseTime"];
      drstartTime.setMinutes(drBeginTime.split(":")[1]);
      drstartTime.setHours(drBeginTime.split(":")[0]);
      drendTime.setMinutes(drCloseTime.split(":")[1]);
      drendTime.setHours(drCloseTime.split(":")[0]);

      if (startTime >= drstartTime && startTime <= drendTime) {
        slot["DoctorID"] = drSch[p]["DoctorID"];
        slot["DoctorName"] = drSch[p]["DoctorName"];
        if (drSch[p]["BusinessStatus"] == "Break") {
          slot["Status"] = 2;
          slot["PatientName"] = "Break";
        } else {
          slot["Status"] = 0;
          slot["PatientName"] = "Free";
        }
      }
    }

    stHrs =
      startTime.getHours() > 9
        ? "" + startTime.getHours()
        : "0" + startTime.getHours();
    stMin =
      startTime.getMinutes() > 9
        ? "" + startTime.getMinutes()
        : "0" + startTime.getMinutes();

    endSlot = stHrs + ":" + stMin;
    slot["ID"] = cnt;
    slot["ChairID"] = req.query.ChairID;
    slot["Date"] = startTime;
    slot["Time"] = slotStart + "-" + endSlot;
    slot["SlotLength"] = 1;
    slot["PatientID"] = "";

    for (let k = 0; k < results.length; k++) {
      console.log(results[k]["Time"], slot["Time"]);
      if (results[k]["Time"] == slot["Time"]) {
        slot["PatientID"] = results[k]["PatientID"];
        slot["PatientName"] = results[k]["PatientName"];
        slot["Status"] = results[k]["Status"];
        console.log(slot["PatientID"]);
      }
    }

    cnt = cnt + 1;
    data.push({ ...slot });
    slot = {};

    slotStart = stHrs + ":" + stMin;
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});
