import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const forbiddenPublicPaths = [
  "partner-site",
  "protected-downloads",
  "src/content/findings",
  "src/content/resources",
  "src/pages/audience-evidence",
  "src/pages/donor-brief",
  "src/pages/feature-correlius",
  "src/pages/media-kit",
];

for (const relativePath of forbiddenPublicPaths) {
  try {
    await access(`${repositoryRoot}/${relativePath}`);
    throw new Error(`Protected partner path entered the public repository: ${relativePath}`);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

const requestSources = await Promise.all(
  ["functions/api/partner-access.js", "src/server/partner-request.mjs"].map((relativePath) =>
    readFile(`${repositoryRoot}/${relativePath}`, "utf8"),
  ),
);
const requestSource = requestSources.join("\n");

for (const [label, pattern] of [
  ["Cloudflare Access API endpoint", /api\.cloudflare\.com[^\n]*access/iu],
  ["Access administration token binding", /\bACCESS_(?:API_)?TOKEN\b/u],
  ["Access policy mutation", /\/access\/(?:apps|organizations|policies)/iu],
]) {
  assert.doesNotMatch(requestSource, pattern, `${label} must not enter the request worker`);
}

const siteConfiguration = await readFile(`${repositoryRoot}/src/config/site.ts`, "utf8");
assert.match(siteConfiguration, /partnerRequestEnabled:\s*false/u);
assert.match(siteConfiguration, /turnstileSiteKey:\s*null/u);

console.log("Public/private partner boundary verification passed.");
