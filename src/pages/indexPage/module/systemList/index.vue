<template>
  <div>
    <div class="system-con">
      <div class="system-con-title">方法制度</div>
      <div class="system-con-time">截止时间：{{ cutOffTime }}</div>
    </div>
    <div class="system-bot">
      <div v-for="(item, index) in systemList" class="system-bot-item">
        <img src="@/assets/images/new/rainbow.png" alt="" />
        <div>
          <div class="system-bot-item-num">
            {{ item.count }}<span style="font-size:12px">个</span>
          </div>

          <div
            v-if="item.itemTypeId === 'Variable'"
            class="system-bot-item-text"
          >
            {{ item.variableType }}
          </div>
          <div
            v-else-if="item.itemTypeId === 'Group'"
            class="system-bot-item-text"
          >
            调查制度
          </div>
          <div
            v-else-if="item.itemTypeId === 'StudyUnit'"
            class="system-bot-item-text"
          >
            统计方法
          </div>
          <div
            v-else-if="item.itemTypeId === 'Instrument'"
            class="system-bot-item-text"
          >
            报表
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REQ } from "@/service/requestUrl";
import { postJSON } from "@/utils/post.js";
export default {
  data() {
    return {
      systemList: [],
      cutOffTime: "",
    };
  },
  created() {
    postJSON(REQ.getItemCounts).then((res) => {
      this.systemList = res.data[0].data;
    });
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month > 10 ? month : "0" + month;
    day = day > 10 ? day : "0" + day;
    // console.log(year + "-" + month + "-" + day);
    this.cutOffTime = year + "-" + month + "-" + day;
  },
};
</script>

<style lang="less" scoped>
.system-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .system-con-title {
    font-size: 18px;
    color: #333;
  }
  .system-con-time {
    color: #333;
    font-size: 12px;
    background: cyan;
    border-radius: 4px;
    padding: 4px 8px;
  }
  &::after {
    content: "";
    height: 1px;
    width: 1015px;
    background: #999;
    position: absolute;
    left: 72px;
    bottom: 3px;
  }
}
.system-bot {
  padding: 20px 0 42px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .system-bot-item {
    width: 12%;
    height: 55px;
    display: flex;
    img {
      margin-right: 5px;
    }
    .system-bot-item-num {
      font-size: 30px;
      color: #333;
    }
    .system-bot-item-text {
      font-size: 12px;
      color: #666;
    }
  }
}
</style>
