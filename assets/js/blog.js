document.addEventListener("DOMContentLoaded", () => {
  // ===== Timeline grouping (run FIRST) =====
  const feed = document.getElementById("blog-feed");
  const posts = Array.from(document.querySelectorAll(".post"));
  const groups = {};

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
      const h = document.createElement("h3");
      h.textContent = month.replace("-", " · ");
      h.style.fontFamily = "var(--font-mono)";
      h.style.letterSpacing = "0.25em";
      h.style.color = "var(--color-text-light)";
      feed.appendChild(h);

      groups[month].forEach((p) => feed.appendChild(p));
    });

  // ===== Expand + load Markdown (bind AFTER grouping) =====
  document.querySelectorAll(".expand-post").forEach((button) => {
    button.addEventListener("click", async () => {
      const post = button.closest(".post");
      const container = post.querySelector(".post-full");
      const mdFile = post.dataset.md;

      const willOpen = !post.classList.contains("expanded");
      post.classList.toggle("expanded");
      button.textContent = willOpen ? "Close entry" : "Read entry";

      if (willOpen && !container.dataset.loaded) {
        try {
          const res = await fetch(mdFile);
          if (!res.ok) throw new Error(`HTTP ${res.status} (${mdFile})`);
          const text = await res.text();
          container.innerHTML = marked.parse(text);
          container.dataset.loaded = "true";
        } catch (err) {
          container.innerHTML = `<p style="color:#b91c1c;">Failed to load post: ${err.message}</p>`;
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

      document.querySelectorAll(".post").forEach((post) => {
        const match =
          filter === "all" ||
          post.dataset.stack === filter ||
          post.dataset.location === filter;

        post.style.display = match ? "block" : "none";
      });
    });
  });

  // ===== Scroll reveal (target posts, not .reveal) =====
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

  document.querySelectorAll(".post").forEach((el) => observer.observe(el));
});
