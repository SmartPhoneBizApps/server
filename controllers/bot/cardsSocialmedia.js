const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");
const sendEmail = require("../../utils/sendEmail");
const User = require("../../models/access/User");
const {
  donutCard,
  donutCardHead,
  lineCard,
  stackedcolumnCard,
  tableCard,
  globalCard,
  adaptivecardCard,
  getCardKey,
  exampleCard,
} = require("../../modules/moduleCards");
const {
  getCard,
  findOneAppDatabyid,
  findOneAppData,
  cardReplace,
  getNewConfig,
} = require("../../modules/config");
// @desc      Create socialmedia
// @route     GET /api/v1/auth/socialmedias
// @access    Private/Admin
exports.cardsSocialmedia = asyncHandler(async (req, res, next) => {
  var base64data = req.params.socialmedia;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  outdata = {};
  cardOut = [];
  userRegistered = "USER_NOT_REGISTERED";
  regQuestion = {};
  userAccount = "";
  status = {
    userAccount: "USER_NOT_CREATED",
    userRegistered: "USER_NOT_REGISTERED",
    loginRequired: "USER_LOGIN_REQUIRED",
    emailStatus: "EMAIL_NOT_SENT_USER",
  };
  tokens = {
    accessToken: "",
    resetToken: "",
    resetURL: "",
  };
  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: SMediaAccountID,
  });

  if (!smedia) {
    return next(new ErrorResponse(`CREATE_SOCIALMEDIA`), 405);
  } else {
    data = {
      SocialMediaAccountID: smedia.SocialMediaAccountID,
      email: smedia.email,
      SocialMediaType: smedia.SocialMediaType,
      businessRoleName: smedia.businessRoleName,
      businessRole: smedia.businessRole,
      regQuestion: {},
      userName: "",
    };

    tokens = {
      accessToken: "",
      resetToken: "",
      resetURL: "",
    };

    const user = await User.findOne({ email: smedia.email });
    if (user) {
      status["userAccount"] = "USER_CREATED";
      data["userName"] = user.name;
      if (user[smedia.businessRoleName]) {
        status["userRegistered"] = "USER_REGISTERED";
        const k1 = "Role_" + smedia.businessRoleName;

        data["regQuestion"] = user[k1];
      } else {
        status["userRegistered"] = "USER_NOT_REGISTERED";
        data["regQuestion"] = {};
      }
      if (!smedia.accessToken) {
        // Situation User Already created and No access Token
        status["loginRequired"] = "USER_LOGIN_REQUIRED";
        tokens["accessToken"] = "";
        // Get reset token
        UserPIN = Math.floor(100000 + Math.random() * 900000);
        user.UserPIN = UserPIN;
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        let resetUrl = "";
        resetUrl = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/checkbotpin/${resetToken}`;
        tokens["resetURL"] = resetUrl;
        tokens["resetToken"] = resetToken;
        status["emailStatus"] = "EMAIL_SENT_USER";
        const message = `Your PIN number is: ${UserPIN} , you are receiving this email because you (or someone else) is performing login to SmartApp`;
        try {
          await sendEmail({
            email: user.email,
            subject: "Social Media reset token",
            message,
          });
          res.status(200).json({
            success: true,
            data: data,
            tokens: tokens,
            status: status,
          });
        } catch (err) {
          console.log(err);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return next(new ErrorResponse("Email could not be sent", 500));
        }
      } else {
        // Situation User Already created and access Token already there..
        // All looks good situation....
        // Read New Config File
        var appconfig = getNewConfig(
          req.headers.applicationid,
          smedia.businessRoleName
        );
        var mycard = appconfig["cards"];

        switch (req.headers.cardtype) {
          case "NEW_RECORD_SIMPLE":
            break;
          case "NEW_RECORD_WIZARD":
            break;
          case "CARD_DETAIL_REC":
            // Get the Record
            let appData = await findOneAppData(
              req.headers.record,
              req.headers.applicationid
            );

            // Header Cards...
            counter = 0;
            if (appconfig.hasOwnProperty("cards")) {
              var mycard = appconfig["cards"];
              for (let k = 0; k < mycard.length; k++) {
                counter = counter + 1;
                let cardKey = getCardKey(
                  req.headers.applicationid,
                  smedia.businessRoleName,
                  counter,
                  "H"
                );
                let cardConfigFile1 =
                  "../../cards/cardConfig/" + mycard[k]["template"];
                var cardData = JSON.stringify(require(cardConfigFile1));
                // replace values
                cardData = cardReplace(mycard[k], cardData, appconfig);
                var anacardConfig = JSON.parse(cardData);

                switch (mycard[k]["type"]) {
                  case "Analytical":
                    if (mycard[k]["analyticsCard"]["chartType"] == "donut") {
                      jCard1 = {};
                      jCard1 = await donutCardHead(
                        mycard[k],
                        appData,
                        anacardConfig
                      );
                      cardOut.push(jCard1);
                    }
                    break;
                  case "Adaptive":
                    jCard1 = {};
                    jCard1 = await adaptivecardCard(
                      req.headers.applicationid,
                      smedia.businessRoleName,
                      anacardConfig
                    );
                    cardOut.push(jCard1);
                    break;
                  default:
                    break;
                }
              }
            }

            //----------------------------------------------
            // Table Cards...
            for (const key in appconfig["tableConfig"]) {
              if (appData[key] == undefined) {
                appData[key] = [];
              }
              let tabx = "";
              for (const k1 in appconfig["DetailFields"]) {
                appconfig["DetailFields"][k1].forEach((e4) => {
                  if (key == e4) {
                    tabx = k1;
                  }
                });
              }

              if (appconfig["tableConfig"][key].hasOwnProperty("cards")) {
                for (
                  let g = 0;
                  g < appconfig["tableConfig"][key]["cards"].length;
                  g++
                ) {
                  counter = counter + 1;
                  let cardKey = getCardKey(
                    req.headers.applicationid,
                    smedia.businessRoleName,
                    counter,
                    "T"
                  );
                  var mycard = appconfig["tableConfig"][key]["cards"][g];
                  let cardConfigFile1 =
                    "../../cards/cardConfig/" + mycard["template"];
                  // Set Title
                  var cardData = JSON.stringify(require(cardConfigFile1));
                  // replace values
                  cardData = cardReplace(mycard, cardData, appconfig);
                  var anacardConfig = JSON.parse(cardData);
                  switch (mycard["type"]) {
                    case "Example":
                      jCard1 = {};
                      jCard1 = await exampleCard(
                        mycard,
                        appData[key],
                        anacardConfig
                      );
                      outStru[cardKey] = { ...jCard1 };
                      break;
                    case "Analytical":
                      if (mycard["analyticsCard"]["chartType"] == "donut") {
                        jCard1 = {};
                        jCard1 = await donutCard(
                          mycard,
                          appData[key],
                          anacardConfig
                        );
                        cardOut.push(jCard1);
                      }
                      if (mycard["analyticsCard"]["chartType"] == "line") {
                        jCard1 = {};
                        jCard1 = await lineCard(
                          mycard,
                          appData[key],
                          anacardConfig
                        );
                        cardOut.push(jCard1);
                      }
                      if (
                        mycard["analyticsCard"]["chartType"] == "stackedcolumn"
                      ) {
                        jCard1 = {};
                        jCard1 = await stackedcolumnCard(
                          mycard,
                          appData[key],
                          anacardConfig
                        );
                        cardOut.push(jCard1);
                      }
                      break;
                    case "Table":
                      jCard1 = {};
                      jCard1 = await tableCard(
                        mycard,
                        appData[key],
                        anacardConfig
                      );
                      cardOut.push(jCard1);
                      break;

                    default:
                      break;
                  }
                }
              }
            }
            // Global Cards
            let fg1 = "../../cards/cardConfig/template_timeline.json";
            var GlobalCardConfig = require(fg1);
            jCard1 = {};
            jCard1 = await globalCard(appData["TransLog"], GlobalCardConfig);
            cardOut.push(jCard1);

            break;
          case "CARD_LIST_REC":
            break;
          default:
            break;
        }

        status["loginRequired"] = "USER_LOGIN_NOT_REQUIRED";
        tokens["accessToken"] = smedia.accessToken;
        res.status(200).json({
          success: true,
          data: data,
          cards: cardOut,
          tokens: tokens,
          status: status,
        });
      }
    } else {
      // Situation User not created ..
      status["userAccount"] = "USER_NOT_CREATED";
      status["userRegistered"] = "USER_NOT_REGISTERED";
      res.status(200).json({
        success: true,
        data: data,
        status: status,
      });
    }
  }
});
