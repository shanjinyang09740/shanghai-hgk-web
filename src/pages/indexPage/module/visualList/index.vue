<template>
  <div class="visualList">
    <div class="title">
      <span class="font20">可视化信息</span>
      <span class="moreLink font16" @click="moreRunAction">>></span>
    </div>
    <div class="visuanlListMain">
      <ul class="visualLun">
        <li v-for="(item, index) in visualListData" :key="index">
          <div class="visualItem" @click="perVisualClick(item)">
            <img :src="item.indexPicture" />
            <div class="visualDes">
              <span :title="item.title" class="visualDesWords ellipsis"
                >33333</span
              >
              <span class="visualDesTime">22222</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";
export default {
  name: "visualList",
  components: {},
  props: [],
  data() {
    return {
      imgPath: require("@/assets/images/visualData/visual-icon.png"),
      visualListData: [
        { indexPicture: require("@/assets/images/new/back-one.png") },
        { indexPicture: require("@/assets/images/new/back-two.png") },
        { indexPicture: require("@/assets/images/new/back-the.png") },
      ],
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
    //初始化数据
    initData() {
      postJSON(REQ.getHomePageVisualProduct)
        .then((res) => {
          if (res["data"]) {
          }
        })
        .catch((e) => {});
    },
    /**
     * @description 单个跳转点击事件
     * @param {Object} item
     */
    perVisualClick(item) {
      let herf = "";
      if (window.location.href.indexOf(".cn")) {
        herf = window.location.href.split(".cn")[0];
        window.open(herf + ".cn/vs/#/previewCanvas?modelFileId=" + item.id);
      } else if (window.location.href.indexOf(".com")) {
        herf = window.location.href.split(".com")[0];
        window.open(herf + ".com/vs/#/previewCanvas?modelFileId=" + item.id);
      }
    },
    /**
     * @description 左右轮播事件
     *
     */
    switchBanner(btn) {
      if (btn == "left") {
        this.visualListData.unshift(this.visualListData.pop());
      } else {
        this.visualListData.push(this.visualListData.shift());
      }
    },
    //更多跳转事件
    moreRunAction() {
      this.$router.push({
        path: "/informationVisual/kshxx",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.visualList {
  .title {
    // background-color: #f3f6f8;
    border-bottom: 3px solid #eee;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    position: relative;
    img {
      margin-right: 10px;
    }
    .moreLink {
      position: absolute;
      right: 10px;
      color: #999;
      cursor: pointer;
      &:hover {
        color: #2175c9;
      }
    }
  }
  .visuanlListMain {
    position: relative;
    .visualLun {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      margin-top: 26px;
      li {
        .visualItem {
          width: 389px;
          height: 211px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          cursor: pointer;
          img {
            width: 387px;
            display: block;
          }
          .visualDes {
            height: 44px;
            line-height: 44px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            padding: 0 5px;
            .visualDesWords {
              color: #015293;
            }
            .visualDesTime {
              color: #666;
            }
          }
        }
      }
    }
    .controlBtn {
      width: 30px;
      height: 60px;
      text-align: center;
      line-height: 60px;
      color: #999;
      background-color: #eeefff;
      position: absolute;
      top: 50%;
      margin-top: -30px;
      border-radius: 5px;
      font-size: 24px;
      cursor: pointer;
      font-weight: bolder;
      &:hover {
        background-color: #2175c9;
        color: #fff;
      }
      &.leftBtn {
        position: absolute;
        left: 0;
      }
      &.rightBtn {
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
