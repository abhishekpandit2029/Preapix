"use client";
import { createClient } from "@/lib/supabase/client";
import { normalizeApiPath, normalizeResponseHeaders } from "@/lib/utils";

export type LocalScenario = { id: string; name: string; description?: string | null; statusCode: number; responseBody: string; responseHeaders: string; delayMs: number; enabled: boolean };
export type LocalRequestLog = { id: string; method: string; path: string; statusCode: number; requestHeaders?: string | null; queryParams?: string | null; requestBody?: string | null; responseHeaders?: string | null; responseBody?: string | null; responseTimeMs?: number | null; createdAt: string };
export type LocalMockApi = { id: string; name: string; description?: string | null; method: string; path: string; statusCode: number; responseBody: string; responseHeaders: string; delayMs: number; enabled: boolean; generationCount?: number; scenarios: LocalScenario[]; requestLogs: LocalRequestLog[] };
export type LocalProject = { id: string; name: string; description?: string | null; publicKey: string; mockApis: LocalMockApi[] };
type Workspace = { projects: LocalProject[]; published: Record<string, { slug: string; version: number; publishedAt: string; snapshot: LocalMockApi }[]>; activity: { id: string; summary: string; action: string; createdAt: string; actor: { name: string; email: string } | null }[] };

const emptyWorkspace = (): Workspace => ({ projects: [], published: {}, activity: [] });

async function readWorkspace(userId: string): Promise<Workspace> {
  const { data, error } = await createClient().from("preapix_workspaces").select("data").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(`Could not load your Supabase workspace: ${error.message}`);
  return (data?.data as Workspace | undefined) ?? emptyWorkspace();
}

async function updateWorkspace<T>(userId: string, update: (workspace: Workspace) => T): Promise<T> {
  const workspace = await readWorkspace(userId);
  const result = update(workspace);
  const { error } = await createClient().from("preapix_workspaces").upsert({ user_id: userId, data: workspace, updated_at: now() });
  if (error) throw new Error(`Could not save your Supabase workspace: ${error.message}`);
  return result;
}

const id = () => crypto.randomUUID();
const key = () => `px_${crypto.randomUUID().replaceAll("-", "")}`;
const now = () => new Date().toISOString();
const json = (value: unknown) => JSON.stringify(value, null, 2);
function routesEquivalent(first: string, second: string) {
  const left = normalizeApiPath(first).split("/").filter(Boolean);
  const right = normalizeApiPath(second).split("/").filter(Boolean);
  const sharedLength = Math.min(left.length, right.length);
  for (let index = 0; index < sharedLength; index += 1) {
    if (left[index] === "*" || right[index] === "*") return left[index] === right[index] && left.slice(0, index).length === right.slice(0, index).length && left.slice(0, index).every((part, prefixIndex) => part.startsWith(":") && right[prefixIndex].startsWith(":") || part === right[prefixIndex]);
    const leftIsParam = left[index].startsWith(":");
    const rightIsParam = right[index].startsWith(":");
    if (leftIsParam !== rightIsParam || (!leftIsParam && left[index] !== right[index])) return false;
  }
  return left.length === right.length;
}
const addActivity = (workspace: Workspace, summary: string, action: string) => {
  workspace.activity.unshift({ id: id(), summary, action, createdAt: now(), actor: null });
  workspace.activity = workspace.activity.slice(0, 200);
};

export async function listLocalProjects(userId: string) { return (await readWorkspace(userId)).projects; }

export async function loadWorkspaceProjects(userId: string) {
  return listLocalProjects(userId);
}

export async function seedLocalWorkspace(userId: string) {
  await updateWorkspace(userId, (workspace) => {
    if (workspace.projects.length) {
      workspace.projects.forEach((project) => project.mockApis.forEach((api) => { api.enabled = true; }));
      return;
    }
    const projectId = id();
    const usersApi: LocalMockApi = { id: id(), name: "User list", description: "Returns sample user data", method: "GET", path: "/users", statusCode: 200, responseBody: json({ success: true, data: [{ id: 1, name: "Abhishek", email: "abhishek@example.com" }] }), responseHeaders: json({ "Content-Type": "application/json" }), delayMs: 150, enabled: true, requestLogs: [], scenarios: [{ id: id(), name: "server-error", description: "Simulates an API failure for QA", statusCode: 500, responseBody: json({ success: false, message: "Server error" }), responseHeaders: json({ "Content-Type": "application/json" }), delayMs: 120, enabled: false }] };
    const project: LocalProject = { id: projectId, name: "Demo Workspace", description: "Your private Supabase-backed mock API workspace.", publicKey: key(), mockApis: [usersApi, { id: id(), name: "Create user", description: "Creates a user payload", method: "POST", path: "/users", statusCode: 201, responseBody: json({ success: true, data: { id: 101, created: true } }), responseHeaders: json({ "Content-Type": "application/json" }), delayMs: 200, enabled: true, scenarios: [], requestLogs: [] }] };
    workspace.projects.push(project);
    addActivity(workspace, "Created your demo workspace", "create");
  });
}

export async function saveProject(userId: string, input: { id?: string; name: string; description?: string }) {
  return updateWorkspace(userId, (workspace) => {
    const name = input.name.trim();
    if (!name) throw new Error("Project name is required.");
    const existing = workspace.projects.find((project) => project.id === input.id);
    if (existing) { existing.name = name; existing.description = input.description?.trim() || ""; addActivity(workspace, `Updated project ${name}`, "update"); return existing; }
    const project: LocalProject = { id: id(), name, description: input.description?.trim() || "", publicKey: key(), mockApis: [] };
    workspace.projects.unshift(project); addActivity(workspace, `Created project ${name}`, "create"); return project;
  });
}

export async function deleteLocalProject(userId: string, projectId: string) { return updateWorkspace(userId, (workspace) => { const project = workspace.projects.find((item) => item.id === projectId); for (const api of project?.mockApis ?? []) delete workspace.published[api.id]; workspace.projects = workspace.projects.filter((item) => item.id !== projectId); addActivity(workspace, `Deleted project ${project?.name ?? "project"}`, "delete"); }); }

export async function saveMockApi(userId: string, projectId: string, input: Partial<LocalMockApi> & Pick<LocalMockApi, "name" | "method" | "path" | "statusCode" | "responseBody" | "responseHeaders" | "delayMs" | "enabled">) {
  const saved = await updateWorkspace(userId, (workspace) => {
    const project = workspace.projects.find((item) => item.id === projectId); if (!project) throw new Error("Project not found.");
    const name = input.name.trim();
    if (!name) throw new Error("API name is required.");
    const method = input.method.toUpperCase();
    if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) throw new Error("Choose a supported HTTP method.");
    const path = normalizeApiPath(input.path);
    if (/[\s?#]/.test(path)) throw new Error("API paths cannot contain spaces, query strings, or fragments.");
    if (!Number.isInteger(input.statusCode) || input.statusCode < 200 || input.statusCode > 599) throw new Error("Status code must be between 200 and 599.");
    if (!Number.isInteger(input.delayMs) || input.delayMs < 0 || input.delayMs > 60_000) throw new Error("Response delay must be between 0 and 60,000 ms.");
    const generationCount = input.generationCount ?? 20;
    if (!Number.isInteger(generationCount) || generationCount < 1 || generationCount > 1000) throw new Error("Generated response item count must be between 1 and 1,000.");
    if (project.mockApis.some((api) => api.id !== input.id && api.method === method && routesEquivalent(api.path, path))) throw new Error(`An API already exists for ${method} ${path}.`);
    JSON.parse(input.responseBody); const responseHeaders = normalizeResponseHeaders(input.responseHeaders);
    let api = project.mockApis.find((item) => item.id === input.id);
    if (!api) { api = { id: id(), name, description: input.description?.trim() ?? "", method, path, statusCode: input.statusCode, responseBody: input.responseBody, responseHeaders, delayMs: input.delayMs, enabled: true, generationCount, scenarios: [], requestLogs: [] }; project.mockApis.unshift(api); }
    else Object.assign(api, { ...input, method, path, name, description: input.description?.trim() ?? "", responseHeaders, enabled: true, generationCount });
    addActivity(workspace, `${input.id ? "Updated" : "Created"} ${method} ${path}`, input.id ? "update" : "create"); return api;
  });
  return (await listLocalProjects(userId)).find((project) => project.id === projectId)?.mockApis.find((api) => api.id === saved.id) ?? saved;
}

export async function deleteLocalApi(userId: string, projectId: string, apiId: string) { return updateWorkspace(userId, (workspace) => { const project = workspace.projects.find((item) => item.id === projectId); if (project) { const api = project.mockApis.find((item) => item.id === apiId); project.mockApis = project.mockApis.filter((item) => item.id !== apiId); delete workspace.published[apiId]; addActivity(workspace, `Deleted ${api?.method ?? ""} ${api?.path ?? "mock API"}`, "delete"); } }); }

export async function saveScenario(userId: string, projectId: string, apiId: string, input: LocalScenario) {
  const result = await updateWorkspace(userId, (workspace) => { const api = workspace.projects.find((item) => item.id === projectId)?.mockApis.find((item) => item.id === apiId); if (!api) throw new Error("API not found."); const name = input.name.trim(); if (!name) throw new Error("Scenario name is required."); if (api.scenarios.some((scenario) => scenario.id !== input.id && scenario.name.toLowerCase() === name.toLowerCase())) throw new Error(`A scenario named "${name}" already exists for this API.`); if (!Number.isInteger(input.statusCode) || input.statusCode < 200 || input.statusCode > 599) throw new Error("Scenario status must be between 200 and 599."); if (!Number.isInteger(input.delayMs) || input.delayMs < 0 || input.delayMs > 60_000) throw new Error("Scenario delay must be between 0 and 60,000 ms."); JSON.parse(input.responseBody); const responseHeaders = normalizeResponseHeaders(input.responseHeaders); const existing = api.scenarios.find((item) => item.id === input.id); if (existing) Object.assign(existing, input, { name, responseHeaders }); else api.scenarios.push({ ...input, name, responseHeaders, id: id() }); addActivity(workspace, `${existing ? "Updated" : "Created"} scenario ${name}`, existing ? "update" : "create"); return existing ?? api.scenarios.at(-1)!; });
  return result;
}

export async function deleteLocalScenario(userId: string, projectId: string, apiId: string, scenarioId: string) { await updateWorkspace(userId, (workspace) => { const api = workspace.projects.find((item) => item.id === projectId)?.mockApis.find((item) => item.id === apiId); if (api) { const scenario = api.scenarios.find((item) => item.id === scenarioId); api.scenarios = api.scenarios.filter((item) => item.id !== scenarioId); addActivity(workspace, `Deleted scenario ${scenario?.name ?? "scenario"}`, "delete"); } }); }

export async function publishLocalApi(userId: string, projectId: string, apiId: string) {
  return updateWorkspace(userId, (workspace) => { const api = workspace.projects.find((item) => item.id === projectId)?.mockApis.find((item) => item.id === apiId); if (!api) throw new Error("API not found."); const versions = workspace.published[apiId] ?? []; const version = { slug: versions[0]?.slug ?? id().replaceAll("-", "").slice(0, 18), version: (versions[0]?.version ?? 0) + 1, publishedAt: now(), snapshot: structuredClone({ ...api, requestLogs: [] }) }; workspace.published[apiId] = [version, ...versions].slice(0, 50); addActivity(workspace, `Saved documentation snapshot v${version.version} for ${api.name}`, "publish"); return { slug: version.slug, version: version.version, publishedAt: version.publishedAt }; });
}

export async function listPublished(userId: string, apiId: string) { return (await readWorkspace(userId)).published[apiId] ?? []; }
export async function getPublishedSnapshot(userId: string, apiId: string, version: number) { return (await readWorkspace(userId)).published[apiId]?.find((entry) => entry.version === version)?.snapshot ?? null; }
export async function listActivity(userId: string) { return (await readWorkspace(userId)).activity.slice(0, 100); }
export async function importLocalApis(userId: string, projectId: string, payload: unknown) {
  const input = payload as { apis?: Record<string, unknown>[] };
  const entries = Array.isArray(input?.apis) ? input.apis : Array.isArray(payload) ? payload as Record<string, unknown>[] : [];
  let imported = 0;
  for (const entry of entries) {
    try {
      const api = await saveMockApi(userId, projectId, { name: String(entry.name ?? "Imported API"), method: String(entry.method ?? "GET"), path: String(entry.path ?? "/imported"), statusCode: Number(entry.statusCode ?? 200), responseBody: typeof entry.responseBody === "string" ? entry.responseBody : json(entry.responseBody ?? {}), responseHeaders: typeof entry.responseHeaders === "string" ? entry.responseHeaders : json(entry.responseHeaders ?? { "Content-Type": "application/json" }), delayMs: Number(entry.delayMs ?? 0), enabled: entry.enabled !== false });
      const scenarios = Array.isArray(entry.scenarios) ? entry.scenarios as LocalScenario[] : [];
      for (const scenario of scenarios) await saveScenario(userId, projectId, api.id, { ...scenario, id: crypto.randomUUID() });
      imported += 1;
    } catch { /* Skip invalid entries while importing the rest. */ }
  }
  return imported;
}

export async function runLocalMock(userId: string, projectId: string, apiId: string, scenarioName = "") {
  const data = await readWorkspace(userId); const project = data.projects.find((item) => item.id === projectId); const api = project?.mockApis.find((item) => item.id === apiId);
  if (!project || !api) throw new Error("Select a saved mock endpoint to run it.");
  const url = new URL(`${window.location.origin}/api/mock/${project.publicKey}${api.path}`);
  if (scenarioName) url.searchParams.set("scenario", scenarioName);
  const started = performance.now();
  const response = await fetch(url, { method: api.method, headers: { Accept: "application/json" } });
  const responseText = await response.text();
  let body: unknown = responseText;
  try { body = JSON.parse(responseText); } catch { /* Keep text responses as text. */ }
  const responseTimeMs = Math.round(performance.now() - started);
  const headers = Object.fromEntries(response.headers.entries());
  await updateWorkspace(userId, (workspace) => {
    const target = workspace.projects.find((item) => item.id === projectId)?.mockApis.find((item) => item.id === apiId);
    if (target) {
      target.requestLogs = [{ id: id(), method: api.method, path: api.path, statusCode: response.status, requestHeaders: json({ Accept: "application/json" }), queryParams: json(scenarioName ? { scenario: scenarioName } : {}), responseHeaders: json(headers), responseBody: typeof body === "string" ? body : json(body), responseTimeMs, createdAt: now() }, ...target.requestLogs].slice(0, 200);
    }
  });
  return { status: response.status, headers, body, responseTimeMs };
}

export async function exportLocalProject(userId: string, projectId: string) { const project = (await readWorkspace(userId)).projects.find((item) => item.id === projectId); if (!project) throw new Error("Project not found."); return { project: project.name, apis: project.mockApis.map((api) => ({ ...api, requestLogs: [] })) }; }
