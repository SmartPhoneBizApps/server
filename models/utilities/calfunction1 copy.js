class calFun {
  constructor() {}

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
    var elapsed, daysAfterLastSunday, daysBeforeFirstSunday;
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

  fieldType(field, fieldDefArray) {
    //for item, need to pass item field definition array
    var fieldType = "";

    for (var i = 0; i < fieldDefArray.length; i++) {
      var fName = fieldDefArray[i].name;
      var fType = fieldDefArray[i].type;
      if (fName === field) {
        fieldType = fType;
        break;
      }
    }
    return fieldType;
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
    } else {
      return 0;
    }
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
    } else {
      return 0;
    }
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
    } else {
      return 0;
    }
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
    } else {
      return 0;
    }
  }
  PAR(arr) {
    var a = 1;
    var b = 0;
    arr.forEach((aa) => {
      if (aa != undefined && !isNaN(aa) && aa != "") {
        b = 1;
        a = aa / 100;
        console.log(a);
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

  LT(arr) {
    if (arr[0] < arr[1]) {
      return true;
    }
    return false;
  }
  LTE(arr) {
    console.log(arr);
    if (arr[0] <= arr[1]) {
      return true;
    }
    return false;
  }

  GT(arr) {
    if (arr[0] > arr[1]) {
      return true;
    }
    return false;
  }
  GTE(arr) {
    console.log("GTE");
    console.log(arr);
    if (arr[0] >= arr[1]) {
      return true;
    }
    return false;
  }
  EQ(arr) {
    if (arr[0] == arr[1]) {
      return true;
    }
    return false;
  }

  dateFunction(dateField) {
    var constantFieldArray = [
      {
        field: "@currentDate",
        addDay: 0,
        option: "ADD",
      },
    ];
    for (var i = 0; i < constantFieldArray.length; i++) {
      if (
        constantFieldArray[i]["field"].toLowerCase() == dateField.toLowerCase()
      ) {
        var addDay = constantFieldArray[i]["addDay"];
        var option = constantFieldArray[i]["option"];
        const today = new Date();
        var month = today.getMonth() + 1;
        var day = today.getDate();
        var year = today.getFullYear();
        var newDate = year + "-" + month + "-" + day;

        const tomorrow = new Date(newDate);
        if (option == "ADD") {
          tomorrow.setDate(tomorrow.getDate() + addDay);
          return tomorrow;
        } else {
          tomorrow.setDate(tomorrow.getDate() - addDay);
          return tomorrow;
        }
      }
    }
  }

  validation(arrayData) {
    var data = arrayData["data"];
    var config = arrayData["config"];
    var fieldDef = arrayData["FieldDef"];
    var itemCnt = arrayData["itemCnt"];
    var fieldName = arrayData["fieldName"];
    var returnData = {};
    returnData["status"] = true;
    returnData["message"] = "";
    returnData["itemCnt"] = "";
    returnData["data"] = data;
    if (config != undefined) {
      if (config.hasOwnProperty("Sequence")) {
        if (config["Sequence"].hasOwnProperty(arrayData["fieldName"])) {
          var selectedFieldArray = config["Sequence"][arrayData["fieldName"]];
          // Condition code start - Added by Atul
          console.log(selectedFieldArray[i]);
          if (selectedFieldArray[i] != undefined) {
            if (selectedFieldArray[i].hasOwnProperty("condition")) {
              var condition = selectedFieldArray[i]["condition"];
              var fieldObj = [];
              if (condition["type"] == "Header") {
                fieldObj.push(data[condition["Source"]]);
              } else {
                fieldObj.push(data[fieldName][itemCnt][Source]);
              }
              fieldObj.push(condition["value"]);
              var fun = condition["function"]; // get function name
              if (!this[fun](fieldObj)) {
                return returnData;
              }
            }
            // Condition code end
            for (var i = 0; i < selectedFieldArray.length; i++) {
              var fieldArray = selectedFieldArray[i]["Fields"];
              var fieldObj = [];
              for (var j = 0; j < fieldArray.length; j++) {
                var Source = fieldArray[j]["Source"];
                var typeField = fieldArray[j]["Type"]["type"];

                var getFieldType = this.fieldType(Source, fieldDef);
                if (getFieldType) {
                  // Field Type is not null
                  if (getFieldType.toLowerCase() == "date") {
                    if (typeField == "Header") {
                      fieldObj.push(new Date(data[Source]));
                    } else {
                      fieldObj.push(new Date(data[fieldName][itemCnt][Source]));
                    }
                  } else {
                    if (typeField == "Header") {
                      fieldObj.push(
                        data.hasOwnProperty(Source)
                          ? parseFloat(data[Source])
                          : 0
                      );
                    } else {
                      fieldObj.push(
                        data[fieldName][itemCnt].hasOwnProperty(Source)
                          ? parseFloat(data[fieldName][itemCnt][Source])
                          : 0
                      );
                    }
                  }
                } else {
                  // Field Type is  null
                  console.log(
                    "Function return value " +
                      Source +
                      "---" +
                      this.dateFunction(Source)
                  );
                  fieldObj.push(this.dateFunction(Source));
                }
              }
              var fun = selectedFieldArray[i]["function"]; // get function name
              console.log("fun --" + fun);
              console.log("fieldObj --" + fieldObj);
              if (typeof this[fun] !== "undefined") {
                console.log("Return --" + this[fun](fieldObj));
                if (!this[fun](fieldObj)) {
                  console.log("IF");
                  returnData["message"] = selectedFieldArray[i]["msg"];
                  returnData["status"] = false;
                  returnData["itemCnt"] = itemCnt;
                  returnData["fieldValue"] = fieldObj[0];
                  returnData["fieldName"];
                  if (selectedFieldArray[i]["type"] == "Header") {
                    data[selectedFieldArray[i]["Target"]] = this[fun](fieldObj);
                  } else {
                    data[fieldName][itemCnt][
                      selectedFieldArray[i]["Target"]
                    ] = this[fun](fieldObj);
                  }

                  return returnData;
                  return false;
                } else {
                  returnData["message"] = selectedFieldArray[i]["msg"];
                  returnData["status"] = true;
                  returnData["itemCnt"] = itemCnt;
                  if (selectedFieldArray[i]["type"] == "Header") {
                    data[selectedFieldArray[i]["Target"]] = this[fun](fieldObj);
                  } else {
                    data[fieldName][itemCnt][
                      selectedFieldArray[i]["Target"]
                    ] = this[fun](fieldObj);
                  }
                }
              } else {
                if (selectedFieldArray[i]["type"] == "Header") {
                  data[selectedFieldArray[i]["Target"]] = "";
                  returnData["itemCnt"] = itemCnt;
                } else {
                  data[fieldName][itemCnt][selectedFieldArray[i]["Target"]] =
                    "";
                  returnData["itemCnt"] = itemCnt;
                }
              }
            }
          }
        }
      }
    }
    return returnData;
  }

  datacalculation(outdata, config, fieldDef) {
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
                //    fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                var getFieldType = this.fieldType(field["Source"], fieldDef); // get field type
                if (getFieldType.toLowerCase() == "date") {
                  // get working day in between 2 dates
                  fieldObj.push(new Date(outdata[field["Source"]])); // get calculated field value
                } else {
                  //     fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                  fieldObj.push(
                    outdata.hasOwnProperty(field["Source"])
                      ? parseFloat(outdata[field["Source"]])
                      : 0
                  ); // get calculated field value
                }
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
  tablecalculation(outdata, config, tabname, fieldDef) {
    if (outdata[tabname] != undefined) {
      if (outdata[tabname].length > 0) {
        if (config["Item"].length > 0) {
          console.log("--------------------------------------");
          console.log("Item >> Formula");
          console.log("--------------------------------------");
          for (var i = 0; i < outdata[tabname].length; i++) {
            config["Item"].forEach((configItem) => {
              if (configItem["CalculatedFormula"]["table"] == tabname) {
                if (this.hasNull(configItem["CalculatedFormula"], 5)) {
                  var fieldObj = [];
                  configItem["Fields"].forEach((field) => {
                    if (this.hasNull(field, 2)) {
                      fieldObj.push(
                        parseFloat(outdata[tabname][i][field["Source"]])
                      ); // get calculated field value in item array

                      console.log(
                        field["Source"],
                        ">>",
                        outdata[tabname][i][field["Source"]]
                      );
                      console.log(fieldObj);
                    } else {
                      fieldObj.push(); // get calculated field value in item array
                    }
                  });
                  var fun = configItem["CalculatedFormula"]["function"]; // get function name
                  if (typeof this[fun] !== "undefined") {
                    outdata[tabname][i][
                      configItem["CalculatedFormula"]["Target"]
                    ] = this[fun](fieldObj); // call function and assign value in item array
                    console.log(
                      configItem["CalculatedFormula"]["Target"],
                      outdata[tabname][i][
                        configItem["CalculatedFormula"]["Target"]
                      ]
                    );
                  } else {
                    outdata[tabname][i][
                      configItem["CalculatedFormula"]["Target"]
                    ] = "";
                  }
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
            console.log("--------------------------------------");
            console.log("Header Item >> Formula");
            console.log("--------------------------------------");
            if (configItem["CalculatedFormula"]["table"] == tabname) {
              if (this.hasNull(configItem["CalculatedFormula"], 5)) {
                var fieldObj = [];
                for (var i = 0; i < outdata[tabname].length; i++) {
                  if (this.hasNull(configItem["Fields"][0], 2)) {
                    fieldObj.push(
                      parseFloat(
                        outdata[tabname][i][configItem["Fields"][0]["Source"]]
                      )
                    ); // get calculated field value from all items
                    console.log(
                      configItem["Fields"][0]["Source"],
                      ">>",
                      outdata[tabname][i][configItem["Fields"][0]["Source"]]
                    );
                    console.log(fieldObj);
                  } else {
                    fieldObj.push(""); // get calculated field value from all items
                  }
                }
                var fun = configItem["CalculatedFormula"]["function"]; // get function name
                if (typeof this[fun] !== "undefined") {
                  outdata[configItem["CalculatedFormula"]["Target"]] = this[
                    fun
                  ](fieldObj); // call function and assign value in header array
                  console.log(
                    configItem["CalculatedFormula"]["Target"],
                    outdata[configItem["CalculatedFormula"]["Target"]]
                  );
                } else {
                  outdata[configItem["CalculatedFormula"]["Target"]] = "";
                }
              }
            }
          });
        }
      }
    }
    if (config["Header"].length > 0) {
      console.log("--------------------------------------");
      console.log("Header >> Formula");
      console.log("--------------------------------------");
      // Check Header calculation is exist or not
      config["Header"].forEach((configItem) => {
        if (this.hasNull(configItem["CalculatedFormula"], 4)) {
          // loop config header
          var fieldObj = [];
          if (configItem["Fields"].length > 0) {
            configItem["Fields"].forEach((field) => {
              if (this.hasNull(field, 2)) {
                //   fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                var getFieldType = this.fieldType(field["Source"], fieldDef); // get field type
                if (getFieldType.toLowerCase() == "date") {
                  // get working day in between 2 dates
                  fieldObj.push(new Date(outdata[field["Source"]])); // get calculated field value
                } else {
                  //     fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                  fieldObj.push(
                    outdata.hasOwnProperty(field["Source"])
                      ? parseFloat(outdata[field["Source"]])
                      : 0
                  ); // get calculated field value
                  console.log(
                    field["Source"],
                    ">>",
                    outdata[field["Source"]],
                    fieldObj
                  );
                }
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
  headercalculation(outdata, config, fieldDef) {
    console.log(config);
    if (config.hasOwnProperty("Header")) {
      if (config["Header"].length > 0) {
        // Check Header calculation is exist or not
        config["Header"].forEach((configItem) => {
          if (this.hasNull(configItem["CalculatedFormula"], 4)) {
            // loop config header
            var fieldObj = [];
            if (configItem["Fields"].length > 0) {
              configItem["Fields"].forEach((field) => {
                console.log(configItem["Fields"], outdata[field["Source"]]);
                if (this.hasNull(field, 2)) {
                  //   fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                  var getFieldType = this.fieldType(field["Source"], fieldDef); // get field type
                  if (getFieldType.toLowerCase() == "date") {
                    // get working day in between 2 dates
                    fieldObj.push(new Date(outdata[field["Source"]])); // get calculated field value
                  } else {
                    //         fieldObj.push(parseFloat(outdata[field["Source"]])); // get calculated field value
                    fieldObj.push(
                      outdata.hasOwnProperty(field["Source"])
                        ? parseFloat(outdata[field["Source"]])
                        : 0
                    ); // get calculated field value
                  }
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
    }

    return outdata;
  }
}

module.exports = calFun;