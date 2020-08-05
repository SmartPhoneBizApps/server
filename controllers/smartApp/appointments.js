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
  selectedChairs = [];
  // Read Config File
  let fn3 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn3);
  // Read Appointment Schedule
  let fn1 = "../../NewConfig/appointmentSchedule.json";
  var appSchedule = require(fn1);
  // Read Doctor Schedule
  let fn2 = "../../NewConfig/appointmentDoctors.json";
  var drSchedule = require(fn2);

  for (let k = 0; k < appSchedule["Chairs"].length; k++) {
    if (req.query.ChairID == appSchedule["Chairs"][k]["ID"]) {
      selectedChairs.push(appSchedule["Chairs"][k]["ID"]);
    } else if (req.query.ChairID == "ALL") {
      selectedChairs.push(appSchedule["Chairs"][k]["ID"]);
    }
  }
  query1 = {};
  // Get Appointment Data
  if (req.query.ChairID == "ALL") {
    for (const key in req.query) {
      if (key != "ChairID") {
        query1[key] = req.query[key];
      }
    }
    req.query = { ...query1 };
  }
  let query = readData(req.headers.applicationid, req, config1);
  console.log("AG", query);
  let results = await query;

  outData = {};
  tab_outData = [];
  slot = {};
  let drSch = [];
  let SlotLen = 0;

  // Appointment Date
  outDate = new Date(req.query.Date);
  startTime = new Date(req.query.Date);
  endTime = new Date(req.query.Date);
  drstartTime = new Date(req.query.Date);
  drendTime = new Date(req.query.Date);
  day1 = startTime.getDay();

  let data = [];
  for (let a = 0; a < appSchedule["Chairs"].length; a++) {
    if (selectedChairs.includes(appSchedule["Chairs"][a]["ID"])) {
      let cnt = 0;
      outData["ChairName"] = appSchedule["Chairs"][a]["Name"];
      outData["ChairID"] = appSchedule["Chairs"][a]["ID"];
      BeginTime = appSchedule["Chairs"][a]["Slots"][day1]["BeginTime"];
      CloseTime = appSchedule["Chairs"][a]["Slots"][day1]["CloseTime"];
      SlotLen = appSchedule["Chairs"][a]["SlotLen"];
      startTime.setMinutes(BeginTime.split(":")[1]);
      startTime.setHours(BeginTime.split(":")[0]);
      endTime.setMinutes(CloseTime.split(":")[1]);
      endTime.setHours(CloseTime.split(":")[0]);

      for (let a = 0; a < drSchedule["Chairs"].length; a++) {
        // Check this loop for performance
        drSch = drSchedule["Chairs"][a][appSchedule["Chairs"][a]["ID"]][day1];
      }
      stHrs =
        startTime.getHours() > 9
          ? "" + startTime.getHours()
          : "0" + startTime.getHours();
      stMin =
        startTime.getMinutes() > 9
          ? "" + startTime.getMinutes()
          : "0" + startTime.getMinutes();
      slotStart = stHrs + ":" + stMin;
      while (startTime < endTime) {
        scStart = startTime;
        scEnd = startTime.setMinutes(startTime.getMinutes() + SlotLen);
        slot["Status"] = 0;
        slot["ChairName"] = outData["ChairName"];
        slot["ChairID"] = appSchedule["Chairs"][a]["ID"];
        console.log(appSchedule["Chairs"][a]["ID"]);

        // Add Doctor Details..
        for (let p = 0; p < drSch.length; p++) {
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
        //  slot["ChairID"] = req.query.ChairID;
        slot["Date"] = outDate;
        slot["Time"] = slotStart + "-" + endSlot;
        slot["SlotLength"] = "";
        slot["PatientID"] = "";

        for (let k = 0; k < results.length; k++) {
          if (
            results[k]["Time"] == slot["Time"] &&
            results[k]["ChairID"] == slot["ChairID"]
          ) {
            slot["PatientID"] = results[k]["PatientID"];
            slot["ID"] = results[k]["ID"];
            slot["PatientName"] = results[k]["PatientName"];
            slot["Status"] = results[k]["Status"];
            slot["Comments"] = results[k]["Comments"];
          }
        }

        cnt = cnt + 1;
        data.push({ ...slot });
        slot = {};
        slotStart = stHrs + ":" + stMin;
      }

      outData["Button"] = data;
      tab_outData.push({ ...outData });
      data = [];
      outData = {};
    }
  }

  res.status(200).json({
    success: true,
    chairID: appSchedule["chairID"],
    data: tab_outData,
  });
});
