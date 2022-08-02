<template>
  <div>
    <fu-form ref="dataForm" label-width="80px" size="mini" :inline="true">
      <fu-form-item>
        <fu-dropdown>
          <fu-button type="success" size="mini">
            报表管理<i class="el-icon-arrow-down el-icon--right"></i>
          </fu-button>
          <fu-dropdown-menu slot="dropdown">
            <fu-dropdown-item @click.native="changeMainSide()">
              <div class="rmDrop">
                <i class="zblzz-icon"></i>
                <span>主宾栏转置</span>
              </div>
            </fu-dropdown-item>
            <fu-dropdown-item @click.native="areaVisiable()">
              <div class="rmDrop">
                <i class="wdzh-icon"></i>
                <span>维度转换</span>
              </div>
            </fu-dropdown-item>
          </fu-dropdown-menu>
        </fu-dropdown>
      </fu-form-item>
      <fu-form-item>
        <fu-button
          type="success"
          size="mini"
          @click="isShowCasander = !isShowCasander"
        >
          数据管理<i class="el-icon-arrow-down el-icon--right"></i>
        </fu-button>
        <div style="position:relative;width:0px;height:0px;z-index:5000;">
          <div
            style="position:absolute;right:-100px;top:0px;background:#fff;"
            v-show="isShowCasander"
            @mouseleave="isShowCasander = false"
          >
            <fu-cascader-panel
              :options="calOptions"
              size="mini"
              v-model="dataManagePanelSelect"
            >
              <template slot-scope="{ node, data }">
                <div class="calItem">
                  <img :src="data.imgPath" />
                  <span>{{ data.label }}</span>
                </div>
              </template>
            </fu-cascader-panel>
          </div>
        </div>
      </fu-form-item>
      <fu-form-item>
        <fu-button
          style="margin-left:30px;"
          type="success"
          size="mini"
          :disabled="isAdvanceBtnDisable"
          @click="advanceQueryData"
          >查询数据</fu-button
        >
      </fu-form-item>
    </fu-form>
    <!-- 维度转换弹窗 -->
    <fu-dialog
      title="维度转换"
      :visible.sync="dialogVisible"
      append-to-body
      width="633px"
    >
      <div class="tableDefine">
        <div class="headTitleBar">
          <div class="headTitleBar-title">
            <div class="headTitle">标题栏</div>
            <div id="titleButton">
              <div class="boxlistBtns" id="t2m" @click="move('title', 'main')">
                移至主栏
              </div>
              <div class="boxlistBtns" id="t2s" @click="move('title', 'side')">
                移至宾栏
              </div>
            </div>
          </div>
          <div id="titleInput">
            <div class="layout">
              <div style="width: 214px;">
                <p v-for="item in layoutDialog.title" :key="item.label">
                  <fu-checkbox
                    style="margin-left:10px;"
                    v-model="item.selected"
                    @change="
                      (val) => {
                        areaChange(val, 'title', item);
                      }
                    "
                    >{{ item.label }}</fu-checkbox
                  >
                </p>
              </div>
              <div class="moveIcon">
                <div class="upIcon"></div>
                <div class="downIcon"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mainSide">
          <div class="mainBar ">
            <div class="mainBar-title">
              <div class="mainTitle">主栏</div>
              <div id="mainButton">
                <div class="boxlistBtns" id="m2s" @click="move('main', 'side')">
                  移至宾栏
                </div>
                <div
                  class="boxlistBtns moveTitleBtn"
                  id="m2t"
                  @click="move('main', 'title')"
                >
                  移至标题栏
                </div>
              </div>
            </div>
            <div id="mainInput">
              <div class="layout">
                <p v-for="item in layoutDialog.main" :key="item.label">
                  <fu-checkbox
                    style="margin-left:10px;"
                    v-model="item.selected"
                    @change="
                      (val) => {
                        areaChange(val, 'main', item);
                      }
                    "
                    >{{ item.label }}</fu-checkbox
                  >
                </p>

                <div class="moveIcon">
                  <div class="upIcon"></div>
                  <div class="downIcon"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="sideBar ">
            <div class="sideBar-title">
              <div class="sideTitle">宾栏</div>
              <div id="sideButton">
                <div class="boxlistBtns" id="s2m" @click="move('side', 'main')">
                  移至主栏
                </div>
                <div
                  class="boxlistBtns moveTitleBtn"
                  id="s2t"
                  @click="move('side', 'title')"
                >
                  移至标题栏
                </div>
              </div>
            </div>
            <div id="sideInput">
              <div class="layout">
                <p v-for="item in layoutDialog.side" :key="item.label">
                  <fu-checkbox
                    v-model="item.selected"
                    style="margin-left:10px;"
                    @change="
                      (val) => {
                        areaChange(val, 'side', item);
                      }
                    "
                    >{{ item.label }}</fu-checkbox
                  >
                </p>

                <div class="moveIcon">
                  <div class="upIcon"></div>
                  <div class="downIcon"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="controlButton">
          <div class="controlBtn">
            <div class="ctrlBtn" id="reset" @click="resetMainSide()">还原</div>
            <div class="ctrlBtn" id="ensure" @click="submitMainSide()">
              确定
            </div>
            <div class="ctrlBtn" id="cancel" @click="dialogVisible = false">
              取消
            </div>
          </div>
          <div class="controlTip" style="margin-top: 5px;">
            <span
              v-show="toopic"
              id="simpleMacroWarning"
              style="color:#ff0e0e;padding-left: 5px;"
              >注意：请确保主栏、宾栏和标题栏均至少包含一个项目！</span
            >
          </div>
        </div>
      </div>
    </fu-dialog>
  </div>
</template>

<script>
import {
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
export default {
  name: "reportDataManage",
  components: {
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
    FuCascader: Cascader,
  },
  data() {
    const calOptions = [
      {
        value: "row",
        label: "对行求和",
        imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/dhqh-icon.png"),
        children: [
          {
            value: "sum,sum求和",
            label: "sum求和",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/sum-icon.png"),
          },
          {
            value: "avg,平均值",
            label: "平均值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/average-icon.png"),
          },
          {
            value: "max,最大值",
            label: "最大值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/max-icon.png"),
          },
          {
            value: "min,最小值",
            label: "最小值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/min-icon.png"),
          },
          {
            value: "Mid,中位数",
            label: "中位数",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/zws-icon.png"),
          },
          {
            value: "MO,众数",
            label: "众数",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/zs-icon.png"),
          },
          {
            value: "SS,方差",
            label: "方差",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/fc-icon.png"),
          },
          {
            value: "S,标准差",
            label: "标准差",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/bzc-icon.png"),
          },
        ],
      },
      {
        value: "col",
        label: "对列求和",
        imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/dlqh-icon.png"),
        children: [
          {
            value: "sum,sum求和",
            label: "sum求和",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/sum-icon.png"),
          },
          {
            value: "avg,平均值",
            label: "平均值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/average-icon.png"),
          },
          {
            value: "max,最大值",
            label: "最大值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/max-icon.png"),
          },
          {
            value: "min,最小值",
            label: "最小值",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/min-icon.png"),
          },
          {
            value: "Mid,中位数",
            label: "中位数",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/zws-icon.png"),
          },
          {
            value: "MO,众数",
            label: "众数",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/zs-icon.png"),
          },
          {
            value: "SS,方差",
            label: "方差",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/fc-icon.png"),
          },
          {
            value: "S,标准差",
            label: "标准差",
            imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/bzc-icon.png"),
          },
        ],
      },
      {
        value: "recover,恢复",
        label: "恢复",
        imgPath: require("@/pages/publishingIndicatorSearch/src/images/zbQuery/hf-icon.png"),
      },
    ];
    return {
      //计算对象属性
      calOptions: calOptions,
      //是否展示数据管路级联选择器
      isShowCasander: false,
      //数据管理级联选中值
      dataManagePanelSelect: [],
      //维度转换弹窗
      dialogVisible: false,
      //维度转换提示语
      toopic: false,
      //查询按钮禁用状态
      isAdvanceBtnDisable: true,
      //主宾标题的设置项
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
    };
  },
  computed: {},
  watch: {
    //数据管理级联选择器选中值
    dataManagePanelSelect(val) {
      //渲染表格数据---调用子组件 --- panelSelect
      this.$bus.emit("panelSelect", val);
    },
    //主宾标题的设置项
    layout() {
      //渲染表格数据---调用子组件表格数据刷新方法 --- changeData
      this.$bus.emit("changeData", this.layout);
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    //监听高级 查询数据 按钮禁用状态
    this.$bus.on("changeAdvanceBtnDisable", (data) => {
      this.changeAdvanceBtnDisable(data);
    });
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {
    this.$bus.off("changeAdvanceBtnDisable");
  },
  destroyed() {},
  methods: {
    /**
     * @description 切换高级查询按钮禁用状态
     */
    changeAdvanceBtnDisable(type) {
      this.isAdvanceBtnDisable = type;
    },
    /**
     * @description 高级查询事件
     */
    advanceQueryData() {
      this.$bus.emit("changeShowSetZb", false);
    },
    /**
     * @description 勾选
     * @param
     * bool 当前是否勾选
     * type 主栏 宾栏 标题栏
     * data 当前操作的数据
     */
    areaChange(bool, type, data) {
      this.$set(data, "selected", bool);
    },
    /**
     * @description 恢复layout数据
     */
    resetMainSide() {
      this.layoutDialog = JSON.parse(JSON.stringify(this.layout));
    },
    /**
     * @description 重置layout数据
     */
    submitMainSide() {
      if (
        this.layoutDialog.main.length === 0 ||
        this.layoutDialog.side.length === 0 ||
        this.layoutDialog.title.length === 0
      ) {
        this.toopic = true;
      } else {
        this.toopic = false;
        this.layoutDialog.main.forEach((element) => {
          delete element.selected;
        });
        this.layoutDialog.side.forEach((element) => {
          delete element.selected;
        });
        this.layoutDialog.title.forEach((element) => {
          delete element.selected;
        });
        this.layout = JSON.parse(JSON.stringify(this.layoutDialog));
        this.dialogVisible = false;
      }
    },
    /**
     * @description 移动
     */
    move(start, end) {
      let result = this.layoutDialog[start].filter((item) => item.selected);
      if (result.length > 0) {
        this.layoutDialog[end].push(...result);
        let newRes = this.layoutDialog[start].filter((item) => !item.selected);
        this.layoutDialog[start] = JSON.parse(JSON.stringify(newRes));
      }
    },
    /**
     * @description 维度转换事件
     */
    areaVisiable() {
      this.layoutDialog = JSON.parse(JSON.stringify(this.layout));
      this.dialogVisible = true;
      this.toopic = false;
    },
    /**
     * @description 主宾栏转置
     */
    changeMainSide() {
      let main = this.layout.main;
      let side = this.layout.side;
      this.layout.main = side;
      this.layout.side = main;
      this.$bus.emit("changeData", this.layout);
      this.$bus.emit("changeShowEcharts", false);
    },
  },
};
</script>

<style lang="less" scoped>
@import url("./mainTable/change.less");
/deep/ .el-dialog__body {
  padding: 0;
}
.rmDrop {
  display: flex;
  align-items: center;
  i {
    display: inline-block;
    width: 21px;
    height: 16px;
    margin-right: 6px;
    background-image: url(./images/btn_icons.png);
    &.zblzz-icon {
      background-position: -53px -175px;
    }
    &.wdzh-icon {
      background-position: -53px -139px;
    }
  }
}
.calItem {
  display: flex;
  align-items: center;
  span {
    padding-left: 5px;
  }
}
</style>
