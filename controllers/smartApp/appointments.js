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
  let fn1 = "../../NewConfig/appointmentSchedule.json";
  var appSchedule = require(fn1);
  console.log("Date", req.params.date);
  console.log("Chair", req.params.chr);
  startTime = new Date(req.params.date);
  endTime = new Date(req.params.date);

  day1 = startTime.getDay();
  console.log("Day", day1);

  for (let a = 0; a < appSchedule["Chairs"].length; a++) {
    console.log("Day", appSchedule["Chairs"][a][req.params.chr][day1]);
    BeginTime = appSchedule["Chairs"][a][req.params.chr][day1]["BeginTime"];
    CloseTime = appSchedule["Chairs"][a][req.params.chr][day1]["CloseTime"];
    startTime.setMinutes(BeginTime.split(":")[1]);
    startTime.setHours(BeginTime.split(":")[0]);
    endTime.setMinutes(CloseTime.split(":")[1]);
    endTime.setHours(CloseTime.split(":")[0]);
    console.log("StartDateTime", startTime);
    console.log("EndDateTime", endTime);
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

  while (startTime < endTime) {
    startTime.setMinutes(startTime.getMinutes() + 10);
    stHrs =
      startTime.getHours() > 9
        ? "" + startTime.getHours()
        : "0" + startTime.getHours();
    stMin =
      startTime.getMinutes() > 9
        ? "" + startTime.getMinutes()
        : "0" + startTime.getMinutes();

    endSlot = stHrs + ":" + stMin;
    console.log(slotStart, " - ", endSlot);

    slot["ChairID"] = req.params.chr;
    slot["Date"] = startTime;
    slot["Time"] = slotStart + " - " + endSlot;
    slot["SlotLength"] = 1;
    slot["PatientID"] = "";
    slot["PatientName"] = "Free";
    slot["DoctorID"] = "001";
    slot["DoctorName"] = "Dr. Aneel J";
    slot["Status"] = 0;

    data.push({ ...slot });
    slot = {};

    slotStart = stHrs + ":" + stMin;
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});
