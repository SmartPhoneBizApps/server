// Read Card Configuration for the Role (X1)

exports.getPossVal = async (req, res, next) => {
 

  let fn1 = "../../utils/appList.json";
  var appList = require(fn1);

  let fn2 = "../../utils/AppRole.json";
  var appRole = require(fn2);

  let fn3 = "../../utils/AppRolePV.json";
  var AppRolePv = require(fn3);

  let fn4 = "../../utils/csvjson.json";
  var possVal = require(fn4);

  appList.forEach((element) => {
    mydata["ApplicationID"] = element;
    appRole.forEach((element1) => {
      if (element == appRole["ApplicationID"]) {
        appList["ApplicationID"]["Role"].push(appList["Role"]);
      }
    });

    console.log(element);
  });

  res.status(200).json({
    success: true,
    data: appList,
  });
};
