const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");

module.exports = {
  /*  fcGetPossibleValues: asyncHandler(async function (a, b) {
    app1 = a;
    app2 = "GLOBAL";
    role1 = b;
    role2 = "ALL";
    const fields = "PossibleValues Value Description ColorSAP Score EditLock";
    const newPv = "../../PossibleValues/" + a + "_" + b + "_pv.json";
    var pvconfig1 = require(newPv);
    let query;
    query = Possval.find(
      {
        PossibleValues: { $in: pvconfig1.PossFields },
        ApplicationID: { $in: [app1, app2] },
        Role: { $in: [role1, role2] },
      },
      { _id: 0 }
    );
    query = query.select(fields);
    // Executing query
    let results = await query;
    console.log("MyResult", results);
    return results;
  }), */

  sum: function (a, b) {
    return a + b;
  },
  isEven: function (a) {
    return a % 2 == 0;
  },
};
