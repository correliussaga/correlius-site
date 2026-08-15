import { createHash } from "node:crypto";
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

async function fileRecords(directory, manifestPath) {
  const records = [];
  for (const path of await filesUnder(directory)) {
    if (path === manifestPath) continue;
    const content = await readFile(path);
    records.push({
      path: relative(directory, path).split("\\").join("/"),
      bytes: content.byteLength,
      sha256: createHash("sha256").update(content).digest("hex"),
    });
  }
  records.sort((left, right) => left.path.localeCompare(right.path));
  return records;
}

export async function verifyBuild(directory) {
  await access(join(directory, "index.html"));
  await access(join(directory, "robots.txt"));
  await access(join(directory, "build-manifest.json"));

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

  const manifestPath = join(directory, "build-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.format !== "correlius-public-build-manifest-v1" || !Array.isArray(manifest.files)) {
    throw new Error("Build boundary verification failed: invalid build manifest");
  }

  const actualFiles = await fileRecords(directory, manifestPath);
  if (JSON.stringify(manifest.files) !== JSON.stringify(actualFiles)) {
    throw new Error("Build boundary verification failed: build manifest does not match output");
  }
}

async function selfTest() {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "correlius-build-scan-"));

  try {
    await mkdir(join(fixtureRoot, "assets"));
    await writeFile(join(fixtureRoot, "index.html"), "<!doctype html><title>Fixture</title>");
    await writeFile(join(fixtureRoot, "robots.txt"), "User-agent: *\nDisallow: /\n");
    await writeFile(
      join(fixtureRoot, "build-manifest.json"),
      '{"format":"correlius-public-build-manifest-v1","files":[]}',
    );
    await writeFile(join(fixtureRoot, "assets", "fixture.js"), "CF_API_TOKEN=fixture");

    let secretRejected = false;
    try {
      await verifyBuild(fixtureRoot);
    } catch {
      secretRejected = true;
    }
    if (!secretRejected) throw new Error("Build boundary scanner accepted a secret fixture.");
    console.log("Build boundary scanner rejected the secret fixture as expected.");

    await writeFile(join(fixtureRoot, "assets", "fixture.js"), "const fixtureIsSafe = true;");
    const fixtureManifestPath = join(fixtureRoot, "build-manifest.json");
    const fixtureFiles = await fileRecords(fixtureRoot, fixtureManifestPath);
    await writeFile(
      fixtureManifestPath,
      JSON.stringify({ format: "correlius-public-build-manifest-v1", files: fixtureFiles }),
    );
    await verifyBuild(fixtureRoot);

    await writeFile(
      fixtureManifestPath,
      '{"format":"correlius-public-build-manifest-v1","files":[]}',
    );
    let tamperRejected = false;
    try {
      await verifyBuild(fixtureRoot);
    } catch {
      tamperRejected = true;
    }
    if (!tamperRejected) throw new Error("Build boundary scanner accepted a stale manifest.");
    console.log("Build boundary scanner rejected the stale manifest as expected.");
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
