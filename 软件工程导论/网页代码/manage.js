const API_BASE = 'http://localhost:3000/api';

let currentModule = 'pets';
let isLoading = false;

const mockPets = [
  { id: 1, name: '奶糖', type: '猫', age: 2, gender: '雌性', images: ['../宠物列表image/奶糖.png'], description: '性格温顺的橘猫' },
  { id: 2, name: '雪球', type: '猫', age: 1, gender: '雄性', images: ['../宠物列表image/奶糖.png'], description: '活泼可爱的小白猫' },
  { id: 3, name: '布丁', type: '狗', age: 3, gender: '雄性', images: ['../宠物列表image/奶糖.png'], description: '忠诚友善的金毛犬' },
];

const mockAdoptions = [
  { 
    id: 1, 
    applicant: '张三', 
    petName: '奶糖', 
    phone: '13800138001', 
    email: 'zhangsan@example.com', 
    status: 'pending', 
    date: '2024-01-15', 
    message: '我非常喜欢这只小猫',
    address: '北京市朝阳区xxx街道',
    age: 28,
    income: '月收入15000元',
    petExperience: '有（养过/正在养）',
    experienceDetails: '之前养过一只金毛，养了5年，现在狗狗已经送到父母家了',
    companyTime: '3-6小时',
    movePlan: '如果搬家/换城市/出国，我会带宠物一起走，提前安排好托运事宜',
    visitAccept: '接受视频回访',
    adoptReasons: ['单纯喜欢宠物想陪伴', '给宠物一个稳定的家'],
    adoptReasonDetails: '我想要领养一只猫作为陪伴，工作之余有个伴，给它一个稳定温暖的家',
    problemAttitude: '我了解宠物可能会生病、掉毛、拆家、乱尿等问题，我已经做好心理准备，会耐心对待，及时就医',
    petSterilization: '了解，我会按时带宠物完成绝育手术',
    medicalCost: '愿意承担大病医疗',
  },
  { 
    id: 2, 
    applicant: '李四', 
    petName: '雪球', 
    phone: '13800138002', 
    email: 'lisi@example.com', 
    status: 'approved', 
    date: '2024-01-14', 
    message: '希望能给它一个温暖的家',
    address: '上海市浦东新区xxx路',
    age: 32,
    income: '月收入20000元',
    petExperience: '无（第一次养）',
    experienceDetails: '这是我第一次养宠物，但是我已经做了很多功课，准备好迎接它的到来',
    companyTime: '全天在家',
    movePlan: '我会提前联系救助站，一起商量解决办法，不会私自转送或遗弃',
    visitAccept: '接受上门回访',
    adoptReasons: ['单纯喜欢宠物想陪伴', '给宠物一个稳定的家'],
    adoptReasonDetails: '希望有个小动物陪伴，我会给它一个稳定温馨的家',
    problemAttitude: '我已经了解这些问题，会耐心引导和训练，生病时及时就医',
    petSterilization: '了解，会按时带宠物绝育',
    medicalCost: '愿意承担大病医疗',
  },
  { 
    id: 3, 
    applicant: '王五', 
    petName: '布丁', 
    phone: '13800138003', 
    email: 'wangwu@example.com', 
    status: 'rejected', 
    date: '2024-01-13', 
    message: '家里空间太小，暂时不合适',
    address: '广州市天河区xxx街道',
    age: 25,
    income: '月收入8000元',
    petExperience: '无（第一次养）',
    experienceDetails: '',
    companyTime: '1-3小时',
    movePlan: '',
    visitAccept: '仅接受偶尔发照片',
    adoptReasons: ['跟风一时兴起'],
    adoptReasonDetails: '',
    problemAttitude: '',
    petSterilization: '',
    medicalCost: '不确定',
  },
];

const mockUsers = [
  { id: 1, username: 'user001', email: 'user001@example.com', phone: '13800138001', registerDate: '2024-01-01', status: 'active' },
  { id: 2, username: 'user002', email: 'user002@example.com', phone: '13800138002', registerDate: '2024-01-05', status: 'active' },
  { id: 3, username: 'user003', email: 'user003@example.com', phone: '13800138003', registerDate: '2024-01-10', status: 'disabled' },
];

const elements = {
  sidebar: document.getElementById('sidebar'),
  toggleSidebar: document.getElementById('toggleSidebar'),
  menuBtn: document.getElementById('menuBtn'),
  navItems: document.querySelectorAll('.nav-item'),
  pageTitle: document.getElementById('pageTitle'),
  contentArea: document.getElementById('contentArea'),
  modalOverlay: document.getElementById('modalOverlay'),
  modal: document.getElementById('modal'),
  modalTitle: document.getElementById('modalTitle'),
  modalBody: document.getElementById('modalBody'),
  modalFooter: document.getElementById('modalFooter'),
  modalClose: document.getElementById('modalClose'),
  logoutBtn: document.getElementById('logoutBtn'),
  toast: document.getElementById('toast'),
};

function checkAuth() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function showToast(message, type = 'success') {
  elements.toast.textContent = message;
  elements.toast.className = `toast ${type}`;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3000);
}

function showLoading() {
  elements.contentArea.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
    </div>
  `;
}

function openModal(title, body, footer, isDetail = false) {
  elements.modalTitle.textContent = title;
  elements.modalBody.innerHTML = body;
  elements.modalFooter.innerHTML = footer;
  
  if (isDetail) {
    elements.modal.classList.add('detail-modal');
  } else {
    elements.modal.classList.remove('detail-modal');
  }
  
  elements.modalOverlay.classList.add('show');
}

function closeModal() {
  elements.modalOverlay.classList.remove('show');
}

function toggleSidebar() {
  elements.sidebar.classList.toggle('collapsed');
}

function toggleMobileSidebar() {
  elements.sidebar.classList.toggle('mobile-open');
}

function switchModule(module) {
  currentModule = module;
  elements.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.module === module);
  });
  if (window.innerWidth < 768) {
    elements.sidebar.classList.remove('mobile-open');
  }
  renderModule();
}

function renderModule() {
  showLoading();
  setTimeout(() => {
    switch (currentModule) {
      case 'pets':
        renderPetsModule();
        break;
      case 'adoptions':
        renderAdoptionsModule();
        break;
      case 'users':
        renderUsersModule();
        break;
    }
  }, 500);
}

function renderPetsModule() {
  elements.pageTitle.textContent = '宠物信息管理';
  elements.contentArea.innerHTML = `
    <div class="module-header">
      <div class="search-bar">
        <input type="text" class="search-input" id="petSearch" placeholder="搜索宠物名称..." />
        <select class="filter-select" id="petTypeFilter">
          <option value="">全部类型</option>
          <option value="猫">猫</option>
          <option value="狗">狗</option>
        </select>
      </div>
      <button class="add-btn" id="addPetBtn">➕ 添加宠物</button>
    </div>
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>图片</th>
            <th>名称</th>
            <th>类型</th>
            <th>年龄</th>
            <th>性别</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="petsTableBody">
        </tbody>
      </table>
    </div>
  `;
  renderPetsTable();
  document.getElementById('addPetBtn').addEventListener('click', openAddPetModal);
  document.getElementById('petSearch').addEventListener('input', filterPets);
  document.getElementById('petTypeFilter').addEventListener('change', filterPets);
}

function renderPetsTable(pets = mockPets) {
  const tbody = document.getElementById('petsTableBody');
  tbody.innerHTML = pets.map(pet => `
    <tr>
      <td><img src="${pet.images[0]}" class="pet-img" alt="${pet.name}" /></td>
      <td>${pet.name}</td>
      <td>${pet.type}</td>
      <td>${pet.age}岁</td>
      <td>${pet.gender}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-edit" onclick="editPet(${pet.id})">编辑</button>
          <button class="btn btn-delete" onclick="deletePet(${pet.id})">删除</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterPets() {
  const search = document.getElementById('petSearch').value.toLowerCase();
  const type = document.getElementById('petTypeFilter').value;
  const filtered = mockPets.filter(pet => {
    const matchSearch = pet.name.toLowerCase().includes(search);
    const matchType = !type || pet.type === type;
    return matchSearch && matchType;
  });
  renderPetsTable(filtered);
}

// 存储当前上传的图片
let currentUploadedImages = [];

function openAddPetModal() {
  currentUploadedImages = [];
  const body = `
    <form id="petForm">
      <div class="form-group">
        <label>宠物名称 *</label>
        <input type="text" class="form-input" id="petName" required />
        <div class="form-error" id="petNameError"></div>
      </div>
      <div class="form-group">
        <label>宠物类型 *</label>
        <select class="form-select" id="petType" required>
          <option value="">请选择</option>
          <option value="猫">猫</option>
          <option value="狗">狗</option>
        </select>
      </div>
      <div class="form-group">
        <label>年龄（岁）*</label>
        <input type="number" class="form-input" id="petAge" min="0" required />
      </div>
      <div class="form-group">
        <label>性别 *</label>
        <select class="form-select" id="petGender" required>
          <option value="">请选择</option>
          <option value="雄性">雄性</option>
          <option value="雌性">雌性</option>
        </select>
      </div>
      <div class="form-group">
        <label>描述</label>
        <textarea class="form-textarea" id="petDescription"></textarea>
      </div>
      <div class="form-group">
        <label>宠物图片（最多5张，支持JPG/PNG格式，单张不超过5MB）</label>
        <div class="upload-area" id="uploadArea">
          <div class="upload-placeholder" id="uploadPlaceholder">
            <span>📷</span>
            <p>点击或拖拽上传图片</p>
            <input type="file" id="fileInput" accept="image/jpeg,image/png" multiple />
          </div>
        </div>
        <div class="upload-progress" id="uploadProgress" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
          </div>
          <span class="progress-text">上传中...0%</span>
        </div>
        <div class="image-preview-container" id="imagePreviewContainer"></div>
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-cancel" onclick="closeModal()">取消</button>
    <button class="btn btn-confirm" onclick="savePet()">保存</button>
  `;
  openModal('添加宠物', body, footer);
  
  // 延迟绑定事件，确保DOM已渲染
  setTimeout(() => {
    bindUploadEvents();
  }, 50);
}

function editPet(id) {
  const pet = mockPets.find(p => p.id === id);
  if (!pet) return;
  currentUploadedImages = [...pet.images];
  const body = `
    <form id="petForm">
      <input type="hidden" id="petId" value="${pet.id}" />
      <div class="form-group">
        <label>宠物名称 *</label>
        <input type="text" class="form-input" id="petName" value="${pet.name}" required />
        <div class="form-error" id="petNameError"></div>
      </div>
      <div class="form-group">
        <label>宠物类型 *</label>
        <select class="form-select" id="petType" required>
          <option value="">请选择</option>
          <option value="猫" ${pet.type === '猫' ? 'selected' : ''}>猫</option>
          <option value="狗" ${pet.type === '狗' ? 'selected' : ''}>狗</option>
        </select>
      </div>
      <div class="form-group">
        <label>年龄（岁）*</label>
        <input type="number" class="form-input" id="petAge" min="0" value="${pet.age}" required />
      </div>
      <div class="form-group">
        <label>性别 *</label>
        <select class="form-select" id="petGender" required>
          <option value="">请选择</option>
          <option value="雄性" ${pet.gender === '雄性' ? 'selected' : ''}>雄性</option>
          <option value="雌性" ${pet.gender === '雌性' ? 'selected' : ''}>雌性</option>
        </select>
      </div>
      <div class="form-group">
        <label>描述</label>
        <textarea class="form-textarea" id="petDescription">${pet.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label>宠物图片（最多5张，支持JPG/PNG格式，单张不超过5MB）</label>
        <div class="upload-area" id="uploadArea">
          <div class="upload-placeholder" id="uploadPlaceholder">
            <span>📷</span>
            <p>点击或拖拽上传图片</p>
            <input type="file" id="fileInput" accept="image/jpeg,image/png" multiple />
          </div>
        </div>
        <div class="upload-progress" id="uploadProgress" style="display: none;">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
          </div>
          <span class="progress-text">上传中...0%</span>
        </div>
        <div class="image-preview-container" id="imagePreviewContainer"></div>
      </div>
    </form>
  `;
  const footer = `
    <button class="btn btn-cancel" onclick="closeModal()">取消</button>
    <button class="btn btn-confirm" onclick="savePet()">保存</button>
  `;
  openModal('编辑宠物', body, footer);
  
  // 延迟绑定事件，确保DOM已渲染
  setTimeout(() => {
    renderImagePreview();
    bindUploadEvents();
  }, 50);
}

function savePet() {
  const petId = document.getElementById('petId')?.value;
  const name = document.getElementById('petName').value.trim();
  const type = document.getElementById('petType').value;
  const age = document.getElementById('petAge').value;
  const gender = document.getElementById('petGender').value;
  const description = document.getElementById('petDescription').value;

  if (!name) {
    document.getElementById('petNameError').textContent = '请输入宠物名称';
    document.getElementById('petName').classList.add('error');
    return;
  }

  // 确保至少有一张图片
  const finalImages = currentUploadedImages.length > 0 
    ? currentUploadedImages 
    : ['../宠物列表image/奶糖.png'];

  if (petId) {
    const pet = mockPets.find(p => p.id === parseInt(petId));
    if (pet) {
      Object.assign(pet, { name, type, age: parseInt(age), gender, description, images: finalImages });
    }
    showToast('宠物信息更新成功');
  } else {
    const newPet = {
      id: mockPets.length + 1,
      name,
      type,
      age: parseInt(age),
      gender,
      description,
      images: finalImages,
    };
    mockPets.push(newPet);
    showToast('宠物添加成功');
  }
  closeModal();
  renderPetsModule();
}

function deletePet(id) {
  const body = `<p>确定要删除这只宠物吗？此操作不可恢复。</p>`;
  const footer = `
    <button class="btn btn-cancel" onclick="closeModal()">取消</button>
    <button class="btn btn-confirm" onclick="confirmDeletePet(${id})">确认删除</button>
  `;
  openModal('确认删除', body, footer);
}

function confirmDeletePet(id) {
  const index = mockPets.findIndex(p => p.id === id);
  if (index > -1) {
    mockPets.splice(index, 1);
  }
  closeModal();
  showToast('宠物删除成功');
  renderPetsModule();
}

function renderAdoptionsModule() {
  elements.pageTitle.textContent = '领养申请管理';
  elements.contentArea.innerHTML = `
    <div class="module-header">
      <div class="search-bar">
        <input type="text" class="search-input" id="adoptionSearch" placeholder="搜索申请人或宠物名..." />
        <select class="filter-select" id="adoptionStatusFilter">
          <option value="">全部状态</option>
          <option value="pending">待审核</option>
          <option value="approved">已通过</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>
    </div>
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>申请人</th>
            <th>申请宠物</th>
            <th>联系方式</th>
            <th>申请日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="adoptionsTableBody">
        </tbody>
      </table>
    </div>
    <div class="pagination" id="pagination"></div>
  `;
  renderAdoptionsTable();
  document.getElementById('adoptionSearch').addEventListener('input', filterAdoptions);
  document.getElementById('adoptionStatusFilter').addEventListener('change', filterAdoptions);
}

function renderAdoptionsTable(adoptions = mockAdoptions) {
  const tbody = document.getElementById('adoptionsTableBody');
  tbody.innerHTML = adoptions.map(adoption => `
    <tr>
      <td>${adoption.applicant}</td>
      <td>${adoption.petName}</td>
      <td>${adoption.phone}</td>
      <td>${adoption.date}</td>
      <td>
        <span class="status-badge status-${adoption.status}">
          ${adoption.status === 'pending' ? '待审核' : adoption.status === 'approved' ? '已通过' : '已拒绝'}
        </span>
      </td>
      <td>
        <div class="action-btns">
          ${adoption.status === 'pending' ? `
            <button class="btn btn-view" onclick="viewAdoptionDetail(${adoption.id})">查看详情</button>
          ` : '-'}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterAdoptions() {
  const search = document.getElementById('adoptionSearch').value.toLowerCase();
  const status = document.getElementById('adoptionStatusFilter').value;
  const filtered = mockAdoptions.filter(adoption => {
    const matchSearch = adoption.applicant.toLowerCase().includes(search) || adoption.petName.toLowerCase().includes(search);
    const matchStatus = !status || adoption.status === status;
    return matchSearch && matchStatus;
  });
  renderAdoptionsTable(filtered);
}

let currentAdoptionId = null;

function viewAdoptionDetail(id) {
  const adoption = mockAdoptions.find(a => a.id === id);
  if (!adoption) return;
  
  currentAdoptionId = id;
  
  const body = `
    <div class="adoption-detail-container">
      <div class="detail-section">
        <h3 class="detail-title">📋 基本信息</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">申请人姓名</span>
            <span class="detail-value">${adoption.applicant}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">联系电话</span>
            <span class="detail-value">${adoption.phone}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">电子邮箱</span>
            <span class="detail-value">${adoption.email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">详细住址</span>
            <span class="detail-value">${adoption.address}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">年龄</span>
            <span class="detail-value">${adoption.age}岁</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">申请日期</span>
            <span class="detail-value">${adoption.date}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">申请宠物</span>
            <span class="detail-value">${adoption.petName}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">收入情况</span>
            <span class="detail-value">${adoption.income}</span>
          </div>
        </div>
      </div>
      
      <h2 class="section-title">📋 领养申请问卷</h2>
      
      <div class="detail-section">
        <h3 class="detail-title">一、基本信息</h3>
        <div class="question-item">
          <div class="question-label">6. 是否有养宠经验？</div>
          <div class="question-answer">${adoption.petExperience}</div>
          ${adoption.experienceDetails ? `
            <div class="question-answer detail-answer">补充说明：${adoption.experienceDetails}</div>
          ` : ''}
        </div>
        <div class="question-item">
          <div class="question-label">7. 每天能陪伴宠物的时间大概多久？</div>
          <div class="question-answer">${adoption.companyTime}</div>
        </div>
        <div class="question-item">
          <div class="question-label">8. 如果后续搬家/换城市/出国，宠物会如何安置？</div>
          <div class="question-answer">${adoption.movePlan || '未填写'}</div>
        </div>
        <div class="question-item">
          <div class="question-label">9. 是否能接受定期回访？</div>
          <div class="question-answer">${adoption.visitAccept}</div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="detail-title">二、领养动机</h3>
        <div class="question-item">
          <div class="question-label">10. 领养原因是什么？</div>
          <div class="question-answer">
            ${adoption.adoptReasons.map(r => `<span class="reason-tag">${r}</span>`).join('')}
          </div>
          ${adoption.adoptReasonDetails ? `
            <div class="question-answer detail-answer">补充说明：${adoption.adoptReasonDetails}</div>
          ` : ''}
        </div>
        <div class="question-item">
          <div class="question-label">11. 是否能接受宠物可能会生病、掉毛、拆家、乱尿等问题？</div>
          <div class="question-answer">${adoption.problemAttitude || '未填写'}</div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3 class="detail-title">三、健康与医疗</h3>
        <div class="question-item">
          <div class="question-label">12. 是否了解宠物绝育、疫苗、驱虫相关知识？</div>
          <div class="question-answer">${adoption.petSterilization || '未填写'}</div>
        </div>
        <div class="question-item">
          <div class="question-label">13. 宠物生病时是否愿意承担医疗费用？</div>
          <div class="question-answer">${adoption.medicalCost}</div>
        </div>
      </div>
    </div>
  `;
  
  const footer = `
    <button class="btn btn-cancel" onclick="closeModal()">关闭</button>
    <button class="btn btn-reject" onclick="showRejectModal(${id})">拒绝申请</button>
    <button class="btn btn-approve" onclick="showApproveModal(${id})">通过申请</button>
  `;
  
  // 打开详情模态框
  openModal('领养申请详情', body, footer, true);
}

function showApproveModal(id) {
  closeModal();
  setTimeout(() => {
    const body = `
      <div class="form-group">
        <label>审核意见（选填）</label>
        <textarea class="form-textarea" id="reviewMessage" placeholder="请输入审核意见（选填）"></textarea>
      </div>
    `;
    const footer = `
      <button class="btn btn-cancel" onclick="closeModal()">取消</button>
      <button class="btn btn-confirm" onclick="confirmApproveAdoption(${id})">确认通过</button>
    `;
    openModal('通过申请', body, footer);
  }, 100);
}

function confirmApproveAdoption(id) {
  const adoption = mockAdoptions.find(a => a.id === id);
  if (adoption) {
    adoption.status = 'approved';
  }
  closeModal();
  showToast('申请已通过');
  renderAdoptionsModule();
}

function showRejectModal(id) {
  closeModal();
  setTimeout(() => {
    const body = `
      <div class="form-group">
        <label>拒绝原因 *</label>
        <textarea class="form-textarea" id="reviewMessage" placeholder="请输入拒绝原因"></textarea>
      </div>
    `;
    const footer = `
      <button class="btn btn-cancel" onclick="closeModal()">取消</button>
      <button class="btn btn-confirm" onclick="confirmRejectAdoption(${id})">确认拒绝</button>
    `;
    openModal('拒绝申请', body, footer);
  }, 100);
}

function confirmRejectAdoption(id) {
  const message = document.getElementById('reviewMessage').value.trim();
  if (!message) {
    showToast('请输入拒绝原因', 'error');
    return;
  }
  const adoption = mockAdoptions.find(a => a.id === id);
  if (adoption) {
    adoption.status = 'rejected';
  }
  closeModal();
  showToast('申请已拒绝');
  renderAdoptionsModule();
}

function renderUsersModule() {
  elements.pageTitle.textContent = '用户信息管理';
  elements.contentArea.innerHTML = `
    <div class="module-header">
      <div class="search-bar">
        <input type="text" class="search-input" id="userSearch" placeholder="搜索用户名或邮箱..." />
      </div>
    </div>
    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th>用户ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>注册日期</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody id="usersTableBody">
        </tbody>
      </table>
    </div>
  `;
  renderUsersTable();
  document.getElementById('userSearch').addEventListener('input', filterUsers);
}

function renderUsersTable(users = mockUsers) {
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td>${user.registerDate}</td>
      <td>
        <span class="status-badge status-${user.status}">
          ${user.status === 'active' ? '正常' : '禁用'}
        </span>
      </td>
      <td>
        <div class="action-btns">
          ${user.status === 'active' ? 
            `<button class="btn btn-disable" onclick="toggleUserStatus(${user.id}, 'disabled')">禁用</button>` :
            `<button class="btn btn-enable" onclick="toggleUserStatus(${user.id}, 'active')">启用</button>`
          }
        </div>
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const search = document.getElementById('userSearch').value.toLowerCase();
  const filtered = mockUsers.filter(user => 
    user.username.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)
  );
  renderUsersTable(filtered);
}

function toggleUserStatus(id, status) {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    user.status = status;
  }
  showToast(status === 'active' ? '用户已启用' : '用户已禁用');
  renderUsersModule();
}

function logout() {
  // 清除所有用户状态
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUsername');
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  window.location.href = 'login.html';
}

function bindEvents() {
  elements.toggleSidebar.addEventListener('click', toggleSidebar);
  elements.menuBtn.addEventListener('click', toggleMobileSidebar);
  elements.modalClose.addEventListener('click', closeModal);
  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) closeModal();
  });
  elements.logoutBtn.addEventListener('click', logout);
  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchModule(item.dataset.module);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modalOverlay.classList.contains('show')) {
      closeModal();
    }
  });
}

function init() {
  if (!checkAuth()) return;
  const adminUsername = localStorage.getItem('adminUsername');
  if (adminUsername) {
    document.getElementById('adminName').textContent = adminUsername;
  }
  bindEvents();
  renderModule();
}

// ==================== 图片上传相关函数 ====================

function bindUploadEvents() {
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');
  
  if (fileInput) {
    fileInput.addEventListener('change', handleFileSelect);
  }
  
  if (uploadArea) {
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const files = e.dataTransfer.files;
      handleFiles(files);
    });
  }
}

function handleFileSelect(e) {
  const files = e.target.files;
  handleFiles(files);
}

function handleFiles(files) {
  if (!files || files.length === 0) return;
  
  // 检查数量是否超出限制
  const remainingCount = 5 - currentUploadedImages.length;
  if (remainingCount <= 0) {
    showToast('最多只能上传5张图片', 'error');
    return;
  }
  
  const validFiles = [];
  for (let i = 0; i < files.length && validFiles.length < remainingCount; i++) {
    const file = files[i];
    
    // 检查格式
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast(`"${file.name}" 格式不正确，仅支持JPG/PNG`, 'error');
      continue;
    }
    
    // 检查大小 (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      showToast(`"${file.name}" 超过5MB限制`, 'error');
      continue;
    }
    
    validFiles.push(file);
  }
  
  if (validFiles.length > 0) {
    simulateUpload(validFiles);
  }
}

function simulateUpload(files) {
  const uploadProgress = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.querySelector('.progress-text');
  
  if (uploadProgress) {
    uploadProgress.style.display = 'flex';
  }
  
  let progress = 0;
  const totalFiles = files.length;
  let processedFiles = 0;
  
  // 模拟上传进度
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // 处理完所有文件
      processFilesToBase64(files);
      
      // 隐藏进度条
      setTimeout(() => {
        if (uploadProgress) {
          uploadProgress.style.display = 'none';
        }
        progress = 0;
        if (progressFill) {
          progressFill.style.width = '0%';
        }
        if (progressText) {
          progressText.textContent = '上传中...0%';
        }
      }, 500);
    }
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    if (progressText) {
      progressText.textContent = `上传中...${Math.floor(progress)}%`;
    }
  }, 100);
}

function processFilesToBase64(files) {
  let processed = 0;
  const total = files.length;
  
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentUploadedImages.push(e.target.result);
      processed++;
      
      if (processed === total) {
        renderImagePreview();
        showToast('图片上传成功');
      }
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreview() {
  const container = document.getElementById('imagePreviewContainer');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  currentUploadedImages.forEach((src, index) => {
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.innerHTML = `
      <img src="${src}" alt="预览图片 ${index + 1}" />
      <button class="delete-image-btn" onclick="deleteImage(${index})" title="删除图片">×</button>
    `;
    container.appendChild(previewItem);
  });
  
  // 根据图片数量控制上传区域的显示
  if (uploadPlaceholder) {
    if (currentUploadedImages.length >= 5) {
      uploadPlaceholder.style.display = 'none';
    } else {
      uploadPlaceholder.style.display = 'flex';
    }
  }
}

function deleteImage(index) {
  currentUploadedImages.splice(index, 1);
  renderImagePreview();
  showToast('图片已删除');
}

init();
