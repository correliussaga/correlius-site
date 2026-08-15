import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const buildRoot = fileURLToPath(new URL("../dist", import.meta.url));

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

function openingTags(content, tagName) {
  return content.match(new RegExp(`<${tagName}\\b[^>]*>`, "giu")) ?? [];
}

for (const path of (await filesUnder(buildRoot)).filter((file) => extname(file) === ".html")) {
  const page = relative(buildRoot, path);
  const content = await readFile(path, "utf8");

  if (!/<html\s+lang="en"/u.test(content)) throw new Error(`${page}: page language missing`);
  if ((content.match(/<h1\b/gu) ?? []).length !== 1) {
    throw new Error(`${page}: expected exactly one h1`);
  }
  if (/tabindex="[1-9]/u.test(content)) throw new Error(`${page}: positive tabindex detected`);
  if (/<(?:audio|video)\b[^>]*\bautoplay\b/iu.test(content)) {
    throw new Error(`${page}: autoplay media detected`);
  }

  const headingLevels = [...content.matchAll(/<h([1-6])\b/gu)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      throw new Error(`${page}: heading level skipped`);
    }
  }

  for (const image of openingTags(content, "img")) {
    if (!/\balt="[^"]*"/u.test(image)) throw new Error(`${page}: image alt missing`);
    if (!/\bwidth="\d+"/u.test(image) || !/\bheight="\d+"/u.test(image)) {
      throw new Error(`${page}: image dimensions missing`);
    }
  }

  for (const frame of openingTags(content, "iframe")) {
    if (!/\btitle="[^"]+"/u.test(frame)) throw new Error(`${page}: iframe title missing`);
  }

  for (const button of openingTags(content, "button")) {
    if (!/\btype="(?:button|submit)"/u.test(button)) {
      throw new Error(`${page}: button type missing`);
    }
  }

  for (const control of [
    ...openingTags(content, "input"),
    ...openingTags(content, "select"),
    ...openingTags(content, "textarea"),
  ]) {
    if (/\btype="hidden"/u.test(control)) continue;
    const id = control.match(/\bid="([^"]+)"/u)?.[1];
    if (!id || !content.includes(`<label for="${id}">`)) {
      throw new Error(`${page}: form control label missing`);
    }
  }

  if (/(?:>\s*click here\s*<|aria-label="click here")/iu.test(content)) {
    throw new Error(`${page}: ambiguous link text detected`);
  }
}

console.log("Static accessibility structure verification passed.");
