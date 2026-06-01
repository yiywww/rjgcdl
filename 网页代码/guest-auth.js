const ALLOWED_PAGES = ['pet-list-new.html', 'adopt-detail.html'];
const ALLOWED_PAGE_PREFIXES = ['pet-list-new', 'adopt-detail'];

function isGuest() {
  // 检查是否为游客：userRole为guest 且 没有token且没有isLoggedIn标记
  const hasToken = localStorage.getItem('token') !== null;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isGuestRole = localStorage.getItem('userRole') === 'guest';
  
  // 如果有token或isLoggedIn标记，说明已登录，不是游客
  if (hasToken || isLoggedIn) {
    return false;
  }
  
  // 只有userRole为guest时才是游客
  return isGuestRole;
}

function getCurrentPage() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf('/') + 1);
}

function isPageAllowed(pageName) {
  return ALLOWED_PAGES.includes(pageName) || 
         ALLOWED_PAGE_PREFIXES.some(prefix => pageName.startsWith(prefix));
}

// 将函数暴露到全局作用域
window.showGuestModal = function() {
  // 检查弹窗是否已存在
  if (document.getElementById('guestModalOverlay')) {
    return;
  }

  const modalHtml = `
    <div class="guest-modal-overlay" id="guestModalOverlay">
      <div class="guest-modal">
        <div class="guest-modal-content">
          <div class="guest-modal-icon">🔒</div>
          <p class="guest-modal-text">当前为游客模式，请先注册登录</p>
        </div>
        <div class="guest-modal-buttons">
          <button class="guest-modal-btn guest-modal-btn-back" id="guestModalBack">返回</button>
          <button class="guest-modal-btn guest-modal-btn-login" id="guestModalLogin">登录</button>
        </div>
      </div>
    </div>
    <style>
      .guest-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .guest-modal {
        background: #fff;
        border-radius: 8px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideIn 0.3s ease;
      }
      @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .guest-modal-content {
        margin-bottom: 25px;
      }
      .guest-modal-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      .guest-modal-text {
        font-size: 16px;
        color: #333;
        margin: 0;
      }
      .guest-modal-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
      }
      .guest-modal-btn {
        flex: 1;
        height: 45px;
        background: #f0f0f0;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;
        max-width: 150px;
      }
      .guest-modal-btn:hover {
        background: #f8a5c2;
        color: #fff;
      }
      .guest-modal-btn-login {
        background: #f8a5c2;
        color: #fff;
      }
      .guest-modal-btn-login:hover {
        background: #f78fb3;
      }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const overlay = document.getElementById('guestModalOverlay');
  const backBtn = document.getElementById('guestModalBack');
  const loginBtn = document.getElementById('guestModalLogin');

  backBtn.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'pet-list-new.html';
    }
  });

  loginBtn.addEventListener('click', () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

function protectLinks() {
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      if (isGuest()) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          const targetPage = href.substring(href.lastIndexOf('/') + 1);
          if (!isPageAllowed(targetPage)) {
            e.preventDefault();
            showGuestModal();
          }
        }
      }
    });
  });
}

function protectButtons() {
  const buttons = document.querySelectorAll('button:not(.guest-modal-btn):not([data-no-protect])');
  buttons.forEach(btn => {
    const originalClick = btn.onclick;
    btn.addEventListener('click', (e) => {
      if (isGuest()) {
        const btnText = btn.textContent.trim();
        const restrictedActions = ['立即领养', '申请领养', '捐赠', '收藏', '个人中心', '我的'];
        if (restrictedActions.some(action => btnText.includes(action))) {
          e.preventDefault();
          e.stopPropagation();
          showGuestModal();
        }
      }
    }, true);
  });
}

function protectPageAccess() {
  if (isGuest()) {
    const currentPage = getCurrentPage();
    if (!isPageAllowed(currentPage) && currentPage !== 'login.html') {
      showGuestModal();
    }
  }
}

function initGuestProtection() {
  protectPageAccess();
  setTimeout(() => {
    protectLinks();
    protectButtons();
  }, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGuestProtection);
} else {
  initGuestProtection();
}
