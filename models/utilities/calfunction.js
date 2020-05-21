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

  datacalculation(outdata, config) {
    if (outdata["ItemData"].length > 0) {
      // check item data exist in user input
      if (config["Item"].length > 0) {
        // Check item calculation is exist or not
        for (var i = 0; i < outdata["ItemData"].length; i++) {
          // loop ItemData array
          config["Item"].forEach((configItem) => {
            // loop config Item
            var fieldObj = [];
            configItem["Fields"].forEach((field) => {
              // push field value in obj
              fieldObj.push(outdata["ItemData"][i][field["Source"]]); // get calculated field value in item array
            });
            var fun = configItem["CalculatedFormula"]["function"]; // get function name

            if (typeof this[fun] !== "undefined") {
              // Check function exist or not

              outdata["ItemData"][i][
                configItem["CalculatedFormula"]["Target"]
              ] = this[fun](fieldObj); // call function and assign value in item array
            } else {
              outdata["ItemData"][i][
                configItem["CalculatedFormula"]["Target"]
              ] = "";
            }
          });
        }
      }
    }
    if (config["HeaderItem"].length > 0) {
      // Check header item calculation is exist or not
      if (outdata["ItemData"].length > 0) {
        // Check item is not null
        config["HeaderItem"].forEach((configItem) => {
          // loop  config HeaderItem
          var fieldObj = [];
          for (var i = 0; i < outdata["ItemData"].length; i++) {
            // loop ItemData
            fieldObj.push(
              outdata["ItemData"][i][configItem["Fields"][0]["Source"]]
            ); // get calculated field value from all items
          }
          var fun = configItem["CalculatedFormula"]["function"]; // get function name
          if (typeof this[fun] !== "undefined") {
            // Check function exist or not

            outdata[configItem["CalculatedFormula"]["Target"]] = this[fun](
              fieldObj
            ); // call function and assign value in header array
          } else {
            outdata[configItem["CalculatedFormula"]["Target"]] = "";
          }
        });
      }
    }
    if (config["Header"].length > 0) {
      // Check Header calculation is exist or not
      config["Header"].forEach((configItem) => {
        // loop config header
        var fieldObj = [];
        configItem["Fields"].forEach((field) => {
          // loop for calculated field NOTE: here we can add multiple field
          fieldObj.push(outdata[field["Source"]]); // get calculated field value
        });
        var fun = configItem["CalculatedFormula"]["function"]; // get function name
        if (typeof this[fun] !== "undefined") {
          // Check function exist or not
          outdata[configItem["CalculatedFormula"]["Target"]] = this[fun](
            fieldObj
          ); // call function and assign value in header array
        } else {
          outdata[configItem["CalculatedFormula"]["Target"]] = "";
        }
      });
    }
    return outdata;
  }
}

module.exports = calFun;
