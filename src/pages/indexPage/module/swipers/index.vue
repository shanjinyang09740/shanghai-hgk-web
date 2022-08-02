<template>
  <div
    class="swiper-con"
    :style="{
      background: 'url(' + require('@/assets/images/new/banner.png') + ')',
    }"
  >
    <div class="swiper-con-left">
      <div class="swiper-con-left-title">
        {{ titleList[activeIndex].title }}
      </div>
      <div class="swiper-con-left-text">
        {{ titleList[activeIndex].desc }}
      </div>
    </div>
    <!-- <div id="drawImg" class="drawImg"></div> -->
    <iframe
      class="drawImg"
      scrolling="no"
      :src="titleList[activeIndex].src"
      frameborder="0"
    ></iframe>
    <div class="btn-left swiper-btn" @click="changeIndex('left')"><</div>
    <div class="btn-right swiper-btn" @click="changeIndex('right')">></div>
  </div>
</template>

<script>
import drawListJs from "./js/drawList.js";
import { postJSON } from "@/utils/post.js";
export default {
  data() {
    return {
      titleList: [
        // {
        //   title: "地区生产总值",
        //   desc: "2021年第一季度全省地区生产总值1395.99亿元，同比增长19.8%。",
        // },
        {
          title: "地区生产总值",
          desc: "地区生产总值各季度累计值及同步增长率情况",
          src: "/vs/#/previewCanvas?modelFileId=1628662370780",
        },
        {
          title: "地方一般公共预算收入（亿元）",
          desc: "地方一般公共预算收入各季度绝对量及同步情况",
          src: "/vs/#/previewCanvas?modelFileId=1628662326736",
        },
        {
          title: "固定资产投资总额增长情况",
          desc: "固定资产投资总额各季度同比累计增长情况",
          src: "/vs/#/previewCanvas?modelFileId=1628662354245",
        },
      ],
      htmlData: [],
      activeIndex: 1,
    };
  },
  created() {},
  mounted() {
    // this.getHomePageVisualProduct();
  },
  methods: {
    //点击切换轮博图
    changeIndex(type) {
      if (this.activeIndex == 0 && type == "left") {
        this.activeIndex = this.titleList.length - 1;
      } else if (
        this.activeIndex == this.titleList.length - 1 &&
        type == "right"
      ) {
        this.activeIndex = 0;
      } else {
        switch (type) {
          case "left":
            this.activeIndex--;
            break;

          case "right":
            this.activeIndex++;
            break;
        }
      }
    },
    //获取echarts数据
    // getHomePageVisualProduct() {
    //   postJSON(
    //     "/api/macrodata/v1/hgk/visualProduct/getHomePageVisualProduct.do"
    //   )
    //     .then((res) => {
    //       this.htmlData = res.data[0].data;
    //       this.htmlData.forEach((item, index) => {
    //         if (item.content.length <= 1) {
    //           this.htmlData.splice(index, 1);
    //         }
    //       });
    //       this.initChart(
    //         this.htmlData[this.activeIndex].content[1].content,
    //         this
    //       );
    //     })
    //     .catch((err) => {});
    // },
    //初始化echarts图表
    // initChart(option, vm) {
    //   let getchart = vm.$echarts.init(document.getElementById("drawImg"));
    //   option && getchart.clear();
    //   getchart.setOption(option);
    //   //关闭loading
    //   // vm.loading.close();
    //   //随着屏幕大小调节图表
    //   window.addEventListener("resize", () => {
    //     getchart.resize();
    //   });
    // },
  },
  watch: {
    // activeIndex() {
    //   // if (this.htmlData[this.activeIndex].content.length > 1) {
    //   this.initChart(this.htmlData[this.activeIndex].content[1].content, this);
    //   // }
    // },
  },
};
</script>
<style lang="less" scoped>
.swiper-con {
  height: 460px;
  box-sizing: border-box;
  padding: 20px 60px;
  display: flex;
  justify-content: space-between;
  position: relative;
  .swiper-con-left {
    margin-top: 40px;
    height: 190px;
    width: 320px;
    color: #fff;
    border-left: 3px solid rgba(221, 51, 82);
    padding-left: 10px;
    .swiper-con-left-title {
      font-weight: 600;
      font-size: 28px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .swiper-con-left-text {
      font-size: 14px;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      -webkit-box-orient: vertical;
      line-height: 26px;
      margin-top: 10px;
    }
  }
  .swiper-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 90px;
    color: #eee;
    background: #999;
    line-height: 90px;
    text-align: center;
    font-size: 48px;
    cursor: pointer;
  }
  .swiper-btn:hover {
    background: #666;
  }
  .btn-left {
    left: -45px;
  }
  .btn-right {
    right: -45px;
  }
  .drawImg {
    width: 591px;
    height: 361px;
    margin-top: 30px;
    background: #fff;
  }
}
</style>
