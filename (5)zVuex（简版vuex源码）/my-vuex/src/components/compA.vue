<template>
  <div>
    <!-- <div @click="changeStatus()" style="color:red;text-align: center;" >点我更新数据</div> -->
  </div>
</template>

<script>
export default {
  name: 'CompA',
  props: {
    msg: String
  },
  methods: {
    //修改名称
    // changeStatus(){
    //   this.$store.dispatch('changeStatusActions', 'vuex数据变化，欢迎小姑凉，也欢迎小帅哥' );
    // }
  }
}
</script>

