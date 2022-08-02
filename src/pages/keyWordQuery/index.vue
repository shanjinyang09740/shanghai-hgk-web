<template>
  <div class="contentKey">
    <div class="noDataShow" v-if="!isShowIn && !isShowWh">
      <div class="nodataMain">
        <img :src="require('./images/nodata.png')" />
        <div>
          没有找到<span>{{ ` “${keyWords}” ` }}</span
          >相关数据
        </div>
      </div>
    </div>
    <div v-else class="contentDown">
      <fu-tabs v-model="activeName">
        <fu-tab-pane v-if="isShowIn" label="指标数据" name="zhbsj">
          <fu-table :fu-data="inTable.data" stripe style="width: 100%">
            <template v-for="(column, index) in inTable.columns">
              <fu-table-column
                v-if="column.vIf"
                show-overflow-tooltip
                :key="column.prop"
                :label="column.label"
                :prop="column.prop"
                :sortable="column.sortable ? true : false"
                :min-width="column.width"
                :filters="column.filters ? column.filters : null"
                :column-key="column.columnKey"
                filter-placement="bottom"
              >
                <template slot-scope="scope">
                  <span v-if="column.label == '指标名称'">
                    <span @click="jumpDetail(scope.row)" class="zbName">{{
                      scope.row[column.prop]
                    }}</span>
                  </span>
                  <span v-else-if="column.label == '报告期'">
                    <span v-if="scope.row[column.prop].length > 5"
                      >{{ scope.row[column.prop].substring(0, 4) }}年{{
                        scope.row[column.prop].substring(4, 6)
                      }}月</span
                    >
                    <span v-else
                      >{{ scope.row[column.prop].substring(0, 4) }}年</span
                    >
                  </span>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
              </fu-table-column>
            </template>
          </fu-table>
          <fu-pagination
            style="text-align:right;margin:10px 35px 0 0"
            layout="total, sizes, prev, pager, next, jumper"
            ref="page"
            :page-size="inTable.data.pagerows"
            :page-sizes="[5, 10, 20, 50]"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :fu-request="tableReq"
          ></fu-pagination>
        </fu-tab-pane>
        <fu-tab-pane v-if="isShowWh" label="整表数据" name="zbsj">
          <fu-table :fu-data="whTable.data" stripe style="width: 100%">
            <template v-for="(column, index) in whTable.columns">
              <fu-table-column
                v-if="column.vIf"
                show-overflow-tooltip
                :key="column.prop"
                :label="column.label"
                :prop="column.prop"
                :sortable="column.sortable ? true : false"
                :min-width="column.width"
                :filters="column.filters ? column.filters : null"
                :column-key="column.columnKey"
                filter-placement="bottom"
              >
                <template slot-scope="scope">
                  <span v-if="column.label == '查看'">
                    <span @click="jumpDetails(scope.row)" class="chakan-label"
                      >查看</span
                    >
                  </span>
                  <span v-else-if="column.label == '主题分类'">
                    {{ scope.row[column.prop] }}
                  </span>
                  <span v-else-if="column.label == '报告期'">
                    {{ scope.row[column.prop].substring(0, 4) }}年
                  </span>
                  <span v-else-if="column.label == '发布时间'">
                    {{ scope.row[column.prop] }}
                  </span>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </template>
              </fu-table-column>
            </template>
          </fu-table>
          <fu-pagination
            style="text-align:right;margin:10px 35px 0 0"
            layout="total, sizes, prev, pager, next, jumper"
            ref="page"
            :page-size="whTable.data.pagerows"
            :page-sizes="[5, 10, 20, 50]"
            @current-change="whhandleCurrentChange"
            @size-change="whhandleSizeChange"
            :fu-request="whTableReq"
          ></fu-pagination>
        </fu-tab-pane>
      </fu-tabs>
    </div>
  </div>
</template>

<script>
import {
  Table,
  Pagination,
  TableColumn,
  Tabs,
  TabPane,
  Loading,
} from "fusion-ui";
import { postJSON } from "@/utils/post.js";
import { REQ } from "@/service/requestUrl";
export default {
  name: "keyWordQuery",
  components: {
    FuTabPane: TabPane,
    FuTabs: Tabs,
    FuTable: Table,
    FuPagination: Pagination,
    FuTableColumn: TableColumn,
  },
  props: [],
  data() {
    return {
      showLoading: null,
      pageLoading: Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".content"),
      }),
      activeName: "zhbsj",
      keyWords: "",
      searchListData: [],
      inTable: {
        columns: [
          {
            vIf: true,
            prop: "rownum",
            label: "序号",
            width: "3%",
          },
          {
            vIf: true,
            prop: "publishIndctLabel",
            label: "指标名称",
            width: "10%",
          },
          {
            vIf: true,
            prop: "themeLabel",
            label: "主题名称",
            width: "6%",
          },
          {
            vIf: true,
            prop: "bgq",
            label: "报告期",
            width: "6%",
          },
          {
            vIf: true,
            prop: "addrlable",
            label: "地区",
            width: "6%",
          },
          {
            vIf: true,
            prop: "indctdata",
            label: "指标值",
            width: "6%",
          },
        ],
        data: {
          rows: [],
          page: 1,
          pagerows: 10,
          totalrows: 0,
          sortName: "",
          sortFlag: "",
        },
      },
      whTable: {
        columns: [
          {
            vIf: true,
            prop: "rownum",
            label: "序号",
            width: "3%",
          },
          {
            vIf: true,
            prop: "instrumentName",
            label: "整表名称",
            width: "6%",
          },

          {
            vIf: true,
            prop: "fillOrgName",
            label: "填报机构",
            width: "6%",
          },
          {
            vIf: true,
            prop: "instrumentScheme",
            label: "主题分类",
            width: "6%",
          },
          {
            vIf: true,
            prop: "bgq",
            label: "报告期",
            width: "6%",
          },
          {
            vIf: true,
            prop: "updateTime",
            label: "发布时间",
            width: "6%",
          },
          {
            vIf: true,
            prop: "look",
            label: "查看",
            width: "6%",
          },
        ],
        data: {
          rows: [],
          page: 1,
          pagerows: 10,
          totalrows: 0,
          sortName: "",
          sortFlag: "",
        },
      },
      isShowIn: true,
      isShowWh: true,
    };
  },
  computed: {
    // 表格数据请求响应式数据
    tableReq() {
      return {
        url: REQ.queryVariableHtmlByLable,
        params: [
          { vtype: "attr", name: "sjgsd", data: "46" },
          { vtype: "attr", name: "publishLable", data: this.keyWords },
          {
            vtype: "pagination",
            name: "pagerows",
            data: this.inTable.data.pagerows,
          },
          {
            vtype: "pagination",
            name: "totalrows",
            data: this.inTable.data.totalrows,
          },
          { vtype: "pagination", name: "page", data: this.inTable.data.page },
        ],
      };
    },
    whTableReq() {
      return {
        url: REQ.queryHtmlByLable,
        params: [
          { vtype: "attr", name: "sjgsd", data: "46" },
          { vtype: "attr", name: "publishLable", data: this.keyWords },
          {
            vtype: "pagination",
            name: "pagerows",
            data: this.whTable.data.pagerows,
          },
          {
            vtype: "pagination",
            name: "totalrows",
            data: this.whTable.data.totalrows,
          },
          { vtype: "pagination", name: "page", data: this.whTable.data.page },
        ],
      };
    },
  },
  watch: {
    $route() {
      this.keyWords = this.$route.query.keyWords;
      this.initInTable();
      this.initAllTable();
    },
  },
  beforeCreate() {},
  created() {
    if (this.$route.query.keyWords) {
      this.keyWords = this.$route.query.keyWords;
    }
    this.initInTable();
    this.initAllTable();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //初始化判断值是否相等
    initInTable() {
      const loading1 = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".contentKey"),
      });
      postJSON(REQ.queryVariableHtmlByLable, {
        postData: JSON.stringify({
          data: [
            { vtype: "attr", name: "sjgsd", data: "46" },
            { vtype: "attr", name: "publishLable", data: this.keyWords },
            {
              vtype: "pagination",
              name: "pagerows",
              data: this.inTable.data.pagerows,
            },
            {
              vtype: "pagination",
              name: "totalrows",
              data: this.inTable.data.totalrows,
            },
            { vtype: "pagination", name: "page", data: this.inTable.data.page },
          ],
        }),
      })
        .then((res) => {
          loading1.close();
          if (res.data[0].data.rows && res.data[0].data.rows.length > 0) {
            this.isShowIn = true;
            this.inTable.data = res.data[0].data;
          } else {
            this.isShowIn = false;
          }
        })
        .catch((err) => {
          loading1.close();
          this.isShowIn = false;
        });
    },
    initAllTable() {
      const loading2 = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        target: document.querySelector(".contentKey"),
      });
      postJSON(REQ.queryHtmlByLable, {
        postData: JSON.stringify({
          data: [
            { vtype: "attr", name: "sjgsd", data: "46" },
            { vtype: "attr", name: "publishLable", data: this.keyWords },
            {
              vtype: "pagination",
              name: "pagerows",
              data: this.whTable.data.pagerows,
            },
            {
              vtype: "pagination",
              name: "totalrows",
              data: this.whTable.data.totalrows,
            },
            { vtype: "pagination", name: "page", data: this.whTable.data.page },
          ],
        }),
      })
        .then((res) => {
          loading2.close();
          if (res.data[0].data.rows && res.data[0].data.rows.length > 0) {
            this.isShowWh = true;
            this.whTable.data = res.data[0].data;
          } else {
            this.isShowWh = false;
          }
        })
        .catch((err) => {
          loading2.close();
          this.isShowWh = false;
        });
    },
    //跳转详情页
    jumpDetail(obj) {
      if (obj.themeCode === "sjnd") {
        this.$router.push({
          path: "/publishingIndicatorSearch/ndsj",
          query: {
            themeCode: obj.themeCode,
            folderId: obj.folderID,
          },
        });
      } else if (obj.themeCode === "sjjd") {
        this.$router.push({
          path: "/publishingIndicatorSearch/jdsj",
          query: {
            themeCode: obj.themeCode,
            folderId: obj.folderID,
            type: "jd",
          },
        });
      } else {
        this.$router.push({
          path: "/publishingIndicatorSearch/jdsj",
          query: {
            themeCode: obj.themeCode,
            folderId: obj.folderID,
            type: "yd",
          },
        });
      }
    },
    jumpDetails(obj) {
      let postData = `{data: [{ vtype: "attr", name: "taskId", data: "${obj['taskId']}" }]}`;
      postJSON("/api/dqpublish/v1/relaeseVariable/queryHtmlBytaskId.do", {
        postData: postData,
      }).then(res => {
        let result = res["data"][0]["data"];
        this.$router.push({
          name: "instrumentDetail",
          params: {
            html: result,
            reportNo: obj.reportNo,
            bgq: obj.bgq,
          },
        });
      });
    },
    // 分页方法
    handleCurrentChange(val) {
      this.inTable.data.page = val;

      this.initInTable();
    },
    handleSizeChange(val) {
      this.inTable.data.pagerows = val;

      this.initInTable();
    },
    // 分页方法
    whhandleCurrentChange(val) {
      this.whTable.data.page = val;

      this.initAllTable();
    },
    whhandleSizeChange(val) {
      this.whTable.data.pagerows = val;

      this.initAllTable();
    },
    //检索事件
    keywordSearch(words) {
      if (words && typeof words === "string") {
        this.keyWords = words;
        this.initInTable();
        this.initAllTable();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.zbName {
  cursor: pointer;
}
.zbName:hover {
  color: #1494ff;
}
.nodataMain {
  text-align: center;
  span {
    color: #3091f2;
  }
}
.contentKey {
  width: 100%;
  min-height: 500px;
  .noDataShow {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .contentUp {
    display: flex;
    justify-content: center;
    padding: 50px 0 30px 0;
    border-bottom: 1px dashed #ccc;
    .search {
      display: flex;
      flex-direction: column;
      .el-button--primary {
        margin-left: -1px;
      }
      .searchUp {
        display: flex;
        .el-input {
          width: 360px;
        }
      }
      .searchDown {
        color: #666;
        font-size: 14px;
        display: flex;
        align-items: center;
        padding-top: 10px;
        .perSearchWords {
          cursor: pointer;
          padding: 8px;
          background-color: #1b7fd7;
          margin-right: 5px;
          border-radius: 5px;
          color: #fff;
        }
      }
    }
  }
  .contentDown {
    border-bottom: 1px dashed #ccc;
    padding: 30px 30px 38px;
    .chakan-label {
      &:hover {
        background: #1494ff;
        color: #fff;
      }
      display: inline-block;
      width: 77px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      border: 1px solid #dfdfdf;
      font-size: 14px;
      color: #1494ff;
      margin: 0 auto;
      cursor: pointer;
    }
    .dataTableTitle {
      font-size: 18px;
      font-family: "Microsoft YaHei";
      color: #333;
      border-left: 3px solid #3091f2;
      padding-left: 5px;
      margin-bottom: 15px;
    }
  }
}
</style>
