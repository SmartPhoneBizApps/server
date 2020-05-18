const express = require("express");
const {
  getMaterListrecords,
  addListrecords,
} = require("../../controllers/smartApp/listrecords");
//const reviewRouter = require("../reviews");
const router = express.Router();
const advancedMasterList = require("../../middleware/advancedMasterList");
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

//router.use("/:smartappId/reviews", reviewRouter);

router
  .route("/BUS0000002")
  .get(
    protect,
    advancedMasterList(BUS0000002, "BUS0000002"),
    getMaterListrecords
  );
router
  .route("/BUS0000003")
  .get(
    protect,
    advancedMasterList(BUS0000003, "BUS0000003"),
    getMaterListrecords
  );
router
  .route("/BUS0000004")
  .get(
    protect,
    advancedMasterList(BUS0000004, "BUS0000004"),
    getMaterListrecords
  );
router
  .route("/BUS0000005")
  .get(
    protect,
    advancedMasterList(BUS0000005, "BUS0000005"),
    getMaterListrecords
  );
router
  .route("/BUS0000006")
  .get(
    protect,
    advancedMasterList(BUS0000006, "BUS0000006"),
    getMaterListrecords
  );
router
  .route("/COUNCIL001")
  .get(
    protect,
    advancedMasterList(COUNCIL001, "COUNCIL001"),
    getMaterListrecords
  );
router
  .route("/COUNCIL002")
  .get(
    protect,
    advancedMasterList(COUNCIL002, "COUNCIL002"),
    getMaterListrecords
  );
router
  .route("/COUNCIL003")
  .get(
    protect,
    advancedMasterList(COUNCIL003, "COUNCIL003"),
    getMaterListrecords
  );
router
  .route("/COUNCIL007")
  .get(
    protect,
    advancedMasterList(COUNCIL007, "COUNCIL007"),
    getMaterListrecords
  );
router
  .route("/COUNCIL012")
  .get(
    protect,
    advancedMasterList(COUNCIL012, "COUNCIL012"),
    getMaterListrecords
  );
router
  .route("/COUNCIL015")
  .get(
    protect,
    advancedMasterList(COUNCIL015, "COUNCIL015"),
    getMaterListrecords
  );
router
  .route("/COUNCIL022")
  .get(
    protect,
    advancedMasterList(COUNCIL022, "COUNCIL022"),
    getMaterListrecords
  );
router
  .route("/COUNCIL023")
  .get(
    protect,
    advancedMasterList(COUNCIL023, "COUNCIL023"),
    getMaterListrecords
  );
router
  .route("/COUNCIL026")
  .get(
    protect,
    advancedMasterList(COUNCIL026, "COUNCIL026"),
    getMaterListrecords
  );
router
  .route("/COUNCIL029")
  .get(
    protect,
    advancedMasterList(COUNCIL029, "COUNCIL029"),
    getMaterListrecords
  );
router
  .route("/COUNCIL033")
  .get(
    protect,
    advancedMasterList(COUNCIL033, "COUNCIL033"),
    getMaterListrecords
  );
router
  .route("/COUNCIL034")
  .get(
    protect,
    advancedMasterList(COUNCIL034, "COUNCIL034"),
    getMaterListrecords
  );
router
  .route("/COUNCIL035")
  .get(
    protect,
    advancedMasterList(COUNCIL035, "COUNCIL035"),
    getMaterListrecords
  );
router
  .route("/COUNCIL036")
  .get(
    protect,
    advancedMasterList(COUNCIL036, "COUNCIL036"),
    getMaterListrecords
  );
router
  .route("/DOC00001")
  .get(protect, advancedMasterList(DOC00001, "DOC00001"), getMaterListrecords);
router
  .route("/DOC00002")
  .get(protect, advancedMasterList(DOC00002, "DOC00002"), getMaterListrecords);
router
  .route("/DOC00003")
  .get(protect, advancedMasterList(DOC00003, "DOC00003"), getMaterListrecords);
router
  .route("/EDU00001")
  .get(protect, advancedMasterList(EDU00001, "EDU00001"), getMaterListrecords);
router
  .route("/EDU00002")
  .get(protect, advancedMasterList(EDU00002, "EDU00002"), getMaterListrecords);
router
  .route("/EDU00003")
  .get(protect, advancedMasterList(EDU00003, "EDU00003"), getMaterListrecords);
router
  .route("/EDU00004")
  .get(protect, advancedMasterList(EDU00004, "EDU00004"), getMaterListrecords);
router
  .route("/EDU00005")
  .get(protect, advancedMasterList(EDU00005, "EDU00005"), getMaterListrecords);
router
  .route("/EDU00006")
  .get(protect, advancedMasterList(EDU00006, "EDU00006"), getMaterListrecords);
router
  .route("/EDU00007")
  .get(protect, advancedMasterList(EDU00007, "EDU00007"), getMaterListrecords);
router
  .route("/EDU00008")
  .get(protect, advancedMasterList(EDU00008, "EDU00008"), getMaterListrecords);
router
  .route("/EDU00009")
  .get(protect, advancedMasterList(EDU00009, "EDU00009"), getMaterListrecords);
router
  .route("/EDU00010")
  .get(protect, advancedMasterList(EDU00010, "EDU00010"), getMaterListrecords);
router
  .route("/EDU00011")
  .get(protect, advancedMasterList(EDU00011, "EDU00011"), getMaterListrecords);
router
  .route("/EDU00013")
  .get(protect, advancedMasterList(EDU00013, "EDU00013"), getMaterListrecords);
router
  .route("/EDU00014")
  .get(protect, advancedMasterList(EDU00014, "EDU00014"), getMaterListrecords);
router
  .route("/EDU00015")
  .get(protect, advancedMasterList(EDU00015, "EDU00015"), getMaterListrecords);
router
  .route("/EDU00016")
  .get(protect, advancedMasterList(EDU00016, "EDU00016"), getMaterListrecords);
router
  .route("/EDU00018")
  .get(protect, advancedMasterList(EDU00018, "EDU00018"), getMaterListrecords);
router
  .route("/EDU00019")
  .get(protect, advancedMasterList(EDU00019, "EDU00019"), getMaterListrecords);
router
  .route("/EDU00021")
  .get(protect, advancedMasterList(EDU00021, "EDU00021"), getMaterListrecords);
router
  .route("/EDU00097")
  .get(protect, advancedMasterList(EDU00097, "EDU00097"), getMaterListrecords);
router
  .route("/EDU00098")
  .get(protect, advancedMasterList(EDU00098, "EDU00098"), getMaterListrecords);
router
  .route("/EDU0100")
  .get(protect, advancedMasterList(EDU0100, "EDU0100"), getMaterListrecords);
router
  .route("/EMP00001")
  .get(protect, advancedMasterList(EMP00001, "EMP00001"), getMaterListrecords);
router
  .route("/EMP00002")
  .get(protect, advancedMasterList(EMP00002, "EMP00002"), getMaterListrecords);
router
  .route("/EMP00004")
  .get(protect, advancedMasterList(EMP00004, "EMP00004"), getMaterListrecords);
router
  .route("/EMP00006")
  .get(protect, advancedMasterList(EMP00006, "EMP00006"), getMaterListrecords);
router
  .route("/EMP00006OLD")
  .get(
    protect,
    advancedMasterList(EMP00006OLD, "EMP00006OLD"),
    getMaterListrecords
  );
router
  .route("/EMP00008")
  .get(protect, advancedMasterList(EMP00008, "EMP00008"), getMaterListrecords);
router
  .route("/EMP00013")
  .get(protect, advancedMasterList(EMP00013, "EMP00013"), getMaterListrecords);
router
  .route("/EMP00021")
  .get(protect, advancedMasterList(EMP00021, "EMP00021"), getMaterListrecords);
router
  .route("/EMPACC01")
  .get(protect, advancedMasterList(EMPACC01, "EMPACC01"), getMaterListrecords);
router
  .route("/EMPBOK01")
  .get(protect, advancedMasterList(EMPBOK01, "EMPBOK01"), getMaterListrecords);
router
  .route("/ERP00002")
  .get(protect, advancedMasterList(ERP00002, "ERP00002"), getMaterListrecords);
router
  .route("/ERP00003")
  .get(protect, advancedMasterList(ERP00003, "ERP00003"), getMaterListrecords);
router
  .route("/ERP00004")
  .get(protect, advancedMasterList(ERP00004, "ERP00004"), getMaterListrecords);
router
  .route("/ERP00005")
  .get(protect, advancedMasterList(ERP00005, "ERP00005"), getMaterListrecords);
router
  .route("/ERP00008")
  .get(protect, advancedMasterList(ERP00008, "ERP00008"), getMaterListrecords);
router
  .route("/ERP00009")
  .get(protect, advancedMasterList(ERP00009, "ERP00009"), getMaterListrecords);
router
  .route("/ERP00010")
  .get(protect, advancedMasterList(ERP00010, "ERP00010"), getMaterListrecords);
router
  .route("/ERP00014")
  .get(protect, advancedMasterList(ERP00014, "ERP00014"), getMaterListrecords);
router
  .route("/HOSP0003")
  .get(protect, advancedMasterList(HOSP0003, "HOSP0003"), getMaterListrecords);
router
  .route("/HOSP0004")
  .get(protect, advancedMasterList(HOSP0004, "HOSP0004"), getMaterListrecords);
router
  .route("/ITPROJ002")
  .get(
    protect,
    advancedMasterList(ITPROJ002, "ITPROJ002"),
    getMaterListrecords
  );
router
  .route("/JOB00001")
  .get(protect, advancedMasterList(JOB00001, "JOB00001"), getMaterListrecords);
router
  .route("/LOG00001")
  .get(protect, advancedMasterList(LOG00001, "LOG00001"), getMaterListrecords);
router
  .route("/LOG00002")
  .get(protect, advancedMasterList(LOG00002, "LOG00002"), getMaterListrecords);
router
  .route("/LOG00003")
  .get(protect, advancedMasterList(LOG00003, "LOG00003"), getMaterListrecords);
router
  .route("/LOG00004")
  .get(protect, advancedMasterList(LOG00004, "LOG00004"), getMaterListrecords);
router
  .route("/PM00001")
  .get(protect, advancedMasterList(PM00001, "PM00001"), getMaterListrecords);
router
  .route("/SUPP00011")
  .get(
    protect,
    advancedMasterList(SUPP00011, "SUPP00011"),
    getMaterListrecords
  );
router
  .route("/SUPP00012")
  .get(
    protect,
    advancedMasterList(SUPP00012, "SUPP00012"),
    getMaterListrecords
  );
router
  .route("/SUPP00013")
  .get(
    protect,
    advancedMasterList(SUPP00013, "SUPP00013"),
    getMaterListrecords
  );
router
  .route("/SUPP00014")
  .get(
    protect,
    advancedMasterList(SUPP00014, "SUPP00014"),
    getMaterListrecords
  );
router
  .route("/SUPP00015")
  .get(
    protect,
    advancedMasterList(SUPP00015, "SUPP00015"),
    getMaterListrecords
  );
router
  .route("/SUPP00016")
  .get(
    protect,
    advancedMasterList(SUPP00016, "SUPP00016"),
    getMaterListrecords
  );
router
  .route("/SUPP00018")
  .get(
    protect,
    advancedMasterList(SUPP00018, "SUPP00018"),
    getMaterListrecords
  );
router
  .route("/SUPP00028")
  .get(
    protect,
    advancedMasterList(SUPP00028, "SUPP00028"),
    getMaterListrecords
  );

module.exports = router;