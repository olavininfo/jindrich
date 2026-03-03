/* ===========================================
   Jindrich — i18n (Internationalization)
   Single-page language switching via JS
   =========================================== */

const translations = {
  // ── Navigation ──
  'nav.home': { en: 'Home', zh: '首页' },
  'nav.about': { en: 'About', zh: '关于我们' },
  'nav.services': { en: 'Services', zh: '服务领域' },
  'nav.contact': { en: 'Contact', zh: '联系我们' },

  // ── Homepage Hero ──
  'hero.slogan': { en: 'ENGINEERING FOR A BETTER WORLD', zh: 'ENGINEERING FOR A BETTER WORLD' },
  'hero.title': {
    en: 'Professional Engineering Solutions for Global Industry',
    zh: '面向全球工业的专业工程解决方案'
  },
  'hero.desc': {
    en: 'End-to-end engineering design, technical consulting, and equipment trading services for food, beverage, dairy, and biopharmaceutical industries.',
    zh: '为食品、饮料、乳制品和生物医药行业提供全链条工程设计、技术咨询和设备贸易服务。'
  },
  'hero.btn.services': { en: 'Our Services', zh: '我们的服务' },
  'hero.btn.contact': { en: 'Contact Us', zh: '联系我们' },

  // ── Homepage Industry Section ──
  'industry.title': { en: 'Our Industries', zh: '服务行业' },
  'industry.subtitle': {
    en: 'We deliver professional engineering solutions across four high-standard industries',
    zh: '我们在四大高标准行业提供专业工程解决方案'
  },

  'industry.food.title': { en: 'Food Engineering', zh: '食品工程' },
  'industry.food.desc': {
    en: 'Complete engineering solutions for food processing facilities',
    zh: '食品加工设施的完整工程解决方案'
  },
  'industry.beverage.title': { en: 'Beverage Engineering', zh: '饮料工程' },
  'industry.beverage.desc': {
    en: 'Cutting-edge design for beverage production lines',
    zh: '先进的饮料生产线设计方案'
  },
  'industry.dairy.title': { en: 'Dairy Engineering', zh: '乳制品工程' },
  'industry.dairy.desc': {
    en: 'Hygienic engineering for dairy processing plants',
    zh: '乳制品加工厂卫生工程设计'
  },
  'industry.biopharma.title': { en: 'BioPharma Engineering', zh: '生物医药工程' },
  'industry.biopharma.desc': {
    en: 'GMP-compliant facilities for pharmaceutical manufacturing',
    zh: '符合GMP标准的生物医药制造设施'
  },

  // ── Homepage Advantages ──
  'advantage.title': { en: 'Why Jindrich', zh: '为什么选择锦谦' },
  'advantage.subtitle': {
    en: 'What sets us apart in industrial engineering',
    zh: '我们在工业工程领域的核心竞争力'
  },
  'adv1.title': { en: 'End-to-End Engineering', zh: '全链条工程服务' },
  'adv1.desc': {
    en: 'From factory planning and process design to equipment procurement — all under one roof.',
    zh: '从工厂规划、工艺设计到设备采购，一站式全覆盖。'
  },
  'adv2.title': { en: 'Deep Industry Focus', zh: '深度行业专注' },
  'adv2.desc': {
    en: 'Two decades of specialized expertise in food, beverage, dairy, and biopharmaceutical engineering.',
    zh: '深耕食品、饮料、乳品和生物医药工程领域二十余年。'
  },
  'adv3.title': { en: 'International Standards', zh: '国际标准执行力' },
  'adv3.desc': {
    en: 'Proficient in GMP, ISO, and HACCP regulations to ensure full project compliance.',
    zh: '精通GMP、ISO、HACCP等国际规范，确保工程全面合规。'
  },
  'adv4.title': { en: 'China Edge + Global View', zh: '中国制造 · 全球视野' },
  'adv4.desc': {
    en: 'Leveraging China\'s supply chain advantages with international engineering management expertise.',
    zh: '依托中国供应链优势，结合国际工程管理经验，实现最优性价比。'
  },

  // ── CTA ──
  'cta.title': { en: 'Ready to Start Your Project?', zh: '准备好开启您的工程项目了吗？' },
  'cta.desc': {
    en: 'Get in touch with our engineering team today.',
    zh: '立即联系我们的工程团队。'
  },
  'cta.btn': { en: 'Contact Us', zh: '联系我们' },

  // ── About Page ──
  'about.hero.title': { en: 'About Jindrich', zh: '关于锦谦' },
  'about.hero.desc': { en: 'Engineering for a better world', zh: 'Engineering for a better world' },
  'about.section.title': { en: 'Company Profile', zh: '公司简介' },
  'about.p1': {
    en: 'Changzhou Jindrich Mechanical Equipment Co., Ltd. (Jindrich) is a professional engineering company specializing in engineering design, technical consulting, and equipment trading, headquartered in Changzhou, Jiangsu, China.',
    zh: '常州锦谦机械设备有限公司（Jindrich）是一家专注于工程设计、技术咨询和设备贸易服务的专业工程公司，总部位于中国江苏省常州市。'
  },
  'about.p2': {
    en: 'We focus on industries with the most demanding production standards — food, beverage, dairy, and biopharmaceuticals — providing end-to-end engineering solutions spanning factory planning, process design, and equipment procurement. The Jindrich team consists of experienced engineers and consultants who are proficient in international engineering standards (GMP, ISO, HACCP) and deeply understand the real operational needs of client facilities.',
    zh: '我们深耕食品、饮料、乳制品及生物医药等对生产标准要求严苛的行业，为全球客户提供从工厂规划、工艺设计到设备采购的全链条工程解决方案。锦谦团队汇集了具有丰富行业经验的工程师和咨询顾问，不仅精通国际工程标准（如GMP、ISO、HACCP），更深度理解客户工厂的实际运营需求。'
  },
  'about.p3': {
    en: 'Our mission is to transform engineering visions into high-performance operational realities, through professional expertise and a commitment to accountability.',
    zh: '我们的目标，是以专业的工程能力和负责任的服务态度，帮助客户将工程项目从构想转化为高效运转的现实。'
  },
  'about.adv.title': { en: 'Our Advantages', zh: '核心竞争优势' },

  // ── Services Common ──
  'service.engineering': { en: 'Engineering Design', zh: '工程设计' },
  'service.consulting': { en: 'Consulting Services', zh: '咨询服务' },
  'service.trading': { en: 'Trading Services', zh: '贸易服务' },

  'service.eng1': { en: 'Workshop Layout Design', zh: '车间布局设计' },
  'service.eng2': { en: 'Process Flow Design', zh: '工艺流程设计' },
  'service.eng3': { en: 'Equipment Selection', zh: '设备选型' },

  'service.con1': { en: 'Regulatory Compliance Consulting', zh: '法规合规咨询' },
  'service.con2': { en: 'GMP Certification Guidance', zh: 'GMP认证辅导' },

  'service.trd1': { en: 'Equipment Procurement Agency', zh: '设备采购代理' },
  'service.trd2': { en: 'Import Assistance', zh: '进口协助' },

  'service.gallery.title': { en: 'Industry Gallery', zh: '行业图集' },

  // ── Food Service Page ──
  'food.hero.title': { en: 'Food Engineering', zh: '食品工程' },
  'food.hero.desc': {
    en: 'Complete engineering solutions for modern food processing facilities',
    zh: '现代食品加工设施的完整工程解决方案'
  },
  'food.intro': {
    en: 'Jindrich provides end-to-end engineering services for the food processing industry, covering plant design, process optimization, and equipment supply. We ensure that your food production facilities meet the highest international hygiene and safety standards.',
    zh: '锦谦为食品加工行业提供全链条工程服务，涵盖工厂设计、工艺优化和设备供应。我们确保您的食品生产设施符合最高国际卫生与安全标准。'
  },

  // ── Beverage Service Page ──
  'beverage.hero.title': { en: 'Beverage Engineering', zh: '饮料工程' },
  'beverage.hero.desc': {
    en: 'Cutting-edge solutions for beverage production and bottling',
    zh: '先进的饮料生产与灌装解决方案'
  },
  'beverage.intro': {
    en: 'From water treatment systems to high-speed bottling and canning lines, Jindrich delivers comprehensive engineering solutions for every stage of beverage production. Our designs optimize throughput while maintaining the highest quality standards.',
    zh: '从水处理系统到高速灌装和罐装生产线，锦谦为饮料生产的每个环节提供全面的工程解决方案。我们的设计在保持最高质量标准的同时优化产能。'
  },

  // ── Dairy Service Page ──
  'dairy.hero.title': { en: 'Dairy Engineering', zh: '乳制品工程' },
  'dairy.hero.desc': {
    en: 'Hygienic engineering for dairy processing and production',
    zh: '乳制品加工与生产的卫生工程设计'
  },
  'dairy.intro': {
    en: 'Jindrich specializes in designing and equipping dairy processing facilities that meet stringent hygiene requirements. From milk reception and pasteurization to yogurt fermentation and packaging, we provide complete engineering solutions.',
    zh: '锦谦专注于设计和装备满足严格卫生要求的乳制品加工设施。从鲜奶接收、巴氏杀菌到酸奶发酵和包装，我们提供完整的工程解决方案。'
  },

  // ── BioPharma Service Page ──
  'biopharma.hero.title': { en: 'BioPharma Engineering', zh: '生物医药工程' },
  'biopharma.hero.desc': {
    en: 'GMP-compliant facilities for pharmaceutical manufacturing',
    zh: '符合GMP标准的生物医药制造设施'
  },
  'biopharma.intro': {
    en: 'Jindrich provides specialized engineering services for the biopharmaceutical industry, including cleanroom design, sterile filling line integration, and bioreactor facility planning. All our designs adhere to international GMP and regulatory standards.',
    zh: '锦谦为生物医药行业提供专业工程服务，包括洁净室设计、无菌灌装线集成和生物反应器设施规划。我们所有的设计均符合国际GMP及相关法规标准。'
  },

  // ── Contact Page ──
  'contact.hero.title': { en: 'Contact Us', zh: '联系我们' },
  'contact.hero.desc': {
    en: 'Get in touch to discuss your engineering project',
    zh: '与我们联系，讨论您的工程项目'
  },
  'contact.section.title': { en: 'Get In Touch', zh: '联系方式' },
  'contact.phone.label': { en: 'Phone', zh: '电话' },
  'contact.email.label': { en: 'Email', zh: '邮箱' },
  'contact.address.label': { en: 'Address', zh: '地址' },
  'contact.address': {
    en: 'Sanjing Industrial Park, No. 23 Huashan Middle Road, Xinbei District, Changzhou, Jiangsu, China',
    zh: '江苏省常州市新北区华山中路23号 三晶工业园'
  },

  // ── Footer ──
  'footer.desc': {
    en: 'Professional engineering solutions for food, beverage, dairy, and biopharmaceutical industries.',
    zh: '为食品、饮料、乳制品和生物医药行业提供专业工程解决方案。'
  },
  'footer.quicklinks': { en: 'Quick Links', zh: '快速链接' },
  'footer.contactinfo': { en: 'Contact Us', zh: '联系我们' },
  'footer.copyright': {
    en: '© 2025 Changzhou Jindrich Mechanical Equipment Co., Ltd. All rights reserved.',
    zh: '© 2025 常州锦谦机械设备有限公司 版权所有'
  },

  // ── Services Dropdown ──
  'services.food': { en: 'Food Engineering', zh: '食品工程' },
  'services.beverage': { en: 'Beverage Engineering', zh: '饮料工程' },
  'services.dairy': { en: 'Dairy Engineering', zh: '乳制品工程' },
  'services.biopharma': { en: 'BioPharma Engineering', zh: '生物医药工程' },
};

/**
 * Get current language from localStorage, default to 'en'
 */
function getCurrentLang() {
  return localStorage.getItem('jindrich-lang') || 'en';
}

/**
 * Set the language and update all translatable elements
 */
function setLanguage(lang) {
  localStorage.setItem('jindrich-lang', lang);
  document.documentElement.lang = lang;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang]) {
      el.textContent = translations[key][lang];
    }
  });

  // Update all elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key] && translations[key][lang]) {
      el.placeholder = translations[key][lang];
    }
  });

  // Update language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

/**
 * Initialize i18n on page load
 */
function initI18n() {
  const lang = getCurrentLang();
  setLanguage(lang);

  // Bind language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', initI18n);
