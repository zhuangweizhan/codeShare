<template>
  <div>
    <div>第一个页面</div>
    <router-link to="/Second">切换路由</router-link>
  </div>
</template>

<script>
export default {
  name: "Frist",
  data() {
    return {
      msg: "",
    };
  },
};
</script>