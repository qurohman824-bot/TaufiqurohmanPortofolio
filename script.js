// Loader
const loader = document.querySelector(".page-loader");
window.addEventListener("load", () => setTimeout(() => loader?.classList.add("loaded"), 450));

// Reveal on scroll
const revealObs = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); o.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

const aboutImage = document.querySelector("#aboutPhoto img");
const showAboutImageFallback = () => {
  const fallback = aboutImage.dataset.fallback;
  if (fallback && aboutImage.getAttribute("src") !== fallback) aboutImage.src = fallback;
};
aboutImage?.addEventListener("error", showAboutImageFallback, { once: true });
if (aboutImage?.complete && !aboutImage.naturalWidth) showAboutImageFallback();

const aboutFrame = document.querySelector("#aboutPhoto");
const revealCanvas = document.querySelector("#tsubasaReveal");
const revealContext = revealCanvas?.getContext("2d");
const paintCanvas = document.createElement("canvas");
const paintContext = paintCanvas.getContext("2d");
const tsubasaImage = new Image();
let previousPaintPoint = null;
let clearRevealTimer;

function sizeTsubasaCanvas() {
  if (!revealCanvas || !paintContext) return;
  const scale = 2;
  const width = (aboutImage?.naturalWidth || 375) * scale;
  const height = (aboutImage?.naturalHeight || 500) * scale;
  revealCanvas.width = paintCanvas.width = width;
  revealCanvas.height = paintCanvas.height = height;
}

tsubasaImage.addEventListener("load", () => {
  if (revealContext) sizeTsubasaCanvas();
}, { once: true });
aboutImage?.addEventListener("load", () => {
  if (tsubasaImage.complete && tsubasaImage.naturalWidth) sizeTsubasaCanvas();
}, { once: true });
tsubasaImage.src = "assets/images/tsubasa-transparent.png";

function paintTsubasa(event) {
  if (!revealCanvas || !revealContext || !paintContext || !tsubasaImage.complete || !tsubasaImage.naturalWidth) return;
  clearTimeout(clearRevealTimer);
  aboutFrame.classList.add("tsubasa-active");
  const bounds = aboutFrame.getBoundingClientRect();
  const point = {
    x: (event.clientX - bounds.left) * revealCanvas.width / bounds.width,
    y: (event.clientY - bounds.top) * revealCanvas.height / bounds.height
  };
  const previous = previousPaintPoint || point;
  const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
  const brushRadius = Math.max(30, revealCanvas.width * .065);
  const steps = Math.max(1, Math.ceil(distance / (brushRadius * .3)));

  for (let step = 0; step <= steps; step++) {
    const progress = step / steps;
    const x = previous.x + (point.x - previous.x) * progress;
    const y = previous.y + (point.y - previous.y) * progress;
    const brush = paintContext.createRadialGradient(x, y, brushRadius * .55, x, y, brushRadius);
    brush.addColorStop(0, "rgba(255,255,255,1)");
    brush.addColorStop(1, "rgba(255,255,255,0)");
    paintContext.fillStyle = brush;
    paintContext.beginPath();
    paintContext.arc(x, y, brushRadius, 0, Math.PI * 2);
    paintContext.fill();
  }
  previousPaintPoint = point;

  revealContext.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
  revealContext.drawImage(tsubasaImage, 0, 0, revealCanvas.width, revealCanvas.height);
  revealContext.globalCompositeOperation = "destination-in";
  revealContext.drawImage(paintCanvas, 0, 0);
  revealContext.globalCompositeOperation = "source-over";
}

function resetTsubasaReveal() {
  aboutFrame.classList.remove("tsubasa-active");
  previousPaintPoint = null;
  clearRevealTimer = setTimeout(() => {
    paintContext?.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    revealContext?.clearRect(0, 0, revealCanvas.width, revealCanvas.height);
  }, 200);
}

aboutFrame?.addEventListener("pointerenter", paintTsubasa);
aboutFrame?.addEventListener("pointermove", paintTsubasa);
aboutFrame?.addEventListener("pointerleave", resetTsubasaReveal);

// Nav: active link + mascot follows + dark/light switch
const nav = document.querySelector("#pillNav"), mascot = document.querySelector("#mascot");
const links = [...nav.querySelectorAll(".nav-link")];
const sections = links.map(l => document.querySelector(l.getAttribute("href")));
const moveMascot = () => { const a = nav.querySelector(".active"); if (a) mascot.style.left = `${a.offsetLeft + a.offsetWidth / 2}px`; };
function onScroll() {
  const mid = scrollY + innerHeight * .4;
  let cur = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= mid) cur = i; });
  links.forEach((l, i) => l.classList.toggle("active", i === cur));
  const light = sections[2].offsetTop <= scrollY + 60;
  document.body.classList.toggle("on-light", light);
  moveMascot();
}
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", moveMascot); onScroll();

// Timeline: item nearest to the vertical center of the viewport is highlighted
const tlItems = [...document.querySelectorAll(".tl-item")];
function highlightTimeline() {
  document.querySelectorAll("[data-timeline]").forEach(tl => {
    if (tl.matches(":hover")) return;
    let best = null, bd = 1e9;
    [...tl.children].forEach(it => {
      const r = it.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - innerHeight * .55);
      it.classList.remove("on"); if (d < bd) { bd = d; best = it; }
    });
    best?.classList.add("on");
    // first item stays lit until the user scrolls into the list
    if (tl.scrollTop === 0 && bd > innerHeight * .6) tl.firstElementChild.classList.add("on");
  });
}
addEventListener("scroll", highlightTimeline, { passive: true });
document.querySelectorAll("[data-timeline]").forEach(t => {
  t.addEventListener("scroll", highlightTimeline, { passive: true });
  t.addEventListener("pointerover", e => {
    const item = e.target.closest(".tl-item");
    if (!item || !t.contains(item)) return;
    [...t.children].forEach(entry => entry.classList.toggle("on", entry === item));
  });
  t.addEventListener("pointerleave", highlightTimeline);
});
highlightTimeline();

// Tabs + folder shortcuts
const segBtns = document.querySelectorAll(".seg-btn"), panels = document.querySelectorAll(".panel");
function openTab(name) {
  segBtns.forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  panels.forEach(p => { const on = p.id === name; p.hidden = !on; p.classList.toggle("active", on); });
}
segBtns.forEach(b => b.addEventListener("click", () => openTab(b.dataset.tab)));
document.querySelectorAll("[data-open-tab]").forEach(f => f.addEventListener("click", () => { openTab(f.dataset.openTab); document.querySelector("#portfolio").scrollIntoView(); }));

document.querySelectorAll("[data-project-gallery]").forEach(gallery => {
  const preview = gallery.querySelector(".project-screen");
  const image = gallery.querySelector("[data-project-image]");
  const fullView = gallery.parentElement.querySelector("[data-project-full]");
  gallery.querySelectorAll("[data-project-page]").forEach(button => {
    button.addEventListener("click", () => {
      image.src = button.dataset.image;
      image.alt = button.dataset.alt;
      preview.dataset.layout = button.dataset.layout;
      fullView.href = button.dataset.image;
      gallery.querySelectorAll("[data-project-page]").forEach(choice => {
        const active = choice === button;
        choice.classList.toggle("active", active);
        choice.setAttribute("aria-pressed", String(active));
      });
    });
  });
});

// Folder counts follow the real number of items
const countOf = { projects: "#projects .card" };
document.querySelectorAll("[data-count]").forEach(el => el.textContent = document.querySelectorAll(countOf[el.dataset.count]).length);

// Carousels
document.querySelectorAll(".carousel").forEach(c => {
  const t = c.querySelector(".track"), step = () => t.clientWidth * .6;
  c.querySelector(".prev").addEventListener("click", () => t.scrollBy({ left: -step(), behavior: "smooth" }));
  c.querySelector(".next").addEventListener("click", () => t.scrollBy({ left: step(), behavior: "smooth" }));
});

// Contact form -> opens email app (ganti alamat email di bawah)
document.querySelector("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.currentTarget), to = "emailkamu@example.com";
  location.href = `mailto:${to}?subject=${encodeURIComponent("Portfolio contact from " + f.get("name"))}&body=${encodeURIComponent(`Nama: ${f.get("name")}\nEmail: ${f.get("email")}\n\n${f.get("message")}`)}`;
});

// Comments (disimpan di localStorage browser pengunjung)
const KEY = "taufiq-comments", list = document.querySelector("#commentList"), countEl = document.querySelector("#commentCount");
let comments = []; try { comments = JSON.parse(localStorage.getItem(KEY)) || []; } catch {}
const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function renderComments() {
  countEl.textContent = `(${comments.length})`;
  list.innerHTML = comments.length ? comments.map(c => `<li>${c.photo ? `<img src="${c.photo}" alt="">` : `<span class="ava">👤</span>`}<b>${esc(c.name)}</b><time>${c.date}</time><p>${esc(c.text)}</p></li>`).join("") : `<li><p style="grid-column:1/4">Belum ada komentar. Jadilah yang pertama!</p></li>`;
}
let photoData = "";
document.querySelector("#cphoto").addEventListener("change", e => {
  const file = e.target.files[0]; photoData = ""; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert("Ukuran berkas maksimal 5 MB."); e.target.value = ""; return; }
  const img = new Image(); img.onload = () => { const c = document.createElement("canvas"); c.width = c.height = 80; const x = c.getContext("2d"), s = Math.min(img.width, img.height); x.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 80, 80); photoData = c.toDataURL("image/jpeg", .8); };
  img.src = URL.createObjectURL(file);
});
document.querySelector("#commentForm").addEventListener("submit", e => {
  e.preventDefault(); const f = new FormData(e.currentTarget);
  comments.unshift({ name: f.get("cname"), text: f.get("ctext"), photo: photoData, date: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) });
  try { localStorage.setItem(KEY, JSON.stringify(comments)); } catch {}
  e.currentTarget.reset(); photoData = ""; renderComments();
});
renderComments();
document.querySelector("#year").textContent = new Date().getFullYear();
