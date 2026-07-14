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

  /* -------- Year -------- */
  if (YEAR_EL) YEAR_EL.textContent = String(new Date().getFullYear());

  /* -------- Experience since graduation (June 2024) -------- */
  const formatExperience = (startIso) => {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return "professional experience";

    const now = new Date();
    let totalMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());

    if (now.getDate() < start.getDate()) totalMonths -= 1;
    totalMonths = Math.max(0, totalMonths);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0 && months === 0) return "Fresh graduate";
    if (years === 0) return `${months} mo experience`;
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

  /* -------- Mobile nav -------- */
  const MAIN = document.getElementById("main");
  const NAV_CLOSE = document.getElementById("nav-close");
  const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const getFocusable = (root) =>
    [...root.querySelectorAll(FOCUSABLE)].filter(
      (el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true"
    );

  const setMenuOpen = (open) => {
    if (!NAV_TOGGLE || !NAV_MENU) return;

    NAV_TOGGLE.setAttribute("aria-expanded", String(open));
    NAV_TOGGLE.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    NAV_MENU.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);

    const mobile = window.matchMedia("(max-width: 1024px)").matches;
    if (mobile) {
      NAV_MENU.setAttribute("aria-hidden", String(!open));
      if (MAIN) MAIN.toggleAttribute("inert", open);
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
    if (!document.body.classList.contains("nav-open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setMenuOpen(false);
      return;
    }

    if (e.key !== "Tab" || !NAV_MENU) return;

    const focusables = getFocusable(NAV_MENU);
    const toggleVisible = NAV_TOGGLE && window.getComputedStyle(NAV_TOGGLE).display !== "none";
    const cycle = toggleVisible ? [NAV_TOGGLE, ...focusables] : focusables;
    if (!cycle.length) return;

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

  /* Portal mobile menu to <body> so fixed overlay isn't clipped by header */
  const NAV_PARENT = NAV_MENU?.parentElement;
  const placeNavMenu = () => {
    if (!NAV_MENU || !NAV_PARENT) return;
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

  /* -------- Sticky header shadow + back-to-top -------- */
  const onScrollChrome = () => {
    const y = window.scrollY;
    HEADER?.classList.toggle("is-scrolled", y > 12);
    BACK_TO_TOP?.classList.toggle("is-visible", y > BACK_TO_TOP_THRESHOLD);
  };
  onScrollChrome();
  window.addEventListener("scroll", onScrollChrome, { passive: true });

  /* -------- Active nav highlight -------- */
  const setActiveLink = () => {
    const offset = HEADER ? HEADER.offsetHeight + 24 : 96;
    let current = SECTIONS[0]?.id;

    for (const section of SECTIONS) {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) current = section.id;
    }

    NAV_LINKS.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("is-active", href === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* -------- Smooth scroll -------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      e.preventDefault();
      setMenuOpen(false);

      const behavior = prefersReducedMotion ? "auto" : "smooth";

      /* Sticky header as #top only nudges scroll - always go to document top */
      if (id === "#top") {
        window.scrollTo({ top: 0, left: 0, behavior });
        history.pushState(null, "", "#top");
        return;
      }

      const target = document.querySelector(id);
      if (!target) return;

      const headerOffset = HEADER ? HEADER.offsetHeight + 8 : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior });
      history.pushState(null, "", id);
    });
  });

  /* -------- Reveal + skill meters on scroll -------- */
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

  /* -------- Subtle parallax on ambient orbs -------- */
  if (!prefersReducedMotion) {
    const orbs = document.querySelectorAll(".ambient__orb");
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
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

  /* -------- Typing effect -------- */
  const typeRoles = async () => {
    if (!TYPED_EL) return;

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

  /* -------- Credentials tabs -------- */
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
        if (e.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        next.focus();
        activate(next);
      });
    });
  });

  /* -------- Course category filters -------- */
  const courseFilters = document.querySelector(".course-filters");
  const coursePills = [...document.querySelectorAll(".course-pill")];

  courseFilters?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    const filter = btn.getAttribute("data-filter");
    courseFilters.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip === btn);
    });

    coursePills.forEach((pill) => {
      const show = filter === "all" || pill.getAttribute("data-cat") === filter;
      pill.classList.toggle("is-hidden", !show);
    });
  });

  /* -------- Contact form → mailto -------- */
  CONTACT_FORM?.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = CONTACT_FORM.querySelector("#name");
    const emailInput = CONTACT_FORM.querySelector("#email");
    const messageInput = CONTACT_FORM.querySelector("#message");

    const name = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const message = messageInput?.value.trim() || "";

    [nameInput, emailInput, messageInput].forEach((el) => el?.classList.remove("is-invalid"));

    let valid = true;
    if (!name) {
      nameInput?.classList.add("is-invalid");
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput?.classList.add("is-invalid");
      valid = false;
    }
    if (!message) {
      messageInput?.classList.add("is-invalid");
      valid = false;
    }

    if (!valid) {
      if (FORM_STATUS) FORM_STATUS.textContent = "Please fill in all fields correctly.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n- ${name}\n${email}`);
    const mailto = `mailto:mhs_42@outlook.com?subject=${subject}&body=${body}`;

    if (FORM_STATUS) FORM_STATUS.textContent = "Opening your email client…";
    window.location.href = mailto;
    CONTACT_FORM.reset();

    /* mailto has no success callback - clear the interim status shortly after launch */
    window.setTimeout(() => {
      if (FORM_STATUS) {
        FORM_STATUS.textContent = "";
      }
    }, 500);
  });
})();
