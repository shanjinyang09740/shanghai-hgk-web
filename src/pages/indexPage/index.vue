<template>
  <div class="content">
    <div class="areaTwo">
      <swipers></swipers>
    </div>
    <!-- <div class="areaTwo">
      <visual-list></visual-list>
    </div> -->
    <!-- <div>
      <app-label></app-label>
    </div> -->
    <div class="bot-con">
      <div class="areaThree">
        <template v-for="item in articalModuleData">
          <artical-module :moduleData="item"></artical-module>
        </template>
      </div>
      <div class="app-con">
        <div class="app-con-title">
          <img :src="require('@/assets/images/erweima.png')" alt="" />
        </div>
        <div class="specialData">
          <div class="progress" @click="clickToProgess">
            <img :src="imgSrc.progressTo" alt="" />
          </div>
          <div class="year" @click="clickToYear">
            <img :src="imgSrc.yearTo" alt="" />
          </div>
        </div>
        <div class="newwestData" @click="clickToNews">
          <img :src="imgSrc.newTo" alt="" />
        </div>
      </div>
    </div>
    <div>
      <system-list></system-list>
    </div>
  </div>
</template>

<script>
import { REQ } from "@/service/requestUrl";
import { postJSON } from "@/utils/post.js";
import visualList from "./module/visualList";
import appLabel from "./module/appLabel";
import swipers from "./module/swipers";
import systemList from "./module/systemList";
import articalModule from "@/components/componentArticalModule";
export default {
  name: "indexPage",
  components: {
    systemList,
    articalModule,
    visualList,
    appLabel,
    swipers,
  },
  props: [],
  data() {
    return {
      imgSrc: {
        progressTo: require("@/assets/images/data/progress.png"),
        yearTo: require("@/assets/images/data/year.png"),
        newTo: require("@/assets/images/data/newTo.png"),
      },
      articalModuleData: [
        {
          type: "1",
          title: "数据解读",
          imgSrc: require("@/assets/images/new/bot-line.png"),
          pointBgColor: "#FC7269",
          moreUrl: "#FC7269",
          listData: [],
        },
        {
          type: "3",
          title: "统计分析",
          imgSrc: require("@/assets/images/new/bot-line.png"),
          pointBgColor: "#39A7F3",
          moreUrl: {
            url: "",
            type: "_self",
          },
          listData: [],
        },
        {
          type: "4",
          title: "指标解释",
          imgSrc: require("@/assets/images/new/bot-line.png"),
          pointBgColor: "#40CE83",
          moreUrl: {
            url: "/macroVariableQuery.html?type=jd",
            type: "_self",
          },
          listData: [],
        },
        {
          type: "2",
          title: "统计知识",
          imgSrc: require("@/assets/images/new/bot-line.png"),
          pointBgColor: "#40CE83",
          moreUrl: {
            url: "/macroVariableQuery.html?type=jd",
            type: "_self",
          },
          listData: [],
        },
      ],
      articalCatogory: [],
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    //初始化数据
    this.initData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //最新数据页面跳转
    clickToNews() {
      this.$router.push("/allTablesQuery/zbsj");
    },
    //进度页面跳转
    clickToProgess() {
      this.$router.push("/publishingIndicatorSearch/jdsj");
    },
    //年度页面跳转
    clickToYear() {
      this.$router.push("/publishingIndicatorSearch/ndsj");
    },
    //初始化数据
    initData() {
      postJSON(REQ.getSjjdObj)
        .then((res) => {
          this.articalModuleData[0].listData = res.data[0].data;
          // console.log("数据解读", this.articalModuleData);
        })
        .catch((err) => {});
      postJSON(REQ.getTjfxObj)
        .then((res) => {
          this.articalModuleData[1].listData = res.data[0].data;
          // console.log("统计分析", this.articalModuleData);
        })
        .catch((err) => {});
      postJSON(REQ.getTjzsObj)
        .then((res) => {
          this.articalModuleData[3].listData = res.data[0].data;
          // console.log("统计知识", this.articalModuleData);
        })
        .catch((err) => {});
      postJSON(REQ.getZxsjObj)
        .then((res) => {
          this.articalModuleData[2].listData = res.data[0].data;
          console.log("指标解释", this.articalModuleData[2]);
        })
        .catch((err) => {});
    },
    //请求数据
    async postData(type, callback) {
      let newArr = [];
      let postData = {
        data: [
          {
            name: "formpanel",
            vtype: "formpanel",
            data: { ssdw_code: "", sjjd_type: type, title: "" },
          },
        ],
      };
      postJSON(REQ.tjxxUrl, { postData: JSON.stringify(postData) }).then(
        function(res) {
          let resultData = res["data"][0]["data"]["rows"];
          resultData.forEach((item, index) => {
            if (index < 10) {
              newArr.push({
                ...item,
                time: item.publishTime ? item.publishTime.substring(0, 10) : "",
              });
            }
          });
          callback(newArr);
        }.bind(this)
      );
    },
  },
};
</script>
<style>
.app-main {
  overflow: visible !important;
}
</style>

<style lang="less" scoped>
.content {
  // padding: 0 20px;
  // overflow: hidden;
  > div {
    margin-bottom: 20px;
  }
  .areaOne {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 345px;
    padding-top: 20px;
    > div {
      height: 100%;
      &.macroPic {
        width: 64%;
      }
      &.sjjdList {
        width: 35%;
      }
    }
  }
  .bot-con {
    margin-top: 100px;
    display: flex;
    .areaThree {
      min-height: 400px;
      max-width: 867px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      border-right: 1px dashed #1985ce;
      position: relative;
      > div {
        width: 405px;
        margin-right: 28px;
      }
      &::before {
        content: "";
        position: absolute;
        right: -6px;
        top: -10px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid #1985ce;
      }
    }
    .date-con {
      width: 332px;
      box-sizing: border-box;
      padding: 10px 30px;
      .date-con-title {
        font-weight: 600;
        font-size: 18px;
        color: #333;
        margin-bottom: 22px;
      }
    }
    .app-con {
      width: 332px;
      box-sizing: border-box;
      padding: 0 0 10px 30px;
      .app-con-title {
        display: flex;
        .app-con-title-text {
          font-size: 24px;
          color: #333;
          font-weight: 600;
        }
      }
      .app-con-desc {
        margin-top: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
          width: 124px;
          height: 124px;
          margin-right: 15px;
        }
        .app-con-desc-text {
          font-size: 12px;
          color: #666;
        }
      }
      .newwestData {
        height: 90px;
        margin-top: 10px;
        cursor: pointer;
      }
      .specialData {
        height: 90px;
        display: flex;
        margin-top: 20px;
        margin-bottom: 10px;
        .progress {
          flex: 1;
          margin-right: 10px;
          cursor: pointer;
        }
        .year {
          flex: 1;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
