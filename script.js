(() => {
  "use strict";

  const HEADER = document.querySelector(".site-header");
  const NAV_TOGGLE = document.getElementById("nav-toggle");
  const NAV_MENU = document.getElementById("nav-menu");
  const NAV_LINKS = [...document.querySelectorAll(".nav__link")];
  const SECTIONS = [...document.querySelectorAll("main section[id]")];
  const BACK_TO_TOP = document.getElementById("back-to-top");
  const TYPED_EL = document.getElementById("typed-text");
  const YEAR_EL = document.getElementById("year");
  const CONTACT_FORM = document.getElementById("contact-form");
  const FORM_STATUS = document.getElementById("form-status");
  const BACK_TO_TOP_THRESHOLD = 360;

  const ROLES = [
    "secure enterprise platforms.",
    "full-stack web apps.",
    "Flutter mobile experiences.",
    "LLM-powered workflows.",
    "scalable APIs and systems.",
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (YEAR_EL) {
    YEAR_EL.textContent = String(new Date().getFullYear());
  }

  const formatExperience = (startIso) => {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) {
      return "professional experience";
    }

    const now = new Date();
    let totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

    if (now.getDate() < start.getDate()) {
      totalMonths -= 1;
    }
    totalMonths = Math.max(0, totalMonths);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months === 0) {
      return "Fresh graduate";
    }
    if (years === 0) {
      return `${months} mo experience`;
    }
    if (months === 0) {
      return years === 1 ? "1 yr experience" : `${years} yrs experience`;
    }
    const yearPart = years === 1 ? "1 yr" : `${years} yrs`;
    const monthPart = months === 1 ? "1 mo" : `${months} mo`;
    return `${yearPart} ${monthPart} experience`;
  };

  const experienceEl = document.getElementById("experience-years");
  if (experienceEl) {
    const start = experienceEl.dataset.start || "2024-06-01";
    experienceEl.textContent = formatExperience(start);
  }

  const MAIN = document.getElementById("main");
  const NAV_CLOSE = document.getElementById("nav-close");
  const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const getFocusable = (root) =>
    [...root.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
    );

  const setMenuOpen = (open) => {
    if (!NAV_TOGGLE || !NAV_MENU) {
      return;
    }

    NAV_TOGGLE.setAttribute("aria-expanded", String(open));
    NAV_TOGGLE.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    NAV_MENU.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);

    const mobile = window.matchMedia("(max-width: 1024px)").matches;
    if (mobile) {
      NAV_MENU.setAttribute("aria-hidden", String(!open));
      if (MAIN) {
        MAIN.toggleAttribute("inert", open);
      }
    } else {
      NAV_MENU.removeAttribute("aria-hidden");
      MAIN?.removeAttribute("inert");
    }

    if (open && mobile) {
      const focusTarget = NAV_CLOSE || getFocusable(NAV_MENU)[0];
      requestAnimationFrame(() => focusTarget?.focus());
    } else if (!open) {
      NAV_TOGGLE.focus();
    }
  };

  NAV_TOGGLE?.addEventListener("click", () => {
    const open = NAV_TOGGLE.getAttribute("aria-expanded") !== "true";
    setMenuOpen(open);
  });

  NAV_CLOSE?.addEventListener("click", () => setMenuOpen(false));

  NAV_MENU?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setMenuOpen(false);
      return;
    }

    if (e.key !== "Tab" || !NAV_MENU) {
      return;
    }

    const focusables = getFocusable(NAV_MENU);
    const toggleVisible = NAV_TOGGLE && window.getComputedStyle(NAV_TOGGLE).display !== "none";
    const cycle = toggleVisible ? [NAV_TOGGLE, ...focusables] : focusables;
    if (!cycle.length) {
      return;
    }

    const first = cycle[0];
    const last = cycle[cycle.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  const NAV_PARENT = NAV_MENU?.parentElement;
  const placeNavMenu = () => {
    if (!NAV_MENU || !NAV_PARENT) {
      return;
    }
    const mobile = window.matchMedia("(max-width: 1024px)").matches;
    if (mobile && NAV_MENU.parentElement !== document.body) {
      document.body.appendChild(NAV_MENU);
      if (!document.body.classList.contains("nav-open")) {
        NAV_MENU.setAttribute("aria-hidden", "true");
      }
    } else if (!mobile && NAV_MENU.parentElement !== NAV_PARENT) {
      NAV_PARENT.appendChild(NAV_MENU);
      NAV_MENU.removeAttribute("aria-hidden");
      setMenuOpen(false);
    }
  };
  placeNavMenu();
  window.addEventListener("resize", placeNavMenu);

  const onScrollChrome = () => {
    const y = window.scrollY;
    HEADER?.classList.toggle("is-scrolled", y > 12);
    BACK_TO_TOP?.classList.toggle("is-visible", y > BACK_TO_TOP_THRESHOLD);
  };
  onScrollChrome();
  window.addEventListener("scroll", onScrollChrome, { passive: true });

  const setActiveLink = () => {
    const offset = HEADER ? HEADER.offsetHeight + 24 : 96;
    let current = SECTIONS[0]?.id;

    for (const section of SECTIONS) {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) {
        current = section.id;
      }
    }

    NAV_LINKS.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") {
        return;
      }

      e.preventDefault();
      setMenuOpen(false);

      const behavior = prefersReducedMotion ? "auto" : "smooth";

      if (id === "#top") {
        window.scrollTo({ top: 0, left: 0, behavior });
        history.pushState(null, "", "#top");
        return;
      }

      const target = document.querySelector(id);
      if (!target) {
        return;
      }

      const headerOffset = HEADER ? HEADER.offsetHeight + 8 : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
      history.pushState(null, "", id);
    });
  });

  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  if (!prefersReducedMotion) {
    const orbs = document.querySelectorAll(".ambient__orb");
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) {
          return;
        }
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          orbs.forEach((orb, i) => {
            const factor = (i + 1) * 0.04;
            orb.style.translate = `0 ${y * factor}px`;
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  const typeRoles = async () => {
    if (!TYPED_EL) {
      return;
    }

    if (prefersReducedMotion) {
      TYPED_EL.textContent = ROLES[0];
      return;
    }

    let roleIndex = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const typeText = async (text) => {
      for (let i = 0; i <= text.length; i++) {
        TYPED_EL.textContent = text.slice(0, i);
        await sleep(38 + Math.random() * 28);
      }
    };

    const eraseText = async () => {
      const text = TYPED_EL.textContent || "";
      for (let i = text.length; i >= 0; i--) {
        TYPED_EL.textContent = text.slice(0, i);
        await sleep(22);
      }
    };

    while (true) {
      await typeText(ROLES[roleIndex]);
      await sleep(1600);
      await eraseText();
      await sleep(280);
      roleIndex = (roleIndex + 1) % ROLES.length;
    }
  };

  typeRoles();

  document.querySelectorAll("[data-tabs]").forEach((tabsRoot) => {
    const tabs = [...tabsRoot.querySelectorAll('[role="tab"]')];
    const panels = [...tabsRoot.querySelectorAll('[role="tabpanel"]')];

    const activate = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((panel) => {
        const match = panel.id === tab.getAttribute("aria-controls");
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") {
          next = tabs[(index + 1) % tabs.length];
        }
        if (e.key === "ArrowLeft") {
          next = tabs[(index - 1 + tabs.length) % tabs.length];
        }
        if (e.key === "Home") {
          next = tabs[0];
        }
        if (e.key === "End") {
          next = tabs[tabs.length - 1];
        }
        if (!next) {
          return;
        }
        e.preventDefault();
        next.focus();
        activate(next);
      });
    });
  });

  const courseFilters = document.querySelector(".course-filters");
  const coursePills = [...document.querySelectorAll(".course-pill")];

  courseFilters?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) {
      return;
    }

    const filter = btn.getAttribute("data-filter");
    courseFilters.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip === btn);
    });

    coursePills.forEach((pill) => {
      const show = filter === "all" || pill.getAttribute("data-cat") === filter;
      pill.classList.toggle("is-hidden", !show);
    });
  });

  if (CONTACT_FORM) {
    const composeBtn = CONTACT_FORM.querySelector("#compose-email");

    const LIMITS = Object.freeze({
      name: Object.freeze({ min: 1, max: 100 }),
      email: Object.freeze({ min: 3, max: 254 }),
      subject: Object.freeze({ min: 1, max: 150 }),
      message: Object.freeze({ min: 1, max: 2000 }),
    });

    const MAX_MAILTO_URI_LENGTH = 2000;

    const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/g;
    const CONTROL_CHARS_KEEP_LF_TAB = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
    const INVISIBLE_FORMAT = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\uFFF9-\uFFFB]/g;
    const LINE_SEPARATORS = /[\r\n\u2028\u2029]+/g;

    const fields = [
      {
        key: "name",
        input: CONTACT_FORM.querySelector("#name"),
        count: CONTACT_FORM.querySelector("#name-count"),
      },
      {
        key: "email",
        input: CONTACT_FORM.querySelector("#email"),
        count: CONTACT_FORM.querySelector("#email-count"),
      },
      {
        key: "subject",
        input: CONTACT_FORM.querySelector("#subject"),
        count: CONTACT_FORM.querySelector("#subject-count"),
      },
      {
        key: "message",
        input: CONTACT_FORM.querySelector("#message"),
        count: CONTACT_FORM.querySelector("#message-count"),
        multiline: true,
      },
    ];

    const fieldByKey = Object.fromEntries(fields.map((field) => [field.key, field]));

    const canonicalize = (value) => String(value ?? "").normalize("NFC");

    const sanitizeSingleLine = (raw, max) =>
      canonicalize(raw)
        .replace(LINE_SEPARATORS, " ")
        .replace(CONTROL_CHARS, "")
        .replace(INVISIBLE_FORMAT, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max);

    const sanitizeMultiline = (raw, max) =>
      canonicalize(raw)
        .replace(/\r\n?/g, "\n")
        .replace(CONTROL_CHARS_KEEP_LF_TAB, "")
        .replace(INVISIBLE_FORMAT, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, max);

    const isValidName = (value) => {
      if (value.length < LIMITS.name.min || value.length > LIMITS.name.max) {
        return false;
      }
      if (!/^[\p{L}\p{M}\s.'-]+$/u.test(value)) {
        return false;
      }
      return /\p{L}/u.test(value);
    };

    const isValidEmail = (value) => {
      if (value.length < LIMITS.email.min || value.length > LIMITS.email.max) {
        return false;
      }

      const at = value.lastIndexOf("@");
      if (at < 1 || at !== value.indexOf("@")) {
        return false;
      }

      const local = value.slice(0, at);
      const domain = value.slice(at + 1);

      if (
        !local ||
        !domain ||
        local.length > 64 ||
        domain.length > 253 ||
        local.startsWith(".") ||
        local.endsWith(".") ||
        local.includes("..")
      ) {
        return false;
      }

      if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) {
        return false;
      }

      const labels = domain.split(".");
      if (labels.length < 2) {
        return false;
      }

      for (const label of labels) {
        if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)) {
          return false;
        }
      }

      return /^[a-z]{2,63}$/.test(labels[labels.length - 1]);
    };

    const isValidSubject = (value) => {
      if (value.length < LIMITS.subject.min || value.length > LIMITS.subject.max) {
        return false;
      }
      return /^[\p{L}\p{N}\p{P}\p{S} ]+$/u.test(value);
    };

    const isValidMessage = (value) =>
      value.length >= LIMITS.message.min && value.length <= LIMITS.message.max;

    const validators = Object.freeze({
      name: isValidName,
      email: isValidEmail,
      subject: isValidSubject,
      message: isValidMessage,
    });

    const getSecureValues = () => ({
      name: sanitizeSingleLine(fieldByKey.name.input?.value, LIMITS.name.max),
      email: sanitizeSingleLine(fieldByKey.email.input?.value, LIMITS.email.max).toLowerCase(),
      subject: sanitizeSingleLine(fieldByKey.subject.input?.value, LIMITS.subject.max),
      message: sanitizeMultiline(fieldByKey.message.input?.value, LIMITS.message.max),
    });

    const setFieldValidity = (el, valid) => {
      if (!el) {
        return;
      }
      el.classList.toggle("is-invalid", !valid);
      el.setAttribute("aria-invalid", valid ? "false" : "true");
    };

    const updateCharCount = (field) => {
      const { input, count, key } = field;
      if (!input || !count) {
        return;
      }

      const max = LIMITS[key].max;
      const length = input.value.length;
      const remaining = max - length;
      const visual = count.querySelector(".field__count-visual");
      const sr = count.querySelector(".sr-only");

      if (visual) {
        visual.textContent = `${length} / ${max}`;
      }
      if (sr) {
        sr.textContent = remaining <= 20
          ? `${remaining} character${remaining === 1 ? "" : "s"} remaining`
          : `${length} of ${max} characters used`;
      }

      count.setAttribute("aria-live", remaining <= 20 ? "polite" : "off");
      count.classList.toggle("is-near-limit", remaining <= Math.ceil(max * 0.1) && remaining > 0);
      count.classList.toggle("is-at-limit", remaining <= 0);
    };

    const updateComposeBtn = () => {
      if (!composeBtn) {
        return;
      }
      const values = getSecureValues();
      composeBtn.disabled = !fields.every((field) => validators[field.key](values[field.key]));
    };

    const refreshFieldUi = (field) => {
      field.input?.classList.remove("is-invalid");
      field.input?.removeAttribute("aria-invalid");
      updateCharCount(field);
      updateComposeBtn();
    };

    fields.forEach((field) => {
      field.input?.addEventListener("input", () => refreshFieldUi(field));
      field.input?.addEventListener("change", () => refreshFieldUi(field));
      updateCharCount(field);
    });
    updateComposeBtn();

    CONTACT_FORM.addEventListener("submit", (e) => {
      e.preventDefault();

      const values = getSecureValues();

      fields.forEach((field) => {
        if (field.input) {
          field.input.value = values[field.key];
        }
      });
      fields.forEach(updateCharCount);

      const validity = Object.fromEntries(
        fields.map((field) => [field.key, validators[field.key](values[field.key])])
      );

      fields.forEach((field) => setFieldValidity(field.input, validity[field.key]));

      if (!fields.every((field) => validity[field.key])) {
        if (FORM_STATUS) {
          FORM_STATUS.textContent = "Please fill in all fields correctly.";
        }
        updateComposeBtn();
        fields.find((field) => !validity[field.key])?.input?.focus();
        return;
      }

      const subject = encodeURIComponent(values.subject);
      const body = encodeURIComponent(
        `${values.message}\n\nRegards,\n${values.name}.\nEmail: ${values.email}`
      );
      const mailto = `mailto:mhs_42@outlook.com?subject=${subject}&body=${body}`;

      if (mailto.length > MAX_MAILTO_URI_LENGTH) {
        if (FORM_STATUS) {
          FORM_STATUS.textContent = "Message is too long for your email client. Please shorten it.";
        }
        setFieldValidity(fieldByKey.message.input, false);
        fieldByKey.message.input?.focus();
        return;
      }

      if (FORM_STATUS) {
        FORM_STATUS.textContent = "Opening your email client...";
      }
      window.location.href = mailto;
      CONTACT_FORM.reset();
      fields.forEach((field) => {
        field.input?.classList.remove("is-invalid");
        field.input?.removeAttribute("aria-invalid");
        updateCharCount(field);
      });
      updateComposeBtn();

      window.setTimeout(() => {
        if (FORM_STATUS) {
          FORM_STATUS.textContent = "";
        }
      }, 500);
    });
  }
})();
