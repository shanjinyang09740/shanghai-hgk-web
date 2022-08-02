<template>
  <div class="footer">
    <div class="footer3_lf fl">
      <div class="footer-con-text">
        上海市黄浦区威海路48号
      </div>
      <div class="footer-con-text">
        电话：53857070 邮编：200003
      </div>
      <div class="footer-con-text">
        版权所有：上海市统计局
      </div>
      <div class="footer-con-text">
        技术支持：长城计算机软件与系统有限公司
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  // extends: null,
  // minxins: [],
  props: [],
  data() {
    return {
      jiucuoPath: require("@/assets/images/bottom/find-error.png"),
      redPath: require("@/assets/images/bottom/red.png"),
      sentryboxPath: require("@/assets/images/bottom/sentrybox.gif"),
    };
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
  methods: {},
};
</script>

<style lang="less" scoped>
.footer3_lf {
  // display: flex;
  background: #b1c2d2;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .footer-con-text {
    font-size: 14px;
    color: #666;
    font-family: SimSun;
    text-align: center;
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
  }
}
.footer-66 {
  background: #7890a6;
  font-size: 12px;
  padding: 4px 0;
  text-align: center;
}
</style>
