<template>
  <div class="leftAreaMain">
    <div class="queryOperate">
      <div>
        <fu-button
          type="primary"
          icon="el-icon-search"
          :plain="!isTrue"
          size="mini"
          @click="toPageEasy()"
        >
          简单查询
        </fu-button>
        <fu-button
          type="primary"
          class="el-icon-help"
          :plain="isTrue"
          size="mini"
          @click="toPage()"
        >
          高级查询
        </fu-button>
      </div>
    </div>

    <fu-input
      placeholder="请输入内容"
      v-model="filterText"
      class="input-with-select"
    >
      <fu-button slot="append" icon="el-icon-search"></fu-button>
    </fu-input>
    <component-tree
      class="treecontainer"
      :treeData="treeData"
      :searchText="filterText"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :expandNodes="expandNodes"
      :treeId="treeId"
      ref="treeChild"
    ></component-tree>
  </div>
</template>

<script>
import ComponentTree from "@com/componentTree";
import { Button, Input, Loading } from "fusion-ui";
import { postJSON } from "@/utils/post.js";
export default {
  name: "",
  components: {
    ComponentTree: ComponentTree,
    FuButton: Button,
    FuInput: Input,
  },
  props: {
    themeCode: {
      type: String,
      default: "hgndtjnj",
    },
    routeParamsObj: {
      type: Object,
      default: {},
    },
    searchType: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      treeData: [],
      expandNodes: [],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "text",
        id: "id",
      },
      //按钮是否高亮显示
      isTrue: true,
    };
  },
  computed: {
    treeId() {
      let random = Number(
        Math.random()
          .toString()
          .substring(3, 16)
      );
      let timestaper = Number(Date.now());
      return `componenttree${(random + timestaper).toString()}`;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    //获取树数据
    let postData = {
      data: [
        { vtype: "attr", name: "themeCode", data: this.themeCode },
        { vtype: "attr", name: "sjgsd", data: "46" },
      ],
    };
    const loading = Loading.service({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      target: document.querySelector(".defineStyleContainerInSearch"),
    });
    postJSON("/api/dqpublish/v1/relaeseVariable/getRelaeseVariableTree.do", {
      postData: JSON.stringify(postData),
    })
      .then((res) => {
        if (res["data"]) {
          let resultData = res["data"][0]["data"];
          this.treeData = this.transformTozTreeFormat(resultData);
          if (this.treeData.length > 0) {
            this.expandNodes = [];
            if (this.routeParamsObj["folderId"]) {
              //设置相应的节点高亮并添加点击事件
              let currentNodeId = this.routeParamsObj["folderId"];
              if (!currentNodeId) return;
              this.setThemeCodeIdSelect(currentNodeId);
            } else {
              //设置树第一个子节点高亮并添加点击事件
              this.setFirstChildNodeSelect();
            }
          }
        }
      })
      .finally(() => {
        loading.close();
      });
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {
  },
  methods: {
    //切换至高级查询
    toPage() {
      this.isTrue = false;
      this.$emit("changeSearchType", "2");
      this.$bus.emit("changeShowSetZb", true);
    },
    //切换至简单查询
    toPageEasy() {
      //按钮高亮状态切换
      this.isTrue = true;
      //切换为简单查询
      this.$emit("changeSearchType", "1");
      //隐藏指标选择区域
      this.$bus.emit("changeShowSetZb", false);
      //禁用高级查询数据按钮
      this.$bus.emit("changeAdvanceBtnDisable", true);
    },
    //设置跟上级页面传来的themeCode相匹配的节点高亮并添加点击事件
    setThemeCodeIdSelect(currentNodeId) {
      //递归获取与currentNodeId相匹配的节点
      this.dgGetMarryNode(this.treeData, currentNodeId);
    },
    //递归获取与currentNodeId相匹配的节点
    dgGetMarryNode(treeData, currentNodeId) {
      treeData.some((item) => {
        if (item["id"] == currentNodeId) {
          // 设置高亮选中节点
          this.dgGetFirstNode([item]);
          return true;
        }
        if (item["children"]) {
          this.dgGetMarryNode(item["children"], currentNodeId);
        }
      });
    },
    //设置树第一个子节点高亮
    setFirstChildNodeSelect() {
      //递归找到第一个子节点
      this.dgGetFirstNode(this.treeData);
    },
    //递归找到第一个子节点
    dgGetFirstNode(treeData) {
      if (treeData[0]["children"]) {
        this.dgGetFirstNode(treeData[0]["children"]);
      } else {
        let selectNodeId = treeData[0]["id"];
        this.$nextTick(() => {
          // 默认高亮选中节点
          if (this.$refs.treeChild) {
            this.expandNodes.push(treeData[0]["id"]);
            this.$refs.treeChild.setCurrentKeyHeightLight(selectNodeId);
            this.handleNodeClick(treeData[0]);
          }
        });
      }
    },
    //树节点点击事件
    handleNodeClick(data) {
      if (!data["children"]) {
        this.$emit("node-click", data);
        //判斷是否是高級查詢，是 则显示指标选择区域
        if(!this.isTrue){
          this.$bus.emit("changeShowSetZb", true);
        }else{
          this.$bus.emit("changeShowSetZb", false);
        }
      }
    },
    /**
     * @description 转换成树形数据
     * @parames {Array} sNodes 传入的对象
     *
     */
    transformTozTreeFormat(sNodes) {
      //将普通的数组转换为父子结构
      let i, l;
      let r = [];
      let tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
          let children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren(node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },
  },
};
</script>

<style lang="less" scoped>
.leftAreaMain {
  width: 340px;
  background-color: #f0f4fb;
  padding: 5px;
  /deep/ .input-with-select {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    &.el-input-group {
      width: 80%;
    }
  }
  .queryOperate {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  .treecontainer {
    width: 100%;
    height: calc(100vh - 450px);
    overflow: auto;
    /deep/ .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: #e0f7fa;
    }
    /deep/ .el-tree {
      position: relative;
      height: auto;
      display: inline-block;
      min-width: 100%;
      font-size: 16px;
    }
  }
}
</style>
