import axios from 'axios'

// 创建axios实例
const apiClient = axios.create({
  // 从环境变量中读取API URL
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置请求超时时间
  timeout: 10000,
  // 设置请求头
  headers: {
    'Content-Type': 'application/json'
  },
  // 允许携带凭证
  withCredentials: true
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('auth_token')
    // 如果token存在，添加到请求头
    if (token) {
      // 确保headers是对象
      if (!config.headers) {
        config.headers = {}
      }
      // 添加Authorization头，格式为Bearer token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 获取响应数据
    const result = response.data
    
    // 检查是否为统一Result格式
    if (result && typeof result === 'object' && 'code' in result && 'message' in result) {
      // 成功响应（code=200）
      if (result.code === 200) {
        // 返回result.data，方便前端直接使用
        return result.data
      } else {
        // 业务错误，抛出异常
        const error = new Error(result.message || '请求失败')
        ;(error as any).code = result.code
        return Promise.reject(error)
      }
    }
    
    // 非统一Result格式，直接返回响应数据
    return response
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status
      let message = '请求失败'
      
      // 根据状态码设置错误消息
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 清除token，跳转到登录页面
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_info')
          window.location.href = '/login'
          break
        case 403:
          message = '禁止访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败（${status}）`
      }
      
      // 包装错误对象
      const wrappedError = new Error(message)
      ;(wrappedError as any).code = status
      ;(wrappedError as any).response = error.response
      return Promise.reject(wrappedError)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      const networkError = new Error('网络错误，服务器无响应')
      ;(networkError as any).code = 'NETWORK_ERROR'
      return Promise.reject(networkError)
    } else {
      // 请求配置错误
      return Promise.reject(error)
    }
  }
)

export default apiClient