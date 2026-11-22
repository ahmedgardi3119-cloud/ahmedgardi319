(function () {
  "use strict";

  var GITHUB_USER = "ahmedgardi3119-cloud";
  var EMAIL = "ahmedgardi.3119@gmail.com";
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var fine = !!(window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  if (reduce) root.classList.add("reduce");

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k === "class") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  /* ---------- Data ---------- */
  var VIS = {
    inventory:
      '<svg viewBox="0 0 320 180" aria-hidden="true"><rect class="v-bg" width="320" height="180"/>' +
      '<rect class="v-card" x="14" y="14" width="88" height="44" rx="10"/><rect class="v-card" x="116" y="14" width="88" height="44" rx="10"/><rect class="v-card" x="218" y="14" width="88" height="44" rx="10"/>' +
      '<rect class="v-a" x="24" y="26" width="30" height="7" rx="3"/><rect class="v-line" x="24" y="40" width="52" height="6" rx="3"/>' +
      '<rect class="v-b" x="126" y="26" width="30" height="7" rx="3"/><rect class="v-line" x="126" y="40" width="40" height="6" rx="3"/>' +
      '<rect class="v-c" x="228" y="26" width="30" height="7" rx="3"/><rect class="v-line" x="228" y="40" width="48" height="6" rx="3"/>' +
      '<rect class="v-card" x="14" y="70" width="180" height="96" rx="10"/>' +
      '<rect class="v-a" x="30" y="128" width="16" height="28" rx="4"/><rect class="v-b" x="56" y="106" width="16" height="50" rx="4"/><rect class="v-a" x="82" y="118" width="16" height="38" rx="4"/><rect class="v-c" x="108" y="92" width="16" height="64" rx="4"/><rect class="v-b" x="134" y="112" width="16" height="44" rx="4"/><rect class="v-a" x="160" y="100" width="16" height="56" rx="4"/>' +
      '<rect class="v-card" x="206" y="70" width="100" height="96" rx="10"/>' +
      '<circle class="v-ring" cx="256" cy="118" r="26" stroke="var(--line)"/><circle class="v-ring" cx="256" cy="118" r="26" stroke="var(--brand)" stroke-dasharray="70 164" transform="rotate(-90 256 118)"/><circle class="v-ring" cx="256" cy="118" r="26" stroke="var(--brand-2)" stroke-dasharray="52 164" stroke-dashoffset="-72" transform="rotate(-90 256 118)"/><circle class="v-ring" cx="256" cy="118" r="26" stroke="var(--accent)" stroke-dasharray="34 164" stroke-dashoffset="-126" transform="rotate(-90 256 118)"/></svg>',
    students:
      '<svg viewBox="0 0 320 180" aria-hidden="true"><rect class="v-bg" width="320" height="180"/>' +
      '<rect class="v-card" x="14" y="14" width="292" height="152" rx="12"/><rect class="v-a" x="28" y="28" width="70" height="10" rx="5"/><rect class="v-b" x="262" y="24" width="30" height="18" rx="9"/>' +
      [0, 1, 2, 3].map(function (i) {
        var y = 56 + i * 27;
        return '<circle class="' + ["v-a", "v-b", "v-c", "v-a"][i] + '" cx="40" cy="' + (y + 8) + '" r="8"/><rect class="v-line" x="58" y="' + (y + 2) + '" width="' + [96, 80, 110, 70][i] + '" height="7" rx="3"/><rect class="v-line" x="190" y="' + (y + 2) + '" width="50" height="7" rx="3"/><rect class="v-card" x="256" y="' + (y - 1) + '" width="34" height="18" rx="9"/>';
      }).join("") + "</svg>",
    traces:
      '<svg viewBox="0 0 320 180" aria-hidden="true"><rect class="v-bg" width="320" height="180"/>' +
      '<path class="v-card" d="M80 28 L128 44 V92 C128 120 108 138 80 150 C52 138 32 120 32 92 V44 Z" transform="translate(10 0)"/>' +
      '<path d="M66 90 l16 16 l30 -34" fill="none" stroke="var(--brand-2)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(10 0)"/>' +
      '<rect class="v-card" x="172" y="30" width="136" height="38" rx="10"/><rect class="v-a" x="184" y="43" width="60" height="8" rx="4"/><rect class="v-line" x="184" y="55" width="90" height="6" rx="3"/>' +
      '<rect class="v-card" x="172" y="80" width="136" height="38" rx="10"/><rect class="v-c" x="184" y="93" width="44" height="8" rx="4"/><rect class="v-line" x="184" y="105" width="100" height="6" rx="3"/>' +
      '<rect class="v-line" x="172" y="138" width="136" height="6" rx="3"/><circle class="v-b" cx="238" cy="141" r="10"/></svg>'
  };

  var PROJECTS = [
    {
      repo: "inventory-billing-system", vis: "inventory",
      title: "Inventory & Billing System",
      summary: "A full-stack app for small shop owners to manage stock, bill customers and send invoices on WhatsApp.",
      cats: ["React", "Node.js", "Database"],
      features: [
        "Sign up and log in with email or phone, using a password or a one-time code, secured with JWT sessions.",
        "Dashboard with total revenue, orders, stock count and low-stock alerts, plus a payment-method donut chart.",
        "Inventory management with categories, units, prices and a configurable low-stock level.",
        "Point-of-sale billing: live product search, cart, discount, and automatic stock deduction on every sale.",
        "Invoices go straight to the customer's WhatsApp with itemised details, totals and payment mode.",
        "Sales history, profile settings and a clear-data option."
      ],
      stack: ["React", "Tailwind CSS", "Recharts", "Node.js", "Express", "MongoDB", "JWT"],
      links: [{ label: "View on GitHub", href: "https://github.com/" + GITHUB_USER + "/inventory-billing-system" }]
    },
    {
      repo: "student-dashboard", vis: "students",
      title: "Student Dashboard",
      summary: "A student management dashboard with a REST API and a cloud PostgreSQL database behind it.",
      cats: ["Node.js", "Database"],
      features: [
        "Add, edit, delete and list students from a responsive interface written in plain HTML, CSS and JavaScript.",
        "Express API with validated input on every route and clear error responses.",
        "PostgreSQL storage that works with Supabase, Railway or Render, with SSL handled automatically.",
        "An animated particle background drawn on a canvas that reacts to the mouse."
      ],
      stack: ["JavaScript", "Express", "PostgreSQL", "REST API", "Canvas"],
      links: [{ label: "View on GitHub", href: "https://github.com/" + GITHUB_USER + "/student-dashboard" }]
    },
    {
      repo: "social-media-safety", vis: "traces",
      title: "Traces: Social Media Safety",
      summary: "A college community project: an interactive website that teaches people how to protect their digital footprint.",
      cats: ["React"],
      features: [
        "Five topic pages covering trackers and ads, social safety, digital footprint and account security, plus a quiz.",
        "Interactive pieces: a photo metadata reveal, a before and after privacy slider and a fake-account checker.",
        "Built with React 19, Vite and Tailwind CSS 4, and deployed automatically with GitHub Actions.",
        "Made with my CEP team at Mumbai University."
      ],
      stack: ["React", "Vite", "Tailwind CSS", "React Router", "GitHub Actions"],
      links: [
        { label: "Open live site", href: "https://btwebrahim.github.io/social-media-safety/" },
        { label: "View on GitHub", href: "https://github.com/" + GITHUB_USER + "/social-media-safety" }
      ]
    }
  ];

  var SKILLS = [
    { name: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Vite"] },
    { name: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT auth", "Python", "Flask"] },
    { name: "Databases", items: ["MongoDB", "PostgreSQL", "SQL"] },
    { name: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel", "GitHub Pages"] }
  ];
  var TECH_TOTAL = SKILLS.reduce(function (n, g) { return n + g.items.length; }, 0);
  var gh = {};

  function timeAgo(iso) {
    var d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (isNaN(d) || d < 0) return "";
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 30) return d + " days ago";
    var m = Math.floor(d / 30);
    return m === 1 ? "1 month ago" : m + " months ago";
  }

  /* ---------- Year ---------- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  var themeBtn = $("#themeBtn"), themeSvg = $("svg", themeBtn);
  var MOON = '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A6 6 0 0 1 12.4 3.1C12.3 3 12.1 3 12 3z"/>';
  var SUN = '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/></g>';
  function paintTheme() {
    var dark = root.getAttribute("data-theme") !== "light";
    themeSvg.innerHTML = dark ? SUN : MOON;
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute("content", dark ? "#070b1a" : "#f2f4fc");
    drawStatic();
  }
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintTheme();
  });

  /* ---------- Mobile menu ---------- */
  var bar = $("#top-bar"), burger = $("#burger");
  function setMenu(open) {
    bar.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!bar.classList.contains("open")); });
  $$("#nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---------- Scroll progress ---------- */
  var prog = $("#progress"), pTick = false;
  function updateProgress() {
    pTick = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
  }
  window.addEventListener("scroll", function () { if (!pTick) { pTick = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();

  /* ---------- Typed role ---------- */
  var typed = $("#typed");
  var roles = ["full-stack web apps", "React interfaces", "REST APIs with Node.js", "tools that solve real problems"];
  if (reduce) { typed.textContent = roles[0]; }
  else {
    var ri = 0, ci = 0, del = false;
    typed.textContent = "";
    (function tick() {
      var w = roles[ri];
      ci += del ? -1 : 1;
      typed.textContent = w.slice(0, ci);
      var d = del ? 28 : 60;
      if (!del && ci === w.length) { d = 1800; del = true; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 350; }
      setTimeout(tick, d);
    })();
  }

  /* ---------- Tech marquee ---------- */
  var track = $("#track");
  var all = []; SKILLS.forEach(function (g) { all = all.concat(g.items); });
  for (var rep = 0; rep < 2; rep++) all.forEach(function (t) { track.appendChild(el("span", { text: t })); });

  /* ---------- Skills grid ---------- */
  var sg = $("#skillgrid");
  SKILLS.forEach(function (g, i) {
    var box = el("div", { class: "skillbox reveal" }, [
      el("h3", { text: g.name }),
      el("ul", null, g.items.map(function (t) { return el("li", { text: t }); }))
    ]);
    box.style.setProperty("--d", i * 0.08 + "s");
    sg.appendChild(box);
  });

  /* ---------- Projects ---------- */
  var cards = $("#cards"), dlg = $("#dlg"), dlgIn = $("#dlgIn"), lastFocus = null;

  PROJECTS.forEach(function (p, i) {
    var meta = el("span", { class: "meta", "data-repo": p.repo, text: "Open for details" });
    var more = el("button", { class: "more", type: "button", text: "Details", "aria-label": "Open details for " + p.title });
    var card = el("article", { class: "card reveal", tabindex: "0", role: "button", "aria-label": p.title + ": open details" }, [
      el("div", { class: "card-vis", html: VIS[p.vis] }),
      el("div", { class: "card-body" }, [
        el("h3", { text: p.title }),
        el("p", { text: p.summary }),
        el("ul", { class: "tags" }, p.stack.slice(0, 4).map(function (s) { return el("li", { text: s }); })),
        el("div", { class: "card-foot" }, [meta, more])
      ])
    ]);
    card.setAttribute("data-cats", p.cats.join(","));
    card.style.setProperty("--d", i * 0.1 + "s");
    card.addEventListener("click", function () { openProject(i, card); });
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProject(i, card); } });
    if (fine && !reduce) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%");
        card.style.setProperty("--ry", (px - 0.5) * 8 + "deg"); card.style.setProperty("--rx", (0.5 - py) * 8 + "deg");
      });
      card.addEventListener("pointerleave", function () { card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg"); });
    }
    cards.appendChild(card);
  });

  function openProject(i, from) {
    var p = PROJECTS[i], g = gh[p.repo];
    lastFocus = from || null;
    dlgIn.innerHTML = "";
    var close = el("button", { class: "dlg-x", type: "button", "aria-label": "Close", html: "&times;" });
    close.addEventListener("click", function () { dlg.close(); });
    var live = el("div", { class: "live" });
    if (g) {
      var when = timeAgo(g.pushed_at);
      if (when) live.appendChild(el("span", null, [el("strong", { text: "Last updated " }), document.createTextNode(when)]));
      if (g.language) live.appendChild(el("span", null, [el("strong", { text: "Main language " }), document.createTextNode(g.language)]));
    }
    dlgIn.appendChild(close);
    dlgIn.appendChild(el("h3", { id: "dlgTitle", text: p.title }));
    dlgIn.appendChild(el("p", { class: "lead", text: p.summary }));
    dlgIn.appendChild(el("h4", { text: "What it does" }));
    dlgIn.appendChild(el("ul", { class: "feats" }, p.features.map(function (f) { return el("li", { text: f }); })));
    dlgIn.appendChild(el("h4", { text: "Built with" }));
    dlgIn.appendChild(el("ul", { class: "tags" }, p.stack.map(function (s) { return el("li", { text: s }); })));
    if (live.childNodes.length) dlgIn.appendChild(live);
    dlgIn.appendChild(el("div", { class: "links" }, p.links.map(function (l, idx) {
      return el("a", { class: "btn small" + (idx === 0 ? " primary" : ""), href: l.href, target: "_blank", rel: "noopener", text: l.label });
    })));
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });

  $$(".chip[data-filter]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      $$(".chip[data-filter]").forEach(function (c) {
        var on = c === chip; c.classList.toggle("on", on); c.setAttribute("aria-pressed", String(on));
      });
      $$(".card", cards).forEach(function (card) {
        var cats = (card.getAttribute("data-cats") || "").split(",");
        card.hidden = !(f === "all" || cats.indexOf(f) !== -1);
      });
    });
  });

  /* ---------- Stats counters ---------- */
  var statTargets = { projects: PROJECTS.length, repos: 4, tech: TECH_TOTAL };
  function setStat(key, n) { var b = $('[data-stat="' + key + '"]'); if (b) b.textContent = n; }
  function countUp(key) {
    var to = statTargets[key], t0 = null;
    if (reduce) { setStat(key, to); return; }
    (function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / 1500);
      setStat(key, Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var counted = false;
  function runCounters() { if (counted) return; counted = true; Object.keys(statTargets).forEach(countUp); }
  setTimeout(runCounters, 600);

  /* ---------- Scroll reveal + active nav ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (n) { io.observe(n); });

    var links = $$("#nav a");
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-sec") === en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { so.observe(s); });
  } else {
    revealEls.forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- Code card tilt ---------- */
  var cc = $("#codeCard"), heroEl = $("#top");
  if (cc && fine && !reduce) {
    heroEl.addEventListener("pointermove", function (e) {
      var r = cc.getBoundingClientRect(), px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth, py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      cc.style.setProperty("--ry", px * 16 + "deg"); cc.style.setProperty("--rx", -py * 16 + "deg");
    });
    heroEl.addEventListener("pointerleave", function () { cc.style.setProperty("--rx", "0deg"); cc.style.setProperty("--ry", "0deg"); });
  }

  /* ---------- Cursor glow ---------- */
  var glow = $("#glow");
  if (glow && fine && !reduce) {
    var gx = 0, gy = 0, gtx = 0, gty = 0, gOn = false;
    window.addEventListener("pointermove", function (e) { gtx = e.clientX; gty = e.clientY; if (!gOn) { gOn = true; gx = gtx; gy = gty; glow.style.opacity = "1"; } });
    (function loop() {
      gx += (gtx - gx) * 0.12; gy += (gty - gy) * 0.12;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Animated network background ---------- */
  var cv = $("#net"), ctx = cv.getContext("2d"), W = 0, H = 0, pts = [], mouse = { x: -9999, y: -9999 }, running = false;
  function rgb() {
    var s = getComputedStyle(root);
    return { a: s.getPropertyValue("--net-a").trim() || "112,128,255", b: s.getPropertyValue("--net-b").trim() || "39,211,240" };
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(95, (W * H) / 15000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.7 });
    drawStatic();
  }
  function draw(move) {
    var c = rgb(), LINK = 135, MLINK = 170;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (move) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
      }
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < LINK * LINK) {
          ctx.strokeStyle = "rgba(" + c.a + "," + (0.34 * (1 - Math.sqrt(d) / LINK)) + ")";
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
      if (md < MLINK * MLINK) {
        ctx.strokeStyle = "rgba(" + c.b + "," + (0.6 * (1 - Math.sqrt(md) / MLINK)) + ")";
        ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        if (move) { p.x += mx * 0.0016; p.y += my * 0.0016; }
      }
      ctx.fillStyle = "rgba(" + (i % 3 === 0 ? c.b : c.a) + ",0.85)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
  }
  function drawStatic() { if (reduce || !running) draw(false); }
  function loop() { if (!running) return; if (!document.hidden) draw(true); requestAnimationFrame(loop); }
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  resize();
  if (!reduce) { running = true; requestAnimationFrame(loop); }
  paintTheme();

  /* ---------- Live GitHub data ---------- */
  if (window.fetch) {
    fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw new Error("GitHub " + r.status); return r.json(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        repos.forEach(function (r) { gh[r.name] = r; });
        $$(".meta[data-repo]").forEach(function (m) {
          var r = gh[m.getAttribute("data-repo")]; if (!r) return;
          var w = timeAgo(r.pushed_at); if (w) m.textContent = "Updated " + w;
        });
        statTargets.repos = repos.length; if (counted) setStat("repos", repos.length);
        var note = $("#ghNote"); if (note) note.textContent = "Three projects, built end to end. Open one to see how it works. Live from GitHub: " + repos.length + " public repositories.";
      })
      .catch(function () { /* keep static content */ });
  }

  /* ---------- Contact ---------- */
  var copyBtn = $("#copyBtn"), copied = $("#copied");
  copyBtn.addEventListener("click", function () {
    function done(ok) { copied.textContent = ok ? "Copied to clipboard" : "Press Ctrl+C to copy"; setTimeout(function () { copied.textContent = ""; }, 2400); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(false); });
    else done(false);
  });
  var form = $("#mailForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#fName"), msg = $("#fMsg"), note = $("#formNote"), ok = true;
    [name, msg].forEach(function (f) { var bad = !f.value.trim(); f.classList.toggle("invalid", bad); if (bad) ok = false; });
    if (!ok) { note.textContent = "Please fill in your name and a message."; return; }
    note.textContent = "Opening your email app. If nothing opens, write to " + EMAIL + ".";
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Portfolio message from " + name.value.trim()) + "&body=" + encodeURIComponent(msg.value.trim() + "\n\n" + name.value.trim());
  });
})();
