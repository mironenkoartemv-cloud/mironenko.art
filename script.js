// ===== ССЫЛКИ НА ЭЛЕМЕНТЫ
const header = document.querySelector("header");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
const yearEl = document.getElementById("year");

// Контактная форма / попап
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const popup = document.getElementById("success-popup");
const closePopup = document.getElementById("close-popup");

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

// ===== REVEAL-Анимации (включая модификатор .from-left)
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.15 }
);

// Навесим .reveal, если не задан, и начнём наблюдение
document
  .querySelectorAll("section, .card, article, figure, .rounded-2xl, .reveal")
  .forEach((el) => {
    if (!el.classList.contains("reveal")) el.classList.add("reveal");
    observer.observe(el);
  });

// ===== Помощники для статуса формы
function setStatus(text, type = "info") {
  if (!status) return;
  status.textContent = text || "";
  status.className = "text-sm text-center h-5 msg";
  if (type === "ok") status.classList.add("msg--ok");
  if (type === "error") status.classList.add("msg--error");
}

// ===== ЛОГИКА ОТПРАВКИ ФОРМЫ + ПОПАП УСПЕХА
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("f-name")?.value?.trim();
  const email = document.getElementById("f-email")?.value?.trim();
  const message = document.getElementById("f-msg")?.value?.trim();

  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!name || !emailOk || !message) {
    setStatus("Заполните имя, корректный email и описание проекта.", "error");
    return;
  }

  setStatus("Отправляем заявку…");

  // Имитация запроса на сервер (замени при необходимости)
  await new Promise((r) => setTimeout(r, 800));

  setStatus("✅ Заявка отправлена.", "ok");
  popup?.classList.remove("hidden");
  form.reset();
});

// Закрытие попапа
closePopup?.addEventListener("click", () => popup?.classList.add("hidden"));
popup?.addEventListener("click", (e) => {
  if (e.target === popup) popup?.classList.add("hidden");
});
