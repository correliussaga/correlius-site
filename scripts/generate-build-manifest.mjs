import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const buildRoot = fileURLToPath(new URL("../dist", import.meta.url));
const manifestName = "build-manifest.json";

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

const files = [];
for (const path of await filesUnder(buildRoot)) {
  const name = relative(buildRoot, path).split(sep).join("/");
  if (name === manifestName) continue;
  const content = await readFile(path);
  files.push({
    path: name,
    bytes: (await stat(path)).size,
    sha256: createHash("sha256").update(content).digest("hex"),
  });
}

files.sort((left, right) => left.path.localeCompare(right.path));
const manifest = {
  format: "correlius-public-build-manifest-v1",
  files,
};

await writeFile(join(buildRoot, manifestName), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Build manifest generated for ${files.length} files.`);
