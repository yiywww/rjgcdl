const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'pet-adopt-secret-key-2024';

// 存储领养申请 (userId_petId -> applicationData)
const adoptionApplications = new Map();

const ApiStatusCode = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

const ErrorMessages = {
  TOKEN_MISSING: '请先登录',
  TOKEN_INVALID: '登录已过期，请重新登录',
  PET_ID_REQUIRED: '宠物ID不能为空',
  APPLICATION_DATA_REQUIRED: '申请数据不能为空',
  DUPLICATE_APPLICATION: '你已提交领养申请',
  INTERNAL_ERROR: '服务器内部错误'
};

function successResponse(data, msg) {
  return { code: ApiStatusCode.SUCCESS, msg: msg || '操作成功', data };
}

function errorResponse(code, msg) {
  return { code, msg, data: null };
}

// JWT验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.TOKEN_MISSING));
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse(ApiStatusCode.UNAUTHORIZED, ErrorMessages.TOKEN_INVALID));
  }
}

// 生成申请唯一键
function getApplicationKey(userId, petId) {
  return `${userId}_${petId}`;
}

// 提交领养申请
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { petId, applicationData } = req.body;
    const userId = req.user.userId;

    console.log(`收到领养申请 - 用户: ${req.user.username}, 宠物: ${petId}`);

    // 验证必要字段
    if (!petId) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.PET_ID_REQUIRED));
    }

    if (!applicationData) {
      return res.status(400).json(errorResponse(ApiStatusCode.BAD_REQUEST, ErrorMessages.APPLICATION_DATA_REQUIRED));
    }

    // 检查是否已提交过申请
    const applicationKey = getApplicationKey(userId, petId);
    if (adoptionApplications.has(applicationKey)) {
      console.log(`重复申请检测 - 用户: ${req.user.username}, 宠物: ${petId}`);
      return res.status(409).json(errorResponse(ApiStatusCode.CONFLICT, ErrorMessages.DUPLICATE_APPLICATION));
    }

    // 创建新申请
    const application = {
      id: Date.now().toString(),
      userId,
      username: req.user.username,
      petId,
      applicationData,
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date(),
      reviewedAt: null,
      reviewNote: null
    };

    // 存储申请
    adoptionApplications.set(applicationKey, application);

    console.log(`领养申请提交成功 - 用户: ${req.user.username}, 宠物: ${petId}, 申请ID: ${application.id}`);
    return res.json(successResponse({ applicationId: application.id }, '申请提交成功'));

  } catch (error) {
    console.error('提交申请错误:', error);
    return res.status(500).json(errorResponse(ApiStatusCode.INTERNAL_ERROR, ErrorMessages.INTERNAL_ERROR));
  }
});

// 检查是否已提交申请
router.get('/check/:petId', authenticateToken, async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.user.userId;

    const applicationKey = getApplicationKey(userId, petId);
    const hasApplied = adoptionApplications.has(applicationKey);

    return res.json(successResponse({ hasApplied }, '查询成功'));

  } catch (error) {
    console.error('检查申请错误:', error);
    return res.status(500).json(errorResponse(ApiStatusCode.INTERNAL_ERROR, ErrorMessages.INTERNAL_ERROR));
  }
});

// 获取用户的所有申请
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userApplications = [];

    for (const [key, application] of adoptionApplications) {
      if (application.userId === userId) {
        userApplications.push(application);
      }
    }

    return res.json(successResponse({ applications: userApplications }, '查询成功'));

  } catch (error) {
    console.error('获取申请列表错误:', error);
    return res.status(500).json(errorResponse(ApiStatusCode.INTERNAL_ERROR, ErrorMessages.INTERNAL_ERROR));
  }
});

// 获取所有申请 (管理员用)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const allApplications = Array.from(adoptionApplications.values());
    return res.json(successResponse({ applications: allApplications }, '查询成功'));

  } catch (error) {
    console.error('获取所有申请错误:', error);
    return res.status(500).json(errorResponse(ApiStatusCode.INTERNAL_ERROR, ErrorMessages.INTERNAL_ERROR));
  }
});

module.exports = router;