const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
const Approles = require("../models/appSetup/Approle");
const ErrorResponse = require("../utils/errorResponse");
const Agent = require("../models/access/Agent");
const App = require("../models/appSetup/App");
const NumberRange = require("../models/appSetup/NumberRange");
const Role = require("../models/appSetup/Role");
const User = require("../models/access/User");
const sendEmail = require("../utils/sendEmail");
const sendEmail1 = require("../utils/sendEmailProd");
const fs = require("fs");
module.exports = {
  getCard: function (
    data,
    cardType,
    results,
    list1_json,
    t_item,
    list2_json,
    donut_content,
    timeline1_json,
    col_table1,
    json_table1
  ) {
    grp1 = [];
    grp_cont = [];

    tdata = {};
    typ = "";
    xjson = {};
    json = [];
    xcol = {};
    columns = [];
    xrow = {};
    xrow1 = {};
    stru = {};
    //   stru = {};
    let cardConfigFile = "../cards/cardConfig/card_template.json";
    var cardConfig = require(cardConfigFile);
    stru = cardConfig;
    switch (cardType) {
      case "timeline1":
        hdr = {};
        grp_cont = {};
        stru = {};
        stru = cardConfig;
        typ = "Timeline";
        hdr = cardConfig["header"]["timeline1"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        hdr["status"]["text"] = data["statusText"];
        hdr["actions"][0]["parameters"]["url"] = data["HeaderActionURL"];
        grp_cont["item"] = t_item;
        grp_cont = cardConfig["content"]["timeline1"];
        grp_cont["data"]["json"] = timeline1_json;
        stru["sap.card"]["content"] = { ...grp_cont };
        grp_cont = {};
        stru["sap.card"]["type"] = typ;
        stru["sap.card"]["header"] = hdr;
        stru["sap.card"]["data"] = tdata;
        tdata = [];
        columns = [];
        return stru;
        break;

      case "objectPerson":
        hdr = {};
        grp1 = cardConfig["sap.card"]["objectPerson"];
        grp_cont = cardConfig["content"]["objectPerson"];
        hdr = cardConfig["header"]["objectPerson"];
        typ = "Object";
        datajson = [
          "firstName",
          "lastName",
          "position",
          "mobile",
          "phone",
          "email",
        ];
        break;
      case "calendar":
        hdr = {};
        grp1 = cardConfig["sap.card"]["calendar"];
        grp_cont = cardConfig["content"]["calendar"];
        hdr = cardConfig["header"]["calendar"];
        typ = "Calendar";
        datajson = {
          item: [],
          specialDate: [],
          legendItem: [],
        };

        break;
      case "adaptivecard":
        hdr = {};
        typ = "AdaptiveCard";
        //Header data
        hdr = cardConfig["header"]["adaptivecard"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        hdr["icon"]["src"] = data["HeaderIcon"];
        grp_cont = cardConfig["content"]["adaptivecard"];
        let fn01 =
          "../cards/adaptivecardforms/" +
          data["applicationid"] +
          "_" +
          data["businessrole"] +
          ".json";
        var adaptBody = require(fn01);
        grp_cont["body"] = adaptBody["body"];
        let fn02 =
          "../cards/adaptivecardforms/" +
          data["applicationid"] +
          "_" +
          data["businessrole"] +
          "_actions.json";
        var adaptActions = require(fn02);
        grp_cont["actions"] = adaptActions["actions"];
        grp1 = cardConfig["sap.card"]["adaptivecard"];
        stru["sap.card"]["content"] = grp_cont;
        break;

      case "adaptivecard2":
        hdr = {};
        // ********** NOT IN USE **********
        typ = "AdaptiveCard";
        //Header data
        hdr = cardConfig["header"]["adaptivecard2"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        grp1 = cardConfig["sap.card"]["adaptivecard2"];
        grp_cont = cardConfig["content"]["adaptivecard2"];
        stru["sap.card"]["content"] = grp_cont;

        break;
      case "adaptivecard3":
        hdr = {};
        // ********** NOT IN USE **********
        typ = "AdaptiveCard";
        //Header data
        hdr = cardConfig["header"]["adaptivecard3"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        grp1 = cardConfig["sap.card"]["adaptivecard3"];
        grp_cont = cardConfig["content"]["adaptivecard3"];
        grp_cont["$data"] = stru["sap.card"]["content"] = grp_cont;

        break;

      case "component1":
        hdr = {};
        typ = "Component";
        //Header data
        hdr = cardConfig["header"]["component1"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        hdr["icon"]["src"] = data["HeaderIcon"];
        grp1 = cardConfig["sap.card"]["component1"];

        break;

      case "donut":
        hdr = {};
        typ = "Analytical";
        //Header data
        hdr = cardConfig["header"]["donut"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        //   grp1 = cardConfig["sap.card"]["donut"];
        //   grp_cont = cardConfig["content"]["component1"];
        stru["sap.card"]["content"] = donut_content;

        break;
      case "list1":
        hdr = {};
        typ = "List";
        //Header data
        hdr = cardConfig["header"]["list1"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        hdr["status"]["text"] = data["statusText"];
        //       grp1 = cardConfig["sap.card"]["list1"];
        grp_cont = cardConfig["content"]["list1"];
        grp_cont["item"] = t_item;
        grp_cont["data"]["json"] = list1_json;
        stru["sap.card"]["content"] = grp_cont;
        break;
      case "list2":
        hdr = {};
        typ = "List";
        //Header data
        hdr = cardConfig["header"]["list2"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        hdr["icon"]["src"] = data["HeaderIcon"];
        //     grp1 = cardConfig["sap.card"]["list2"];
        grp_cont = cardConfig["content"]["list2"];
        grp_cont["item"] = t_item;
        grp_cont["data"]["json"] = list2_json;
        stru["sap.card"]["content"] = grp_cont;
        break;
      case "quicklink1":
        typ = "List";
        //Header data
        hdr = cardConfig["header"]["quicklink1"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        //     grp1 = cardConfig["sap.card"]["quicklink1"];
        grp_cont = cardConfig["content"]["quicklink1"];

        break;
      case "table1":
        hdr = {};
        stru = {};
        xrow1 = {};
        col_table1 = [];
        xrow = {};
        stru = cardConfig;
        typ = "Table";
        hdr = cardConfig["header"]["table1"];
        hdr["title"] = data["title"];
        hdr["subTitle"] = data["subTitle"];
        xrow1["columns"] = col_table1;
        xrow["row"] = { ...xrow1 };
        tdata["json"] = json_table1;
        stru["sap.card"]["content"] = xrow;
        stru["sap.card"]["type"] = typ;
        stru["sap.card"]["header"] = hdr;
        stru["sap.card"]["data"] = tdata;
        tdata = [];
        columns = [];
        return stru;
        break;
      default:
        return stru;
        break;
    }
  },
  buildAdaptiveCard: function (
    typ,
    e1,
    width,
    appconfig,
    resPV,
    ival_out,
    def
  ) {
    switch (typ) {
      case "string":
        // Text >> Input.Text
        //"style": "text",
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["style"] = "text";
        body1x["type"] = "Input.Text";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        //"isMultiline"
        if (width > 100) {
          body1x["isMultiline"] = true;
        } else {
          body1x["isMultiline"] = false;
        }
        break;
      case "Date":
        // Date >> Input.Date
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Date";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        //           body1x["value"] = "@currentDate";

        break;

      case "hyperlink":
        //"style": "url",
        // Text >> Input.Text
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["style"] = "url";
        body1x["type"] = "Input.Text";
        body1x["id"] = e1;
        body1x["placeholder"] = "Website Url";

        break;

      case "Email":
        //"style": "email",
        // Text >> Input.Text
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["style"] = "email";
        body1x["type"] = "Input.Text";
        body1x["id"] = e1;
        body1x["placeholder"] = "youremail@example.com";

        break;
      case "Time":
        // Time >> Input.Time
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Time";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        break;
      case "Num,0":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Number";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        break;
      case "Num,1":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Number";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        break;
      case "Num,2":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Number";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        break;
      case "Num,3":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["type"] = "Input.Number";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        break;
      default:
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["style"] = "text";
        body1x["type"] = "Input.Text";
        body1x["id"] = e1;
        body1x["placeholder"] = e1;
        //"isMultiline"
        if (appconfig["FieldDef"]["width"] > 100) {
          body1x["isMultiline"] = true;
        } else {
          body1x["isMultiline"] = false;
        }
        break;
    }

    for (let a = 0; a < appconfig["PossibleValues"].length; a++) {
      if (appconfig["PossibleValues"][a] == e1) {
        // Possible Values >> Input.ChoiceSet
        //"style": "expanded",
        body1x = {};
        body2x = {};

        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["style"] = "expanded";
        body1x["type"] = "Input.ChoiceSet";
        body1x["id"] = e1;

        x_ch = [];
        for (let j = 0; j < resPV.length; j++) {
          if (resPV[j]["PossibleValues"] == e1) {
            x_choices = {};
            x_choices["title"] = resPV[j]["Description"];
            x_choices["value"] = resPV[j]["Value"];
            x_ch.push(x_choices);
          }
        }
        body1x["choices"] = x_ch;
      }
    }
    for (let d = 0; d < ival_out.length; d++) {
      if (ival_out[d]["Field"] == e1) {
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = e1;

        body1x["id"] = e1;
        body1x["value"] = ival_out[d]["Value"];
        for (let a = 0; a < def.length; a++) {
          if (def[a]["name"] == e1) {
            switch (def[a]["type"]) {
              case "string":
                body1x["type"] = "Input.Text";
                body1x["style"] = "text";
                break;
              case "Date":
                //  Input.Date
                body1x["type"] = "Input.Date";
                body1x["style"] = "";
                break;
              case "hyperlink":
                // Input.Text
                body1x["type"] = "Input.Text";
                body1x["style"] = "url";
                break;
              case "Email":
                //"style": "email",
                // Text >> Input.Text
                body1x["type"] = "Input.Text";
                body1x["style"] = "email";
                break;

              case "Time":
                // Time >> Input.Time
                body1x["type"] = "Input.Time";
                body1x["style"] = "";
                break;
              case "Num,0":
                // Number >> Input.Number
                body1x["type"] = "Input.Number";
                body1x["style"] = "";
                break;
              case "Num,1":
                // Number >> Input.Number
                body1x["type"] = "Input.Number";
                body1x["style"] = "";
                break;
              case "Num,2":
                // Number >> Input.Number
                body1x["type"] = "Input.Number";
                body1x["style"] = "";
                break;
              case "Num,3":
                // Number >> Input.Number
                body1x["type"] = "Input.Number";
                body1x["style"] = "";
                break;
              default:
                body1x["type"] = "Input.Text";
                body1x["style"] = "text";
                break;
            }
          }
        }
      }
    }

    for (let a = 0; a < def.length; a++) {
      if (def[a]["name"] == e1) {
        if (def[a]["Option"] == "Mandatory") {
          body.push(body2x);
          body2x = {};
          body.push(body1x);
          body1x = {};
        } else {
          body2.push(body2x);
          body2x = {};
          body2.push(body1x);
          body1x = {};
        }
      }
    }
  },
  getCreateMap: function (sapp, tapp, trans) {
    // Read Create Map Config
    // This will be used only when you create record copying data from sapp to tapp
    let fn =
      "../NewConfig/" + sapp + "_" + tapp + "_" + trans + "_createmap.json";
    var result = require(fn);
    return result;
  },
  sendHtmlEmail: function (data) {
    let message =
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title></title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]--><meta name="viewport" content="width=device-width" /><style type="text/css">@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:30px !important;line-height:38px !important}.wrapper h2{}.wrapper h2{font-size:20px !important;line-height:28px !important}.wrapper h3{}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px !important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper .size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}</style><meta name="x-apple-disable-message-reformatting" /><style type="text/css">body {margin: 0;padding: 0;}table {border-collapse: collapse;table-layout: fixed;}* {line-height: inherit;}[x-apple-data-detectors] {color: inherit !important;text-decoration: none !important;}.wrapper .footer__share-button a:hover,.wrapper .footer__share-button a:focus {color: #ffffff !important;}.btn a:hover,.btn a:focus,.footer__share-button a:hover,.footer__share-button a:focus,.email-footer__links a:hover,.email-footer__links a:focus {opacity: 0.8;}.preheader,.header,.layout,.column {transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;}.preheader td {padding-bottom: 8px;}.layout,div.header {max-width: 400px !important;-fallback-width: 95% !important;width: calc(100% - 20px) !important;}div.preheader {max-width: 360px !important;-fallback-width: 90% !important;width: calc(100% - 60px) !important;}.snippet,.webversion {Float: none !important;}.stack .column {max-width: 400px !important;width: 100% !important;}.fixed-width.has-border {max-width: 402px !important;}.fixed-width.has-border .layout__inner {box-sizing: border-box;}.snippet,.webversion {width: 50% !important;}.ie .btn {width: 100%;}.ie .stack .column,.ie .stack .gutter {display: table-cell;float: none !important;}.ie div.preheader,.ie .email-footer {max-width: 560px !important;width: 560px !important;}.ie .snippet,.ie .webversion {width: 280px !important;}.ie div.header,.ie .layout {max-width: 600px !important;width: 600px !important;}.ie .two-col .column {max-width: 300px !important;width: 300px !important;}.ie .three-col .column,.ie .narrow {max-width: 200px !important;width: 200px !important;}.ie .wide {width: 400px !important;}.ie .stack.fixed-width.has-border,.ie .stack.has-gutter.has-border {max-width: 602px !important;width: 602px !important;}.ie .stack.two-col.has-gutter .column {max-width: 290px !important;width: 290px !important;}.ie .stack.three-col.has-gutter .column,.ie .stack.has-gutter .narrow {max-width: 188px !important;width: 188px !important;}.ie .stack.has-gutter .wide {max-width: 394px !important;width: 394px !important;}.ie .stack.two-col.has-gutter.has-border .column {max-width: 292px !important;width: 292px !important;}.ie .stack.three-col.has-gutter.has-border .column,.ie .stack.has-gutter.has-border .narrow {max-width: 190px !important;width: 190px !important;}.ie .stack.has-gutter.has-border .wide {max-width: 396px !important;width: 396px !important;}.ie .fixed-width .layout__inner {border-left: 0 none white !important;border-right: 0 none white !important;}.ie .layout__edges {display: none;}.mso .layout__edges {font-size: 0;}.layout-fixed-width,.mso .layout-full-width {background-color: #ffffff;}@media only screen and (min-width: 620px) {.column,.gutter {display: table-cell;Float: none !important;vertical-align: top;}div.preheader,.email-footer {max-width: 560px !important;width: 560px !important;}.snippet,.webversion {width: 280px !important;}div.header,.layout,.one-col .column {max-width: 600px !important;width: 600px !important;}.fixed-width.has-border,.fixed-width.x_has-border,.has-gutter.has-border,.has-gutter.x_has-border {max-width: 602px !important;width: 602px !important;}.two-col .column {max-width: 300px !important;width: 300px !important;}.three-col .column,.column.narrow,.column.x_narrow {max-width: 200px !important;width: 200px !important;}.column.wide,.column.x_wide {width: 400px !important;}.two-col.has-gutter .column,.two-col.x_has-gutter .column {max-width: 290px !important;width: 290px !important;}.three-col.has-gutter .column,.three-col.x_has-gutter .column,.has-gutter .narrow {max-width: 188px !important;width: 188px !important;}.has-gutter .wide {max-width: 394px !important;width: 394px !important;}.two-col.has-gutter.has-border .column,.two-col.x_has-gutter.x_has-border .column {max-width: 292px !important;width: 292px !important;}.three-col.has-gutter.has-border .column,.three-col.x_has-gutter.x_has-border .column,.has-gutter.has-border .narrow,.has-gutter.x_has-border .narrow {max-width: 190px !important;width: 190px !important;}.has-gutter.has-border .wide,.has-gutter.x_has-border .wide {max-width: 396px !important;width: 396px !important;}}@supports (display: flex) {@media only screen and (min-width: 620px) {.fixed-width.has-border .layout__inner {display: flex !important;}}}@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {.fblike {background-image: url(https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/fblike@2x.png) !important;}.tweet {background-image: url(https://i8.createsend1.com/static/eb/master/13-the-blueprint-3/images/tweet@2x.png) !important;}.linkedinshare {background-image: url(https://i9.createsend1.com/static/eb/master/13-the-blueprint-3/images/lishare@2x.png) !important;}.forwardtoafriend {background-image: url(https://i10.createsend1.com/static/eb/master/13-the-blueprint-3/images/forward@2x.png) !important;}}@media (max-width: 321px) {.fixed-width.has-border .layout__inner {border-width: 1px 0 !important;}.layout,.stack .column {min-width: 320px !important;width: 320px !important;}.border {display: none;}.has-gutter .border {display: table-cell;}}.mso div {border: 0 none white !important;}.mso .w560 .divider {Margin-left: 260px !important;Margin-right: 260px !important;}.mso .w360 .divider {Margin-left: 160px !important;Margin-right: 160px !important;}.mso .w260 .divider {Margin-left: 110px !important;Margin-right: 110px !important;}.mso .w160 .divider {Margin-left: 60px !important;Margin-right: 60px !important;}.mso .w354 .divider {Margin-left: 157px !important;Margin-right: 157px !important;}.mso .w250 .divider {Margin-left: 105px !important;Margin-right: 105px !important;}.mso .w148 .divider {Margin-left: 54px !important;Margin-right: 54px !important;}.mso .size-8,.ie .size-8 {font-size: 8px !important;line-height: 14px !important;}.mso .size-9,.ie .size-9 {font-size: 9px !important;line-height: 16px !important;}.mso .size-10,.ie .size-10 {font-size: 10px !important;line-height: 18px !important;}.mso .size-11,.ie .size-11 {font-size: 11px !important;line-height: 19px !important;}.mso .size-12,.ie .size-12 {font-size: 12px !important;line-height: 19px !important;}.mso .size-13,.ie .size-13 {font-size: 13px !important;line-height: 21px !important;}.mso .size-14,.ie .size-14 {font-size: 14px !important;line-height: 21px !important;}.mso .size-15,.ie .size-15 {font-size: 15px !important;line-height: 23px !important;}.mso .size-16,.ie .size-16 {font-size: 16px !important;line-height: 24px !important;}.mso .size-17,.ie .size-17 {font-size: 17px !important;line-height: 26px !important;}.mso .size-18,.ie .size-18 {font-size: 18px !important;line-height: 26px !important;}.mso .size-20,.ie .size-20 {font-size: 20px !important;line-height: 28px !important;}.mso .size-22,.ie .size-22 {font-size: 22px !important;line-height: 31px !important;}.mso .size-24,.ie .size-24 {font-size: 24px !important;line-height: 32px !important;}.mso .size-26,.ie .size-26 {font-size: 26px !important;line-height: 34px !important;}.mso .size-28,.ie .size-28 {font-size: 28px !important;line-height: 36px !important;}.mso .size-30,.ie .size-30 {font-size: 30px !important;line-height: 38px !important;}.mso .size-32,.ie .size-32 {font-size: 32px !important;line-height: 40px !important;}.mso .size-34,.ie .size-34 {font-size: 34px !important;line-height: 43px !important;}.mso .size-36,.ie .size-36 {font-size: 36px !important;line-height: 43px !important;}.mso .size-40,.ie .size-40 {font-size: 40px !important;line-height: 47px !important;}.mso .size-44,.ie .size-44 {font-size: 44px !important;line-height: 50px !important;}.mso .size-48,.ie .size-48 {font-size: 48px !important;line-height: 54px !important;}.mso .size-56,.ie .size-56 {font-size: 56px !important;line-height: 60px !important;}.mso .size-64,.ie .size-64 {font-size: 64px !important;line-height: 63px !important;}</style><style type="text/css">body{background-color:#fff}.logo a:hover,.logo a:focus{color:#1e2e3b !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:30px !important;line-height:38px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:20px !important;line-height:28px !important}.mso h3,.ie h3{}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:Verdana,sans-serif}</style><meta name="robots" content="noindex,nofollow" /><meta property="og:title" content="My First Campaign" /></head><!--[if mso]><body class="mso"><![endif]--><!--[if !mso]><!--><body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;"><!--<![endif]--><table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><div role="banner"><div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);"><div style="border-collapse: collapse;display: table;width: 100%;"><!--[if (mso)|(IE)]><table align="center" class="preheader" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width: 280px" valign="top"><![endif]--><div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #151513;font-family: Verdana,sans-serif;"></div></div></div></div><div><div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #fdba13;"><!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #fdba13;"><td style="width: 600px" class="w560"><![endif]--><div class="column" style="text-align: left;color: #000;font-size: 16px;line-height: 24px;font-family: Verdana,sans-serif;"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 18px;font-size: 1px;">&nbsp;</div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;"><h1 style="Margin-top: 0;Margin-bottom: 20px;font-style: normal;font-weight: normal;color: #000;font-size: 26px;line-height: 34px;font-family: Times,Times New Roman,serif;text-align: center;">[HEADING]</h1></div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 2px;font-size: 1px;">&nbsp;</div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div style="background-color: #a1a1a1;background: 48% 55%/cover no-repeat url(IMG_URL) #a1a1a1;background-position: 48% 55%;background-image: url(IMG_URL);background-repeat: no-repeat;background-size: cover;"><div class="layout one-col stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-full-width" style="background: 48% 55%/cover no-repeat url(IMG_URL) #a1a1a1;background-position: 48% 55%;background-image: url(IMG_URL);background-repeat: no-repeat;background-size: cover;background-color: #a1a1a1;"><td class="layout__edges">&nbsp;</td><td style="width: 600px" class="w560"><![endif]--><div class="column" style="text-align: left;color: #000;font-size: 16px;line-height: 24px;font-family: Verdana,sans-serif;"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;line-height: 150px;font-size: 1px;">&nbsp;</div></div></div><!--[if (mso)|(IE)]></td><td class="layout__edges">&nbsp;</td></tr></table><![endif]--></div></div></div><div style="mso-line-height-rule: exactly;line-height: 33px;font-size: 33px;">&nbsp;</div><div class="layout one-col fixed-width stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;"><!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-fixed-width" style="background-color: #ffffff;"><td style="width: 600px" class="w560"><![endif]--><div class="column" style="text-align: left;color: #000;font-size: 16px;line-height: 24px;font-family: Verdana,sans-serif;"><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;"><p style="Margin-top: 0;Margin-bottom: 0;">Hey [USERNAME],</p><p style="Margin-top: 20px;Margin-bottom: 0;">[P1]</p><p style="Margin-top: 20px;Margin-bottom: 0;">[P2]</p><p style="Margin-top: 20px;Margin-bottom: 20px;">[P3]</p></div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div class="btn btn--flat btn--large" style="Margin-bottom: 20px;text-align: left;"><![if !mso]><a style="border-radius: 0;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #000000 !important;background-color: #fdba13;font-family: Times, Times New Roman, serif;" href="[BUTTONLINK]">[BUTTONTEXT]</a><![endif]><!--[if mso]><p style="line-height:0;margin:0;">&nbsp;</p><v:rect xmlns:v="urn:schemas-microsoft-com:vml" href="http://example.com" style="width:148px" fillcolor="#FDBA13" stroke="f"><v:textbox style="mso-fit-shape-to-text:t" inset="0px,12px,0px,12px"><center style="font-size:14px;line-height:24px;color:#000000;font-family:Times,Times New Roman,serif;font-weight:bold;mso-line-height-rule:exactly;mso-text-raise:4px">track your order</center></v:textbox></v:rect><![endif]--></div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="mso-line-height-rule: exactly;mso-text-raise: 11px;vertical-align: middle;"><p style="Margin-top: 0;Margin-bottom: 20px;">Thanks Admin Team.</p></div></div><div style="Margin-left: 20px;Margin-right: 20px;"><div style="font-size: 12px;font-style: normal;font-weight: normal;line-height: 19px;" align="left"></div></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></div></div><div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div><div role="contentinfo"><div class="layout email-footer stack" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;"><div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;"><!--[if (mso)|(IE)]><table align="center" cellpadding="0" cellspacing="0" role="presentation"><tr class="layout-email-footer"><td style="width: 400px;" valign="top" class="w360"><![endif]--><div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #151513;font-family: Verdana,sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"><table class="email-footer__links" style="border-collapse: collapse;table-layout: fixed;" role="presentation" emb-web-links><tbody><tr role="navigation"></tr></tbody></table><div style="font-size: 12px;line-height: 19px;Margin-top: 20px;"></div><div style="font-size: 12px;line-height: 19px;Margin-top: 18px;"></div><!--[if mso]>&nbsp;<![endif]--></div></div><!--[if (mso)|(IE)]></td><td style="width: 200px;" valign="top" class="w160"><![endif]--><div class="column narrow" style="text-align: left;font-size: 12px;line-height: 19px;color: #151513;font-family: Verdana,sans-serif;Float: left;max-width: 320px;min-width: 200px; width: 320px;width: calc(72200px - 12000%);"><div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;"></div></div><!--[if (mso)|(IE)]></td></tr></table><![endif]--></div></div></div><div style="line-height:40px;font-size:40px;">&nbsp;</div></div></td></tr></tbody></table></body></html>';
    message = message.replace("[HEADING]", data["heading"]);
    message = message.replace("[USERNAME]", data["userName"]);
    message = message.replace("[P1]", data["p1"]);
    message = message.replace("[P2]", data["p2"]);
    message = message.replace("[BUTTONTEXT]", data["buttonText"]);
    message = message.replace("[BUTTONLINK]", data["buttonLink"]);
    message = message.replace("[P3]", data["p3"]);
    message = message.replace("IMG_URL", data["imageURL"]);
    message = message.replace("IMG_URL", data["imageURL"]);
    message = message.replace("IMG_URL", data["imageURL"]);
    message = message.replace("IMG_URL", data["imageURL"]);

    try {
      sendEmail({
        //email: req.params.user,
        //subject: sub,
        //message,

        email: "gst@smartphonebizapps.com",
        subject: "Test Email",
        message,
      });

      data["res"].status(200).json({
        success: true,
        message: "Course assigned to the user & Email sent 123",
      });
    } catch (err) {
      console.log(err);
      data["res"].status(200).json({
        success: true,
        message: "Course assigned to the user but Email could not be sent",
      });
    }
  },
  getInitialValues: function (a, b, c) {
    var set1 = new Set([]);
    let rl = "Role_" + b;
    let fn1 = "../NewConfig/initialValues_EN.json";
    var result = require(fn1);
    rl1 = {};
    let el1 = {};
    let kys = [];
    let out = [];
    let out1 = {};
    let res = [];
    for (const key in c) {
      kys.push(key);
      if (key == rl) {
        el1 = c[key];
      }
    }
    // Initial values
    for (let i = 0; i < result.initialValues.length; i++) {
      const element = result.initialValues[i];
      if (element["ApplicationID"] == a) {
        res = element["initialValues"];
        break;
      }
    }

    // User default
    for (const key in el1) {
      const element = el1[key];
      // Add User Defaults...
      out1["Field"] = key;
      out1["Value"] = el1[key];
      out1["EditLock"] = "No";
      for (let index = 0; index < res.length; index++) {
        if (res[index]["Field"] == key) {
          if (res[index]["EditLock"] == "Yes") {
            // Use initial values if EditLock is set ...
            out1["Field"] = key;
            out1["Value"] = res[index]["Value"];
            out1["EditLock"] = "Yes";
          }
        }
      }
      // Append the data in array ...
      out.push(out1);
      set1.add(out1);
      out1 = {};
    }
    // Add Initial values which are not in User Defaults...
    for (let index = 0; index < res.length; index++) {
      out1 = {};
      if (!(res[index]["Field"] in kys)) {
        out1 = { ...res[index] };
        out.push(out1);
        set1.add(out1);
      }
    }

    // Remove Duplicates...
    var resArr = [];
    out.forEach(function (item) {
      var i = resArr.findIndex((x) => x.Field == item.Field);
      if (i <= -1) {
        resArr.push({
          Field: item.Field,
          Value: item.Value,
          EditLock: item.EditLock,
        });
      }
    });
    return resArr;
  },
  getDateValues: function (a) {
    switch (a) {
      case "@currentDate":
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "today":
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@tomorrow":
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "tomorrow":
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@yesterday":
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "yesterday":
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@weekBack":
        var today = new Date();
        today.setDate(today.getDate() - 7);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@weekLater":
        var today = new Date();
        today.setDate(today.getDate() + 7);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@30DaysLater":
        var today = new Date();
        today.setDate(today.getDate() + 30);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@30DaysEarlier":
        var today = new Date();
        today.setDate(today.getDate() + 30);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@15DaysLater":
        var today = new Date();
        today.setDate(today.getDate() + 15);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@15DaysEarlier":
        var today = new Date();
        today.setDate(today.getDate() + 15);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      default:
        date = a;
        break;
    }
    return date;
  },
  getNewConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let fn = "../NewConfig/" + a + "_" + b + "_config.json";
    var result = require(fn);
    return result;
  },

  collectListFields: function (a) {
    var fieldSet = new Set();
    if (a["IntroField"] != undefined) {
      fieldSet.add(a["IntroField"]);
    }
    if (a["TitleField"] != undefined) {
      fieldSet.add(a["TitleField"]);
    }
    if (a["sStatus"] != undefined) {
      fieldSet.add(a["sStatus"]);
    }
    if (a["fStatus"] != undefined) {
      fieldSet.add(a["fStatus"]);
    }
    if (a["numberField"] != undefined) {
      fieldSet.add(a["numberField"]);
    }
    if (a["LFields"] != undefined) {
      for (let j = 0; j < a["LFields"].length; j++) {
        fieldSet.add(a["LFields"][j]);
      }
    }
    ary = [];
    fieldSet.forEach((element) => {
      ary.push(element);
    });
    return ary;
  },
  checkFile: async function (con1) {
    const path = "../NewConfig/" + con1;
    try {
      if (fs.existsSync(path)) {
        //file exists
        result = "Success";
        return result;
      }
    } catch (err) {
      result = "Fail";
      return result;
    }
  },
  getNewCopyRecord: function (
    configData,
    Appdata,
    paramID,
    userX,
    appID,
    fromApp,
    toApp
  ) {
    out1 = {};
    for (let i = 0; i < configData.FieldDef.length; i++) {
      const el1 = configData.FieldDef[i];
      for (const key in Appdata) {
        const element = Appdata[key];
        if (key == el1.name) {
          if (key == "ID") {
            out1["ReferenceID"] = paramID;
            out1[key] = Math.floor(100000 + Math.random() * 900000);
            toID = out1[key];
          } else {
            out1[key] = element;
          }
        }
      }
    }
    if (configData.Controls.Partner == "@user") {
      out1["Partner"] = userX.email;
    }
    out1["actionLog"] = [];
    out1["ProgressComment"] = [];
    out1["TransLog"] = [];
    out1["lowerNodes"] = [];

    out1["ReferenceID"] = paramID;
    out1["appId"] = appID;
    out1["user"] = userX.id;
    out1["userName"] = userX.userName;
    out1["userEmail"] = userX.email;
    out1["company"] = userX.company;
    out1["branch"] = userX.branch;
    out1["area"] = userX.area;
    return out1;
  },
  processingLog: function (
    ID,
    type,
    userid,
    userName,
    Status,
    app,
    comment,
    buttonType,
    buttonName,
    comment2
  ) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let pLog = {};
    let result = [];
    pLog["Type"] = type;
    pLog["User"] = userid;
    pLog["UserName"] = userName;
    pLog["Status"] = Status;
    pLog["TimeStamp"] = new Date();
    pLog["ID"] = ID;
    pLog["applicationId"] = app;
    pLog["Comment"] = comment;
    if (buttonType != undefined) {
      pLog["buttonType"] = buttonType;
    }
    if (comment2 != undefined) {
      pLog["UserComment"] = comment2;
    }
    if (buttonName != undefined) {
      pLog["buttonName"] = buttonName;
    }
    return pLog;
  },
  actionLog: function (
    req,
    type,
    actionLog,
    buttonType,
    buttonName,
    userInputs,
    FieldDef
  ) {
    detailL = {};
    newLog = {};
    detailLog = [];
    excludeList = [
      "TransLog",
      "actionLog",
      "checks",
      "ID",
      "appId",
      "applicationId",
      "user",
      "company",
      "companyName",
      "branch",
      "area",
      "SearchString",
      "ProgressComment",
      "upperNodes",
      "lowerNodes",
      "selfNodes",
      "opening_hours",
      "carouselImage",
      "carouselImage_ocr",
      "MultiAttachments",
      "googleReviews",
      "googlePhotos",
    ];
    console.log("buttonType", buttonType);
    if (buttonType != undefined) {
      newLog["buttonType"] = buttonType;
    } else {
      if (type == "UPDATE") {
        newLog["buttonType"] = "UPDATE";
      }
    }
    if (buttonName != undefined) {
      newLog["Transaction"] = buttonName;
    } else {
      if (type == "UPDATE") {
        newLog["Transaction"] = "DataUpdate";
      }
    }
    otherFields = [];
    for (const key in userInputs) {
      if (!excludeList.includes(key)) {
        console.log("FieldList");
        for (let g = 0; g < FieldDef.length; g++) {
          if (FieldDef[g]["name"] == key) {
            switch (FieldDef[g]["type"]) {
              case "Array":
                detailL["Key"] = key;
                detailL["Value"] = "Table updated - ";
                for (let p = 0; p < userInputs[key].length; p++) {
                  detailL["Value"] = detailL["Value"] + "[";
                  for (const kp in userInputs[key][p]) {
                    detailL["Value"] =
                      detailL["Value"] +
                      kp +
                      ":" +
                      userInputs[key][p][kp] +
                      ", ";
                  }
                  detailL["Value"] = detailL["Value"] + "]";
                }

                detailLog.push({ ...detailL });
                detailL = {};
                break;
              default:
                detailL["Key"] = key;
                detailL["Value"] = userInputs[key];
                detailLog.push({ ...detailL });
                detailL = {};
                break;
            }
          }
        }
      } else {
        otherFields.push(key);
      }
    }
    if (otherFields.length > 0) {
      detailL["Key"] = "Other Fields";
      detailL["Value"] = "[ ";
      otherFields.forEach((element) => {
        detailL["Value"] = detailL["Value"] + element + " ";
      });
      detailL["Value"] = detailL["Value"] + "]";
      detailLog.push({ ...detailL });
    }
    newLog["ID"] = req.body.ID;
    newLog["Type"] = type;
    newLog["DetailLog"] = [];
    newLog["DetailLog"] = detailLog;
    newLog["User"] = req.body.userEmail;
    newLog["UserName"] = req.body.userName;
    newLog["Status"] = req.body.Status;
    newLog["Role"] = req.headers.businessrole;
    newLog["applicationId"] = req.headers.applicationid;
    newLog["TimeStamp"] = Date.now();

    // add the Log
    actionLog.unshift({ ...newLog });
    newLog = {};
    detailLog = [];
    return actionLog;
  },
  getPVConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    const newPv = "../NewConfig/" + a + "_" + b + "_config.json";
    var pvconfig1 = require(newPv);
    return pvconfig1["PossibleValues"];
  },
  getPVQuery: function (a, b, c) {
    app1 = a;
    app2 = "GLOBAL";
    role1 = b;
    role2 = "ALL";
    const fields = "PossibleValues Value Description ColorSAP Score EditLock";
    let query;
    query = Possval.find(
      {
        PossibleValues: { $in: c },
        ApplicationID: { $in: [app1, app2] },
        Role: { $in: [role1, role2] },
      },
      { _id: 0 }
    );
    query = query.select(fields);
    return query;
  },
  getAppRoles: function (applicationId) {
    query_r = Approles.find(
      {
        "Apps.applicationID": applicationId,
      },
      { _id: 0 }
    );

    return query_r;
  },
  getPVField: function (a, b) {
    const fields =
      "Role PossibleValues Value Description ColorSAP Score EditLock";
    let query;
    query = Possval.find(
      {
        PossibleValues: b,
        ApplicationID: a,
      },
      { _id: 0 }
    );
    query = query.select(fields);
    return query;
  },
  getBotListFields: function (config1) {
    lf = [];
    if (config1["ListBOTFields"]["Title"]) {
      config1["ListBOTFields"]["Title"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["SubTitle"]) {
      config1["ListBOTFields"]["SubTitle"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["Description"]) {
      config1["ListBOTFields"]["Description"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["None"]) {
      config1["ListBOTFields"]["None"].forEach((element1) => {
        lf.push(element1);
      });
    }

    return lf;
  },
  createRefSetBody: function (result, app, user) {
    result.appId = app.id;
    result.applicationId = app.applicationID;
    result.user = user.id;
    result.userName = user.name;
    result.userEmail = user.email;
    result.company = user.company;
    result.branch = user.branch;
    result.area = user.area;
    return result;
  },
  tableValidate: function (itmData, newitemData) {
    let kys = [];
    let out1 = {};
    var set1 = new Set([]);
    if (newitemData) {
      for (let i = 0; i < newitemData.length; i++) {
        kys.push(newitemData[i]["ItemNumber"]);
      }
    } else {
      newitemData = [];
    }
    for (let x = 0; x < itmData.length; x++) {
      out1 = {};
      if (!kys.includes(itmData[x]["ItemNumber"])) {
        out1 = { ...itmData[x] };
        newitemData.push(out1);
        set1.add(out1);
      }
    }
    ItemFields = {};
    for (let db2 = 0; db2 < newitemData.length; db2++) {
      for (let b2 = 0; b2 < itmData.length; b2++) {
        if (itmData[b2]["ItemNumber"] == newitemData[db2]["ItemNumber"]) {
          for (const b3 in itmData[b2]) {
            newitemData[db2][b3] = itmData[b2][b3];
          }
        }
      }
    }
    return newitemData;
  },
  handleArray: function (newData, oldData) {
    let current = [];
    let docID = newData["documentId"];
    current.push(newData);
    for (let index = 0; index < oldData.length; index++) {
      if (oldData[index]["documentId"] == docID) {
      } else {
        current.push(oldData[index]);
      }
    }
    return current;
  },
  getApplication: function (app) {
    const myApp = App.findOne({ applicationID: app });
    return myApp;
  },
  getRole: function (role) {
    const myRole = Role.findOne({ role: role });
    return myRole;
  },
  createUser: function (input) {
    user = User.create(input);
    return user;
  },
  findOneAgent: function (input) {
    const agent = Agent.findOne({
      agent: input,
    });
    return agent;
  },
  findOneSocialmedia: function (input) {
    const smedia = Socialmedia.findOne({
      SocialMediaAccountID: input,
    });
    return smedia;
  },
  findOneRole: function (input) {
    const role = Role.findOne({
      role: input,
    });
    return role;
  },
  findOneApp: function (input) {
    const app = App.findOne({
      applicationID: input,
    });
    return app;
  },
  findOneAppData: function (TransID, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findOne({
      ID: TransID,
    });
    return result;
  },
  findOneAppDataRefID: function (TransID, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findOne({
      ReferenceID: TransID,
    });
    return result;
  },
  findOneAppDatabyid: function (TransID, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findById(TransID);
    return result;
  },
  findOneUpdateData: function (mdata, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findOneAndUpdate({ ID: mdata.ID }, mdata, {
      new: true,
      runValidators: true,
    });
    console.log("Data is updated");

    return result;
  },

  createFileName: function (prefix, type, path) {
    counter = Math.floor(10 + Math.random() * 90);
    var d1 = new Date();
    var d = d1.toString();
    an1 = d.split(" ")[4];
    an2 = an1.split(":");

    if (type == "JSON") {
      fileName =
        prefix +
        d.split(" ")[1] +
        d.split(" ")[2] +
        d.split(" ")[3] +
        "_" +
        an2[0] +
        an2[1] +
        an2[2] +
        "_" +
        counter +
        ".json";
    }

    if (type == "TXT") {
      fileName =
        prefix +
        d.split(" ")[1] +
        d.split(" ")[2] +
        d.split(" ")[3] +
        "_" +
        an2[0] +
        an2[1] +
        an2[2] +
        "_" +
        counter +
        ".txt";
    }

    const fileFilePath = path + fileName;
    console.log("fileName:", fileFilePath);

    return fileFilePath;
  },
  writeFile: function (fileFilePath, myDataFile) {
    fs.appendFile(fileFilePath, myDataFile, function (err) {
      if (err) throw err;
      console.log("File created!");
    });
    return fileFilePath;
  },
  createDocument: function (app, mydata) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.create(mydata);
    return result;
  },
  createDocumentAPI: function (
    app,
    role,
    calculation,
    notify,
    mydata,
    authorization,
    method,
    buttonType,
    buttonName,
    mode,
    numberRange
  ) {
    console.log(
      "KeyData : ",
      app,
      role,
      method,
      buttonType,
      buttonName,
      mode,
      numberRange
    );
    result = {};
    var request = require("request");
    processURL = process.env.APPURL + "api/v1/datarecords/";
    var options = {
      method: method,
      url: processURL,
      //  url: "https://fierce-oasis-51455.herokuapp.com/api/v1/datarecords/",
      // url: "http://localhost:5000/api/v1/datarecords/",
      headers: {
        applicationid: app,
        businessRole: role,
        buttonName: buttonName,
        mode: mode,
        buttonType: buttonType,
        calculation: calculation,
        //  numberRange: "External",
        numberRange: numberRange,
        "Content-Type": "application/json",
        notification: notify,
        Authorization: authorization,
      },
      body: JSON.stringify(mydata),
    };
    console.log(processURL);

    request(options, (error, res, body) => {
      result = {};
      result["success"] = false;
      result["body"] = {};
      result["error"] = {};
      console.log("Divyesh", error);
      console.log("Divyesh", res.statusCode, app, method);
      var msg = "";
      if (res.statusCode == 200) {
        result["success"] = true;
        result["body"] = JSON.parse(body);
        result["error"] = {};
        console.log("Success", app, method, result["body"]["data"]["ID"]);
        return result;
      } else {
        console.log("Error", error);
        result["success"] = false;
        result["body"] = {};
        result["error"] = error;
        console.log("Error", result);
        return result;
      }
    });
  },
  gerCardData: function (app, q1) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    qg1 = JSON.parse(q1);
    query = Model.find(qg1, { _id: 0 });
    return query;
  },
  createMultipleDocument: function (app, mydata) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.insertMany(mydata);
    return result;
  },
  findAndUpdateItem: function (mdata, app) {
    let path = "../models/smartApp/" + app + "_Itm";
    const Model = require(path);
    for (let index = 0; index < mdata.length; index++) {
      result2 = Model.findOneAndUpdate(
        { ID: mdata.ID, ItemNumber: mdata[index]["ItemNumber"] },
        mdata[index],
        {
          new: true,
          runValidators: true,
        }
      );
    }
    return result;
  },
  collectExceptionFields: function (FieldDef) {
    myFieldArray = [];
    myPossValArray = [];
    pvalObj = {};
    pvalArr = [];
    for (let index = 0; index < FieldDef.length; index++) {
      const element1 = FieldDef[index].name;
      myFieldArray.push(element1);
    }
    exclude_array = [
      "appId",
      "applicationId",
      "user",
      "userName",
      "userEmail",
      "company",
      "companyName",
      "branch",
      "branchName",
      "area",
      "areaName",
      "ItemData",
      "TransLog",
      "MultiAttachments",
      "carouselImage",
      "USP_Name",
      "USP_Role",
      "USP_Image",
      "Partner",
      "TaxInvoicekey",
      "InvoiceTypekey",
      "lowerNodes",
      "upperNodes",
    ];
    myFieldArray.push.apply(myFieldArray, exclude_array);
    return myFieldArray;
  },
  tableFields: function (FieldDef) {
    myFieldArray = [];
    for (let index = 0; index < FieldDef.length; index++) {
      if (FieldDef[index].type == "Array") {
        myFieldArray.push(FieldDef[index].name);
      }
    }
    return myFieldArray;
  },
  getAdaptiveCard: function (appID, role) {
    card = {};
    cardSub1 = {};
    header = {};
    content = {};
    actions = {};
    body = {};
    icon = {};

    let path1 = "../cards/adaptivecardforms/" + appID + "_" + role + ".json";
    let path2 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_actions.json";
    const cardbody = require(path1);
    const cardaction = require(path2);

    card["sap.app"] = {
      type: "card",
      id: "smartphoneapps",
    };
    card["cardMinRows"] = 4;
    card["cardColumn"] = 4;
    header["title"] = "Create Record";
    header["subTitle"] = "Create Form";
    if (appID == "TRAIN008") {
      header["title"] = "New Training Request";
      header["subTitle"] = "Trainings not in Catalogue";
    }
    if (appID == "TRAIN007") {
      header["title"] = "New Training Request";
      header["subTitle"] = "Trainings not in Catalogue";
    }
    if (appID == "BUS0000001") {
      header["title"] = "IT Service Ticket";
      header["subTitle"] = "Request IT Service Ticket";
    }
    if (appID == "BUS0000002") {
      header["title"] = "Flight Booking";
      header["subTitle"] = "Request Flight Booking";
    }
    if (appID == "BUS0000003") {
      header["title"] = "Taxi Booking";
      header["subTitle"] = "Request Online Taxi Booking";
    }

    if (appID == "BUS0000004") {
      header["title"] = "Train Booking";
      header["subTitle"] = "Request Train Booking";
    }
    if (appID == "BUS0000005") {
      header["title"] = "Contact Us";
      header["subTitle"] = "Contact Us";
    }
    if (appID == "BUS0000006") {
      header["title"] = "Employee Complaint";
      header["subTitle"] = "Employee Complaint";
    }
    if (appID == "EMPACC01") {
      header["title"] = "Laptop Requests";
      header["subTitle"] = "New Laptop Request ";
    }
    if (appID == "EMPBOK01") {
      header["title"] = "Employee Bookings";
      header["subTitle"] = "Meeting Room Booking";
    }
    icon["src"] = "sap-icon://form";
    header["icon"] = icon;
    cardSub1["header"] = header;

    cardSub1["type"] = "AdaptiveCard";

    content["$schema"] = "http://adaptivecards.io/schemas/adaptive-card.json";
    content["type"] = "AdaptiveCard";
    content["version"] = "1.0";
    content["body"] = cardbody["body"];
    content["actions"] = cardaction["actions"];
    cardSub1["content"] = content;

    card["sap.card"] = cardSub1;
    return card;
  },
  getCalendarCard: function (appID, role) {
    let path1 = "../cards/calendarCard/" + appID + "_" + role + "_content.json";
    let path2 = "../cards/calendarCard/" + appID + "_" + role + "_header.json";
    let path3 = "../cards/calendarCard/" + appID + "_" + role + "_item.json";
    let path4 =
      "../cards/calendarCard/" + appID + "_" + role + "_legendItem.json";
    let path5 =
      "../cards/calendarCard/" + appID + "_" + role + "_specialDate.json";
    //let path6 = "../cards/calendarCard/Calendar1_template.json";

    const cardcontent = require(path1);
    const cardheader = require(path2);
    const carditem = require(path3);
    const cardlegendItem = require(path4);
    const cardspecialDate = require(path5);
    //const cardtemplate = require(path6);

    let cJson = {};
    let cdata = {};
    let cardSub1 = {};
    let card = {};
    card["sap.app"] = {
      type: "card",
      id: "smartphoneapps",
    };
    card["cardMinRows"] = 4;
    card["cardColumn"] = 4;

    cJson["item"] = carditem["item"];
    cJson["legendItem"] = cardlegendItem["legendItem"];
    cJson["specialDate"] = cardspecialDate["specialDate"];
    cdata["json"] = cJson;
    cardSub1["type"] = "Calendar";
    cardSub1["data"] = cdata;
    cardSub1["header"] = cardheader["header"];
    cardSub1["content"] = cardcontent["content"];
    card["sap.card"] = cardSub1;
    return card;
  },
  generateID: async function (buttonName, body, MButtons, numberRange, req) {
    /// Calculate ID
    let sourceID = numberRange;
    if (buttonName == "UPLOAD") {
      for (let a = 0; a < MButtons.length; a++) {
        if (
          MButtons[a]["type"] == "UPLOAD" &&
          MButtons[a]["key"]["ID"] == "External"
        ) {
          sourceID = "External";

          if (MButtons[a]["key"]["generateID"].length > 0) {
            for (let k = 0; k < MButtons[a]["key"]["generateID"].length; k++) {
              if (k == 0) {
                body["ID"] = body[MButtons[a]["key"]["generateID"][k]];
              } else {
                body["ID"] =
                  body["ID"] +
                  MButtons[a]["key"]["seperator"] +
                  body[MButtons[a]["key"]["generateID"][k]];
              }
            }
          }
        }
      }
    }
    if (sourceID == "External") {
      console.log("ID is read from the file", sourceID);
    } else {
      let numberR = {};
      let newNumber = 0;
      console.log("Internal ID");
      numberR = await NumberRange.findOne({
        numberRange: req.headers.applicationid,
      });
      console.log("NumberRange", numberR);
      if (numberR != undefined) {
        newNumber = Number(numberR["current"]) + 1;
        numberR2 = await NumberRange.findByIdAndUpdate(numberR.id, {
          current: newNumber,
        });
        var userString = req.user.email.substring(2, 0).toUpperCase();
        numberofDigits = numberR["maxLen"] - 5;
        countLen = numberR["current"].length;
        switch (numberofDigits - countLen) {
          case 1:
            body["ID"] = numberR["preString"] + userString + "0" + newNumber;
            break;
          case 2:
            body["ID"] = numberR["preString"] + userString + "00" + newNumber;
            break;
          case 3:
            body["ID"] = numberR["preString"] + userString + "000" + newNumber;
            break;
          case 4:
            body["ID"] = numberR["preString"] + userString + "0000" + newNumber;
            break;
          case 5:
            body["ID"] =
              numberR["preString"] + userString + "00000" + newNumber;
            break;
          case 6:
            body["ID"] =
              numberR["preString"] + userString + "000000" + newNumber;
            break;
          case 7:
            body["ID"] =
              numberR["preString"] + userString + "0000000" + newNumber;
            break;
          default:
            body["ID"] = numberR["preString"] + userString + newNumber;
            break;
        }
      } else {
        body["ID"] = Math.floor(100000 + Math.random() * 900000);
      }
    }
    return body;
  },
  updateFile: function (fn01, config) {
    let out1 = {};
    fs.writeFile(fn01, JSON.stringify(config), function writeJSON(err) {
      if (err) {
        out1["resCode"] = 400;
        out1["success"] = false;
        out1["message"] = "Error while updating the file.";
        out1["error"] = err;
        console.log(err);
        return false;
      } else {
        console.log("writing to " + fn01);
        out1["resCode"] = 201;
        out1["success"] = true;
        out1["message"] = "The file exists & updated..";
        return true;
        //     out1["error"] = {};
      }
    });
  },
  cardReplace: function (mycard, cardData, appconfig, mode, tab, ControlValue) {
    if (mode == "header") {
      if (ControlValue != "NA") {
        // Control Display = ON
        cardData = cardData.replace("@Title", ControlValue);
      } else {
        // Control Display = OFF
        cardData = cardData.replace(
          "@Title",
          appconfig["Title"]["ApplicationTitle"]
        );
      }
    } else {
      if (appconfig["tableConfig"][mode]["title"] != undefined) {
        cardData = cardData.replace(
          "@Title",
          appconfig["tableConfig"][mode]["title"]
        );
      } else {
        cardData = cardData.replace("@Title", mode);
      }
    }
    if (mode == "header") {
      cardData = cardData.replace(
        "@subTitle",
        appconfig["Title"]["DetailTitle"]
      );
    } else {
      if (appconfig["tableConfig"][mode]["subtitle"] != undefined) {
        cardData = cardData.replace(
          "@subTitle",
          appconfig["tableConfig"][mode]["subtitle"]
        );
        cardData = cardData.replace("@UOM", mycard.unitOfMeasurement);
      } else {
        cardData = cardData.replace("@subTitle", mode);
        cardData = cardData.replace("@UOM", mycard.unitOfMeasurement);
      }
    }
    if (mycard.length > 0) {
      if (mycard["cardValues"].hasOwnProperty("@Value1")) {
        cardData = cardData.replace("@Value1", mycard["cardValues"]["@Value1"]);
      }
      if (mycard["cardValues"].hasOwnProperty("@Value2")) {
        cardData = cardData.replace("@Value2", mycard["cardValues"]["@Value2"]);
      }
      cardData = cardData.replace("@Value2", mycard["cardValues"]["@Value2"]);
      cardData = cardData.replace("@UOM", mycard.unitOfMeasurement);
      cardData = cardData.replace("@UOM", mycard.unitOfMeasurement);
      cardData = cardData.replace(
        "@unitOfMeasurement",
        mycard.unitOfMeasurement
      );
      cardData = cardData.replace("@filterKey", mycard["filterKey"]);
      cardData = cardData.replace("@filterKey", mycard["filterKey"]);
      cardData = cardData.replace("@filterKeyLabel", mycard["filterKeyLabel"]);
      cardData = cardData.replace("@filterKeyLabel", mycard["filterKeyLabel"]);
      cardData = cardData.replace("@HeaderActionURL", tab);
    }

    var d = new Date();
    var n = d.getTime();
    cardData = cardData.replace("@currentTime", n);

    var today = new Date();
    date001 = [
      "@currentDate",
      "@tomorrow",
      "@yesterday",
      "@weekBack",
      "@weekLater",
      "@30DaysLater",
      "@30DaysEarlier",
      "@15DaysLater",
      "@15DaysEarlier",
    ];
    date001.forEach((ex1) => {
      switch (ex1) {
        case "@currentDate":
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@currentDate", date);
          break;
        case "@tomorrow":
          today.setDate(today.getDate() + 1);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@tomorrow", date);
          break;
        case "@yesterday":
          today.setDate(today.getDate() - 1);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@yesterday", date);
          break;
        case "@weekBack":
          today.setDate(today.getDate() - 7);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@weekBack", date);
          break;
        case "@weekLater":
          today.setDate(today.getDate() + 7);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@weekLater", date);
          break;
        case "@30DaysLater":
          today.setDate(today.getDate() + 30);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@30DaysLater", date);
          break;
        case "@30DaysEarlier":
          today.setDate(today.getDate() - 30);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@30DaysEarlier", date);
          break;
        case "@15DaysLater":
          today.setDate(today.getDate() + 15);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@15DaysLater", date);
          break;
        case "@15DaysEarlier":
          today.setDate(today.getDate() - 15);
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          date = yyyy + "-" + mm + "-" + dd;
          cardData = cardData.replace("@15DaysEarlier", date);
          break;
        default:
          break;
      }
    });

    return cardData;
  },
  date1: function date1(array, field, order) {
    console.log("Inside Function");
    if (array == undefined || field == "" || order == "") {
      return new Array();
    } else {
      if (order == "A" || order == "Ascending") {
        console.log("Acending");
        return array
          .slice()
          .sort((a, b) => new Date(a[field]) - new Date(b[field]));
      } else {
        console.log("Decending");
        return array
          .slice()
          .sort((a, b) => new Date(b[field]) - new Date(a[field]));
      }
    }
  },
  integer: function integer(array, field, order) {
    console.log("Inside Function");
    if (array == undefined || field == "" || order == "") {
      return new Array();
    } else {
      if (order == "A" || order == "Ascending") {
        console.log("Acending");
        return array.slice().sort((a, b) => a[field] - b[field]);
      } else {
        console.log("Decending");
        return array.slice().sort((a, b) => b[field] - a[field]);
      }
    }
  },
  string: function string(array, field, order) {
    console.log("Inside Function");
    if (array == undefined || field == "" || order == "") {
      return new Array();
    } else {
      if (order == "A" || order == "Ascending") {
        console.log("Acending");
        return array.sort((a, b) => a[field].localeCompare(b[field]));
      } else {
        console.log("Decending");
        return array.sort((a, b) => b[field].localeCompare(a[field]));
      }
    }
  },
  replaceDefaults: function (req, reqQuery, config1, ivalue) {
    if (config1 != undefined) {
      for (let x = 0; x < config1.Controls.Filters.length; x++) {
        for (const key in config1.Controls.Filters[x]) {
          if (config1.Controls.Filters[x].hasOwnProperty(key)) {
            switch (config1.Controls.Filters[x][key]) {
              case "@user":
                reqQuery[key] = req.user.email;
                break;
              case "@CostCentre":
                for (let y = 0; y < ivalue.length; y++) {
                  for (const key in ivalue[y]) {
                    if (ivalue[y]["Field"] == "CostCentre") {
                      reqQuery["CostCentre"] = ivalue[y]["Value"];
                    }
                  }
                }
                break;
              //     Status=ne|Complete
              default:
                reqQuery[key] = config1.Controls.Filters[x][key];
                break;
            }
          }
        }
      }
    }
    return reqQuery;
  },
  additionalFilters: function (req, reqQuery) {
    for (const k1 in req.query) {
      if (req.query.hasOwnProperty(k1)) {
        var res = req.query[k1].split("|");
        if (res.length > 1) {
          tx = {};
          tx["in"] = res;
          reqQuery[k1] = tx;
        } else {
          reqQuery[k1] = res[0];
        }
      }
    }
    // if (reqQuery) {
    //   reqQuery["company"] = req.user.company;
    // }
    return reqQuery;
  },
  formatQuery: function (reqQuery) {
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in|regex|options)\b/g,
      (match) => `$${match}`
    );

    return queryStr;
  },
  replaceConfig: function (appconfig, user) {
    // console.log("User Email:", user.email);
    let con01 = JSON.stringify(appconfig);
    con01 = con01.replace("@user", user.email);
    con01 = con01.replace("@user", user.email);
    con01 = con01.replace("@user", user.email);
    con01 = con01.replace("@user", user.email);
    con01 = con01.replace("@user", user.email);
    appconfig = JSON.parse(con01);
    return appconfig;
  },
  cdbody1xIValue: function (body1x, name, cVal) {
    body1x["id"] = name;
    body1x["value"] = cVal;
    body1x["type"] = "Input.Text";
    body1x["style"] = "text";
    return body1x;
  },
  body2xIValue: function (body2x, name) {
    body2x["size"] = "medium";
    body2x["isSubtle"] = true;
    body2x["type"] = "TextBlock";
    body2x["text"] = name;
    return body2x;
  },

  body1xIValueH: function (body1x, appconfig, name, val) {
    // Control Display = OFF
    body1x["id"] = name;
    body1x["value"] = val;
    for (let a = 0; a < appconfig["FieldDef"].length; a++) {
      if (appconfig["FieldDef"][a]["name"] == name) {
        switch (appconfig["FieldDef"][a]["type"]) {
          case "string":
            body1x["type"] = "Input.Text";
            body1x["style"] = "text";
            break;
          case "Date":
            //  Input.Date
            body1x["type"] = "Input.Date";
            body1x["style"] = "";
            break;
          case "hyperlink":
            // Input.Text
            body1x["type"] = "Input.Text";
            body1x["style"] = "url";
            break;
          case "Email":
            //"style": "email",
            // Text >> Input.Text
            body1x["type"] = "Input.Text";
            body1x["style"] = "email";
            break;

          case "Time":
            // Time >> Input.Time
            body1x["type"] = "Input.Time";
            body1x["style"] = "";
            break;
          case "Num,0":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,1":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,2":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,3":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          default:
            body1x["type"] = "Input.Text";
            body1x["style"] = "text";
            break;
        }
      }
    }
    return body1x;
  },
  body1xIValueI: function (body1x, appconfig, name, val) {
    body1x["id"] = name;
    body1x["value"] = val;
    for (let a = 0; a < appconfig["ItemFieldDefinition"].length; a++) {
      if (appconfig["ItemFieldDefinition"][a]["name"] == name) {
        switch (appconfig["ItemFieldDefinition"][a]["type"]) {
          case "string":
            body1x["type"] = "Input.Text";
            body1x["style"] = "text";
            break;
          case "Date":
            //  Input.Date
            body1x["type"] = "Input.Date";
            body1x["style"] = "";
            break;
          case "hyperlink":
            // Input.Text
            body1x["type"] = "Input.Text";
            body1x["style"] = "url";
            break;
          case "Email":
            //"style": "email",
            // Text >> Input.Text
            body1x["type"] = "Input.Text";
            body1x["style"] = "email";
            break;
          case "Time":
            // Time >> Input.Time
            body1x["type"] = "Input.Time";
            body1x["style"] = "";
            break;
          case "Num,0":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,1":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,2":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          case "Num,3":
            // Number >> Input.Number
            body1x["type"] = "Input.Number";
            body1x["style"] = "";
            break;
          default:
            body1x["type"] = "Input.Text";
            body1x["style"] = "text";
            break;
        }
      }
    }
    return body1x;
  },
  body2xChoiceSet: function (body2x, name) {
    body2x["isSubtle"] = true;
    body2x["type"] = "TextBlock";
    body2x["text"] = name;
    return body2x;
  },
  body1xChoiceSet: function (body1x, name, resPV, ControlField) {
    x_ch = [];

    if (ControlField == name) {
      // Control Display = ON
      // NO Possible values required!!
      body1x["style"] = "text";
      body1x["type"] = "Input.Text";
      body1x["id"] = name;
      body1x["placeholder"] = name;
    } else {
      // Control Display = OFF
      body1x["style"] = "expanded";
      body1x["type"] = "Input.ChoiceSet";
      body1x["id"] = name;
      for (let j = 0; j < resPV.length; j++) {
        if (resPV[j]["PossibleValues"] == name) {
          x_choices = {};
          x_choices["title"] = resPV[j]["Description"];
          x_choices["value"] = resPV[j]["Value"];
          x_ch.push(x_choices);
        }
      }
      body1x["choices"] = x_ch;
    }

    return body1x;
  },
  body2xIValue: function (body2x, name) {
    body2x["size"] = "medium";
    body2x["isSubtle"] = true;
    body2x["type"] = "TextBlock";
    body2x["text"] = name;
    return body2x;
  },
  body1xAdaptiveCard: function (type, width, body1x, name) {
    switch (type) {
      case "string":
        // Text >> Input.Text
        //"style": "text",
        body1x["style"] = "text";
        body1x["type"] = "Input.Text";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        //"isMultiline"
        if (width > 100) {
          body1x["isMultiline"] = true;
        } else {
          body1x["isMultiline"] = false;
        }
        break;
      case "Date":
        // Date >> Input.Date
        body1x["type"] = "Input.Date";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      case "hyperlink":
        //"style": "url",
        // Text >> Input.Text
        body1x["style"] = "url";
        body1x["type"] = "Input.Text";
        body1x["id"] = name;
        body1x["placeholder"] = "Website Url";

        break;
      case "Email":
        //"style": "email",
        // Text >> Input.Text
        body1x["style"] = "email";
        body1x["type"] = "Input.Text";
        body1x["id"] = name;
        body1x["placeholder"] = "youremail@example.com";

        break;
      case "Time":
        // Time >> Input.Time
        body1x["type"] = "Input.Time";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      case "Num,0":
        // Number >> Input.Number
        body1x["type"] = "Input.Number";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      case "Num,1":
        // Number >> Input.Number
        body1x["type"] = "Input.Number";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      case "Num,2":
        // Number >> Input.Number
        body1x["type"] = "Input.Number";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      case "Num,3":
        // Number >> Input.Number
        body1x["type"] = "Input.Number";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        break;
      default:
        body1x["style"] = "text";
        body1x["type"] = "Input.Text";
        body1x["id"] = name;
        body1x["placeholder"] = name;
        //"isMultiline"
        if (width > 100) {
          body1x["isMultiline"] = true;
        } else {
          body1x["isMultiline"] = false;
        }
        break;
    }
    return body1x;
  },
  body2xAdaptiveCard: function (type, width, body2x, name) {
    switch (type) {
      case "string":
        // Text >> Input.Text
        //"style": "text",
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Date":
        // Date >> Input.Date
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "hyperlink":
        //"style": "url",
        // Text >> Input.Text
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Email":
        //"style": "email",
        // Text >> Input.Text
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Time":
        // Time >> Input.Time
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Num,0":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Num,1":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Num,2":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      case "Num,3":
        // Number >> Input.Number
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
      default:
        body2x["size"] = "medium";
        body2x["isSubtle"] = true;
        body2x["type"] = "TextBlock";
        body2x["text"] = name;
        break;
    }
    return body2x;
  },
  buildButtons: function (type, title, app, role1, id, email, ratio, mode) {
    btn1 = {};
    if (type == "web_url" && mode == "display") {
      btn1["type"] = type;
      btn1["title"] = title;
      btn1["url"] =
        "https://smartphonebizapps.com/smartphoneappswebview/?view=webDisplay&app=" +
        app +
        "&role=" +
        role1 +
        "&transID=" +
        id +
        "&user=" +
        email;
      btn1["webview_height_ratio"] = ratio;
      btn1["messenger_extensions"] = true;
      return btn1;
    }
    if (type == "web_url" && mode == "create") {
      btn1["type"] = type;
      btn1["title"] = title;
      btn1["url"] =
        "https://smartphonebizapps.com/smartphoneappswebview/?view=webCreate&app=" +
        app +
        "&role=" +
        role1 +
        "&transID=" +
        id +
        "&user=" +
        email;
      btn1["webview_height_ratio"] = ratio;
      btn1["messenger_extensions"] = true;
      return btn1;
    }
    if (type == "postBack") {
      btn1["type"] = type;
      btn1["title"] = title;
      btn1["payload"] = ratio + "-" + mode + " " + id;

      return btn1;
    }
  },
};
