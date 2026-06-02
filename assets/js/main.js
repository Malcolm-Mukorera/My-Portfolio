document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     MOBILE NAV TOGGLE
  ================================ */

  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav__link");

  const closeMenu = () => {
    navMenu?.classList.remove("show-menu");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMenu = () => {
    navMenu?.classList.add("show-menu");
    navToggle?.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  if (navMenu && navToggle) {
    navToggle.addEventListener("click", openMenu);
  }

  if (navMenu && navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  if (navMenu && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      navMenu?.classList.contains("show-menu") &&
      !navMenu.contains(event.target) &&
      !navToggle?.contains(event.target)
    ) {
      closeMenu();
    }
  });

  /* ===============================
     ACTIVE NAV LINK ON SCROLL
  ================================ */

  const sectionLinks = [...navLinks].filter((link) => {
    const href = link.getAttribute("href");
    return href && href.startsWith("#") && document.querySelector(href);
  });

  const setActiveLink = (id) => {
    sectionLinks.forEach((link) => {
      link.classList.toggle(
        "active-link",
        link.getAttribute("href") === `#${id}`
      );
    });
  };

  if (sectionLinks.length) {
    const sections = sectionLinks.map((link) =>
      document.querySelector(link.getAttribute("href"))
    );

    const updateActiveLink = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      let activeSectionId = sections[0].id;

      sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
          activeSectionId = section.id;
        }
      });

      setActiveLink(activeSectionId);
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
  }

  /* ===============================
     PROJECT FILTERING (LEFT / RIGHT)
  ================================ */

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projects = document.querySelectorAll(".project");

  if (filterButtons.length && projects.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        projects.forEach((project) => {
          const category = project.dataset.category;

          if (filter === "all" || category === filter) {
            project.classList.remove("hide");
          } else {
            project.classList.add("hide");
          }
        });
      });
    });
  }

  /* ===============================
     REVEAL ANIMATIONS
  ================================ */

  const revealTargets = document.querySelectorAll(
    ".section, .project, .soft-skill, .service, .edu-tile, .cred-item"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  document.querySelectorAll(".skill").forEach((skill) => {
    const bar = skill.querySelector(".bar span");

    if (bar) {
      bar.dataset.width = bar.dataset.width || "0%";
      bar.style.width = "0";
    }
  });

  if (!("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("show"));
    document.querySelectorAll(".skill .bar span").forEach((bar) => {
      bar.style.width = bar.dataset.width || "100%";
    });
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          if (entry.target.classList.contains("skill")) {
            const bar = entry.target.querySelector(".bar span");
            if (bar) bar.style.width = bar.dataset.width || "100%";
          }

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document.querySelectorAll(".reveal, .skill").forEach((el) => {
    revealObserver.observe(el);
  });
});
