if (sessionStorage.getItem('madar_admin_logged_in') !== 'true') {
  window.location.href = 'login.html';
}

if (sessionStorage.getItem('madar_admin_logged_in') === 'true') {
const DEFAULT_CONTENT = {
  heroTitle: 'مساحتك للتعلم، التطور، وصناعة الفرص',
  heroDesc: 'مدار تك مؤسسة تعليمية وتدريبية في خانيونس، نعمل على توفير بيئة تساعد الطالب والخريجين والشباب على تطوير مهاراتهم، واكتساب الخبرات العملية، والانطلاق نحو فرص جديدة.',
  aboutTitle: 'نتعلم اليوم لنصنع فرص الغد',
  aboutDesc: 'مدار تك مؤسسة تعليمية وتدريبية تسعى إلى ربط المعرفة الأكاديمية بالتطبيق العملي، من خلال تقديم برامج تدريبية وأنشطة تعليمية تساعد الشباب على تطوير قدراتهم ومواكبة متطلبات سوق العمل.',
  theme: { oxfordBlue: '#03213D', freshLime: '#D5E159', graphite: '#333333', paleSilver: '#DAD9D9' },
  services: [
    { icon: 'fa-solid fa-chalkboard-user', title: 'التدريب والتطوير', description: 'برامج تدريبية متخصصة تهدف إلى تطوير المهارات التقنية والمهنية من خلال التعلم والتطبيق.' },
    { icon: 'fa-solid fa-people-group', title: 'مساحات العمل المشتركة', description: 'بيئة مناسبة للطالب والمستقلين وأصحاب المشاريع لإنجاز أعمالهم وتبادل الأفكار.' },
    { icon: 'fa-solid fa-building-columns', title: 'القاعات التدريبية', description: 'قاعات مجهزة لاستضافة الدورات التدريبية والاجتماعات والفعاليات والأنشطة.' },
    { icon: 'fa-solid fa-lightbulb', title: 'الأنشطة التعليمية', description: 'لقاءات ومبادرات تعليمية تساهم في نشر المعرفة وتبادل الخبرات.' }
  ],
  programs: [
    { icon: 'fa-solid fa-code', title: 'Front-End Development', description: 'تعلّم أساسيات تطوير واجهات المواقع الإلكترونية.' },
    { icon: 'fa-solid fa-robot', title: 'Artificial Intelligence', description: 'التعرف على أدوات الذكاء الاصطناعي وتطبيقاتها العملية.' },
    { icon: 'fa-solid fa-laptop-code', title: 'Digital Skills', description: 'تطوير المهارات الرقمية واستخدام الأدوات التقنية.' }
  ]
};

const COLOR_FIELDS = { primary: 'oxfordBlue', accent: 'freshLime', text: 'graphite', bg: 'paleSilver' };
let content = loadContent();
const listConfigs = {
  services: { list: document.getElementById('services-list'), empty: document.getElementById('services-empty'), add: document.getElementById('add-service') },
  programs: { list: document.getElementById('programs-list'), empty: document.getElementById('programs-empty'), add: document.getElementById('add-program') }
};

function loadContent() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem('madar_content') || 'null');
  } catch (error) {
    saved = null;
  }

  const stored = saved && typeof saved === 'object' ? saved : {};
  return {
    ...DEFAULT_CONTENT,
    ...stored,
    theme: { ...DEFAULT_CONTENT.theme, ...(stored.theme || {}) },
    services: Array.isArray(stored.services) ? stored.services.map(item => ({ icon: 'fa-solid fa-chalkboard-user', ...item })) : DEFAULT_CONTENT.services.map(item => ({ ...item })),
    programs: Array.isArray(stored.programs) ? stored.programs.map(item => ({ icon: 'fa-solid fa-code', ...item })) : DEFAULT_CONTENT.programs.map(item => ({ ...item }))
  };
}

function createField(labelText, fieldName, itemType, index, value, multiline) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-group';
  const id = `${itemType}-${fieldName}-${index}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;
  const input = document.createElement(multiline ? 'textarea' : 'input');
  input.className = 'form-control';
  input.id = id;
  input.dataset.itemField = fieldName;
  input.dataset.itemType = itemType;
  input.dataset.itemIndex = index;
  if (multiline) {
    input.rows = 2;
  } else {
    input.type = 'text';
  }
  input.value = value || '';
  wrapper.append(label, input);
  return wrapper;
}

function renderList(type) {
  const config = listConfigs[type];
  const items = content[type];
  config.list.replaceChildren();
  config.empty.hidden = items.length > 0;

  items.forEach((item, index) => {
    const row = document.createElement('article');
    row.className = 'editor-item';
    row.append(
      createField(type === 'services' ? 'اسم الخدمة' : 'اسم البرنامج', 'title', type, index, item.title, false),
      createField('الوصف', 'description', type, index, item.description, true)
    );
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete-button';
    remove.dataset.deleteType = type;
    remove.dataset.deleteIndex = index;
    remove.setAttribute('aria-label', 'حذف');
    remove.title = 'حذف';
    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash';
    icon.setAttribute('aria-hidden', 'true');
    remove.append(icon);
    row.append(remove);
    config.list.append(row);
  });
}

function fillFields() {
  document.querySelectorAll('[data-content-field]').forEach(field => {
    field.value = content[field.dataset.contentField] || '';
  });
  Object.entries(COLOR_FIELDS).forEach(([inputName, themeKey]) => {
    const input = document.querySelector(`input[name="${inputName}"]`);
    if (input) input.value = content.theme[themeKey] || DEFAULT_CONTENT.theme[themeKey];
  });
  renderList('services');
  renderList('programs');
  previewPalette();
}

function previewPalette() {
  const primary = document.querySelector('input[name="primary"]').value;
  const accent = document.querySelector('input[name="accent"]').value;
  document.documentElement.style.setProperty('--panel-primary', primary);
  document.documentElement.style.setProperty('--panel-accent', accent);
}

function saveContent() {
  document.querySelectorAll('[data-content-field]').forEach(field => {
    content[field.dataset.contentField] = field.value.trim();
  });
  Object.entries(COLOR_FIELDS).forEach(([inputName, themeKey]) => {
    content.theme[themeKey] = document.querySelector(`input[name="${inputName}"]`).value;
  });

  try {
    localStorage.setItem('madar_content', JSON.stringify(content));
    showToast('تم الحفظ بنجاح');
  } catch (error) {
    showToast('تعذر حفظ التغييرات.');
  }
}

function showToast(message) {
  document.getElementById('toast-message').textContent = message;
  bootstrap.Toast.getOrCreateInstance(document.getElementById('save-toast'), { delay: 3000 }).show();
}

Object.entries(listConfigs).forEach(([type, config]) => {
  config.add.addEventListener('click', () => {
    const fallbackIcon = type === 'services' ? 'fa-solid fa-chalkboard-user' : 'fa-solid fa-code';
    content[type].push({ icon: fallbackIcon, title: '', description: '' });
    renderList(type);
    config.list.lastElementChild?.querySelector('[data-item-field="title"]')?.focus();
  });

  config.list.addEventListener('input', event => {
    const field = event.target.closest('[data-item-field]');
    if (!field) return;
    const item = content[type][Number(field.dataset.itemIndex)];
    if (item) item[field.dataset.itemField] = field.value;
  });

  config.list.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-type]');
    if (!button) return;
    content[button.dataset.deleteType].splice(Number(button.dataset.deleteIndex), 1);
    renderList(button.dataset.deleteType);
  });
});

document.querySelectorAll('[data-content-field]').forEach(field => field.addEventListener('input', () => {
  content[field.dataset.contentField] = field.value;
}));
document.querySelectorAll('input[type="color"]').forEach(input => input.addEventListener('input', previewPalette));
document.querySelectorAll('.sidebar-link').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.sidebar-link').forEach(item => item.classList.remove('active'));
  link.classList.add('active');
}));
document.getElementById('save-button').addEventListener('click', saveContent);
fillFields();

document.getElementById('logout-button').addEventListener('click', () => {
  sessionStorage.removeItem('madar_admin_logged_in');
  window.location.href = 'login.html';
});
}
