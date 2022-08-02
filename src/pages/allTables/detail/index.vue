<template>
  <div>
    <div class="tabLan">
      <div class="tabLanLeft">
        <div @click="backBefore" class="chakan-label btn-click">返回</div>
        <div @click="downExcal" class="dowload-label btn-click" style="margin-left:10px;">下载</div>
      </div>
      <div @click="backBefore" class="select-label btn-click">
        <el-select size="mini" @change="changeSelect" v-model="selectValue">
          <el-option
            v-for="(item, index) in dateList"
            :key="index"
            :label="item.text"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="all-con">
      <div id="con-box" v-html="html">{{ html }}</div>
    </div>
  </div>
</template>

<script>
import { REQ } from "@/service/requestUrl.js";
import { postJSON } from "@/utils/post.js";
export default {
  data() {
    return {
      html: this.$route.params.html,
      dateList: [],
      selectValue: this.$route.params.bgq,
    };
  },
  created() {
    this.queryBGQ();
  },
  methods: {
    backBefore() {
      window.history.back();
    },
    //获取报告期下拉框
    queryBGQ() {
      postJSON(REQ.queryInstrumentBGQ, {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "reportNo",
              data: this.$route.params.reportNo,
            },
            {
              vtype: "attr",
              name: "sjgsd",
              data: "46",
            },
            {
            vtype:"attr",
            name:"instrumentUrn",
            data:this.$route.params.instrumentUrn
        }
          ],
        }),
      })
        .then((res) => {
          this.dateList = res.data[0].data;
          console.log(res);
        })
        .catch((err) => {});
    },
    //下载
    downExcal() {
      window.open(
        `${REQ.downLoadBb}?instrumentNumber=${this.$route.params.reportNo}&dqCode=46&bgq=${this.selectValue}&instrumentUrn=${this.$route.params.instrumentUrn}&taskId=${this.$route.params.taskId}`
      );
    },
    changeSelect() {
      postJSON(REQ.getReportHtmlByCondition, {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "instrumentNumber",
              data: this.$route.params.reportNo,
            },
            {
              vtype: "attr",
              name: "dqCode",
              data: "46",
            },
            {
              vtype: "attr",
              name: "bgq",
              data: this.selectValue,
            },
            {
            vtype:"attr",
            name:"instrumentUrn",
            data:this.$route.params.instrumentUrn
        },
        {
            vtype:"attr",
            name:"taskId",
            data:this.$route.params.taskId
        }
          ],
        }),
      }).then((res) => {
        this.html = res.data[0].data;
      });
      console.log(this.selectValue);
    },
  },
};
</script>

<style lang="less" scoped>
.tabLan {
  padding: 10px 0 20px 0;
  display: flex;
  justify-content: space-between;
  .btn-click {
    display: inline-block;
    width: 77px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    border: 1px solid #dfdfdf;
    font-size: 14px;
    color: #1494ff;
    cursor: pointer;
  }
  .chakan-label {
    &:hover {
      background: #1494ff;
      color: #fff;
    }
  }
  .select-label {
    border: none;
    width: 150px;
  }
  .dowload-label {
    &:hover {
      background: #1494ff;
      color: #fff;
    }
  }
}
.all-con {
  padding: 10px 10px 0 0;
  margin: 0 auto;
  width: 1200px;
  height: 700px;
  overflow: auto;
  position: relative;
}
</style>
