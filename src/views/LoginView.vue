<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo设计 -->
      <div class="logo-container">
        <div class="logo">
          <div class="logo-icon">
            <span class="logo-circle">🤖</span>
          </div>
          <div class="logo-text">AI Assistant</div>
        </div>
      </div>
      
      <h2 class="page-title">{{ isLogin ? '登录' : '注册并登录' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="userName" class="form-label">账号</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input
              type="text"
              id="username"
              v-model="userName"
              placeholder="请输入账号"
              required
              class="form-input"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="请输入密码"
              required
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? '处理中...' : (isLogin ? '登录' : '注册并登录') }}
          </button>
          <div class="switch-mode">
            <span @click="toggleMode">{{ isLogin ? '还没有账号？注册并登录' : '已有账号？直接登录' }}</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../utils/axiosConfig'

const router = useRouter()

// 登录模式切换
const isLogin: Ref<boolean> = ref(true)
// 加载状态
const isLoading: Ref<boolean> = ref(false)
// 表单数据
const userName: Ref<string> = ref('')
const password: Ref<string> = ref('')

// 切换登录/注册模式
const toggleMode = () => {
  isLogin.value = !isLogin.value
}

// 处理表单提交
const handleSubmit = async () => {
  const trimmedUsername = userName.value.trim()
  const trimmedPassword = password.value.trim()
  
  if (!trimmedUsername || !trimmedPassword) return
  
  isLoading.value = true
  
  try {
    const endpoint = isLogin.value ? '/auth/login' : '/auth/register'
    
    // 直接获取响应数据（响应拦截器已处理）
    const response = await apiClient.post<any>(endpoint, {
      userName: trimmedUsername,
      password: trimmedPassword
    })
    
    // 使用unknown作为中间类型进行类型断言
    const resultData = response as unknown as { token?: string; user?: any }
    
    // 保存token或用户信息到localStorage
    if (resultData.token) {
      localStorage.setItem('auth_token', resultData.token)
    }
    if (resultData.user) {
      localStorage.setItem('user_info', JSON.stringify(resultData.user))
    }
    
    // 登录成功后跳转到agent选择页面
    await router.push('/agent-select')
  } catch (error) {
    console.error('登录/注册失败:', error)
    // 这里可以添加错误提示
    alert((error as Error).message || '登录/注册失败')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 整体容器 */
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 登录盒子 */
.login-box {
  width: 420px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

/* Logo样式 */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  position: relative;
}

.logo-circle {
  font-size: 2.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 页面标题 */
.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 表单组 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 输入框包装 */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #999;
}

/* 输入框样式 */
.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

.form-input:focus {
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #aaa;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 2rem;
}

/* 提交按钮 */
.submit-btn {
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

/* 切换模式 */
.switch-mode {
  text-align: center;
}

.switch-mode span {
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.switch-mode span:hover {
  color: #764ba2;
  text-decoration: underline;
}
</style>