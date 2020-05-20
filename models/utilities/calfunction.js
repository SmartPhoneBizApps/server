class calFun {
  constructor() {}

  ADD1() {
    return "Divyesh";
  }

  ADD(arr) {
    var a = 0;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a += aa;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }

  ITEMSUM(arr) {
    var a = 0;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a += aa;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }

  ITEMMUL(arr) {
    var a = 1;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a *= aa;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }

  MUL(arr) {
    var a = 1;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a *= aa;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }
  ITEMSUB(arr) {
    var a = 0;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a = aa - a;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }
  SUB(arr) {
    var a = 0;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a = aa - a;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }
  PAR(arr) {
    var a = 1;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a = aa / 100;
      }
    });
    if (b) {
      return a;
    }
    return "";
  }

  ITEMMAX(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return Math.max.apply(null, arr);
  }
  MAX(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return Math.max.apply(null, arr);
  }
  ITEMMIN(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return Math.min.apply(null, arr);
  }
  ITEMMIN(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return Math.min.apply(null, arr);
  }
}

module.exports = calFun;
