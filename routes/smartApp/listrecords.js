const express = require("express");
const {
  getListrecords,
  getListrecords1,
} = require("../../controllers/smartApp/listrecords");
const router = express.Router();
const advancedDataList = require("../../middleware/advancedDataList");
const { protect, authorize } = require("../../middleware/auth");
router.route("/:id").get(protect, getListrecords1);

/* const BUS0000001 = require("../../models/smartApp/BUS0000002");
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
const HC0002 = require("../../models/smartApp/HC0002");
const HC0003 = require("../../models/smartApp/HC0003");
const HC0004 = require("../../models/smartApp/HC0004");
const HOSP0003 = require("../../models/smartApp/HOSP0003");
const HOSP0004 = require("../../models/smartApp/HOSP0004");
const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
const JOB00001 = require("../../models/smartApp/JOB00001");
const LOG00001 = require("../../models/smartApp/LOG00001");
const LOG00002 = require("../../models/smartApp/LOG00002");
const LOG00003 = require("../../models/smartApp/LOG00003");
const LOG00004 = require("../../models/smartApp/LOG00004");
const PM00001 = require("../../models/smartApp/PM00001");
const SUPP00007 = require("../../models/smartApp/SUPP00007");
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
const EMPBEN01 = require("../../models/smartApp/EMPBEN01");
const EMP00012 = require("../../models/smartApp/EMP00012");
const EMP00011 = require("../../models/smartApp/EMP00011");
const ERP00011 = require("../../models/smartApp/ERP00011");
const EMP00017 = require("../../models/smartApp/EMP00017");
const EMPNEW01 = require("../../models/smartApp/EMPNEW01");
const TIME0002 = require("../../models/smartApp/TIME0002");
const PATIENT001 = require("../../models/smartApp/PATIENT001"); */

//router.use("/:smartappId/reviews", reviewRouter);

/* router
  .route("/PATIENT001")
  .get(
    protect,
    advancedDataList(PATIENT001, PATIENT001, "PATIENT001"),
    getListrecords
  );
router
  .route("/BUS0000001")
  .get(
    protect,
    advancedDataList(BUS0000001, BUS0000001, "BUS0000001"),
    getListrecords
  );
router
  .route("/BUS0000002")
  .get(
    protect,
    advancedDataList(BUS0000002, BUS0000002, "BUS0000002"),
    getListrecords
  );
router
  .route("/BUS0000003")
  .get(
    protect,
    advancedDataList(BUS0000003, BUS0000003, "BUS0000003"),
    getListrecords
  );
router
  .route("/BUS0000004")
  .get(
    protect,
    advancedDataList(BUS0000004, BUS0000004, "BUS0000004"),
    getListrecords
  );
router
  .route("/BUS0000005")
  .get(
    protect,
    advancedDataList(BUS0000005, BUS0000005, "BUS0000005"),
    getListrecords
  );
router
  .route("/BUS0000006")
  .get(
    protect,
    advancedDataList(BUS0000006, BUS0000006, "BUS0000006"),
    getListrecords
  );
router
  .route("/COUNCIL001")
  .get(
    protect,
    advancedDataList(COUNCIL001, COUNCIL001, "COUNCIL001"),
    getListrecords
  );
router
  .route("/COUNCIL002")
  .get(
    protect,
    advancedDataList(COUNCIL002, COUNCIL002, "COUNCIL002"),
    getListrecords
  );
router
  .route("/COUNCIL003")
  .get(
    protect,
    advancedDataList(COUNCIL003, COUNCIL003, "COUNCIL003"),
    getListrecords
  );
router
  .route("/COUNCIL007")
  .get(
    protect,
    advancedDataList(COUNCIL007, COUNCIL007, "COUNCIL007"),
    getListrecords
  );
router
  .route("/COUNCIL012")
  .get(
    protect,
    advancedDataList(COUNCIL012, COUNCIL012, "COUNCIL012"),
    getListrecords
  );
router
  .route("/COUNCIL015")
  .get(
    protect,
    advancedDataList(COUNCIL015, COUNCIL015, "COUNCIL015"),
    getListrecords
  );
router
  .route("/COUNCIL022")
  .get(
    protect,
    advancedDataList(COUNCIL022, COUNCIL022, "COUNCIL022"),
    getListrecords
  );
router
  .route("/COUNCIL023")
  .get(
    protect,
    advancedDataList(COUNCIL023, COUNCIL023, "COUNCIL023"),
    getListrecords
  );
router
  .route("/COUNCIL026")
  .get(
    protect,
    advancedDataList(COUNCIL026, COUNCIL026, "COUNCIL026"),
    getListrecords
  );
router
  .route("/COUNCIL029")
  .get(
    protect,
    advancedDataList(COUNCIL029, COUNCIL029, "COUNCIL029"),
    getListrecords
  );
router
  .route("/COUNCIL033")
  .get(
    protect,
    advancedDataList(COUNCIL033, COUNCIL033, "COUNCIL033"),
    getListrecords
  );
router
  .route("/COUNCIL034")
  .get(
    protect,
    advancedDataList(COUNCIL034, COUNCIL034, "COUNCIL034"),
    getListrecords
  );
router
  .route("/COUNCIL035")
  .get(
    protect,
    advancedDataList(COUNCIL035, COUNCIL035, "COUNCIL035"),
    getListrecords
  );
router
  .route("/COUNCIL036")
  .get(
    protect,
    advancedDataList(COUNCIL036, COUNCIL036, "COUNCIL036"),
    getListrecords
  );
router
  .route("/DOC00001")
  .get(
    protect,
    advancedDataList(DOC00001, DOC00001, "DOC00001"),
    getListrecords
  );
router
  .route("/DOC00002")
  .get(
    protect,
    advancedDataList(DOC00002, DOC00002, "DOC00002"),
    getListrecords
  );
router
  .route("/DOC00003")
  .get(
    protect,
    advancedDataList(DOC00003, DOC00003, "DOC00003"),
    getListrecords
  );
router
  .route("/EDU00001")
  .get(
    protect,
    advancedDataList(EDU00001, EDU00001, "EDU00001"),
    getListrecords
  );
router
  .route("/EDU00002")
  .get(
    protect,
    advancedDataList(EDU00002, EDU00002, "EDU00002"),
    getListrecords
  );
router
  .route("/EDU00003")
  .get(
    protect,
    advancedDataList(EDU00003, EDU00003, "EDU00003"),
    getListrecords
  );
router
  .route("/EDU00004")
  .get(
    protect,
    advancedDataList(EDU00004, EDU00004, "EDU00004"),
    getListrecords
  );
router
  .route("/EDU00005")
  .get(
    protect,
    advancedDataList(EDU00005, EDU00005, "EDU00005"),
    getListrecords
  );
router
  .route("/EDU00006")
  .get(
    protect,
    advancedDataList(EDU00006, EDU00006, "EDU00006"),
    getListrecords
  );
router
  .route("/EDU00007")
  .get(
    protect,
    advancedDataList(EDU00007, EDU00007, "EDU00007"),
    getListrecords
  );
router
  .route("/EDU00008")
  .get(
    protect,
    advancedDataList(EDU00008, EDU00008, "EDU00008"),
    getListrecords
  );
router
  .route("/EDU00009")
  .get(
    protect,
    advancedDataList(EDU00009, EDU00009, "EDU00009"),
    getListrecords
  );
router
  .route("/EDU00010")
  .get(
    protect,
    advancedDataList(EDU00010, EDU00010, "EDU00010"),
    getListrecords
  );
router
  .route("/EDU00011")
  .get(
    protect,
    advancedDataList(EDU00011, EDU00011, "EDU00011"),
    getListrecords
  );
router
  .route("/EDU00013")
  .get(
    protect,
    advancedDataList(EDU00013, EDU00013, "EDU00013"),
    getListrecords
  );
router
  .route("/EDU00014")
  .get(
    protect,
    advancedDataList(EDU00014, EDU00014, "EDU00014"),
    getListrecords
  );
router
  .route("/EDU00015")
  .get(
    protect,
    advancedDataList(EDU00015, EDU00015, "EDU00015"),
    getListrecords
  );
router
  .route("/EDU00016")
  .get(
    protect,
    advancedDataList(EDU00016, EDU00016, "EDU00016"),
    getListrecords
  );
router
  .route("/EDU00018")
  .get(
    protect,
    advancedDataList(EDU00018, EDU00018, "EDU00018"),
    getListrecords
  );
router
  .route("/EDU00019")
  .get(
    protect,
    advancedDataList(EDU00019, EDU00019, "EDU00019"),
    getListrecords
  );
router
  .route("/EDU00021")
  .get(
    protect,
    advancedDataList(EDU00021, EDU00021, "EDU00021"),
    getListrecords
  );
router
  .route("/EDU00097")
  .get(
    protect,
    advancedDataList(EDU00097, EDU00097, "EDU00097"),
    getListrecords
  );
router
  .route("/EDU00098")
  .get(
    protect,
    advancedDataList(EDU00098, EDU00098, "EDU00098"),
    getListrecords
  );
router
  .route("/EDU0100")
  .get(protect, advancedDataList(EDU0100, EDU0100, "EDU0100"), getListrecords);
router
  .route("/EMP00001")
  .get(
    protect,
    advancedDataList(EMP00001, EMP00001, "EMP00001"),
    getListrecords
  );
router
  .route("/EMP00002")
  .get(
    protect,
    advancedDataList(EMP00002, EMP00002, "EMP00002"),
    getListrecords
  );
router
  .route("/EMP00004")
  .get(
    protect,
    advancedDataList(EMP00004, EMP00004, "EMP00004"),
    getListrecords
  );
router
  .route("/EMP00006")
  .get(
    protect,
    advancedDataList(EMP00006, EMP00006, "EMP00006"),
    getListrecords
  );
router
  .route("/EMP00006OLD")
  .get(
    protect,
    advancedDataList(EMP00006OLD, EMP00006OLD, "EMP00006OLD"),
    getListrecords
  );
router
  .route("/EMP00008")
  .get(
    protect,
    advancedDataList(EMP00008, EMP00008, "EMP00008"),
    getListrecords
  );
router
  .route("/EMP00013")
  .get(
    protect,
    advancedDataList(EMP00013, EMP00013, "EMP00013"),
    getListrecords
  );
router
  .route("/EMP00021")
  .get(
    protect,
    advancedDataList(EMP00021, EMP00021, "EMP00021"),
    getListrecords
  );
router
  .route("/EMPACC01")
  .get(
    protect,
    advancedDataList(EMPACC01, EMPACC01, "EMPACC01"),
    getListrecords
  );
router
  .route("/EMPBOK01")
  .get(
    protect,
    advancedDataList(EMPBOK01, EMPBOK01, "EMPBOK01"),
    getListrecords
  );
router
  .route("/ERP00002")
  .get(
    protect,
    advancedDataList(ERP00002, ERP00002, "ERP00002"),
    getListrecords
  );
router
  .route("/ERP00003")
  .get(
    protect,
    advancedDataList(ERP00003, ERP00003, "ERP00003"),
    getListrecords
  );
router
  .route("/ERP00004")
  .get(
    protect,
    advancedDataList(ERP00004, ERP00004, "ERP00004"),
    getListrecords
  );
router
  .route("/ERP00005")
  .get(
    protect,
    advancedDataList(ERP00005, ERP00005, "ERP00005"),
    getListrecords
  );
router
  .route("/ERP00008")
  .get(
    protect,
    advancedDataList(ERP00008, ERP00008, "ERP00008"),
    getListrecords
  );
router
  .route("/ERP00009")
  .get(
    protect,
    advancedDataList(ERP00009, ERP00009, "ERP00009"),
    getListrecords
  );
router
  .route("/ERP00010")
  .get(
    protect,
    advancedDataList(ERP00010, ERP00010, "ERP00010"),
    getListrecords
  );
router
  .route("/ERP00014")
  .get(
    protect,
    advancedDataList(ERP00014, ERP00014, "ERP00014"),
    getListrecords
  );
router
  .route("/TIME0002")
  .get(
    protect,
    advancedDataList(TIME0002, TIME0002, "TIME0002"),
    getListrecords
  );
router
  .route("/HC0002")
  .get(protect, advancedDataList(HC0002, HC0002, "HC0002"), getListrecords);
router
  .route("/HC0003")
  .get(protect, advancedDataList(HC0003, HC0003, "HC0003"), getListrecords);
router
  .route("/HC0002")
  .get(protect, advancedDataList(HC0004, HC0004, "HC0004"), getListrecords);
router
  .route("/HOSP0003")
  .get(
    protect,
    advancedDataList(HOSP0003, HOSP0003, "HOSP0003"),
    getListrecords
  );
router
  .route("/HOSP0004")
  .get(
    protect,
    advancedDataList(HOSP0004, HOSP0004, "HOSP0004"),
    getListrecords
  );
router
  .route("/ITPROJ002")
  .get(
    protect,
    advancedDataList(ITPROJ002, ITPROJ002, "ITPROJ002"),
    getListrecords
  );
router
  .route("/JOB00001")
  .get(
    protect,
    advancedDataList(JOB00001, JOB00001, "JOB00001"),
    getListrecords
  );
router
  .route("/LOG00001")
  .get(
    protect,
    advancedDataList(LOG00001, LOG00001, "LOG00001"),
    getListrecords
  );
router
  .route("/LOG00002")
  .get(
    protect,
    advancedDataList(LOG00002, LOG00002, "LOG00002"),
    getListrecords
  );
router
  .route("/LOG00003")
  .get(
    protect,
    advancedDataList(LOG00003, LOG00003, "LOG00003"),
    getListrecords
  );
router
  .route("/LOG00004")
  .get(
    protect,
    advancedDataList(LOG00004, LOG00004, "LOG00004"),
    getListrecords
  );
router
  .route("/PM00001")
  .get(protect, advancedDataList(PM00001, PM00001, "PM00001"), getListrecords);
router
  .route("/SUPP00011")
  .get(
    protect,
    advancedDataList(SUPP00011, SUPP00011, "SUPP00011"),
    getListrecords
  );
router
  .route("/SUPP00012")
  .get(
    protect,
    advancedDataList(SUPP00012, SUPP00012, "SUPP00012"),
    getListrecords
  );
router
  .route("/SUPP00013")
  .get(
    protect,
    advancedDataList(SUPP00013, SUPP00013, "SUPP00013"),
    getListrecords
  );
router
  .route("/SUPP00014")
  .get(
    protect,
    advancedDataList(SUPP00014, SUPP00014, "SUPP00014"),
    getListrecords
  );
router
  .route("/SUPP00015")
  .get(
    protect,
    advancedDataList(SUPP00015, SUPP00015, "SUPP00015"),
    getListrecords
  );
router
  .route("/SUPP00016")
  .get(
    protect,
    advancedDataList(SUPP00016, SUPP00016, "SUPP00016"),
    getListrecords
  );
router
  .route("/SUPP00018")
  .get(
    protect,
    advancedDataList(SUPP00018, SUPP00018_Itm, "SUPP00018"),
    getListrecords
  );
router
  .route("/SUPP00028")
  .get(
    protect,
    advancedDataList(SUPP00028, SUPP00028_Itm, "SUPP00028"),
    getListrecords
  );
router
  .route("/SUPP00007")
  .get(
    protect,
    advancedDataList(SUPP00007, SUPP00007, "SUPP00007"),
    getListrecords
  );
router
  .route("/ERP00011")
  .get(
    protect,
    advancedDataList(ERP00011, ERP00011, "ERP00011"),
    getListrecords
  );
router
  .route("/EMP00017")
  .get(
    protect,
    advancedDataList(EMP00017, EMP00017, "EMP00017"),
    getListrecords
  );
router
  .route("/EMPNEW01")
  .get(
    protect,
    advancedDataList(EMPNEW01, EMPNEW01, "EMPNEW01"),
    getListrecords
  );
router
  .route("/EMP00011")
  .get(
    protect,
    advancedDataList(EMP00011, EMP00011, "EMP00011"),
    getListrecords
  );
router
  .route("/EMP00012")
  .get(
    protect,
    advancedDataList(EMP00012, EMP00012, "EMP00012"),
    getListrecords
  );
router
  .route("/EMPBEN01")
  .get(
    protect,
    advancedDataList(EMPBEN01, EMPBEN01, "EMPBEN01"),
    getListrecords
  ); */
module.exports = router;
