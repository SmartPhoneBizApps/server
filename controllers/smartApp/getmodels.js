const Validationrule = require("../../models/smartApp/Validationrule");
// @desc      Get single app
// @route     GET /api/v1/smartapps/:id
// @access    Public
exports.getValidationrule = asyncHandler(async (req, res, next) => {
  const validationrules = await Validationrule.findOne({ rule: req.body.rule });
});
