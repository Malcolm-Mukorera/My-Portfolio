document.addEventListener("DOMContentLoaded", () => {
  // ===== Timeline grouping (run FIRST) =====
  const feed = document.getElementById("blog-feed");
  const posts = Array.from(document.querySelectorAll(".post"));
  const groups = {};

  if (!feed || !posts.length) return;

  posts.forEach((post) => {
    const month = post.dataset.month || "Unknown";
    groups[month] = groups[month] || [];
    groups[month].push(post);
  });

  feed.innerHTML = "";

  Object.keys(groups)
    .sort()
    .reverse()
    .forEach((month) => {
      const group = document.createElement("section");
      group.className = "blog-month";
      group.dataset.month = month;

      const h = document.createElement("h3");
      h.textContent = month.replace("-", " · ");
      h.className = "blog-month__title";
      group.appendChild(h);

      groups[month].forEach((p) => group.appendChild(p));
      feed.appendChild(group);
    });

  // ===== Expand + load Markdown (bind AFTER grouping) =====
  document.querySelectorAll(".expand-post").forEach((button) => {
    button.addEventListener("click", async () => {
      const post = button.closest(".post");
      const container = post?.querySelector(".post-full");
      const mdFile = post?.dataset.md;

      if (!post || !container || !mdFile) return;

      const willOpen = !post.classList.contains("expanded");
      post.classList.toggle("expanded");
      button.setAttribute("aria-expanded", String(willOpen));
      button.textContent = willOpen ? "Close entry" : "Read entry";

      if (willOpen && !container.dataset.loaded) {
        try {
          const res = await fetch(mdFile);
          if (!res.ok) throw new Error(`HTTP ${res.status} (${mdFile})`);
          const text = await res.text();

          if (window.marked) {
            container.innerHTML = marked.parse(text);
          } else {
            container.textContent = text;
          }

          container.dataset.loaded = "true";
        } catch (err) {
          const message = document.createElement("p");
          message.className = "post-error";
          message.textContent = `Failed to load post: ${err.message}`;
          container.replaceChildren(message);
        }
      }
    });
  });

  // ===== Filters =====
  document.querySelectorAll(".blog-filters button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".blog-filters button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      document.querySelectorAll(".blog-month").forEach((group) => {
        let visiblePosts = 0;

        group.querySelectorAll(".post").forEach((post) => {
          const match =
            filter === "all" ||
            post.dataset.stack === filter ||
            post.dataset.location === filter;

          post.hidden = !match;
          if (match) visiblePosts += 1;
        });

        group.hidden = visiblePosts === 0;
      });
    });
  });

  // ===== Scroll reveal (target posts, not .reveal) =====
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".post").forEach((el) => {
      el.classList.add("reveal", "show");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document.querySelectorAll(".post").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
});
