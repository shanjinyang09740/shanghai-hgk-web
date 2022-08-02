<template>
  <div>
    <iframe :src="src" frameborder="0" style="width:100%;height:800px"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: this.$route.query.src,
    };
  },
};
</script>

<style></style>
