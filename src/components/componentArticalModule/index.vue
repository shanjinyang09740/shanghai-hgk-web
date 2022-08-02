<template>
  <div class="tableList articalModule">
    <div class="tableListTitles">
      <div class="tableListTitlesLeft">
        <div class="titleWords">{{ moduleData.title }}</div>
        <div class="more" @click="runLink(moduleData.index)">>></div>
      </div>
      <img :src="moduleData.imgSrc" />
    </div>
    <div class="listData">
      <artical-list
        :articalListData="articalListData"
        :pointBgColor="pointBgColor"
        @rowAction="rowAction"
      ></artical-list>
    </div>
  </div>
</template>

<script>
import articalList from "@/components/componenttArticalList";
export default {
  name: "",
  components: {
    articalList,
  },
  props: {
    moduleData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    articalListData() {
      // if (this.moduleData.title === "最新数据") {
      //   return this.zxsjDealData(this.moduleData.listData);
      // } else {
      //   return this.dealData(this.moduleData.listData);
      // }
      return this.dealData(this.moduleData.listData);
    },
    pointBgColor() {
      return this.moduleData["pointBgColor"];
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //初始化数据
    dealData(arr) {
      let newArr = [];
      arr.forEach((item) => {
        newArr.push({
          subjectText: item["subjectText"],
          reportName: item.name,
          verifyTime: item.publishTime,
          ...item,
        });
      });
      return newArr;
    },
    zxsjDealData(arr) {
      let newArr = [];
      arr.forEach((item) => {
        newArr.push({
          // subjectText: item["subjectText"],
          reportName: item.instrumentName,
          verifyTime: item.updateTime,
          id: item.taskId,
          ...item,
        });
      });
      return newArr;
    },
    //更多跳转事件
    runLink(type) {
      this.$router.push({
        path: "/statisticsQuery/tjxx",
        query: {
          index: type,
        },
      });
    },
    /**
     * @description 单行文本点击事件
     * @param {Object} data
     */
    rowAction(data) {
      if (data["contentUrl"]) {
        window.open(data["contentUrl"], "_blank");
      } else if (data["htmlData"]) {
        let myWindow = window.open("", "_blank");
        myWindow.document.write(`${data["htmlData"]}`);
      }
    },
  },
};
</script>

<style scoped lang="less">
.articalModule {
  .tableListTitles {
    height: 42px;
    // display: flex;
    // align-items: center;
    padding: 0 10px;
    position: relative;
    // border-bottom: 2px solid #999;
    // &::before {
    //   content: "";
    //   position: absolute;
    //   left: 0px;
    //   bottom: 0;
    //   width: 82px;
    //   height: 2px;
    //   background: #999;
    // }
    .tableListTitlesLeft {
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      img {
        margin-right: 8px;
      }
      .titleWords {
        font-size: 18px;
        color: #333;
        font-weight: 600;
      }
      .more {
        cursor: pointer;
      }
    }
  }
  .listData {
    padding: 0 5px;
    .articalList {
      ul li {
        font-size: 14px;
        .itemLeft {
          width: 70%;
        }
      }
    }
  }
}
</style>
