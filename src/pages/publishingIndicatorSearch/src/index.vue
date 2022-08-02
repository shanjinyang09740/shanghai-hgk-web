<template>
  <div class="searchMain">
    <main-tree :routeParamsObj="routeParamsObj" :searchType="searchType" @changeSearchType="changeSearchType" @changeShowSetZb="changeShowSetZb"
    :themeCode="themeCode" @node-click="getTreeNodeData"></main-tree>
    <main-table
      :themeCode="themeCode"
      :searchType="searchType"
      :showSetZb="showSetZb"
      :folderId="folderId"
      :folderLabel="folderLabel"
      ref="mainTable"
    ></main-table>
  </div>
</template>

<script>
import mainTree from "./mainTree";
import mainTable from "./mainTable";
export default {
  components: {
    mainTree,
    mainTable,
  },

  props: ["themeCode", "routeParamsObj"],
  data() {
    return {
      folderId: "",
      folderLabel: "",
      //默认简单查询 1   高级查询 2
      searchType: "1",
      //是否显示选择指标栏
      showSetZb: false,
    };
  },
  mounted() {
    this.$bus.on("changeShowSetZb", data => {
      this.changeShowSetZb(data);
    });
  },
  methods: {
    getTreeNodeData(data) {
      this.folderId = data.id;
      this.folderLabel = data.folderLabel;
    },
    /**
     * @description 切换查询类型
     * @param {String} type
     * 
    */
    changeSearchType(type) {
      this.searchType = type;
      this.changeShowSetZb(type == '2' ? true : false);
    },
    /**
     * @description 切换指标选择栏显示隐藏
     * @param {Boolean} type
     * 
    */
    changeShowSetZb(type) {
      this.showSetZb = type;
    }
  },
};
</script>

<style scoped lang="less">
.searchMain {
  display: flex;
  justify-content: space-between;
  min-height: 100%;
  /deep/.el-dialog__body {
    padding: 0;
  }
}
</style>
