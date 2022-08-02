<template>
  <div class="allTable-container">
    <div class="tabs-container">
      <div class="tabs-left-con">
        <div class="tabs-left-con-title">
          统计信息
        </div>
        <div class="tabs-left-con-list">
          <div>
            <div
              v-for="(item, index) in title"
              class="tabs-left-con-list-item"
              :class="
                index == active.index ? 'tabs-left-con-list-item-active' : ''
              "
              :style="{ borderColor: item.color }"
              @click="changeTitle(index)"
            >
              <img style="width:24px;height:22px" :src="item.icon" alt="" />
              <span class="tabs-left-con-click">{{ item.sjjdName }}</span>
              <span class="tabs-left-con-flot">{{ item.typeCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="tabs-right-con">
        <div class="tabs-right-con-title">
          <span class="title-con">{{ active.sjjdName }}</span>
          <span class="title-text"
            >共找到<span class="title-num">{{ allTotalRows }}</span
            >个{{ active.sjjdName }}</span
          >
        </div>
        <div class="tabs-right-con-list" style="padding-bottom:10px">
          <div
            class="tabs-right-con-list-con"
            v-for="(item, index) in sjcpData"
          >
            <div class="tabs-right-con-list-con-title">
              <span
                v-if="index == 0"
                class="tabs-right-con-list-con-title-bac"
              ></span>
              <span
                v-if="index == 1"
                style="background:orange"
                class="tabs-right-con-list-con-title-bac"
              ></span>
              <span
                v-if="index == 2"
                style="background:#66CCFF"
                class="tabs-right-con-list-con-title-bac"
              ></span>
              <span
                v-if="index > 2"
                style="background:#999"
                class="tabs-right-con-list-con-title-bac"
              ></span>
              {{ item.name }}
            </div>
            <div class="tabs-right-con-list-con-time">
              {{ item.publishTime | substringStr }}
            </div>
            <div class="tabs-right-con-list-con-content">{{ item.intro }}</div>
            <div @click="jumpDetail(item)" class="tabs-right-con-list-con-ito">
              查看详情
            </div>
          </div>
          <fu-pagination
            background
            v-if="allTotalRows - 0 > 10"
            style="text-align:right;margin:10px 35px 0 0"
            layout="total, prev, pager, next, jumper"
            ref="page"
            :page-sizes="[10]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :fu-request="tableReq"
          ></fu-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Table, Pagination, TableColumn } from "fusion-ui";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl.js";
export default {
  name: "",
  components: {
    FuTable: Table,
    FuPagination: Pagination,
    FuTableColumn: TableColumn,
  },
  // extends: null,
  // minxins: [],
  props: [],
  data() {
    return {
      sjjd_type: "1",
      allTotalRows: 0, //总共数量
      active: {
        index: 0,
        sjjdName: "统计公报",
      },
      //左侧菜单栏数据
      title: [],
      sjcpData: {},
      // 表格数据
      table: {
        data: {
          page: 1,
          pagerows: 10,
          totalrows: 0,
          sortName: "",
          sortFlag: "",
        },
      },
      iconArr: [
        {
          type: "1",
          icon: require("@/assets/images/tjxx/sjjd.png"),
          color: "#3091F2",
        },
        {
          type: "2",
          icon: require("@/assets/images/tjxx/tjnb.png"),
          color: "#FF9900",
        },
        {
          type: "3",
          icon: require("@/assets/images/tjxx/tjgb.png"),
          color: "#008b8b",
        },
        {
          type: "4",
          icon: require("@/assets/images/tjxx/jdsj.png"),
          color: "#19A05F",
        },
      ],
    };
  },
  filters: {
    substringStr: function(value) {
      if (value && value.length > 10) {
        value = value.substring(0, 10);
      }
      return value;
    },
  },
  computed: {
    // 表格数据请求响应式数据
    tableReq() {
      return {
        url: REQ.pageQueryHGKSjjd,
        params: [
          {
            name: "formpanel",
            vtype: "formpanel",
            data: { ssdw_code: "", sjjd_type: this.sjjd_type, title: "" },
          },
          {
            vtype: "pagination",
            name: "pagerows",
            data: this.table.data.pagerows,
          },
          {
            vtype: "pagination",
            name: "totalrows",
            data: this.table.data.totalrows,
          },
          { vtype: "pagination", name: "page", data: this.table.data.page },

          {
            vtype: "pagination",
            name: "sortName",
            data: "",
          },
          {
            vtype: "pagination",
            name: "sortFlag",
            data: "",
          },
          {
            vtype: "pagination",
            name: "descStr",
            data: "desc",
          },
        ],
      };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    this.getTitleList();
    this.pageQueryHGKSjjd();
    if (this.$route.query.index) {
      this.active.index = this.$route.query.index - 0;
    }
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //跳转详情页面
    jumpDetail(data) {
      // window.open(obj.contentUrl);
      window.open(
        `/analysisReport/report/previewReport.html?id=${data.id}&tag=1`,
        "_blank"
      );
      // window.location.href = obj.contentUrl;
      // this.$router.push({
      //   path: "/statisticsQuery/tjDetail",
      //   query: { obj, obj },
      // });
    },
    //获取左侧菜单栏的接口
    getTitleList() {
      postJSON(REQ.queryCqHGKSjjdTypeList)
        .then((res) => {
          this.title = res.data[0].data.rows;
          this.title.forEach((item, index) => {
            let findItem = this.iconArr.find(
              (iconItem) => item.sjjdType === iconItem.type
            );
            this.title[index].icon = findItem.icon;
            this.title[index].color = findItem.color;
          });
          // this.title[0].icon = require("@/assets/images/tjxx/tjgb.png");
          // this.title[1].icon = require("@/assets/images/tjxx/sjjd.png");
          // this.title[2].icon = require("@/assets/images/tjxx/tjnb.png");
          // this.title[3].icon = require("@/assets/images/tjxx/jdsj.png");
          // this.title[1].color = "#3091F2";
          // this.title[2].color = "#FF9900";
          // this.title[3].color = "#19A05F";
          // this.title[0].color = "#008b8b";
          this.active.sjjdName = this.title[this.active.index].sjjdName;
        })
        .catch((err) => {});
    },
    computedIndex(index) {
      return (this.table.data.page - 1) * this.table.data.pagerows + index + 1;
    },
    //切换左侧菜单栏
    changeTitle(index) {
      this.table.data.page = 1;
      this.active = {
        index: index,
        sjjdName: this.title[index].sjjdName,
      };
      if (this.sjjd_type !== this.title[index].sjjdType) {
        this.sjjd_type = this.title[index].sjjdType;
        this.pageQueryHGKSjjd();
      }
    },
    // 分页方法
    handleCurrentChange(val) {
      this.table.data.page = val;
      this.pageQueryHGKSjjd();
    },
    handleSizeChange(val) {
      this.table.data.pagerows = val;
      this.pageQueryHGKSjjd();
    },
    // 表格复选id
    handleSelectionChange(val) {
      let selections = [];
      val.forEach((item) => {
        selections.push(item.id);
      });
      this.selectIdList = selections;
      console.log(selections);
    },
    //表格数据请求
    pageQueryHGKSjjd() {
      postJSON(REQ.pageQueryHGKSjjd, {
        postData: JSON.stringify({
          data: [
            {
              name: "formpanel",
              vtype: "formpanel",
              data: { ssdw_code: "", sjjd_type: this.sjjd_type, title: "" },
            },
            {
              vtype: "pagination",
              name: "pagerows",
              data: this.table.data.pagerows,
            },
            {
              vtype: "pagination",
              name: "totalrows",
              data: this.table.data.totalrows,
            },
            { vtype: "pagination", name: "page", data: this.table.data.page },

            {
              vtype: "pagination",
              name: "sortName",
              data: "",
            },
            {
              vtype: "pagination",
              name: "sortFlag",
              data: "",
            },
            {
              vtype: "pagination",
              name: "descStr",
              data: "desc",
            },
          ],
        }),
      })
        .then((res) => {
          this.sjcpData = res.data[0].data.rows;
          this.allTotalRows = res.data[0].data.totalrows;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.allTable-container {
  width: 1200px;
  margin: 0 auto;
  .tabs-container {
    background-color: #f5f7f9;
    .tabs-left-con {
      width: 218px;
      float: left;
      height: 100%;
      .tabs-left-con-title {
        width: 100%;
        height: 55px;
        color: #333333;
        font-size: 20px;
        font-family: "Microsoft YaHei";
        text-align: center;
        line-height: 55px;
        border-bottom: #dbe1e7 1px solid;
      }
      .tabs-left-con-list {
        font-size: 14px;
        color: #333333;
        .tabs-left-con-list-item-active {
          background: #ffffff;
          border-left-width: 3px;
          border-left-style: solid;
          // border-left: 3px solid red;
        }
        .tabs-left-con-list-item {
          height: 55px;
          line-height: 55px;
          overflow: hidden;
          cursor: pointer;
          padding-left: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tabs-left-con-flot {
            color: #999999;
            font-size: 14px;
            font-family: "Microsoft YaHei";
            margin-right: 20px;
            float: right;
          }
          .tabs-left-con-click {
            display: inline-block;
            height: 100%;
            // padding-left: 56px;
            color: #333333;
            font-size: 14px;
            font-family: "Microsoft YaHei";
          }
        }
      }
    }
    .tabs-right-con {
      margin-left: 218px;
      width: 980px;
      min-height: 800px;
      background-color: #fff;
      .tabs-right-con-title {
        height: 55px;
        width: 100%;
        border-bottom: #dce2e8 1px solid;
        .title-con {
          font-size: 20px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 55px;
          padding-left: 25px;
        }
        .title-text {
          font-size: 12px;
          font-family: SimSun;
          color: #999999;
          padding-left: 15px;
          .title-num {
            font-size: 24px;
            font-family: Helvetica;
            color: #ff9900;
            padding: 0 5px;
          }
        }
      }
      .tabs-right-con-list-con:hover {
        background: #d5eaf982;
      }
      .tabs-right-con-list-con {
        height: 155px;
        width: 930px;
        padding-top: 5px;
        margin: 0 10px 0 20px;
        background-color: #fff;
        border-bottom: 1px solid #e6e6e6;
        .tabs-right-con-list-con-title {
          width: 90% !important;
          height: 36px;
          position: relative;
          padding-left: 7px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 36px;
          display: flex;
          align-items: center;
          .tabs-right-con-list-con-title-bac {
            width: 10px;
            height: 10px;
            background: red;
            margin-right: 10px;
          }
        }
        .tabs-right-con-list-con-content {
          height: 30px;
          width: 890px;
          line-height: 22px;
          color: #666666;
          font-size: 14px;
          padding: 15px 0 15px 30px;
          font-family: Microsoft YaHei;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
        .tabs-right-con-list-con-time {
          padding-left: 27px;
          font-size: 12px;
          font-family: Microsoft YaHei;
        }

        .tabs-right-con-list-con-ito {
          color: #1492ff;
          font-size: 12px;
          font-family: SunSim;
          padding-left: 27px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
