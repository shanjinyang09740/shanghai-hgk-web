<template>
  <div class="tableList">
    <div class="tableListTitle">
      <div class="titleWords">
        数据要闻
      </div>
      <div class="more" @click="runLink">更多>></div>
    </div>
    <div class="listData">
      <artical-list
        :articalListData="articalListData"
        @rowAction="rowAction"
      ></artical-list>
    </div>
  </div>
</template>

<script>
import articalList from "@/components/componenttArticalList";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";
import "@/service/mock.js";
export default {
  name: "sjjdList",
  components: {
    articalList,
  },
  props: {
    sjjdIndex: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      //列表数据
      articalListData: [],
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    //获取数据
    this.initData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //初始化数据
    initData() {
      this.articalListData = [];
      let postData = `
          {"data":[{"name":"formpanel","vtype":"formpanel","data":{"ssdw_code":"","sjjd_type":"2","title":""}}]}
        `;
      postJSON(REQ.tjxxUrl, { postData: postData }).then(
        function(res) {
          let resultData = res["data"][0]["data"]["rows"];
          resultData.forEach((item, index) => {
            if (index < 10) {
              this.articalListData.push({
                ...item,
                time: item.publishTime ? item.publishTime.substring(0, 10) : "",
              });
            }
          });
        }.bind(this)
      );
    },
    //数据解读更多跳转事件
    runLink() {
      this.$router.push({
        path: "/statisticsQuery/tjxx",
        query: {
          index: this.sjjdIndex
        }
      });
    },
    /**
     * @description 数据解读单行文本点击事件
     * @param {Object} data
     */
    rowAction(data) {
      if (data["contentUrl"]) {
        window.open(data["contentUrl"], "_blank");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.titleWords {
  width: 112px;
  height: 50px;
  text-align: center;
  line-height: 45px;
  color: #fff;
  background: url(./images/sjjd-bg.png) no-repeat center center;
}
</style>
