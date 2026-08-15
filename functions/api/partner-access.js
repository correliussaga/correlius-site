import { handlePartnerRequest } from "../../src/server/partner-request.mjs";

export async function onRequest(context) {
  return handlePartnerRequest(context.request, context.env);
}
