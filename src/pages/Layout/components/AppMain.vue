<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    key() {
      this.marryMenuId(this.$route.path);
      return this.$route.path;
    },
  },
  mounted() {},
  methods: {
    //获取匹配的菜单id
    marryMenuId(path) {
      let activeId = "";
      this.menu.some((item) => {
        if (path.indexOf(item["path"]) !== -1) {
          activeId = item["id"];
          return true;
        }
      });
      this.$emit("changeActiveId", activeId);
    },
  },
};
</script>

<style scoped>
.app-main {
  width: 100%;
  overflow: auto;
  height: calc(100% - 50px);
}
</style>
