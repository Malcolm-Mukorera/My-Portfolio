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
});
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
});

document.querySelectorAll(".blog-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".blog-card");
    card.classList.toggle("expanded");
  });
});
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});
document.querySelectorAll(".skill").forEach((skill) => {
  observer.observe(skill);

  skill.addEventListener(
    "transitionend",
    () => {
      const level = skill.dataset.level;
      const bar = skill.querySelector(".bar span");
      bar.style.width = level + "%";
    },
    { once: true }
  );
});
