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
  let fn1 = "../../NewConfig/appointmentSchedule.json";
  var appSchedule = require(fn1);
  console.log("Date", req.params.date);
  console.log("Chair", req.params.chr);
  var date1 = new Date(req.params.date);
  day1 = date1.getDay();
  console.log("Day", day1);

  for (let a = 0; a < appSchedule["Chairs"].length; a++) {
    console.log("Day", appSchedule["Chairs"][a][req.params.chr][day1]);
    StartTime = appSchedule["Chairs"][a][req.params.chr][day1]["BeginTime"];
    endHours = appSchedule["Chairs"][a][req.params.chr][day1]["CloseTime:"];
  }

  data = [];

  year = "2020";
  month = "07";
  day = "10";
  startHours = "09";
  startMinutes = "00";

  endMinutes = "00";
  var startTime = new Date(year, month, day, startHours, startMinutes);
  var finalendTime = new Date(year, month, day, endHours, endMinutes);

  stHrs =
    startTime.getHours() > 9
      ? "" + startTime.getHours()
      : "0" + startTime.getHours();
  stMin =
    startTime.getMinutes() > 9
      ? "" + startTime.getMinutes()
      : "0" + startTime.getMinutes();

  slotStart = stHrs + ":" + stMin;

  while (startTime < finalendTime) {
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
    slotStart = stHrs + ":" + stMin;
  }

  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.appointmentsGet = asyncHandler(async (req, res, next) => {
  data = [];

  res.status(200).json({
    success: true,
    data: data,
  });
});
