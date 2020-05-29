class calFun {
  constructor() {}

  ADD1() {
    return "Divyesh";
  }

  isInt(n) {
    console.log("isInt" + n);
    if (n % 1 === 0) {
      console.log("IF");
      return n;
    } else {
      console.log("ELSE");
      return Number(Number(n).toFixed(2));
    }
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
      a = this.isInt(a);
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
      a = this.isInt(a);
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
      a = this.isInt(a);
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
      a = this.isInt(a);
      return a;
    }
    return "";
  }
  ITEMSUB(arr) {
    var a = 0;
    var b = 0;
    var cnt = 1;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;

        if (cnt) {
          a = aa;
          cnt = 0;
        } else {
          a = a - aa;
        }
      }
    });
    if (b) {
      a = this.isInt(a);
      return a;
    }
    return "";
  }
  SUB(arr) {
    var a = 0;
    var b = 0;
    var cnt = 1;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        if (cnt) {
          a = aa;
          cnt = 0;
        } else {
          a = a - aa;
        }
      }
    });
    if (b) {
      a = this.isInt(a);
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
      a = this.isInt(a);
      return a;
    }
    return "";
  }

  ITEMMAX(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return this.isInt(Math.max.apply(null, arr));
    // return Math.max.apply(null, arr);
  }
  MAX(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return this.isInt(Math.max.apply(null, arr));
  }
  ITEMMIN(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return this.isInt(Math.min.apply(null, arr));
  }
  ITEMMIN(obj) {
    var arr = Object.keys(obj).map(function (key) {
      return obj[key];
    });
    return this.isInt(Math.min.apply(null, arr));
  }

  hasNull(target, arrayLength) {
    for (var member in target) {
      if (
        target[member] == null ||
        target[member] == "" ||
        target[member] == undefined
      ) {
        return false;
      }
    }

    if (Object.keys(target).length == arrayLength) {
      return true;
    }
  }

  datacalculation(outdata, config) {
    // console.log(config);
    if (outdata["ItemData"].length > 0) {
      if (config["Item"].length > 0) {
        for (var i = 0; i < outdata["ItemData"].length; i++) {
          config["Item"].forEach((configItem) => {
            if (this.hasNull(configItem["CalculatedFormula"], 4)) {
              var fieldObj = [];
              configItem["Fields"].forEach((field) => {
                if (this.hasNull(field, 2)) {
                  console.log(
                    field["Source"] +
                      "--" +
                      outdata["ItemData"][i][field["Source"]]
                  );
                  fieldObj.push(
                    parseFloat(outdata["ItemData"][i][field["Source"]])
                  ); // get calculated field value in item array
                } else {
                  fieldObj.push(); // get calculated field value in item array
                }
              });
              var fun = configItem["CalculatedFormula"]["function"]; // get function name
              console.log("Function name -->" + fun);
              if (typeof this[fun] !== "undefined") {
                console.log("Calue --" + this[fun](fieldObj));
                console.log("---------------");
                outdata["ItemData"][i][
                  configItem["CalculatedFormula"]["Target"]
                ] = this[fun](fieldObj); // call function and assign value in item array
              } else {
                outdata["ItemData"][i][
                  configItem["CalculatedFormula"]["Target"]
                ] = "";
              }
            }
          });
        }
      }
    }
    if (config["HeaderItem"].length > 0) {
      if (outdata["ItemData"].length > 0) {
        config["HeaderItem"].forEach((configItem) => {
          if (this.hasNull(configItem["CalculatedFormula"], 4)) {
            var fieldObj = [];
            for (var i = 0; i < outdata["ItemData"].length; i++) {
              if (this.hasNull(configItem["Fields"][0], 2)) {
                fieldObj.push(
                  parseFloat(
                    outdata["ItemData"][i][configItem["Fields"][0]["Source"]]
                  )
                ); // get calculated field value from all items
              } else {
                fieldObj.push(""); // get calculated field value from all items
              }
            }
            var fun = configItem["CalculatedFormula"]["function"]; // get function name
            if (typeof this[fun] !== "undefined") {
              outdata[configItem["CalculatedFormula"]["Target"]] = this[fun](
                fieldObj
              ); // call function and assign value in header array
            } else {
              outdata[configItem["CalculatedFormula"]["Target"]] = "";
            }
          }
        });
      }
    }
    if (config["Header"].length > 0) {
      // Check Header calculation is exist or not
      config["Header"].forEach((configItem) => {
        if (this.hasNull(configItem["CalculatedFormula"], 4)) {
          // loop config header
          var fieldObj = [];
          if (configItem["Fields"].length > 0) {
            configItem["Fields"].forEach((field) => {
              if (this.hasNull(field, 2)) {
                fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
              } else {
                fieldObj.push(""); // get calculated field value
              }
            });
          } else {
            fieldObj.push("");
          }
          var fun = configItem["CalculatedFormula"]["function"]; // get function name
          if (typeof this[fun] !== "undefined") {
            outdata[configItem["CalculatedFormula"]["Target"]] = this[fun](
              fieldObj
            ); // call function and assign value in header array
          } else {
            outdata[configItem["CalculatedFormula"]["Target"]] = "";
          }
        }
      });
    }
    return outdata;
  }
}

module.exports = calFun;
