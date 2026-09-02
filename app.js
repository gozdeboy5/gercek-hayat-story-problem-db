/**
 * Gerçek Hayat Story Problem & Veritabanı Portalı Engine
 * Prisma ORM & PostgreSQL (db.prisma.io) & Vercel API Entegrasyonlu Motor
 */

// Global State Management
let currentView = 'landing'; // 'landing' | 'login' | 'dashboard'
let dashboardTab = 'db';    // 'db' | 'generator'
let authMode = 'login';     // 'login' | 'register'
let currentUser = null;
let authToken = null;

let currentTheme = 'minecraft';
let currentTopic = 'fractions';
let currentProblem = null;
let score = 0;
let streak = 0;

// LocalStorage Database Keys
const DB_STORAGE_KEY = 'storymath_db_records';
const USER_STORAGE_KEY = 'storymath_user_session';
const TOKEN_STORAGE_KEY = 'storymath_jwt_token';

// Theme Icon & Name Map
const THEME_DATA = {
  minecraft: { name: 'Minecraft', icon: '⛏️', color: 'amber' },
  football: { name: 'Futbol', icon: '⚽', color: 'emerald' },
  space: { name: 'Uzay', icon: '🚀', color: 'cyan' },
  cats: { name: 'Kediler', icon: '🐱', color: 'orange' },
  food: { name: 'Yemek & Mutfak', icon: '🍕', color: 'red' },
  robotics: { name: 'Robotik / AI', icon: '🤖', color: 'blue' },
  superhero: { name: 'Süper Kahramanlar', icon: '🦸', color: 'purple' },
  music: { name: 'Müzik & Konser', icon: '🎵', color: 'pink' }
};

const TOPIC_DATA = {
  fractions: { name: 'Kesirlerde Toplama ve Çıkarma', grade: '6. Sınıf' },
  decimals: { name: 'Ondalık Gösterimler', grade: '6. Sınıf' },
  ratio: { name: 'Oran ve Orantı', grade: '7. Sınıf' },
  percentages: { name: 'Yüzdeler ve Kar-Zarar', grade: '7. Sınıf' },
  algebra: { name: 'Cebirsel İfadeler', grade: '7. Sınıf' },
  equations: { name: 'Bir Bilinmeyenli Denklemler', grade: '7. Sınıf' },
  exponents: { name: 'Üslü İfadeler', grade: '8. Sınıf' },
  square_roots: { name: 'Kareköklü İfadeler', grade: '8. Sınıf' },
  data_analysis: { name: 'Veri Analizi', grade: '8. Sınıf' },
  probability: { name: 'Olasılık', grade: '8. Sınıf' }
};

// Initial Database Records
const SEED_DATABASE = [
  {
    id: 'DB-101',
    title: "Steve'in İksir Deposu",
    theme: 'minecraft',
    topic: 'fractions',
    grade: '6. Sınıf',
    story: "Steve, Ejderha savaşı öncesinde iksir deposunu düzenlemek istiyor. Elindeki büyük cam şişenin $\\frac{1}{3}$'ini İyileşme İksiri ile, $\\frac{2}{5}$'sini ise Hız İksiri ile doldurdu. Kalan kısmı Boşluk İksiri ile dolduracaktır.",
    question: "Steve'in cam şişesinin kaçta kaçı Boşluk İksiri ile dolacaktır?",
    hint: "İki iksir miktarını toplayıp 1 tamdan çıkarın.",
    solutionSteps: "1. Toplam: $\\frac{1}{3} + \\frac{2}{5} = \\frac{11}{15}$\n2. Kalan: $1 - \\frac{11}{15} = \\frac{4}{15}$",
    correctAnswer: "4/15",
    displayAnswer: "$$\\frac{4}{15}$$",
    date: "2026-09-01"
  },
  {
    id: 'DB-102',
    title: "Süper Lig Antrenman Sahası",
    theme: 'football',
    topic: 'fractions',
    grade: '6. Sınıf',
    story: "Teknik direktör antrenman sahasının $\\frac{1}{4}$'ini pas çalışması, $\\frac{1}{3}$'ini şut çalışmasına ayırdı. Kalan kısım kaleciler içindir.",
    question: "Antrenman sahasının kaçta kaçı kalecilere ayrılmıştır?",
    hint: "Pas ve şut alanlarını toplayıp 1 tamdan düşürün.",
    solutionSteps: "1. Toplam: $\\frac{1}{4} + \\frac{1}{3} = \\frac{7}{12}$\n2. Kalan: $1 - \\frac{7}{12} = \\frac{5}{12}$",
    correctAnswer: "5/12",
    displayAnswer: "$$\\frac{5}{12}$$",
    date: "2026-09-02"
  },
  {
    id: 'DB-103',
    title: "Maç Biletlerinde İndirim Kampanyası",
    theme: 'football',
    topic: 'percentages',
    grade: '7. Sınıf',
    story: "Normal fiyatı 200 TL olan maraton biletlerine %20 indirim uygulanacaktır.",
    question: "İndirim sonrasında bir biletin yeni fiyatı kaç TL olur?",
    hint: "200 TL'nin %20'sini hesaplayıp düşürün.",
    solutionSteps: "1. İndirim: $200 \\times \\frac{20}{100} = 40$ TL\n2. Fiyat: $200 - 40 = 160$ TL",
    correctAnswer: "160",
    displayAnswer: "$160$ TL",
    date: "2026-09-02"
  },
  {
    id: 'DB-104',
    title: "Kaptan Şimşek'in Güç Kristali",
    theme: 'superhero',
    topic: 'equations',
    grade: '7. Sınıf',
    story: "Kaptan Şimşek'in deposundaki kristal sayısı $x$'tir. Kristal sayısının 3 katının 10 fazlası 40 birime eşittir.",
    question: "Deposunda kaç adet güç kristali vardır?",
    hint: "$3x + 10 = 40$ denklemini çözün.",
    solutionSteps: "1. $3x = 40 - 10 = 30$\n2. $x = 10$",
    correctAnswer: "10",
    displayAnswer: "$x = 10$",
    date: "2026-09-02"
  }
];

// Math Helper Functions
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function simplifyFraction(num, den) {
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ----------------------------------------------------
// VIEW NAVIGATION & AUTHENTICATION MANAGER
// ----------------------------------------------------
function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll('.app-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) {
    targetView.classList.add('active-view');
  }

  if (viewName === 'dashboard') {
    initDatabase();
    renderDatabaseTable();
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');

  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  if (mode === 'login') {
    tabLogin.className = 'py-2.5 rounded-xl bg-white text-indigo-700 shadow-sm transition font-bold';
    tabRegister.className = 'py-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition font-bold';
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  } else {
    tabRegister.className = 'py-2.5 rounded-xl bg-white text-indigo-700 shadow-sm transition font-bold';
    tabLogin.className = 'py-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition font-bold';
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

// Local User Accounts Storage Helper
function getLocalUsers() {
  const stored = localStorage.getItem('storymath_local_users');
  if (!stored) return [];
  try { return JSON.parse(stored); } catch(e) { return []; }
}

function saveLocalUser(user) {
  const users = getLocalUsers();
  users.push(user);
  localStorage.setItem('storymath_local_users', JSON.stringify(users));
}

// REGISTER API SUBMISSION
async function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  
  const emailInput = document.getElementById('register-email');
  const usernameInput = document.getElementById('register-username');
  const passwordInput = document.getElementById('register-password');
  const roleInput = document.getElementById('register-role');

  const email = emailInput ? emailInput.value.trim() : '';
  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';
  const role = roleInput ? roleInput.value : 'STUDENT';

  if (!email || !username || !password) {
    showToast('Lütfen tüm alanları doldurunuz.', 'fa-triangle-exclamation');
    return;
  }

  const btn = document.getElementById('btn-register-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Kaydediliyor...';
  }

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, role })
    });

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Kayıt işlemi başarısız.', 'fa-triangle-exclamation');
        return;
      }
      currentUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role === 'TEACHER' ? 'Öğretmen' : 'Öğrenci'
      };
      authToken = data.token;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);

      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.innerText = `${currentUser.username} (${currentUser.role})`;
      showToast(`PostgreSQL Veritabanına Kaydolundu! 🎉`, 'fa-circle-check');
      switchView('dashboard');
      return;
    }
    throw new Error('API unavailable, switching to local DB');
  } catch (err) {
    const localUsers = getLocalUsers();
    const existing = localUsers.find(u => 
      (u.email && u.email.toLowerCase() === email.toLowerCase()) || 
      (u.username && u.username.toLowerCase() === username.toLowerCase())
    );

    if (existing) {
      if (existing.email && existing.email.toLowerCase() === email.toLowerCase()) {
        showToast('Bu e-posta adresi zaten kayıtlı.', 'fa-triangle-exclamation');
      } else {
        showToast('Bu kullanıcı adı zaten alınmış.', 'fa-triangle-exclamation');
      }
      return;
    }

    const newUser = {
      id: 'LOCAL-' + Date.now(),
      email: email.toLowerCase(),
      username,
      password,
      role: role === 'TEACHER' ? 'Öğretmen' : 'Öğrenci'
    };
    saveLocalUser(newUser);

    currentUser = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    const nameEl = document.getElementById('user-display-name');
    if (nameEl) nameEl.innerText = `${currentUser.username} (${currentUser.role})`;
    showToast(`Hesap oluşturuldu! Hoş geldiniz, ${username} 🎉`, 'fa-circle-check');
    switchView('dashboard');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Hesap Oluştur ve Kaydol';
    }
  }
}

// LOGIN API SUBMISSION
async function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  const usernameOrEmail = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!usernameOrEmail || !password) {
    showToast('Lütfen kullanıcı adı/e-posta ve parolayı giriniz.', 'fa-triangle-exclamation');
    return;
  }

  const btn = document.getElementById('btn-login-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Doğrulanıyor...';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail, password })
    });

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Giriş başarısız.', 'fa-triangle-exclamation');
        return;
      }
      currentUser = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role === 'TEACHER' ? 'Öğretmen' : 'Öğrenci'
      };
      authToken = data.token;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);

      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.innerText = `${currentUser.username} (${currentUser.role})`;
      showToast(`Giriş başarılı! Hoş geldiniz, ${currentUser.username} 👋`, 'fa-circle-check');
      switchView('dashboard');
      return;
    }
    throw new Error('API unavailable, switching to local DB');
  } catch (err) {
    const localUsers = getLocalUsers();
    const identifier = usernameOrEmail.toLowerCase();
    const foundUser = localUsers.find(u => 
      (u.email && u.email.toLowerCase() === identifier) || 
      (u.username && u.username.toLowerCase() === identifier)
    );

    if (foundUser) {
      if (foundUser.password !== password) {
        showToast('Hatalı parola!', 'fa-triangle-exclamation');
        return;
      }
      currentUser = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.innerText = `${currentUser.username} (${currentUser.role})`;
      showToast(`Giriş başarılı! Hoş geldiniz, ${currentUser.username} 👋`, 'fa-circle-check');
      switchView('dashboard');
    } else {
      currentUser = {
        username: usernameOrEmail,
        role: 'Öğrenci'
      };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      const nameEl = document.getElementById('user-display-name');
      if (nameEl) nameEl.innerText = `${currentUser.username} (${currentUser.role})`;
      showToast(`Giriş yapıldı: ${currentUser.username}! 👋`, 'fa-circle-check');
      switchView('dashboard');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Giriş Yap';
    }
  }
}

function quickDemoLogin() {
  currentUser = {
    username: 'Demo Kullanıcı',
    role: 'Öğretmen / Admin'
  };
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
  document.getElementById('user-display-name').innerText = `${currentUser.username} (${currentUser.role})`;
  
  showToast('Demo hesabı ile hızlı giriş yapıldı! 🚀', 'fa-bolt');
  switchView('dashboard');
}

function handleLogout() {
  currentUser = null;
  authToken = null;
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  showToast('Oturum kapatıldı.', 'fa-right-from-bracket');
  switchView('landing');
}

// ----------------------------------------------------
// DATABASE MANAGEMENT ENGINE (localStorage & PostgreSQL API)
// ----------------------------------------------------
function getDatabaseRecords() {
  const stored = localStorage.getItem(DB_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(SEED_DATABASE));
    return SEED_DATABASE;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return SEED_DATABASE;
  }
}

function saveDatabaseRecords(records) {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(records));
  document.getElementById('db-count-badge').innerText = records.length;
}

function initDatabase() {
  const records = getDatabaseRecords();
  document.getElementById('db-count-badge').innerText = records.length;
}

function renderDatabaseTable() {
  const records = getDatabaseRecords();
  filterDatabase(records);
}

function filterDatabase(customRecords = null) {
  const records = customRecords || getDatabaseRecords();
  const query = (document.getElementById('db-search').value || '').toLowerCase().trim();
  const themeFilter = document.getElementById('db-filter-theme').value;
  const topicFilter = document.getElementById('db-filter-topic').value;

  const filtered = records.filter(item => {
    const matchesSearch = !query || 
      item.title.toLowerCase().includes(query) || 
      item.story.toLowerCase().includes(query) || 
      item.question.toLowerCase().includes(query);
    const matchesTheme = themeFilter === 'all' || item.theme === themeFilter;
    const matchesTopic = topicFilter === 'all' || item.topic === topicFilter;
    return matchesSearch && matchesTheme && matchesTopic;
  });

  const tbody = document.getElementById('db-table-body');
  const emptyState = document.getElementById('db-empty-state');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  tbody.innerHTML = filtered.map(item => {
    const themeObj = THEME_DATA[item.theme] || { icon: '📌', name: item.theme };
    const topicObj = TOPIC_DATA[item.topic] || { name: item.topic, grade: '' };

    return `
      <tr>
        <td class="font-mono text-xs font-bold text-slate-400">${item.id}</td>
        <td class="font-bold text-slate-900">${item.title}</td>
        <td>
          <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
            ${themeObj.icon} ${themeObj.name}
          </span>
        </td>
        <td class="text-xs font-medium text-slate-600">${topicObj.name}</td>
        <td class="text-xs font-semibold text-purple-700">${item.grade || topicObj.grade}</td>
        <td class="font-mono text-xs font-bold text-emerald-700">${item.correctAnswer}</td>
        <td class="text-xs text-slate-400">${item.date || '2026-09-02'}</td>
        <td class="text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="loadProblemFromDB('${item.id}')" class="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 font-bold text-xs flex items-center gap-1">
              <i class="fa-solid fa-eye"></i> İncele / Çöz
            </button>
            <button onclick="deleteProblemFromDB('${item.id}')" class="p-2 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function saveCurrentProblemToDB() {
  if (!currentProblem) {
    showToast('Önce bir problem oluşturmalısınız!', 'fa-triangle-exclamation');
    return;
  }

  const records = getDatabaseRecords();
  const newId = `DB-${100 + records.length + 1}`;
  const topicObj = TOPIC_DATA[currentTopic];

  const newRecord = {
    id: newId,
    title: currentProblem.title,
    theme: currentTheme,
    topic: currentTopic,
    grade: topicObj.grade,
    story: currentProblem.story,
    question: currentProblem.question,
    hint: currentProblem.hint,
    solutionSteps: currentProblem.solutionSteps,
    correctAnswer: currentProblem.correctAnswer,
    displayAnswer: currentProblem.displayAnswer,
    date: new Date().toISOString().split('T')[0]
  };

  records.unshift(newRecord);
  saveDatabaseRecords(records);

  showToast(`Problem veritabanına kaydedildi (${newId}) 💾`, 'fa-bookmark');
  renderDatabaseTable();
}

function deleteProblemFromDB(id) {
  let records = getDatabaseRecords();
  records = records.filter(r => r.id !== id);
  saveDatabaseRecords(records);
  showToast(`Kayıt silindi (${id})`, 'fa-trash');
  renderDatabaseTable();
}

function loadProblemFromDB(id) {
  const records = getDatabaseRecords();
  const record = records.find(r => r.id === id);
  if (!record) return;

  currentProblem = {
    title: record.title,
    story: record.story,
    question: record.question,
    hint: record.hint,
    solutionSteps: record.solutionSteps,
    correctAnswer: record.correctAnswer,
    displayAnswer: record.displayAnswer
  };

  currentTheme = record.theme;
  currentTopic = record.topic;

  switchDashboardTab('generator');
  
  const themeObj = THEME_DATA[currentTheme] || { icon: '📌', name: currentTheme };
  const topicObj = TOPIC_DATA[currentTopic] || { name: currentTopic, grade: '' };

  document.getElementById('problem-icon').innerText = themeObj.icon;
  document.getElementById('problem-title').innerText = currentProblem.title;
  document.getElementById('problem-subtitle').innerText = `${topicObj.grade} ${topicObj.name}`;
  
  document.getElementById('active-badge-theme').innerText = `${themeObj.icon} ${themeObj.name}`;
  document.getElementById('active-badge-topic').innerText = topicObj.name;

  document.getElementById('problem-story').innerHTML = `<p>${currentProblem.story}</p>`;
  document.getElementById('problem-question').innerHTML = currentProblem.question;
  document.getElementById('hint-text').innerHTML = currentProblem.hint;
  document.getElementById('solution-steps').innerHTML = currentProblem.solutionSteps.trim();

  const answerInput = document.getElementById('student-answer');
  if (answerInput) {
    answerInput.value = '';
    answerInput.classList.remove('border-emerald-500', 'border-rose-500');
  }
  
  const feedback = document.getElementById('answer-feedback');
  if (feedback) {
    feedback.className = 'hidden mt-3 p-3 rounded-xl text-sm font-semibold flex items-center gap-2';
    feedback.innerHTML = '';
  }

  closeAccordions();
  setTimeout(renderMath, 50);
}

function exportDatabaseJSON() {
  const records = getDatabaseRecords();
  const jsonStr = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `StoryMath_PostgreSQL_Veritabani_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Veritabanı JSON olarak indirildi 📥', 'fa-download');
}

function openAddProblemModal() {
  document.getElementById('modal-add-problem').classList.remove('hidden');
}

function closeAddProblemModal() {
  document.getElementById('modal-add-problem').classList.add('hidden');
}

function handleManualProblemAdd(e) {
  e.preventDefault();
  const title = document.getElementById('add-title').value.trim();
  const theme = document.getElementById('add-theme').value;
  const topic = document.getElementById('add-topic').value;
  const story = document.getElementById('add-story').value.trim();
  const question = document.getElementById('add-question').value.trim();
  const answer = document.getElementById('add-answer').value.trim();
  const hint = document.getElementById('add-hint').value.trim();

  const records = getDatabaseRecords();
  const newId = `DB-${100 + records.length + 1}`;
  const topicObj = TOPIC_DATA[topic];

  const newRecord = {
    id: newId,
    title,
    theme,
    topic,
    grade: topicObj.grade,
    story,
    question,
    hint,
    solutionSteps: `1. **Soru Çözümü:** ${question}\n2. **Sonuç:** ${answer}`,
    correctAnswer: answer,
    displayAnswer: answer,
    date: new Date().toISOString().split('T')[0]
  };

  records.unshift(newRecord);
  saveDatabaseRecords(records);
  closeAddProblemModal();

  showToast(`Yeni kayıt eklendi (${newId}) ✨`, 'fa-circle-check');
  renderDatabaseTable();
}

function switchDashboardTab(tabName) {
  dashboardTab = tabName;
  const btnDb = document.getElementById('tab-btn-db');
  const btnGen = document.getElementById('tab-btn-generator');

  const contentDb = document.getElementById('tab-content-db');
  const contentGen = document.getElementById('tab-content-generator');

  if (tabName === 'db') {
    btnDb.className = 'px-5 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition bg-indigo-600 text-white shadow-md';
    btnGen.className = 'px-5 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition text-slate-600 hover:bg-white';
    contentDb.classList.remove('hidden');
    contentGen.classList.add('hidden');
  } else {
    btnGen.className = 'px-5 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition bg-indigo-600 text-white shadow-md';
    btnDb.className = 'px-5 py-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 transition text-slate-600 hover:bg-white';
    contentGen.classList.remove('hidden');
    contentDb.classList.add('hidden');
  }
}

// ----------------------------------------------------
// PROBLEM GENERATOR ALGORITHMS
// ----------------------------------------------------
const PROBLEM_GENERATORS = {
  fractions: function(theme) {
    const pair = getRandomArrayElement([
      { n1: 1, d1: 3, n2: 2, d2: 5 },
      { n1: 1, d1: 4, n2: 1, d2: 3 },
      { n1: 2, d1: 5, n2: 1, d2: 4 },
      { n1: 1, d1: 2, n2: 1, d2: 6 },
      { n1: 3, d1: 10, n2: 2, d2: 5 }
    ]);

    const sumNum = pair.n1 * pair.d2 + pair.n2 * pair.d1;
    const commonDen = pair.d1 * pair.d2;
    const simpSum = simplifyFraction(sumNum, commonDen);
    
    const remNum = simpSum.den - simpSum.num;
    const remDen = simpSum.den;
    const simpRem = simplifyFraction(remNum, remDen);
    const answerStr = `${simpRem.num}/${simpRem.den}`;

    let title, story, question, hint, solutionSteps;

    if (theme === 'minecraft') {
      title = "Steve'in İksir Deposu";
      story = `Steve, Ejderha savaşı öncesinde iksir deposunu düzenlemek istiyor. Elindeki büyük cam şişenin $\\frac{${pair.n1}}{${pair.d1}}$'ini İyileşme İksiri ile, $\\frac{${pair.n2}}{${pair.d2}}$'sini ise Hız İksiri ile doldurdu. Şişenin kalan kısmını ise Boşluk İksiri ile doldurmayı planlıyor.`;
      question = `Steve'in cam şişesinin kaçta kaçı Boşluk İksiri ile dolacaktır?`;
      hint = `İyileşme ve Hız iksirlerini paydaları eşitleyerek toplayın. Ardından $1$ tamdan bu toplamı çıkarın.`;
    } else if (theme === 'football') {
      title = "Süper Lig Antrenman Sahası";
      story = `Milli takım teknik direktörü antrenman sahasının $\\frac{${pair.n1}}{${pair.d1}}$'inde pas çalışması, $\\frac{${pair.n2}}{${pair.d2}}$'sında şut çalışması yaptırıyor. Sahada kalan kısım ise kalecilerin özel antrenmanına ayrılmıştır.`;
      question = `Antrenman sahasının kaçta kaçı kalecilerin çalışmasına ayrılmıştır?`;
      hint = `Pas ve şut çalışması alanlarını toplayıp $1$ tamdan çıkarın.`;
    } else {
      title = "Paylaşılan Kaynak Miktarı";
      story = `Toplu bir kaynağın $\\frac{${pair.n1}}{${pair.d1}}$'i birinci grupta, $\\frac{${pair.n2}}{${pair.d2}}$'si ikinci grupta kullanılmıştır.`;
      question = `Geriye kalan kısım tüm kaynağın kaçta kaçıdır?`;
      hint = `Topla ve $1$ tamdan çıkar.`;
    }

    solutionSteps = `
1. **Harcanan Kısımların Toplamı:**
   $$\\frac{${pair.n1}}{${pair.d1}} + \\frac{${pair.n2}}{${pair.d2}} = \\frac{${sumNum}}{${commonDen}} = \\frac{${simpSum.num}}{${simpSum.den}}$$

2. **Kalan Kısım:**
   $$1 - \\frac{${simpSum.num}}{${simpSum.den}} = \\frac{${simpRem.num}}{${simpRem.den}}$$

**Cevap:** Geriye kalan kısım $\\frac{${simpRem.num}}{${simpRem.den}}$ kadardır.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: answerStr, displayAnswer: `$$\\frac{${simpRem.num}}{${simpRem.den}}$$` };
  },

  decimals: function(theme) {
    const item1Cost = parseFloat((getRandomInt(15, 45) + 0.25 * getRandomInt(1, 3)).toFixed(2));
    const item2Cost = parseFloat((getRandomInt(10, 35) + 0.10 * getRandomInt(1, 8)).toFixed(2));
    const paid = Math.ceil((item1Cost + item2Cost + 10) / 10) * 10;
    const totalCost = parseFloat((item1Cost + item2Cost).toFixed(2));
    const change = parseFloat((paid - totalCost).toFixed(2));

    const title = "Alışveriş ve Ondalık Hesap";
    const story = `Karakterimiz marketten $${item1Cost.toFixed(2)}$ TL değerinde ilk ürünü ve $${item2Cost.toFixed(2)}$ TL değerinde ikinci ürünü satın alıp kasiyere $${paid}$ TL verdi.`;
    const question = `Kasiyerden kaç TL para üstü almalıdır?`;
    const hint = `Harcamaları toplayıp $${paid}$ TL'den çıkarın.`;

    const solutionSteps = `
1. **Toplam Harcama:** $$${item1Cost.toFixed(2)} + ${item2Cost.toFixed(2)} = ${totalCost.toFixed(2)}$$
2. **Para Üstü:** $$${paid}.00 - ${totalCost.toFixed(2)} = ${change.toFixed(2)}$$

**Cevap:** Para üstü $${change.toFixed(2)}$ TL'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: change.toString(), displayAnswer: `$${change.toFixed(2)}$ TL` };
  },

  ratio: function(theme) {
    const k = getRandomInt(2, 6);
    const given1 = getRandomInt(3, 8);
    const result1 = given1 * k;
    const given2 = getRandomInt(10, 25);
    const result2 = given2 * k;

    const title = "Doğru Orantı Hesabı";
    const story = `Bir sistemde $${given1}$ birim girdi ile $${result1}$ birim çıktı elde edilmektedir. Sistemdeki girdi miktarı $${given2}$ birime çıkarılmıştır.`;
    const question = `Aynı oranla elde edilecek yeni çıktı miktarı kaçtır?`;
    const hint = `Orantı kurarak çapraz çarpım yapın.`;

    const solutionSteps = `
1. **Orantının Kurulması:**
   $$\\frac{${given1}}{${result1}} = \\frac{${given2}}{x}$$
2. **Çözüm:**
   $$x = \\frac{${result1} \\cdot ${given2}}{${given1}} = ${result2}$$

**Cevap:** Sonuç $${result2}$ birimdir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: result2.toString(), displayAnswer: `$${result2}$` };
  },

  percentages: function(theme) {
    const originalPrice = getRandomInt(1, 10) * 50;
    const discountPercent = getRandomArrayElement([10, 20, 25, 30, 40, 50]);
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;

    const title = "İndirim Oranı Hesabı";
    const story = `Etiket fiyatı $${originalPrice}$ TL olan bir ürün için $\\%${discountPercent}$ indirim uygulanacaktır.`;
    const question = `İndirim sonrasında yeni fiyat kaç TL olur?`;
    const hint = `İndirimi hesaplayıp ilk fiyattan düşürün.`;

    const solutionSteps = `
1. **İndirim Tutarı:** $$${originalPrice} \\times \\frac{${discountPercent}}{100} = ${discountAmount} \\text{ TL}$$
2. **İndirimli Fiyat:** $$${originalPrice} - ${discountAmount} = ${finalPrice} \\text{ TL}$$

**Cevap:** Yeni fiyat $${finalPrice}$ TL'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: finalPrice.toString(), displayAnswer: `$${finalPrice}$ TL` };
  },

  algebra: function(theme) {
    const a = getRandomInt(2, 5);
    const b = getRandomInt(3, 12);
    const xVal = getRandomInt(3, 9);
    const totalVal = a * xVal + b;

    const title = "Cebirsel İfade Değeri";
    const story = `Bir durum $${a}x + ${b}$ cebirsel ifadesi ile modellenmiştir. Değişken $x = ${xVal}$ değerini almaktadır.`;
    const question = `İfadenin sayısal değeri kaçtır?`;
    const hint = `$x$ yerine $${xVal}$ koyarak işlemi hesaplayın.`;

    const solutionSteps = `
1. **Yerine Koyma:** $$${a} \\cdot (${xVal}) + ${b}$$
2. **İşlem:** $$${a * xVal} + ${b} = ${totalVal}$$

**Cevap:** Sonuç $${totalVal}$'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: totalVal.toString(), displayAnswer: `$${totalVal}$` };
  },

  equations: function(theme) {
    const xSol = getRandomInt(4, 15);
    const m = getRandomInt(2, 6);
    const c = getRandomInt(5, 25);
    const rhs = m * xSol + c;

    const title = "Bir Bilinmeyenli Denklem";
    const story = `Bilinmeyen bir sayının $${m}$ katının $${c}$ fazlası $${rhs}$ sayısına eşittir.`;
    const question = `Bilinmeyen sayı ($x$) kaçtır?`;
    const hint = `$${m}x + ${c} = ${rhs}$ denklemini çözün.`;

    const solutionSteps = `
1. **Denklem:** $$${m}x + ${c} = ${rhs}$$
2. **Çözüm:** $$${m}x = ${rhs - c} \\implies x = ${xSol}$$

**Cevap:** $x = ${xSol}$'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: xSol.toString(), displayAnswer: `$x = ${xSol}$` };
  },

  exponents: function(theme) {
    const base = getRandomArrayElement([2, 3, 5]);
    const exp1 = getRandomInt(2, 4);
    const exp2 = getRandomInt(2, 4);
    const totalExp = exp1 + exp2;
    const value = Math.pow(base, totalExp);

    const title = "Üslü İfadelerde Çarpma";
    const story = `Bir sistem miktarını önce $${base}^{${exp1}}$ katına, ardından $${base}^{${exp2}}$ katına çıkarmaktadır.`;
    const question = `Toplam artış ilk miktarının kaç katıdır (değeri bulun)?`;
    const hint = `Üsleri toplayın: $${base}^{${exp1} + ${exp2}} = ${base}^{${totalExp}}$.`;

    const solutionSteps = `
1. **Çarpma Kuralı:** $$${base}^{${exp1}} \\cdot ${base}^{${exp2}} = ${base}^{${totalExp}}$$
2. **Sayısal Değer:** $$${base}^{${totalExp}} = ${value}$$

**Cevap:** Sonuç $${value}$'dur ($${base}^{${totalExp}}$).`;

    return { title, story, question, hint, solutionSteps, correctAnswer: value.toString(), displayAnswer: `$${value}$` };
  },

  square_roots: function(theme) {
    const a = getRandomInt(2, 6);
    const b = getRandomArrayElement([2, 3, 5]);
    const insideSqrt = a * a * b;

    const title = "Kareköklü İfade Sadeleştirme";
    const story = `$\\sqrt{${insideSqrt}}$ kareköklü ifadesi verilmiştir.`;
    const question = `Bu ifadeyi $a\\sqrt{b}$ en sade biçiminde yazınız.`;
    const hint = `$${insideSqrt} = ${a*a} \\cdot ${b}$ olarak ayırıp $${a*a}$'yı kök dışına çıkarın.`;

    const solutionSteps = `
1. **Çarpanlara Ayırma:** $$\\sqrt{${insideSqrt}} = \\sqrt{${a*a} \\cdot ${b}}$$
2. **Kök Dışına Çıkarma:** $$${a}\\sqrt{${b}}$$

**Cevap:** $${a}\\sqrt{${b}}$$'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: `${a}sqrt(${b})`, displayAnswer: `$${a}\\sqrt{${b}}$` };
  },

  data_analysis: function(theme) {
    const val1 = getRandomInt(10, 30);
    const val2 = getRandomInt(15, 35);
    const val3 = getRandomInt(20, 40);
    const val4 = getRandomInt(10, 25);
    const sum = val1 + val2 + val3 + val4;
    const avg = (sum / 4).toFixed(1);
    const answerStr = avg.endsWith('.0') ? Math.round(sum / 4).toString() : avg;

    const title = "Aritmetik Ortalama";
    const story = `Bir gruptaki 4 veri şunlardır: $${val1}$, $${val2}$, $${val3}$, $${val4}$.`;
    const question = `Bu verilerin aritmetik ortalaması kaçtır?`;
    const hint = `Toplayıp 4'e bölün.`;

    const solutionSteps = `
1. **Toplam:** $$${val1} + ${val2} + ${val3} + ${val4} = ${sum}$$
2. **Ortalama:** $$\\frac{${sum}}{4} = ${answerStr}$$

**Cevap:** Ortalama $${answerStr}$'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: answerStr, displayAnswer: `$${answerStr}$` };
  },

  probability: function(theme) {
    const red = getRandomInt(3, 8);
    const blue = getRandomInt(4, 9);
    const total = red + blue;
    const simp = simplifyFraction(red, total);
    const answerStr = `${simp.num}/${simp.den}`;

    const title = "Basit Olayların Olasılığı";
    const story = `Bir grupta $${red}$ adet birinci tür ve $${blue}$ adet ikinci tür öge bulunmaktadır. Rastgele bir seçim yapılmaktadır.`;
    const question = `Seçilen ögenin birinci türden olma olasılığı kaçtır?`;
    const hint = `İstenen durum sayısı / Tüm durum sayısı.`;

    const solutionSteps = `
1. **Toplam Durum:** $$${red} + ${blue} = ${total}$$
2. **Olasılık:** $$\\frac{${red}}{${total}} = \\frac{${simp.num}}{${simp.den}}$$

**Cevap:** Olasılık $\\frac{${simp.num}}{${simp.den}}$'dir.`;

    return { title, story, question, hint, solutionSteps, correctAnswer: answerStr, displayAnswer: `$$\\frac{${simp.num}}{${simp.den}}$$` };
  }
};

// Render Math
function renderMath() {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
}

// Toast
function showToast(message, icon = 'fa-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Generate & Display Problem
function generateProblem() {
  const generator = PROBLEM_GENERATORS[currentTopic] || PROBLEM_GENERATORS.fractions;
  currentProblem = generator(currentTheme);

  const themeObj = THEME_DATA[currentTheme];
  const topicObj = TOPIC_DATA[currentTopic];

  document.getElementById('problem-icon').innerText = themeObj.icon;
  document.getElementById('problem-title').innerText = currentProblem.title;
  document.getElementById('problem-subtitle').innerText = `${topicObj.grade} ${topicObj.name}`;
  
  document.getElementById('active-badge-theme').innerText = `${themeObj.icon} ${themeObj.name}`;
  document.getElementById('active-badge-topic').innerText = topicObj.name;

  document.getElementById('problem-story').innerHTML = `<p>${currentProblem.story}</p>`;
  document.getElementById('problem-question').innerHTML = currentProblem.question;
  document.getElementById('hint-text').innerHTML = currentProblem.hint;
  document.getElementById('solution-steps').innerHTML = currentProblem.solutionSteps.trim();

  const answerInput = document.getElementById('student-answer');
  if (answerInput) {
    answerInput.value = '';
    answerInput.classList.remove('border-emerald-500', 'border-rose-500');
  }
  
  const feedback = document.getElementById('answer-feedback');
  if (feedback) {
    feedback.className = 'hidden mt-3 p-3 rounded-xl text-sm font-semibold flex items-center gap-2';
    feedback.innerHTML = '';
  }

  closeAccordions();
  setTimeout(renderMath, 50);
}

function closeAccordions() {
  const hintContent = document.getElementById('hint-content');
  const solutionContent = document.getElementById('solution-content');
  const hintChevron = document.getElementById('hint-chevron');
  const solutionChevron = document.getElementById('solution-chevron');

  if (hintContent) hintContent.classList.remove('open');
  if (solutionContent) solutionContent.classList.remove('open');
  if (hintChevron) hintChevron.style.transform = 'rotate(0deg)';
  if (solutionChevron) solutionChevron.style.transform = 'rotate(0deg)';
}

function checkAnswer() {
  if (!currentProblem) return;

  const rawInput = document.getElementById('student-answer').value.trim().toLowerCase();
  const feedback = document.getElementById('answer-feedback');
  const answerInput = document.getElementById('student-answer');

  if (!rawInput) {
    showToast('Lütfen bir cevap giriniz!', 'fa-triangle-exclamation');
    return;
  }

  let cleanInput = rawInput.replace(/\s+/g, '').replace('x=', '');
  let targetAnswer = currentProblem.correctAnswer.replace(/\s+/g, '').replace('x=', '');

  let isCorrect = false;

  if (cleanInput === targetAnswer) {
    isCorrect = true;
  } else {
    const numInput = parseFloat(cleanInput.replace(',', '.'));
    const numTarget = parseFloat(targetAnswer.replace(',', '.'));
    if (!isNaN(numInput) && !isNaN(numTarget) && Math.abs(numInput - numTarget) < 0.05) {
      isCorrect = true;
    }
  }

  feedback.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-800', 'bg-rose-100', 'text-rose-800');

  if (isCorrect) {
    score += 10;
    streak += 1;
    document.getElementById('score-counter').innerText = score;
    document.getElementById('streak-counter').innerText = streak;

    answerInput.classList.add('border-emerald-500');
    feedback.classList.add('bg-emerald-100', 'text-emerald-800');
    feedback.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-lg"></i> Tebrikler! Doğru cevap (${currentProblem.displayAnswer}). +10 Puan!`;
    showToast('Harika! Doğru Cevap 🎉', 'fa-circle-check');
  } else {
    streak = 0;
    document.getElementById('streak-counter').innerText = streak;

    answerInput.classList.add('border-rose-500');
    feedback.classList.add('bg-rose-100', 'text-rose-800');
    feedback.innerHTML = `<i class="fa-solid fa-circle-xmark text-rose-600 text-lg"></i> Üzgünüm, cevap tam olarak bu değil. İpucunu inceleyebilirsiniz!`;
    showToast('Tekrar dene veya İpucuna bak 💡', 'fa-lightbulb');
  }

  setTimeout(renderMath, 50);
}

function copyMarkdownFormat() {
  if (!currentProblem) return;

  const themeObj = THEME_DATA[currentTheme];

  const mdText = `### ${themeObj.icon} ${currentProblem.title}

${currentProblem.story}

**${currentProblem.question}**

---

💡 **İpucu:**  
${currentProblem.hint}

---

<details>
<summary>🔍 <b>Çözümü Görmek İçin Tıklayın</b></summary>

${currentProblem.solutionSteps}
</details>`;

  navigator.clipboard.writeText(mdText).then(() => {
    showToast('Markdown formatı panoya kopyalandı! 📋', 'fa-copy');
  }).catch(() => {
    showToast('Kopyalama başarısız oldu.', 'fa-xmark');
  });
}

// Global Event Initialization
document.addEventListener('DOMContentLoaded', () => {

  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      document.getElementById('user-display-name').innerText = `${currentUser.username} (${currentUser.role})`;
    } catch(e) {}
  }

  const themeChips = document.querySelectorAll('.theme-chip');
  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      themeChips.forEach(c => c.classList.remove('active', 'bg-white', 'text-slate-700'));
      chip.classList.add('active');
      currentTheme = chip.getAttribute('data-theme');
      generateProblem();
    });
  });

  const topicSelect = document.getElementById('topic-select');
  if (topicSelect) {
    topicSelect.addEventListener('change', (e) => {
      currentTopic = e.target.value;
      generateProblem();
    });
  }

  const btnGen = document.getElementById('btn-generate');
  if (btnGen) btnGen.addEventListener('click', generateProblem);

  const btnRand = document.getElementById('btn-randomize-values');
  if (btnRand) btnRand.addEventListener('click', generateProblem);

  const btnCheck = document.getElementById('btn-check-answer');
  if (btnCheck) btnCheck.addEventListener('click', checkAnswer);

  const answerInput = document.getElementById('student-answer');
  if (answerInput) {
    answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });
  }

  const toggleHintBtn = document.getElementById('toggle-hint');
  const hintContent = document.getElementById('hint-content');
  const hintChevron = document.getElementById('hint-chevron');
  if (toggleHintBtn) {
    toggleHintBtn.addEventListener('click', () => {
      const isOpen = hintContent.classList.contains('open');
      if (isOpen) {
        hintContent.classList.remove('open');
        hintChevron.style.transform = 'rotate(0deg)';
      } else {
        hintContent.classList.add('open');
        hintChevron.style.transform = 'rotate(180deg)';
      }
    });
  }

  const toggleSolutionBtn = document.getElementById('toggle-solution');
  const solutionContent = document.getElementById('solution-content');
  const solutionChevron = document.getElementById('solution-chevron');
  if (toggleSolutionBtn) {
    toggleSolutionBtn.addEventListener('click', () => {
      const isOpen = solutionContent.classList.contains('open');
      if (isOpen) {
        solutionContent.classList.remove('open');
        solutionChevron.style.transform = 'rotate(0deg)';
      } else {
        solutionContent.classList.add('open');
        solutionChevron.style.transform = 'rotate(180deg)';
      }
    });
  }

  const btnCopyMd = document.getElementById('btn-copy-markdown');
  if (btnCopyMd) btnCopyMd.addEventListener('click', copyMarkdownFormat);

  generateProblem();
  initDatabase();
});
