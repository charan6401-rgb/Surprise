/* ══════════════════════════════════════════════════════════
   Happy Birthday Anusha — script.js
   ══════════════════════════════════════════════════════════ */

// ── PASSWORD ── change "anusha" to whatever you want ─────────
const SECRET = "anusha";

// ── CUSTOM CURSOR ────────────────────────────────────────────
const cur = document.getElementById("cursor");
document.addEventListener("mousemove", e => {
  cur.style.left = e.clientX + "px";
  cur.style.top  = e.clientY + "px";
});

// ── UNLOCK LOGIC ─────────────────────────────────────────────
document.getElementById("unlockBtn").addEventListener("click", tryUnlock);
document.getElementById("pwd").addEventListener("keydown", e => {
  if (e.key === "Enter") tryUnlock();
  // Clear error on new input
  document.getElementById("lerr").classList.remove("show");
});

function tryUnlock() {
  const val = document.getElementById("pwd").value.trim().toLowerCase();

  if (val === SECRET) {
    const lock = document.getElementById("lock");
    lock.classList.add("out");

    setTimeout(() => {
      lock.style.display = "none";
      document.getElementById("main").style.display = "block";
      document.getElementById("sbtn").style.display = "block";
      initAll();
      autoplayMusic();   // ← music starts automatically on unlock
    }, 700);

  } else {
    const err = document.getElementById("lerr");
    const inp = document.getElementById("pwd");
    err.classList.add("show");
    inp.classList.add("shake");
    setTimeout(() => inp.classList.remove("shake"), 500);
  }
}

// ── AUTOPLAY MUSIC ────────────────────────────────────────────
// Music plays automatically when the correct password is entered.
// The unlock button click counts as user interaction, which allows
// autoplay without being blocked by browsers.
//
// HOW TO ADD YOUR OWN SONG:
//   1. Place your .mp3 file in the same folder as index.html
//   2. Name it  music.mp3  (or change the src in index.html)
//   That's it — it will loop automatically.

let musicOn = true;   // starts as ON after unlock

function autoplayMusic() {
  const aud = document.getElementById("aud");
  aud.volume = 0.7;
  aud.play().catch(() => {
    // Autoplay blocked (rare since we're in a click handler)
    // Just update UI to show Off state
    musicOn = false;
    document.getElementById("mlbl").textContent = "Music Off";
    document.getElementById("mico").classList.add("paused");
  });
}

function toggleMusic() {
  const aud = document.getElementById("aud");
  musicOn = !musicOn;
  musicOn ? aud.play() : aud.pause();
  document.getElementById("mlbl").textContent  = musicOn ? "Music On"  : "Music Off";
  document.getElementById("mico").classList.toggle("paused", !musicOn);
}

// ── SURPRISE MODAL ───────────────────────────────────────────
function showS() {
  document.getElementById("smod").classList.add("show");
  launchConfetti();
}
function closeS() {
  document.getElementById("smod").classList.remove("show");
}

// ── LETTER CARD TOGGLE ────────────────────────────────────────
function toggleL(el) {
  el.classList.toggle("act");
}

// ── INIT — called after unlock ────────────────────────────────
function initAll() {
  startParticles();
  startFloatingHearts();
  startTyped();
  startCountdown();
  startMessageTyper();
  startScrollReveal();
  launchConfetti();
}

// ── PARTICLES ────────────────────────────────────────────────
function startParticles() {
  const canvas = document.getElementById("particles");
  const ctx    = canvas.getContext("2d");
  let W, H;
  const pts = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 90; i++) {
    pts.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a:  Math.random() * 0.5 + 0.2
    });
  }

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(236,72,153,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  })();
}

// ── FLOATING HEARTS ───────────────────────────────────────────
function startFloatingHearts() {
  const emojis = ["💜","🌸","💗","✨","🎂","🎀","⭐","🌟","💕","🎈"];
  setInterval(() => {
    const h = document.createElement("div");
    h.className = "fheart";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.cssText = [
      `left:${Math.random() * 100}vw`,
      `font-size:${Math.random() * 1.2 + 0.7}rem`,
      `animation-duration:${Math.random() * 6 + 7}s`,
      `animation-delay:0s`
    ].join(";");
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 14000);
  }, 850);
}

// ── TYPEWRITER EFFECT ──────────────────────────────────────────
function startTyped() {
  const lines = [
    "You are so loved 💜",
    "Wishing you the world 🌍",
    "Today is all yours ✨",
    "Shine like the star you are 🌟",
    "16 looks amazing on you 🎂",
    "Here's to you, always 🥂"
  ];
  let li = 0, ci = 0, deleting = false, pause = 0;
  const el = document.getElementById("typed");

  setInterval(() => {
    if (pause > 0) { pause--; return; }
    const line = lines[li];
    if (!deleting) {
      el.textContent = line.slice(0, ++ci);
      if (ci === line.length) { deleting = true; pause = 45; }
    } else {
      el.textContent = line.slice(0, --ci);
      if (ci === 0) { deleting = false; li = (li + 1) % lines.length; pause = 12; }
    }
  }, 75);
}

// ── LIVE TIME-ALIVE COUNTDOWN ──────────────────────────────────
function startCountdown() {
  const bday = new Date("2009-03-28T00:00:00");

  const MS = { sec: 1000, min: 60000, hour: 3600000, day: 86400000 };

  function update() {
    let diff = Date.now() - bday.getTime();

    const y  = Math.floor(diff / (365.25  * MS.day));  diff -= y  * 365.25  * MS.day;
    const mo = Math.floor(diff / (30.4375 * MS.day));  diff -= mo * 30.4375 * MS.day;
    const d  = Math.floor(diff / MS.day);               diff -= d  * MS.day;
    const h  = Math.floor(diff / MS.hour);              diff -= h  * MS.hour;
    const mi = Math.floor(diff / MS.min);               diff -= mi * MS.min;
    const s  = Math.floor(diff / MS.sec);

    document.getElementById("ty").textContent  = y;
    document.getElementById("tm").textContent  = mo;
    document.getElementById("td").textContent  = d;
    document.getElementById("th").textContent  = h;
    document.getElementById("tmi").textContent = mi;
    document.getElementById("ts").textContent  = s;
  }

  update();
  setInterval(update, 1000);
}

// ── MESSAGE TYPEWRITER ────────────────────────────────────────
function startMessageTyper() {
  const msg =
`Hey Anusha,

Happy Birthday. 🎂

I don't think you always realise just how much light you bring to the people around you — but you do. Every single day.

Today is yours. Enjoy every single second of it.

With love, always. 💜`;

  const el  = document.getElementById("mtxt");
  const sig = document.getElementById("msig");
  let i = 0;

  setTimeout(() => {
    const iv = setInterval(() => {
      el.textContent = msg.slice(0, ++i);
      if (i >= msg.length) {
        clearInterval(iv);
        sig.style.transition = "opacity 1.2s ease";
        sig.style.opacity    = "1";
      }
    }, 22);
  }, 700);
}

// ── SCROLL REVEAL ─────────────────────────────────────────────
function startScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (!entry.isIntersecting) return;
      const isCard = entry.target.classList.contains("lcard") ||
                     entry.target.classList.contains("acard");
      setTimeout(
        () => entry.target.classList.add("vis"),
        isCard ? idx * 70 : 0
      );
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".rev, .lcard, .acard").forEach(el => obs.observe(el));
}

// ── CONFETTI ──────────────────────────────────────────────────
function launchConfetti() {
  const colors = ["#7c3aed","#ec4899","#f43f5e","#f59e0b","#fff","#a78bfa","#fb7185","#fcd34d"];

  for (let i = 0; i < 110; i++) {
    const c    = document.createElement("div");
    c.className = "cpiece";
    const size  = Math.random() * 10 + 4;
    const round = Math.random() > 0.5;

    c.style.cssText = [
      `left:${Math.random() * 100}vw`,
      `top:-10px`,
      `width:${size}px`,
      `height:${round ? size : size * (Math.random() * 1.5 + 0.5)}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration:${Math.random() * 2.5 + 2}s`,
      `animation-delay:${Math.random() * 2}s`,
      `border-radius:${round ? "50%" : "2px"}`
    ].join(";");

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }
                                      }
