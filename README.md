# Prabir Datta's personal website

This repository contains the files for my personal website:

**https://prabirdatta.com**

The site is built with plain HTML and CSS and is hosted free of charge using
GitHub Pages.

## Website files

- `index.html` contains the words and sections shown on the website.
- `blog.html` automatically lists and displays the Markdown files in `blogs/`.
- `blog.js` loads those posts and turns their Markdown into web pages.
- `blogs/` contains one Markdown (`.md`) file for each blog post.
- `styles.css` controls the colours, layout, and appearance.
- `notes.txt` is for private working notes and is not used by the website.

## Publish a blog post from GitHub

No HTML editing is needed.

1. Open the [`blogs` folder](https://github.com/prabirdattaus/prabirdattaus.github.io/tree/main/blogs) on GitHub.
2. Select **Add file**, then **Upload files**.
3. Upload your Markdown file and commit it to the `main` branch.
4. After GitHub Pages updates, the new post will appear automatically on the blog page.

Use a filename such as `2026-09-04-my-new-post.md`. The date at the start is
shown on the website and keeps the newest posts at the top. Begin the file with
one `#` heading for its title:

```markdown
# My New Post

This is the opening paragraph. It is also used as the summary on the blog page.

## A section heading

Continue writing here. You can use **bold text**, *italics*, links, lists,
quotes, images, and tables using normal Markdown.
```

The post may also include optional details at the very top when a custom date
or summary is useful:

```markdown
---
date: 2026-09-04
summary: A custom short description for the blog page.
---

# My New Post
```

## Blog comments

Comments use [Utterances](https://utteranc.es/), a free service that stores
each conversation in this repository's GitHub Issues. To activate comments,
install the [Utterances GitHub App](https://github.com/apps/utterances) and
grant it access to the `prabirdattaus.github.io` repository. Visitors will then
be able to sign in with a GitHub account and comment below the blog post.

Each Markdown post gets its own web address, so its comments remain separate
from the other posts.

## Preview the website locally

Open a terminal in this folder and run:

```powershell
bun run dev
```

Then visit <http://localhost:3000> in a web browser. Refresh the browser after
making a change. Press `Ctrl+C` in the terminal when you want to stop the local
website.
