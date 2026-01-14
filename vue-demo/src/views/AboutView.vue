<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <p>欢迎来到关于页面！这里是一些关于我们应用程序的信息。</p>
  <div class ="aboutUrl" @click="visitWebsite" >
    <a href="https://www.example.com" target="_blank" rel="noopener">访问我们的网站</a>
    </div>
</template>
<script setup lang="ts">
function visitWebsite() {
  window.open('https://www.baidu.com', '_blank');
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
