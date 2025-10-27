/* =========
   БАЗА
   ========= */
:root{
  --sky-50:#f0f9ff;
  --sky-100:#e0f2fe;
  --sky-200:#bae6fd;
  --sky-300:#7dd3fc;
  --sky-500:#0ea5e9;
  --sky-600:#0284c7;
  --slate-500:#64748b;
  --slate-600:#475569;
  --radius:16px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body.no-scroll { overflow: hidden; }

/* =========
   КАРТОЧКИ / ИНПУТЫ / СООБЩЕНИЯ
   ========= */
.card{
  border:1px solid var(--sky-100);
  background:#fff;
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 2px rgba(2,132,199,.04);
  transition: box-shadow .2s ease, transform .2s ease;
}
.card:hover{
  box-shadow: 0 8px 26px rgba(2,132,199,.12);
  transform: translateY(-2px);
}

.input{
  width: 100%;
  border:1px solid var(--sky-200);
  background:#fff;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  transition: box-shadow .15s ease, border-color .15s ease;
}
.input:focus{
  border-color: var(--sky-300);
  box-shadow: 0 0 0 4px rgba(125,211,252,.35);
}

.msg{ font-size:12px; line-height:1.4; }
.msg--error{ color:#b91c1c; }
.msg--ok{ color:#0369a1; }

/* =========
   ХЕДЕР — ТЕНЬ ПРИ СКРОЛЛЕ
   ========= */
.header--shadow{
  box-shadow: 0 8px 26px rgba(2,132,199,.10);
}

/* =========
   REVEAL-Анимация
   ========= */
.reveal{
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .6s ease, transform .6s ease;
}
.reveal.is-visible{
  opacity: 1;
  transform: translateY(0);
}
/* Модификатор «вплывание слева» */
.reveal.from-left{ transform: translateX(-24px); }
.reveal.from-left.is-visible{ transform: translateX(0); }

@media (prefers-reduced-motion: reduce){
  .reveal{ opacity:1; transform:none; transition:none; }
  .reveal.from-left{ transform:none; }
}

/* =========
   FAQ (если есть)
   ========= */
#faq-list summary{ list-style:none; user-select:none; }
#faq-list summary::-webkit-details-marker{ display:none; }
