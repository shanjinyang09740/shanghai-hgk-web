import optionJson from "./option.json";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";

export default {
  /**
   * @description 渲染宏观经济图形
   *
   */
  afrashMacroEcoMain(vm) {
    //清空数据及查询条件
    this.clearDrawData(vm);

    //初始化查询条件
    this.initQueryCondition(vm);

    //渲染指标解释信息
    this.initZbIntro(vm);
  },
  //清空数据及查询条件
  clearDrawData(vm) {
    vm.selectBgqArea = "";
    vm.macroForm = {};
    vm.macroSelectOption = [];
    vm.currentZbIntro = "";
  },
  //初始化查询条件
  initQueryCondition(vm) {
    let postData = {
      data: [
        { vtype: "attr", name: "id", data: vm.currentDrawDataObj["id"] },
        { vtype: "attr", name: "selectBgqArea", data: vm.selectBgqArea },
      ],
    };
    postJSON(REQ.macroPicDataUrl, { postData: JSON.stringify(postData) })
      .then((res) => {
        if (res["data"]) {
          let resultData = res["data"][0]["data"];
          let optionData = resultData["zbDataList"];
          let bgqListData = resultData["bgqList"];
          vm.macroSelectOption = resultData["bgqAllList"];
          //处理图形option数据
          let optionType = vm.currentDrawDataObj["optionType"];
          this.dealOptions(optionType, optionData, bgqListData, vm);
        }
      })
      .catch((e) => {});
  },
  //处理option数据
  dealOptions(optionType, optionData, comboxData, vm) {
    const _THIS = this;
    for (var i = 0; i < optionJson.length; i++) {
      if (optionType == optionJson[i]["optionType"]) {
        let currentOption = JSON.parse(JSON.stringify(optionJson[i]["option"]));
        this.fillDrawData(
          optionType,
          currentOption,
          optionData,
          comboxData,
          vm,
          function(data) {
            _THIS.initChart(data, vm);
          }
        );
        break;
      }
    }
  },

  //填充图形数据
  fillDrawData(optionType, option, optionData, comboxData, vm, callback) {
    var newOption = {};
    var oldOption = option;
    if (optionData.length > 0) {
      //渲染图例
      oldOption["legend"]["data"] = this.afrashLegend(optionData);
      //渲染标题title
      // oldOption["title"]["text"] = vm.currentDrawDataObj["titleName"];

      //x轴
      if (optionType == "drawLine") {
        oldOption["xAxis"]["data"] = this.afrashX(comboxData)["xData"];
      } else {
        oldOption["xAxis"][0]["data"] = this.afrashX(comboxData)["xData"];
      }
      //渲染序列series
      oldOption["series"] = this.afrashSeries(
        optionData,
        comboxData,
        optionType,
        oldOption,
        vm
      );
      //y轴
      oldOption["yAxis"][0]["name"] = vm.currentDrawDataObj["jldwmc"];
      newOption = oldOption;
    }
    callback(newOption);
  },
  //渲染图例
  afrashLegend(data) {
    var arr = [];
    data.forEach(function(item) {
      arr.push(item["zbmc"]);
    });
    return arr;
  },
  //渲染序列series
  afrashSeries(data, comboxData, optionType, oldOption, vm) {
    let arr = [];
    let relationship = vm.currentDrawDataObj["relationship"];
    if (relationship) {
      relationship = JSON.parse(relationship);
    }
    //1. 取出数据集 zbDataSObj
    let zbDataSObj = [];
    data.forEach(function(item) {
      let zbmc = item["zbmc"];
      zbDataSObj[zbmc] = item["zbDataS"];
    });

    //2.取出数据集 perDataObj ---- 其中各个元素与zbmc相对应
    //判断bgqValue是否在数组中，如果在，则将指标值添加至arr1中，如果没有则将空值添加进去，最终保证arr1与comboxData长度一致
    let perDataObj = {};
    for (var key in zbDataSObj) {
      perDataObj[key] = this.getPerDataArr(key, zbDataSObj[key], comboxData);
    }

    if (optionType == "drawBarLine") {
      for (let key2 in perDataObj) {
        let serObj = {};
        if (relationship[key2] == "bar") {
          serObj = {
            name: key2,
            type: "bar",
            data: perDataObj[key2],
          };
        } else {
          oldOption["yAxis"][1]["min"] = Math.min.apply(null, perDataObj[key2]);
          oldOption["yAxis"][1]["max"] = Math.max.apply(null, perDataObj[key2]);
          serObj = {
            name: key2,
            type: "line",
            yAxisIndex: 1,
            symbol: "circle",
            symbolSize: 12,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: 16,
                  },
                },
                lineStyle: {
                  width: 3,
                },
              },
            },
            data: perDataObj[key2],
          };
        }
        arr.push(serObj);
      }
    } else {
      for (let key2 in perDataObj) {
        let serObj = {};
        if (relationship[key2] == "bar") {
          serObj = {
            name: key2,
            type: "bar",
            data: perDataObj[key2],
          };
        } else {
          oldOption["yAxis"][0]["min"] = Math.min.apply(null, perDataObj[key2]);
          oldOption["yAxis"][0]["max"] = Math.max.apply(null, perDataObj[key2]);
          serObj = {
            name: key2,
            type: "line",
            symbol: "circle",
            symbolSize: 12,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    fontSize: 16,
                  },
                },
                lineStyle: {
                  width: 3,
                },
              },
            },
            data: perDataObj[key2],
          };
        }
        arr.push(serObj);
      }
    }

    return arr;
  },

  //获取到每块数据集序列
  getPerDataArr(key, arr, comboxData) {
    var newArr = [];
    comboxData.forEach((item) => {
      var bgqValue = item["bgq"];
      var getNewValue = this.judgeArrIsExistValue(arr, bgqValue, "bgq", "zbz");
      newArr.push(getNewValue);
    });
    return newArr;
  },

  //判断bgqValue是否在数组中，如果在，则返回值，如果没有则返回空值
  judgeArrIsExistValue(arr, val, prop, getProp) {
    var newValue = "";
    arr.some((item) => {
      if (val == item[prop]) {
        newValue = item[getProp];
      }
    });
    return newValue;
  },

  //x轴
  afrashX(data) {
    var unit = "";
    var xData = [];
    data.forEach(function(item, index) {
      xData.push(item["bgqText"]);
    });

    return {
      xData: xData,
    };
  },

  //初始化echarts图表
  initChart(option, vm) {
    console.log("option", vm.$echarts);
    let getchart = vm.$echarts.init(document.getElementById("drawImg"));
    option && getchart.clear();
    getchart.setOption(option);
    //关闭loading
    // vm.loading.close();
    //随着屏幕大小调节图表
    window.addEventListener("resize", () => {
      getchart.resize();
    });
  },
  //渲染指标解释信息
  initZbIntro(vm) {
    vm.currentZbIntro = vm.currentDrawDataObj["indicatorDesc"];
  },
};
