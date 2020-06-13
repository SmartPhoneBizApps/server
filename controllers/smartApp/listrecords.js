const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
} = require("../../modules/config");
const asyncHandler = require("../../middleware/async");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getListrecords = asyncHandler(async (req, res, next) => {
  let outData = res.advancedDataList;
  // Initial Values..
  var ivalue = getInitialValues(req.headers.applicationid);
  ival_out = [];
  ival = {};

  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
    console.log(ival_out);
  }
  // Add ID field in the Item Query... (Only for Items)
  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  query = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvconfig1
  );
  let results = await query;
  if (req.headers.mode == "BOTList") {
    buttonData = getButtonData(
      results,
      req.headers.applicationid,
      req.headers.businessrole
    );
  }
  if (req.headers.mode == "BOTList") {
    res.status(200).json({
      outData,
      buttons: buttonData,
    });
  }
  if (req.headers.mode == "BOTDetail") {
    res.status(200).json({
      outData,
    });
  }
  if (req.headers.mode == "Web" || req.headers.mode == "web") {
    res.status(200).json({
      outData,
      possibleValues: results,
      defaultValues: ival_out,
    });
  }
  if (!req.headers.mode) {
    res.status(200).json({
      outData,
      possibleValues: results,
      defaultValues: ival_out,
    });
  }
});
