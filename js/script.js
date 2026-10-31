/* ============================================================
   EDIT THIS PART — make it yours
   You can also personalise the link: index.html?to=Aisha&from=Ravi
   ============================================================ */
const CONFIG = {
  her: "My love",
  you: "Me",
  lines: [
    "I have been trying to find the right words for a while.",
    "Then I realised I only ever need to think of you.",
    "You make ordinary days feel like they were planned just for us.",
    "I want a lifetime of those days, and I want them with you."
  ],
  question: "May I be yours for forever?",
  teases: [
    "Are you sure?",
    "That button looks a little shy.",
    "Your cheeks give you away.",
    "Okay, the other button is right there."
  ],
  yesTitle: "She said yes!",
  yesText: "You just made me the happiest person alive. I love you.",
};

/* ============================================================ */
const params = new URLSearchParams(location.search);
if (params.get("to"))   CONFIG.her = params.get("to");
if (params.get("from")) CONFIG.you = params.get("from");

const $ = (id) => document.getElementById(id);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

let lineIndex = 0;
let dodges = 0;

function show(sceneId) {
  document.querySelectorAll(".scene").forEach((s) => s.classList.remove("is-active"));
  $(sceneId).classList.add("is-active");
}

/* The page blushes more with every line she reads */
function setBlush(level) {
  document.documentElement.style.setProperty("--blush-level", level);
}

/* ---------- Scene 1: open the seal ---------- */
$("forLine").textContent = `A letter for ${CONFIG.her}`;
$("sealBtn").addEventListener("click", () => {
  show("scene-letter");
  showLine();
});

/* ---------- Scene 2: the letter ---------- */
function showLine() {
  $("letterLine").textContent = CONFIG.lines[lineIndex];
  setBlush((lineIndex + 1) / (CONFIG.lines.length + 1));
  $("nextBtn").textContent = lineIndex === CONFIG.lines.length - 1 ? "Continue" : "Keep reading";
  $("nextBtn").focus();
}

$("nextBtn").addEventListener("click", () => {
  lineIndex++;
  if (lineIndex < CONFIG.lines.length) {
    showLine();
  } else {
    $("question").textContent = CONFIG.question;
    setBlush(1);
    show("scene-ask");
    $("yesBtn").focus();
  }
});

/* ---------- Scene 3: the question ---------- */
const noBtn = $("noBtn");
const yesBtn = $("yesBtn");

function dodge(event) {
  if (event) event.preventDefault();
  dodges++;
  $("tease").textContent = CONFIG.teases[Math.min(dodges - 1, CONFIG.teases.length - 1)];

  // Yes grows, No shrinks
  yesBtn.style.transform = `scale(${Math.min(1 + dodges * 0.12, 1.8)})`;
  noBtn.style.transform = `scale(${Math.max(1 - dodges * 0.08, 0.55)})`;

  // Jump to a random spot that stays fully on screen
  noBtn.classList.add("is-dodging");
  const pad = 16;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  noBtn.style.left = pad + Math.random() * Math.max(maxX - pad, 0) + "px";
  noBtn.style.top = pad + Math.random() * Math.max(maxY - pad, 0) + "px";
}

noBtn.addEventListener("pointerenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: false });
noBtn.addEventListener("click", dodge);   // keyboard / fallback

/* ---------- Scene 4: she said yes ---------- */
yesBtn.addEventListener("click", () => {
  $("yesTitle").textContent = CONFIG.yesTitle;
  $("yesText").textContent = CONFIG.yesText;
  $("signoff").textContent = `Forever yours sujeetey 💗 And please give me a honest text about this one✨`;
  setBlush(1);
  show("scene-yes");
  celebrate();
});

function celebrate() {
  if (reduceMotion) return;
  const layer = $("hearts");
  const total = 70;
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const h = document.createElement("span");
      h.className = "heart";
      h.textContent = "♥";
      h.style.left = Math.random() * 100 + "vw";
      h.style.fontSize = 14 + Math.random() * 30 + "px";
      h.style.opacity = 0.5 + Math.random() * 0.5;
      h.style.setProperty("--spin", (Math.random() * 120 - 60) + "deg");
      h.style.animationDuration = 4 + Math.random() * 4 + "s";
      layer.appendChild(h);
      h.addEventListener("animationend", () => h.remove());
    }, i * 90);
  }
}
