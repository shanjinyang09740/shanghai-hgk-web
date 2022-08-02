<template>
  <div class="articalList">
    <ul>
      <li
        v-for="(item, index) in articalListData"
        :key="index"
        v-if="index < 4"
      >
        <div
          v-if="index == 0"
          class="point fl"
          style="backgroundColor: rgba(17,126,119) "
        >
          {{ index + 1 }}
        </div>
        <div
          v-if="index == 1"
          class="point fl"
          style=" backgroundColor: rgba(27,120,227) "
        >
          {{ index + 1 }}
        </div>
        <div
          v-if="index == 2"
          class="point fl"
          style=" backgroundColor: rgba(209,79,0) "
        >
          {{ index + 1 }}
        </div>
        <div
          v-if="index == 3"
          class="point fl"
          style=" backgroundColor: rgba(139,82,220) "
        >
          {{ index + 1 }}
        </div>
        <div
          class="itemTitle ellipsis fl"
          :title="item.reportName"
          @click="runAction(item)"
        >
          {{ item.reportName }}
        </div>
        <div class="itemRight fr">{{ item.verifyTime.substring(0, 10) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "componenttArticalList",
  components: {},
  props: {
    articalListData: {
      type: Array,
      default: () => [],
    },
    pointBgColor: {
      type: String,
      default: "#404040",
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //单行文字点击事件
    runAction(item) {
      window.open(
        `/analysisReport/report/previewReport.html?id=${item.id}&tag=1`,
        "_blank"
      );
      this.$emit("rowAction", item);
    },
  },
};
</script>

<style lang="less" scoped>
.articalList {
  width: 100%;
  height: auto;
  ul {
    li {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      position: relative;
      .point {
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        display: inline-block;
        border-radius: 50%;
        color: #fff;
      }
      .itemTitle {
        margin-left: 10px;

        width: 70%;
        color: #333;
        cursor: pointer;
        position: absolute;
        left: 15px;
        text-align: left;
        &:hover {
          color: #2175c9;
        }
      }
      .itemRight {
        color: #999;
      }
    }
  }
}
</style>
