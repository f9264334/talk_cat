<template>
    <main>
      <ChatWindow :agent="agent" />
    </main>
</template>
<script setup lang="ts">
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import ChatWindow from '../components/ChatWindow.vue';
    
    const route = useRoute()
    // 从路由参数中获取agent，如果没有则使用默认值
    const agent = computed(() => route.query.agent as string || 'cat')
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft Yahei", sans-serif;
}

body {
  background-color: #f5f5f5;
}
</style>