<template>
  <div class="all-con">
    <div id="con-box" v-html="html">{{ html }}</div>
    <div @click="backBefore" class="chakan-label">返回</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      html: this.$route.query.obj,
    };
  },
  methods: {
    backBefore() {
      window.history.back();
    },
  },
};
</script>

<style lang="less" scoped>
.all-con {
  padding: 20px;
  margin: 0 auto;
  width: 600px;
  position: relative;
  .chakan-label {
    &:hover {
      background: #1494ff;
      color: #fff;
    }
    position: absolute;
    top: 20px;
    right: -80px;
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
</style>
