const API_BASE = 'http://localhost:3000/api/login';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const successOverlay = document.getElementById('successOverlay');
const tabBtns = document.querySelectorAll('.tab-btn');
const adminLink = document.getElementById('adminLink');
const guestBtn = document.getElementById('guestBtn');

let isAdminMode = false;

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (tab === 'login') {
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
    }
  });
});

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function clearError(element) {
  element.textContent = '';
  element.style.display = 'none';
}

function showSuccess() {
  successOverlay.classList.add('show');
}

async function callApi(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return await response.json();
}

function validateUsername(username) {
  if (!username || username.trim() === '') {
    return '账号不能为空';
  }
  if (username.length < 3 || username.length > 20) {
    return '账号需要3-20个字符';
  }
  return null;
}

function validatePassword(password) {
  if (!password || password === '') {
    return '密码不能为空';
  }
  if (password.length < 6 || password.length > 32) {
    return '密码需要6-32个字符';
  }
  return null;
}

function toggleAdminMode() {
  isAdminMode = !isAdminMode;
  if (isAdminMode) {
    adminLink.innerHTML = '<strong>👤 返回用户登录</strong>';
    document.getElementById('loginUsername').placeholder = '管理员账号 (111)';
    document.getElementById('loginPassword').placeholder = '管理员密码 (123456)';
  } else {
    adminLink.innerHTML = '<strong>🔐 [管理员] 登录</strong>';
    document.getElementById('loginUsername').placeholder = '账号';
    document.getElementById('loginPassword').placeholder = '密码';
  }
}

function handleAdminLogin(username, password) {
  if (username === '111' && password === '123456') {
    // 清除游客状态和普通用户状态
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    
    const token = 'admin_' + Date.now() + '_' + Math.random().toString(36).substr(2);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUsername', '管理员');
    window.location.href = 'manage.html';
    return true;
  }
  return false;
}

adminLink.addEventListener('click', (e) => {
  e.preventDefault();
  toggleAdminMode();
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError(loginError);

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const usernameError = validateUsername(username);
  if (usernameError) {
    showError(loginError, usernameError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    showError(loginError, passwordError);
    return;
  }

  if (isAdminMode) {
    if (handleAdminLogin(username, password)) {
      return;
    } else {
      showError(loginError, '管理员账号或密码错误');
      return;
    }
  }

  try {
    const result = await callApi(`${API_BASE}/login`, { username, password });
    if (result.code === 200) {
      // 清除游客状态，设置登录用户状态
      localStorage.removeItem('userRole');
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'index.html';
    } else {
      showError(loginError, result.msg);
    }
  } catch (error) {
    showError(loginError, '网络错误，请检查服务器是否启动');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError(registerError);

  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const usernameError = validateUsername(username);
  if (usernameError) {
    showError(registerError, usernameError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    showError(registerError, passwordError);
    return;
  }

  if (password !== confirmPassword) {
    showError(registerError, '两次输入的密码不一致');
    return;
  }

  try {
    const result = await callApi(`${API_BASE}/register`, { username, password });
    if (result.code === 200) {
      showSuccess();
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 100);
    } else {
      showError(registerError, result.msg);
    }
  } catch (error) {
    showError(registerError, '网络错误，请检查服务器是否启动');
  }
});

function handleGuestLogin() {
  localStorage.setItem('userRole', 'guest');
  localStorage.setItem('username', '游客');
  window.location.href = 'pet-list-new.html';
}

guestBtn.addEventListener('click', (e) => {
  e.preventDefault();
  handleGuestLogin();
});
