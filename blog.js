import { marked } from "https://cdn.jsdelivr.net/npm/marked@15.0.12/lib/marked.esm.js";

const repository = "prabirdattaus/prabirdattaus.github.io";
const branch = "main";
const blogFolder = "blogs";

const intro = document.querySelector("#blog-intro");
const list = document.querySelector("#blog-list");
const listItems = document.querySelector("#blog-list-items");
const status = document.querySelector("#blog-status");
const post = document.querySelector("#blog-post");
const postTitle = document.querySelector("#post-title");
const postDate = document.querySelector("#post-date");
const postBody = document.querySelector("#post-body");

marked.use({
  gfm: true,
  breaks: false,
});

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function plainText(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function readFrontMatter(markdown) {
  const match = markdown.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
  const metadata = {};

  if (!match) {
    return { metadata, content: markdown };
  }

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
    metadata[key] = value;
  }

  return { metadata, content: markdown.slice(match[0].length) };
}

function readPost(markdown, filename) {
  const normalized = markdown.replace(/^\uFEFF/, "");
  const { metadata, content } = readFrontMatter(normalized);
  const heading = content.match(/^#\s+(.+)$/m);
  const title = metadata.title || (heading && plainText(heading[1])) || titleFromFilename(filename);
  const dateInFilename = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = metadata.date || (dateInFilename && dateInFilename[1]) || "";
  const withoutTitle = heading
    ? content.replace(new RegExp(`^#\\s+${escapePattern(heading[1])}\\s*$`, "m"), "")
    : content;
  const paragraphs = withoutTitle
    .split(/\r?\n\s*\r?\n/)
    .map(plainText)
    .filter((paragraph) => paragraph && !paragraph.startsWith("---") && !paragraph.startsWith("|"));
  const summary = metadata.summary || paragraphs[0] || "Read this post.";

  return {
    title,
    date,
    summary: summary.length > 190 ? `${summary.slice(0, 187).trimEnd()}\u2026` : summary,
    content: withoutTitle.trim(),
  };
}

function formatDate(date) {
  if (!date) return "Blog post";

  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return date;

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

async function getMarkdownFiles() {
  const endpoint = `https://api.github.com/repos/${repository}/contents/${blogFolder}?ref=${branch}`;
  const response = await fetch(endpoint, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status}`);
  }

  const entries = await response.json();
  return entries
    .filter((entry) => entry.type === "file" && entry.name.toLowerCase().endsWith(".md"))
    .sort((a, b) => b.name.localeCompare(a.name));
}

async function loadMarkdown(file) {
  const response = await fetch(file.download_url);
  if (!response.ok) throw new Error(`Could not load ${file.name}`);
  return response.text();
}

function makePostLink(filename) {
  const url = new URL("blog.html", window.location.href);
  url.searchParams.set("post", filename);
  return `${url.pathname}${url.search}`;
}

function showMessage(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("blog-error", isError);
  status.hidden = false;
}

function resolvePostUrls() {
  for (const element of postBody.querySelectorAll("a[href], img[src]")) {
    const attribute = element.matches("a") ? "href" : "src";
    const value = element.getAttribute(attribute);

    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(value)) continue;

    element.setAttribute(attribute, new URL(`${blogFolder}/${value}`, window.location.href).href);
  }
}

async function showPost(file) {
  const markdown = await loadMarkdown(file);
  const details = readPost(markdown, file.name);

  intro.hidden = true;
  list.hidden = true;
  post.hidden = false;
  postTitle.textContent = details.title;
  postDate.textContent = formatDate(details.date);
  postBody.innerHTML = marked.parse(details.content);
  resolvePostUrls();
  document.title = `${details.title} | Prabir Datta`;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = details.summary;

  const comments = document.createElement("script");
  comments.src = "https://utteranc.es/client.js";
  comments.setAttribute("repo", repository);
  comments.setAttribute("issue-term", "url");
  comments.setAttribute("theme", "github-light");
  comments.setAttribute("crossorigin", "anonymous");
  comments.async = true;
  document.querySelector("#comments").append(comments);
}

async function showIndex(files) {
  if (!files.length) {
    showMessage("No posts have been published yet.");
    return;
  }

  const results = await Promise.allSettled(
    files.map(async (file) => ({
      file,
      details: readPost(await loadMarkdown(file), file.name),
    })),
  );
  const loadedPosts = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  status.hidden = true;

  for (const { file, details } of loadedPosts) {
    const article = document.createElement("article");
    article.className = "blog-card";

    const link = document.createElement("a");
    link.href = makePostLink(file.name);

    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = formatDate(details.date);

    const heading = document.createElement("h2");
    heading.textContent = details.title;

    const summary = document.createElement("p");
    summary.className = "blog-summary";
    summary.textContent = details.summary;

    const readMore = document.createElement("span");
    readMore.className = "blog-read-more";
    readMore.textContent = "Read post \u2192";

    link.append(eyebrow, heading, summary, readMore);
    article.append(link);
    listItems.append(article);
  }

  if (!loadedPosts.length) {
    showMessage("The posts could not be loaded. Please refresh and try again.", true);
  }
}

async function startBlog() {
  try {
    const files = await getMarkdownFiles();
    const requestedPost = new URLSearchParams(window.location.search).get("post");

    if (requestedPost) {
      const file = files.find((entry) => entry.name === requestedPost);
      if (!file) {
        showMessage("That post could not be found.", true);
        return;
      }
      await showPost(file);
      return;
    }

    await showIndex(files);
  } catch (error) {
    console.error(error);
    showMessage("The blog could not be loaded. Please refresh and try again.", true);
  }
}

startBlog();
