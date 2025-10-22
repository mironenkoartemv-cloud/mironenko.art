// ===== ССЫЛКИ НА ЭЛЕМЕНТЫ
const header = document.querySelector("header");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const yearEl = document.getElementById("year");

// Контактная форма
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("f-name");
const emailInput = document.getElementById("f-email");
const msgInput = document.getElementById("f-msg");
const hintEl = document.getElementById("form-msg"); // контейнер для статуса
const textsHolder = document.getElementById("form-texts");

// ===== ДИНАМИЧЕСКИЙ ГОД
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== ТЕНЬ У ШАПКИ
const onScrollHeaderShadow = () => {
  if (window.scrollY > 4) header?.classList.add("header--shadow");
  else header?.classList.remove("header--shadow");
};
onScrollHeaderShadow();
window.addEventListener("scroll", onScrollHeaderShadow, { passive: true });

// ===== БУРГЕР-МЕНЮ
const toggleMenu = () => {
  menu?.classList.toggle("hidden");
  document.body.classList.toggle("no-scroll");
  if (burger) burger.textContent = menu?.classList.contains("hidden") ? "☰" : "✕";
};
burger?.addEventListener("click", toggleMenu);

// Закрытие меню по клику на пункт
menu?.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth < 768 && !menu.classList.contains("hidden")) toggleMenu();
  });
});

// ===== ПЛАВНЫЙ СКРОЛЛ С КОМПЕНСАЦИЕЙ ХЕДЕРА
const HEADER_OFFSET = 72;
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const top = window.scrollY + rect.top - HEADER_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
    history.pushState(null, "", id);
  });
});

// ===== FAQ АККОРДЕОН (только один открыт)
const faqRoot = document.getElementById("faq-list");
if (faqRoot) {
  const items = faqRoot.querySelectorAll("details");
  items.forEach((el) => {
    el.addEventListener("toggle", () => {
      if (el.open) items.forEach((other) => other !== el && (other.open = false));
    });
  });
}

// ===== REVEAL-Анимации
const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll("section, .card, article, figure, .rounded-2xl").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// ====== УТИЛИТЫ
function setHint(text, type = "info") {
  if (!hintEl) return;
  hintEl.textContent = text;
  hintEl.classList.remove("msg--ok", "msg--error");
  hintEl.classList.add("msg");
  if (type === "ok") hintEl.classList.add("msg--ok");
  if (type === "error") hintEl.classList.add("msg--error");
}

function buildMailtoHref({ name, email, tg, message }) {
  const to = "info.softmini@gmail.com";
  const subject = encodeURIComponent("Заявка с сайта Минисофт");
  const body = encodeURIComponent(
    `Имя: ${name}\nEmail: ${email}\nTelegram: ${tg || "-"}\n\nОписание проекта:\n${message}\n`
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

// Имитация отправки на сервер (можно заменить своим эндпоинтом)
async function trySendToServer(payload) {
  // если у тебя есть реальный эндпоинт, укажи его здесь
  const ENDPOINT = ""; // например: "/api/contact"
  if (!ENDPOINT) return { ok: false }; // выключено по умолчанию

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 7000); // таймаут 7s
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(t);
    return { ok: res.ok };
  } catch (e) {
    clearTimeout(t);
    return { ok: false };
  }
}

// ===== ВАЛИДАЦИЯ + SUBMIT С FALLBACK
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const errText = textsHolder?.dataset.error || "Заполните имя, email и описание проекта.";
  const okText = textsHolder?.dataset.success || "Спасибо! Заявка отправлена.";

  const name = nameInput?.value?.trim();
  const email = emailInput?.value?.trim();
  const tg = document.getElementById("f-tg")?.value?.trim();
  const message = msgInput?.value?.trim();

  // простая валидация
  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !message) {
    setHint(errText, "error");
    return;
  }

  setHint("Отправляем заявку…");

  // попытка отправки на сервер
  const payload = { name, email, tg, message, ts: Date.now() };
  const server = await trySendToServer(payload);

  if (server.ok) {
    setHint(okText, "ok");
    form.reset();
  } else {
    // Fallback через mailto
    setHint(okText, "ok");
    const href = buildMailtoHref({ name, email, tg, message });
    // Откроем почтовый клиент с готовым письмом
    window.location.href = href;
    form.reset();
  }
});
