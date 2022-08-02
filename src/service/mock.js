import { postJSON } from "@/utils/post.js";
import { REQ } from "./requestUrl";
const Mock = require("mockjs");

let template = {
  title: "Syntax Demo",
  "sjjdList|10": [{name:"数据解读测试数据数据解读测试数据数据解读测试数据数据解读测试数据数据解读测试数据数据解读测试数据", bgq:"2021-01-01"}],
  "themeData":  [
      {name: "year", text: "年度", listData: [
        {
          id: "1",
          text: "地区生产总值大发范德萨范德萨范德萨防守打法",
          icon: ""
        },
        {
          id: "2",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "3",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "4",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "5",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "6",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "7",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "8",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "9",
          text: "地区生产总值",
          icon: ""
        },
      ]},
      {name: "season", text: "季度", listData: [
        {
          id: "1",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "2",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "3",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "4",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "5",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "6",
          text: "地区生产总值",
          icon: ""
        },
      ]},
      {name: "month", text: "月度", listData: [
        {
          id: "1",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "2",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "3",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "4",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "5",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "6",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "7",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "8",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "9",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "10",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "11",
          text: "地区生产总值",
          icon: ""
        },
        {
          id: "12",
          text: "地区生产总值",
          icon: ""
        },
      ]},
  ],
  "tjgb|10": [{name:"统计公报测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据", bgq:"2021-01-01"}],
  "tjnj|10": [{name:"统计年鉴测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据", bgq:"2021-01-01"}],
  "jdsj|10": [{name:"进度数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据", bgq:"2021-01-01"}],


  "number1|+1": 100,
  "number2|1-100": 100,
  "number3|1-100.1-10": 1,
  "number4|123.1-10": 1,
  "number5|123.3": 1,
  "number6|123.10": 1.123,

  "boolean1|1": true,
  "boolean2|1-2": true,

  "object1|2-4": {
    "110000": "北京市",
    "120000": "天津市",
    "130000": "河北省",
    "140000": "山西省",
  },
  "object2|2": {
    "310000": "上海市",
    "320000": "江苏省",
    "330000": "浙江省",
    "340000": "安徽省",
  },
  "array2|1-10": ["Mock.js"],
  "array3|3": ["Mock.js"],

  function: function() {
    return this.title;
  },
};
// Mock.mock(rurl, template)
Mock.mock(/\.json/, {
  ...template,
});
