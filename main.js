const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.borderBottomColor = window.scrollY > 80
    ? 'rgba(201,168,76,0.25)'
    : 'rgba(201,168,76,0.18)';
});

function toggleMenu() {
  const links = document.querySelector('.nav-links');
  links.classList.toggle('active');
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  field.classList.add('field-error');
  let errEl = field.parentElement.querySelector('.field-error-msg');
  if (!errEl) {
    errEl = document.createElement('span');
    errEl.className = 'field-error-msg';
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
  const banner = document.getElementById('formErrorBanner');
  if (banner) banner.style.display = 'none';
}

function showBanner(message) {
  const banner = document.getElementById('formErrorBanner');
  banner.textContent = message;
  banner.style.display = 'block';
  banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitForm(e) {
  if (e) e.preventDefault();
  clearErrors();

  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const company = document.getElementById('company').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim();

  let hasError = false;

  if (!fname)   { showError('fname',   'First name is required.');    hasError = true; }
  if (!lname)   { showError('lname',   'Last name is required.');     hasError = true; }
  if (!company) { showError('company', 'Company name is required.');  hasError = true; }

  const phoneClean = phone.replace(/[\s\-().]/g, '');
  const phoneValid = /^(\+91|91|0)?[6-9]\d{9}$/.test(phoneClean);
  if (!phone) {
    showError('phone', 'Phone number is required.');
    hasError = true;
  } else if (!phoneValid) {
    showError('phone', 'Enter a valid 10-digit Indian mobile number.');
    hasError = true;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!email) {
    showError('email', 'Email address is required.');
    hasError = true;
  } else if (!emailValid) {
    showError('email', 'Enter a valid email address.');
    hasError = true;
  }

  if (hasError) {
    showBanner('Please fix the highlighted fields before submitting.');
    return;
  }

  const submitBtn = document.querySelector('.form-submit');
  const origText  = submitBtn.innerHTML;
  submitBtn.innerHTML = '⏳ &nbsp; Sending…';
  submitBtn.disabled  = true;

  fetch('https://formsubmit.co/ajax/hkworkforcesolutions@outlook.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      Form:      'Index Page Lead Form',
      Name:      fname + ' ' + lname,
      Company:   company,
      Phone:     phone,
      Email:     email,
      Industry:  document.getElementById('industry').value,
      Service:   document.getElementById('service').value,
      Headcount: document.getElementById('headcount').value,
      Message:   document.getElementById('message').value
    })
  })
    .then(r => r.json())
    .then(() => {
      document.getElementById('leadForm').style.display = 'none';
      const msg = document.getElementById('successMsg');
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(() => {
      showBanner('Submission failed. Please email us directly at hkworkforcesolutions@outlook.com');
      submitBtn.innerHTML = origText;
      submitBtn.disabled  = false;
    });
}