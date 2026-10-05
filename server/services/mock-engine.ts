import { normalizeApiPath, parseJson } from "@/lib/utils";
import { generateFromReference } from "@/lib/mock-generator";

type MockDefinition = { id: string; name: string; method: string; path: string; statusCode: number; responseBody: string; responseHeaders: string; delayMs: number; enabled: boolean; scenarios: Array<{ enabled: boolean; name: string; statusCode?: number; responseBody?: string; responseHeaders?: string; delayMs?: number | null }> };
export type MockProjectSnapshot = { publicKey: string; mockApis: MockDefinition[] };

function matchRoutePattern(pattern: string, pathname: string) {
  const expected = normalizeApiPath(pattern).split("/").filter(Boolean);
  const actual = normalizeApiPath(pathname).split("/").filter(Boolean);

  if (expected.length !== actual.length && !expected.some((segment) => segment === "*")) {
    const wildcardSegments = expected.filter((segment) => segment === "*").length;
    if (wildcardSegments === 0) {
      return false;
    }
  }

  if (expected.length === 0 && actual.length === 0) {
    return true;
  }

  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    const patternSegment = expected[index];
    const actualSegment = actual[index];

    if (!patternSegment) {
      return true;
    }

    if (patternSegment === "*") {
      return true;
    }

    if (patternSegment.startsWith(":")) {
      if (!actualSegment) {
        return false;
      }
      continue;
    }

    if (patternSegment !== actualSegment) {
      return false;
    }
  }

  return true;
}

function routeSpecificity(path: string) {
  return normalizeApiPath(path).split("/").filter(Boolean).reduce((score, segment) => score + (segment === "*" ? 0 : segment.startsWith(":") ? 10 : 100), 0);
}

function pickScenario(mockApi: { scenarios?: Array<{ enabled: boolean; name: string; statusCode?: number; responseBody?: string; responseHeaders?: string; delayMs?: number | null; }> }, query: URLSearchParams) {
  const requestedScenario = query.get("scenario") ?? query.get("_scenario");
  const scenarios = (mockApi.scenarios ?? []).filter((scenario) => scenario.enabled);

  if (!requestedScenario) {
    return scenarios.length === 1 ? scenarios[0] : null;
  }

  return scenarios.find((scenario) => scenario.name.toLowerCase() === requestedScenario.toLowerCase()) ?? null;
}

export async function resolveMockRequest(input: {
  projectKey: string;
  method: string;
  url: string;
  headers: Headers;
  body: unknown;
  snapshot: MockProjectSnapshot | null;
}): Promise<{ statusCode: number; headers: Record<string, string>; body: string }> {
  const requestUrl = new URL(input.url, "http://localhost");
  const pathname = requestUrl.pathname;
  const query = requestUrl.searchParams;
  const project = input.snapshot?.publicKey === input.projectKey && Array.isArray(input.snapshot.mockApis)
    ? input.snapshot
    : null;

  if (!project) {
    return {
      statusCode: 404,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: false, message: "Project not found." }),
    };
  }

  const candidate = project.mockApis.filter((mockApi) => {
    const sameMethod = mockApi.enabled && mockApi.method.toUpperCase() === input.method.toUpperCase();
    return sameMethod && matchRoutePattern(mockApi.path, pathname);
  }).sort((first, second) => routeSpecificity(second.path) - routeSpecificity(first.path))[0];

  if (!candidate) {
    return {
      statusCode: 404,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ success: false, message: "No matching mock API found." }),
    };
  }

  const scenario = pickScenario(candidate, query);
  const statusCode = scenario?.statusCode ?? candidate.statusCode;
  const delayMs = scenario?.delayMs ?? candidate.delayMs ?? 0;
  const responseHeaders = parseJson<Record<string, string>>(scenario?.responseHeaders ?? candidate.responseHeaders ?? "{}", {
    "content-type": "application/json; charset=utf-8",
  });
  const responseBodyValue = scenario?.responseBody ?? candidate.responseBody;
  const parsedResponseBody = parseJson<unknown>(responseBodyValue, responseBodyValue);
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const headerMap: Record<string, string> = Object.fromEntries(
    Object.entries(responseHeaders).map(([key, value]) => [key.toLowerCase(), String(value)]),
  );

  const randomizedBody = generateFromReference(parsedResponseBody);
  const responsePayload = typeof randomizedBody === "string" ? randomizedBody : JSON.stringify(randomizedBody ?? null, null, 2);
  const responseType = headerMap["content-type"] ?? "application/json; charset=utf-8";

  const finalResponse = {
    statusCode,
    headers: {
      ...headerMap,
      "x-mockforge-project": project.publicKey,
      "x-mockforge-route": candidate.path,
      "x-mockforge-method": candidate.method,
    },
    body: responseType.includes("application/json") ? JSON.stringify(randomizedBody ?? null, null, 2) : responsePayload,
  };

  return { ...finalResponse, headers: { ...finalResponse.headers, "access-control-allow-origin": "*", "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS", "access-control-allow-headers": "*" } };
}
