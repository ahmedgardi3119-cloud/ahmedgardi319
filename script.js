(function () {
  "use strict";

  var GITHUB_USER = "ahmedgardi3119-cloud";
  var EMAIL = "ahmedgardi.3119@gmail.com";
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Fit the big name to the page width ---------- */
  var fit = document.getElementById("fit");
  var inner = document.querySelector(".hero-inner");
  function fitName() {
    if (!fit || !inner) return;
    var cs = getComputedStyle(inner);
    var avail = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    fit.style.fontSize = "100px";
    var w = fit.getBoundingClientRect().width;
    if (w > 0) fit.style.fontSize = Math.max(40, Math.floor(100 * avail / w * 0.985)) + "px";
  }
  fitName();
  window.addEventListener("resize", fitName);

  /* ---------- Entrance: wait for the fonts, then play once ---------- */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    fitName();
    root.classList.add("is-ready");
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
    setTimeout(start, 1200); /* never wait longer than this */
  } else {
    start();
  }

  /* ---------- Nav turns solid after the hero starts to scroll away ---------- */
  var nav = document.getElementById("nav");
  /* ---------- Parallax on the skyline layers ---------- */
  var layers = [].slice.call(document.querySelectorAll(".hero .layer[data-speed]"));
  var sun = document.querySelector(".sun");
  var hero = document.getElementById("top");
  var ticking = false;

  function onScroll() {
    ticking = false;
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle("solid", y > 40);
    if (reduce || !hero) return;
    var limit = hero.offsetHeight;
    if (y > limit) return;
    layers.forEach(function (el) {
      var s = parseFloat(el.getAttribute("data-speed")) || 0;
      el.style.translate = "0 " + (y * s).toFixed(1) + "px";
    });
    if (sun) sun.style.translate = "0 " + (y * 0.06).toFixed(1) + "px";
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Departure board: letters settle when it scrolls into view ---------- */
  var board = document.getElementById("board");
  var cells = [].slice.call(document.querySelectorAll("[data-flap]"));
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  cells.forEach(function (c) { c.textContent = c.getAttribute("data-flap"); });

  function flap(el, delay) {
    var target = el.getAttribute("data-flap");
    var total = target.length;
    var began = null;
    var span = Math.min(1100, 380 + total * 14);
    function frame(t) {
      if (began === null) began = t + delay;
      var p = (t - began) / span;
      if (p < 0) { el.textContent = target.replace(/[^\s·.\-]/g, " "); requestAnimationFrame(frame); return; }
      var done = Math.floor(Math.min(1, p) * total);
      var out = "";
      for (var i = 0; i < total; i++) {
        var ch = target.charAt(i);
        if (i < done || /[\s·.\-]/.test(ch)) out += ch;
        else out += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
    }
    requestAnimationFrame(frame);
  }

  if (board && !reduce && "IntersectionObserver" in window) {
    var seen = false;
    new IntersectionObserver(function (entries, obs) {
      if (seen || !entries[0].isIntersecting) return;
      seen = true;
      obs.disconnect();
      cells.forEach(function (c, i) { flap(c, Math.floor(i / 2) * 140); });
    }, { threshold: 0.35 }).observe(board);
  }

  /* ---------- Live GitHub details (fails quietly) ---------- */
  function ago(iso) {
    var d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (isNaN(d) || d < 0) return "";
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 30) return d + " days ago";
    var m = Math.floor(d / 30);
    return m === 1 ? "1 month ago" : m + " months ago";
  }
  if (window.fetch) {
    fetch("https://api.github.com/users/" + GITHUB_USER + "/repos?per_page=100")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        repos.forEach(function (r) {
          var box = document.getElementById("live-" + r.name);
          if (!box) return;
          var bits = [];
          var when = ago(r.pushed_at);
          if (when) bits.push("Last updated " + when);
          if (r.language) bits.push(r.language);
          box.textContent = bits.join("  ·  ");
        });
        var note = document.getElementById("ghNote");
        if (note) note.textContent = "Three projects, each built end to end. " + repos.length + " public repositories on GitHub.";
      })
      .catch(function () {});
  }

  /* ---------- Contact ---------- */
  var copyBtn = document.getElementById("copyBtn");
  var copied = document.getElementById("copied");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      function done(ok) {
        if (!copied) return;
        copied.textContent = ok ? "Copied" : "Select the address and copy it";
        setTimeout(function () { copied.textContent = ""; }, 2400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(false); });
      } else {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById("mailLink"));
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
      if (!ok) { note.textContent = "Please fill in your name and a message."; return; }
      var subject = "Portfolio message from " + name.value.trim();
      var body = msg.value.trim() + "\n\n" + name.value.trim();
      note.textContent = "Opening your email app. If nothing opens, write to " + EMAIL + ".";
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
