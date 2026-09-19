/* ==========================================================================
   ICON STUDIO — script.js
   Vanilla JavaScript. No libraries, no build step.
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE CONFIG — edit these values only. They are used everywhere on the site.
   -------------------------------------------------------------------------- */

const SITE_CONFIG = {
  // Country code + number, digits only. Example: "919830000000"
  whatsappNumber: "91XXXXXXXXXX",
  // Full Instagram profile URL, e.g. "https://www.instagram.com/iconstudio/"
  instagramUrl: "#",
  // Leave blank to hide the line on the contact page.
  email: "",
  phone: "",
  location: "Kolkata, West Bengal, India"
};

// Message pre-filled when someone taps the floating button or a WhatsApp link.
const WHATSAPP_DEFAULT_MESSAGE =
  "Hi Icon Studio, I'd like to enquire about a product shoot.";


(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");


  /* ---------------------------------------------------------------- utils */

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function waLink(message) {
    // Strip formatting only — a placeholder number stays visibly a placeholder.
    var number = String(SITE_CONFIG.whatsappNumber || "").replace(/[\s()+-]/g, "");
    var base = "https://wa.me/" + number;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }


  /* ----------------------------------------------- empty image placeholders */
  /* Every portfolio/studio image ships with an empty src. Hide the element
     until a real photograph is added so no broken-image glyph appears.      */

  function initEmptyImages() {
    $$(".frame img").forEach(function (img) {
      var src = img.getAttribute("src");

      if (!src || src.trim() === "") {
        img.setAttribute("data-empty", "");
      }

      img.addEventListener("error", function () {
        img.setAttribute("data-empty", "");
      });

      img.addEventListener("load", function () {
        if (img.currentSrc) img.removeAttribute("data-empty");
      });
    });
  }


  /* ------------------------------------------------------------ navigation */

  function initNavigation() {
    var header = $(".site-header");
    if (!header) return;

    var lastY = window.pageYOffset;
    var ticking = false;

    function update() {
      var y = window.pageYOffset;

      header.classList.toggle("is-stuck", y > 8);

      var menuOpen = document.body.classList.contains("menu-open");
      if (!menuOpen && y > 240 && y > lastY + 4) {
        header.classList.add("is-hidden");
      } else if (y < lastY - 4 || y < 240) {
        header.classList.remove("is-hidden");
      }

      lastY = y;
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    update();
  }


  /* ----------------------------------------------------------- mobile menu */

  function initMobileMenu() {
    var toggle = $(".nav__toggle");
    var menu = $("#site-menu");
    if (!toggle || !menu) return;

    var labelEl = $(".nav__toggle-label", toggle);

    function focusables() {
      return [toggle].concat($$("a[href], button", menu));
    }

    function open() {
      menu.hidden = false;
      // Force a frame so the transition runs from the hidden state.
      window.requestAnimationFrame(function () {
        menu.classList.add("is-open");
      });
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      if (labelEl) labelEl.textContent = "Close";
    }

    function close() {
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      if (labelEl) labelEl.textContent = "Menu";
      window.setTimeout(function () {
        if (!menu.classList.contains("is-open")) menu.hidden = true;
      }, reduceMotion.matches ? 0 : 240);
    }

    toggle.addEventListener("click", function () {
      if (menu.hidden) { open(); } else { close(); }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (menu.hidden) return;

      if (event.key === "Escape") {
        close();
        toggle.focus();
        return;
      }

      // Keep tabbing inside the open menu.
      if (event.key === "Tab") {
        var items = focusables();
        var first = items[0];
        var last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024 && !menu.hidden) close();
    });
  }


  /* ------------------------------------------------- category hover previews */

  function initIndexPreviews() {
    var rows = $$(".index-row[data-preview]");
    var previews = $$(".index-preview[data-preview]");
    if (!rows.length || !previews.length) return;

    function activate(key) {
      previews.forEach(function (preview) {
        preview.classList.toggle("is-active", preview.getAttribute("data-preview") === key);
      });
      var caption = $(".index-previews__cap");
      var row = rows.filter(function (r) { return r.getAttribute("data-preview") === key; })[0];
      if (caption && row) {
        caption.textContent = row.getAttribute("data-caption") || "";
      }
    }

    rows.forEach(function (row) {
      var key = row.getAttribute("data-preview");
      row.addEventListener("mouseenter", function () { activate(key); });
      row.addEventListener("focus", function () { activate(key); });
    });

    activate(rows[0].getAttribute("data-preview"));
  }


  /* ------------------------------------------------------- portfolio filter */

  function initPortfolioFilters() {
    var bar = $(".filters");
    var items = $$(".gallery__item");
    if (!bar || !items.length) return;

    var count = $(".filters__count");

    function apply(filter) {
      var shown = 0;

      items.forEach(function (item) {
        var categories = (item.getAttribute("data-category") || "").split(/\s+/);
        var match = filter === "all" || categories.indexOf(filter) !== -1;
        item.hidden = !match;
        if (match) shown += 1;
      });

      $$(".filter", bar).forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === filter));
      });

      if (count) {
        count.textContent = shown + (shown === 1 ? " project" : " projects");
      }
    }

    bar.addEventListener("click", function (event) {
      var button = event.target.closest(".filter");
      if (!button) return;
      apply(button.getAttribute("data-filter"));
    });

    apply("all");
  }


  /* ------------------------------------------------------------------- FAQ */

  function initFAQ() {
    var lists = $$(".faq");
    if (!lists.length) return;

    lists.forEach(function (list) {
      $$(".faq__item", list).forEach(function (item, index) {
        var button = $(".faq__btn", item);
        var panel = $(".faq__panel", item);
        if (!button || !panel) return;

        var uid = Math.random().toString(36).slice(2, 7) + "-" + index;
        panel.id = panel.id || "faq-panel-" + uid;
        button.id = button.id || "faq-btn-" + uid;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", panel.id);
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-labelledby", button.id);

        button.addEventListener("click", function () {
          var isOpen = item.classList.toggle("is-open");
          button.setAttribute("aria-expanded", String(isOpen));
        });
      });
    });
  }


  /* --------------------------------------------------------- scroll reveal */

  function initScrollReveal() {
    var targets = $$("[data-reveal]");
    if (!targets.length) return;

    // Stagger children inside a group.
    $$("[data-stagger]").forEach(function (group) {
      $$("[data-reveal]", group).forEach(function (child, index) {
        child.style.setProperty("--i", String(index));
      });
    });

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el) { observer.observe(el); });
  }


  /* -------------------------------------------------- config-driven content */

  function initWhatsApp() {
    var href = waLink(WHATSAPP_DEFAULT_MESSAGE);

    $$("[data-whatsapp]").forEach(function (link) {
      link.setAttribute("href", href);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });

    if (/X/i.test(String(SITE_CONFIG.whatsappNumber))) {
      window.console && console.warn(
        "[Icon Studio] Add the studio WhatsApp number in SITE_CONFIG (js/script.js)."
      );
    }
  }

  function initSiteDetails() {
    $$("[data-instagram]").forEach(function (link) {
      link.setAttribute("href", SITE_CONFIG.instagramUrl || "#");
      if (SITE_CONFIG.instagramUrl && SITE_CONFIG.instagramUrl !== "#") {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener");
      }
    });

    // Contact details: fill from config, hide the row when nothing is set.
    [["email", "mailto:"], ["phone", "tel:"], ["location", null]].forEach(function (pair) {
      var key = pair[0];
      var scheme = pair[1];
      var value = SITE_CONFIG[key];

      $$('[data-config="' + key + '"]').forEach(function (el) {
        var row = el.closest("[data-config-row]") || el;

        if (!value) {
          row.hidden = true;
          return;
        }

        el.textContent = value;
        if (scheme && el.tagName === "A") {
          el.setAttribute("href", scheme + String(value).replace(/\s+/g, ""));
        }
      });
    });

    $$("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }


  /* -------------------------------------------------------- enquiry form */

  function initEnquiryForm() {
    var form = $("#enquiry-form");
    if (!form) return;

    var status = $(".form-status", form);
    var submitting = false;

    var REQUIRED = ["name", "phone", "category", "shoot"];

    function fieldOf(input) {
      return input.closest(".field");
    }

    function setError(input, message) {
      var field = fieldOf(input);
      if (!field) return;
      var errorEl = $(".field__error", field);
      field.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(input) {
      var field = fieldOf(input);
      if (!field) return;
      field.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
    }

    function validate() {
      var firstInvalid = null;

      REQUIRED.forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        var value = String(input.value || "").trim();

        if (!value) {
          setError(input, "Required");
          if (!firstInvalid) firstInvalid = input;
        } else if (name === "phone" && value.replace(/[^0-9]/g, "").length < 8) {
          setError(input, "Enter a valid phone number");
          if (!firstInvalid) firstInvalid = input;
        } else {
          clearError(input);
        }
      });

      var email = form.elements.email;
      if (email) {
        var emailValue = String(email.value || "").trim();
        if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailValue)) {
          setError(email, "Enter a valid email address");
          if (!firstInvalid) firstInvalid = email;
        } else {
          clearError(email);
        }
      }

      return firstInvalid;
    }

    function line(label, value) {
      var clean = String(value || "").trim();
      return clean ? label + ": " + clean + "\n" : "";
    }

    function buildMessage() {
      var f = form.elements;
      var message = "Hi Icon Studio,\n\n";
      message += "I'd like to enquire about a product shoot.\n\n";
      message += line("Name", f.name.value);
      message += line("Brand", f.brand && f.brand.value);
      message += line("Phone", f.phone.value);
      message += line("Email", f.email && f.email.value);
      message += line("Product category", f.category.value);
      message += line("Number of products", f.quantity && f.quantity.value);
      message += line("Shoot type", f.shoot.value);
      message += line("Images will be used for", f.usage && f.usage.value);
      message += line("Budget", f.budget && f.budget.value);
      message += line("Preferred date", f.date && f.date.value);
      message += line("Message", f.message && f.message.value);
      message += "\nPlease let me know the next steps.\n\nThanks.";
      return message;
    }

    form.addEventListener("input", function (event) {
      var target = event.target;
      if (target && target.name && fieldOf(target)) clearError(target);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (submitting) return;

      var firstInvalid = validate();

      if (firstInvalid) {
        if (status) status.textContent = "Please complete the highlighted fields";
        firstInvalid.focus();
        return;
      }

      submitting = true;
      if (status) status.textContent = "Opening WhatsApp…";

      var url = waLink(buildMessage());
      var opened = window.open(url, "_blank", "noopener");
      if (!opened) window.location.href = url;

      window.setTimeout(function () {
        submitting = false;
        if (status) status.textContent = "Enquiry ready in WhatsApp";
      }, 2500);
    });
  }


  /* ------------------------------------------------------- page transitions */

  function initPageTransitions() {
    if (reduceMotion.matches) return;

    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      var link = event.target.closest("a");
      if (!link) return;

      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#" || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      if (link.origin !== window.location.origin) return;
      if (link.pathname === window.location.pathname && link.hash) return;

      event.preventDefault();
      document.body.classList.add("is-leaving");

      window.setTimeout(function () {
        window.location.href = link.href;
      }, 230);
    });

    // Restore the page when coming back through the browser cache.
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) document.body.classList.remove("is-leaving");
    });
  }


  /* ------------------------------------------------------------------ boot */

  document.addEventListener("DOMContentLoaded", function () {
    initEmptyImages();
    initNavigation();
    initMobileMenu();
    initIndexPreviews();
    initPortfolioFilters();
    initFAQ();
    initScrollReveal();
    initWhatsApp();
    initSiteDetails();
    initEnquiryForm();
    initPageTransitions();
  });
})();
