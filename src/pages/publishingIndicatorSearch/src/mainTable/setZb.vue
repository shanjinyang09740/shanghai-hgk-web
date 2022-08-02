<template>
  <div class="advancedData">
    <div class="advancedData-search-box">
      <div class="search-title">
        <div class="search-enter">
          <el-input
            type="text"
            placeholder="请输入查找的指标"
            suffix-icon="el-icon-search"
            v-model="filterListValue"
          >
          </el-input>
        </div>
        <span class="amount_left">共{{ this.checkListZB.length }}条</span>
        <div class="checks-more">
          <span class="unselected-btn" @click="selectAllLeft()">全选</span>
          <span class="unselected-btn" @click="cancelSelectAllLeft()"
            >反选</span
          >
        </div>
      </div>
      <div class="select-show">
        <div class="noDataText" v-show="this.checkListZB.length === 0">
          <p>指标选择区</p>
          <p>请在“左侧指标区域”选择指标</p>
        </div>
        <div class="groupTitle" v-show="this.checkListZB.length !== 0">
          <div id="indicatorName" class="indicatorName">{{ folderLabel }}</div>
        </div>
        <div class="groupTree">
          <div v-for="city in checkListZB" :key="city.indctId">
            <el-checkbox
              v-model="city.checked"
              :label="city.indctLabel"
              @change="
                (val) => {
                  change(val, city);
                }
              "
              :checked="city.checked"
              >{{ city.indctLabel }}</el-checkbox
            >
          </div>
        </div>
      </div>
    </div>
    <div class="advancedData-search-box">
      <div class="search-title">
        <div class="index-select-title">已选择指标</div>
        <span class="amount_left"
          >共{{ selectLength }}/共{{ this.checkList.length }}条</span
        >
        <div class="checks-more">
          <span class="selected-long" @click="deleteAllRight()">全删</span>
          <span class="selected-long" @click="deleteNoCheckedRight()"
            >删除未选项</span
          >
        </div>
      </div>
      <div class="select-show">
        <div class="noDataText" v-show="this.checkList.length === 0">
          <p>数据提取区</p>
          <p>选择指标后，点击“查询数据”</p>
        </div>
        <div class="groupTree" v-show="this.checkList.length !== 0">
          <div v-for="check in checkList" :key="check.indctId">
            <el-checkbox
              v-model="check.checked"
              :label="check.indctLabel"
              @change="
                (val) => {
                  change(val, check);
                }
              "
              :checked="check.checked"
              >{{ check.indctLabel }}</el-checkbox
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryVariableByFolderId } from "./../request";
import { CheckboxGroup, Checkbox, Loading } from "fusion-ui";
export default {
  props: {
    themeCode: {
      default: "",
      type: String,
    },
    folderId: {
      default: "",
      type: String,
    },
    folderLabel: {
      default: "",
      type: String,
    },
  },
  components: {
    ElCheckboxGroup: CheckboxGroup,
    ElCheckbox: Checkbox,
  },
  data() {
    return {
      checkList: [],
      ReqCheckList: [],
      filterListValue: "",
    };
  },
  computed: {
    checkListZB() {
      if (this.filterListValue !== "") {
        return this.ReqCheckList.filter((item) =>
          item.indctLabel.includes(this.filterListValue)
        );
      }
      return this.ReqCheckList;
    },
    selectLength() {
      if (this.checkList.length === 0) {
        return 0;
      }
      let data = this.checkList.filter((item) => item.checked);
      data.length > 0 ? this.$bus.emit("changeAdvanceBtnDisable", false) : this.$bus.emit("changeAdvanceBtnDisable", true);
      return data.length;
    },
  },
  watch: {
    folderId(val) {
      if (val !== "") {
        this.reqData();
      }
    },
    checkList(val) {
      if(val.length == 0){
        this.$bus.emit("changeAdvanceBtnDisable", true);
      }
    }
  },
  created() {
    this.reqData();
  },
  methods: {
    async reqData() {
      const loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        target: document.querySelector(".defineStyleContainerInSearch"),
      });
      try {
        let result = await queryVariableByFolderId(
          this.themeCode,
          this.folderId
        );
        result.data[0].data.forEach((element) => {
          element.checked = false;
        });
        this.ReqCheckList = result.data[0].data;
      } catch (error) {
        console.log(error);
      }
      loading.close();
    },
    change(val, check) {
      if (val === true) {
        check.checked = true;
        let index = this.checkList.findIndex(
          (item) => item.indctId === check.indctId
        );
        if (index === -1) {
          this.checkList.push(check);
        } else {
          this.checkList[index].checked = true;
        }
      } else {
        check.checked = false;
        let index = this.checkList.findIndex(
          (item) => item.indctId === check.indctId
        );
        if (index === -1) {
          // console.log("此时肯定有问题");
        } else {
          this.checkList[index].checked = false;
        }
      }
    },
    deleteNoCheckedRight() {
      for (let index = this.checkList.length - 1; index >= 0; index--) {
        const element = this.checkList[index];
        if (element.checked === false) {
          this.checkList.splice(index, 1);
        }
      }
    },
    deleteAllRight() {
      this.checkList.splice(0);
    },
    cancelSelectAllLeft() {
      this.checkListZB.forEach((element) => {
        this.change(false, element);
      });
    },
    selectAllLeft() {
      this.checkListZB.forEach((element) => {
        this.change(true, element);
      });
    },
  },
};
</script>

<style scoped lang="less">
.advancedData {
  display: flex;
  justify-content: space-between;
}
.advancedData-search-box {
  width: 49%;
  height: 711px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(231, 231, 231);
  border-image: initial;
  .search-title {
    height: 38px;
    background-color: rgb(240, 242, 250);
    vertical-align: middle;
    .search-enter {
      display: inline-block;
      width: 200px;
      font-size: 12px;
      font-family: SimSun;
      padding-left: 5px;
      /deep/ .el-input__suffix {
        display: flex;
        align-items: center;
      }
      /deep/ .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
    }
    .index-select-title {
      color: rgb(51, 51, 51);
      text-align: center;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      margin: 0 20px;
      line-height: 38px;
      display: inline-block;
    }

    .amount_left {
      display: inline-block;
      color: #b2b2b2;
      height: 38px;
      line-height: 38px;
      font-size: 12px;
      font-family: SimSun;
      margin-left: 10px;
    }
    .selected-long {
      margin-left: 10px;
      color: rgb(245, 108, 108);
      cursor: pointer;
      white-space: nowrap;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(245, 108, 108);
      border-image: initial;
      border-radius: 4px;
      padding: 0px 7px;
      &:hover {
        background-color: rgb(245, 108, 108);
        color: rgb(255, 255, 255);
      }
    }
    .checks-more {
      font-size: 12px;
      font-family: SimSun;
      float: right;
      margin-right: 15px;
      padding-top: 8px;
      color: rgb(48, 145, 242);
    }
    .unselected-btn {
      margin-left: 10px;
      cursor: pointer;
      white-space: nowrap;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(48, 145, 242);
      border-image: initial;
      border-radius: 4px;
      padding: 0px 10px;
      &:hover {
        background-color: rgb(48, 145, 242);
        color: rgb(255, 255, 255);
      }
    }
  }
  .select-show {
    width: 100%;
    max-height: 678px;
    .groupTree {
      height: 624px;
      box-sizing: border-box;
      padding: 10px;
      overflow: auto;
      div {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background-color: #d9effe;
        }
      }
    }
    .indicatorName {
      color: rgb(48, 145, 242);
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 16px 0px 10px 10px;
      overflow: hidden;
    }
    .noDataText {
      padding-top: 50px;
      text-align: center;
    }
    .noDataText p:first-child {
      font-size: 26px;
      line-height: 26px;
      color: rgb(102, 102, 102);
      padding: 0 0 20px 20px;
    }
    .noDataText p:last-child {
      font-size: 14px;
      line-height: 14px;
      padding: 0 0 20px 20px;
      color: rgb(153, 153, 153);
    }
  }
}
</style>
