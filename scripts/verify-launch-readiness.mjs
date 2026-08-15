import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("..", import.meta.url));
const evidencePath = `${repositoryRoot}/docs/acceptance/launch-readiness.json`;
const evidence = JSON.parse(await readFile(evidencePath, "utf8"));
const expectedIds = Array.from({ length: 13 }, (_, index) => `success-${String(index + 1).padStart(2, "0")}`);

assert.equal(evidence.format, "correlius-launch-readiness-v1");
assert.match(evidence.asOf, /^\d{4}-\d{2}-\d{2}$/u);
assert.equal(typeof evidence.productionLaunchAuthorized, "boolean");
assert.deepEqual(evidence.criteria.map(({ id }) => id), expectedIds);

for (const criterion of evidence.criteria) {
  assert.ok(["blocked", "passed"].includes(criterion.status), `${criterion.id}: invalid status`);
  assert.ok(Array.isArray(criterion.evidence), `${criterion.id}: evidence must be a list`);
  if (criterion.status === "passed") {
    assert.ok(criterion.evidence.length > 0, `${criterion.id}: passed without evidence`);
    assert.equal(criterion.blocker, null, `${criterion.id}: passed with a blocker`);
  } else {
    assert.equal(typeof criterion.blocker, "string", `${criterion.id}: blocker missing`);
    assert.ok(criterion.blocker.length > 0, `${criterion.id}: blocker empty`);
  }
}

const siteConfiguration = await readFile(`${repositoryRoot}/src/config/site.ts`, "utf8");
const releaseConfigurationIsClosed = [
  /finalLegalCopyApproved:\s*false/u,
  /publicDiscoveryEnabled:\s*false/u,
  /partnerRequestEnabled:\s*false/u,
].every((pattern) => pattern.test(siteConfiguration));

const blocked = evidence.criteria.filter(({ status }) => status !== "passed");
if (evidence.productionLaunchAuthorized && blocked.length > 0) {
  throw new Error("Production launch is authorized while acceptance criteria remain blocked.");
}
if (evidence.productionLaunchAuthorized && releaseConfigurationIsClosed) {
  throw new Error("Production launch is authorized while release configuration remains closed.");
}

if (process.argv.includes("--require-ready")) {
  if (!evidence.productionLaunchAuthorized || blocked.length > 0) {
    throw new Error(
      `Production launch is not ready: ${blocked.length} criteria blocked and owner authorization is ${
        evidence.productionLaunchAuthorized ? "present" : "absent"
      }.`,
    );
  }
  console.log("Production launch readiness verified.");
} else {
  console.log(
    `Launch ledger verified: ${13 - blocked.length}/13 criteria passed; production authorization is ${
      evidence.productionLaunchAuthorized ? "present" : "absent"
    }.`,
  );
}
