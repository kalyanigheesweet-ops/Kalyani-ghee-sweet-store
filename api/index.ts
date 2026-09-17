import type { IncomingMessage, ServerResponse } from "node:http";

import server from "../dist/server/server.js";

type VercelRequest = IncomingMessage & { body?: unknown; method?: string; url?: string };
type VercelResponse = ServerResponse & {
  status: (statusCode: number) => VercelResponse;
  send: (body: string | Buffer) => void;
};

function getRequestHeaders(request: VercelRequest) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) headers.set(name, value.join(", "));
    else if (value) headers.set(name, value);
  }
  return headers;
}

async function readBody(request: VercelRequest) {
  if (request.method === "GET" || request.method === "HEAD") return undefined;
  if (request.body !== undefined) return JSON.stringify(request.body);

  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const protocol = request.headers["x-forwarded-proto"]?.toString() ?? "https";
  const host = request.headers.host ?? "localhost";
  const url = new URL(request.url ?? "/", `${protocol}://${host}`);
  const originalPath = url.searchParams.get("path");
  if (originalPath) {
    url.pathname = originalPath;
    url.searchParams.delete("path");
  }
  const body = await readBody(request);
  const webRequest = new Request(url, {
    method: request.method ?? "GET",
    headers: getRequestHeaders(request),
    body,
    // Node's fetch implementation requires this for streamed request bodies.
    duplex: "half",
  } as RequestInit);
  const webResponse = await server.fetch(webRequest, {}, {});

  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, name) => response.setHeader(name, value));
  response.end(Buffer.from(await webResponse.arrayBuffer()));
}
