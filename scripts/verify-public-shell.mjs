import { access, readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const buildRoot = fileURLToPath(new URL("../dist", import.meta.url));
const expectedPages = [
  "index.html",
  "watch/index.html",
  "about/index.html",
  "support/index.html",
  "for-partners/index.html",
  "privacy/index.html",
  "404.html",
];

const requiredNavigation = [
  'href="/"',
  'href="/watch/"',
  'href="/about/"',
  'href="/support/"',
  'href="/for-partners/"',
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path)));
    if (entry.isFile()) files.push(path);
  }

  return files;
}

function routeToFile(href) {
  const path = href.split("#")[0].split("?")[0];
  if (!path || path === "/") return "index.html";
  if (path.endsWith("/")) return `${path.slice(1)}index.html`;
  return path.slice(1);
}

function capture(content, pattern, label, file) {
  const value = content.match(pattern)?.[1];
  if (!value) throw new Error(`${file}: missing ${label}`);
  return value;
}

const titles = new Set();
const descriptions = new Set();

for (const page of expectedPages) await access(join(buildRoot, page));

const allFiles = await filesUnder(buildRoot);
const htmlPages = allFiles
  .filter((path) => extname(path) === ".html")
  .map((path) => relative(buildRoot, path));

for (const page of htmlPages) {
  const path = join(buildRoot, page);
  await access(path);
  const content = await readFile(path, "utf8");

  if ((await stat(path)).size > 40_000) throw new Error(`${page}: HTML budget exceeded`);
  if (!content.includes('href="#main-content"')) throw new Error(`${page}: skip link missing`);
  if (!content.includes('id="main-content"')) throw new Error(`${page}: main target missing`);
  if (!content.includes('name="robots" content="noindex, nofollow"')) {
    throw new Error(`${page}: preview noindex directive missing`);
  }
  for (const metadata of [
    'property="og:title"',
    'property="og:description"',
    'property="og:url"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
  ]) {
    if (!content.includes(metadata)) throw new Error(`${page}: social metadata incomplete`);
  }
  if (!content.includes("Draft notice—final wording requires approval.")) {
    throw new Error(`${page}: draft legal notice missing`);
  }
  if (content.includes('href="#"')) throw new Error(`${page}: placeholder link detected`);
  if (content.includes("partners.correlius.org")) {
    throw new Error(`${page}: protected hostname leaked into public shell`);
  }

  for (const link of requiredNavigation) {
    if (!content.includes(link)) throw new Error(`${page}: primary navigation is incomplete`);
  }

  const title = capture(content, /<title>([^<]+)<\/title>/u, "title", page);
  const description = capture(
    content,
    /<meta name="description" content="([^"]+)"/u,
    "description",
    page,
  );

  if (titles.has(title)) throw new Error(`${page}: duplicate title`);
  if (descriptions.has(description)) throw new Error(`${page}: duplicate description`);
  titles.add(title);
  descriptions.add(description);

  for (const href of [...content.matchAll(/\shref="([^"]+)"/gu)].map((match) => match[1])) {
    if (/^(?:https?:|mailto:|tel:)/u.test(href)) continue;
    if (href.startsWith("#")) continue;
    await access(join(buildRoot, routeToFile(href)));
  }

  for (const source of [...content.matchAll(/\ssrc="(\/[^"]+)"/gu)].map((match) => match[1])) {
    await access(join(buildRoot, source.slice(1)));
  }

  const socialImage = content.match(
    /<meta property="og:image" content="https:\/\/correlius\.org(\/[^"]+)"/u,
  )?.[1];
  if (socialImage) {
    await access(join(buildRoot, socialImage.slice(1)));
    if (!content.includes(`name="twitter:image" content="https://correlius.org${socialImage}"`)) {
      throw new Error(`${page}: Open Graph and X social images differ`);
    }
  }
}

const scriptBytes = (
  await Promise.all(
    allFiles.filter((path) => extname(path) === ".js").map(async (path) => (await stat(path)).size),
  )
).reduce((total, size) => total + size, 0);
const styleBytes = (
  await Promise.all(
    allFiles.filter((path) => extname(path) === ".css").map(async (path) => (await stat(path)).size),
  )
).reduce((total, size) => total + size, 0);

if (scriptBytes > 10_000) throw new Error(`JavaScript budget exceeded: ${scriptBytes} bytes`);
if (styleBytes > 30_000) throw new Error(`CSS budget exceeded: ${styleBytes} bytes`);

for (const requiredFile of ["_headers", "robots.txt", "scripts/navigation.js"]) {
  await access(join(buildRoot, requiredFile));
}

console.log(
  `Public shell verification passed (${expectedPages.length} pages, ${scriptBytes} JS bytes, ${styleBytes} CSS bytes).`,
);
