const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");
const ErrorResponse = require("../../utils/errorResponse");
const mongoose = require("mongoose");

module.exports = {
  getSchema: function (app) {
    const BUS0000002 = require("../../models/smartApp/BUS0000002");
    const BUS0000003 = require("../../models/smartApp/BUS0000003");
    const BUS0000004 = require("../../models/smartApp/BUS0000004");
    const BUS0000005 = require("../../models/smartApp/BUS0000005");
    const COUNCIL002 = require("../../models/smartApp/COUNCIL002");
    const COUNCIL003 = require("../../models/smartApp/COUNCIL003");
    const COUNCIL007 = require("../../models/smartApp/COUNCIL007");
    const COUNCIL012 = require("../../models/smartApp/COUNCIL012");
    const COUNCIL015 = require("../../models/smartApp/COUNCIL015");
    const COUNCIL022 = require("../../models/smartApp/COUNCIL022");
    const COUNCIL023 = require("../../models/smartApp/COUNCIL023");
    const COUNCIL026 = require("../../models/smartApp/COUNCIL026");
    const COUNCIL029 = require("../../models/smartApp/COUNCIL029");
    const COUNCIL033 = require("../../models/smartApp/COUNCIL033");
    const COUNCIL034 = require("../../models/smartApp/COUNCIL034");
    const COUNCIL035 = require("../../models/smartApp/COUNCIL035");
    const COUNCIL036 = require("../../models/smartApp/COUNCIL036");
    const DOC00001 = require("../../models/smartApp/DOC00001");
    const DOC00002 = require("../../models/smartApp/DOC00002");
    const DOC00003 = require("../../models/smartApp/DOC00003");
    const EDU00001 = require("../../models/smartApp/EDU00001");
    const EDU00002 = require("../../models/smartApp/EDU00002");
    const EDU00003 = require("../../models/smartApp/EDU00003");
    const EDU00004 = require("../../models/smartApp/EDU00004");
    const EDU00005 = require("../../models/smartApp/EDU00005");
    const EDU00006 = require("../../models/smartApp/EDU00006");
    const EDU00007 = require("../../models/smartApp/EDU00007");
    const EDU00008 = require("../../models/smartApp/EDU00008");
    const EDU00009 = require("../../models/smartApp/EDU00009");
    const EDU00010 = require("../../models/smartApp/EDU00010");
    const EDU00011 = require("../../models/smartApp/EDU00011");
    const EDU00013 = require("../../models/smartApp/EDU00013");
    const EDU00014 = require("../../models/smartApp/EDU00014");
    const EDU00015 = require("../../models/smartApp/EDU00015");
    const EDU00016 = require("../../models/smartApp/EDU00016");
    const EDU00018 = require("../../models/smartApp/EDU00018");
    const EDU00019 = require("../../models/smartApp/EDU00019");
    const EDU00021 = require("../../models/smartApp/EDU00021");
    const EDU00097 = require("../../models/smartApp/EDU00097");
    const EDU00098 = require("../../models/smartApp/EDU00098");
    const EDU0100 = require("../../models/smartApp/EDU0100");
    const EMP00001 = require("../../models/smartApp/EMP00001");
    const EMP00002 = require("../../models/smartApp/EMP00002");
    const EMP00004 = require("../../models/smartApp/EMP00004");
    const EMP00006 = require("../../models/smartApp/EMP00006");
    const EMP00008 = require("../../models/smartApp/EMP00008");
    const EMP00013 = require("../../models/smartApp/EMP00013");
    const EMP00021 = require("../../models/smartApp/EMP00021");
    const EMPBOK01 = require("../../models/smartApp/EMPBOK01");
    const EMPACC01 = require("../../models/smartApp/EMPACC01");
    const ERP00002 = require("../../models/smartApp/ERP00002");
    const ERP00003 = require("../../models/smartApp/ERP00003");
    const ERP00004 = require("../../models/smartApp/ERP00004");
    const ERP00005 = require("../../models/smartApp/ERP00005");
    const ERP00008 = require("../../models/smartApp/ERP00008");
    const ERP00009 = require("../../models/smartApp/ERP00009");
    const ERP00010 = require("../../models/smartApp/ERP00010");
    const ERP00014 = require("../../models/smartApp/ERP00014");
    const HOSP0003 = require("../../models/smartApp/HOSP0003");
    const HOSP0004 = require("../../models/smartApp/HOSP0004");
    const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
    const JOB00001 = require("../../models/smartApp/JOB00001");
    const LOG00001 = require("../../models/smartApp/LOG00001");
    const LOG00002 = require("../../models/smartApp/LOG00002");
    const LOG00003 = require("../../models/smartApp/LOG00003");
    const LOG00004 = require("../../models/smartApp/LOG00004");
    const PM00001 = require("../../models/smartApp/PM00001");
    const SUPP00011 = require("../../models/smartApp/SUPP00011");
    const SUPP00012 = require("../../models/smartApp/SUPP00012");
    const SUPP00013 = require("../../models/smartApp/SUPP00013");
    const SUPP00014 = require("../../models/smartApp/SUPP00014");
    const SUPP00015 = require("../../models/smartApp/SUPP00015");
    const SUPP00016 = require("../../models/smartApp/SUPP00016");
    const SUPP00018 = require("../../models/smartApp/SUPP00018");
    const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
    const SUPP00028 = require("../../models/smartApp/SUPP00028");
    const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");
    return;
  },
};
