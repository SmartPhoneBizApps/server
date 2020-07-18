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
  startTime = new Date(req.params.date);
  endTime = new Date(req.params.date);
  drstartTime = new Date(req.params.date);
  drendTime = new Date(req.params.date);
  // Find Day
  day1 = startTime.getDay();
  console.log(day1);

  for (let a = 0; a < appSchedule["Chairs"].length; a++) {
    for (const key in appSchedule["Chairs"][a]) {
      //     console.log("AG", appSchedule["Chairs"][a][key]);
      if (key == req.params.chr) {
        console.log("AG", key);
        console.log("AG", appSchedule["Chairs"][a][key]);
        BeginTime = appSchedule["Chairs"][a][key][day1]["BeginTime"];
        CloseTime = appSchedule["Chairs"][a][key][day1]["CloseTime"];
        SlotLen = Number(appSchedule["Chairs"][a][key][day1]["SlotLen"]);
        startTime.setMinutes(BeginTime.split(":")[1]);
        startTime.setHours(BeginTime.split(":")[0]);
        endTime.setMinutes(CloseTime.split(":")[1]);
        endTime.setHours(CloseTime.split(":")[0]);
      }
    }
  }
  for (let a = 0; a < drSchedule["Chairs"].length; a++) {
    drSch = drSchedule["Chairs"][a][req.params.chr][day1];
    console.log(drSch);
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
    scEnd = startTime.setMinutes(startTime.getMinutes() + 5);

    for (let p = 0; p < drSch.length; p++) {
      const ep = drSch[p];
      drBeginTime = drSch[p]["BeginTime"];
      drCloseTime = drSch[p]["CloseTime"];
      drstartTime.setMinutes(drBeginTime.split(":")[1]);
      drstartTime.setHours(drBeginTime.split(":")[0]);
      drendTime.setMinutes(drCloseTime.split(":")[1]);
      drendTime.setHours(drCloseTime.split(":")[0]);
      //  console.log(drstartTime, drendTime, drSch[p]["DoctorName"]);
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
    slot["ChairID"] = req.params.chr;
    slot["Date"] = startTime;
    slot["Time"] = slotStart + " - " + endSlot;
    slot["SlotLength"] = 1;
    slot["PatientID"] = "";

    if (cnt == 5) {
      slot["PatientName"] = "Divyesh T";
      slot["Status"] = 1;
    }
    if (cnt == 3) {
      slot["PatientName"] = "Roshni Gupta";
      slot["Status"] = 1;
    }
    if (cnt == 12) {
      slot["PatientName"] = "Atul Gupta";
      slot["Status"] = 1;
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
