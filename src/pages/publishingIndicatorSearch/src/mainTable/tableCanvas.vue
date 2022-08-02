<template>
  <div class="container tableCanvas" id="macroEcoMain">
    <div class="formArea">
      <div
        class="paint_list"
        style="position: relative; display: inline-block;"
      >
        <div
          id="htx"
          class="ctrl-area-btn2 paint_item paint_xt"
          @click="echartsChange('列表')"
          title="列表"
          :class="myClass"
        ></div>
        <div
          id="ht3"
          class="ctrl-area-btn2 paint_item paint_bar"
          @click="echartsChange('柱折图')"
          title="柱折图"
          :class="myClass"
        ></div>
        <div
          id="ht1"
          class="ctrl-area-btn2 paint_item paint_line"
          @click="echartsChange('柱状图')"
          title="柱状图"
          :class="myClass"
        ></div>
        <div
          id="ht2"
          class="ctrl-area-btn2 paint_item paint_bar_line"
          @click="echartsChange('折线图')"
          title="折线图"
          :class="myClass"
        ></div>
        <div
          id="ht5"
          class="ctrl-area-btn2 paint_item paint_pie"
          @click="echartsChange('堆积图')"
          title="堆积图"
          :class="myClass"
        ></div>
        <!-- <div
          id="ht6"
          class="ctrl-area-btn2 paint_item paint_barStack"
          @click="echartsChange('气泡图')"
          title="气泡图"
          :class="myClass"
        ></div> -->
        <div
          id="ht4"
          class="ctrl-area-btn2 paint_item paint_scatter"
          @click="echartsChange('饼图')"
          title="饼图"
          :class="myClass"
        ></div>
        <div
          id="ht7"
          class="ctrl-area-btn2 paint_item paint_radar"
          @click="echartsChange('雷达图')"
          title="雷达图"
          :class="myClass"
        ></div>
      </div>
      <div>
        <fu-form ref="form" label-width="60px" size="mini" :inline="true">
          <fu-form-item>
            <time-line
              style="width:380px;"
              :bgqListData="bgqListData"
              @queryBtnClick="cutBgqListData"
            ></time-line>
          </fu-form-item>
          <fu-form-item>
            <fu-select
              v-model="titleValue"
              placeholder="选择地区"
              style="width:120px;"
            >
              <fu-option
                :label="option.label"
                :value="option.value"
                v-for="(option, i) in titleOptions"
                :key="i"
              ></fu-option>
            </fu-select>
          </fu-form-item>
          <!-- <fu-form-item>
            <fu-button type="success" size="mini" @click="exportTable()">
              图表导出
            </fu-button>
          </fu-form-item> -->
        </fu-form>
      </div>
    </div>
    <div v-show="showECHARTS">
      <div>
        <!-- 行 列 -->
        <!-- TODO: 图的行列转换 编辑 功能-->
      </div>
      <div :id="themeCode" style="width:100%;height:500px;">
        <!-- 这里放图 -->
      </div>
    </div>
    <div style="width: 100%">
      <fu-table
        :fu-data="mainData"
        ref="mainTable"
        style="width: 100%"
        border
        max-height="600px"
        @selection-change="handleSelectionChange"
      >
        <fu-table-column
          type="selection"
          width="55"
          fixed
          v-if="showECHARTS === true"
        >
        </fu-table-column>
        <fu-table-column
          v-if="mainData.rows.length > 0"
          :label="layout.main[0].label"
          width="250"
          fixed
        >
          <template slot-scope="scope">
            <span>
              <i
                v-if="scope.row.type == 'measure'"
                class="zbIcon"
                @click="zbjsWinClick(scope.row)"
              ></i>
              {{ scope.row.label }}
            </span>
          </template>
        </fu-table-column>
        <fu-table-column
          v-for="item in side"
          :key="item.value"
          :label="item.label"
          min-width="150"
          sortable
          prop="header"
        >
          <template slot="header" slot-scope="scope">
            <input
              type="checkbox"
              :checked="item.selected"
              @click="headerChange(item, item.selected)"
              v-if="showECHARTS === true"
            />
            <span
              ><i
                v-if="item.type == 'measure'"
                class="zbIcon"
                @click="zbjsWinClick(item)"
              ></i>
              {{ item.label }}</span
            >
          </template>
          <template slot-scope="scope">
            <div
              v-if="dataGrid[`${titleValue}_${scope.row.value}_${item.value}`]"
            >
              <span
                style="color:red;"
                v-if="
                  scope.row.type === 'calculate' || item.type === 'calculate'
                "
              >
                {{
                  dataGrid[`${titleValue}_${scope.row.value}_${item.value}`]
                    .value
                }}
              </span>
              <span v-else>
                {{
                  dataGrid[`${titleValue}_${scope.row.value}_${item.value}`]
                    .value
                }}
              </span>
            </div>
          </template>
        </fu-table-column>
      </fu-table>
    </div>

    <!-- 指标解释弹窗 -->
    <fu-dialog
      title="指标解释"
      :visible.sync="zbjsDialog.visible"
      width="500px"
    >
      <div class="zhibiaodetail-area">
        <div class="zhibiaodetail-area-title" :title="zbjsDialog.title">
          {{ zbjsDialog.title }}
        </div>
        <div class="zhibiaodetail-area-content">
          {{ zbjsDialog.introl }}
        </div>
      </div>
    </fu-dialog>
  </div>
</template>

<script>
import { reqTableData, calculate } from "./../request/index";
import * as echarts from "echarts";
import { postJSON } from "@/utils/post.js";
import TimeLine from "@/components/componentTimeLine";
import {
  Table,
  TableColumn,
  Form,
  FormItem,
  Select,
  Option,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  CascaderPanel,
  Dialog,
  Loading,
  Cascader,
  Checkbox,
} from "fusion-ui";
import { Message } from "element-ui";

export default {
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuForm: Form,
    FuFormItem: FormItem,
    FuSelect: Select,
    FuOption: Option,
    FuDropdown: Dropdown,
    FuDropdownMenu: DropdownMenu,
    FuDropdownItem: DropdownItem,
    FuButton: Button,
    FuCascaderPanel: CascaderPanel,
    FuDialog: Dialog,
    FuCheckbox: Checkbox,
    ElCascader: Cascader,
    TimeLine: TimeLine,
  },
  props: {
    searchType: {
      default: "1",
      type: String,
    },
    folderId: {
      default: "1",
      type: String,
    },
    folderLabel: {
      default: "1",
      type: String,
    },
    themeCode: {
      default: "",
      type: String,
    },
    measures: {
      type: Array,
    },
  },
  data() {
    return {
      myClass: "classA",
      toopic: false,
      isFirstClickEcharts: false,
      showECHARTS: false,
      titleValue: "",
      dialogVisible: false,
      //指标解释弹窗相关
      zbjsDialog: {
        visible: false,
        title: "",
        introl: "",
      },
      //layout    主宾标题的设置项
      layout: {
        main: [
          {
            label: "指标",
            value: "measure",
          },
        ],
        side: [
          {
            label: "报告期",
            value: "BGQ",
          },
        ],
        title: [
          {
            label: "地区",
            value: "ADDR",
          },
        ],
      },
      layoutDialog: {
        main: [
          {
            label: "指标",
            value: "measure",
          },
        ],
        side: [
          {
            label: "报告期",
            value: "BGQ",
          },
        ],
        title: [
          {
            label: "地区",
            value: "ADDR",
          },
        ],
      },
      drawType: "",
      colCalculate: [],
      rowCalculate: [],
      rangeBGQ: [],
      rangeADDR: [],
      //sideCol 宾栏数据
      side: [],
      // 主栏数据
      mainData: { rows: [] },
      titleOptions: [],

      //表格数据
      dataGrid: {},
      reqData: null,
      multipleSelection: [],
      //时间轴报告期数据
      bgqListData: [],
      //报告期所在栏目数据
      bgqLanData: [],
    };
  },
  watch: {
    folderId(val) {
      if (val) {
        this.changeData();
      }
    },
    searchType(val) {
      this.changeData();
    },
    themeCode(val) {
      this.changeData();
    },
  },
  created() {
    this.changeData();
  },
  mounted() {
    //监听数据管理级联选择器事件
    this.$bus.on("panelSelect", (data) => {
      this.panelSelect(data);
    });
    //监听变换维度触发表格刷新事件
    this.$bus.on("changeData", (data) => {
      this.changeData(data);
    });
    //监听切换echart图显示隐藏事件
    this.$bus.on("changeShowEcharts", (data) => {
      this.changeShowEcharts(data);
    });
  },
  beforeDestroy() {
    this.$bus.off("panelSelect");
    this.$bus.off("changeData");
    this.$bus.off("changeShowEcharts");
  },
  methods: {
    /**
     * @description 切换echart图显示隐藏
     * @param {Boolean} type
     *
     */
    changeShowEcharts(type) {
      this.showECHARTS = type;
    },

    /**
     * @description 数据管理级联选择器
     *
     */
    panelSelect(val) {
      this.showECHARTS = false;
      if (val[0] === "recover,恢复") {
        this.changeData();
      } else {
        const loading = Loading.service({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          target: document.querySelector(".app-main"),
        });
        calculate(this.reqData, val)
          .then((res) => {
            this.reqData = res.data[0].data;
            this.titleOptions = res.data[0].data.title.content;
            this.mainData.rows = res.data[0].data.main.content;
            this.side = res.data[0].data.side.content;
            this.dataGrid = res.data[0].data.dataGrid;
            if (this.titleOptions[0]) {
              this.titleValue = this.titleOptions[0].value;
            }
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    //解决表头内容太长换行问题
    labelHead(h, { column, index }) {
      let l = column.label.length;
      let f = 16; //每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
      column.minWidth = f * (l + 1); //字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h("div", { class: "table-head" }, [column.label]);
    },
    /**
     * @description 指标解释图标点击事件
     * @param {String} data 指标名称
     */
    zbjsWinClick(row) {
      this.zbjsDialog.title = row["label"];
      this.zbjsDialog.visible = true;
      let postData = {
        data: [
          {
            vtype: "attr",
            name: "id",
            data: row["value"],
          },
        ],
      };
      postJSON("/api/dqpublish/v1/fulltable/queryIndctDescription.do", {
        postData: JSON.stringify(postData),
      }).then((res) => {
        if (res["data"]) {
          this.zbjsDialog.introl = res["data"][0]["data"][0]["description"];
        }
      });
    },
    headerChange(item, bool) {
      this.$set(item, "selected", !bool);
      this.draw();
    },

    /**
     * @description 初始化表格多选第一条 表头选择前六条
     */
    toggleSelection(row) {
      this.$refs.mainTable.$refs.el.toggleRowSelection(row, true);
      for (let index = 0; index < Math.min(this.side.length, 6); index++) {
        const element = this.side[index];
        element.selected = true;
      }
    },
    /**
     * @descriptionde 多选项发生改变
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.drawType !== "") {
        this.draw();
      }
    },
    /**
     * @description 切换图类型
     */
    echartsChange(type) {
      if (type === "列表") {
        this.drawType = "";
        this.showECHARTS = false;
        return;
      }
      this.toggleSelection(this.mainData.rows[0]);
      this.showECHARTS = true;
      this.$nextTick(() => {
        this.drawType = type;
        this.draw();
      });
    },
    /**
     * @description 绘图
     */
    draw() {
      const Line = ["柱折图", "折线图", "堆积图", "柱状图"];
      if (Line.includes(this.drawType)) {
        this.drawLine();
      } else if (this.drawType === "雷达图") {
        this.drawLeiDa();
      } else if (this.drawType === "气泡图") {
        this.drawQipao();
      } else {
        this.drawBar();
      }
    },
    /**
     * @description 主折 柱状 折线 堆积 四种的绘图
     */
    drawLine() {
      const type = this.drawType;
      const chartDom = document.getElementById(this.themeCode);
      const myChart = echarts.init(chartDom);
      let side = this.side.filter((item) => item.selected);
      let Xdata = [];
      let series = [];
      side.forEach((col) => {
        Xdata.push(col.label);
      });
      this.multipleSelection.forEach((row, index) => {
        let echartsType = "";
        if (type === "柱折图") {
          echartsType = index % 2 === 0 ? "bar" : "line";
        } else if (type === "柱状图") {
          echartsType = "bar";
        } else if (type === "折线图") {
          echartsType = "line";
        } else {
          echartsType = "line";
        }
        let y = {
          name: row.label,
          type: echartsType,
          data: [],
        };
        if (type === "堆积图") {
          y.areaStyle = {};
        }
        if (echartsType === "bar") {
          y.barWidth = "30";
          y.barMaxWidth = "50";
        }
        side.forEach((col) => {
          let num = this.dataGrid[
            `${this.titleValue}_${row.value}_${col.value}`
          ]
            ? this.dataGrid[`${this.titleValue}_${row.value}_${col.value}`]
                .value
            : "";
          y.data.push(num);
        });
        series.push(y);
      });

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            data: Xdata,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "",
            // min: 0,
            // interval: 500,
            axisLabel: {
              formatter: "{value} ",
            },
          },
        ],
        series: series,
      };

      myChart.clear();
      option && myChart.setOption(option);
      // option && myChart.setOption(option, this.isFirstClickEcharts);
      // if (!this.isFirstClickEcharts) {
      //   this.isFirstClickEcharts = true;
      // }
    },
    /**
     * @description 饼图
     */
    drawBar() {
      const type = this.drawType;
      const chartDom = document.getElementById(this.themeCode);
      const myChart = echarts.init(chartDom);
      let Xdata = [];
      let side = this.side.filter((item) => item.selected);
      this.multipleSelection.forEach((row, index) => {
        side.forEach((col) => {
          let num = this.dataGrid[
            `${this.titleValue}_${row.value}_${col.value}`
          ]
            ? this.dataGrid[`${this.titleValue}_${row.value}_${col.value}`]
                .value
            : "";
          Xdata.push({ name: col.label, value: num });
        });
      });

      const option = {
        color: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
        ],
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: Xdata,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // option && myChart.setOption(option, this.isFirstClickEcharts);
      // if (!this.isFirstClickEcharts) {
      //   this.isFirstClickEcharts = true;
      // }
      myChart.clear();
      option && myChart.setOption(option);
    },
    /**
     * @description 雷达图
     */
    drawLeiDa() {
      const type = this.drawType;
      const chartDom = document.getElementById(this.themeCode);
      const myChart = echarts.init(chartDom);
      let side = this.side.filter((item) => item.selected);
      let Xdata = [];
      let indicator = [];
      side.forEach((col) => {
        indicator.push({ name: col.label });
      });
      this.multipleSelection.forEach((row, index) => {
        let data = [];
        side.forEach((col) => {
          let num = this.dataGrid[
            `${this.titleValue}_${row.value}_${col.value}`
          ]
            ? this.dataGrid[`${this.titleValue}_${row.value}_${col.value}`]
                .value
            : "";
          data.push(num);
        });
        Xdata.push({ name: row.label, value: data });
      });

      const option = {
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
        },
        tooltip: {},
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          indicator: indicator,
        },
        series: [
          {
            type: "radar",
            data: Xdata,
          },
        ],
      };
      myChart.clear();
      option && myChart.setOption(option);
      // option && myChart.setOption(option, this.isFirstClickEcharts);
      // if (!this.isFirstClickEcharts) {
      //   this.isFirstClickEcharts = true;
      // }
    },
    /**
     * @description 气泡图
     */
    drawQipao() {
      const type = this.drawType;
      const chartDom = document.getElementById(this.themeCode);
      const myChart = echarts.init(chartDom);
      let side = this.side.filter((item) => item.selected);
      let Xdata = [];
      this.multipleSelection.forEach((row, index) => {
        let data = [];
        side.forEach((col) => {
          let num = this.dataGrid[
            `${this.titleValue}_${row.value}_${col.value}`
          ]
            ? this.dataGrid[`${this.titleValue}_${row.value}_${col.value}`]
                .value
            : "";
          data.push([col.value, num, 0, "", row.label]);
        });
        Xdata.push(data);
      });
      let series = [];
      Xdata.forEach((ele) => {
        series.push({
          name: ele[0][3],
          data: ele,
          type: "scatter",
          symbolSize: function(data) {
            return Number(data[1]) / 10;
          },
          emphasis: {
            focus: "series",
            label: {
              show: true,
              formatter: function(param) {
                return param.data[3];
              },
              position: "top",
            },
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(120, 36, 50, 0.5)",
            shadowOffsetY: 5,
            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
              {
                offset: 0,
                color: "rgb(251, 118, 123)",
              },
              {
                offset: 1,
                color: "rgb(204, 46, 72)",
              },
            ]),
          },
        });
      });
      // console.log(series);
      const option = {
        toolbox: {
          feature: {
            saveAsImage: { show: true },
          },
        },
        xAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          min: 201000,
          interval: 100,
          //FIXME:  此时气泡图x轴不应展示千位分隔符,目前不知道怎么改。
          // formatter: function(value, index) {
          //   return value + "年";
          // },
        },
        tooltip: {},
        yAxis: {
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },

          scale: true,
        },
        series,
      };
      myChart.clear();
      option && myChart.setOption(option);
    },
    /**
     * @description 表格的重新请求
     */
    async changeData(layout) {
      let _THIS = this;
      if (this.themeCode === "") {
        Message.warning("暂无主题信息！");
      } else if (this.folderId === "") {
        // Message.warning("暂无数据！");
      } else if (this.searchType === "") {
        Message.warning("请先明确查询类型！");
      } else {
        const loading = Loading.service({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          target: document.querySelector(".app-main"),
        });
        this.layout = layout ? layout : this.layout;
        await reqTableData(
          this.folderId,
          this.themeCode,
          this.searchType,
          this.layout,
          this.measures
        )
          .then((res) => {
            this.myClass = res.data.length > 0 ? ".paint_item" : "classA";
            this.reqData = res.data[0].data;
            this.titleOptions = res.data[0].data.title.content;
            this.mainData.rows = res.data[0].data.main.content;
            this.side = res.data[0].data.side.content;
            this.dataGrid = res.data[0].data.dataGrid;
            this.bgqListData = res.data[0].data.bgqList;
            if (this.titleOptions[0]) {
              this.titleValue = this.titleOptions[0].value;
            }
            if (_THIS.layout.side[0]["value"] == "BGQ") {
              this.bgqLanData = res.data[0].data.side.content;
            } else if (_THIS.layout.main[0]["value"] == "BGQ") {
              this.bgqLanData = res.data[0].data.main.content;
            } else if (_THIS.layout.title[0]["value"] == "BGQ") {
              this.bgqLanData = res.data[0].data.title.content;
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    /**
     * @description 截取报告期事件
     * @param {Object} bgqMaxMinObj
     */
    cutBgqListData(bgqMaxMinObj) {
      let { currentMinBgq, currentMaxBgq } = bgqMaxMinObj;
      let newArr = [];
      this.bgqLanData.forEach((item) => {
        let $bgq = parseInt(item["label"]);
        if ($bgq >= currentMinBgq && $bgq <= currentMaxBgq) {
          newArr.push(item);
        }
      });
      if (this.layout.side[0]["value"] == "BGQ") {
        this.side = newArr;
      } else if (this.layout.main[0]["value"] == "BGQ") {
        this.mainData.rows = newArr;
      } else if (this.layout.title[0]["value"] == "BGQ") {
        this.titleOptions = newArr;
      }
    },
    /**
     * @description 图表导出
     *
     */
    //TODO: 目前没有接口，暂未对接。
    exportTable() {},
  },
};
</script>

<style lang="less" scoped>
.table-head {
  font-size: 14px !important; //设置固定的字体大小
}
@import url("./change.less");
.tableCanvas {
  position: relative;
  .dataManage {
    position: absolute;
    top: -40px;
    right: 0px;
  }
}
.container {
  // 指标解释
  .zhibiaodetail-area {
    height: 150px;
    overflow: auto;
    padding: 10px 25px 0px;
    font-family: "Microsoft YaHei";
    .zhibiaodetail-area-title {
      line-height: 32px;
      color: rgb(51, 51, 51);
      font-size: 16px;
      text-indent: 20px;
      overflow: hidden;
      background: url(../images/zhibiaoDetailTitle-icon.png) 5px 12px no-repeat;
    }
    .zhibiaodetail-area-content {
      line-height: 25px;
      color: rgb(102, 102, 102);
      font-size: 14px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
  }
  //解决排序块下沉问题
  // /deep/.el-table .caret-wrapper {
  //   // display: none;
  //   position: absolute;
  //   right: 0;
  //   top: 0;
  //   transform: translate(-50%, -18%);
  // }
  // /deep/.el-table .cell {
  //   position: relative;

  // }
  //解决排序块下沉问题
  /deep/.el-table .cell {
    display: flex;
    align-items: center;
    font-size: 16px;
  }

  /deep/ .el-table__empty-block {
    min-height: 300px;
  }
  /deep/ .el-table {
    .el-table__fixed::before {
      background-color: #fff;
    }
    .el-table__fixed {
      height: auto !important; // 此处的important表示优先于element.style
      bottom: 17px; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
    }
    .cell {
      .zbIcon {
        width: 15px;
        height: 15px;
        background: url(../images/zb-icon.png) no-repeat center center;
        cursor: pointer;
        display: inline-block;
      }
    }

    th {
      background-color: #fff;
      border-right: 1px solid #ebeef5;
      &:nth-last-child(2) {
        border-right: 0;
      }
      &:first-child {
        border-right: 1px solid #ebeef5;
      }
    }
    .el-table__body tr td:first-child {
      border-right: 1px solid #ebeef5;
    }
  }

  /deep/ .el-cascader-menu__wrap {
    height: 160px;
  }
}
.formArea {
  display: flex;
  justify-content: space-between;
  background-color: #f6f6f6;
  border: 1px solid #eee;
  align-items: center;
  padding: 5px 0px;
  font-family: "SimSun";
  font-size: 12px;
  color: #333;
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  .paint_list {
    margin-left: 10px;
    div {
      width: 21px;
      height: 20px;
      background-image: url(../images/paint_icon.png);
      margin-right: 15px;
      margin-top: 9.5px;
    }
    .paint_item {
      cursor: pointer;
      float: none;
      display: inline-block;
      background-position: center center;
      background-repeat: no-repeat;
    }
    // 表格数据异常时，给echarts图标 div更换样式，并禁用点击事件
    .classA {
      z-index: 100;
      background-color: #ccc;
      filter: alpha(opacity=40);
      opacity: 0.4;
      -moz-opacity: 0.4;
      cursor: default;
      pointer-events: none;
    }
    .paint_xt {
      background-position: 0px 0px;
    }
    .paint_bar {
      background-position: 0px -24px;
    }
    .paint_line {
      background-position: 0px -47px;
    }
    .paint_bar_line {
      background-position: 0px -72px;
    }
    .paint_pie {
      background-position: 0px -96px;
    }
    .paint_barStack {
      background-position: 0px -144px;
    }
    .paint_scatter {
      background-position: 0px -119px;
    }
    .paint_radar {
      background-position: 0 -168px;
    }
  }
}
</style>
