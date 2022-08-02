<template>
  <div id="themeData" class="themeData">
    <div class="themeDataTitle">
      <img :src="titleImgPath" alt="" />
      <span class="font20" style="padding-left:5px;">数据主题</span>
      <div class="titleRight">
        <div
          :class="item.active ? 'active' : ''"
          v-for="(item, index) in themeData"
          :key="index"
          @click="themeCatogoryClick(item.themeCode)"
        >
          {{ item.themeLabel }}
        </div>
      </div>
    </div>
    <div class="themeDataMain">
      <template v-for="(item, index) in themeDataList">
        <div
          v-if="item.id"
          class="active"
          :title="item.folderLabel"
          @click="runAction(item)"
        >
          <img :src="item.folderLogo" />
          <div class="ellipsis" :title="item.folderLabel">
            {{ item.folderLabel }}
          </div>
        </div>
        <div v-else></div>
      </template>
    </div>
  </div>
</template>

<script>
import { REQ } from "@/service/requestUrl";
import { postJSON } from "@/utils/post.js";
import { arrDistinctByProp } from "@/utils/tool.js";
export default {
  name: "themeData",
  components: {},
  props: [],
  data() {
    return {
      titleImgPath: require("./images/theme-icon.png"),
      themeData: [
        {
          themeCode: "sjndsj",
          themeLabel: "年度",
        },
        {
          themeCode: "sjydsj",
          themeLabel: "季度",
        },
        {
          themeCode: "sjjdsj",
          themeLabel: "月度",
        },
      ],
      themeDataAllListObj: {},
      themeDataList: [],
      themeRowNum: 8,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
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
      this.themeData = [];
      let postData = {
        data: [{ vtype: "attr", name: "themeCodes", data: "sjndsj,sjydsj,sjjdsj" }],
      };
      postJSON(REQ.themeListUrl, { postData: JSON.stringify(postData) })
        .then((res) => {
          var resultData = res["data"][0]["data"];
          //获取themeCode
          if (resultData.length > 0) {
            let newArr = [];
            resultData.forEach((item) => {
              item["folderLogo"] = `data:image/png;base64,${item.folderLogo}`;
              newArr.push({
                themeCode: item["themeCode"],
              });
            });
            //过滤掉数组中相同的元素---数组去重
            let getThemeArr = arrDistinctByProp(newArr, "themeCode");
            this.themeData = getThemeArr.map((item, index) => {
              if (index == 0) {
                item.active = true;
              }
              switch(item.themeCode){
                case "sjndsj":
                  item.themeLabel = "年度";
                  break;
                case "sjydsj":
                  item.themeLabel = "季度";
                  break;
                case "sjjdsj":
                  item.themeLabel = "月度";
                  break;
              }
              return item;
            });
            //将各个数据主题进行分类存储
            this.themeData.forEach((item) => {
              let themeCode = item["themeCode"];
              let themeList = [];
              resultData.forEach((ele) => {
                if (ele["themeCode"] == themeCode) {
                  themeList.push(ele);
                }
              });
              this.themeDataAllListObj[themeCode] = themeList;
            });
            //默认显示选择第一个主题分类
            this.afrashListData(this.themeData[0]["themeCode"]);
          }
        })
        .catch((e) => {});
    },
    /**
     *@description 选中当前分类
     * @param {String} activeName
     */
    afrashThemeCatogory(activeName) {
      this.themeData = this.themeData.map((item, index) => {
        item["active"] = item["themeCode"] == activeName ? true : false;
        return item;
      });
      //渲染数据主题列表
      this.afrashListData(activeName);
    },
    //渲染数据主题列表
    afrashListData(activeName) {
      this.themeDataList = this.themeDataAllListObj[activeName]
        ? this.themeDataAllListObj[activeName]
        : [];

      //查看每行显示个数是否小于 themeRowNum, 若小于则补齐
      if (
        this.themeDataList.length > 0 &&
        this.themeDataList.length % this.themeRowNum != 0
      ) {
        for (
          let i = 0,
            len =
              this.themeRowNum - (this.themeDataList.length % this.themeRowNum);
          i < len;
          i++
        ) {
          this.themeDataList.push({
            id: "",
            text: "",
          });
        }
      }
    },
    //单个数据主题跳转事件
    runAction(item) {
      //跳转至指标查询界面
      this.$router.push({
        path: "/publishingIndicatorSearch/ndsj",
        params: {
          themeId: "1233",
        },
      });
    },
    /**
     *@description 分类点击事件
     * @param {String} name
     */
    themeCatogoryClick(name) {
      this.afrashThemeCatogory(name);
    },
  },
};
</script>

<style lang="less" scoped>
.themeData {
  .themeDataTitle {
    height: 40px;
    background-color: #f3f6f8;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-left: 10px;
    .titleRight {
      display: flex;
      padding-left: 30px;
      > div {
        padding: 5px 20px;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          background-color: #2196f3;
          color: #fff;
          border-radius: 5px;
        }
        &.active {
          background-color: #2196f3;
          color: #fff;
          border-radius: 5px;
        }
      }
    }
  }
  .themeDataMain {
    max-width: 1152px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    & > div {
      width: 143px;
      height: 115px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      img {
        width: 40px;
        height: 45px;
        margin-bottom: 10px;
      }
      > div {
        max-width: 90%;
      }
      &.active {
        cursor: pointer;
        &:hover {
          color: #2196f3;
        }
      }
    }
  }
}
</style>
