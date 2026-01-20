// Expand + load Markdown
document.querySelectorAll(".expand-post").forEach((button) => {
  button.addEventListener("click", async () => {
    const post = button.closest(".post");
    const container = post.querySelector(".post-full");

    post.classList.toggle("expanded");

    if (!container.innerHTML) {
      const mdFile = post.dataset.md;
      const res = await fetch(mdFile);
      const text = await res.text();
      container.innerHTML = marked.parse(text);
    }
  });
});

// Filters
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

// Timeline grouping
const feed = document.getElementById("blog-feed");
const posts = Array.from(document.querySelectorAll(".post"));
const groups = {};

posts.forEach((post) => {
  const month = post.dataset.month;
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
