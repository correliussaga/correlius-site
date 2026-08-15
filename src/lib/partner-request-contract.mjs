export const collaborationTypes = Object.freeze([
  { value: "editorial", label: "Interview, article, podcast, or editorial feature" },
  { value: "screening", label: "Screening, convention, or moderated discussion" },
  { value: "community", label: "Community, forum, or educational conversation" },
  { value: "professional", label: "Professional collaboration" },
  { value: "support", label: "Prospective project support" },
]);

export const requestLimits = Object.freeze({
  bodyBytes: 16_384,
  name: 100,
  email: 254,
  affiliation: 160,
  message: 1_000,
  turnstileToken: 2_048,
});

const allowedFields = new Set([
  "name",
  "email",
  "affiliation",
  "collaborationType",
  "message",
  "privacyConsent",
  "cf-turnstile-response",
]);
const collaborationValues = new Set(collaborationTypes.map(({ value }) => value));
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const singleLineControls = /[\u0000-\u001f\u007f]/u;
const messageControls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;

function oneValue(parameters, name) {
  const values = parameters.getAll(name);
  return values.length === 1 ? values[0] : null;
}

function normalizeSingleLine(value) {
  return value?.normalize("NFC").trim().replace(/\s+/gu, " ") ?? "";
}

function normalizeMessage(value) {
  return value?.normalize("NFC").replace(/\r\n?/gu, "\n").trim() ?? "";
}

export function parsePartnerRequest(parameters) {
  const errors = [];

  for (const name of parameters.keys()) {
    if (!allowedFields.has(name)) errors.push("The request contains an unexpected field.");
  }

  for (const name of allowedFields) {
    if (parameters.getAll(name).length !== 1) {
      errors.push(`The ${name === "cf-turnstile-response" ? "verification" : name} field is required once.`);
    }
  }

  const value = {
    name: normalizeSingleLine(oneValue(parameters, "name")),
    email: normalizeSingleLine(oneValue(parameters, "email")).toLowerCase(),
    affiliation: normalizeSingleLine(oneValue(parameters, "affiliation")),
    collaborationType: normalizeSingleLine(oneValue(parameters, "collaborationType")),
    message: normalizeMessage(oneValue(parameters, "message")),
    privacyConsent: oneValue(parameters, "privacyConsent") ?? "",
    turnstileToken: oneValue(parameters, "cf-turnstile-response")?.trim() ?? "",
  };

  for (const [label, field, maximum] of [
    ["Name", "name", requestLimits.name],
    ["Email", "email", requestLimits.email],
    ["Affiliation", "affiliation", requestLimits.affiliation],
  ]) {
    if (!value[field]) errors.push(`${label} is required.`);
    if (value[field].length > maximum) errors.push(`${label} is too long.`);
    const rawValue = oneValue(parameters, field) ?? "";
    if (singleLineControls.test(rawValue)) errors.push(`${label} contains unsupported characters.`);
  }

  if (value.email && !emailPattern.test(value.email)) errors.push("Email must be a valid address.");
  if (!collaborationValues.has(value.collaborationType)) {
    errors.push("Choose a valid collaboration type.");
  }
  if (!value.message) errors.push("Short message is required.");
  if (value.message.length > requestLimits.message) errors.push("Short message is too long.");
  if (messageControls.test(value.message)) errors.push("Short message contains unsupported characters.");
  if (value.privacyConsent !== "yes") errors.push("Privacy acknowledgement is required.");
  if (!value.turnstileToken) errors.push("Verification is required.");
  if (value.turnstileToken.length > requestLimits.turnstileToken) {
    errors.push("Verification could not be accepted.");
  }

  return { success: errors.length === 0, errors: [...new Set(errors)], value };
}
