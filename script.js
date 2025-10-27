// ===== ЭЛЕМЕНТЫ
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const popup = document.getElementById("success-popup");
const closePopup = document.getElementById("close-popup");
const btn = document.getElementById("form-submit");

// ===== ХЕЛПЕР СТАТУСА
function setStatus(text, type = "info") {
  if (!status) return;
  status.textContent = text || "";
  const base = "text-sm text-center msg h-5";
  status.className = base + (type === "error" ? " msg--error" : type === "ok" ? " msg--ok" : "");
}

// ===== ВАЛИДАЦИЯ
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TG_RE = /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/; // 5–32 символов

// ===== ОТПРАВКА ФОРМЫ (Formspree)
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("f-name")?.value?.trim();
  const email = document.getElementById("f-email")?.value?.trim();
  const telegram = document.getElementById("f-tg")?.value?.trim();
  const message = document.getElementById("f-msg")?.value?.trim();

  if (!name) return setStatus("Укажите имя.", "error");
  if (!email || !EMAIL_RE.test(email)) return setStatus("Указан неверный формат email.", "error");
  if (!message) return setStatus("Опишите проект в поле сообщения.", "error");
  if (telegram && !TG_RE.test(telegram)) {
    return setStatus("Неверный формат Telegram @username (5–32 символов, латиница/цифры/_, @ опционально).", "error");
  }

  btn?.setAttribute("disabled", "true");
  btn?.classList.add("opacity-60", "cursor-not-allowed");
  setStatus("Отправляем заявку…");

  try {
    // Берём endpoint из атрибута action формы
    const endpoint = form.getAttribute("action"); // https://formspree.io/f/mwpwvnrq

    const payload = {
      name,
      email,
      telegram,
      message,
      _subject: "Новая заявка с сайта Минисофт",
      _language: "ru"
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      setStatus("✅ Заявка отправлена.", "ok");
      popup?.classList.remove("hidden");
      form.reset();
    } else {
      const err = await resp.json().catch(() => ({}));
      const msg = err?.errors?.[0]?.message || "Ошибка отправки. Попробуйте ещё раз.";
      setStatus(msg, "error");
    }
  } catch {
    setStatus("Сеть недоступна. Проверьте соединение и попробуйте ещё раз.", "error");
  } finally {
    btn?.removeAttribute("disabled");
    btn?.classList.remove("opacity-60", "cursor-not-allowed");
  }
});

// ===== ЗАКРЫТИЕ ПОПАПА
const hideSuccessPopup = () => popup?.classList.add("hidden");
closePopup?.addEventListener("click", hideSuccessPopup);
popup?.addEventListener("click", (e) => {
  if (e.target === popup) hideSuccessPopup();
});
