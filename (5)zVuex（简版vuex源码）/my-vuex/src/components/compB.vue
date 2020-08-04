<template>
  <div>
      <div>姓名：{{getName}}</div>
      <div>博客：{{getUrl}}</div>
      <div>备注：{{getStatus}}</div>
      <div @click="changeStatus()" style="color:red;text-align: center;" >点我更新数据</div>
  </div>
</template>

<script>
export default {
  name: 'CompB',
  props: {
    msg: String
  },
  computed:{
    getName(){
      return this.$store.getters.getName;
    },
    getUrl(){
      return this.$store.getters.getUrl;
    },
    getStatus(){
      console.log(`getStatus====` +  this.$store.getters.getStatus);
      return this.$store.getters.getStatus;
    }
  },
  methods:{
    changeStatus(){
      //  this.$store.commit('changeStatus', 'vuex数据变化，欢迎小姑凉，也欢迎小帅哥' );
      this.$store.dispatch('changeStatusActions', 'vuex数据变化，欢迎小姑凉，也欢迎小帅哥' );
    }
  }
}
</script>

