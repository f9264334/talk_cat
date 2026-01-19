# AI助手聊天系统 API 文档

## 1. 认证相关 API

### 1.1 登录接口

**接口地址**：`/auth/login`
**请求方式**：POST
**Content-Type**：application/json

#### 请求参数

| 参数名   | 类型   | 必填 | 描述     |
|----------|--------|------|----------|
| username | string | 是   | 用户账号 |
| password | string | 是   | 用户密码 |

#### 请求示例

```json
{
  "username": "testuser",
  "password": "123456"
}
```

#### 响应示例

**成功响应**：
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  }
}
```

**失败响应**：
```json
{
  "code": 401,
  "message": "账号或密码错误"
}
```

### 1.2 注册接口

**接口地址**：`/auth/register`
**请求方式**：POST
**Content-Type**：application/json

#### 请求参数

| 参数名   | 类型   | 必填 | 描述     |
|----------|--------|------|----------|
| username | string | 是   | 用户账号 |
| password | string | 是   | 用户密码 |

#### 请求示例

```json
{
  "username": "newuser",
  "password": "123456"
}
```

#### 响应示例

**成功响应**：
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "username": "newuser",
      "createdAt": "2026-01-15T10:05:00Z"
    }
  }
}
```

**失败响应**：
```json
{
  "code": 400,
  "message": "账号已存在"
}
```

## 2. 聊天相关 API

### 2.1 发送消息接口

**接口地址**：`/chat/startChat`
**请求方式**：POST
**Content-Type**：application/json
**认证方式**：Bearer Token（在请求头中添加 `Authorization: Bearer {token}`）

#### 请求参数

| 参数名 | 类型   | 必填 | 描述                 |
|--------|--------|------|----------------------|
| message | string | 是   | 用户发送的消息内容   |
| agent  | string | 是   | 代理类型（cat/dog/fish） |

#### 请求示例

```json
{
  "message": "Hello, how are you?",
  "agent": "cat"
}
```

#### 响应示例

**成功响应**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": "I'm fine, thank you! How can I help you today?"
  }
}
```

**失败响应**：
```json
{
  "code": 401,
  "message": "未授权"
}
```

```json
{
  "code": 400,
  "message": "无效的agent类型"
}
```

## 3. 错误码说明

| 错误码 | 描述                 |
|--------|----------------------|
| 200    | 操作成功             |
| 400    | 请求参数错误         |
| 401    | 未授权或认证失败     |
| 403    | 权限不足             |
| 404    | 资源不存在           |
| 500    | 服务器内部错误       |

## 4. 代理类型说明

| 代理类型 | 描述                 |
|----------|----------------------|
| cat      | 编程助手，解决代码问题 |
| dog      | 算命助手，预测运势   |
| fish     | 美食助手，推荐食谱   |

## 5. 认证机制

- 所有需要认证的接口都需要在请求头中添加 `Authorization: Bearer {token}`
- token 有效期为 7 天，过期后需要重新登录
- token 存储在客户端的 localStorage 中，键名为 `auth_token`

## 6. 跨域设置

- 后端已设置 `Access-Control-Allow-Origin: *`，允许所有域名访问
- 后端已设置 `Access-Control-Allow-Credentials: true`，允许携带凭证
- 后端已设置 `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- 后端已设置 `Access-Control-Allow-Headers: Content-Type, Authorization`

## 7. 接口调用示例（JavaScript）

### 7.1 登录示例

```javascript
import axios from 'axios';

const login = async (username, password) => {
  try {
    const response = await axios.post('/auth/login', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};
```

### 7.2 发送消息示例

```javascript
import axios from 'axios';

const sendMessage = async (message, agent) => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post('/chat/startChat', {
      message,
      agent
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
};
```