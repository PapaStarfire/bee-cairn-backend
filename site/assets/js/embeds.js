/* ------------------------------------------------------------------
   Practice configuration.

   These five values are the only things that need changing to put
   this site live. Everything else runs on its own.

   Leave a value as an empty string and the page shows a calm
   placeholder card in place of that embed. Nothing breaks, and
   nothing looks broken to a visitor.

   Set mode to "link" instead of "embed" if a provider ever changes
   its embedding rules. The section then renders a single large
   button out to the provider, and the layout stays intact.
   ------------------------------------------------------------------ */
var PRACTICE = {
  calUsername:  "",               // Cal.com username, e.g. "hermi"
  calEventSlug: "",               // Cal.com event slug, e.g. "60-minute-accompaniment"
  tallyFormId:  "",               // Tally form id, the characters after tally.so/r/
  contactEmail: "",               // e.g. "hello@example.org"
  mode:         "embed"           // "embed" or "link"
};

(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme ---------- */
  var toggle = document.getElementById("theme-toggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function currentlyDark() {
    var set = root.dataset.theme;
    if (set === "dark") return true;
    if (set === "light") return false;
    return systemPrefersDark();
  }

  function syncToggleLabel() {
    if (!toggle) return;
    var dark = currentlyDark();
    toggle.setAttribute("aria-label", dark ? "Switch to light appearance" : "Switch to dark appearance");
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentlyDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggleLabel();
    });
    syncToggleLabel();

    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function () { if (!root.dataset.theme) syncToggleLabel(); };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  function closeNav() {
    if (!mobileNav || !navToggle) return;
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.hidden;
      mobileNav.hidden = !open;
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileNav.hidden) { closeNav(); navToggle.focus(); }
    });
  }

  /* ---------- Current section in the navigation ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    var watched = [];

    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) { byId[id] = link; watched.push(section); }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    watched.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Embeds ---------- */
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }

  function card(heading, body, action) {
    var wrap = el("div", { class: "flex h-full flex-col items-start justify-center gap-4 p-8 sm:p-12" });
    wrap.appendChild(el("h3", { class: "font-display text-xl font-semibold" }, heading));
    wrap.appendChild(el("p", { class: "prose-measure text-[0.97rem] text-muted" }, body));
    if (action) {
      var link = el("a", {
        class: "mt-2 rounded-xl bg-lantern px-6 py-3.5 font-semibold text-bg hover:opacity-90",
        href: action.href
      }, action.label);
      if (action.external) { link.setAttribute("rel", "noopener noreferrer"); link.setAttribute("target", "_blank"); }
      wrap.appendChild(link);
    }
    return wrap;
  }

  function frame(src, title, height) {
    var f = el("iframe", {
      src: src,
      title: title,
      loading: "lazy",
      width: "100%",
      height: String(height),
      frameborder: "0",
      class: "block w-full",
      referrerpolicy: "strict-origin-when-cross-origin"
    });
    f.style.border = "0";
    f.style.minHeight = height + "px";
    return f;
  }

  function render(node, content) {
    node.textContent = "";
    node.appendChild(content);
  }

  /* Booking */
  var bookNode = document.getElementById("book-embed");
  if (bookNode) {
    var calReady = PRACTICE.calUsername && PRACTICE.calEventSlug;
    var calUrl = "https://cal.com/" + PRACTICE.calUsername + "/" + PRACTICE.calEventSlug;

    if (!calReady) {
      render(bookNode, card(
        "Booking opens shortly",
        "The calendar is being prepared. Until it is live, an enquiry through the intake form reaches me just as well, and I will offer times by email in your own time zone.",
        { href: "#intake", label: "Send an enquiry instead" }
      ));
    } else if (PRACTICE.mode === "link") {
      render(bookNode, card(
        "Choose a time",
        "The booking calendar opens in a new tab. Every time shown converts automatically to your own time zone.",
        { href: calUrl, label: "Open the calendar", external: true }
      ));
    } else {
      render(bookNode, frame(calUrl + "?embed=true&layout=month_view", "Booking calendar", 700));
    }
  }

  /* Intake */
  var intakeNode = document.getElementById("intake-embed");
  if (intakeNode) {
    var tallyUrl = "https://tally.so/embed/" + PRACTICE.tallyFormId +
                   "?alignLeft=1&hideTitle=1&transparentBackground=1";

    if (!PRACTICE.tallyFormId) {
      render(intakeNode, card(
        "The intake form is being prepared",
        "It will appear here once it is ready. If you would like to begin before then, a short note by email is enough to start, and I will send the form directly to you.",
        PRACTICE.contactEmail
          ? { href: "mailto:" + PRACTICE.contactEmail, label: "Write to me" }
          : null
      ));
    } else if (PRACTICE.mode === "link") {
      render(intakeNode, card(
        "Complete the intake form",
        "The form opens in a new tab. It takes most people under ten minutes and is completed once, before a first session.",
        { href: "https://tally.so/r/" + PRACTICE.tallyFormId, label: "Open the intake form", external: true }
      ));
    } else {
      render(intakeNode, frame(tallyUrl, "Client intake form and consent", 880));
    }
  }

  /* ---------- Contact and year ---------- */
  var contact = document.getElementById("contact-link");
  if (contact && PRACTICE.contactEmail) {
    contact.href = "mailto:" + PRACTICE.contactEmail;
    contact.textContent = PRACTICE.contactEmail;
  }

  var year = document.getElementById("copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
