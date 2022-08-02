<template>
  <div class="app-wrapper">
    <div class="headerTop">
      <div class="headerTop-con">
        <div class="headerTop-con-left">欢迎进入宏观数据库</div>
        <div>
          <!-- <span class="header-con-right">数据分析系统</span> -->
          <span class="header-con-right" @click="jumpNavbar">后台管理系统</span>
        </div>
      </div>
    </div>

    <div class="headerMain banxin">
      <div class="headerCenter">
        <div class="logo">
          <img :src="logoImgPath" />
        </div>
        <div class="search">
          <div class="searchUp">
            <fu-input
              v-model="keyWords"
              prefix-icon="el-icon-search"
              placeholder="请输入关键词搜索"
              @keyup.enter.native="keywordSearch"
              clearable
            ></fu-input>
            <span @click="keywordSearch">搜索</span>
          </div>
          <div class="searchDown">
            <span
              style="
                color: #fff;
                background: #ed4646;
                padding: 2px;
                margin-right: 5px;
              "
              >统计热词:</span
            >
            <template v-for="(item, index) in searchListData">
              <span
                v-if="index < 4"
                class="perSearchWords"
                @click="keywordSearch(item.label)"
              >
                {{ item.label }}
              </span>
            </template>
          </div>
        </div>
      </div>
      <div class="headNav">
        <fu-menu
          :default-active="activeId"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <fu-menu-item
            v-for="(item, index) in menu"
            :key="item.id"
            :index="item.id"
          >
            <div>
              <img :src="item.icon" /><span>{{ item.text }}</span>
              <i v-if="index < menu.length - 1" class="rightBorder"></i>
            </div>
          </fu-menu-item>
        </fu-menu>
      </div>
    </div>
    <div class="contentMain banxin">
      <app-main :menu="menu" @changeActiveId="changeActiveId" />
    </div>
    <div class="bottomContain">
      <page-bottom />
    </div>
  </div>
</template>

<script>
import { AppMain } from "./components";
import PageBottom from "./components/PageBottom";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";
import {
  Container,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Input,
  Button,
} from "fusion-ui";

export default {
  name: "Layout",
  components: {
    FuContainer: Container,
    FuHeader: Header,
    FuMain: Main,
    FuMenu: Menu,
    FuSubmenu: Submenu,
    FuMenuItemGroup: MenuItemGroup,
    FuMenuItem: MenuItem,
    FuInput: Input,
    FuButton: Button,
    AppMain,
    PageBottom,
  },
  data() {
    return {
      //选中导航菜单高亮
      activeId: "1",
      //logo图片路径
      logoImgPath: require("@/assets/images/new/LOGO.png"),
      //检索关键词
      keyWords: "",
      searchListData: [],
      //导航菜单
      menu: [
        {
          id: "1",
          text: "首页",
          icon: require("@/assets/images/new/sy.png"),
          path: "/home",
        },
        {
          id: "3",
          text: "进度数据",
          name: "jdsj",
          icon: require("@/assets/images/new/jdsj.png"),
          path: "/publishingIndicatorSearch/jdsj",
        },
        {
          id: "2",
          text: "年度数据",
          name: "ndsj",
          icon: require("@/assets/images/new/ndsj.png"),
          path: "/publishingIndicatorSearch/ndsj",
        },

        {
          id: "4",
          text: "整表数据",
          icon: require("@/assets/images/new/zbsj.png"),
          path: "/allTablesQuery/zbsj",
        },
        {
          id: "5",
          text: "普查数据",
          icon: require("@/assets/images/new/pcsj.png"),
          path: "/allTablesQuery2/pcsj",
        },
        {
          id: "6",
          text: "分析资料",
          icon: require("@/assets/images/new/sjjd.png"),
          path: "/statisticsQuery/tjxx",
        },
        {
          id: "7",
          text: "数据可视化",
          icon: require("@/assets/images/new/visualitationData-icon.png"),
          path: "/informationVisual/kshxx",
        },
      ],
      /**门户大背景图 begin*/
      currImgs: [],
      imgs: [
        require("@/assets/images/bannerBg/banner-one.jpg"),
        require("@/assets/images/bannerBg/banner-two.png"),
        require("@/assets/images/bannerBg/banner-three.jpg"),
      ],
      index: 0,
      /**门户大背景图 end*/
    };
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },
  mounted() {
    //初始化热词
    this.initHotDataList();
    this.currImgs = [this.imgs[0]];
    this.startChange();
  },
  methods: {
    //跳转navbar
    jumpNavbar() {
      window.open("/navbar/#/msite", "_blank");
    },
    //初始化热词
    initHotDataList() {
      this.searchListData = [];
      postJSON(REQ.hotListUrl).then((res) => {
        console.log("热词", res);

        let resultData = res["data"][0]["data"];
        if (resultData.length > 0) {
          resultData.forEach((item, index) => {
            if (index < 4) {
              this.searchListData.push(item);
            }
          });
        }
      });
    },
    //门户大背景图切换事件
    startChange: function() {
      var _this = this;
      setInterval(function() {
        if (_this.index < _this.imgs.length - 1) {
          _this.index++;
        } else {
          _this.index = 0;
        }
        _this.currImgs.splice(0, 1, _this.imgs[_this.index]);
      }, 30000);
    },
    //菜单change事件
    handleSelect(index, indexPath) {
      this.menu.some((item) => {
        if (index == item["id"]) {
          this.activeId = item["id"];
          this.$router.replace(item.path);
          return true;
        }
      });
    },
    //设置相应菜单高亮
    changeActiveId(id) {
      this.activeId = id;
    },
    //检索事件
    keywordSearch(words) {
      if (words && typeof words === "string") {
        this.keyWords = words;
      }
      if (!this.keyWords.match(/^[ ]*$/)) {
        //跳转至检索页面
        this.$router.push({
          path: "/keyWordQuery/search",
          query: {
            keyWords: this.keyWords,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
html,
body {
  overflow: auto;
  height: 100%;
  margin: 0;
  padding: 0;
}
.app-wrapper {
  height: 100%;
  .bg {
    width: 100%;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  .headerTop {
    height: 30px;
    background: #e6e6e6;
    .headerTop-con {
      height: 100%;
      width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #666;
      font-size: 14px;
    }
    .header-con-right {
      cursor: pointer;
      position: relative;
      margin-left: 20px;
      &::before {
        content: "";
        width: 5px;
        height: 5px;
        background: #666;
        position: absolute;
        left: -10px;
        top: 7px;
      }
    }
  }
  .headerCenter {
    height: 142px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 60px;
    .search {
      display: flex;
      flex-direction: column;
      .el-button--primary {
        margin-left: -1px;
      }
      .searchUp {
        display: flex;
        height: 40px;
        .el-input {
          width: 360px;
          input {
            border-radius: 4px;
          }
        }
        span {
          cursor: pointer;
          color: #fff;
          display: inline-block;
          background: #ed4646;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
      .searchDown {
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-top: 14px;
        .perSearchWords {
          cursor: pointer;
          margin-right: 5px;
        }
      }
    }
  }
  .contentMain {
    background-color: #fff;
    margin-bottom: 50px;
    min-height: e("calc(100vh - 429px)");
  }
  .el-menu {
    background-color: #2175c9;
    display: flex;
    flex-direction: row;
    .el-menu-item {
      font-size: 20px;
      color: #fff;
      text-align: center;
      flex: 1;
      display: flex;
      justify-content: center;
      position: relative;
      span {
        padding-left: 5px;
      }
      .rightBorder {
        position: absolute;
        right: 0;
        top: 18px;
        width: 2px;
        height: 27px;
        background-color: #fff;
      }
    }
  }
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background-color: #1c63ac;
    .rightBorder {
      visibility: hidden;
    }
  }
  .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    outline: 0;
    color: #fff;
  }
  .el-menu.el-menu--horizontal {
    border: 0;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 0;
    background-color: #1c63ac;
    .rightBorder {
      visibility: hidden;
    }
  }
}
.iframeMain {
  width: 100%;
  height: auto;
  border: none;
  background-color: #fff;
}
.bottomContain {
  width: 100%;
  background-color: #080605;
  opacity: 0.7;
}
</style>
