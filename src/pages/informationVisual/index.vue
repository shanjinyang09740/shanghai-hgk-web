<template>
  <div class="visualProducts">
    <div class="widget-themedata">
      <div class="widget-themedata-items clearfix">
        <div
          v-for="(item, index) in sjcpData"
          class="widget-themedata-visualItem"
          @click="jumpDetail(item)"
        >
          <div class="widget-themedata-visualItem-img">
            <img :src="item.indexPicture" alt="" />
          </div>
          <div class="widget-themedata-visualItem-title">
            <span class="widget-themedata-visualItem-title-label visualName">{{
              item.title
            }}</span>
            <div class="widget-themedata-visualItem-time">
              <span>{{ item.updateTime.substring(0, 10) }}</span>
            </div>
          </div>
        </div>
      </div>
      <fu-pagination
        big
        background
        style="text-align:center;margin:10px 35px 0 0"
        layout="prev, pager, next"
        ref="page"
        :page-sizes="[6]"
        @current-change="handleCurrentChange"
        :fu-request="tableReq"
      ></fu-pagination>
    </div>
  </div>
</template>

<script>
import { Pagination } from "fusion-ui";
import { postJSON } from "@/utils/post.js";
export default {
  components: { FuPagination: Pagination },
  data() {
    return {
      table: {
        data: {
          rows: [
            {
              createTime: "2020-05-23 09:36:17",
              folderId: "840d00a86e7e4d34bce9f7e134de13a5",
              id: "1590197776464",
              indexNum: 9,
              indexPicture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMA",
              title: "显示器",
              type: "visualAnalysis",
              updateTime: "2020-07-06 10:22:59",
              userName: "吴云阔",
            },
          ],
          page: 1,
          pagerows: 6,
          totalrows: 0,
          sortName: "",
          sortFlag: "",
        },
      },
      sjcpData: [],
    };
  },
  computed: {
    tableReq() {
      return {
        url: "/api/dqpublish/v1/fbkdataview/queryDataViewList.do",
        params: [
          {
            name: "folderId",
            vtype: "attr",
            data: "840d00a86e7e4d34bce9f7e134de13a5",
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
  created() {
    this.changeData();
  },
  methods: {
    //跳转详情页
    jumpDetail(obj) {
      this.$router.push({
        name: "kshxxDetail",
        query: {
          src: "/vs/#/previewCanvas?modelFileId=" + obj.id,
        },
      });
    },
    handleCurrentChange(val) {
      this.table.data.page = val;
      this.changeData();
    },
    changeData() {
      postJSON("/api/dqpublish/v1/fbkdataview/queryDataViewList.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "folderId",
              vtype: "attr",
              data: "840d00a86e7e4d34bce9f7e134de13a5",
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
          console.log(res);
          this.sjcpData = res.data[0].data.rows;
          // this.allTotalRows = res.data[0].data.totalrows;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.visualProducts {
  width: 1200px;
  .widget-themedata {
    margin: 0 20px;
    padding-bottom: 20px;
    .widget-themedata-items {
      margin-top: 40px;
      .widget-themedata-visualItem {
        float: left;
        width: 373px;
        height: 300px;
        overflow: hidden;
        margin: 0 20px 20px 0;
        box-shadow: -5px 5px 10px -4px #e3e4e5, 5px 5px 10px -4px #e3e4e5;
        border-radius: 3px 3px;
        &:hover {
          background: #d5eaf982;
          cursor: pointer;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
        .widget-themedata-visualItem-img {
          height: 260px;
          padding: 5px;
          text-align: center;
          box-sizing: border-box;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .widget-themedata-visualItem-title {
          padding: 0 5px;
          line-height: 35px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-top: 1px solid #f1f1f1;
          display: flex;
          align-items: center;
          &:hover {
            .visualName {
              color: #1492ff;
            }
          }
          .visualName {
            width: 250px;
            line-height: 35px;
            text-align: left;
            font-family: Microsoft YaHei;
            color: #333;
            font-size: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            display: inline-block;
          }
          .widget-themedata-visualItem-time {
            color: #999;
            display: inline-block;
            font-size: 16px;
            font-family: Helvetica;
            // float: right;
          }
        }
      }
    }
  }
}
</style>
