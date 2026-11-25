const DEFAULT_CONTENT = {
  heroTitle: 'مساحتك للتعلم، التطور، وصناعة الفرص',
  heroDesc: 'مدار تك مؤسسة تعليمية وتدريبية في خانيونس، نعمل على توفير بيئة تساعد الطالب والخريجين والشباب على تطوير مهاراتهم، واكتساب الخبرات العملية، والانطلاق نحو فرص جديدة.',
  aboutTitle: 'نتعلم اليوم لنصنع فرص الغد',
  aboutDesc: 'مدار تك مؤسسة تعليمية وتدريبية تسعى إلى ربط المعرفة الأكاديمية بالتطبيق العملي، من خلال تقديم برامج تدريبية وأنشطة تعليمية تساعد الشباب على تطوير قدراتهم ومواكبة متطلبات سوق العمل.',
  theme: {
    oxfordBlue: '#03213D',
    freshLime: '#D5E159',
    graphite: '#333333',
    paleSilver: '#DAD9D9'
  },
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

function getContent() {
  let savedContent;
  try {
    savedContent = JSON.parse(localStorage.getItem('madar_content') || 'null');
  } catch (error) {
    savedContent = null;
  }

  const saved = savedContent && typeof savedContent === 'object' ? savedContent : {};
  return {
    ...DEFAULT_CONTENT,
    ...saved,
    theme: { ...DEFAULT_CONTENT.theme, ...(saved.theme || {}) },
    services: Array.isArray(saved.services) ? saved.services : DEFAULT_CONTENT.services,
    programs: Array.isArray(saved.programs) ? saved.programs : DEFAULT_CONTENT.programs
  };
}

function applyTheme(theme) {
  const themeElement = document.getElementById('dynamic-theme');
  if (!themeElement) return;

  const colors = { ...DEFAULT_CONTENT.theme, ...(theme || {}) };
  const declarations = {
    '--oxford-blue': colors.oxfordBlue,
    '--fresh-lime': colors.freshLime,
    '--graphite': colors.graphite,
    '--pale-silver': colors.paleSilver
  };

  themeElement.textContent = `:root { ${Object.entries(declarations)
    .map(([name, value]) => `${name}: ${CSS.supports('color', value) ? value : DEFAULT_CONTENT.theme[{
      '--oxford-blue': 'oxfordBlue',
      '--fresh-lime': 'freshLime',
      '--graphite': 'graphite',
      '--pale-silver': 'paleSilver'
    }[name]]};`)
    .join(' ')} }`;
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function renderServices(services) {
  const container = document.getElementById('services-container');
  if (!container) return;

  container.innerHTML = (Array.isArray(services) ? services : []).map(service => `
    <div class="col-md-6 col-lg-3">
      <article class="service-card">
        <div class="service-icon"><i class="${escapeHTML(service.icon || 'fa-solid fa-chalkboard-user')}"></i></div>
        <h3>${escapeHTML(service.title)}</h3>
        <p>${escapeHTML(service.description)}</p>
      </article>
    </div>
  `).join('');
}

function renderPrograms(programs) {
  const container = document.getElementById('programs-container');
  if (!container) return;

  container.innerHTML = (Array.isArray(programs) ? programs : []).map(program => `
    <div class="col-md-4">
      <article class="program-card">
        <div class="program-icon"><i class="${escapeHTML(program.icon || 'fa-solid fa-code')}"></i></div>
        <h3>${escapeHTML(program.title)}</h3>
        <p>${escapeHTML(program.description)}</p>
        <button class="btn btn-program" data-program="${escapeHTML(program.title)}">اعرف المزيد</button>
      </article>
    </div>
  `).join('');
}

function applyContent() {
  const content = getContent();
  applyTheme(content.theme);
  renderServices(content.services);
  renderPrograms(content.programs);

  const textFields = {
    'hero-title': content.heroTitle,
    'hero-desc': content.heroDesc,
    'about-title': content.aboutTitle,
    'about-desc': content.aboutDesc
  };

  Object.entries(textFields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = value || DEFAULT_CONTENT[{ 
      'hero-title': 'heroTitle',
      'hero-desc': 'heroDesc',
      'about-title': 'aboutTitle',
      'about-desc': 'aboutDesc'
    }[id]];
  });
}

document.addEventListener('DOMContentLoaded', applyContent);
