<template>
  <div class="all-con">
    <div class="label-con">
      <div class="label-con-top">
        <div class="label-con-title">
          专题数据
        </div>
        <span
          v-for="(item, index) in checkList"
          class="label-con-item"
          :class="select == index ? 'label-con-item-select' : ''"
          @click="checkSelect(index)"
          >{{ item.title }}</span
        >
        <!-- <span class="label-con-item label-con-item-select">年度数据</span> -->
      </div>
      <div class="label-con-bot">
        <div
          class="label-con-bot-all"
          style="width:100%;height:100%;overflow:hidden"
        >
          <span class="label-con-bot-item">222</span>
        </div>
      </div>
    </div>
    <div class="app-con">
      <div class="app-con-title">
        <img src="" alt="" />
        <div class="app-con-title-text">“数据海南”APP下载</div>
      </div>
      <div class="app-con-desc">
        <img src="@/assets/images/new/erweima.png" alt="" />
        <div class="app-con-desc-text">
          “数据海南”APP下载dsdsdasdsadqw都是的撒的撒都是大厦的的啊
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      select: 0,
      checkList: [{ title: "进度数据" }, { title: "年度数据" }],
    };
  },
  methods: {
    checkSelect(index) {
      this.select = index;
    },
  },
};
</script>

<style lang="less" scoped>
.all-con {
  display: flex;
  width: 100%;
  margin: 40px 0;
  .label-con {
    height: 248px;
    width: 867px;

    border-right: 1px dashed #999;
    position: relative;
    .label-con-top {
      display: flex;
      align-items: center;
      .label-con-title {
        color: #333;
        font-size: 22px;
        height: 40px;
        line-height: 40px;
        width: 116px;
        margin-right: 20px;
        background: rgba(47, 206, 212);
        text-align: center;
      }
      .label-con-item {
        display: inline-block;
        font-size: 18px;
        color: #333;
        margin-left: 20px;
        cursor: pointer;
        &:hover {
          color: #1985ce;
        }
      }
      .label-con-item-select {
        position: relative;
        &::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 29px;
          width: 0px;
          height: 0px;
          border-width: 12px;
          border-style: solid;
          border-color: #fff #fff #eee #fff;
        }
      }
    }
    .label-con-bot {
      margin-top: 20px;
      background: #eee;
      height: 188px;
      width: 858px;
      padding: 36px 29px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      .label-con-bot-all {
        .label-con-bot-item {
          width: 160px;
          font-size: 14px;
          color: #333;
          display: inline-block;
          height: 29px;
          line-height: 29px;
          cursor: pointer;
          &:hover {
            color: #2175c9;
          }
        }
      }
    }

    &::before {
      content: "";
      position: absolute;
      right: -6px;
      top: -10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1px solid #999;
    }
  }
  .app-con {
    width: 332px;
    box-sizing: border-box;
    padding: 0 30px 10px 30px;
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
  }
}
</style>
