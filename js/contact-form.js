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

// ── Country list (ISO 3166-1) ──
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria",
  "Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad",
  "Chile","China","Colombia","Comoros","Congo (DRC)","Congo (Republic)","Costa Rica","Croatia","Cuba",
  "Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador",
  "Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland",
  "France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea",
  "Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati",
  "Korea (North)","Korea (South)","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho",
  "Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives",
  "Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco",
  "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands",
  "New Zealand","Nicaragua","Niger","Nigeria","North Macedonia","Norway","Oman","Pakistan","Palau",
  "Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar",
  "Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent","Samoa",
  "San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone",
  "Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain",
  "Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
  "Thailand","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda",
  "Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu",
  "Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// ── Worker API endpoint (to be updated after deployment) ──
const WORKER_API_URL = 'https://jindrich-contact-api.YOUR_CF_SUBDOMAIN.workers.dev';

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  populateCountries();
  setupNameFieldToggle();
  setupFormSubmission();
});

/**
 * Populate the country <select> with options
 */
function populateCountries() {
  const select = document.getElementById('country');
  if (!select) return;
  COUNTRIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
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
      if (window.turnstile) {
        window.turnstile.reset();
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
