<template>
  <div id="app">
    <div class="body">
      <div class="b_header">
        <span>z手写vue-router</span>
      </div>
      <div class="b_content">
        <router-view />
      </div>
    </div>

    <div
      style="position: fixed;bottom: 0;text-align: center;width: 100%;padding: 25px 0;background-color: #bfd6e8;color: #843838;font-size:18px;"
    >
      <div style="font-size:20px;margin-bottom:20px;">欢迎访问主页</div>
      <div>
        个人github：
        <a
          style="color:#843838;"
          target="_blank"
          href="https://github.com/zhuangweizhan"
        >https://github.com/zhuangweizhan</a>
      </div>
      <div>
        个人掘金：
        <a
          style="color:#843838;"
          target="_blank"
          href="https://juejin.im/user/5e8fddc9e51d4546be39a558"
        >https://juejin.im/user/5e8fddc9e51d4546be39a558</a>
      </div>
      <div>
        本源码博客解说：
        <a
          style="color:#843838;"
          target="_blank"
          href="https://juejin.im/post/6859565866552393741"
        >https://juejin.im/post/6859565866552393741</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.body {
  text-align: left;
  width: 550px;
  margin: 0 auto;
  margin-top: 100px;
}

.body .b_header {
  display: flex;
  justify-item: center;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin-bottom: 20px;
}

.body .b_header img {
  height: 40px;
  width: 80px;
}

.body .b_header span {
  font-size: 21px;
}

.body .b_content {
  border: 1px solid #edebeb;
  padding-top: 20px;
}

.body div {
  padding: 20px;
  text-align: left;
  line-height: 40px;
}
</style>
