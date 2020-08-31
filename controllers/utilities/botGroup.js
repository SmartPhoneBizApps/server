const asyncHandler = require("../../middleware/async");
const ErrorResponse = require("../../utils/errorResponse");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.botGroup = asyncHandler(async (req, res, next) => {
  console.log(req.params.bot);
  req.params.bot = req.params.bot.toLowerCase();
  console.log(req.params.bot);
  let fx = "../../bot/botGroups.json";
  var botGroup = require(fx);
  var retData = {};
  console.log(botGroup);
  for (let k = 0; k < botGroup["Groups"].length; k++) {
    console.log(botGroup["Groups"][k]["BOT"]);
    if (req.params.bot == botGroup["Groups"][k]["BOT"]) {
      retData = botGroup["Groups"][k];
    }
  }
  res.status(200).json(retData);
});
