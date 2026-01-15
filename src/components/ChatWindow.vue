<template>
  <div class="chat-container">
    <!-- 聊天内容区域 -->
    <div class="chat-content" ref="chatContent">
      <!-- 清空按钮（聊天内容区域右上角） -->
      <button class="clear-top" @click="clearChat" :disabled="chatList.length === 0">清空</button>
      <!-- 遍历聊天记录 -->
      <div
        v-for="(msg, index) in chatList"
        :key="index"
        :class="['chat-item', msg.role === 'user' ? 'user-msg' : 'server-msg']"
      >
        <!-- 头像（简单占位） -->
        <div class="avatar">
          <template v-if="msg.role === 'user'">我</template>
          <template v-else>
            <img src="@/assets/cat_avator.png" alt="cat avatar" />
          </template>
        </div>
        <!-- 消息内容（仅显示消息文本，不显示发送者名字） -->
        <div class="msg-content">
          <template v-if="msg.role === 'server'">
            <div v-html="renderMarkdown(msg.content)"></div>
          </template>
          <template v-else>
            {{ msg.content }}
          </template>
        </div>
      </div>
    </div>

    
    <!-- 输入区域 -->
    <div class="chat-input">
      <textarea
            ref="textareaRef"
            v-model="inputMsg"
            placeholder="请输入消息..."
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
            @keydown.enter.prevent="onEnterKey"
            :disabled="isLoading"
          ></textarea>
      <button @click="handleSend" :disabled="!inputMsg.trim() || isLoading">
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, type Ref } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
// 必须开启 withCredentials，和后端 setAllowCredentials(true) 对应
axios.defaults.withCredentials = true;
// 设置请求头为 JSON（适配后端 @RequestBody 接收）
axios.defaults.headers.post['Content-Type'] = 'application/json';
// 消息类型
interface ChatMessage {
  role: 'user' | 'server'
  content: string
}
const apiBaseUrl = import.meta.env.VITE_API_URL as string
// 聊天记录列表
const chatList: Ref<ChatMessage[]> = ref([])
// 输入框内容
const inputMsg: Ref<string> = ref('')
// 加载状态（防止重复发送）
const isLoading: Ref<boolean> = ref(false)
// 聊天内容区域 DOM 引用（用于自动滚动到底部）
const chatContent: Ref<HTMLElement | null> = ref(null)
// 文本域引用（用于聚焦或其它 DOM 操作）
const textareaRef: Ref<HTMLTextAreaElement | null> = ref(null)
// IME 组合中状态标志，避免在输入法组合时触发发送
const isComposing: Ref<boolean> = ref(false)

// composition 事件处理
const onCompositionStart = () => {
  isComposing.value = true
}

const onCompositionEnd = () => {
  // 组合结束后短暂延迟以确保 v-model 完成更新
  isComposing.value = false
}

// Enter 键处理：支持 Shift+Enter 插入换行，在非组合状态下发送
const onEnterKey = (event: KeyboardEvent) => {
  // 如果正在进行 IME 组合，不发送
  if (isComposing.value) return

  // Shift+Enter 插入换行
  if (event.shiftKey) {
    // 插入换行符到光标位置
    const ta = textareaRef.value
    if (!ta) return
    const start = ta.selectionStart ?? ta.value.length
    const end = ta.selectionEnd ?? ta.value.length
    const value = ta.value
    const newValue = value.slice(0, start) + '\n' + value.slice(end)
    inputMsg.value = newValue
    // 调整光标位置到新行后
    nextTick(() => {
      const pos = start + 1
      ta.setSelectionRange(pos, pos)
    })
    return
  }

  // 普通回车（非组合、非 shift）则发送消息
  void handleSend()
}

// 发送消息方法
const handleSend = async (): Promise<void> => {
  // 空消息不发送
  const msg = inputMsg.value.trim()
  if (!msg || isLoading.value) return

  // 1. 添加用户消息到聊天列表
  chatList.value.push({ role: 'user', content: msg })
  // 清空输入框
  inputMsg.value = ''
  // 标记加载中
  isLoading.value = true

  interface ApiResponse {
    code: number,
    message: string,
    data: {
    content: string,
    }
  }
  try {
    // 2. 调用服务端接口，指定返回数据类型
    const res = await axios.post<ApiResponse>(`${apiBaseUrl}/chat/startChat`, {
      message: msg,
    })

    // 3. 添加服务端回复到聊天列表
    chatList.value.push({
      role: 'server',
      content: res.data.data.content,
    })
  } catch (err) {
    // 异常处理
    chatList.value.push({
      role: 'server',
      content: '服务端出错啦，请稍后再试！',
    })
    // 保守打印错误
    // eslint-disable-next-line no-console
    console.error('聊天接口请求失败：', err)
  } finally {
    // 取消加载状态
    isLoading.value = false
  }
}

// 本地持久化键名
const STORAGE_KEY = 'chat_demo_messages_v1'

// 将 chatList 保存到 localStorage
const saveChatToStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatList.value))
  } catch (e) {
    // ignore storage errors
  }
}

// 从 localStorage 加载聊天记录
const loadChatFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ChatMessage[]
      chatList.value = parsed
    }
  } catch (e) {
    // ignore parse errors
  }
}

// 清空聊天记录（内存 + localStorage）
const clearChat = () => {
  chatList.value = []
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    // ignore
  }
  // 重置滚动
  nextTick(() => {
    if (chatContent.value) chatContent.value.scrollTop = 0
  })
}

// 监听聊天列表变化，自动滚动到底部
watch(
  chatList,
  () => {
    nextTick(() => {
      if (chatContent.value) {
        chatContent.value.scrollTop = chatContent.value.scrollHeight
      }
    })
  },
  { deep: true }
)

// 组件挂载时初始化滚动
onMounted(() => {
  // 1. 先从 localStorage 加载历史聊天
  loadChatFromStorage()

  // 2. 初始化滚动位置
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight
  }
  // 3. 当 chatList 变化时保存到 localStorage（watch 已经负责滚动，这里追加保存）
  watch(
    chatList,
    () => {
      saveChatToStorage()
    },
    { deep: true }
  )
})

// 将服务端文本渲染为安全的 HTML（Markdown -> HTML -> sanitize）
const renderMarkdown = (text: string): string => {
  try {
    const raw = marked.parse(text || '')
    return DOMPurify.sanitize(raw)
  } catch (e) {
    // 在解析失败时退回到转义后的纯文本
    return DOMPurify.sanitize(text)
  }
}
</script>
<style scoped>
/* 整体容器 */
.chat-container {
  width: 600px;
  height: 800px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  overflow: hidden;
  position: relative;
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  /* 增加顶部内边距，避免与右上角的清空按钮重叠 */
  padding: 44px 20px 20px 20px;
  background-color: #f9fafb;
  overflow-y: auto;
  position: relative;
}

/* 单个消息项 */
.chat-item {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
}

/* 用户消息（右对齐） */
.user-msg {
  flex-direction: row-reverse;
  margin-left: auto;
}

/* 服务端消息（左对齐） */
.server-msg {
  flex-direction: row;
  margin-right: auto;
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 14px;
  flex-shrink: 0;
}

/* 头像图片与文字头像尺寸一致 */
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

/* 用户头像颜色 */
.user-msg .avatar {
  background-color: #409eff;
  color: white;
}

/* 消息内容 */
.msg-content {
  padding: 8px 12px;
  border-radius: 8px;
  margin: 0 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

/* 用户消息内容样式 */
.user-msg .msg-content {
  background-color: #409eff;
  color: white;
  border-bottom-right-radius: 2px;
}

/* 服务端消息内容样式 */
.server-msg .msg-content {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 2px;
}

/* 输入区域 */
.chat-input {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  background-color: white;
}

/* 输入框 */
.chat-input textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  resize: none;
  height: 60px;
  font-size: 14px;
  outline: none;
}

.chat-input textarea:focus {
  border-color: #409eff;
}

/* 发送按钮 */
.chat-input button {
  padding: 0 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.chat-input button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

/* 右上角清空按钮 */
.clear-top {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  z-index: 10;
}

.clear-top:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
