# 用户注册与登录模块 - 后端接口文档

## 一、完整 TypeScript 类型定义

```typescript
// ==================== 基础类型定义 ====================

/**
 * 统一 API 响应格式
 */
interface ApiResponse<T = any> {
  code: number;      // 状态码：200 成功，400 参数错误，401 未授权，409 冲突
  msg: string;       // 提示信息（可直接展示给用户）
  data: T | null;    // 响应数据
}

/**
 * 用户注册请求参数
 */
interface RegisterParams {
  username: string;  // 账号（唯一，3-20个字符）
  password: string;  // 明文密码（6-32个字符）
}

/**
 * 用户登录请求参数
 */
interface LoginParams {
  username: string;  // 账号
  password: string;  // 明文密码
}

/**
 * 登录成功响应数据
 */
interface LoginSuccessData {
  token: string;     // JWT Token
}

// ==================== 状态码定义 ====================

enum ApiStatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CONFLICT = 409
}

// ==================== 错误信息定义 ====================

const ErrorMessages = {
  USERNAME_REQUIRED: '账号不能为空',
  PASSWORD_REQUIRED: '密码不能为空',
  USERNAME_TOO_SHORT: '账号至少3个字符',
  USERNAME_TOO_LONG: '账号最多20个字符',
  PASSWORD_TOO_SHORT: '密码至少6个字符',
  PASSWORD_TOO_LONG: '密码最多32个字符',
  USERNAME_EXISTS: '账号已存在',
  USER_NOT_FOUND: '用户不存在',
  PASSWORD_ERROR: '密码错误',
  INTERNAL_ERROR: '服务器内部错误'
} as const;
```

## 二、接口说明文档

### 接口1：用户注册

- **路径**: `POST /api/login/register`
- **Content-Type**: `application/json`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 账号（3-20个字符，唯一） |
| password | string | 是 | 明文密码（6-32个字符） |

#### 后端逻辑

1. 参数校验
   - 账号和密码不能为空
   - 账号长度：3-20字符
   - 密码长度：6-32字符
2. 检查账号是否已存在
3. 使用 bcrypt 加密密码
4. 保存用户信息到数据库
5. 返回成功响应

#### 响应示例

**成功响应**
```json
{
  "code": 200,
  "msg": "注册成功",
  "data": null
}
```

**账号已存在**
```json
{
  "code": 409,
  "msg": "账号已存在",
  "data": null
}
```

**参数错误**
```json
{
  "code": 400,
  "msg": "账号至少3个字符",
  "data": null
}
```

---

### 接口2：用户登录

- **路径**: `POST /api/login/login`
- **Content-Type**: `application/json`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 账号 |
| password | string | 是 | 明文密码 |

#### 后端逻辑

1. 参数校验（非空）
2. 根据账号查询用户
3. 使用 bcrypt 验证密码
4. 验证成功生成 JWT Token
5. 返回 Token

#### 响应示例

**成功响应**
```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**用户不存在**
```json
{
  "code": 401,
  "msg": "用户不存在",
  "data": null
}
```

**密码错误**
```json
{
  "code": 401,
  "msg": "密码错误",
  "data": null
}
```

---

## 三、接口实现伪代码

```typescript
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

// 模拟数据库
interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}
const users: Map<string, User> = new Map();

// ==================== 工具函数 ====================

function successResponse<T>(data: T, msg: string = '操作成功'): ApiResponse<T> {
  return { code: ApiStatusCode.SUCCESS, msg, data };
}

function errorResponse(code: number, msg: string): ApiResponse<null> {
  return { code, msg, data: null };
}

// ==================== 用户注册接口 ====================

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as RegisterParams;

    // 1. 参数校验
    if (!username || !password) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_REQUIRED));
    }
    if (username.length < 3) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_TOO_SHORT));
    }
    if (username.length > 20) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_TOO_LONG));
    }
    if (password.length < 6) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.PASSWORD_TOO_SHORT));
    }
    if (password.length > 32) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.PASSWORD_TOO_LONG));
    }

    // 2. 检查账号是否已存在
    if (users.has(username)) {
      return res.status(409).json(errorResponse(ApiStatusCode.CONFLICT, ErrorMessages.USERNAME_EXISTS));
    }

    // 3. 加密密码
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 4. 保存用户
    const user: User = {
      id: Date.now().toString(),
      username,
      passwordHash,
      createdAt: new Date()
    };
    users.set(username, user);

    // 5. 返回成功
    return res.json(successResponse(null, '注册成功'));

  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json(errorResponse(500, ErrorMessages.INTERNAL_ERROR));
  }
});

// ==================== 用户登录接口 ====================

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as LoginParams;

    // 1. 参数校验
    if (!username || !password) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_REQUIRED));
    }

    // 2. 查询用户
    const user = users.get(username);
    if (!user) {
      return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND));
    }

    // 3. 验证密码
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.PASSWORD_ERROR));
    }

    // 4. 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. 返回 Token
    return res.json(successResponse({ token }, '登录成功'));

  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json(errorResponse(500, ErrorMessages.INTERNAL_ERROR));
  }
});

export default router;
```

## 四、依赖说明

| 依赖包 | 用途 |
|--------|------|
| express | Web 框架 |
| bcryptjs | 密码加密 |
| jsonwebtoken | JWT Token 生成 |
| typescript | TypeScript 支持 |

## 五、JWT Token 说明

- **签名算法**: HS256
- **过期时间**: 7天
- **Payload 内容**:
  ```json
  {
    "userId": "用户ID",
    "username": "账号",
    "iat": "签发时间",
    "exp": "过期时间"
  }
  ```
