<template>
  <div class="defineStyleContainerInSearch">
    <div class="InSearchContainer">
      <data-Manage></data-Manage>
    </div>
    <fu-tabs type="border-card" v-model="tabName">
      <fu-tab-pane
        v-for="label in tabs"
        :label="label.themeLabel"
        :key="label.themeCode"
        :name="label.themeCode"
      >
        <main-content
          :themeCode="label.themeCode"
          :routeParamsObj="routeParamsObj"
          v-if="tabName === label.themeCode"
          ref="mainContent"
        >
        </main-content>
      </fu-tab-pane>
    </fu-tabs>
  </div>
</template>
<script>
import { Tabs, TabPane } from "fusion-ui";
import mainContent from "./src";
import DataManage from "./src/reportDataManage.vue";
export default {
  props: {},
  data() {
    return {
      //路由参数
      routeParamsObj: {},
      tabName: "",
      tabs: [],
      ndTabs: [
        {
          themeCode: "sjnd",
          themeLabel: "年度数据",
        },
      ],
      jdTabs: [
        {
          themeCode: "sjjd",
          themeLabel: "季度数据",
        },
        {
          themeCode: "sjyd",
          themeLabel: "月度数据",
        },
      ],
    };
  },
  components: {
    FuTabs: Tabs,
    FuTabPane: TabPane,
    mainContent,
    DataManage,
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    //获取路由参数 themeCode folderId
    this.routeParamsObj = {
      themeCode: this.$route.query.themeCode,
      folderId: this.$route.query.folderId,
    };

    //初始化tab列
    let routeName = this.$route.meta.name;
    if (routeName == "ndsj") {
      this.tabs = this.ndTabs;
    } else {
      this.tabs = this.jdTabs;
    }

    if(this.routeParamsObj["themeCode"]){
      this.tabName = this.routeParamsObj["themeCode"];
    }else{
      this.tabName = this.tabs[0].themeCode;
    }
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
};
</script>
<style lang="less" scoped>
.defineStyleContainerInSearch {
  position: relative;
  min-height: calc(100vh - 445px);
  .InSearchContainer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 25px;
    padding-top: 20px;
    position: absolute;
    top: 0px;
    right: 0;
    z-index: 10;
  }
  /deep/ .el-tabs__item {
    height: 47px;
    line-height: 42px;
    border-top: 5px solid transparent;
    &.is-active {
      border-top: 5px solid #409eff;
    }
  }
  /deep/ .el-tabs--border-card {
    min-height: calc(100vh - 445px);
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 5px;
    min-height: calc(100vh - 445px - 70px);
    .el-tab-pane {
      min-height: calc(100vh - 445px - 70px);
    }
  }
  /deep/ .el-tabs__header {
    margin-bottom: 15px;
  }
  /deep/ .el-tabs__header .el-tabs__item {
    font-size: 20px;
    color: #333333;
  }
}
</style>
