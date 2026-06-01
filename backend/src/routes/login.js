const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'pet-adopt-secret-key-2024';
const SALT_ROUNDS = 10;

const users = new Map();

const ApiStatusCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409
};

const ErrorMessages = {
  USERNAME_REQUIRED: '用户名不能为空',
  PASSWORD_REQUIRED: '密码不能为空',
  USERNAME_TOO_SHORT: '用户名至少3个字符',
  USERNAME_TOO_LONG: '用户名最多20个字符',
  PASSWORD_TOO_SHORT: '密码至少6个字符',
  PASSWORD_TOO_LONG: '密码最多32个字符',
  USERNAME_EXISTS: '用户名已存在',
  USER_NOT_FOUND: '用户不存在，请先注册',
  PASSWORD_ERROR: '密码错误',
  INTERNAL_ERROR: '服务器内部错误'
};

function successResponse(data, msg) {
  return { code: ApiStatusCode.SUCCESS, msg: msg || '操作成功', data };
}

function errorResponse(code, msg) {
  return { code, msg, data: null };
}

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_REQUIRED));
    }
    if (!password) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.PASSWORD_REQUIRED));
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

    if (users.has(username)) {
      return res.status(409).json(errorResponse(ApiStatusCode.CONFLICT, ErrorMessages.USERNAME_EXISTS));
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = {
      id: Date.now().toString(),
      username,
      passwordHash,
      createdAt: new Date()
    };
    users.set(username, user);

    console.log(`用户注册成功: ${username}`);
    return res.json(successResponse(null, '注册成功'));

  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json(errorResponse(500, ErrorMessages.INTERNAL_ERROR));
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.USERNAME_REQUIRED));
    }
    if (!password) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.PASSWORD_REQUIRED));
    }

    const user = users.get(username);
    if (!user) {
      return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.USER_NOT_FOUND));
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.PASSWORD_ERROR));
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`用户登录成功: ${username}`);
    return res.json(successResponse({ token }, '登录成功'));

  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json(errorResponse(500, ErrorMessages.INTERNAL_ERROR));
  }
});

module.exports = router;