// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.deleteAll = async (req, res, next) => {
  let path = "../../models/appSetup/" + req.params.app;
  const Model = require(path);
  try {
    await Model.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    res.status(200).json({
      success: true,
      message: "Records is removed",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: "Problem with deletion",
    });
  }
};
