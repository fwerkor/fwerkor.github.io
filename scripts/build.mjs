import fs from 'node:fs/promises';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

const root = process.cwd();
const sourceDir = path.join(root, 'source-profile');
const distDir = path.join(root, 'dist');
const readmePath = path.join(sourceDir, 'README.md');

function rewriteMarkdown(markdown) {
  return markdown
    .replace(/\.\/assets\//g, 'assets/')
    .replace(/\.\/github-metrics\.svg/g, 'github-metrics.svg');
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

async function copyIfExists(src, dest) {
  try {
    await fs.cp(src, dest, { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const raw = await fs.readFile(readmePath, 'utf8');
const markdown = rewriteMarkdown(raw);
const content = md.render(markdown);

await fs.rm(distDir, { recursive: true, force: true });
await fs.mkdir(distDir, { recursive: true });
await copyIfExists(path.join(sourceDir, 'assets'), path.join(distDir, 'assets'));
await copyIfExists(path.join(sourceDir, 'github-metrics.svg'), path.join(distDir, 'github-metrics.svg'));
await fs.writeFile(path.join(distDir, '.nojekyll'), '');
await fs.writeFile(path.join(distDir, 'index.html'), `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="description" content="FWERKOR GitHub profile homepage, automatically synced from fwerkor/fwerkor." />
  <meta property="og:title" content="FWERKOR GitHub Profile" />
  <meta property="og:description" content="GitHub profile homepage synced from fwerkor/fwerkor." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://fwerkor.github.io/" />
  <title>FWERKOR GitHub Profile</title>
  <style>
    :root {
      --bg: #f6f8fb;
      --surface: rgba(255,255,255,.86);
      --surface-strong: rgba(255,255,255,.96);
      --text: #101827;
      --muted: #5c677a;
      --line: rgba(15,23,42,.12);
      --accent: #0f766e;
      --accent-2: #2563eb;
      --shadow: 0 24px 80px rgba(15,23,42,.12);
      --radius: 28px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #07111e;
        --surface: rgba(12,23,35,.82);
        --surface-strong: rgba(13,27,42,.94);
        --text: #eef6ff;
        --muted: #a8b3c7;
        --line: rgba(226,232,240,.14);
        --accent: #34d399;
        --accent-2: #7dd3fc;
        --shadow: 0 24px 90px rgba(0,0,0,.34);
      }
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-height: 100vh;
      color: var(--text);
      font: 16px/1.68 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 0 0, rgba(125,211,252,.22), transparent 29rem),
        radial-gradient(circle at 100% 0, rgba(52,211,153,.19), transparent 28rem),
        linear-gradient(180deg, var(--bg), color-mix(in srgb, var(--bg), #000 4%));
    }
    a { color: inherit; text-decoration: none; }
    a:hover { color: var(--accent); }
    code {
      padding: .16em .38em;
      border: 1px solid var(--line);
      border-radius: .45em;
      background: color-mix(in srgb, var(--surface-strong), transparent 8%);
      font-size: .92em;
    }
    .page {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 56px;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      font-size: .95rem;
      font-weight: 700;
      letter-spacing: .02em;
    }
    .brand-mark {
      width: 13px;
      height: 13px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--accent-2), var(--accent));
      box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent), transparent 84%);
    }
    .nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 10px 14px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--surface);
      backdrop-filter: blur(16px);
      color: var(--text);
      font-size: .91rem;
      font-weight: 700;
      line-height: 1;
      box-shadow: 0 8px 24px rgba(15,23,42,.05);
    }
    .shell {
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: var(--surface-strong);
      box-shadow: var(--shadow);
    }
    .hero-note {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      padding: 18px clamp(18px, 4vw, 34px);
      border-bottom: 1px solid var(--line);
      color: var(--muted);
      font-size: .94rem;
    }
    .hero-note strong { color: var(--text); }
    .content {
      padding: clamp(20px, 4vw, 42px);
    }
    .content > :first-child { margin-top: 0; }
    .content > :last-child { margin-bottom: 0; }
    .content p[align="center"] {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 18px auto;
      text-align: center;
    }
    .content p[align="center"] img {
      margin: 2px;
    }
    .content p[align="center"] strong {
      font-size: clamp(1.15rem, 2.5vw, 1.55rem);
    }
    .content h1, .content h2, .content h3 {
      line-height: 1.16;
      letter-spacing: -.025em;
    }
    .content h1 { font-size: clamp(2.2rem, 6vw, 4.8rem); }
    .content h2 { margin-top: 2.2rem; font-size: clamp(1.35rem, 3vw, 2rem); }
    .content h3 {
      margin: 2rem 0 .9rem;
      color: var(--muted);
      font-size: 1rem;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .content ul { padding-left: 1.2rem; }
    .content li { margin: .45rem 0; }
    .content a { font-weight: 680; }
    .content blockquote {
      margin: 1.5rem 0;
      padding: .1rem 0 .1rem 1.1rem;
      border-left: 3px solid var(--accent);
      color: var(--muted);
    }
    .content img {
      max-width: 100%;
      height: auto;
      border-radius: 18px;
    }
    .content img[src*="#gh-dark-mode-only"] { display: none; }
    .content img[src*="#gh-light-mode-only"] { display: inline-block; }
    @media (prefers-color-scheme: dark) {
      .content img[src*="#gh-dark-mode-only"] { display: inline-block; }
      .content img[src*="#gh-light-mode-only"] { display: none; }
    }
    .content > p:first-of-type img {
      width: 100%;
      border-radius: 24px;
      box-shadow: 0 18px 60px rgba(15,23,42,.12);
    }
    .content hr {
      height: 1px;
      border: 0;
      background: var(--line);
      margin: 2rem 0;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 18px;
      color: var(--muted);
      font-size: .92rem;
    }
    .footer a { color: var(--text); font-weight: 700; }
    @media (max-width: 720px) {
      .topbar { align-items: flex-start; flex-direction: column; }
      .nav { justify-content: flex-start; }
      .hero-note { flex-direction: column; }
    }
    @media (max-width: 520px) {
      .page { width: min(100% - 20px, 1120px); padding-top: 14px; }
      .pill { min-height: 38px; padding: 9px 12px; }
      .content { padding: 18px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="topbar">
      <a class="brand" href="https://github.com/fwerkor">
        <span class="brand-mark" aria-hidden="true"></span>
        <span>github.com/fwerkor</span>
      </a>
      <nav class="nav" aria-label="External links">
        <a class="pill" href="https://github.com/fwerkor">GitHub</a>
      </nav>
    </header>
    <section class="shell">
      <div class="hero-note">
        <span><strong>FWERKOR homepage</strong></span>
        <span>Automatically synced from <a href="https://github.com/fwerkor/fwerkor">fwerkor/fwerkor</a>.</span>
      </div>
      <article class="content">
${content}
      </article>
    </section>
    <footer class="footer">
      <span>Update the GitHub profile README to update this page.</span>
      <span><a href="https://github.com/fwerkor/fwerkor.github.io">Source</a></span>
    </footer>
  </main>
</body>
</html>
`);
