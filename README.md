# Prabir Datta's personal website

This repository contains the files for my personal website:

**https://prabirdatta.com**

The site is built with plain HTML and CSS and is hosted free of charge using
GitHub Pages.

## Website files

- `index.html` contains the words and sections shown on the website.
- `blog.html` contains the current blog post and its comments section.
- `styles.css` controls the colours, layout, and appearance.
- `notes.txt` is for private working notes and is not used by the website.

## Blog comments

Comments use [Utterances](https://utteranc.es/), a free service that stores
each conversation in this repository's GitHub Issues. To activate comments,
install the [Utterances GitHub App](https://github.com/apps/utterances) and
grant it access to the `prabirdattaus.github.io` repository. Visitors will then
be able to sign in with a GitHub account and comment below the blog post.

To publish another post, update or add a blog page and give it its own page
address so that its comments remain separate from earlier posts.

## Preview the website locally

Open a terminal in this folder and run:

```powershell
bun run dev
```

Then visit <http://localhost:3000> in a web browser. Refresh the browser after
making a change. Press `Ctrl+C` in the terminal when you want to stop the local
website.
