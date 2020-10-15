const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("../../utils/errorResponse");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.botGroup = asyncHandler(async (req, res, next) => {
  req.params.bot = req.params.bot.toLowerCase();
  let fx = "../../bot/botGroups.json";
  var botGroup = require(fx);
  var retData = {};
  for (let k = 0; k < botGroup["Groups"].length; k++) {
    if (req.params.bot == botGroup["Groups"][k]["BOT"]) {
      retData = botGroup["Groups"][k];
    }
  }
  res.status(200).json(retData);
});
