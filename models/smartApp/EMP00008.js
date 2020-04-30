const mongoose = require("mongoose");
const Validationrule = require("../appSetup/Validationrule");

var sch = require("../../applicationJSON/Schema_Master.json");
file = "../../applicationJSON/EMP00008.json";

//RegEx for validating emailIDs
EMAIL_V1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//RegEx for validating Website
WEBSITE_V1 = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
//RegEx for validating UK Post Code
UK_POSTCODE_V1 = /[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}/i;
// India PIN Number (400 099 | 400099 | 400050)
IN_PINCODE_V1 = /^\d{3}\s?\d{3}$/;
//RegEx for US Zip Code
US_STATE_ZIPCODE_V1 = /\d{5}(-\d{4})?/;
//RegEx for validating UK NI Number
UK_NI_NUMBER_V1 = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-DFM]{0,1}$/;
//RegEx for validating UK Bank Sortcode
UK_BANK_SORTCODE_V1 = /^[0-9]{2}[-][0-9]{2}[-][0-9]{2}$/;
//RegEx for validating UK Bank Account
UK_BANK_ACCOUNT = /^(\d){8}$/;

//RegEx for validating an float with two decimal places
NUM_2_DEC_PLACE_V1 = /^(?!^0\.00$)(([1-9][\d]{0,6})|([0]))\.[\d]{2}$/;
//RegEx for validating an integer with a maximum length of 10 characters
NUM_INT_MAX_10D_V1 = /[^0-9][+-]?[0-9]{1,10}[^0-9]/;
//RegEx for Latitude validation
LATITUDE_V1 = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
//RegEx for Longitude validation
LONGITUDE_V1 = /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,6}/;
//RegEx to validate UK Mobile number
UK_MOBILE_V1 = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
//RegEx to validate UK Phone number
UK_PHONE_V1 = /(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}/;
// India Mobile Number
IN_MOBILE_V1 = /^([9]{1})([234789]{1})([0-9]{8})$/;
//RegEx to validate UK Car Reg Number - DVLA
UK_CAR_REG_V1 = /(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)/;
//RegEx to validate UK Car Reg Number
UK_CAR_REG_V2 = /(^[A-Z]{2}[0-9]{2} [A-Z]{3}$)|(^[A-Z][0-9]{1,3} [A-Z]{3}$)|(^[A-Z]{3} [0-9]{1,3}[A-Z]$)|(^[0-9]{1,4} [A-Z]{1,2}$)|(^[0-9]{1,3} [A-Z]{1,3}$)|(^[A-Z]{1,2} [0-9]{1,4}$)|(^[A-Z]{1,3} [0-9]{1,3}$)/;
//RegEx to validate UK VAT Registration Number
UK_VATREGNO_V1 = /^([GB])*(([1-9]\d{8})|([1-9]\d{11}))$/;
//RegEx to validate UK VAT Registration Number (mh-12-bj-1780 | mmx-1234)
IN_VECH_REG_V1 = /^([A-Z|a-z]{2}-\d{2}-[A-Z|a-z]{2}-\d{1,4})?([A-Z|a-z]{3}-\d{1,4})?$/;

//UK Company Name
UK_COMPANYNAME_V1 = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,}$/;
//UK Company Reg
UK_COMPANY_REG_V1 = /^[0-9]{8}$/;

PERCENTAGE_V1 = /^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?%?)$/;
//RegEx to validate Full Path and CSV
FULL_FILE_PATH_CSV_V1 = /^(?<Drive>([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w].*))(?<Year>\d{4})-(?<Month>\d{1,2})-(?<Day>\d{1,2})(?<ExtraText>.*)(?<Extension>.csv|.CSV)$/;
//RegEx to validate Date in YYYY-MM-DD fromat
DATE_V1 = /[0-9]{4}-([0][0-9]|[1][0-2])-([0][0-9]|[1][0-9]|[2][0-9]|[3][0-1])/;

//No Whitespace
NO_WHITESPACE_V1 = /^[^\s]+$/;

TWITTER_ACCOUNT_V1 = /^@?(\w){1,15}$/;

TWITTER_URL_V1 = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;

LINKEDIN_URL_V1 = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/;

FACEBOOK_URL_V1 = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;

GENDER_V1 = /^(?:m|M|male|Male|f|F|female|Female)$/;

UK_DRIVING_LICENCE_V1 = /^[A-Z9]{5}[0-9]([05][1-9]|[16][0-2])(0[1-9]|[12][0-9]|3[01])[0-9][A-Z9][0-9][A-Z0-9]([0-9]{2}?)$/;

// India Phone Number (+919847444225 | +91-98-44111112 | 98 44111116)
IN_PHONE_V1 = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}98(\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/;
//Indian Passport No Format (A-1234567)
IN_PASSPORT_V1 = /^[A-Z]{1}-[0-9]{7}$/;

//DUNS Number (123123123)
DUNS_NUM_V1 = /^\d{9}$/;

// Validate Year YYYY
YEAR_V1 = /^\d{4}$/;
// US Social Sec Number
SOCIAL_SEC_V1 = /^\d{3}-\d{2}-\d{4}$/;

//NHS Hospital Number (D Number)
NHS_HOSPITAL_NUM_V1 = /[DJF]{1}[0-9]{5,8}/;

/* for (let prop in sch) {
  file = "../../applicationJSON/" + sch[prop] + ".json";
  console.log(file);
} */

var json = require(file);

for (let prop in json) {
  if (json[prop].match) {
    console.log(json[prop].match[0]);

    if (json[prop].match[0] == "EMAIL_V1") {
      json[prop].match[0] = EMAIL_V1;
    }
    if (json[prop].match[0] == "WEBSITE_V1") {
      json[prop].match[0] = WEBSITE_V1;
    }

    if (json[prop].match[0] == "NUM_2_DEC_PLACE_V1") {
      json[prop].match[0] = NUM_2_DEC_PLACE_V1;
    }
    if (json[prop].match[0] == "NUM_INT_MAX_10D_V1") {
      json[prop].match[0] = NUM_INT_MAX_10D_V1;
    }
    if (json[prop].match[0] == "LATITUDE_V1") {
      json[prop].match[0] = LATITUDE_V1;
    }
    if (json[prop].match[0] == "LONGITUDE_V1") {
      json[prop].match[0] = LONGITUDE_V1;
    }
    if (json[prop].match[0] == "NO_WHITESPACE_V1") {
      json[prop].match[0] = NO_WHITESPACE_V1;
    }
    if (json[prop].match[0] == "TWITTER_ACCOUNT_V1") {
      json[prop].match[0] = TWITTER_ACCOUNT_V1;
    }
    if (json[prop].match[0] == "TWITTER_URL_V1") {
      json[prop].match[0] = TWITTER_URL_V1;
    }
    if (json[prop].match[0] == "LINKEDIN_URL_V1") {
      json[prop].match[0] = LINKEDIN_URL_V1;
    }
    if (json[prop].match[0] == "FACEBOOK_URL_V1") {
      json[prop].match[0] = FACEBOOK_URL_V1;
    }
    if (json[prop].match[0] == "GENDER_V1") {
      json[prop].match[0] = GENDER_V1;
    }
    if (json[prop].match[0] == "PERCENTAGE_V1") {
      json[prop].match[0] = PERCENTAGE_V1;
    }

    if (json[prop].match[0] == "FULL_FILE_PATH_CSV_V1") {
      json[prop].match[0] = FULL_FILE_PATH_CSV_V1;
    }
    if (json[prop].match[0] == "DATE_V1") {
      json[prop].match[0] = DATE_V1;
    }
    if (json[prop].match[0] == "DUNS_NUM_V1") {
      json[prop].match[0] = DUNS_NUM_V1;
    }
    if (json[prop].match[0] == "YEAR_V1") {
      json[prop].match[0] = YEAR_V1;
    }
    if (json[prop].match[0] == "UK_POSTCODE_V1") {
      json[prop].match[0] = UK_POSTCODE_V1;
    }

    if (json[prop].match[0] == "UK_NI_NUMBER_V1") {
      json[prop].match[0] = UK_NI_NUMBER_V1;
    }
    if (json[prop].match[0] == "UK_BANK_SORTCODE_V1") {
      json[prop].match[0] = UK_BANK_SORTCODE_V1;
    }
    if (json[prop].match[0] == "UK_BANK_ACCOUNT") {
      json[prop].match[0] = UK_BANK_ACCOUNT;
    }
    if (json[prop].match[0] == "UK_MOBILE_V1") {
      json[prop].match[0] = UK_MOBILE_V1;
    }
    if (json[prop].match[0] == "UK_PHONE_V1") {
      json[prop].match[0] = UK_PHONE_V1;
    }

    if (json[prop].match[0] == "UK_CAR_REG_V1") {
      json[prop].match[0] = UK_CAR_REG_V1;
    }
    if (json[prop].match[0] == "UK_CAR_REG_V2") {
      json[prop].match[0] = UK_CAR_REG_V2;
    }
    if (json[prop].match[0] == "UK_VATREGNO_V1") {
      json[prop].match[0] = UK_VATREGNO_V1;
    }
    if (json[prop].match[0] == "UK_COMPANYNAME_V1") {
      json[prop].match[0] = UK_COMPANYNAME_V1;
    }
    if (json[prop].match[0] == "UK_COMPANY_REG_V1") {
      json[prop].match[0] = UK_COMPANY_REG_V1;
    }
    if (json[prop].match[0] == "NHS_HOSPITAL_NUM_V1") {
      json[prop].match[0] = NHS_HOSPITAL_NUM_V1;
    }
    if (json[prop].match[0] == "UK_DRIVING_LICENCE_V1") {
      json[prop].match[0] = UK_DRIVING_LICENCE_V1;
    }
  }
}

var fixed1 = {
  appId: {
    type: mongoose.Schema.ObjectId,
    ref: "App",
    required: true,
  },
  area: {
    type: mongoose.Schema.ObjectId,
    ref: "Area",
    required: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: true,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: "Company",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
};

var fixed2 = {
  applicationID: { type: "String" },
  areaName: { type: "String" },
  branchName: { type: "String" },
  companyName: { type: "String" },
  userName: { type: "String" },
  userEmail: { type: "String" },
  createdAt: {
    type: "Date",
    default: Date.now,
  },
};
MyOrg = { OrgData: "" };
MyOrg.OrgData = fixed1;
scmc = [];
scmc.push(json);
scmc.push(fixed2);
scmc.push(fixed1);

const XSchema = new mongoose.Schema(scmc);

module.exports = mongoose.model("EMP00008", XSchema);
