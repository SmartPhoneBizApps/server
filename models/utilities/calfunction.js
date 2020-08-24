class calFun {
  constructor() {}

  ADD1() {
    return "Divyesh";
  }

  isInt(n) {
    // console.log("isInt" + n);
    if (n % 1 === 0) {
      //   console.log("IF");
      return n;
    } else {
      //   console.log("ELSE");
      return Number(Number(n).toFixed(2));
    }
  }

  WORKINGDAYS(arr) {
    var startDate = arr[0];
    var endDate = arr[1];
    console.log("startDate", startDate, endDate);
    var elapsed, daysAfterLastSunday;
    var ifThen = function (a, b, c) {
      return a == b ? c : a;
    };
    elapsed = endDate - startDate;
    elapsed /= 86400000;
    daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();
    elapsed -= daysBeforeFirstSunday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
      ifThen(daysBeforeFirstSunday - 1, -1, 0) +
      ifThen(daysAfterLastSunday, 6, 5);

    return Math.ceil(elapsed);
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
    var a = 0;
    var cnt = 1;
    arr.forEach((aa) => {
      if (cnt) {
        a = aa;
        cnt = 0;
      } else {
        if (aa != undefined && !isNaN(aa) && aa != "") {
          a *= aa;
        } else {
          aa = 0;
          a *= aa;
        }
      }
    });
    a = this.isInt(a);
    return a;
  }

  MUL(arr) {
    var a = 0;
    var cnt = 1;
    arr.forEach((aa) => {
      if (cnt) {
        a = aa;
        cnt = 0;
      } else {
        if (aa != undefined && !isNaN(aa) && aa != "") {
          a *= aa;
        } else {
          aa = 0;
          a *= aa;
        }
      }
    });
    a = this.isInt(a);
    return a;
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
    if (outdata["ItemData"].length > 0) {
      if (config["Item"].length > 0) {
        for (var i = 0; i < outdata["ItemData"].length; i++) {
          config["Item"].forEach((configItem) => {
            if (this.hasNull(configItem["CalculatedFormula"], 4)) {
              var fieldObj = [];
              configItem["Fields"].forEach((field) => {
                if (this.hasNull(field, 2)) {
                  /*                   console.log(
                    field["Source"] +
                      "--" +
                      outdata["ItemData"][i][field["Source"]]
                  ); */
                  fieldObj.push(
                    parseFloat(outdata["ItemData"][i][field["Source"]])
                  ); // get calculated field value in item array
                } else {
                  fieldObj.push(); // get calculated field value in item array
                }
              });
              var fun = configItem["CalculatedFormula"]["function"]; // get function name
              //   console.log("Function name -->" + fun);
              if (typeof this[fun] !== "undefined") {
                //     console.log("Calue --" + this[fun](fieldObj));
                //    console.log("---------------");
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

  tablecalculation(outdata, config, tabname) {
    console.log("Calculation Table", tabname);
    console.log("Calculation Table Data", outdata[tabname]);
    if (outdata[tabname] != undefined) {
      if (outdata[tabname].length > 0) {
        if (config["Item"].length > 0) {
          for (var i = 0; i < outdata[tabname].length; i++) {
            config["Item"].forEach((configItem) => {
              if (this.hasNull(configItem["CalculatedFormula"], 4)) {
                var fieldObj = [];
                configItem["Fields"].forEach((field) => {
                  if (this.hasNull(field, 2)) {
                    /*                   console.log(
                    field["Source"] +
                      "--" +
                      outdata[tabname][i][field["Source"]]
                  ); */
                    fieldObj.push(
                      parseFloat(outdata[tabname][i][field["Source"]])
                    ); // get calculated field value in item array
                  } else {
                    fieldObj.push(); // get calculated field value in item array
                  }
                });
                var fun = configItem["CalculatedFormula"]["function"]; // get function name
                //   console.log("Function name -->" + fun);
                if (typeof this[fun] !== "undefined") {
                  //     console.log("Calue --" + this[fun](fieldObj));
                  //    console.log("---------------");
                  outdata[tabname][i][
                    configItem["CalculatedFormula"]["Target"]
                  ] = this[fun](fieldObj); // call function and assign value in item array
                } else {
                  outdata[tabname][i][
                    configItem["CalculatedFormula"]["Target"]
                  ] = "";
                }
              }
            });
          }
        }
      }
    }
    if (config["HeaderItem"].length > 0) {
      if (outdata[tabname] != undefined) {
        if (outdata[tabname].length > 0) {
          config["HeaderItem"].forEach((configItem) => {
            if (this.hasNull(configItem["CalculatedFormula"], 4)) {
              var fieldObj = [];
              for (var i = 0; i < outdata[tabname].length; i++) {
                if (this.hasNull(configItem["Fields"][0], 2)) {
                  fieldObj.push(
                    parseFloat(
                      outdata[tabname][i][configItem["Fields"][0]["Source"]]
                    )
                  ); // get calculated field value from all items
                } else {
                  fieldObj.push(""); // get calculated field value from all items
                }
              }
              var fun = configItem["CalculatedFormula"]["function"]; // get function name
              console.log(this[fun](fieldObj));
              console.log(configItem["CalculatedFormula"]["Target"]);
              if (typeof this[fun] !== "undefined") {
                outdata[configItem["CalculatedFormula"]["Target"]] = this[fun](
                  fieldObj
                ); // call function and assign value in header array
              } else {
                outdata[configItem["CalculatedFormula"]["Target"]] = "";
              }
              console.log(outdata);
            }
          });
        }
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
