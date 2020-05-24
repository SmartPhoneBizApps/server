const express = require("express");
const { createwithref } = require("../../controllers/smartApp/createwithref");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedDataList = require("../../middleware/advancedDataList");
//const advancedDataListItems = require("../../middleware/advancedDataList_withItem");
const advancedCreate = require("../../middleware/advancedCreate");
const { protect, authorize } = require("../../middleware/auth");

const BUS0000002 = require("../../models/smartApp/BUS0000002");
const BUS0000003 = require("../../models/smartApp/BUS0000003");
const BUS0000004 = require("../../models/smartApp/BUS0000004");
const BUS0000005 = require("../../models/smartApp/BUS0000005");
const BUS0000006 = require("../../models/smartApp/BUS0000006");
const COUNCIL001 = require("../../models/smartApp/COUNCIL001");
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
const EMP00006OLD = require("../../models/smartApp/EMP00006OLD");
const EMP00008 = require("../../models/smartApp/EMP00008");
const EMP00013 = require("../../models/smartApp/EMP00013");
const EMP00021 = require("../../models/smartApp/EMP00021");
const EMPACC01 = require("../../models/smartApp/EMPACC01");
const EMPBOK01 = require("../../models/smartApp/EMPBOK01");
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
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");

//router.use("/:smartappId/reviews", reviewRouter);

router
  .route("/BUS0000002")
  .post(
    protect,
    advancedDataList(BUS0000002, BUS0000002, "BUS0000002"),
    createwithref
  );
router
  .route("/BUS0000003")
  .post(
    protect,
    advancedDataList(BUS0000003, BUS0000003, "BUS0000003"),
    createwithref
  );
router
  .route("/BUS0000004")
  .post(
    protect,
    advancedDataList(BUS0000004, BUS0000004, "BUS0000004"),
    createwithref
  );
router
  .route("/BUS0000005")
  .post(
    protect,
    advancedDataList(BUS0000005, BUS0000005, "BUS0000005"),
    createwithref
  );
router
  .route("/BUS0000006")
  .post(
    protect,
    advancedDataList(BUS0000006, BUS0000006, "BUS0000006"),
    createwithref
  );
router
  .route("/COUNCIL001")
  .post(
    protect,
    advancedDataList(COUNCIL001, COUNCIL001, "COUNCIL001"),
    createwithref
  );
router
  .route("/COUNCIL002")
  .post(
    protect,
    advancedDataList(COUNCIL002, COUNCIL002, "COUNCIL002"),
    createwithref
  );
router
  .route("/COUNCIL003")
  .post(
    protect,
    advancedDataList(COUNCIL003, COUNCIL003, "COUNCIL003"),
    createwithref
  );
router
  .route("/COUNCIL007")
  .post(
    protect,
    advancedDataList(COUNCIL007, COUNCIL007, "COUNCIL007"),
    createwithref
  );
router
  .route("/COUNCIL012")
  .post(
    protect,
    advancedDataList(COUNCIL012, COUNCIL012, "COUNCIL012"),
    createwithref
  );
router
  .route("/COUNCIL015")
  .post(
    protect,
    advancedDataList(COUNCIL015, COUNCIL015, "COUNCIL015"),
    createwithref
  );
router
  .route("/COUNCIL022")
  .post(
    protect,
    advancedDataList(COUNCIL022, COUNCIL022, "COUNCIL022"),
    createwithref
  );
router
  .route("/COUNCIL023")
  .post(
    protect,
    advancedDataList(COUNCIL023, COUNCIL023, "COUNCIL023"),
    createwithref
  );
router
  .route("/COUNCIL026")
  .post(
    protect,
    advancedDataList(COUNCIL026, COUNCIL026, "COUNCIL026"),
    createwithref
  );
router
  .route("/COUNCIL029")
  .post(
    protect,
    advancedDataList(COUNCIL029, COUNCIL029, "COUNCIL029"),
    createwithref
  );
router
  .route("/COUNCIL033")
  .post(
    protect,
    advancedDataList(COUNCIL033, COUNCIL033, "COUNCIL033"),
    createwithref
  );
router
  .route("/COUNCIL034")
  .post(
    protect,
    advancedDataList(COUNCIL034, COUNCIL034, "COUNCIL034"),
    createwithref
  );
router
  .route("/COUNCIL035")
  .post(
    protect,
    advancedDataList(COUNCIL035, COUNCIL035, "COUNCIL035"),
    createwithref
  );
router
  .route("/COUNCIL036")
  .post(
    protect,
    advancedDataList(COUNCIL036, COUNCIL036, "COUNCIL036"),
    createwithref
  );
router
  .route("/DOC00001")
  .post(
    protect,
    advancedDataList(DOC00001, DOC00001, "DOC00001"),
    createwithref
  );
router
  .route("/DOC00002")
  .post(
    protect,
    advancedDataList(DOC00002, DOC00002, "DOC00002"),
    createwithref
  );
router
  .route("/DOC00003")
  .post(
    protect,
    advancedDataList(DOC00003, DOC00003, "DOC00003"),
    createwithref
  );
router
  .route("/EDU00001")
  .post(
    protect,
    advancedDataList(EDU00001, EDU00001, "EDU00001"),
    createwithref
  );
router
  .route("/EDU00002")
  .post(
    protect,
    advancedDataList(EDU00002, EDU00002, "EDU00002"),
    createwithref
  );
router
  .route("/EDU00003")
  .post(
    protect,
    advancedDataList(EDU00003, EDU00003, "EDU00003"),
    createwithref
  );
router
  .route("/EDU00004")
  .post(
    protect,
    advancedDataList(EDU00004, EDU00004, "EDU00004"),
    createwithref
  );
router
  .route("/EDU00005")
  .post(
    protect,
    advancedDataList(EDU00005, EDU00005, "EDU00005"),
    createwithref
  );
router
  .route("/EDU00006")
  .post(
    protect,
    advancedDataList(EDU00006, EDU00006, "EDU00006"),
    createwithref
  );
router
  .route("/EDU00007")
  .post(
    protect,
    advancedDataList(EDU00007, EDU00007, "EDU00007"),
    createwithref
  );
router
  .route("/EDU00008")
  .post(
    protect,
    advancedDataList(EDU00008, EDU00008, "EDU00008"),
    createwithref
  );
router
  .route("/EDU00009")
  .post(
    protect,
    advancedDataList(EDU00009, EDU00009, "EDU00009"),
    createwithref
  );
router
  .route("/EDU00010")
  .post(
    protect,
    advancedDataList(EDU00010, EDU00010, "EDU00010"),
    createwithref
  );
router
  .route("/EDU00011")
  .post(
    protect,
    advancedDataList(EDU00011, EDU00011, "EDU00011"),
    createwithref
  );
router
  .route("/EDU00013")
  .post(
    protect,
    advancedDataList(EDU00013, EDU00013, "EDU00013"),
    createwithref
  );
router
  .route("/EDU00014")
  .post(
    protect,
    advancedDataList(EDU00014, EDU00014, "EDU00014"),
    createwithref
  );
router
  .route("/EDU00015")
  .post(
    protect,
    advancedDataList(EDU00015, EDU00015, "EDU00015"),
    createwithref
  );
router
  .route("/EDU00016")
  .post(
    protect,
    advancedDataList(EDU00016, EDU00016, "EDU00016"),
    createwithref
  );
router
  .route("/EDU00018")
  .post(
    protect,
    advancedDataList(EDU00018, EDU00018, "EDU00018"),
    createwithref
  );
router
  .route("/EDU00019")
  .post(
    protect,
    advancedDataList(EDU00019, EDU00019, "EDU00019"),
    createwithref
  );
router
  .route("/EDU00021")
  .post(
    protect,
    advancedDataList(EDU00021, EDU00021, "EDU00021"),
    createwithref
  );
router
  .route("/EDU00097")
  .post(
    protect,
    advancedDataList(EDU00097, EDU00097, "EDU00097"),
    createwithref
  );
router
  .route("/EDU00098")
  .post(
    protect,
    advancedDataList(EDU00098, EDU00098, "EDU00098"),
    createwithref
  );
router
  .route("/EDU0100")
  .post(protect, advancedDataList(EDU0100, EDU0100, "EDU0100"), createwithref);
router
  .route("/EMP00001")
  .post(
    protect,
    advancedDataList(EMP00001, EMP00001, "EMP00001"),
    createwithref
  );
router
  .route("/EMP00002")
  .post(
    protect,
    advancedDataList(EMP00002, EMP00002, "EMP00002"),
    createwithref
  );
router
  .route("/EMP00004")
  .post(
    protect,
    advancedDataList(EMP00004, EMP00004, "EMP00004"),
    createwithref
  );
router
  .route("/EMP00006")
  .post(
    protect,
    advancedDataList(EMP00006, EMP00006, "EMP00006"),
    createwithref
  );
router
  .route("/EMP00006OLD")
  .post(
    protect,
    advancedDataList(EMP00006OLD, EMP00006OLD, "EMP00006OLD"),
    createwithref
  );
router
  .route("/EMP00008")
  .post(
    protect,
    advancedDataList(EMP00008, EMP00008, "EMP00008"),
    createwithref
  );
router
  .route("/EMP00013")
  .post(
    protect,
    advancedDataList(EMP00013, EMP00013, "EMP00013"),
    createwithref
  );
router
  .route("/EMP00021")
  .post(
    protect,
    advancedDataList(EMP00021, EMP00021, "EMP00021"),
    createwithref
  );
router
  .route("/EMPACC01")
  .post(
    protect,
    advancedDataList(EMPACC01, EMPACC01, "EMPACC01"),
    createwithref
  );
router
  .route("/EMPBOK01")
  .post(
    protect,
    advancedDataList(EMPBOK01, EMPBOK01, "EMPBOK01"),
    createwithref
  );
router
  .route("/ERP00002")
  .post(
    protect,
    advancedDataList(ERP00002, ERP00002, "ERP00002"),
    createwithref
  );
router
  .route("/ERP00003")
  .post(
    protect,
    advancedDataList(ERP00003, ERP00003, "ERP00003"),
    createwithref
  );
router
  .route("/ERP00004")
  .post(
    protect,
    advancedDataList(ERP00004, ERP00004, "ERP00004"),
    createwithref
  );
router
  .route("/ERP00005")
  .post(
    protect,
    advancedDataList(ERP00005, ERP00005, "ERP00005"),
    createwithref
  );
router
  .route("/ERP00008")
  .post(
    protect,
    advancedDataList(ERP00008, ERP00008, "ERP00008"),
    createwithref
  );
router
  .route("/ERP00009")
  .post(
    protect,
    advancedDataList(ERP00009, ERP00009, "ERP00009"),
    createwithref
  );
router
  .route("/ERP00010")
  .post(
    protect,
    advancedDataList(ERP00010, ERP00010, "ERP00010"),
    createwithref
  );
router
  .route("/ERP00014")
  .post(
    protect,
    advancedDataList(ERP00014, ERP00014, "ERP00014"),
    createwithref
  );
router
  .route("/HOSP0003")
  .post(
    protect,
    advancedDataList(HOSP0003, HOSP0003, "HOSP0003"),
    createwithref
  );
router
  .route("/HOSP0004")
  .post(
    protect,
    advancedDataList(HOSP0004, HOSP0004, "HOSP0004"),
    createwithref
  );
router
  .route("/ITPROJ002")
  .post(
    protect,
    advancedDataList(ITPROJ002, ITPROJ002, "ITPROJ002"),
    createwithref
  );
router
  .route("/JOB00001")
  .post(
    protect,
    advancedDataList(JOB00001, JOB00001, "JOB00001"),
    createwithref
  );
router
  .route("/LOG00001")
  .post(
    protect,
    advancedDataList(LOG00001, LOG00001, "LOG00001"),
    createwithref
  );
router
  .route("/LOG00002")
  .post(
    protect,
    advancedDataList(LOG00002, LOG00002, "LOG00002"),
    createwithref
  );
router
  .route("/LOG00003")
  .post(
    protect,
    advancedDataList(LOG00003, LOG00003, "LOG00003"),
    createwithref
  );
router
  .route("/LOG00004")
  .post(
    protect,
    advancedDataList(LOG00004, LOG00004, "LOG00004"),
    createwithref
  );
router
  .route("/PM00001")
  .post(protect, advancedDataList(PM00001, PM00001, "PM00001"), createwithref);
router
  .route("/SUPP00011")
  .post(
    protect,
    advancedDataList(SUPP00011, SUPP00011, "SUPP00011"),
    createwithref
  );
router
  .route("/SUPP00012")
  .post(
    protect,
    advancedDataList(SUPP00012, SUPP00012, "SUPP00012"),
    createwithref
  );
router
  .route("/SUPP00013")
  .post(
    protect,
    advancedDataList(SUPP00013, SUPP00013, "SUPP00013"),
    createwithref
  );
router
  .route("/SUPP00014")
  .post(
    protect,
    advancedDataList(SUPP00014, SUPP00014, "SUPP00014"),
    createwithref
  );
router
  .route("/SUPP00015")
  .post(
    protect,
    advancedDataList(SUPP00015, SUPP00015, "SUPP00015"),
    createwithref
  );
router
  .route("/SUPP00016")
  .post(
    protect,
    advancedDataList(SUPP00016, SUPP00016, "SUPP00016"),
    createwithref
  );
router
  .route("/SUPP00018")
  .post(
    protect,
    advancedDataList(SUPP00018, SUPP00018_Itm, "SUPP00018"),
    createwithref
  );
router
  .route("/SUPP00028")
  .post(
    protect,
    advancedDataList(SUPP00028, SUPP00028_Itm, "SUPP00028"),
    createwithref
  );

module.exports = router;
