/* ===========================================
   Jindrich — Contact Form Handler
   Validation + Turnstile + Resend via Worker
   =========================================== */

// ── Blocked public email domains ──
const BLOCKED_DOMAINS = [
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.jp', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
  'hotmail.com', 'hotmail.co.uk', 'outlook.com', 'outlook.fr', 'outlook.de',
  'live.com', 'live.co.uk', 'msn.com',
  'aol.com', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me', 'tutanota.com', 'zoho.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'rambler.ru',
  'qq.com', '163.com', '126.com', 'yeah.net', 'sina.com', 'sina.cn',
  'sohu.com', 'aliyun.com', 'foxmail.com', '139.com', '189.cn',
  'naver.com', 'daum.net', 'hanmail.net',
  'gmx.com', 'gmx.de', 'gmx.net', 'web.de', 't-online.de',
  'orange.fr', 'laposte.net', 'free.fr', 'wanadoo.fr',
  'libero.it', 'virgilio.it', 'alice.it',
  'uol.com.br', 'bol.com.br', 'terra.com.br',
  'rediffmail.com', 'inbox.com', 'fastmail.com', 'hushmail.com',
  'mail.com', 'email.com', 'usa.com', 'post.com',
];

// ── Country list with dial codes ──
const COUNTRIES = [
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Australia", code: "+61" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1-242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1-246" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo (DRC)", code: "+243" },
  { name: "Congo (Republic)", code: "+242" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominican Republic", code: "+1-809" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Eswatini", code: "+268" },
  { name: "Ethiopia", code: "+251" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" },
  { name: "Greece", code: "+30" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Guyana", code: "+592" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Italy", code: "+39" },
  { name: "Ivory Coast", code: "+225" },
  { name: "Jamaica", code: "+1-876" },
  { name: "Japan", code: "+81" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Korea (South)", code: "+82" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Laos", code: "+856" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Malaysia", code: "+60" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mexico", code: "+52" },
  { name: "Moldova", code: "+373" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "North Macedonia", code: "+389" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Palestine", code: "+970" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" },
  { name: "Romania", code: "+40" },
  { name: "Russia", code: "+7" },
  { name: "Rwanda", code: "+250" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Sudan", code: "+211" },
  { name: "Spain", code: "+34" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" },
  { name: "Thailand", code: "+66" },
  { name: "Togo", code: "+228" },
  { name: "Trinidad and Tobago", code: "+1-868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Turkmenistan", code: "+993" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Venezuela", code: "+58" },
  { name: "Vietnam", code: "+84" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
];

// ── Worker API endpoint (to be updated after deployment) ──
const WORKER_API_URL = 'https://jindrich-contact-api.YOUR_CF_SUBDOMAIN.workers.dev';

// ── Turnstile widget ID for reset ──
let turnstileWidgetId = null;

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  populateCountries();
  setupCountryPhoneSync();
  setupNameFieldToggle();
  setupEmailValidation();
  setupFormSubmission();
  renderTurnstile();
});

/**
 * Populate the country <select> with options including dial codes
 */
function populateCountries() {
  const select = document.getElementById('country');
  if (!select) return;
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.dataset.code = c.code;
    opt.textContent = `${c.name} (${c.code})`;
    select.appendChild(opt);
  });
}

/**
 * When country changes, auto-fill phone field with dial code
 */
function setupCountryPhoneSync() {
  const countrySelect = document.getElementById('country');
  const phoneInput = document.getElementById('phone');
  if (!countrySelect || !phoneInput) return;

  countrySelect.addEventListener('change', () => {
    const selected = countrySelect.options[countrySelect.selectedIndex];
    const code = selected?.dataset?.code;
    if (code) {
      // Only auto-fill if phone is empty or only contains a previous dial code
      const currentVal = phoneInput.value.trim();
      const isOnlyCode = /^\+[\d\-\s]*$/.test(currentVal) && currentVal.length <= 8;
      if (!currentVal || isOnlyCode) {
        phoneInput.value = code + ' ';
        phoneInput.focus();
      }
    }
  });
}

/**
 * Render Turnstile widget with correct language
 */
function renderTurnstile() {
  const container = document.getElementById('turnstileContainer');
  if (!container) return;

  function doRender() {
    if (!window.turnstile) {
      setTimeout(doRender, 500);
      return;
    }
    const lang = localStorage.getItem('jindrich-lang') || 'en';
    container.innerHTML = '';
    turnstileWidgetId = window.turnstile.render(container, {
      sitekey: '0x4AAAAAACmCQX6kwn3mDd8c',
      theme: 'light',
      language: lang === 'zh' ? 'zh-CN' : 'en',
    });
  }

  doRender();

  // Re-render on language switch
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(doRender, 100);
    });
  });
}

/**
 * Toggle name fields based on current language (EN: first+last, ZH: single)
 */
function setupNameFieldToggle() {
  const enRow = document.getElementById('nameRowEn');
  const zhRow = document.getElementById('nameRowZh');
  if (!enRow || !zhRow) return;

  function syncNameFields() {
    const lang = localStorage.getItem('jindrich-lang') || 'en';
    if (lang === 'zh') {
      enRow.style.display = 'none';
      zhRow.style.display = 'flex';
    } else {
      enRow.style.display = 'flex';
      zhRow.style.display = 'none';
    }
  }

  syncNameFields();

  // Watch for language changes
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(syncNameFields, 50);
    });
  });
}

/**
 * Validate email is a business domain
 */
function isBusinessEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_DOMAINS.includes(domain);
}

/**
 * Setup real-time email validation on blur (when user leaves the field)
 */
function setupEmailValidation() {
  const emailInput = document.getElementById('email');
  if (!emailInput) return;

  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    const errorEl = document.getElementById('emailError');
    if (!errorEl) return;

    if (!email) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = t('form.error.email.invalid');
      errorEl.style.display = 'block';
      emailInput.style.borderColor = '#c81d1d';
    } else if (!isBusinessEmail(email)) {
      errorEl.textContent = t('form.error.email.business');
      errorEl.style.display = 'block';
      emailInput.style.borderColor = '#c81d1d';
    } else {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      emailInput.style.borderColor = '#4caf50';
    }
  });

  // Clear error styling on focus
  emailInput.addEventListener('focus', () => {
    emailInput.style.borderColor = '';
  });
}

/**
 * Validate phone number format (must include country code like +XX)
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

/**
 * Get i18n text helper
 */
function t(key) {
  const lang = localStorage.getItem('jindrich-lang') || 'en';
  if (typeof translations !== 'undefined' && translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
}

/**
 * Show field-level error
 */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

/**
 * Clear all errors
 */
function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  // Reset border colors
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

/**
 * Validate the entire form
 */
function validateForm() {
  clearErrors();
  const lang = localStorage.getItem('jindrich-lang') || 'en';
  let valid = true;

  // Name
  if (lang === 'zh') {
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName || fullName.length < 2) {
      showError('fullNameError', t('form.error.name'));
      valid = false;
    }
  } else {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    if (!firstName || firstName.length < 1) {
      showError('firstNameError', t('form.error.firstname'));
      valid = false;
    }
    if (!lastName || lastName.length < 1) {
      showError('lastNameError', t('form.error.lastname'));
      valid = false;
    }
  }

  // Email
  const email = document.getElementById('email').value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('emailError', t('form.error.email.invalid'));
    valid = false;
  } else if (!isBusinessEmail(email)) {
    showError('emailError', t('form.error.email.business'));
    valid = false;
  }

  // Country
  const country = document.getElementById('country').value;
  if (!country) {
    showError('countryError', t('form.error.country'));
    valid = false;
  }

  // Phone
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    showError('phoneError', t('form.error.phone'));
    valid = false;
  } else if (!isValidPhone(phone)) {
    showError('phoneError', t('form.error.phone.format'));
    valid = false;
  }

  // Message
  const message = document.getElementById('message').value.trim();
  if (!message || message.length < 10) {
    showError('messageError', t('form.error.message'));
    valid = false;
  }

  return valid;
}

/**
 * Handle form submission
 */
function setupFormSubmission() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Get Turnstile token
    const turnstileResponse = document.querySelector('[name="cf-turnstile-response"]');
    if (!turnstileResponse || !turnstileResponse.value) {
      alert(t('form.error.turnstile'));
      return;
    }

    const lang = localStorage.getItem('jindrich-lang') || 'en';
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('btnSpinner');
    const btnText = submitBtn.querySelector('span[data-i18n]');

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.opacity = '0.5';
    spinner.style.display = 'inline-block';

    // Build payload
    let name;
    if (lang === 'zh') {
      name = document.getElementById('fullName').value.trim();
    } else {
      name = document.getElementById('firstName').value.trim() + ' ' +
        document.getElementById('lastName').value.trim();
    }

    const payload = {
      name,
      email: document.getElementById('email').value.trim(),
      country: document.getElementById('country').value,
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim(),
      turnstileToken: turnstileResponse.value,
      language: lang,
    };

    try {
      const res = await fetch(WORKER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showFeedback(true);
      } else {
        showFeedback(false, data.error || 'Unknown error');
      }
    } catch (err) {
      showFeedback(false, err.message);
    } finally {
      submitBtn.disabled = false;
      btnText.style.opacity = '1';
      spinner.style.display = 'none';
      // Reset turnstile
      if (window.turnstile && turnstileWidgetId !== null) {
        window.turnstile.reset(turnstileWidgetId);
      }
    }
  });
}

/**
 * Show form feedback (success or error)
 */
function showFeedback(isSuccess, errorMsg = '') {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const icon = document.getElementById('feedbackIcon');
  const title = document.getElementById('feedbackTitle');
  const desc = document.getElementById('feedbackDesc');

  form.style.display = 'none';
  feedback.style.display = 'block';

  if (isSuccess) {
    icon.textContent = '✅';
    feedback.className = 'form-feedback success';
    title.textContent = t('form.success.title');
    desc.textContent = t('form.success.desc');
  } else {
    icon.textContent = '❌';
    feedback.className = 'form-feedback error';
    title.textContent = t('form.error.title');
    desc.textContent = t('form.error.desc') + (errorMsg ? ' (' + errorMsg + ')' : '');
  }
}
