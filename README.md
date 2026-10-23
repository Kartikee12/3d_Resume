# 3D Resume Website

Interactive resume built with plain HTML/CSS/JS and Three.js. No build step.

## Files

| File | What it does |
|------|--------------|
| `data.js` | **The only file you need to edit.** Your name, skills, projects, education, links. |
| `index.html`, `style.css`, `script.js`, `render.js`, `print.css` | The website itself. Leave as is. |

The **Download PDF** button opens your browser's print dialog. Choose "Save as PDF" to get a clean one-page resume (no extra file needed).

## Run locally

Open a terminal in this folder and run:

```
python -m http.server 8000
```

Then open http://localhost:8000 (double-clicking index.html will not work).

## Host on GitHub Pages

1. Create a repo named `yourusername.github.io`.
2. Upload all files in this folder.
3. Settings → Pages → Source: "Deploy from a branch" → `main` → `/ (root)` → Save.
4. Live in 1–2 minutes at `https://yourusername.github.io`.
