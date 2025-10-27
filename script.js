// ===== ЭЛЕМЕНТЫ
const header = document.querySelector('header');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const yearEl = document.getElementById('year');
const scrollBar = document.getElementById('scroll-progress');

// Форма
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('f-name');
const emailInput = document.getElementById('f-email');
const msgInput = document.getElementById('f-msg');
const hintEl = document.getElementById('form-msg');
const textsHolder = document.getElementById('form-texts');
const submitBtn = form?.querySelector('button[type="submit"]');

// ===== Динамический год
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Прогресс-бар прокрутки
const onScrollProgress = () => {
  if (!scrollBar) return;
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  scrollBar.style.transform = `scaleX(${Math.max(0, Math.min(1, scrolled))})`;
};
onScrollProgress();
window.addEventListener('scroll', onScrollProgress, { passive: true });

// ===== Тень у шапки при скролле
const onScrollHeaderShadow = () => {
  if (window.scrollY > 4) header?.classList.add('header--shadow');
  else header?.classList.remove('header--shadow');
};
onScrollHeaderShadow();
window.addEventListener('scroll', onScrollHeaderShadow, { passive: true });

// ===== Бургер-меню
const toggleMenu = () => {
  menu?.classList.toggle('hidden');
  document.body.classList.toggle('no-scroll');
  if (burger) burger.textContent = menu?.classList.contains('hidden') ? '☰' : '✕';
};
burger?.addEventListener('click', toggleMenu);
menu?.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', () => {
    if (window.innerWidth < 768 && !menu.classList.contains('hidden')) toggleMenu();
  });
});

// ===== Плавный скролл c учётом высоты шапки
const HEADER_OFFSET = 72;
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const top = window.scrollY + rect.top - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    history.pushState(null, '', id);
  });
});

// ===== REVEAL-анимации (каскад «вылет слева»)
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.15 }
);

function markReveals() {
  const nodes = document.querySelectorAll(
    'section, .card, article, figure, .rounded-2xl, h2, footer [data-reveal]'
  );
  let i = 0;
  nodes.forEach((el) => {
    el.classList.add('reveal');
    if (!el.dataset.reveal) el.setAttribute('data-reveal', 'left');
    el.setAttribute('data-delay', String(i % 5));
    i++;
    revealObserver.observe(el);
  });
}
markReveals();

// ===== Счётчики чисел
function animateNumber(el) {
  const target = Number(el.dataset.value);
  if (!Number.isFinite(target)) return;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  const from = Number(el.dataset.from || 0);
  function frame(t) {
    const p = Math.min(1, (t - start) / duration);
    const val = Math.floor(from + (target - from) * (1 - Math.pow(1 - p, 3))); // easeOutCubic
    el.textContent = `${prefix}${val}${suffix}`;
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateNumber(e.target);
        countObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll('.count[data-value]').forEach((el) => countObserver.observe(el));

// ===== Ripple для кнопок
function attachRipples() {
  document.querySelectorAll('.btn-ripple').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      r.style.left = `${e.clientX - rect.left}px`;
      r.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });
}
attachRipples();

// ===== Параллакс в Hero
(function () {
  const root = document.querySelector('.parallax-root');
  if (!root) return;
  const items = root.querySelectorAll('.parallax-item');
  root.addEventListener('mousemove', (e) => {
    const rect = root.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '6');
      el.style.transform = `translate(${-(cx * speed)}px, ${-(cy * speed)}px)`;
    });
  });
  root.addEventListener('mouseleave', () => {
    items.forEach((el) => (el.style.transform = 'translate(0,0)'));
  });
})();

// ===== Утилиты для формы
function setHint(text, type = 'info') {
  if (!hintEl) return;
  hintEl.textContent = text;
  hintEl.classList.remove('msg--ok', 'msg--error');
  hintEl.classList.add('msg');
  if (type === 'ok') hintEl.classList.add('msg--ok');
  if (type === 'error') hintEl.classList.add('msg--error');
}

function buildMailtoHref({ name, email, tg, message }) {
  const to = 'info.softmini@gmail.com';
  const subject = encodeURIComponent('Заявка с сайта Минисофт');
  const body = encodeURIComponent(
    `Имя: ${name}\nEmail: ${email}\nTelegram: ${tg || '-'}\n\nОписание проекта:\n${message}\n`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

// ===== Имитация отправки на сервер
async function trySendToServer(payload) {
  // Укажете свой эндпоинт — реальный запрос начнёт работать
  const ENDPOINT = ''; // пример: '/api/contact'
  if (!ENDPOINT) {
    // ИМИТАЦИЯ: задержка 1.2–2.0с и 85% успешных ответов
    const delay = 1200 + Math.random() * 800;
    return new Promise((resolve) => {
      setTimeout(() => {
        const ok = Math.random() < 0.85; // 85% успеха
        resolve({ ok, requestId: 'REQ-' + Date.now() });
      }, delay);
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return { ok: res.ok };
  } catch (e) {
    clearTimeout(timeoutId);
    return { ok: false };
  }
}

// ===== Отправка формы
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const errText = textsHolder?.dataset.error || 'Заполните имя, email и описание проекта.';
  const okText = textsHolder?.dataset.success || 'Спасибо! Заявка отправлена.';

  const name = nameInput?.value?.trim();
  const email = emailInput?.value?.trim();
  const tg = document.getElementById('f-tg')?.value?.trim();
  const message = msgInput?.value?.trim();

  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !message) {
    setHint(errText, 'error');
    return;
  }

  setHint('Отправляем заявку…');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.loading = '1';
    submitBtn.textContent = 'Отправляем…';
  }

  const payload = { name, email, tg, message, ts: Date.now() };
  const server = await trySendToServer(payload);

  if (server.ok) {
    setHint(okText, 'ok');
    form.reset();
  } else {
    // Fallback: откроем почтовый клиент с готовым письмом
    setHint(okText, 'ok');
    const href = buildMailtoHref({ name, email, tg, message });
    window.location.href = href;
    form.reset();
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    delete submitBtn.dataset.loading;
    submitBtn.textContent = 'Отправить заявку';
  }
});
