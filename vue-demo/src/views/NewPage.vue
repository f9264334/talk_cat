<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
// 测试数据
const input = ref('')
const tableData = ref([
  { name: '张三', age: 20 },
  { name: '李四', age: 22 }
])
</script>

<template>
  <main class="new-page">
    <h1>New Page</h1>
    <p>这是新创建的页面。你可以从首页点击链接跳转到这里。</p>

    <p>
      <RouterLink to="/">返回首页</RouterLink>
    </p>
    <el-button type="primary">主要按钮</el-button>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
    <el-table :data="tableData" border>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
    </el-table>
  </main>
</template>

<style scoped>
.new-page {
  padding: 1.5rem;
}

.new-page h1 {
  margin: 0 0 1rem 0;
}
</style>
