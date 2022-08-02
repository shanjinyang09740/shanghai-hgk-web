<template>
  <div class="mainTableContainer">
    <set-zb
      v-if="showSetZb"
      :folderId="folderId"
      :folderLabel="folderLabel"
      :themeCode="themeCode"
      ref="setZbRef"
    ></set-zb>
    <table-canvas
      v-else
      :folderId="folderId"
      :folderLabel="folderLabel"
      :themeCode="themeCode"
      :searchType="searchType"
      :measures="measures"
      ref="tableCanvas"
    ></table-canvas>
  </div>
</template>

<script>
import tableCanvas from "./tableCanvas";
import setZb from "./setZb.vue";
export default {
  name: "mainTable",
  components: {
    setZb,
    tableCanvas,
  },
  props: ["themeCode", "searchType", "showSetZb", "folderId", "folderLabel"],
  data() {
    return {
      measures: [],
    };
  },
  watch: {
    showSetZb(val) {
      if (this.searchType === "2" && !val) {
        this.measures = this.$refs.setZbRef.checkList.filter(
          (item) => item.checked
        );
      } else {
        this.measures = [];
      }
    },
  },
};
</script>

<style scoped lang="less">
.mainTableContainer {
  height: 95%;
  width: calc(100% - 360px);
}
</style>
