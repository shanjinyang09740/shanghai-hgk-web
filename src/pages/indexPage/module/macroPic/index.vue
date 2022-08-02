<template>
  <div class="macroEco">
    <div class="macroEcoListMain">
      <span
        v-if="isShowLunboBtn"
        class="leftEco iconEco fl"
        name="leftEco"
        @click="switchMacroEco('left')"
        ><</span
      >
      <div id="macroEcoList" class="macroEcoList fl">
        <div id="containerTab">
          <template v-for="(item, index) in tabOption">
            <div
              v-if="item.active"
              @click="macroTabItemClick(item.id)"
              class="macroTabItem active ellipsis"
              :title="item.titleName"
            >
              {{ item.titleName }}
            </div>
            <div
              v-else
              class="macroTabItem ellipsis"
              @click="macroTabItemClick(item.id)"
              :title="item.titleName"
            >
              {{ item.titleName }}
            </div>
          </template>
        </div>
      </div>
      <span
        v-if="isShowLunboBtn"
        class="rightEco iconEco fr"
        name="rightEco"
        @click="switchMacroEco('right')"
        >></span
      >
    </div>
    <div id="macroEcoMain" class="macroEcoMain">
      <div class="queryCondition">
        <fu-form :inline="true" :model="macroForm">
          <fu-form-item label="统计周期" label-width="70px"> </fu-form-item>
          <fu-form-item label-width="70px">
            <fu-select
              v-model="macroForm.startDate"
              placeholder="选择开始日期"
              clearable
              filterable
            >
              <fu-option
                v-for="item in macroSelectOption"
                :key="item.bgq"
                :value="item.bgq"
                :label="item.bgqText"
              ></fu-option>
            </fu-select>
          </fu-form-item>
          <fu-form-item label="至" label-width="35px"> </fu-form-item>
          <fu-form-item label-width="70px">
            <fu-select
              v-model="macroForm.endDate"
              placeholder="选择截止日期"
              clearable
              filterable
            >
              <fu-option
                v-for="item in macroSelectOption"
                :key="item.bgq"
                :value="item.bgq"
                :label="item.bgqText"
              ></fu-option>
            </fu-select>
          </fu-form-item>
          <fu-form-item label-width="70px">
            <fu-button type="success" size="medium" @click="queryBtnClick"
              >查询</fu-button
            >
          </fu-form-item>
        </fu-form>
      </div>
      <div id="drawImg" class="drawImg"></div>
      <div v-model="currentZbIntro" id="zbIntro" class="zbIntro">
        {{ currentZbIntro }}
      </div>
    </div>
  </div>
</template>

<script>
import { Form, FormItem, Select, Option, Button, Loading, Message } from "fusion-ui";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";
import drawListJs from "./js/drawList.js";
export default {
  name: "macroEcoPic",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuSelect: Select,
    FuButton: Button,
    FuOption: Option,
    Message
  },
  props: [],
  data() {
    return {
      //宏观经济tab列表
      tabOption: [],
      //判断是否显示左右轮播按钮
      isShowLunboBtn: false,
      //宏观经济表单
      macroForm: {},
      //宏观经济查询下拉框数据
      macroSelectOption: [],
      //宏观经济绘图当前数据
      currentDrawDataObj: {},
      //初始化报告期查询范围
      selectBgqArea: "",
      //当前指标简介信息
      currentZbIntro: "",
      //加载loading
      loading: null,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    //初始化指标列表
    this.initZbList();
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //初始化指标列表
    initZbList() {
      this.loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      postJSON(REQ.macroListUrl)
        .then((res) => {
          if (res["data"]) {
            let resultData = res["data"][0]["data"];
            this.tabOption = resultData.map((item, index) => {
              item.active = index == 0 ? true : false;
              return item;
            });
            //指标列表轮播
            this.isShowLunboBtnFunc();
            //渲染图表
            this.currentDrawDataObj = this.tabOption[0];
            drawListJs.afrashMacroEcoMain(this);
          }
        })
        .catch((e) => {});
    },
    //判断是否显示左右轮播按钮
    isShowLunboBtnFunc() {
      let macroEcoListDomWidth = document.querySelector("#macroEcoList")
        .offsetWidth;
      let tabsDom = document
        .querySelector("#containerTab")
        .getElementsByClassName("macroTabItem");
      let tabsDomWidth = 0;
      tabsDom.forEach((item) => {
        tabsDomWidth += item.offsetWidth;
      });
      this.isShowLunboBtn = tabsDomWidth > macroEcoListDomWidth ? true : false;
    },
    //宏观界经济左右轮播点击事件
    switchMacroEco(btn) {
      if (btn == "left") {
        this.tabOption.unshift(this.tabOption.pop());
      } else {
        this.tabOption.push(this.tabOption.shift());
      }
    },
    //单个宏观经济tab个体点击事件
    macroTabItemClick(id) {
      this.loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.tabOption = this.tabOption.map((item) => {
        if (id == item["id"]) {
          item.active = true;
          this.currentDrawDataObj = item;
        } else {
          item.active = false;
        }
        return item;
      });
      //渲染图表
      drawListJs.afrashMacroEcoMain(this);
    },
    //查询事件
    queryBtnClick() {
      var selectBgqArr = [];
      var beginBgq = this.macroForm.startDate;
      var endBgq = this.macroForm.endDate;
      if (beginBgq) {
        selectBgqArr.push(beginBgq);
      }
      if (endBgq) {
        selectBgqArr.push(endBgq);
      }
      this.selectBgqArea = selectBgqArr.join(",");
      if (parseInt(beginBgq) > parseInt(endBgq)) {
        Message.warning("统计周期起始日期不能大于截止日期！");
        return;
      }
      drawListJs.initQueryCondition(this);
    },
  },
};
</script>

<style lang="less" scoped>
.macroEcoList {
  height: 45px;
  line-height: 45px;
  text-align: center;
  width: 650px;
  white-space: nowrap;
  overflow: hidden;
}

.macroEcoList .macroTabItem {
  float: left;
  height: 100%;
  padding: 0 11px;
  font-size: 16px;
  cursor: pointer;
}

.macroEcoList .macroTabItem.active {
  background-color: #1492ff;
  color: #fff;
}

.macroEcoMain {
  border: 1px solid #ccc;
  padding: 5px;
  background-color: #f3f6f8;
}

.macroEcoListMain {
  height: 45px;
  background-color: #f3f6f8;
}

#tJform {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  width: 70%;
}

.queryBtn {
  padding: 5px 10px;
  background-color: #1492ff;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}

.queryCondition {
  display: flex;
  justify-content: center;
  .el-button--medium {
    padding: 8px;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}

.drawImg {
  width: 100%;
  height: 300px;
}

.wordsEllipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.zbIntro {
  padding: 10px 20px;
  font-size: 16px;
  color: #666;
  text-indent: 20px;
}

.iconEco {
  width: 30px;
  height: 45px;
  font-size: 20px;
  text-align: center;
  line-height: 45px;
  color: #666;
  cursor: pointer;
}

.iconEco:hover {
  color: #1492ff;
}

.queryCondition {
  .el-input--suffix .el-input__inner {
    padding-right: 5px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
