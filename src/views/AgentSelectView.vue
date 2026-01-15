<template>
  <div class="agent-select-container">
    <h1 class="page-title">选择AI助手</h1>
    <div class="agent-grid">
      <div
        v-for="agent in agents"
        :key="agent.code"
        class="agent-card"
        @click="selectAgent(agent)"
      >
        <div class="agent-icon">{{ agent.icon }}</div>
        <h3 class="agent-name">{{ agent.name }}</h3>
        <p class="agent-desc">{{ agent.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Agent {
  code: string
  name: string
  description: string
  icon: string
}

const router = useRouter()

// 预制三个agent
const agents: Agent[] = [
  {
    code: 'cat',
    name: 'cat编程',
    description: '专业的编程助手，帮你解决代码问题',
    icon: '🐱'
  },
  {
    code: 'dog',
    name: 'dog算命',
    description: '有趣的算命助手，预测你的未来运势',
    icon: '🐶'
  },
  {
    code: 'fish',
    name: 'fish美食',
    description: '美食推荐助手，为你提供美味食谱',
    icon: '🐟'
  }
]

// 选择agent并跳转到聊天页面
const selectAgent = (agent: Agent) => {
  router.push({
    path: '/chat',
    query: { agent: agent.code }
  })
}
</script>

<style scoped>
.agent-select-container {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
}

.agent-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.agent-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.agent-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.agent-name {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.agent-desc {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}
</style>