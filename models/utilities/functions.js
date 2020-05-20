class myFunction {
  constructor() {}

  set_PLog(mybody, type) {
    let pLog = {};
    let pg1 = [];
    set_PLog(mybody);
    pLog["Type"] = type;
    pLog["User"] = mybody.user;
    pLog["UserName"] = mybody.userName;
    pLog["Status"] = mybody.Status;
    pLog["TimeStamp"] = Date.now();
    pLog["ID"] = mybody.ID;
    pLog["applicationId"] = mybody.applicationId;
    pg1.push(pLog);
    mybody.TransLog = pg1;

    return mybody;
  }
}
