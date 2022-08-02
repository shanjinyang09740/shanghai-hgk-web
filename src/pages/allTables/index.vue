<template>
  <div class="zb-con">
    <div class="zb-con-top">
      <div
        v-for="(items, index1) in selectArr"
        :key="index1"
        class="zb-con-top-first"
      >
        <div class="zb-con-top-first-title">{{ items.title }}：</div>
        <div
          class="zb-con-top-first-list"
          :style="{ height: items.isShow ? 'auto' : '22px' }"
        >
          <div
            @click="changeIndex(index1, index2)"
            v-for="(item, index2) in items.list"
            :key="index2"
            class="zb-con-top-first-list-item"
            :class="
              items.select == item.value
                ? 'zb-con-top-first-list-item-select'
                : ''
            "
          >
            {{ item.text }}
          </div>
        </div>
        <div
          @click="changeTab(index1)"
          v-if="items.list.length > 7"
          class="zb-con-top-first-btn"
        >
          {{ items.isShow ? "收起" : "展开" }}
        </div>
      </div>
      <div class="zb-con-top-search">
        <el-form :inline="true" :model="formItem" class="demo-form-inline">
          <el-form-item label="报告期：">
            <!-- <el-date-picker
              size="mini"
              v-model="formItem.bgq"
              type="year"
              placeholder="选择报告期"
              value-format="yyyy"
            >
            </el-date-picker> -->
            <el-select
              size="mini"
              v-model="formItem.bgq"
              placeholder="选择报告期"
            >
              <el-option
                v-for="item in bgqList"
                :key="item.text"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报表名称：">
            <el-input
              size="mini"
              v-model="formItem.instrumentName"
              placeholder="请输入报表名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="onSubmit"
              >查询</el-button
            >
            <el-button size="mini" type="primary" @click="resetForm"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <fu-table
        :fu-request="tableReq"
        :data="table.data"
        stripe
        style="width: 100%;padding:0 20px;box-sizing:border-box"
        :show-header="false"
      >
        <fu-table-column
          type="index"
          label="序号"
          align="center"
          width="70"
          :index="computedIndex"
        >
        </fu-table-column>
        <template v-for="(column, index) in table.columns">
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
              <span v-if="column.label == '用户名称'">
                <span class="tableName" @click="jumpDetail(scope.row)">{{
                  scope.row[column.prop]
                }}</span>
              </span>
              <span v-else-if="column.label == '名称'">
                填报单位：
                {{ scope.row[column.prop] }}
              </span>
              <span v-else-if="column.label == '报告期'">
                报告期：{{ scope.row[column.prop].substring(0, 4) }}年
              </span>
              <span v-else-if="column.label == '发布日期'">
                发布日期：{{ scope.row[column.prop] }}
              </span>
              <span v-else-if="column.label == '查看'">
                <span @click="jumpDetail(scope.row)" class="chakan-label"
                  >查看</span
                >
              </span>
              <span v-else>{{ scope.row[column.prop] }}</span>
            </template>
          </fu-table-column>
        </template>
      </fu-table>
      <fu-pagination
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
</template>

<script>
import { REQ } from "@/service/requestUrl.js";
import { postJSON } from "@/utils/post.js";
import { Table, TableColumn, Pagination } from "fusion-ui";
export default {
  name: "macroVariableQuery",
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
  },
  props: [],
  data() {
    return {
      dcxm:
        this.$route.meta.title === "整表数据"
          ? "urn:ddi:A46:905a7b86-ad3c-4ed5-b80a-98588edc2ebf:1,urn:ddi:A50010:e0dd0f10-19c7-4924-957b-50dcbb999dc3:1,urn:ddi:Statistics:f360d81d-fcbd-437b-ae32-2843fb18f379:1,urn:ddi:Statistics:f360d81d-fcbd-437b-ae32-2843fb18f370:1"
          : "urn:ddi:A46:410b2ef4-366b-49d4-a057-7bd72f92d629:1,urn:ddi:Statistics:cfb805dd-3e6c-4831-8f86-af9aca763ecb:1,urn:ddi:Statistics:c6355207-e9e4-4af9-9a6b-9bf9c03e207d:1,urn:ddi:Statistics:b6461345-3081-4bfb-8afb-0af9a80cae99:1,urn:ddi:Statistics:c955defc-eb39-465d-b9ee-c9d40dd9b987:1,urn:ddi:Statistics:30653570-7135-4bca-8a56-3686539f8632:1,urn:ddi:Statistics:94d57fe0-1e8d-43c6-bf9e-c2848b21816e:1,urn:ddi:Statistics:573f2e2a-3ece-47ca-a959-be2a6186e32c:1,urn:ddi:Statistics:858a7f31-c954-4f29-9be2-e2c3cefcb241:1,urn:ddi:Statistics:358c1404-46f2-4150-bbe4-18d288493fb5:1,urn:ddi:Statistics:4acd472a-6051-46cc-acc7-e4c41a85eef5:1,urn:ddi:Statistics:59c680a4-4549-448f-b0fc-5f54925661db:1",
      sjjd_type: "1",
      formItem: {
        instrumentName: "",
        bgq: "",
      },
      formInline: {
        studyGroup: "",
        studyUnit: "",
        instrumentScheme: "",
        bgq: "",
        instrumentName: "",
        // dcxm: "",
      },
      // isShow: false,
      table: {
        columns: [
          {
            vIf: true,
            prop: "instrumentName",
            label: "用户名称",
            width: "30%",
          },
          {
            vIf: true,
            prop: "fillOrgName",
            label: "名称",
            width: "20%",
          },
          {
            vIf: true,
            prop: "bgq",
            label: "报告期",
            width: "15%",
          },
          {
            vIf: true,
            prop: "updateTime",
            label: "发布日期",
            width: "25%",
          },
          {
            vIf: true,
            prop: "look",
            label: "查看",
            width: "10%",
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
      selectArr: [
        // {
        //   title: "调查项目",
        //   select: "",
        //   isShow: false,
        //   list: [
        //     {
        //       text: "普查",
        //       value: "urn:ddi:A46:410b2ef4-366b-49d4-a057-7bd72f92d629:1",
        //       id: "urn:ddi:A46:410b2ef4-366b-49d4-a057-7bd72f92d629:1",
        //     },
        //     {
        //       text: "整表",
        //       value: "urn:ddi:A46:905a7b86-ad3c-4ed5-b80a-98588edc2ebf:1",
        //       id: "urn:ddi:A46:905a7b86-ad3c-4ed5-b80a-98588edc2ebf:1",
        //     },
        //   ],
        // },
        {
          title: "调查制度",
          select: "",
          isShow: false,
          list: [],
        },
        {
          title: "调查任务",
          select: 0,
          isShow: false,
          list: [],
        },
        {
          title: "报表分组",
          select: 0,
          isShow: false,
          list: [],
        },
      ],
      bgqList: [],
    };
  },
  computed: {
    // 表格数据请求响应式数据
    tableReq() {
      return {
        url: REQ.searchAllTable,
        params: [
          //   studyGroup: "",
          // studyUnit: "",
          // instrumentScheme: "",
          {
            name: "instrumentName",
            vtype: "attr",
            data: this.formInline.instrumentName,
          },
          {
            vtype: "attr",
            name: "dcxm",
            data: this.dcxm,
          },
          { vtype: "attr", name: "sjgsd", data: "46" },
          {
            name: "studyUnit",
            vtype: "attr",
            data: this.formInline.studyUnit,
          },
          {
            name: "instrumentScheme",
            vtype: "attr",
            data: this.formInline.instrumentScheme,
          },
          {
            name: "studyGroup",
            vtype: "attr",
            data: this.formInline.studyGroup,
          },
          {
            name: "bgq",
            vtype: "attr",
            data: this.formInline.bgq,
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
    this.getSurveySystem();
    this.getqueryBGQ();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //获取报告期下拉查询/api/macrodata/v1/macroReportController/queryBGQ.do
    getqueryBGQ() {
      postJSON(REQ.queryBGQ)
        .then((res) => {
          this.bgqList = res.data[0].data;
        })
        .catch(() => {});
    },
    //跳转详情页
    jumpDetail(obj) {
      let metaName = this.$route.meta.name;
      if (metaName == "zbsj") {
        this.$router.push({
          name: "instrumentDetail",
          path: "/allTablesQuery/zbsjDetail",
          params: {
            html: obj.htmlData,
            reportNo: obj.reportNo,
            bgq: obj.bgq,
            instrumentUrn: obj.instrumentUrn,
            taskId: obj.taskId,
          },
        });
      } else if (metaName == "pcsj") {
        this.$router.push({
          name: "pcsjDetail",
          path: "/allTablesQuery2/pcsj",
          params: {
            html: obj.htmlData,
            reportNo: obj.reportNo,
            bgq: obj.bgq,
            instrumentUrn: obj.instrumentUrn,
            taskId: obj.taskId,
          },
        });
      }
    },
    // 切换分页表格index更新方法
    computedIndex(index) {
      return (this.table.data.page - 1) * this.table.data.pagerows + index + 1;
    },
    // 分页方法
    handleCurrentChange(val) {
      this.table.data.page = val;
    },
    handleSizeChange(val) {
      this.table.data.pagerows = val;
    },
    //重置变扭
    resetForm() {
      this.formItem = {
        instrumentName: "",
        bgq: "",
      };
      this.formInline = {
        studyGroup: "",
        studyUnit: "",
        instrumentScheme: "",
        bgq: "",
        instrumentName: "",
      };
    },
    //查询
    onSubmit() {
      this.formInline = {
        studyGroup: this.selectArr[0].select,
        studyUnit: this.selectArr[1].select,
        instrumentScheme: this.selectArr[2].select,
        bgq: this.formItem.bgq,
        instrumentName: this.formItem.instrumentName,
      };
    },
    changeIndex(index1, index2) {
      this.selectArr[index1].select = this.selectArr[index1].list[index2].value;

      if (index1 == 0) {
        this.formInline.studyGroup = this.selectArr[0].select;
        this.getSurveyGroup();
      } else if (index1 == 1) {
        this.formInline.studyUnit = this.selectArr[1].select;
        this.getSurveyTask();
      } else {
        this.formInline.instrumentScheme = this.selectArr[2].select;
      }
    },
    changeTab(index) {
      this.selectArr[index].isShow = !this.selectArr[index].isShow;
    },
    //调查制度接口
    getSurveySystem() {
      postJSON(REQ.getSurveySystem, {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "dcxm",
              data: this.dcxm,
            },
          ],
        }),
      })
        .then((res) => {
          this.selectArr[0].list = res.data[0].data;
          this.selectArr[0].select = res.data[0].data[0].value;
          this.getSurveyGroup();
        })
        .catch((err) => {});
    },
    //.调查任务查询接口
    getSurveyGroup() {
      postJSON(REQ.getSurveyGroup, {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "studyGroup",
              data: this.selectArr[0].select,
            },
            {
              vtype: "attr",
              name: "dcxm",
              data: this.dcxm,
            },
          ],
        }),
      })
        .then((res) => {
          this.selectArr[1].list = res.data[0].data;
          this.selectArr[1].select = res.data[0].data[0].value;
          this.getSurveyTask();
        })
        .catch((err) => {});
    },
    //.报告分组查询接口
    getSurveyTask() {
      postJSON(REQ.getSurveyTask, {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "studyUnit",
              data: this.selectArr[1].select,
            },
            {
              vtype: "attr",
              name: "dcxm",
              data: this.dcxm,
            },
          ],
        }),
      })
        .then((res) => {
          this.selectArr[2].list = res.data[0].data;
          this.selectArr[2].select = res.data[0].data[0].value;
          this.formInline = {
            studyGroup: this.selectArr[0].select,
            studyUnit: this.selectArr[1].select,
            instrumentScheme: this.selectArr[2].select,
            bgq: this.formItem.bgq,
            instrumentName: this.formItem.instrumentName,
          };
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="less" scoped>
.zb-con {
  width: 1200px;
  margin: 0 auto;
  .zb-con-top {
    width: 100%;
    overflow: auto;
    padding-bottom: 20px;
    .zb-con-top-first {
      &:first-child {
        margin-top: 20px;
      }
      padding: 10px 0px 0 0;
      padding-bottom: 0;
      font-family: Microsoft YaHei;
      position: relative;
      background-color: #fff;
      display: flex;
      align-items: center;
      .zb-con-top-first-title {
        display: inline-block;
        width: 90px;
        text-align: left;
        text-indent: 20px;
        font-size: 14px;
        color: #999;
        font-family: Microsoft YaHei;
        height: 32px;
        line-height: 32px;
        margin-left: 19px;
      }
      .zb-con-top-first-list {
        margin-right: 10px;
        padding: 2px 10px;
        border-radius: 2px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 6px;
        display: inline-block;
        width: 1000px;
        height: 28px;
        vertical-align: top;
        overflow: hidden;

        .zb-con-top-first-list-item-select {
          background: #3091f2;
          color: #fff;
        }
        .zb-con-top-first-list-item {
          &:hover {
            background: #3091f2;
            color: #fff;
          }
          display: inline-block;
          text-align: center;
          margin-right: 10px;
          padding: 2px 10px;
          border-radius: 2px;
          // float: left;
          cursor: pointer;
          list-style: none;
          font-size: 14px;
          font-family: "MicrosoftYaHei";
          white-space: wrap;
        }
      }
      .zb-con-top-first-btn {
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
      }
    }
    .zb-con-top-search {
      display: flex;
      align-items: center;
      height: 48px;
      background: #f5f7f9;
      margin: 10px 20px 0;
      border: 1px dashed #e8e8e8;
      justify-content: flex-end;
      .demo-form-inline {
        height: 100%;
        box-sizing: border-box;
        padding: 5px 0;
      }
      .zb-con-top-search-btn {
        color: #fff;
        font-size: 14px;
        width: 66px;
        box-sizing: border-box;
        text-align: center;
        height: 28px;
        line-height: 28px;
        background: #3091f2;
        border-radius: 4px;
      }
      input {
        width: 197px;
        height: 26px;
        display: block;
        margin-right: 20px;
        margin-left: 5px;
        // margin-left: auto;
      }
    }
    .tableName {
      font-size: 16px;
      color: #1492ff;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      font-family: Microsoft YaHei;
    }
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
    .zb-con-lists {
      .zb-con-lists-item {
        &:hover {
          background: #e5f3ff;
        }
        display: flex;
        align-items: center;
        height: 80px;
        .zb-con-lists-item-label {
          display: inline-block;
          width: 85px;
          font-family: Helvetica Regular;
          font-size: 26px;
          color: #ff8000;
          text-align: center;
        }
        .zb-con-lists-item-name {
          display: inline-block;
          width: 435px;
          font-size: 16px;
          color: #1492ff;
          word-break: break-all;
          text-overflow: ellipsis;
          overflow: hidden;
          cursor: pointer;
          font-family: Microsoft YaHei;
        }
        .zb-con-lists-item-pro {
          display: inline-block;
          width: 270px;
          font-size: 14px;
          color: #333;
        }
        .zb-con-lists-item-click {
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
      }
    }
  }
}
</style>
