document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     MOBILE NAV TOGGLE
  ================================ */

  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav__link");

  if (navMenu && navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
      document.body.classList.add("nav-open");
    });
  }

  if (navMenu && navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.classList.remove("nav-open");
    });
  }

  if (navMenu && navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("show-menu");
        document.body.classList.remove("nav-open");
      });
    });
  }

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
     BLOG CARDS
  ================================ */

  document.querySelectorAll(".blog-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".blog-card");

      if (card) {
        card.classList.toggle("expanded");
      }
    });
  });

  /* ===============================
     REVEAL ANIMATIONS
  ================================ */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  document.querySelectorAll(".skill").forEach((skill) => {
    revealObserver.observe(skill);

    skill.addEventListener(
      "transitionend",
      () => {
        const level = skill.dataset.level;
        const bar = skill.querySelector(".bar span");

        if (level && bar) {
          bar.style.width = `${level}%`;
        }
      },
      { once: true }
    );
  });
});
