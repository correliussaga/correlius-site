import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const blockedExtensions = new Set([
  ".db",
  ".docx",
  ".key",
  ".p12",
  ".pem",
  ".pfx",
  ".sqlite",
]);

const inspectedExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".md",
  ".svg",
  ".txt",
  ".xml",
]);

const blockedContent = [
  /-----BEGIN (?:EC |OPENSSH |RSA )?PRIVATE KEY-----/u,
  /(?:CF|CLOUDFLARE)_API_TOKEN\s*=/u,
  /(?:AWS|GOOGLE|GITHUB|TURNSTILE)_(?:ACCESS_KEY|API_KEY|SECRET|TOKEN)\s*=/u,
  /PROLIFIC_ID\s*=/u,
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await filesUnder(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }

  return files;
}

export async function verifyBuild(directory) {
  await access(join(directory, "index.html"));
  await access(join(directory, "robots.txt"));

  const violations = [];
  for (const path of await filesUnder(directory)) {
    const extension = extname(path).toLowerCase();
    const name = relative(directory, path);

    if (
      blockedExtensions.has(extension) ||
      extension === ".map" ||
      basename(path).toLowerCase().startsWith(".env")
    ) {
      violations.push(`${name}: blocked output extension`);
      continue;
    }

    if (!inspectedExtensions.has(extension)) continue;

    const content = await readFile(path, "utf8");
    if (blockedContent.some((pattern) => pattern.test(content))) {
      violations.push(`${name}: sensitive marker detected`);
    }
  }

  if (violations.length > 0) {
    throw new Error(`Build boundary verification failed:\n${violations.join("\n")}`);
  }
}

async function selfTest() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "correlius-build-scan-"));

  try {
    await mkdir(join(fixtureRoot, "assets"));
    await writeFile(join(fixtureRoot, "index.html"), "<!doctype html><title>Fixture</title>");
    await writeFile(join(fixtureRoot, "robots.txt"), "User-agent: *\nDisallow: /\n");
    await writeFile(join(fixtureRoot, "assets", "fixture.js"), "CF_API_TOKEN=fixture");

    try {
      await verifyBuild(fixtureRoot);
    } catch {
      console.log("Build boundary scanner rejected the secret fixture as expected.");
      return;
    }

    throw new Error("Build boundary scanner accepted a secret fixture.");
  } finally {
    await rm(fixtureRoot, { recursive: true });
  }
}

if (process.argv.includes("--self-test")) {
  await selfTest();
} else {
  await verifyBuild(fileURLToPath(new URL("../dist", import.meta.url)));
  console.log("Build boundary verification passed.");
}
