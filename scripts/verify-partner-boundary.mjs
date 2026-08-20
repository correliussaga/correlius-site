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

const closedEndpoint = await readFile(
  `${repositoryRoot}/functions/api/partner-access.js`,
  "utf8",
);

for (const [label, pattern] of [
  ["Cloudflare Access API endpoint", /api\.cloudflare\.com[^\n]*access/iu],
  ["Access administration token binding", /\bACCESS_(?:API_)?TOKEN\b/u],
  ["Access policy mutation", /\/access\/(?:apps|organizations|policies)/iu],
]) {
  assert.doesNotMatch(closedEndpoint, pattern, `${label} must not enter the closed endpoint`);
}

for (const pattern of [
  /Turnstile/iu,
  /REQUEST_(?:MARKERS|RATE_LIMITER|RECIPIENT|SENDER)/u,
  /EMAIL\.send/u,
  /partner-request-contract/u,
]) {
  assert.doesNotMatch(closedEndpoint, pattern, "Closed endpoint retained application processing");
}
assert.match(closedEndpoint, /status:\s*410/u);

const siteConfiguration = await readFile(`${repositoryRoot}/src/config/site.ts`, "utf8");
assert.doesNotMatch(siteConfiguration, /partnerRequestEnabled|turnstileSiteKey/u);

const publicPartnerPage = await readFile(
  `${repositoryRoot}/src/pages/for-partners/index.astro`,
  "utf8",
);
assert.match(publicPartnerPage, /https:\/\/partners\.correlius\.org\//u);
assert.match(publicPartnerPage, /does not accept partner applications online/iu);
assert.doesNotMatch(publicPartnerPage, /<form\b|PartnerRequestForm|Turnstile/iu);

console.log("Public/private partner boundary verification passed.");
