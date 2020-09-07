// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.deleteRecord = async (req, res, next) => {
  let path = "../../models/smartApp/" + req.params.app;
  const Model = require(path);
  result = await Model.findOne({
    ID: req.params.ID,
  });

  if (result == undefined) {
    res.status(400).json({
      success: false,
      message: "Record not found",
    });
  } else {
    console.log(result);
    result.remove();
    res.status(200).json({
      success: true,
      data: result,
      message: "Record is removed",
    });
  }
};
