(function () {
  "use strict";

  var GITHUB_USER = "ahmedgardi3119-cloud";
  var EMAIL = "ahmedgardi.3119@gmail.com";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Project data ---------- */
  var PROJECTS = [
    {
      repo: "inventory-billing-system",
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
      repo: "student-dashboard",
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
      repo: "social-media-safety",
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

  /* ---------- Small helpers ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "class") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function timeAgo(iso) {
    var days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (isNaN(days) || days < 0) return "";
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return days + " days ago";
    var months = Math.floor(days / 30);
    return months === 1 ? "1 month ago" : months + " months ago";
  }

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("themeBtn");
  var themeSvg = themeBtn ? themeBtn.querySelector("svg") : null;
  var MOON = '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A6 6 0 0 1 12.4 3.1C12.3 3 12.1 3 12 3z"/>';
  var SUN = '<circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/></g>';

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function paintThemeIcon() {
    var dark = currentTheme() === "dark";
    if (themeSvg) themeSvg.innerHTML = dark ? SUN : MOON;
    if (themeBtn) themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#090e22" : "#edf0f7");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintThemeIcon();
    });
  }
  paintThemeIcon();

  /* ---------- Hero name: letters react to the cursor ---------- */
  var BASE_W = 760;
  var MIN_W = 240;
  var RADIUS = 260;
  var letters = [];

  document.querySelectorAll("h1 .line").forEach(function (line) {
    var text = line.getAttribute("data-text") || "";
    line.textContent = "";
    text.split("").forEach(function (ch) {
      var span = el("span", { class: "ch", text: ch });
      span.style.setProperty("--w", reduceMotion ? BASE_W : MIN_W);
      line.appendChild(span);
      letters.push({ node: span, w: reduceMotion ? BASE_W : MIN_W, target: BASE_W });
    });
  });

  var pointer = null;
  var ticking = false;

  function frame() {
    ticking = false;
    var moving = false;
    for (var i = 0; i < letters.length; i++) {
      var L = letters[i];
      var target = BASE_W;
      if (pointer) {
        var r = L.node.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dist = Math.hypot(pointer.x - cx, pointer.y - cy);
        var p = Math.max(0, 1 - dist / RADIUS);
        target = BASE_W - p * p * (BASE_W - MIN_W);
      }
      L.w += (target - L.w) * 0.18;
      if (Math.abs(target - L.w) > 0.5) moving = true; else L.w = target;
      L.node.style.setProperty("--w", L.w.toFixed(1));
    }
    if (moving || pointer) request();
  }
  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }

  if (!reduceMotion) {
    /* One orchestrated moment: letters grow in weight on load. */
    setTimeout(request, 150);
    var hero = document.getElementById("top");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        pointer = { x: e.clientX, y: e.clientY };
        request();
      });
      hero.addEventListener("pointerleave", function () {
        pointer = null;
        request();
      });
    }
  }

  /* ---------- Projects ---------- */
  var list = document.getElementById("projects");
  var plus = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';

  PROJECTS.forEach(function (p, i) {
    var panelId = "panel-" + i;
    var btn = el("button", { class: "proj-head", type: "button", "aria-expanded": "false", "aria-controls": panelId }, [
      el("span", { class: "proj-title", text: p.title }),
      el("span", { class: "proj-sum", text: p.summary }),
      el("span", { class: "proj-toggle" })
    ]);
    btn.querySelector(".proj-toggle").innerHTML = plus;

    var feats = el("ul", { class: "proj-feats" }, p.features.map(function (f) { return el("li", { text: f }); }));
    var tags = el("ul", { class: "tags" }, p.stack.map(function (s) { return el("li", { text: s }); }));
    var live = el("div", { class: "live", id: "live-" + p.repo });
    var links = el("div", { class: "proj-links" }, p.links.map(function (l, idx) {
      return el("a", { class: "btn small" + (idx === 0 ? " primary" : ""), href: l.href, target: "_blank", rel: "noopener", text: l.label });
    }));

    var inner = el("div", { class: "proj-inner" }, [
      el("div", null, [el("h4", { text: "What it does" }), feats]),
      el("div", null, [el("h4", { text: "Built with" }), tags, live, links])
    ]);
    var panel = el("div", { class: "proj-panel", id: panelId, role: "region", "aria-label": p.title + " details" }, [el("div", null, [inner])]);

    var li = el("li", { class: "proj" }, [btn, panel]);
    li.setAttribute("data-cats", p.cats.join(","));
    list.appendChild(li);

    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
    });
  });

  /* Open the first project so the page never looks empty */
  var firstBtn = list.querySelector(".proj-head");
  if (firstBtn) firstBtn.click();

  /* Filters */
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      list.querySelectorAll(".proj").forEach(function (item) {
        var cats = (item.getAttribute("data-cats") || "").split(",");
        item.hidden = !(f === "all" || cats.indexOf(f) !== -1);
      });
    });
  });

  /* ---------- Live GitHub data (fails quietly if offline or rate-limited) ---------- */
  function loadGithub() {
    if (!window.fetch) return;
    fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100&sort=pushed")
      .then(function (r) { if (!r.ok) throw new Error("GitHub " + r.status); return r.json(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        var byName = {};
        repos.forEach(function (r) { byName[r.name] = r; });

        PROJECTS.forEach(function (p) {
          var r = byName[p.repo];
          var box = document.getElementById("live-" + p.repo);
          if (!r || !box) return;
          var when = timeAgo(r.pushed_at);
          if (when) {
            var a = el("span", null, [el("strong", { text: "Last updated " }), document.createTextNode(when)]);
            box.appendChild(a);
          }
          if (r.language) {
            box.appendChild(el("span", null, [el("strong", { text: "Main language " }), document.createTextNode(r.language)]));
          }
          if (r.stargazers_count > 0) {
            box.appendChild(el("span", null, [el("strong", { text: "Stars " }), document.createTextNode(String(r.stargazers_count))]));
          }
        });

        var note = document.getElementById("ghNote");
        if (note) note.textContent = "Live from GitHub: " + repos.length + " public repositories.";
      })
      .catch(function () { /* keep the static content */ });
  }
  loadGithub();

  /* ---------- Contact ---------- */
  var copyBtn = document.getElementById("copyBtn");
  var copied = document.getElementById("copied");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      function done(ok) {
        if (!copied) return;
        copied.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
        setTimeout(function () { copied.textContent = ""; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(false); });
      } else {
        var range = document.createRange();
        var link = document.getElementById("mailLink");
        range.selectNodeContents(link);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        done(false);
      }
    });
  }

  var form = document.getElementById("mailForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("fName");
      var msg = document.getElementById("fMsg");
      var note = document.getElementById("formNote");
      var ok = true;
      [name, msg].forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        note.textContent = "Please fill in your name and a message.";
        return;
      }
      var subject = "Portfolio message from " + name.value.trim();
      var body = msg.value.trim() + "\n\n" + name.value.trim();
      note.textContent = "Opening your email app. If nothing opens, write to " + EMAIL + ".";
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
