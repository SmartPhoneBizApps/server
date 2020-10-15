const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");
const App = require("../../models/appSetup/App");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.botButtons = asyncHandler(async (req, res, next) => {
  let query1;
  query1 = App.find();
  const applist = await query1;
  app1 = req.params.applicationID;
  app2 = "GLOBAL";
  role1 = req.params.Role;
  role2 = "ALL";
  let query;

  query = Possval.find(
    {
      PossibleValues: req.params.PValue,
    },
    { _id: 0 }
  );
  const fields =
    "ApplicationID Role PossibleValues Value Description ColorSAP Score EditLock";
  query = query.select(fields);

  const sortBy = "ApplicationID Value";
  query = query.sort(sortBy);

  // Executing query
  const results = await query;
  res.status(200).json(results);
});
