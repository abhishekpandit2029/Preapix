// "use client";

// import Link from "next/link";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
// import {
//   ArrowRight,
//   Check,
//   ChevronDown,
//   Command,
//   Copy,
//   Code2,
//   Database,
//   LayoutDashboard,
//   LoaderCircle,
//   Menu,
//   PanelLeftClose,
//   Play,
//   Plus,
//   Search,
//   Settings2,
//   Trash2,
//   X,
// } from "lucide-react";

// const sans = Space_Grotesk({ subsets: ["latin"], variable: "--f-sans" });
// const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono" });

// /* Same approach as the landing page: every color lives under .pxl with
//    !important so legacy rules in globals.css cannot override the design. */
// const css = `
// .pxl{background:#fff!important;color:#0A0A0F!important;color-scheme:light;font-family:var(--f-sans),system-ui,sans-serif}
// .pxl a{text-decoration:none!important}
// .pxl button{font:inherit;border:0;cursor:pointer}
// .pxl button:disabled{cursor:not-allowed;opacity:.55}
// .pxl .c-ink{color:#0A0A0F!important}.pxl .c-white{color:#fff!important}.pxl .c-mut{color:#52525b!important}
// .pxl .c-zinc{color:#71717a!important}.pxl .c-soft{color:#d4d4d8!important}.pxl .c-vio{color:#7C3AED!important}
// .pxl .c-err{color:#e11d48!important}.pxl .c-ok{color:#6d28d9!important}
// .pxl .b-ink{background:#0A0A0F!important}.pxl .b-white{background:#fff!important}.pxl .b-gray{background:#f4f4f5!important}

// /* buttons */
// .pxl .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:999px;padding:.75rem 1.4rem;font-weight:600;font-size:.9rem;border:1px solid transparent;transition:background .15s,border-color .15s}
// .pxl .btn-sm{padding:.45rem .95rem;font-size:.8rem}
// .pxl .btn-pur{background:#7C3AED!important;color:#fff!important;box-shadow:0 14px 40px -14px rgba(124,58,237,.8)}
// .pxl .btn-pur:hover:not(:disabled){background:#6D28D9!important}
// .pxl .btn-ink{background:#0A0A0F!important;color:#fff!important}
// .pxl .btn-ink:hover:not(:disabled){background:#3f3f46!important}
// .pxl .btn-out{background:#fff!important;color:#0A0A0F!important;border-color:#d4d4d8!important}
// .pxl .btn-out:hover:not(:disabled){border-color:#0A0A0F!important}
// .pxl .btn-danger{background:#fff!important;color:#e11d48!important;border-color:#fecdd3!important}
// .pxl .btn-danger:hover:not(:disabled){background:#fff1f2!important;border-color:#e11d48!important}
// .pxl .ibtn{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:999px;background:transparent!important;color:#52525b!important}
// .pxl .ibtn:hover{background:#f4f4f5!important;color:#0A0A0F!important}
// .pxl .tlink{background:transparent!important;color:#52525b!important;font-size:.8rem;font-weight:600}
// .pxl .tlink:hover:not(:disabled){color:#7C3AED!important}

// /* surfaces */
// .pxl .card{background:#fff!important;border:1px solid #e4e4e7;border-radius:24px}
// .pxl .card-shadow{box-shadow:0 30px 80px -50px rgba(10,10,15,.35)}
// .pxl .card-gray{background:#f4f4f5!important;border-radius:24px}
// .pxl .hr{border-color:#e4e4e7!important}
// .pxl .row:hover{background:#fafafa!important}
// .pxl .row.on{background:#f5f3ff!important}

// /* forms */
// .pxl .lbl{display:block;font-size:.8rem;font-weight:600;color:#52525b!important}
// .pxl .field{display:block;width:100%;margin-top:.4rem;background:#fff!important;color:#0A0A0F!important;border:1px solid #d4d4d8;border-radius:.75rem;padding:.65rem .85rem;font-size:.9rem;outline:none;transition:border-color .15s,box-shadow .15s}
// .pxl .field::placeholder{color:#a1a1aa}
// .pxl .field:focus{border-color:#7C3AED;box-shadow:0 0 0 4px rgba(124,58,237,.14)}
// .pxl .field-sm{margin-top:0;padding:.5rem .75rem;font-size:.8rem;border-radius:999px;width:auto}
// .pxl .field-mono,.pxl textarea.field{font-family:var(--f-mono),ui-monospace,monospace}
// .pxl textarea.field{font-size:.8rem;line-height:1.7;resize:vertical}

// /* badges (the network-tab language) */
// .pxl .badge{display:inline-block;background:#0A0A0F!important;color:#fff!important;border-radius:.5rem;padding:.2rem .6rem;font-family:var(--f-mono),monospace;font-size:.75rem;font-weight:700;text-align:center}
// .pxl .m-get{background:#7C3AED!important}
// .pxl .m-delete{background:#e11d48!important}
// .pxl .m-put,.pxl .m-patch{background:#3f3f46!important}
// .pxl .pill{display:inline-flex;align-items:center;border-radius:999px;padding:.2rem .7rem;font-family:var(--f-mono),monospace;font-size:.72rem;font-weight:600;background:#f4f4f5!important;color:#52525b!important}
// .pxl .s-ok{background:#f5f3ff!important;color:#6d28d9!important}
// .pxl .s-info{background:#f4f4f5!important;color:#52525b!important}
// .pxl .s-warn,.pxl .s-err{background:#fff1f2!important;color:#e11d48!important}
// .pxl .t-ok{color:#6d28d9!important}.pxl .t-info{color:#52525b!important}.pxl .t-warn,.pxl .t-err{color:#e11d48!important}
// .pxl .mono{font-family:var(--f-mono),ui-monospace,monospace}
// .pxl kbd{font-family:var(--f-mono),monospace;font-size:.7rem;border:1px solid #d4d4d8;border-radius:.4rem;padding:.1rem .4rem;color:#71717a!important}

// /* dark code panels */
// .pxl .dark-panel{background:#0A0A0F!important;border-radius:24px;overflow:hidden;box-shadow:0 40px 80px -40px rgba(10,10,15,.45)}
// .pxl .dark-bar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.8rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.12)}
// .pxl pre,.pxl code{background:transparent!important;font-family:var(--f-mono),ui-monospace,monospace}
// .pxl .dark-panel pre{color:#e4e4e7!important;font-size:.8rem;line-height:1.75;padding:1.1rem 1.25rem;overflow:auto;margin:0}
// .pxl .light-pre{background:#fafafa!important;color:#3f3f46!important;border:1px solid #e4e4e7;border-radius:.9rem;padding:.9rem 1rem;font-size:.78rem;line-height:1.7;overflow:auto}
// .pxl .err-box{background:#fff1f2!important;border:1px solid #fecdd3;color:#be123c!important;border-radius:.9rem;padding:.8rem 1rem;font-size:.85rem}
// .pxl .dot{display:inline-block;width:.5rem;height:.5rem;border-radius:999px}

// /* shell */
// .pxl .shell{display:grid;grid-template-columns:268px minmax(0,1fr);min-height:100vh}
// .pxl .shell.col{grid-template-columns:84px minmax(0,1fr)}
// .pxl .side{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:1.5rem;padding:1.25rem 1rem;background:#fff!important;border-right:1px solid #e4e4e7;z-index:40}
// .pxl .nav-btn{display:flex;align-items:center;gap:.75rem;width:100%;padding:.7rem .9rem;border-radius:999px;font-size:.9rem;font-weight:600;background:transparent!important;color:#52525b!important;text-align:left}
// .pxl .nav-btn:hover{background:#f4f4f5!important;color:#0A0A0F!important}
// .pxl .nav-btn.on{background:#0A0A0F!important;color:#fff!important}
// .pxl .nav-btn.on svg{color:#c4b5fd!important}
// .pxl .profile{display:flex;align-items:center;gap:.7rem;width:100%;padding:.55rem;border-radius:1rem;background:transparent!important;text-align:left;color:#0A0A0F!important}
// .pxl .profile:hover{background:#f4f4f5!important}
// .pxl .avatar{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:2.25rem;height:2.25rem;border-radius:.8rem;background:#7C3AED!important;color:#fff!important;font-weight:700}
// .pxl .menu{background:#fff!important;border:1px solid #e4e4e7;border-radius:1rem;box-shadow:0 30px 60px -30px rgba(10,10,15,.4);padding:.4rem;z-index:60}
// .pxl .menu button,.pxl .menu a{display:block;width:100%;text-align:left;padding:.55rem .75rem;border-radius:.6rem;font-size:.85rem;background:transparent!important;color:#0A0A0F!important}
// .pxl .menu button:hover,.pxl .menu a:hover{background:#f4f4f5!important}
// .pxl .topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:4.25rem;padding:0 1.25rem;background:rgba(255,255,255,.88)!important;backdrop-filter:blur(12px);border-bottom:1px solid #e4e4e7}
// .pxl .only-mobile{display:none}
// .pxl .backdrop{position:fixed;inset:0;background:rgba(10,10,15,.45);z-index:35;border:0}
// .pxl .shell.col .side .nav-label,.pxl .shell.col .side .profile-text,.pxl .shell.col .side .brand-full{display:none}
// .pxl .shell.col .side .brand-icon{display:inline-flex}
// .pxl .side .brand-icon{display:none}
// .pxl .shell.col .side .nav-btn{justify-content:center;padding:.7rem}
// .pxl .shell.col .side .brand-row{flex-direction:column;gap:.75rem}
// .pxl .shell.col .side .collapse svg{transform:rotate(180deg)}
// @media(max-width:1023px){
//   .pxl .shell,.pxl .shell.col{grid-template-columns:minmax(0,1fr)}
//   .pxl .side{position:fixed;left:0;top:0;width:288px;transform:translateX(-102%);transition:transform .2s}
//   .pxl .side.open{transform:none}
//   .pxl .shell.col .side .nav-label,.pxl .shell.col .side .profile-text,.pxl .shell.col .side .brand-full{display:initial}
//   .pxl .shell.col .side .brand-icon{display:none}
//   .pxl .shell.col .side .nav-btn{justify-content:flex-start;padding:.7rem .9rem}
//   .pxl .only-mobile{display:inline-flex}
//   .pxl .only-desktop{display:none!important}
// }
// @media(prefers-reduced-motion:reduce){.pxl *{transition:none!important}}
// `;

// function Logo({ size = 34, iconOnly = false }: { size?: number; iconOnly?: boolean }) {
//   return (
//     <span className="inline-flex items-center gap-2.5">
//       <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
//         <rect width="64" height="64" rx="18" fill="#7C3AED" />
//         <path d="M22 47V17h11a10 10 0 0 1 0 20H22" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
//         <circle cx="45" cy="46" r="5" fill="#0A0A0F" stroke="#fff" strokeWidth="3" />
//       </svg>
//       {iconOnly ? null : (
//         <span className="text-[22px] font-bold tracking-tight" style={{ color: "#0A0A0F" }}>
//           preapix
//         </span>
//       )}
//     </span>
//   );
// }

// function Root({ children }: { children: React.ReactNode }) {
//   return (
//     <div className={`pxl ${sans.variable} ${mono.variable} min-h-screen antialiased`} style={{ overflowX: "clip" }}>
//       <style dangerouslySetInnerHTML={{ __html: css }} />
//       {children}
//     </div>
//   );
// }

// type RequestLog = {
//   id: string;
//   method: string;
//   path: string;
//   statusCode: number;
//   requestHeaders?: string | null;
//   queryParams?: string | null;
//   requestBody?: string | null;
//   responseHeaders?: string | null;
//   responseBody?: string | null;
//   responseTimeMs?: number | null;
//   createdAt: string;
// };

// type MockApi = {
//   id: string;
//   name: string;
//   description?: string | null;
//   method: string;
//   path: string;
//   statusCode: number;
//   responseBody: string;
//   responseHeaders: string;
//   delayMs: number;
//   enabled: boolean;
//   generationCount?: number;
//   requestLogs: RequestLog[];
// };

// type Project = {
//   id: string;
//   name: string;
//   description?: string | null;
//   publicKey: string;
//   mockApis: MockApi[];
// };
// type AuthUser = { id: string; name: string; email: string };
// type AuditEvent = { id: string; summary: string; action: string; createdAt: string; actor: { name: string; email: string } | null };
// type DashboardView = "overview" | "apis" | "settings";

// type Scenario = { id: string; name: string; description?: string | null; statusCode: number; responseBody: string; responseHeaders: string; delayMs: number; enabled: boolean };
// type WorkspaceApi = MockApi & { scenarios: Scenario[] };
// type WorkspaceProject = Project & { mockApis: WorkspaceApi[] };
// type WorkspaceData = {
//   projects: WorkspaceProject[];
//   published: Record<string, { slug: string; version: number; publishedAt: string; snapshot: WorkspaceApi }[]>;
//   activity: AuditEvent[];
// };

// const emptyWorkspace = (): WorkspaceData => ({ projects: [], published: {}, activity: [] });
// const createId = () => crypto.randomUUID();
// const createPublicKey = () => `px_${crypto.randomUUID().replaceAll("-", "")}`;
// const currentTimestamp = () => new Date().toISOString();
// const toJson = (value: unknown) => JSON.stringify(value, null, 2);

// async function readWorkspace(userId: string): Promise<WorkspaceData> {
//   void userId;
//   const response = await fetch("/api/workspace", { cache: "no-store" });
//   const payload = await response.json();
//   if (!response.ok) throw new Error(payload.error ?? "Could not load your PostgreSQL workspace.");
//   return (payload.workspace as WorkspaceData | undefined) ?? emptyWorkspace();
// }

// async function updateWorkspace<T>(userId: string, update: (workspace: WorkspaceData) => T): Promise<T> {
//   const workspace = await readWorkspace(userId);
//   const result = update(workspace);
//   const response = await fetch("/api/workspace", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workspace }) });
//   const payload = await response.json();
//   if (!response.ok) throw new Error(payload.error ?? "Could not save your PostgreSQL workspace.");
//   return result;
// }

// function normalizeApiPath(value: string) {
//   const trimmed = (value ?? "").trim();
//   if (!trimmed) return "/";
//   const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
//   return normalized.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
// }

// function normalizeResponseHeaders(value: string) {
//   let parsed: unknown;
//   try { parsed = JSON.parse(value); } catch { throw new Error("Response headers must contain valid JSON."); }
//   if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Response headers must be a JSON object.");
//   const headers: Record<string, string> = {};
//   for (const [name, rawValue] of Object.entries(parsed)) {
//     if (!["string", "number", "boolean"].includes(typeof rawValue)) throw new Error(`Header ${name} must have a text or number value.`);
//     const headerValue = String(rawValue);
//     if (/[\r\n]/.test(headerValue)) throw new Error(`Header ${name} contains an invalid line break.`);
//     headers[name] = headerValue;
//   }
//   try { new Headers(headers); } catch { throw new Error("Response headers contain an invalid header name or value."); }
//   return JSON.stringify(headers, null, 2);
// }

// function routesEquivalent(first: string, second: string) {
//   const left = normalizeApiPath(first).split("/").filter(Boolean);
//   const right = normalizeApiPath(second).split("/").filter(Boolean);
//   const sharedLength = Math.min(left.length, right.length);
//   for (let index = 0; index < sharedLength; index += 1) {
//     if (left[index] === "*" || right[index] === "*") return left[index] === right[index] && left.slice(0, index).length === right.slice(0, index).length && left.slice(0, index).every((part, prefixIndex) => part.startsWith(":") && right[prefixIndex].startsWith(":") || part === right[prefixIndex]);
//     const leftIsParam = left[index].startsWith(":");
//     const rightIsParam = right[index].startsWith(":");
//     if (leftIsParam !== rightIsParam || (!leftIsParam && left[index] !== right[index])) return false;
//   }
//   return left.length === right.length;
// }

// function addActivity(workspace: WorkspaceData, summary: string, action: string) {
//   workspace.activity.unshift({ id: createId(), summary, action, createdAt: currentTimestamp(), actor: null });
//   workspace.activity = workspace.activity.slice(0, 200);
// }

// async function loadWorkspaceProjects(userId: string) { return (await readWorkspace(userId)).projects; }
// async function listActivity(userId: string) { return (await readWorkspace(userId)).activity.slice(0, 100); }

// async function saveProject(userId: string, input: { id?: string; name: string; description?: string }) {
//   return updateWorkspace(userId, (workspace) => {
//     const name = input.name.trim();
//     if (!name) throw new Error("Project name is required.");
//     const existing = workspace.projects.find((project) => project.id === input.id);
//     if (existing) {
//       existing.name = name;
//       existing.description = input.description?.trim() || "";
//       addActivity(workspace, `Updated project ${name}`, "update");
//       return existing;
//     }
//     const project: WorkspaceProject = { id: createId(), name, description: input.description?.trim() || "", publicKey: createPublicKey(), mockApis: [] };
//     workspace.projects.unshift(project);
//     addActivity(workspace, `Created project ${name}`, "create");
//     return project;
//   });
// }

// async function saveMockApi(userId: string, projectId: string, input: Partial<WorkspaceApi> & Pick<WorkspaceApi, "name" | "method" | "path" | "statusCode" | "responseBody" | "responseHeaders" | "delayMs" | "enabled">) {
//   const saved = await updateWorkspace(userId, (workspace) => {
//     const project = workspace.projects.find((item) => item.id === projectId);
//     if (!project) throw new Error("Project not found.");
//     const name = input.name.trim();
//     if (!name) throw new Error("API name is required.");
//     const method = input.method.toUpperCase();
//     if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) throw new Error("Choose a supported HTTP method.");
//     const path = normalizeApiPath(input.path);
//     if (/[\s?#]/.test(path)) throw new Error("API paths cannot contain spaces, query strings, or fragments.");
//     if (!Number.isInteger(input.statusCode) || input.statusCode < 200 || input.statusCode > 599) throw new Error("Status code must be between 200 and 599.");
//     if (!Number.isInteger(input.delayMs) || input.delayMs < 0 || input.delayMs > 60_000) throw new Error("Response delay must be between 0 and 60,000 ms.");
//     const generationCount = input.generationCount ?? 20;
//     if (!Number.isInteger(generationCount) || generationCount < 1 || generationCount > 1000) throw new Error("Generated response item count must be between 1 and 1,000.");
//     if (project.mockApis.some((api) => api.id !== input.id && api.method === method && routesEquivalent(api.path, path))) throw new Error(`An API already exists for ${method} ${path}.`);
//     JSON.parse(input.responseBody);
//     const responseHeaders = normalizeResponseHeaders(input.responseHeaders);
//     let api = project.mockApis.find((item) => item.id === input.id);
//     if (!api) {
//       api = { id: createId(), name, description: input.description?.trim() ?? "", method, path, statusCode: input.statusCode, responseBody: input.responseBody, responseHeaders, delayMs: input.delayMs, enabled: true, generationCount, scenarios: [], requestLogs: [] };
//       project.mockApis.unshift(api);
//     } else Object.assign(api, { ...input, method, path, name, description: input.description?.trim() ?? "", responseHeaders, enabled: true, generationCount });
//     addActivity(workspace, `${input.id ? "Updated" : "Created"} ${method} ${path}`, input.id ? "update" : "create");
//     return api;
//   });
//   return (await loadWorkspaceProjects(userId)).find((project) => project.id === projectId)?.mockApis.find((api) => api.id === saved.id) ?? saved;
// }

// async function deleteLocalApi(userId: string, projectId: string, apiId: string) {
//   return updateWorkspace(userId, (workspace) => {
//     const project = workspace.projects.find((item) => item.id === projectId);
//     if (!project) return;
//     const api = project.mockApis.find((item) => item.id === apiId);
//     project.mockApis = project.mockApis.filter((item) => item.id !== apiId);
//     delete workspace.published[apiId];
//     addActivity(workspace, `Deleted ${api?.method ?? ""} ${api?.path ?? "mock API"}`, "delete");
//   });
// }

// async function saveScenario(userId: string, projectId: string, apiId: string, input: Scenario) {
//   return updateWorkspace(userId, (workspace) => {
//     const api = workspace.projects.find((project) => project.id === projectId)?.mockApis.find((item) => item.id === apiId);
//     if (!api) throw new Error("API not found.");
//     const name = input.name.trim();
//     if (!name) throw new Error("Scenario name is required.");
//     if (api.scenarios.some((scenario) => scenario.id !== input.id && scenario.name.toLowerCase() === name.toLowerCase())) throw new Error(`A scenario named "${name}" already exists for this API.`);
//     if (!Number.isInteger(input.statusCode) || input.statusCode < 200 || input.statusCode > 599) throw new Error("Scenario status must be between 200 and 599.");
//     if (!Number.isInteger(input.delayMs) || input.delayMs < 0 || input.delayMs > 60_000) throw new Error("Scenario delay must be between 0 and 60,000 ms.");
//     JSON.parse(input.responseBody);
//     const responseHeaders = normalizeResponseHeaders(input.responseHeaders);
//     const existing = api.scenarios.find((scenario) => scenario.id === input.id);
//     if (existing) Object.assign(existing, input, { name, responseHeaders });
//     else api.scenarios.push({ ...input, name, responseHeaders, id: createId() });
//     addActivity(workspace, `${existing ? "Updated" : "Created"} scenario ${name}`, existing ? "update" : "create");
//     return existing ?? api.scenarios.at(-1)!;
//   });
// }

// async function importLocalApis(userId: string, projectId: string, payload: unknown) {
//   const input = payload as { apis?: Record<string, unknown>[] };
//   const entries = Array.isArray(input?.apis) ? input.apis : Array.isArray(payload) ? payload as Record<string, unknown>[] : [];
//   let imported = 0;
//   for (const entry of entries) {
//     try {
//       const api = await saveMockApi(userId, projectId, { name: String(entry.name ?? "Imported API"), method: String(entry.method ?? "GET"), path: String(entry.path ?? "/imported"), statusCode: Number(entry.statusCode ?? 200), responseBody: typeof entry.responseBody === "string" ? entry.responseBody : toJson(entry.responseBody ?? {}), responseHeaders: typeof entry.responseHeaders === "string" ? entry.responseHeaders : toJson(entry.responseHeaders ?? { "Content-Type": "application/json" }), delayMs: Number(entry.delayMs ?? 0), enabled: entry.enabled !== false });
//       const scenarios = Array.isArray(entry.scenarios) ? entry.scenarios as Scenario[] : [];
//       for (const scenario of scenarios) await saveScenario(userId, projectId, api.id, { ...scenario, id: createId() });
//       imported += 1;
//     } catch { /* Skip invalid entries while importing the rest. */ }
//   }
//   return imported;
// }

// async function exportLocalProject(userId: string, projectId: string) {
//   const project = (await readWorkspace(userId)).projects.find((item) => item.id === projectId);
//   if (!project) throw new Error("Project not found.");
//   return { project: project.name, apis: project.mockApis.map((api) => ({ ...api, requestLogs: [] })) };
// }

// async function runLocalMock(userId: string, projectId: string, apiId: string) {
//   const workspace = await readWorkspace(userId);
//   const project = workspace.projects.find((item) => item.id === projectId);
//   const api = project?.mockApis.find((item) => item.id === apiId);
//   if (!project || !api) throw new Error("Select a saved mock endpoint to run it.");
//   const url = new URL(`${window.location.origin}/api/mock/${project.publicKey}${api.path}`);
//   const started = performance.now();
//   const response = await fetch(url, { method: api.method, headers: { Accept: "application/json" } });
//   const responseText = await response.text();
//   let body: unknown = responseText;
//   try { body = JSON.parse(responseText); } catch { /* Keep text responses as text. */ }
//   return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body, responseTimeMs: Math.round(performance.now() - started) };
// }

// function generateFromReference(reference: unknown, itemCount = 20): unknown {
//   const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
//   const words = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Quinn", "Reese"];
//   const domains = ["example.com", "sample.dev", "mail.test"];
//   const visit = (value: unknown, keyName = ""): unknown => {
//     const key = keyName.toLowerCase();
//     if (Array.isArray(value)) {
//       if (value.length && value.every((item) => item && typeof item === "object" && !Array.isArray(item))) return Array.from({ length: itemCount }, (_, index) => visit(value[index % value.length], keyName));
//       return value.map((item) => visit(item, keyName));
//     }
//     if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, visit(child, childKey)]));
//     if (typeof value === "number") return Number.isInteger(value) ? Math.floor(Math.random() * 9000) + 100 : Number((Math.random() * 1000).toFixed(2));
//     if (typeof value === "boolean") return Math.random() >= 0.5;
//     if (value === null) return null;
//     if (typeof value !== "string") return value;
//     if (key.includes("email")) return `${pick(words).toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@${pick(domains)}`;
//     if (key === "id" || key.endsWith("id")) return /^[0-9]+$/.test(value) ? String(Math.floor(Math.random() * 9000) + 100) : crypto.randomUUID();
//     if (key.includes("name")) return `${pick(words)} ${pick(["Parker", "Miller", "Reed", "Carter", "Brooks"])}`;
//     if (key.includes("phone")) return `+1${Math.floor(2000000000 + Math.random() * 7000000000)}`;
//     if (key.includes("url") || key.includes("website")) return `https://${pick(["sample", "preview", "demo"])}.${pick(domains)}`;
//     if (key.includes("date") || key.endsWith("at")) return new Date(Date.now() - Math.floor(Math.random() * 365 * 86400000)).toISOString();
//     if (value.startsWith("http")) return `https://${pick(["images.example.com", "cdn.sample.dev"])}/${crypto.randomUUID().slice(0, 8)}.jpg`;
//     return pick(["Ready", "Active", "New", "Sample value", "In progress"]);
//   };
//   return visit(reference);
// }

// const defaultApiForm = {
//   name: "Users list",
//   method: "GET",
//   path: "/users",
//   statusCode: 200,
//   responseBody: JSON.stringify({ success: true, data: [{ id: 1, name: "Abhishek", email: "abhishek@example.com" }] }, null, 2),
//   responseHeaders: JSON.stringify({ "Content-Type": "application/json" }, null, 2),
//   delayMs: 150,
//   enabled: true,
//   generationCount: 20,
//   description: "Returns a list of users",
// };
// const responseStatusOptions = [
//   [200, "OK"], [201, "Created"], [202, "Accepted"], [400, "Bad Request"],
//   [401, "Unauthorized"], [403, "Forbidden"], [404, "Not Found"], [405, "Method Not Allowed"],
//   [409, "Conflict"], [415, "Unsupported Media Type"], [422, "Unprocessable Entity"],
//   [429, "Too Many Requests"], [500, "Internal Server Error"], [502, "Bad Gateway"],
//   [503, "Service Unavailable"], [504, "Gateway Timeout"],
// ] as const;
// const commandActions = [
//   ["Create API", "apis", Code2],
//   ["Open Overview", "overview", LayoutDashboard],
//   ["Open Settings", "settings", Settings2],
// ] as const;

// function methodClass(method: string) {
//   switch (method.toUpperCase()) {
//     case "GET":
//       return "m-get";
//     case "POST":
//       return "m-post";
//     case "PUT":
//       return "m-put";
//     case "PATCH":
//       return "m-patch";
//     case "DELETE":
//       return "m-delete";
//     default:
//       return "m-post";
//   }
// }

// function statusClass(status: number) {
//   if (status >= 500) return "s-err";
//   if (status >= 400) return "s-warn";
//   if (status >= 300) return "s-info";
//   return "s-ok";
// }

// function statusTextClass(status: number) {
//   if (status >= 500) return "t-err";
//   if (status >= 400) return "t-warn";
//   if (status >= 300) return "t-info";
//   return "t-ok";
// }

// function formatJsonString(value: string) {
//   try {
//     return JSON.stringify(JSON.parse(value), null, 2);
//   } catch {
//     return value;
//   }
// }

// const PRESET_COUNTS = [10, 20, 40, 80, 160];

// export default function DashboardPage() {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [selectedProjectId, setSelectedProjectId] = useState<string>("");
//   const [apiForm, setApiForm] = useState(defaultApiForm);
//   const apiSaveTimerRef = useRef<number | null>(null);
//   const [selectedApiId, setSelectedApiId] = useState<string>("");
//   const [editingApiId, setEditingApiId] = useState<string | null>(null);
//   const [apiResponse, setApiResponse] = useState<{ status: number; headers: Record<string, string>; body: string; elapsedMs: number } | null>(null);
//   const [pendingAction, setPendingAction] = useState<"api" | "test" | null>(null);
//   const [error, setError] = useState<string>("");
//   const [bootstrapped, setBootstrapped] = useState(false);
//   const [activeView, setActiveView] = useState<DashboardView>("overview");
//   const [apiMethodFilter, setApiMethodFilter] = useState("all");
//   const [apiSort, setApiSort] = useState("recent");
//   const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [sidebarLoaded, setSidebarLoaded] = useState(false);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [projectMenuOpen, setProjectMenuOpen] = useState(false);
//   const [projectSwitcherSearch, setProjectSwitcherSearch] = useState("");
//   const [apiSearch, setApiSearch] = useState("");
//   const [paletteOpen, setPaletteOpen] = useState(false);
//   const [paletteQuery, setPaletteQuery] = useState("");
//   const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
//   const [toast, setToast] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [authUser, setAuthUser] = useState<AuthUser | null>(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [authMode, setAuthMode] = useState<"login" | "register">("register");
//   const [authBusy, setAuthBusy] = useState(false);
//   const [authError, setAuthError] = useState("");
//   const [databaseConfigured, setDatabaseConfigured] = useState(true);
//   const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

//   const selectedProject = useMemo(
//     () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
//     [projects, selectedProjectId],
//   );

//   const selectedApi = useMemo(
//     () => selectedProject?.mockApis.find((api) => api.id === selectedApiId) ?? selectedProject?.mockApis[0] ?? null,
//     [selectedApiId, selectedProject],
//   );
//   const userDisplayName = authUser?.name.trim().split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "there";

//   const ensureProjectSelected = useCallback((nextProjects: Project[]) => {
//     if (nextProjects.length === 0) {
//       setSelectedProjectId("");
//       setSelectedApiId("");
//       setEditingApiId(null);
//       setApiResponse(null);
//       return;
//     }

//     const nextSelection = nextProjects.find((project) => project.id === selectedProjectId) ?? nextProjects[0];
//     const nextApiId = nextSelection.mockApis.some((api) => api.id === selectedApiId) ? selectedApiId : nextSelection.mockApis[0]?.id ?? "";
//     if (nextSelection.id !== selectedProjectId) { setEditingApiId(null); setApiForm(defaultApiForm); }
//     if (nextApiId !== selectedApiId) setApiResponse(null);
//     setSelectedProjectId(nextSelection.id);
//     setSelectedApiId(nextApiId);
//   }, [selectedApiId, selectedProjectId]);

//   const selectProject = (project: Project) => {
//     setSelectedProjectId(project.id);
//     setSelectedApiId(project.mockApis[0]?.id ?? "");
//     setEditingApiId(null);
//     setApiForm(defaultApiForm);
//     setApiResponse(null);
//   };

//   const selectApi = (apiId: string) => {
//     setSelectedApiId(apiId);
//     setEditingApiId(null);
//     setApiForm(defaultApiForm);
//     setApiResponse(null);
//   };

//   const loadProjects = useCallback(async () => {
//     try {
//       if (!authUser) return;
//       const nextProjects = await loadWorkspaceProjects(authUser.id) as Project[];
//       setProjects(nextProjects);
//       ensureProjectSelected(nextProjects);
//     } catch (loadError) {
//       setError(loadError instanceof Error ? loadError.message : "Failed to load projects.");
//       throw loadError;
//     }
//   }, [authUser, ensureProjectSelected]);

//   const openApiCreator = useCallback(async () => {
//     setError("");
//     if (!selectedProject) {
//       if (!authUser) return;
//       try {
//         setPendingAction("api");
//         const workspace = await saveProject(authUser.id, { name: "My APIs" });
//         setProjects([workspace as Project]);
//         setSelectedProjectId(workspace.id);
//         setSelectedApiId("");
//         setEditingApiId(null);
//         setApiForm(defaultApiForm);
//         setApiResponse(null);
//       } catch (createError) {
//         setError(createError instanceof Error ? createError.message : "Could not prepare your API workspace.");
//         return;
//       } finally {
//         setPendingAction(null);
//       }
//     }
//     setEditingApiId(null);
//     setApiForm(defaultApiForm);
//     setActiveView("apis");
//   }, [authUser, selectedProject]);

//   useEffect(() => {
//     window.queueMicrotask(() => {
//       setSidebarCollapsed(window.localStorage.getItem("preapix-sidebar-collapsed") === "true");
//       setSidebarLoaded(true);
//     });
//   }, []);

//   useEffect(() => {
//     if (activeView !== "settings" || !selectedProject) return;
//     let active = true;
//     if (authUser) void listActivity(authUser.id).then((events) => { if (active) setAuditEvents(events); }).catch(() => { if (active) setAuditEvents([]); });
//     return () => { active = false; };
//   }, [activeView, authUser, selectedProject]);

//   useEffect(() => {
//     if (!sidebarLoaded) return;
//     window.localStorage.setItem("preapix-sidebar-collapsed", String(sidebarCollapsed));
//   }, [sidebarCollapsed, sidebarLoaded]);

//   useEffect(() => {
//     const onKeyDown = (event: KeyboardEvent) => {
//       const matchingCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));
//       if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
//         event.preventDefault();
//         setPaletteOpen((open) => !open);
//         setPaletteSelectedIndex(0);
//       }
//       if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s" && activeView === "apis") {
//         event.preventDefault();
//         document.querySelector<HTMLFormElement>("#create-api-form form")?.requestSubmit();
//       }
//       if (event.key === "Escape") {
//         setPaletteOpen(false);
//         setUserMenuOpen(false);
//         setProjectMenuOpen(false);
//         setMobileSidebarOpen(false);
//       }
//       if (paletteOpen && matchingCommands.length > 0 && event.key === "ArrowDown") {
//         event.preventDefault();
//         setPaletteSelectedIndex((index) => (index + 1) % matchingCommands.length);
//       }
//       if (paletteOpen && matchingCommands.length > 0 && event.key === "ArrowUp") {
//         event.preventDefault();
//         setPaletteSelectedIndex((index) => (index - 1 + matchingCommands.length) % matchingCommands.length);
//       }
//       if (paletteOpen && event.key === "Enter" && matchingCommands[paletteSelectedIndex]) {
//         event.preventDefault();
//         const [label, view] = matchingCommands[paletteSelectedIndex];
//         if (label === "Create API") void openApiCreator();
//         else setActiveView(view);
//         setPaletteOpen(false);
//         setPaletteQuery("");
//       }
//     };

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [activeView, openApiCreator, paletteOpen, paletteQuery, paletteSelectedIndex, pendingAction]);

//   useEffect(() => {
//     if (!toast) {
//       return;
//     }
//     const timeout = window.setTimeout(() => setToast(""), 2600);
//     return () => window.clearTimeout(timeout);
//   }, [toast]);

//   const visibleApis = useMemo(() => {
//     let apis = [...(selectedProject?.mockApis ?? [])];
//     const query = apiSearch.trim().toLowerCase();
//     apis = apis.filter((api) => (!query || `${api.name} ${api.method} ${api.path}`.toLowerCase().includes(query)) && (apiMethodFilter === "all" || api.method === apiMethodFilter));
//     if (apiSort === "name") apis.sort((first, second) => first.name.localeCompare(second.name));
//     if (apiSort === "method") apis.sort((first, second) => first.method.localeCompare(second.method) || first.path.localeCompare(second.path));
//     if (apiSort === "status") apis.sort((first, second) => first.statusCode - second.statusCode);
//     return apis;
//   }, [apiMethodFilter, apiSearch, apiSort, selectedProject]);
//   const filteredCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));

//   const activeApiCount = selectedProject?.mockApis.length ?? 0;
//   const apiJsonError = useMemo(() => {
//     try {
//       JSON.parse(apiForm.responseBody);
//     } catch (jsonError) {
//       return `Response body: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
//     }
//     return "";
//   }, [apiForm.responseBody]);
//   const apiFormBaseline = editingApiId && selectedApi?.id === editingApiId ? {
//     name: selectedApi.name,
//     method: selectedApi.method,
//     path: selectedApi.path,
//     statusCode: selectedApi.statusCode,
//     responseBody: selectedApi.responseBody,
//     responseHeaders: selectedApi.responseHeaders,
//     delayMs: selectedApi.delayMs,
//     enabled: true,
//     generationCount: selectedApi.generationCount ?? 20,
//     description: selectedApi.description ?? "",
//   } : defaultApiForm;
//   const hasUnsavedApiChanges = JSON.stringify(apiForm) !== JSON.stringify(apiFormBaseline);

//   useEffect(() => {
//     if (apiSaveTimerRef.current !== null) window.clearTimeout(apiSaveTimerRef.current);
//     if (!bootstrapped || !authUser || !selectedProject || !selectedApi || !editingApiId || selectedApi.id !== editingApiId || !hasUnsavedApiChanges || apiJsonError) return;
//     if (!apiForm.name.trim() || !apiForm.path.trim().startsWith("/") || /[\s?#]/.test(apiForm.path) || !Number.isInteger(apiForm.statusCode) || !Number.isInteger(apiForm.delayMs) || !Number.isInteger(apiForm.generationCount)) return;
//     if (selectedProject.mockApis.some((api) => api.id !== editingApiId && api.method === apiForm.method && api.path.toLowerCase() === apiForm.path.trim().toLowerCase())) return;

//     const snapshot = { ...apiForm, enabled: true, responseBody: formatJsonString(apiForm.responseBody), responseHeaders: formatJsonString(apiForm.responseHeaders) };
//     apiSaveTimerRef.current = window.setTimeout(() => {
//       void (async () => {
//         setPendingAction("api");
//         setError("");
//         try {
//           await saveMockApi(authUser.id, selectedProject.id, { ...snapshot, id: editingApiId });
//           setApiForm((current) => current.responseBody === apiForm.responseBody ? { ...current, responseBody: snapshot.responseBody, responseHeaders: snapshot.responseHeaders, enabled: true } : current);
//           await loadProjects();
//         } catch (saveError) {
//           setError(saveError instanceof Error ? saveError.message : "Could not save API changes.");
//         } finally {
//           setPendingAction(null);
//         }
//       })();
//     }, 500);

//     return () => {
//       if (apiSaveTimerRef.current !== null) window.clearTimeout(apiSaveTimerRef.current);
//     };
//   }, [apiForm, apiJsonError, authUser, bootstrapped, editingApiId, hasUnsavedApiChanges, loadProjects, selectedApi, selectedProject]);

//   const copyText = async (value: string, message: string) => {
//     try {
//       await navigator.clipboard.writeText(value);
//       setCopied(true);
//       setToast(message);
//       window.setTimeout(() => setCopied(false), 1500);
//     } catch {
//       setError("Could not copy to clipboard. Check browser permissions and try again.");
//     }
//   };

//   const endpointFor = (api: MockApi) => {
//     if (!selectedProject) return "";
//     return `${window.location.origin}/api/mock/${selectedProject.publicKey}${api.path}`;
//   };

//   useEffect(() => {
//     let active = true;
//     void fetch("/api/auth/me").then(async (response) => {
//       const payload = await response.json();
//       if (response.status === 503) throw new Error(payload.error ?? "Could not reach PostgreSQL. Check your Layerbase connection and migration.");
//       if (!response.ok) throw new Error("Could not check your account. Please try again.");
//       return payload;
//     }).then((payload) => {
//       if (active) {
//         setAuthUser(payload.user ?? null);
//         setDatabaseConfigured(Boolean(payload.configured));
//       }
//     }).catch((error) => { if (active) setAuthError(error instanceof Error ? error.message : "Could not connect to the account service. Refresh and try again."); })
//       .finally(() => { if (active) setAuthLoading(false); });
//     return () => { active = false; };
//   }, []);

//   useEffect(() => {
//     if (bootstrapped) {
//       return;
//     }
//     if (!authUser) return;

//     const initializeWorkspace = async () => {
//       try {
//         await loadProjects();
//         setBootstrapped(true);
//       } catch {
//         // loadProjects already shows the workspace error.
//       }
//     };

//     void initializeWorkspace();
//   }, [authUser, bootstrapped, loadProjects]);

//   const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const form = new FormData(event.currentTarget);
//     setAuthBusy(true);
//     setAuthError("");
//     try {
//       const email = String(form.get("email") ?? "").trim();
//       const password = String(form.get("password") ?? "");
//       const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
//       const body = authMode === "register" ? { name: String(form.get("name") ?? "").trim(), email, password } : { email, password };
//       const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
//       const payload = await response.json();
//       if (!response.ok || !payload.user) throw new Error(payload.error ?? "Could not sign in. Please try again.");
//       setAuthUser(payload.user);
//       setBootstrapped(false);
//     } catch (requestError) {
//       setAuthError(requestError instanceof Error ? requestError.message : "Account request failed.");
//     } finally { setAuthBusy(false); }
//   };

//   const handleSignOut = async () => {
//     const response = await fetch("/api/auth/logout", { method: "POST" });
//     if (!response.ok) { setError("Could not close your session. Check the database connection and try again."); return; }
//     setProjects([]);
//     setAuthUser(null);
//     setBootstrapped(false);
//   };

//   const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !selectedProject) return;
//     try {
//       const text = await file.text();
//       const imported = await importLocalApis(authUser!.id, selectedProject.id, JSON.parse(text));
//       await loadProjects();
//       setToast(`${imported} APIs imported`);
//     } catch (importError) {
//       setError(importError instanceof Error ? importError.message : "Could not import this file.");
//     } finally { event.target.value = ""; }
//   };

//   const handleExportProject = async () => {
//     if (!authUser || !selectedProject) return;
//     try {
//       const data = await exportLocalProject(authUser.id, selectedProject.id);
//       const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
//       const anchor = document.createElement("a"); anchor.href = blobUrl; anchor.download = `${selectedProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-mocks.json`; anchor.click();
//       URL.revokeObjectURL(blobUrl);
//       setToast("Workspace export downloaded");
//     } catch (exportError) {
//       setError(exportError instanceof Error ? exportError.message : "Could not export this workspace.");
//     }
//   };

//   const handleGenerateFromReference = () => {
//     try { setApiForm((current) => ({ ...current, responseBody: JSON.stringify(generateFromReference(JSON.parse(current.responseBody), current.generationCount ?? 20), null, 2) })); setToast(`${apiForm.generationCount ?? 20} sample records generated`); }
//     catch { setError("Add valid JSON reference data before generating a sample."); }
//   };

//   const handleCreateApi = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!selectedProject) {
//       return;
//     }
//     if (apiJsonError) {
//       setError(`Invalid JSON in response body: ${apiJsonError}`);
//       return;
//     }

//     try {
//       setPendingAction("api");
//       setError("");

//       const api = await saveMockApi(authUser!.id, selectedProject.id, { ...apiForm, id: editingApiId ?? undefined, responseBody: formatJsonString(apiForm.responseBody), responseHeaders: formatJsonString(apiForm.responseHeaders) });

//       setApiForm(defaultApiForm);
//       setEditingApiId(null);
//       await loadProjects();
//       selectApi(api.id);
//       setToast(editingApiId ? "API updated successfully" : "API created successfully");
//     } catch (createError) {
//       setError(createError instanceof Error ? createError.message : "Mock API creation failed.");
//     } finally {
//       setPendingAction(null);
//     }
//   };

//   const handleDeleteApi = async (mockApiId: string) => {
//     if (!selectedProject) {
//       return;
//     }
//     const api = selectedProject.mockApis.find((item) => item.id === mockApiId);
//     if (!window.confirm(`Delete "${api?.name ?? "this API"}" and its response configuration? This cannot be undone.`)) {
//       return;
//     }

//     try {
//       await deleteLocalApi(authUser!.id, selectedProject.id, mockApiId);
//       await loadProjects();
//       setToast("API deleted");
//     } catch (deleteError) {
//       setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
//     }
//   };

//   const handleTestEndpoint = async () => {
//     if (!selectedProject || !selectedApi) {
//       return;
//     }

//     try {
//       setPendingAction("test");
//       const result = await runLocalMock(authUser!.id, selectedProject.id, selectedApi.id);
//       setApiResponse({
//         status: result.status,
//         headers: result.headers,
//         body: JSON.stringify(result.body, null, 2),
//         elapsedMs: result.responseTimeMs,
//       });
//       await loadProjects();
//     } catch (testError) {
//       setError(testError instanceof Error ? testError.message : "Endpoint test failed.");
//     } finally {
//       setPendingAction(null);
//     }
//   };

//   if (authLoading) return (
//     <Root>
//       <main className="grid min-h-screen place-items-center px-4">
//         <div role="status" className="card card-shadow flex items-center gap-3 px-6 py-4 text-sm">
//           <LoaderCircle className="c-vio h-4 w-4 animate-spin" />
//           <span className="c-mut">Loading your account…</span>
//         </div>
//       </main>
//     </Root>
//   );

//   if (!databaseConfigured) return (
//     <Root>
//       <main className="grid min-h-screen place-items-center px-4">
//         <section className="card card-shadow w-full max-w-lg p-8">
//           <Logo />
//           <h1 className="c-ink mt-8 text-3xl font-bold tracking-[-0.04em]">Connect your database</h1>
//           <p className="c-mut mt-3 leading-7">Add a server-only PostgreSQL connection URL to your environment, run the migration, then restart the dev server.</p>
//           <div className="b-ink mono mt-6 overflow-x-auto whitespace-nowrap rounded-2xl p-4 text-xs leading-6 c-soft">
//             DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
//           </div>
//           <p className="c-zinc mt-4 text-sm">With Layerbase, use the pooled connection URL and keep the password out of browser code and source control.</p>
//         </section>
//       </main>
//     </Root>
//   );

//   if (!authUser) return (
//     <Root>
//       <main className="grid min-h-screen place-items-center px-4 py-12">
//         <section className="card card-shadow w-full max-w-md p-7 sm:p-9">
//           <Link href="/" aria-label="Preapix home"><Logo /></Link>
//           <h1 className="c-ink mt-10 text-4xl font-bold leading-[1] tracking-[-0.045em]">
//             {authMode === "register" ? "Create your account" : "Sign in to Preapix"}
//           </h1>
//           <p className="c-mut mt-3 leading-7">
//             {authMode === "register" ? "Save your APIs and workspace settings in a private account." : "Pick up where you left off with your mock APIs."}
//           </p>
//           <form onSubmit={handleAuth} className="mt-7 space-y-4">
//             {authMode === "register" ? (
//               <label className="lbl">Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} className="field" placeholder="Your name" /></label>
//             ) : null}
//             <label className="lbl">Email<input name="email" type="email" autoComplete="email" required className="field" placeholder="you@company.com" /></label>
//             <label className="lbl">Password<input name="password" type="password" autoComplete={authMode === "register" ? "new-password" : "current-password"} required minLength={authMode === "register" ? 10 : 1} maxLength={200} className="field" placeholder={authMode === "register" ? "At least 10 characters" : "Your password"} /></label>
//             {authError ? <p role="alert" className="err-box">{authError}</p> : null}
//             <button disabled={authBusy} className="btn btn-pur w-full">
//               {authBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
//               {authMode === "register" ? "Create account" : "Sign in"}
//             </button>
//           </form>
//           <p className="c-mut mt-6 text-center text-sm">
//             {authMode === "register" ? "Already have an account?" : "New to Preapix?"}
//             <button type="button" onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }} className="tlink ml-2 !text-sm">
//               {authMode === "register" ? "Sign in" : "Create an account"}
//             </button>
//           </p>
//         </section>
//       </main>
//     </Root>
//   );

//   const firstName = userDisplayName.split(" ")[0];
//   const customCount = !PRESET_COUNTS.includes(apiForm.generationCount ?? 20);
//   const navItems = [
//     ["overview", "Overview", LayoutDashboard],
//     ["apis", "APIs", Code2],
//     ["settings", "Settings", Settings2],
//   ] as const;

//   return (
//     <Root>
//       <div className={`shell ${sidebarCollapsed ? "col" : ""}`}>
//         {mobileSidebarOpen ? <button type="button" className="backdrop" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} /> : null}

//         <aside className={`side ${mobileSidebarOpen ? "open" : ""}`}>
//           <div className="brand-row flex items-center justify-between gap-2">
//             <Link href="/dashboard" aria-label="Preapix dashboard" onClick={() => setMobileSidebarOpen(false)}>
//               <span className="brand-full"><Logo /></span>
//               <span className="brand-icon"><Logo iconOnly /></span>
//             </Link>
//             <button type="button" className="ibtn collapse only-desktop" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}><PanelLeftClose className="h-4 w-4" /></button>
//             <button type="button" className="ibtn only-mobile" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button>
//           </div>

//           <nav aria-label="Workspace navigation" className="flex flex-col gap-1">
//             {navItems.map(([view, label, Icon]) => (
//               <button
//                 key={view}
//                 type="button"
//                 title={label}
//                 aria-label={label}
//                 aria-current={activeView === view ? "page" : undefined}
//                 onClick={() => { if (view === "apis" && !selectedProject) void openApiCreator(); else setActiveView(view); setMobileSidebarOpen(false); }}
//                 className={`nav-btn ${activeView === view ? "on" : ""}`}
//               >
//                 <Icon className="h-[18px] w-[18px] shrink-0" />
//                 <span className="nav-label">{label}</span>
//               </button>
//             ))}
//           </nav>

//           <div className="relative mt-auto">
//             {userMenuOpen ? (
//               <div className="menu absolute bottom-full left-0 mb-2 min-w-[230px]" role="menu">
//                 <div className="px-3 py-2">
//                   <span className="c-ink block truncate text-sm font-semibold">{authUser.name}</span>
//                   <span className="c-zinc block truncate text-xs">{authUser.email}</span>
//                 </div>
//                 <button type="button" role="menuitem" onClick={() => { setActiveView("settings"); setUserMenuOpen(false); setMobileSidebarOpen(false); }}>Settings</button>
//                 <Link role="menuitem" href="/" onClick={() => setUserMenuOpen(false)}>Home</Link>
//                 <button type="button" role="menuitem" onClick={() => { setUserMenuOpen(false); void handleSignOut(); }}>Sign out</button>
//               </div>
//             ) : null}
//             <button type="button" onClick={() => setUserMenuOpen((open) => !open)} className="profile" aria-label="Open account menu" aria-expanded={userMenuOpen}>
//               <span className="avatar">{authUser.name.trim().slice(0, 1).toUpperCase() || "P"}</span>
//               <span className="profile-text min-w-0">
//                 <strong className="block truncate text-sm">{authUser.name}</strong>
//                 <small className="c-zinc block truncate text-xs">{authUser.email}</small>
//               </span>
//             </button>
//           </div>
//         </aside>

//         <div className="min-w-0">

//           <main className="mx-auto max-w-[1200px] space-y-8 px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
//             {error ? <div role="alert" className="err-box">{error}</div> : null}

//             {selectedProject ? (
//               <>
//                 {activeView === "overview" ? (
//                   <>
//                     <section>
//                       <h1 className="c-ink max-w-[16ch] text-[clamp(2.4rem,5.5vw,4.4rem)] font-bold leading-[.98] tracking-[-0.05em]">
//                         Good to see you, {firstName}.
//                       </h1>
//                       <p className="c-mut mt-4 max-w-[48ch] text-lg leading-8">Here’s what’s happening in {selectedProject.name}.</p>
//                     </section>

//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <article className="card p-6">
//                         <div className="flex items-center justify-between"><span className="c-mut text-sm font-semibold">Endpoints</span><Code2 className="c-vio h-4 w-4" /></div>
//                         <div className="mt-4 flex items-baseline gap-3">
//                           <strong className="c-ink mono text-5xl font-bold tracking-tight">{selectedProject.mockApis.length || "—"}</strong>
//                           <span className="pill s-ok">{activeApiCount} active</span>
//                         </div>
//                       </article>
//                       <article className="card p-6">
//                         <div className="flex items-center justify-between"><span className="c-mut text-sm font-semibold">HTTP methods</span><Code2 className="c-vio h-4 w-4" /></div>
//                         <div className="mt-4 flex items-baseline gap-3">
//                           <strong className="c-ink mono text-5xl font-bold tracking-tight">{new Set(selectedProject.mockApis.map((api) => api.method)).size || "—"}</strong>
//                           <span className="c-zinc text-sm">in use</span>
//                         </div>
//                       </article>
//                     </div>

//                     {!selectedProject.mockApis.length ? (
//                       <section className="card-gray p-7 sm:p-9">
//                         <div className="flex flex-wrap items-center justify-between gap-3">
//                           <h2 className="c-ink text-2xl font-bold tracking-[-0.03em]">Your first mock API, in four steps</h2>
//                           <span className="pill" style={{ background: "#fff" }}>1 of 4 done</span>
//                         </div>
//                         <ol className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-4">
//                           {([
//                             ["Create a project", `${selectedProject.name} is ready to go.`, true],
//                             ["Add your first API", "Define a method, path and response.", false],
//                             ["Copy the endpoint", "Share the hosted URL with your frontend.", false],
//                             ["Call it from your app", "Build while the backend catches up.", false],
//                           ] as const).map(([title, text, done], n) => (
//                             <li key={title} className="relative pt-6" style={{ borderTop: "2px solid #0A0A0F" }}>
//                               <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full" style={{ background: done ? "#7C3AED" : "#d4d4d8", boxShadow: "0 0 0 4px #f4f4f5" }} />
//                               <span className="c-zinc mono text-xs">Step {n + 1}{done ? " · done" : ""}</span>
//                               <h3 className="c-ink mt-2 text-lg font-semibold tracking-tight">{title}</h3>
//                               <p className="c-mut mt-1.5 text-sm leading-6">{text}</p>
//                               {n === 1 ? <button type="button" onClick={() => setActiveView("apis")} className="btn btn-ink btn-sm mt-4">Add API <ArrowRight className="h-3.5 w-3.5" /></button> : null}
//                             </li>
//                           ))}
//                         </ol>
//                       </section>
//                     ) : null}

//                     <section className="card card-shadow overflow-hidden">
//                       <div className="flex items-center justify-between border-b px-6 py-4 hr">
//                         <h2 className="c-ink text-lg font-semibold tracking-tight">Recent APIs</h2>
//                         <button type="button" onClick={() => setActiveView("apis")} className="tlink">View all</button>
//                       </div>
//                       {selectedProject.mockApis.length ? (
//                         <ul>
//                           {selectedProject.mockApis.slice(0, 6).map((api) => (
//                             <li key={api.id} className="border-b last:border-b-0 hr">
//                               <button
//                                 type="button"
//                                 onClick={() => { selectApi(api.id); setActiveView("apis"); }}
//                                 className="row grid w-full grid-cols-[64px_minmax(0,1fr)_56px_18px] items-center gap-3 bg-transparent px-6 py-4 text-left"
//                               >
//                                 <span className={`badge ${methodClass(api.method)}`}>{api.method}</span>
//                                 <span className="c-ink mono min-w-0 truncate text-sm">{api.path}<span className="c-zinc ml-3 font-sans text-xs">{api.name}</span></span>
//                                 <span className={`pill justify-center ${statusClass(api.statusCode)}`}>{api.statusCode}</span>
//                                 <ArrowRight className="c-zinc h-4 w-4" />
//                               </button>
//                             </li>
//                           ))}
//                         </ul>
//                       ) : (
//                           <div className="px-6 py-12 text-center">
//                             <div className="flex justify-center"><Logo size={44} iconOnly /></div>
//                             <h3 className="c-ink mt-4 text-lg font-semibold">No endpoints yet</h3>
//                             <p className="c-mut mt-1 text-sm">Add an endpoint and give your frontend a working response today.</p>
//                             <button type="button" onClick={() => setActiveView("apis")} className="btn btn-pur mt-5"><Plus className="h-4 w-4" /> Create your first API</button>
//                         </div>
//                       )}
//                     </section>
//                   </>
//                 ) : null}

//                 {activeView === "settings" ? (
//                   <section className="max-w-3xl">
//                     <h1 className="c-ink text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1] tracking-[-0.045em]">Settings</h1>
//                     <p className="c-mut mt-3 text-lg">Manage your profile, project key and data.</p>

//                     <div className="card mt-8 flex items-center gap-4 p-5">
//                       <span className="avatar h-12 w-12 text-lg">{authUser.name.trim().slice(0, 1).toUpperCase() || "P"}</span>
//                       <div className="min-w-0">
//                         <h2 className="c-ink text-base font-semibold">{authUser.name}</h2>
//                         <p className="c-zinc mt-0.5 truncate text-sm">{authUser.email}</p>
//                       </div>
//                       <span className="pill ml-auto">Profile</span>
//                     </div>

//                     <div className="card mt-4 p-5">
//                       <div className="flex items-start justify-between gap-4">
//                         <div>
//                           <h2 className="c-ink text-base font-semibold">Project endpoint key</h2>
//                           <p className="c-mut mt-1 text-sm">This public key is part of every mock URL in this project.</p>
//                         </div>
//                         <span className="pill">Public</span>
//                       </div>
//                       <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border p-2 hr" style={{ background: "#fafafa" }}>
//                         <code className="c-mut min-w-0 flex-1 truncate px-2 text-sm">{apiKeyRevealed ? selectedProject.publicKey : `••••••••${selectedProject.publicKey.slice(-6)}`}</code>
//                         <button type="button" className="btn btn-out btn-sm" onClick={() => setApiKeyRevealed((visible) => !visible)}>{apiKeyRevealed ? "Hide" : "Reveal"}</button>
//                         <button type="button" className="ibtn" onClick={() => void copyText(selectedProject.publicKey, "Project key copied")} aria-label="Copy project endpoint key"><Copy className="h-4 w-4" /></button>
//                       </div>
//                     </div>

//                     <div className="card mt-4 p-5">
//                       <h2 className="c-ink text-base font-semibold">Workspace</h2>
//                       <p className="c-mut mt-1 text-sm">{selectedProject.name} · stored in your PostgreSQL database.</p>
//                       <div className="mt-4 flex flex-wrap gap-2">
//                         <button type="button" onClick={() => void handleExportProject()} className="btn btn-out btn-sm">Export workspace</button>
//                         <label className="btn btn-out btn-sm cursor-pointer">Import APIs<input type="file" accept="application/json,.json" onChange={handleImportFile} className="sr-only" /></label>
//                       </div>
//                     </div>

//                     <div className="card mt-4 p-5">
//                       <h2 className="c-ink text-base font-semibold">Change history</h2>
//                       <p className="c-mut mt-1 text-sm">Recent changes to this workspace.</p>
//                       <div className="mt-3">
//                         {auditEvents.length ? auditEvents.map((event) => (
//                           <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 hr">
//                             <div>
//                               <p className="c-ink text-sm">{event.summary}</p>
//                               <p className="c-zinc mt-0.5 text-xs">{event.actor?.name ?? "You"} · {event.action}</p>
//                             </div>
//                             <time className="c-zinc mono text-xs">{new Date(event.createdAt).toLocaleString()}</time>
//                           </div>
//                         )) : <p className="c-zinc border-t py-4 text-sm hr">No changes recorded yet.</p>}
//                       </div>
//                     </div>
//                   </section>
//                 ) : null}

//                 {activeView === "apis" ? (
//                   <>
//                     <section>
//                       <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
//                         <div>
//                           <p className="c-zinc mono text-sm">{selectedProject.name}</p>
//                           <h1 className="c-ink mt-2 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1] tracking-[-0.045em]">APIs</h1>
//                         </div>
//                         <div className="flex flex-wrap items-center gap-2">
//                           <label className="relative">
//                             <Search className="c-zinc pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
//                             <input value={apiSearch} onChange={(event) => setApiSearch(event.target.value)} placeholder="Search APIs" aria-label="Search APIs" className="field field-sm !w-full !pl-9 sm:!w-56" />
//                           </label>
//                           <select aria-label="Filter APIs by method" value={apiMethodFilter} onChange={(event) => setApiMethodFilter(event.target.value)} className="field field-sm"><option value="all">All methods</option>{["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => <option key={method} value={method}>{method}</option>)}</select>
//                           <select aria-label="Sort APIs" value={apiSort} onChange={(event) => setApiSort(event.target.value)} className="field field-sm"><option value="recent">Recently added</option><option value="name">Name</option><option value="method">Method</option><option value="status">Status code</option></select>
//                           <button type="button" onClick={() => { setEditingApiId(null); setApiForm(defaultApiForm); document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="btn btn-pur btn-sm"><Plus className="h-3.5 w-3.5" /> Create API</button>
//                         </div>
//                       </div>

//                       <div className="card card-shadow mt-6 overflow-hidden">
//                         {visibleApis.map((api) => (
//                           <button
//                             key={api.id}
//                             type="button"
//                             onClick={() => selectApi(api.id)}
//                             className={`row grid w-full grid-cols-[64px_minmax(0,1fr)_56px] items-center gap-3 border-b bg-transparent px-6 py-4 text-left last:border-b-0 hr ${selectedApi?.id === api.id ? "on" : ""}`}
//                           >
//                             <span className={`badge ${methodClass(api.method)}`}>{api.method}</span>
//                             <span className="c-ink mono min-w-0 truncate text-sm">{api.path}<span className="c-zinc ml-3 font-sans text-xs">{api.name}</span></span>
//                             <span className={`pill justify-center ${statusClass(api.statusCode)}`}>{api.statusCode}</span>
//                           </button>
//                         ))}
//                         {!visibleApis.length ? <p className="c-zinc px-6 py-10 text-center text-sm">{selectedProject.mockApis.length ? "No APIs match that search." : "No APIs yet. Create your first endpoint below."}</p> : null}
//                       </div>
//                     </section>

//                     <section className="grid min-w-0 scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" id="create-api-form">
//                       <form onSubmit={handleCreateApi} className="card min-w-0 p-5 sm:p-7">
//                         <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
//                           <h2 className="c-ink flex flex-wrap items-center gap-3 text-2xl font-bold tracking-[-0.03em]">
//                             {editingApiId ? "Edit API" : "Create API"}
//                             {editingApiId ? <span className={`pill ${apiJsonError ? "s-err" : "s-ok"}`}>{apiJsonError ? "Fix JSON to save" : hasUnsavedApiChanges ? "Saving changes…" : "Saved automatically"}</span> : null}
//                           </h2>
//                           <Settings2 className="c-zinc h-4 w-4" />
//                         </div>

//                         <div className="grid gap-4 md:grid-cols-2">
//                           <label className="lbl">API name
//                             <input value={apiForm.name} onChange={(event) => setApiForm((current) => ({ ...current, name: event.target.value }))} aria-label="API name" className="field" placeholder="Users list" />
//                           </label>
//                           <label className="lbl">Method
//                             <select value={apiForm.method} onChange={(event) => setApiForm((current) => ({ ...current, method: event.target.value }))} aria-label="HTTP method" className="field">
//                               {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => <option key={method} value={method}>{method}</option>)}
//                             </select>
//                           </label>
//                           <label className="lbl md:col-span-2">Path
//                             <input value={apiForm.path} onChange={(event) => setApiForm((current) => ({ ...current, path: event.target.value }))} aria-label="API path" className="field field-mono" placeholder="/users or /users/:id" />
//                           </label>
//                           <label className="lbl">Status code
//                             <select value={apiForm.statusCode} onChange={(event) => setApiForm((current) => ({ ...current, statusCode: Number(event.target.value) }))} aria-label="Response status code" className="field">
//                               {!responseStatusOptions.some(([status]) => status === apiForm.statusCode) ? <option value={apiForm.statusCode}>{apiForm.statusCode} · Custom</option> : null}
//                               {responseStatusOptions.map(([status, label]) => <option key={status} value={status}>{status} · {label}</option>)}
//                             </select>
//                           </label>
//                           <label className="lbl">Delay (ms)
//                             <input type="number" min={0} max={60000} value={apiForm.delayMs} onChange={(event) => setApiForm((current) => ({ ...current, delayMs: Math.min(60000, Math.max(0, Math.floor(Number(event.target.value) || 0))) }))} aria-label="Simulated response delay in milliseconds" className="field field-mono" />
//                           </label>
//                           <label className="lbl">Response items
//                             <select
//                               value={customCount ? "custom" : String(apiForm.generationCount ?? 20)}
//                               onChange={(event) => { const current = apiForm.generationCount ?? 20; const value = event.target.value === "custom" ? (PRESET_COUNTS.includes(current) ? 30 : current) : Number(event.target.value); setApiForm((form) => ({ ...form, generationCount: value })); }}
//                               aria-label="Number of generated response items"
//                               className="field"
//                             >
//                               {PRESET_COUNTS.map((count) => <option key={count} value={count}>{count} items</option>)}
//                               <option value="custom">Custom…</option>
//                             </select>
//                           </label>
//                           {customCount ? (
//                             <label className="lbl">Custom item count
//                               <input type="number" min={1} max={1000} value={apiForm.generationCount ?? 20} onChange={(event) => setApiForm((current) => ({ ...current, generationCount: Math.min(1000, Math.max(1, Number(event.target.value) || 1)) }))} aria-label="Custom response item count" className="field field-mono" />
//                             </label>
//                           ) : null}
//                           <div className="md:col-span-2">
//                             <div className="flex flex-wrap items-center justify-between gap-2">
//                               <label htmlFor="api-body" className="lbl">Response body (JSON)</label>
//                               <span className="flex flex-wrap items-center gap-4">
//                                 <span className={`text-xs font-semibold ${apiJsonError ? "c-err" : "c-ok"}`}>{apiJsonError ? "Invalid JSON" : "Valid JSON"}</span>
//                                 <button type="button" disabled={Boolean(apiJsonError)} onClick={() => setApiForm((current) => ({ ...current, responseBody: JSON.stringify(JSON.parse(current.responseBody), null, 2) }))} className="tlink">Format</button>
//                                 <button type="button" disabled={Boolean(apiJsonError)} onClick={handleGenerateFromReference} className="tlink !text-[#7C3AED]">Generate records</button>
//                               </span>
//                             </div>
//                             <textarea id="api-body" value={apiForm.responseBody} onChange={(event) => setApiForm((current) => ({ ...current, responseBody: event.target.value }))} aria-label="JSON response body" className="field" rows={10} spellCheck={false} placeholder={'{"success": true}'} />
//                           </div>
//                         </div>

//                         <div className="mt-6 flex items-center justify-between gap-3">
//                           {editingApiId ? <p className="c-zinc text-sm">Changes update this endpoint automatically.</p> : <span />}
//                           {!editingApiId ? <button type="submit" className="btn btn-pur" disabled={pendingAction !== null || Boolean(apiJsonError)}><Plus className="h-4 w-4" />Create API</button> : null}
//                         </div>
//                       </form>

//                       <div className="min-w-0 space-y-5">
//                         <section className="dark-panel">
//                           <div className="dark-bar">
//                             <div className="flex items-center gap-2.5 text-sm">
//                               <span className="dot" style={{ background: apiJsonError ? "#fb7185" : "#a78bfa" }} />
//                               <span className="c-soft mono">Live response preview</span>
//                             </div>
//                             <span className="mono rounded-md px-2 py-1 text-xs font-bold" style={{ background: apiForm.statusCode >= 400 ? "rgba(251,113,133,.16)" : "rgba(167,139,250,.18)", color: apiForm.statusCode >= 400 ? "#fda4af" : "#c4b5fd" }}>
//                               {apiForm.statusCode} {apiForm.statusCode < 300 ? "OK" : apiForm.statusCode < 400 ? "Redirect" : apiForm.statusCode < 500 ? "Client error" : "Server error"}
//                             </span>
//                           </div>
//                           <div className="mono flex items-center justify-between px-5 pt-4 text-xs" style={{ color: "#a1a1aa" }}>
//                             <span>application/json · {apiForm.generationCount ?? 20} items</span>
//                             <span>{apiForm.delayMs} ms delay</span>
//                           </div>
//                           {apiJsonError ? (
//                             <div role="alert" className="m-5 rounded-2xl p-4 text-sm" style={{ background: "rgba(251,113,133,.12)", color: "#fda4af", border: "1px solid rgba(251,113,133,.3)" }}>
//                               <p className="font-semibold">Invalid JSON</p>
//                               <p className="mt-1">{apiJsonError}</p>
//                               <p className="mt-1 opacity-80">Fix the response body before creating this API.</p>
//                             </div>
//                           ) : (
//                               <pre className="max-h-96 min-h-40">{formatJsonString(apiForm.responseBody)}</pre>
//                           )}
//                         </section>

//                         {selectedApi ? (
//                           <section className="card card-shadow overflow-hidden">
//                             <div className="flex min-w-0 items-center gap-3 border-b p-3 hr sm:p-4" style={{ background: "#fafafa" }}>
//                               <span className={`badge ${methodClass(selectedApi.method)} shrink-0`}>{selectedApi.method}</span>
//                               <code className="c-mut min-w-0 flex-1 truncate text-xs sm:text-sm">{endpointFor(selectedApi)}</code>
//                               <button type="button" onClick={() => void copyText(endpointFor(selectedApi), "Endpoint copied")} className="ibtn shrink-0" aria-label="Copy endpoint">{copied ? <Check className="c-ok h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
//                               <button type="button" onClick={handleTestEndpoint} disabled={pendingAction !== null} className="btn btn-pur btn-sm shrink-0">
//                                 {pendingAction === "test" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
//                                 {pendingAction === "test" ? "Sending…" : "Send"}
//                               </button>
//                             </div>
//                             <div className="flex flex-wrap items-center gap-2 p-4">
//                               <button type="button" onClick={() => { setEditingApiId(selectedApi.id); setApiForm({ name: selectedApi.name, method: selectedApi.method, path: selectedApi.path, statusCode: selectedApi.statusCode, responseBody: selectedApi.responseBody, responseHeaders: selectedApi.responseHeaders, delayMs: selectedApi.delayMs, enabled: true, generationCount: selectedApi.generationCount ?? 20, description: selectedApi.description ?? "" }); document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="btn btn-out btn-sm">Edit API</button>
//                               <button type="button" onClick={() => handleDeleteApi(selectedApi.id)} className="btn btn-danger btn-sm"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
//                             </div>
//                             {apiResponse ? (
//                               <div className="border-t px-4 pb-4 pt-3 hr">
//                                 <div className="mb-2 flex items-center justify-between text-sm">
//                                   <span className="c-mut font-semibold">Last response</span>
//                                   <span className={`mono text-xs font-bold ${statusTextClass(apiResponse.status)}`}>{apiResponse.status} · {apiResponse.elapsedMs} ms</span>
//                                 </div>
//                                 <pre className="light-pre max-h-52 whitespace-pre-wrap break-words">{apiResponse.body}</pre>
//                                 <details className="mt-3">
//                                   <summary className="tlink cursor-pointer">Response headers</summary>
//                                   <pre className="light-pre mt-2 max-h-32">{JSON.stringify(apiResponse.headers, null, 2)}</pre>
//                                 </details>
//                               </div>
//                             ) : null}
//                           </section>
//                         ) : (
//                             <div className="card c-mut p-6 text-sm" style={{ borderStyle: "dashed" }}>Create an API, then test its endpoint here.</div>
//                         )}
//                       </div>
//                     </section>
//                   </>
//                 ) : null}
//               </>
//             ) : bootstrapped ? (
//               <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
//                 <Logo size={56} iconOnly />
//                 <h2 className="c-ink mt-6 text-4xl font-bold leading-[1] tracking-[-0.045em]">Create your first API</h2>
//                 <p className="c-mut mt-4 leading-7">Define an endpoint and give your frontend a working response.</p>
//                 <button type="button" onClick={() => void openApiCreator()} disabled={pendingAction !== null} className="btn btn-pur mt-7"><Plus className="h-4 w-4" /> Create API</button>
//               </div>
//             ) : (
//                   <div role="status" className="card p-6">
//                     <div className="flex items-center gap-3">
//                       <LoaderCircle className="c-vio h-4 w-4 animate-spin" />
//                       <div>
//                         <h2 className="c-ink text-sm font-semibold">Loading your workspace</h2>
//                         <p className="c-zinc mt-0.5 text-xs">Preparing your projects and API endpoints…</p>
//                       </div>
//                     </div>
//                     <div className="mt-5 space-y-2" aria-hidden="true">
//                       <div className="b-gray h-3 w-2/5 animate-pulse rounded" />
//                       <div className="b-gray h-10 animate-pulse rounded-xl" />
//                       <div className="b-gray h-10 animate-pulse rounded-xl" />
//                     </div>
//                   </div>
//             )}
//           </main>
//         </div>

//         {paletteOpen ? (
//           <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" style={{ background: "rgba(10,10,15,.5)" }} onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
//             <section role="dialog" aria-modal="true" aria-label="Command menu" className="card w-full max-w-xl overflow-hidden" style={{ boxShadow: "0 40px 100px -30px rgba(10,10,15,.55)" }}>
//               <div className="flex items-center gap-3 border-b px-5 hr">
//                 <Search className="c-zinc h-4 w-4 shrink-0" />
//                 <input
//                   autoFocus
//                   value={paletteQuery}
//                   onChange={(event) => { setPaletteQuery(event.target.value); setPaletteSelectedIndex(0); }}
//                   placeholder="Search or jump to…"
//                   aria-label="Search commands"
//                   className="c-ink h-14 min-w-0 flex-1 border-0 bg-transparent text-base outline-none"
//                 />
//                 <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close command menu" className="ibtn"><X className="h-4 w-4" /></button>
//               </div>
//               <div className="max-h-[50vh] overflow-y-auto p-2">
//                 {filteredCommands.map(([label, view, Icon], index) => (
//                   <button
//                     key={view}
//                     type="button"
//                     onClick={() => {
//                       if (label === "Create API") void openApiCreator();
//                       else setActiveView(view);
//                       setPaletteOpen(false);
//                       setPaletteQuery("");
//                       setPaletteSelectedIndex(0);
//                     }}
//                     className={`row flex w-full items-center gap-3 rounded-xl bg-transparent px-3 py-3 text-left text-sm font-medium ${index === paletteSelectedIndex ? "on" : ""}`}
//                   >
//                     <Icon className="c-zinc h-4 w-4" />
//                     <span className="c-ink flex-1">{label}</span>
//                     {view === "apis" ? <span className="c-zinc text-xs">New endpoint</span> : null}
//                   </button>
//                 ))}
//                 {!filteredCommands.length ? <p className="c-zinc px-3 py-6 text-center text-sm">No matching actions.</p> : null}
//               </div>
//               <div className="c-zinc flex items-center gap-4 border-t px-5 py-3 text-xs hr"><span><kbd>↑↓</kbd> Navigate</span><span><kbd>Enter</kbd> Select</span><span><kbd>Esc</kbd> Close</span><Command className="ml-auto h-3.5 w-3.5" /></div>
//             </section>
//           </div>
//         ) : null}

//         {toast ? (
//           <div role="status" className="b-ink c-white fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ boxShadow: "0 20px 50px -20px rgba(10,10,15,.6)" }}>
//             <Check className="h-4 w-4" style={{ color: "#c4b5fd" }} />{toast}
//           </div>
//         ) : null}
//       </div>
//     </Root>
//   );
// }


"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Command,
  Copy,
  Code2,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  PanelLeftClose,
  Play,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--f-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono" });

/* Same approach as the landing page: every color lives under .pxl with
   !important so legacy rules in globals.css cannot override the design. */
const css = `
.pxl{background:#fff!important;color:#0A0A0F!important;color-scheme:light;font-family:var(--f-sans),system-ui,sans-serif}
.pxl a{text-decoration:none!important}
.pxl button{font:inherit;border:0;cursor:pointer}
.pxl button:disabled{cursor:not-allowed;opacity:.55}
.pxl .c-ink{color:#0A0A0F!important}.pxl .c-white{color:#fff!important}.pxl .c-mut{color:#52525b!important}
.pxl .c-zinc{color:#71717a!important}.pxl .c-soft{color:#d4d4d8!important}.pxl .c-vio{color:#7C3AED!important}
.pxl .c-err{color:#e11d48!important}.pxl .c-ok{color:#6d28d9!important}
.pxl .b-ink{background:#0A0A0F!important}.pxl .b-white{background:#fff!important}.pxl .b-gray{background:#f4f4f5!important}

/* buttons */
.pxl .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:999px;padding:.75rem 1.4rem;font-weight:600;font-size:.9rem;border:1px solid transparent;transition:background .15s,border-color .15s}
.pxl .btn-sm{padding:.45rem .95rem;font-size:.8rem}
.pxl .btn-pur{background:#7C3AED!important;color:#fff!important;box-shadow:0 14px 40px -14px rgba(124,58,237,.8)}
.pxl .btn-pur:hover:not(:disabled){background:#6D28D9!important}
.pxl .btn-ink{background:#0A0A0F!important;color:#fff!important}
.pxl .btn-ink:hover:not(:disabled){background:#3f3f46!important}
.pxl .btn-out{background:#fff!important;color:#0A0A0F!important;border-color:#d4d4d8!important}
.pxl .btn-out:hover:not(:disabled){border-color:#0A0A0F!important}
.pxl .btn-danger{background:#fff!important;color:#e11d48!important;border-color:#fecdd3!important}
.pxl .btn-danger:hover:not(:disabled){background:#fff1f2!important;border-color:#e11d48!important}
.pxl .ibtn{display:inline-flex;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:999px;background:transparent!important;color:#52525b!important}
.pxl .ibtn:hover{background:#f4f4f5!important;color:#0A0A0F!important}
.pxl .tlink{background:transparent!important;color:#52525b!important;font-size:.8rem;font-weight:600}
.pxl .tlink:hover:not(:disabled){color:#7C3AED!important}

/* surfaces */
.pxl .card{background:#fff!important;border:1px solid #e4e4e7;border-radius:24px}
.pxl .card-shadow{box-shadow:0 30px 80px -50px rgba(10,10,15,.35)}
.pxl .card-gray{background:#f4f4f5!important;border-radius:24px}
.pxl .hr{border-color:#e4e4e7!important}
.pxl .row:hover{background:#fafafa!important}
.pxl .row.on{background:#f5f3ff!important}

/* forms */
.pxl .lbl{display:block;font-size:.8rem;font-weight:600;color:#52525b!important}
.pxl .field{display:block;width:100%;margin-top:.4rem;background:#fff!important;color:#0A0A0F!important;border:1px solid #d4d4d8;border-radius:.75rem;padding:.65rem .85rem;font-size:.9rem;outline:none;transition:border-color .15s,box-shadow .15s}
.pxl .field::placeholder{color:#a1a1aa}
.pxl .field:focus{border-color:#7C3AED;box-shadow:0 0 0 4px rgba(124,58,237,.14)}
.pxl .field-sm{margin-top:0;padding:.5rem .75rem;font-size:.8rem;border-radius:999px;width:auto}
.pxl .field-mono,.pxl textarea.field{font-family:var(--f-mono),ui-monospace,monospace}
.pxl textarea.field{font-size:.8rem;line-height:1.7;resize:vertical}

/* badges (the network-tab language) */
.pxl .badge{display:inline-block;background:#0A0A0F!important;color:#fff!important;border-radius:.5rem;padding:.2rem .6rem;font-family:var(--f-mono),monospace;font-size:.75rem;font-weight:700;text-align:center}
.pxl .m-get{background:#7C3AED!important}
.pxl .m-delete{background:#e11d48!important}
.pxl .m-put,.pxl .m-patch{background:#3f3f46!important}
.pxl .pill{display:inline-flex;align-items:center;border-radius:999px;padding:.2rem .7rem;font-family:var(--f-mono),monospace;font-size:.72rem;font-weight:600;background:#f4f4f5!important;color:#52525b!important}
.pxl .s-ok{background:#f5f3ff!important;color:#6d28d9!important}
.pxl .s-info{background:#f4f4f5!important;color:#52525b!important}
.pxl .s-warn,.pxl .s-err{background:#fff1f2!important;color:#e11d48!important}
.pxl .t-ok{color:#6d28d9!important}.pxl .t-info{color:#52525b!important}.pxl .t-warn,.pxl .t-err{color:#e11d48!important}
.pxl .mono{font-family:var(--f-mono),ui-monospace,monospace}
.pxl kbd{font-family:var(--f-mono),monospace;font-size:.7rem;border:1px solid #d4d4d8;border-radius:.4rem;padding:.1rem .4rem;color:#71717a!important}

/* dark code panels */
.pxl .dark-panel{background:#0A0A0F!important;border-radius:24px;overflow:hidden;box-shadow:0 40px 80px -40px rgba(10,10,15,.45)}
.pxl .dark-bar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.8rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.12)}
.pxl pre,.pxl code{background:transparent!important;font-family:var(--f-mono),ui-monospace,monospace}
.pxl .dark-panel pre{color:#e4e4e7!important;font-size:.8rem;line-height:1.75;padding:1.1rem 1.25rem;overflow:auto;margin:0}
.pxl .light-pre{background:#fafafa!important;color:#3f3f46!important;border:1px solid #e4e4e7;border-radius:.9rem;padding:.9rem 1rem;font-size:.78rem;line-height:1.7;overflow:auto}
.pxl .err-box{background:#fff1f2!important;border:1px solid #fecdd3;color:#be123c!important;border-radius:.9rem;padding:.8rem 1rem;font-size:.85rem}
.pxl .dot{display:inline-block;width:.5rem;height:.5rem;border-radius:999px}

/* custom select (rounded menu aligned to the field) */
.pxl .sel{position:relative;display:block}
.pxl .sel-sm{display:inline-block}
.pxl .sel-btn{display:flex;align-items:center;justify-content:space-between;gap:.6rem;text-align:left;cursor:pointer}
.pxl .sel-btn svg{flex-shrink:0;color:#71717a;transition:transform .15s}
.pxl .sel-btn[aria-expanded=true]{border-color:#7C3AED;box-shadow:0 0 0 4px rgba(124,58,237,.14)}
.pxl .sel-btn[aria-expanded=true] svg{transform:rotate(180deg)}
.pxl .sel-menu{position:absolute;left:0;right:0;top:calc(100% + .4rem);z-index:50;max-height:15rem;overflow:auto;margin:0;padding:.35rem;list-style:none;background:#fff!important;border:1px solid #e4e4e7;border-radius:1rem;box-shadow:0 30px 60px -30px rgba(10,10,15,.4)}
.pxl .sel-sm .sel-menu{right:auto;min-width:100%;width:max-content;max-width:16rem}
.pxl .sel-opt{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.55rem .75rem;border-radius:.7rem;font-size:.85rem;cursor:pointer;color:#0A0A0F!important;white-space:nowrap}
.pxl .sel-opt.act{background:#f4f4f5!important}
.pxl .sel-opt[aria-selected=true]{color:#6d28d9!important;font-weight:600}

/* response panel (dark) */
.pxl .tab{background:transparent!important;color:#a1a1aa!important;border-radius:.4rem;padding:.3rem .8rem;font-family:var(--f-mono),monospace;font-size:.75rem;font-weight:600}
.pxl .tab:hover{color:#fff!important}
.pxl .tab.on{background:#fff!important;color:#0A0A0F!important}
.pxl .dark-panel .ibtn{color:#a1a1aa!important}
.pxl .dark-panel .ibtn:hover{background:rgba(255,255,255,.1)!important;color:#fff!important}
.pxl .btn-dark{background:transparent!important;color:#e4e4e7!important;border-color:rgba(255,255,255,.22)!important}
.pxl .btn-dark:hover{border-color:#fff!important}
.pxl .btn-dark-danger{background:transparent!important;color:#fda4af!important;border-color:rgba(251,113,133,.4)!important}
.pxl .btn-dark-danger:hover{background:rgba(251,113,133,.12)!important}
.pxl .dark-details summary{cursor:pointer;padding:.75rem 1.25rem;font-size:.78rem;font-weight:600;color:#a1a1aa!important;border-top:1px solid rgba(255,255,255,.12)}
.pxl .dark-details summary:hover{color:#fff!important}
.pxl .dark-details pre{color:#a1a1aa!important;font-size:.75rem;padding-top:0}

/* shell */
.pxl .shell{display:grid;grid-template-columns:268px minmax(0,1fr);min-height:100vh}
.pxl .shell.col{grid-template-columns:84px minmax(0,1fr)}
.pxl .side{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;gap:1.5rem;padding:1.25rem 1rem;background:#fff!important;border-right:1px solid #e4e4e7;z-index:40}
.pxl .nav-btn{display:flex;align-items:center;gap:.75rem;width:100%;padding:.7rem .9rem;border-radius:999px;font-size:.9rem;font-weight:600;background:transparent!important;color:#52525b!important;text-align:left}
.pxl .nav-btn:hover{background:#f4f4f5!important;color:#0A0A0F!important}
.pxl .nav-btn.on{background:#0A0A0F!important;color:#fff!important}
.pxl .nav-btn.on svg{color:#c4b5fd!important}
.pxl .profile{display:flex;align-items:center;gap:.7rem;width:100%;padding:.55rem;border-radius:1rem;background:transparent!important;text-align:left;color:#0A0A0F!important}
.pxl .profile:hover{background:#f4f4f5!important}
.pxl .avatar{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:2.25rem;height:2.25rem;border-radius:.8rem;background:#7C3AED!important;color:#fff!important;font-weight:700}
.pxl .menu{background:#fff!important;border:1px solid #e4e4e7;border-radius:1rem;box-shadow:0 30px 60px -30px rgba(10,10,15,.4);padding:.4rem;z-index:60}
.pxl .menu button,.pxl .menu a{display:block;width:100%;text-align:left;padding:.55rem .75rem;border-radius:.6rem;font-size:.85rem;background:transparent!important;color:#0A0A0F!important}
.pxl .menu button:hover,.pxl .menu a:hover{background:#f4f4f5!important}
.pxl .topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:.75rem;min-height:4.25rem;padding:0 1.25rem;background:rgba(255,255,255,.88)!important;backdrop-filter:blur(12px);border-bottom:1px solid #e4e4e7}
.pxl .only-mobile{display:none}
.pxl .backdrop{position:fixed;inset:0;background:rgba(10,10,15,.45);z-index:35;border:0}
.pxl .shell.col .side .nav-label,.pxl .shell.col .side .profile-text,.pxl .shell.col .side .brand-full{display:none}
.pxl .shell.col .side .brand-icon{display:inline-flex}
.pxl .side .brand-icon{display:none}
.pxl .shell.col .side .nav-btn{justify-content:center;padding:.7rem}
.pxl .shell.col .side .brand-row{flex-direction:column;gap:.75rem}
.pxl .shell.col .side .collapse svg{transform:rotate(180deg)}
@media(max-width:1023px){
  .pxl .shell,.pxl .shell.col{grid-template-columns:minmax(0,1fr)}
  .pxl .side{position:fixed;left:0;top:0;width:288px;transform:translateX(-102%);transition:transform .2s}
  .pxl .side.open{transform:none}
  .pxl .shell.col .side .nav-label,.pxl .shell.col .side .profile-text,.pxl .shell.col .side .brand-full{display:initial}
  .pxl .shell.col .side .brand-icon{display:none}
  .pxl .shell.col .side .nav-btn{justify-content:flex-start;padding:.7rem .9rem}
  .pxl .only-mobile{display:inline-flex}
  .pxl .only-desktop{display:none!important}
}
@media(prefers-reduced-motion:reduce){.pxl *{transition:none!important}}
`;

function Logo({ size = 34, iconOnly = false }: { size?: number; iconOnly?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="18" fill="#7C3AED" />
        <path d="M22 47V17h11a10 10 0 0 1 0 20H22" fill="none" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="45" cy="46" r="5" fill="#0A0A0F" stroke="#fff" strokeWidth="3" />
      </svg>
      {iconOnly ? null : (
        <span className="text-[22px] font-bold tracking-tight" style={{ color: "#0A0A0F" }}>
          preapix
        </span>
      )}
    </span>
  );
}

function Root({ children }: { children: React.ReactNode }) {
  return (
    <div className={`pxl ${sans.variable} ${mono.variable} min-h-screen antialiased`} style={{ overflowX: "clip" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </div>
  );
}

type SelectOption<T extends string | number> = { value: T; label: string };

function Select<T extends string | number>({ value, onChange, options, label, small = false }: { value: T; onChange: (value: T) => void; options: SelectOption<T>[]; label: string; small?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openMenu = () => { setActive(Math.max(0, options.findIndex((option) => option.value === value))); setOpen(true); };
  const choose = (option: SelectOption<T>) => { onChange(option.value); setOpen(false); };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { if (open) { event.stopPropagation(); setOpen(false); } return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) { openMenu(); return; }
      setActive((index) => (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
    }
    if ((event.key === "Enter" || event.key === " ") && open) { event.preventDefault(); choose(options[active]); }
  };

  return (
    <div ref={ref} className={`sel ${small ? "sel-sm" : ""}`}>
      <button type="button" className={`field sel-btn ${small ? "field-sm" : ""}`} aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => (open ? setOpen(false) : openMenu())} onKeyDown={onKeyDown}>
        <span className="truncate">{current?.label ?? String(value)}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <ul role="listbox" aria-label={label} className="sel-menu">
          {options.map((option, index) => (
            <li key={String(option.value)} role="option" aria-selected={option.value === value} className={`sel-opt ${index === active ? "act" : ""}`} onMouseEnter={() => setActive(index)} onClick={() => choose(option)}>
              <span>{option.label}</span>
              {option.value === value ? <Check className="h-4 w-4" /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type RequestLog = {
  id: string;
  method: string;
  path: string;
  statusCode: number;
  requestHeaders?: string | null;
  queryParams?: string | null;
  requestBody?: string | null;
  responseHeaders?: string | null;
  responseBody?: string | null;
  responseTimeMs?: number | null;
  createdAt: string;
};

type MockApi = {
  id: string;
  name: string;
  description?: string | null;
  method: string;
  path: string;
  statusCode: number;
  responseBody: string;
  responseHeaders: string;
  delayMs: number;
  enabled: boolean;
  generationCount?: number;
  requestLogs: RequestLog[];
};

type Project = {
  id: string;
  name: string;
  description?: string | null;
  publicKey: string;
  mockApis: MockApi[];
};
type AuthUser = { id: string; name: string; email: string };
type AuditEvent = { id: string; summary: string; action: string; createdAt: string; actor: { name: string; email: string } | null };
type DashboardView = "overview" | "apis" | "settings";

type Scenario = { id: string; name: string; description?: string | null; statusCode: number; responseBody: string; responseHeaders: string; delayMs: number; enabled: boolean };
type WorkspaceApi = MockApi & { scenarios: Scenario[] };
type WorkspaceProject = Project & { mockApis: WorkspaceApi[] };
type WorkspaceData = {
  projects: WorkspaceProject[];
  published: Record<string, { slug: string; version: number; publishedAt: string; snapshot: WorkspaceApi }[]>;
  activity: AuditEvent[];
};

const emptyWorkspace = (): WorkspaceData => ({ projects: [], published: {}, activity: [] });
const createId = () => crypto.randomUUID();
const createPublicKey = () => `px_${crypto.randomUUID().replaceAll("-", "")}`;
const currentTimestamp = () => new Date().toISOString();
const toJson = (value: unknown) => JSON.stringify(value, null, 2);

async function readWorkspace(userId: string): Promise<WorkspaceData> {
  void userId;
  const response = await fetch("/api/workspace", { cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Could not load your PostgreSQL workspace.");
  return (payload.workspace as WorkspaceData | undefined) ?? emptyWorkspace();
}

async function updateWorkspace<T>(userId: string, update: (workspace: WorkspaceData) => T): Promise<T> {
  const workspace = await readWorkspace(userId);
  const result = update(workspace);
  const response = await fetch("/api/workspace", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ workspace }) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error ?? "Could not save your PostgreSQL workspace.");
  return result;
}

function normalizeApiPath(value: string) {
  const trimmed = (value ?? "").trim();
  if (!trimmed) return "/";
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return normalized.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

function normalizeResponseHeaders(value: string) {
  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { throw new Error("Response headers must contain valid JSON."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Response headers must be a JSON object.");
  const headers: Record<string, string> = {};
  for (const [name, rawValue] of Object.entries(parsed)) {
    if (!["string", "number", "boolean"].includes(typeof rawValue)) throw new Error(`Header ${name} must have a text or number value.`);
    const headerValue = String(rawValue);
    if (/[\r\n]/.test(headerValue)) throw new Error(`Header ${name} contains an invalid line break.`);
    headers[name] = headerValue;
  }
  try { new Headers(headers); } catch { throw new Error("Response headers contain an invalid header name or value."); }
  return JSON.stringify(headers, null, 2);
}

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

function addActivity(workspace: WorkspaceData, summary: string, action: string) {
  workspace.activity.unshift({ id: createId(), summary, action, createdAt: currentTimestamp(), actor: null });
  workspace.activity = workspace.activity.slice(0, 200);
}

async function loadWorkspaceProjects(userId: string) { return (await readWorkspace(userId)).projects; }
async function listActivity(userId: string) { return (await readWorkspace(userId)).activity.slice(0, 100); }

async function saveProject(userId: string, input: { id?: string; name: string; description?: string }) {
  return updateWorkspace(userId, (workspace) => {
    const name = input.name.trim();
    if (!name) throw new Error("Project name is required.");
    const existing = workspace.projects.find((project) => project.id === input.id);
    if (existing) {
      existing.name = name;
      existing.description = input.description?.trim() || "";
      addActivity(workspace, `Updated project ${name}`, "update");
      return existing;
    }
    const project: WorkspaceProject = { id: createId(), name, description: input.description?.trim() || "", publicKey: createPublicKey(), mockApis: [] };
    workspace.projects.unshift(project);
    addActivity(workspace, `Created project ${name}`, "create");
    return project;
  });
}

async function saveMockApi(userId: string, projectId: string, input: Partial<WorkspaceApi> & Pick<WorkspaceApi, "name" | "method" | "path" | "statusCode" | "responseBody" | "responseHeaders" | "delayMs" | "enabled">) {
  const saved = await updateWorkspace(userId, (workspace) => {
    const project = workspace.projects.find((item) => item.id === projectId);
    if (!project) throw new Error("Project not found.");
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
    JSON.parse(input.responseBody);
    const responseHeaders = normalizeResponseHeaders(input.responseHeaders);
    let api = project.mockApis.find((item) => item.id === input.id);
    if (!api) {
      api = { id: createId(), name, description: input.description?.trim() ?? "", method, path, statusCode: input.statusCode, responseBody: input.responseBody, responseHeaders, delayMs: input.delayMs, enabled: true, generationCount, scenarios: [], requestLogs: [] };
      project.mockApis.unshift(api);
    } else Object.assign(api, { ...input, method, path, name, description: input.description?.trim() ?? "", responseHeaders, enabled: true, generationCount });
    addActivity(workspace, `${input.id ? "Updated" : "Created"} ${method} ${path}`, input.id ? "update" : "create");
    return api;
  });
  return (await loadWorkspaceProjects(userId)).find((project) => project.id === projectId)?.mockApis.find((api) => api.id === saved.id) ?? saved;
}

async function deleteLocalApi(userId: string, projectId: string, apiId: string) {
  return updateWorkspace(userId, (workspace) => {
    const project = workspace.projects.find((item) => item.id === projectId);
    if (!project) return;
    const api = project.mockApis.find((item) => item.id === apiId);
    project.mockApis = project.mockApis.filter((item) => item.id !== apiId);
    delete workspace.published[apiId];
    addActivity(workspace, `Deleted ${api?.method ?? ""} ${api?.path ?? "mock API"}`, "delete");
  });
}

async function saveScenario(userId: string, projectId: string, apiId: string, input: Scenario) {
  return updateWorkspace(userId, (workspace) => {
    const api = workspace.projects.find((project) => project.id === projectId)?.mockApis.find((item) => item.id === apiId);
    if (!api) throw new Error("API not found.");
    const name = input.name.trim();
    if (!name) throw new Error("Scenario name is required.");
    if (api.scenarios.some((scenario) => scenario.id !== input.id && scenario.name.toLowerCase() === name.toLowerCase())) throw new Error(`A scenario named "${name}" already exists for this API.`);
    if (!Number.isInteger(input.statusCode) || input.statusCode < 200 || input.statusCode > 599) throw new Error("Scenario status must be between 200 and 599.");
    if (!Number.isInteger(input.delayMs) || input.delayMs < 0 || input.delayMs > 60_000) throw new Error("Scenario delay must be between 0 and 60,000 ms.");
    JSON.parse(input.responseBody);
    const responseHeaders = normalizeResponseHeaders(input.responseHeaders);
    const existing = api.scenarios.find((scenario) => scenario.id === input.id);
    if (existing) Object.assign(existing, input, { name, responseHeaders });
    else api.scenarios.push({ ...input, name, responseHeaders, id: createId() });
    addActivity(workspace, `${existing ? "Updated" : "Created"} scenario ${name}`, existing ? "update" : "create");
    return existing ?? api.scenarios.at(-1)!;
  });
}

async function importLocalApis(userId: string, projectId: string, payload: unknown) {
  const input = payload as { apis?: Record<string, unknown>[] };
  const entries = Array.isArray(input?.apis) ? input.apis : Array.isArray(payload) ? payload as Record<string, unknown>[] : [];
  let imported = 0;
  for (const entry of entries) {
    try {
      const api = await saveMockApi(userId, projectId, { name: String(entry.name ?? "Imported API"), method: String(entry.method ?? "GET"), path: String(entry.path ?? "/imported"), statusCode: Number(entry.statusCode ?? 200), responseBody: typeof entry.responseBody === "string" ? entry.responseBody : toJson(entry.responseBody ?? {}), responseHeaders: typeof entry.responseHeaders === "string" ? entry.responseHeaders : toJson(entry.responseHeaders ?? { "Content-Type": "application/json" }), delayMs: Number(entry.delayMs ?? 0), enabled: entry.enabled !== false });
      const scenarios = Array.isArray(entry.scenarios) ? entry.scenarios as Scenario[] : [];
      for (const scenario of scenarios) await saveScenario(userId, projectId, api.id, { ...scenario, id: createId() });
      imported += 1;
    } catch { /* Skip invalid entries while importing the rest. */ }
  }
  return imported;
}

async function exportLocalProject(userId: string, projectId: string) {
  const project = (await readWorkspace(userId)).projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found.");
  return { project: project.name, apis: project.mockApis.map((api) => ({ ...api, requestLogs: [] })) };
}

async function runLocalMock(userId: string, projectId: string, apiId: string) {
  const workspace = await readWorkspace(userId);
  const project = workspace.projects.find((item) => item.id === projectId);
  const api = project?.mockApis.find((item) => item.id === apiId);
  if (!project || !api) throw new Error("Select a saved mock endpoint to run it.");
  const url = new URL(`${window.location.origin}/api/mock/${project.publicKey}${api.path}`);
  const started = performance.now();
  const response = await fetch(url, { method: api.method, headers: { Accept: "application/json" } });
  const responseText = await response.text();
  let body: unknown = responseText;
  try { body = JSON.parse(responseText); } catch { /* Keep text responses as text. */ }
  return { status: response.status, headers: Object.fromEntries(response.headers.entries()), body, responseTimeMs: Math.round(performance.now() - started) };
}

function generateFromReference(reference: unknown, itemCount = 20): unknown {
  const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const words = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Quinn", "Reese"];
  const domains = ["example.com", "sample.dev", "mail.test"];
  const visit = (value: unknown, keyName = ""): unknown => {
    const key = keyName.toLowerCase();
    if (Array.isArray(value)) {
      if (value.length && value.every((item) => item && typeof item === "object" && !Array.isArray(item))) return Array.from({ length: itemCount }, (_, index) => visit(value[index % value.length], keyName));
      return value.map((item) => visit(item, keyName));
    }
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, visit(child, childKey)]));
    if (typeof value === "number") return Number.isInteger(value) ? Math.floor(Math.random() * 9000) + 100 : Number((Math.random() * 1000).toFixed(2));
    if (typeof value === "boolean") return Math.random() >= 0.5;
    if (value === null) return null;
    if (typeof value !== "string") return value;
    if (key.includes("email")) return `${pick(words).toLowerCase()}${Math.floor(Math.random() * 90 + 10)}@${pick(domains)}`;
    if (key === "id" || key.endsWith("id")) return /^[0-9]+$/.test(value) ? String(Math.floor(Math.random() * 9000) + 100) : crypto.randomUUID();
    if (key.includes("name")) return `${pick(words)} ${pick(["Parker", "Miller", "Reed", "Carter", "Brooks"])}`;
    if (key.includes("phone")) return `+1${Math.floor(2000000000 + Math.random() * 7000000000)}`;
    if (key.includes("url") || key.includes("website")) return `https://${pick(["sample", "preview", "demo"])}.${pick(domains)}`;
    if (key.includes("date") || key.endsWith("at")) return new Date(Date.now() - Math.floor(Math.random() * 365 * 86400000)).toISOString();
    if (value.startsWith("http")) return `https://${pick(["images.example.com", "cdn.sample.dev"])}/${crypto.randomUUID().slice(0, 8)}.jpg`;
    return pick(["Ready", "Active", "New", "Sample value", "In progress"]);
  };
  return visit(reference);
}

const defaultApiForm = {
  name: "Users list",
  method: "GET",
  path: "/users",
  statusCode: 200,
  responseBody: JSON.stringify({ success: true, data: [{ id: 1, name: "Abhishek", email: "abhishek@example.com" }] }, null, 2),
  responseHeaders: JSON.stringify({ "Content-Type": "application/json" }, null, 2),
  delayMs: 150,
  enabled: true,
  generationCount: 20,
  description: "Returns a list of users",
};
const responseStatusOptions = [
  [200, "OK"], [201, "Created"], [202, "Accepted"], [400, "Bad Request"],
  [401, "Unauthorized"], [403, "Forbidden"], [404, "Not Found"], [405, "Method Not Allowed"],
  [409, "Conflict"], [415, "Unsupported Media Type"], [422, "Unprocessable Entity"],
  [429, "Too Many Requests"], [500, "Internal Server Error"], [502, "Bad Gateway"],
  [503, "Service Unavailable"], [504, "Gateway Timeout"],
] as const;
const commandActions = [
  ["Create API", "apis", Code2],
  ["Open Overview", "overview", LayoutDashboard],
  ["Open Settings", "settings", Settings2],
] as const;

function methodClass(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return "m-get";
    case "POST":
      return "m-post";
    case "PUT":
      return "m-put";
    case "PATCH":
      return "m-patch";
    case "DELETE":
      return "m-delete";
    default:
      return "m-post";
  }
}

function statusClass(status: number) {
  if (status >= 500) return "s-err";
  if (status >= 400) return "s-warn";
  if (status >= 300) return "s-info";
  return "s-ok";
}

function statusTextClass(status: number) {
  if (status >= 500) return "t-err";
  if (status >= 400) return "t-warn";
  if (status >= 300) return "t-info";
  return "t-ok";
}

function formatJsonString(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

const PRESET_COUNTS = [10, 20, 40, 80, 160];

const METHOD_OPTIONS = ["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => ({ value: method, label: method }));
const METHOD_FILTER_OPTIONS = [{ value: "all", label: "All methods" }, ...METHOD_OPTIONS];
const SORT_OPTIONS = [
  { value: "recent", label: "Recently added" },
  { value: "name", label: "Name" },
  { value: "method", label: "Method" },
  { value: "status", label: "Status code" },
];
const darkPill = (status: number) => ({ background: status >= 400 ? "rgba(251,113,133,.16)" : "rgba(167,139,250,.18)", color: status >= 400 ? "#fda4af" : "#c4b5fd" });
const statusLabel = (status: number) => (status < 300 ? "OK" : status < 400 ? "Redirect" : status < 500 ? "Client error" : "Server error");

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [apiForm, setApiForm] = useState(defaultApiForm);
  const apiSaveTimerRef = useRef<number | null>(null);
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [editingApiId, setEditingApiId] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<{ status: number; headers: Record<string, string>; body: string; elapsedMs: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<"api" | "test" | null>(null);
  const [error, setError] = useState<string>("");
  const [bootstrapped, setBootstrapped] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [apiMethodFilter, setApiMethodFilter] = useState("all");
  const [apiSort, setApiSort] = useState("recent");
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarLoaded, setSidebarLoaded] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [projectSwitcherSearch, setProjectSwitcherSearch] = useState("");
  const [apiSearch, setApiSearch] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [databaseConfigured, setDatabaseConfigured] = useState(true);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [panelTab, setPanelTab] = useState<"preview" | "response">("preview");

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  );

  const selectedApi = useMemo(
    () => selectedProject?.mockApis.find((api) => api.id === selectedApiId) ?? selectedProject?.mockApis[0] ?? null,
    [selectedApiId, selectedProject],
  );
  const userDisplayName = authUser?.name.trim().split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") || "there";

  const ensureProjectSelected = useCallback((nextProjects: Project[]) => {
    if (nextProjects.length === 0) {
      setSelectedProjectId("");
      setSelectedApiId("");
      setEditingApiId(null);
      setApiResponse(null);
      return;
    }

    const nextSelection = nextProjects.find((project) => project.id === selectedProjectId) ?? nextProjects[0];
    const nextApiId = nextSelection.mockApis.some((api) => api.id === selectedApiId) ? selectedApiId : nextSelection.mockApis[0]?.id ?? "";
    if (nextSelection.id !== selectedProjectId) { setEditingApiId(null); setApiForm(defaultApiForm); }
    if (nextApiId !== selectedApiId) setApiResponse(null);
    setSelectedProjectId(nextSelection.id);
    setSelectedApiId(nextApiId);
  }, [selectedApiId, selectedProjectId]);

  const selectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setSelectedApiId(project.mockApis[0]?.id ?? "");
    setEditingApiId(null);
    setApiForm(defaultApiForm);
    setApiResponse(null);
  };

  const selectApi = (apiId: string) => {
    setSelectedApiId(apiId);
    setEditingApiId(null);
    setApiForm(defaultApiForm);
    setApiResponse(null);
  };

  const loadProjects = useCallback(async () => {
    try {
      if (!authUser) return;
      const nextProjects = await loadWorkspaceProjects(authUser.id) as Project[];
      setProjects(nextProjects);
      ensureProjectSelected(nextProjects);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load projects.");
      throw loadError;
    }
  }, [authUser, ensureProjectSelected]);

  const openApiCreator = useCallback(async () => {
    setError("");
    if (!selectedProject) {
      if (!authUser) return;
      try {
        setPendingAction("api");
        const workspace = await saveProject(authUser.id, { name: "My APIs" });
        setProjects([workspace as Project]);
        setSelectedProjectId(workspace.id);
        setSelectedApiId("");
        setEditingApiId(null);
        setApiForm(defaultApiForm);
        setApiResponse(null);
      } catch (createError) {
        setError(createError instanceof Error ? createError.message : "Could not prepare your API workspace.");
        return;
      } finally {
        setPendingAction(null);
      }
    }
    setEditingApiId(null);
    setApiForm(defaultApiForm);
    setActiveView("apis");
  }, [authUser, selectedProject]);

  useEffect(() => {
    window.queueMicrotask(() => {
      setSidebarCollapsed(window.localStorage.getItem("preapix-sidebar-collapsed") === "true");
      setSidebarLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (activeView !== "settings" || !selectedProject) return;
    let active = true;
    if (authUser) void listActivity(authUser.id).then((events) => { if (active) setAuditEvents(events); }).catch(() => { if (active) setAuditEvents([]); });
    return () => { active = false; };
  }, [activeView, authUser, selectedProject]);

  useEffect(() => {
    if (!sidebarLoaded) return;
    window.localStorage.setItem("preapix-sidebar-collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed, sidebarLoaded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const matchingCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        setPaletteSelectedIndex(0);
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s" && activeView === "apis") {
        event.preventDefault();
        document.querySelector<HTMLFormElement>("#create-api-form form")?.requestSubmit();
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setUserMenuOpen(false);
        setProjectMenuOpen(false);
        setMobileSidebarOpen(false);
      }
      if (paletteOpen && matchingCommands.length > 0 && event.key === "ArrowDown") {
        event.preventDefault();
        setPaletteSelectedIndex((index) => (index + 1) % matchingCommands.length);
      }
      if (paletteOpen && matchingCommands.length > 0 && event.key === "ArrowUp") {
        event.preventDefault();
        setPaletteSelectedIndex((index) => (index - 1 + matchingCommands.length) % matchingCommands.length);
      }
      if (paletteOpen && event.key === "Enter" && matchingCommands[paletteSelectedIndex]) {
        event.preventDefault();
        const [label, view] = matchingCommands[paletteSelectedIndex];
        if (label === "Create API") void openApiCreator();
        else setActiveView(view);
        setPaletteOpen(false);
        setPaletteQuery("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeView, openApiCreator, paletteOpen, paletteQuery, paletteSelectedIndex, pendingAction]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleApis = useMemo(() => {
    let apis = [...(selectedProject?.mockApis ?? [])];
    const query = apiSearch.trim().toLowerCase();
    apis = apis.filter((api) => (!query || `${api.name} ${api.method} ${api.path}`.toLowerCase().includes(query)) && (apiMethodFilter === "all" || api.method === apiMethodFilter));
    if (apiSort === "name") apis.sort((first, second) => first.name.localeCompare(second.name));
    if (apiSort === "method") apis.sort((first, second) => first.method.localeCompare(second.method) || first.path.localeCompare(second.path));
    if (apiSort === "status") apis.sort((first, second) => first.statusCode - second.statusCode);
    return apis;
  }, [apiMethodFilter, apiSearch, apiSort, selectedProject]);
  const filteredCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));

  const activeApiCount = selectedProject?.mockApis.length ?? 0;
  const apiJsonError = useMemo(() => {
    try {
      JSON.parse(apiForm.responseBody);
    } catch (jsonError) {
      return `Response body: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
    }
    return "";
  }, [apiForm.responseBody]);
  const apiFormBaseline = editingApiId && selectedApi?.id === editingApiId ? {
    name: selectedApi.name,
    method: selectedApi.method,
    path: selectedApi.path,
    statusCode: selectedApi.statusCode,
    responseBody: selectedApi.responseBody,
    responseHeaders: selectedApi.responseHeaders,
    delayMs: selectedApi.delayMs,
    enabled: true,
    generationCount: selectedApi.generationCount ?? 20,
    description: selectedApi.description ?? "",
  } : defaultApiForm;
  const hasUnsavedApiChanges = JSON.stringify(apiForm) !== JSON.stringify(apiFormBaseline);

  useEffect(() => {
    if (apiSaveTimerRef.current !== null) window.clearTimeout(apiSaveTimerRef.current);
    if (!bootstrapped || !authUser || !selectedProject || !selectedApi || !editingApiId || selectedApi.id !== editingApiId || !hasUnsavedApiChanges || apiJsonError) return;
    if (!apiForm.name.trim() || !apiForm.path.trim().startsWith("/") || /[\s?#]/.test(apiForm.path) || !Number.isInteger(apiForm.statusCode) || !Number.isInteger(apiForm.delayMs) || !Number.isInteger(apiForm.generationCount)) return;
    if (selectedProject.mockApis.some((api) => api.id !== editingApiId && api.method === apiForm.method && api.path.toLowerCase() === apiForm.path.trim().toLowerCase())) return;

    const snapshot = { ...apiForm, enabled: true, responseBody: formatJsonString(apiForm.responseBody), responseHeaders: formatJsonString(apiForm.responseHeaders) };
    apiSaveTimerRef.current = window.setTimeout(() => {
      void (async () => {
        setPendingAction("api");
        setError("");
        try {
          await saveMockApi(authUser.id, selectedProject.id, { ...snapshot, id: editingApiId });
          setApiForm((current) => current.responseBody === apiForm.responseBody ? { ...current, responseBody: snapshot.responseBody, responseHeaders: snapshot.responseHeaders, enabled: true } : current);
          await loadProjects();
        } catch (saveError) {
          setError(saveError instanceof Error ? saveError.message : "Could not save API changes.");
        } finally {
          setPendingAction(null);
        }
      })();
    }, 500);

    return () => {
      if (apiSaveTimerRef.current !== null) window.clearTimeout(apiSaveTimerRef.current);
    };
  }, [apiForm, apiJsonError, authUser, bootstrapped, editingApiId, hasUnsavedApiChanges, loadProjects, selectedApi, selectedProject]);

  const copyText = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setToast(message);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Could not copy to clipboard. Check browser permissions and try again.");
    }
  };

  const endpointFor = (api: MockApi) => {
    if (!selectedProject) return "";
    return `${window.location.origin}/api/mock/${selectedProject.publicKey}${api.path}`;
  };

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/me").then(async (response) => {
      const payload = await response.json();
      if (response.status === 503) throw new Error(payload.error ?? "Could not reach PostgreSQL. Check your Layerbase connection and migration.");
      if (!response.ok) throw new Error("Could not check your account. Please try again.");
      return payload;
    }).then((payload) => {
      if (active) {
        setAuthUser(payload.user ?? null);
        setDatabaseConfigured(Boolean(payload.configured));
      }
    }).catch((error) => { if (active) setAuthError(error instanceof Error ? error.message : "Could not connect to the account service. Refresh and try again."); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (bootstrapped) {
      return;
    }
    if (!authUser) return;

    const initializeWorkspace = async () => {
      try {
        await loadProjects();
        setBootstrapped(true);
      } catch {
        // loadProjects already shows the workspace error.
      }
    };

    void initializeWorkspace();
  }, [authUser, bootstrapped, loadProjects]);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAuthBusy(true);
    setAuthError("");
    try {
      const email = String(form.get("email") ?? "").trim();
      const password = String(form.get("password") ?? "");
      const endpoint = authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body = authMode === "register" ? { name: String(form.get("name") ?? "").trim(), email, password } : { email, password };
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json();
      if (!response.ok || !payload.user) throw new Error(payload.error ?? "Could not sign in. Please try again.");
      setAuthUser(payload.user);
      setBootstrapped(false);
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : "Account request failed.");
    } finally { setAuthBusy(false); }
  };

  const handleSignOut = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) { setError("Could not close your session. Check the database connection and try again."); return; }
    setProjects([]);
    setAuthUser(null);
    setBootstrapped(false);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedProject) return;
    try {
      const text = await file.text();
      const imported = await importLocalApis(authUser!.id, selectedProject.id, JSON.parse(text));
      await loadProjects();
      setToast(`${imported} APIs imported`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Could not import this file.");
    } finally { event.target.value = ""; }
  };

  const handleExportProject = async () => {
    if (!authUser || !selectedProject) return;
    try {
      const data = await exportLocalProject(authUser.id, selectedProject.id);
      const blobUrl = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = blobUrl; anchor.download = `${selectedProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-mocks.json`; anchor.click();
      URL.revokeObjectURL(blobUrl);
      setToast("Workspace export downloaded");
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Could not export this workspace.");
    }
  };

  const handleGenerateFromReference = () => {
    try { setApiForm((current) => ({ ...current, responseBody: JSON.stringify(generateFromReference(JSON.parse(current.responseBody), current.generationCount ?? 20), null, 2) })); setToast(`${apiForm.generationCount ?? 20} sample records generated`); }
    catch { setError("Add valid JSON reference data before generating a sample."); }
  };

  const handleCreateApi = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProject) {
      return;
    }
    if (apiJsonError) {
      setError(`Invalid JSON in response body: ${apiJsonError}`);
      return;
    }

    try {
      setPendingAction("api");
      setError("");

      const api = await saveMockApi(authUser!.id, selectedProject.id, { ...apiForm, id: editingApiId ?? undefined, responseBody: formatJsonString(apiForm.responseBody), responseHeaders: formatJsonString(apiForm.responseHeaders) });

      setApiForm(defaultApiForm);
      setEditingApiId(null);
      await loadProjects();
      selectApi(api.id);
      setToast(editingApiId ? "API updated successfully" : "API created successfully");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Mock API creation failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteApi = async (mockApiId: string) => {
    if (!selectedProject) {
      return;
    }
    const api = selectedProject.mockApis.find((item) => item.id === mockApiId);
    if (!window.confirm(`Delete "${api?.name ?? "this API"}" and its response configuration? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteLocalApi(authUser!.id, selectedProject.id, mockApiId);
      await loadProjects();
      setToast("API deleted");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  };

  const handleTestEndpoint = async () => {
    if (!selectedProject || !selectedApi) {
      return;
    }

    try {
      setPendingAction("test");
      const result = await runLocalMock(authUser!.id, selectedProject.id, selectedApi.id);
      setApiResponse({
        status: result.status,
        headers: result.headers,
        body: JSON.stringify(result.body, null, 2),
        elapsedMs: result.responseTimeMs,
      });
      setPanelTab("response");
      await loadProjects();
    } catch (testError) {
      setError(testError instanceof Error ? testError.message : "Endpoint test failed.");
    } finally {
      setPendingAction(null);
    }
  };

  if (authLoading) return (
    <Root>
      <main className="grid min-h-screen place-items-center px-4">
        <div role="status" className="card card-shadow flex items-center gap-3 px-6 py-4 text-sm">
          <LoaderCircle className="c-vio h-4 w-4 animate-spin" />
          <span className="c-mut">Loading your account…</span>
        </div>
      </main>
    </Root>
  );

  if (!databaseConfigured) return (
    <Root>
      <main className="grid min-h-screen place-items-center px-4">
        <section className="card card-shadow w-full max-w-lg p-8">
          <Logo />
          <h1 className="c-ink mt-8 text-3xl font-bold tracking-[-0.04em]">Connect your database</h1>
          <p className="c-mut mt-3 leading-7">Add a server-only PostgreSQL connection URL to your environment, run the migration, then restart the dev server.</p>
          <div className="b-ink mono mt-6 overflow-x-auto whitespace-nowrap rounded-2xl p-4 text-xs leading-6 c-soft">
            DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
          </div>
          <p className="c-zinc mt-4 text-sm">With Layerbase, use the pooled connection URL and keep the password out of browser code and source control.</p>
        </section>
      </main>
    </Root>
  );

  if (!authUser) return (
    <Root>
      <main className="grid min-h-screen place-items-center px-4 py-12">
        <section className="card card-shadow w-full max-w-md p-7 sm:p-9">
          <Link href="/" aria-label="Preapix home"><Logo /></Link>
          <h1 className="c-ink mt-10 text-4xl font-bold leading-[1] tracking-[-0.045em]">
            {authMode === "register" ? "Create your account" : "Sign in to Preapix"}
          </h1>
          <p className="c-mut mt-3 leading-7">
            {authMode === "register" ? "Save your APIs and workspace settings in a private account." : "Pick up where you left off with your mock APIs."}
          </p>
          <form onSubmit={handleAuth} className="mt-7 space-y-4">
            {authMode === "register" ? (
              <label className="lbl">Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} className="field" placeholder="Your name" /></label>
            ) : null}
            <label className="lbl">Email<input name="email" type="email" autoComplete="email" required className="field" placeholder="you@company.com" /></label>
            <label className="lbl">Password<input name="password" type="password" autoComplete={authMode === "register" ? "new-password" : "current-password"} required minLength={authMode === "register" ? 10 : 1} maxLength={200} className="field" placeholder={authMode === "register" ? "At least 10 characters" : "Your password"} /></label>
            {authError ? <p role="alert" className="err-box">{authError}</p> : null}
            <button disabled={authBusy} className="btn btn-pur w-full">
              {authBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {authMode === "register" ? "Create account" : "Sign in"}
            </button>
          </form>
          <p className="c-mut mt-6 text-center text-sm">
            {authMode === "register" ? "Already have an account?" : "New to Preapix?"}
            <button type="button" onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }} className="tlink ml-2 !text-sm">
              {authMode === "register" ? "Sign in" : "Create an account"}
            </button>
          </p>
        </section>
      </main>
    </Root>
  );

  const firstName = userDisplayName.split(" ")[0];
  const customCount = !PRESET_COUNTS.includes(apiForm.generationCount ?? 20);
  const navItems = [
    ["overview", "Overview", LayoutDashboard],
    ["apis", "APIs", Code2],
    ["settings", "Settings", Settings2],
  ] as const;

  return (
    <Root>
      <div className={`shell ${sidebarCollapsed ? "col" : ""}`}>
        {mobileSidebarOpen ? <button type="button" className="backdrop" aria-label="Close navigation" onClick={() => setMobileSidebarOpen(false)} /> : null}

        <aside className={`side ${mobileSidebarOpen ? "open" : ""}`}>
          <div className="brand-row flex items-center justify-between gap-2">
            <Link href="/dashboard" aria-label="Preapix dashboard" onClick={() => setMobileSidebarOpen(false)}>
              <span className="brand-full"><Logo /></span>
              <span className="brand-icon"><Logo iconOnly /></span>
            </Link>
            <button type="button" className="ibtn collapse only-desktop" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}><PanelLeftClose className="h-4 w-4" /></button>
            <button type="button" className="ibtn only-mobile" onClick={() => setMobileSidebarOpen(false)} aria-label="Close navigation"><X className="h-4 w-4" /></button>
          </div>

          <nav aria-label="Workspace navigation" className="flex flex-col gap-1">
            {navItems.map(([view, label, Icon]) => (
              <button
                key={view}
                type="button"
                title={label}
                aria-label={label}
                aria-current={activeView === view ? "page" : undefined}
                onClick={() => { if (view === "apis" && !selectedProject) void openApiCreator(); else setActiveView(view); setMobileSidebarOpen(false); }}
                className={`nav-btn ${activeView === view ? "on" : ""}`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="nav-label">{label}</span>
              </button>
            ))}
          </nav>

          <div className="relative mt-auto">
            {userMenuOpen ? (
              <div className="menu absolute bottom-full left-0 mb-2 min-w-[230px]" role="menu">
                <div className="px-3 py-2">
                  <span className="c-ink block truncate text-sm font-semibold">{authUser.name}</span>
                  <span className="c-zinc block truncate text-xs">{authUser.email}</span>
                </div>
                <button type="button" role="menuitem" onClick={() => { setActiveView("settings"); setUserMenuOpen(false); setMobileSidebarOpen(false); }}>Settings</button>
                <Link role="menuitem" href="/" onClick={() => setUserMenuOpen(false)}>Home</Link>
                <button type="button" role="menuitem" onClick={() => { setUserMenuOpen(false); void handleSignOut(); }}>Sign out</button>
              </div>
            ) : null}
            <button type="button" onClick={() => setUserMenuOpen((open) => !open)} className="profile" aria-label="Open account menu" aria-expanded={userMenuOpen}>
              <span className="avatar">{authUser.name.trim().slice(0, 1).toUpperCase() || "P"}</span>
              <span className="profile-text min-w-0">
                <strong className="block truncate text-sm">{authUser.name}</strong>
                <small className="c-zinc block truncate text-xs">{authUser.email}</small>
              </span>
            </button>
          </div>
        </aside>

        <div className="min-w-0">

          <main className="mx-auto max-w-[1200px] space-y-8 px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
            <div className="only-mobile"><button type="button" className="ibtn" onClick={() => setMobileSidebarOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></button></div>
            {error ? <div role="alert" className="err-box">{error}</div> : null}

            {selectedProject ? (
              <>
                {activeView === "overview" ? (
                  <>
                    <section>
                      <h1 className="c-ink max-w-[16ch] text-[clamp(2.4rem,5.5vw,4.4rem)] font-bold leading-[.98] tracking-[-0.05em]">
                        Good to see you, {firstName}.
                      </h1>
                      <p className="c-mut mt-4 max-w-[48ch] text-lg leading-8">Here’s what’s happening in {selectedProject.name}.</p>
                    </section>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <article className="card p-6">
                        <div className="flex items-center justify-between"><span className="c-mut text-sm font-semibold">Endpoints</span><Code2 className="c-vio h-4 w-4" /></div>
                        <div className="mt-4 flex items-baseline gap-3">
                          <strong className="c-ink mono text-5xl font-bold tracking-tight">{selectedProject.mockApis.length || "—"}</strong>
                          <span className="pill s-ok">{activeApiCount} active</span>
                        </div>
                      </article>
                      <article className="card p-6">
                        <div className="flex items-center justify-between"><span className="c-mut text-sm font-semibold">HTTP methods</span><Code2 className="c-vio h-4 w-4" /></div>
                        <div className="mt-4 flex items-baseline gap-3">
                          <strong className="c-ink mono text-5xl font-bold tracking-tight">{new Set(selectedProject.mockApis.map((api) => api.method)).size || "—"}</strong>
                          <span className="c-zinc text-sm">in use</span>
                        </div>
                      </article>
                    </div>

                    {!selectedProject.mockApis.length ? (
                      <section className="card-gray p-7 sm:p-9">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h2 className="c-ink text-2xl font-bold tracking-[-0.03em]">Your first mock API, in four steps</h2>
                          <span className="pill" style={{ background: "#fff" }}>1 of 4 done</span>
                        </div>
                        <ol className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-4">
                          {([
                            ["Create a project", `${selectedProject.name} is ready to go.`, true],
                            ["Add your first API", "Define a method, path and response.", false],
                            ["Copy the endpoint", "Share the hosted URL with your frontend.", false],
                            ["Call it from your app", "Build while the backend catches up.", false],
                          ] as const).map(([title, text, done], n) => (
                            <li key={title} className="relative pt-6" style={{ borderTop: "2px solid #0A0A0F" }}>
                              <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full" style={{ background: done ? "#7C3AED" : "#d4d4d8", boxShadow: "0 0 0 4px #f4f4f5" }} />
                              <span className="c-zinc mono text-xs">Step {n + 1}{done ? " · done" : ""}</span>
                              <h3 className="c-ink mt-2 text-lg font-semibold tracking-tight">{title}</h3>
                              <p className="c-mut mt-1.5 text-sm leading-6">{text}</p>
                              {n === 1 ? <button type="button" onClick={() => setActiveView("apis")} className="btn btn-ink btn-sm mt-4">Add API <ArrowRight className="h-3.5 w-3.5" /></button> : null}
                            </li>
                          ))}
                        </ol>
                      </section>
                    ) : null}

                    <section className="card card-shadow overflow-hidden">
                      <div className="flex items-center justify-between border-b px-6 py-4 hr">
                        <h2 className="c-ink text-lg font-semibold tracking-tight">Recent APIs</h2>
                        <button type="button" onClick={() => setActiveView("apis")} className="tlink">View all</button>
                      </div>
                      {selectedProject.mockApis.length ? (
                        <ul>
                          {selectedProject.mockApis.slice(0, 6).map((api) => (
                            <li key={api.id} className="border-b last:border-b-0 hr">
                              <button
                                type="button"
                                onClick={() => { selectApi(api.id); setActiveView("apis"); }}
                                className="row grid w-full grid-cols-[64px_minmax(0,1fr)_56px_18px] items-center gap-3 bg-transparent px-6 py-4 text-left"
                              >
                                <span className={`badge ${methodClass(api.method)}`}>{api.method}</span>
                                <span className="c-ink mono min-w-0 truncate text-sm">{api.path}<span className="c-zinc ml-3 font-sans text-xs">{api.name}</span></span>
                                <span className={`pill justify-center ${statusClass(api.statusCode)}`}>{api.statusCode}</span>
                                <ArrowRight className="c-zinc h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                          <div className="px-6 py-12 text-center">
                            <div className="flex justify-center"><Logo size={44} iconOnly /></div>
                            <h3 className="c-ink mt-4 text-lg font-semibold">No endpoints yet</h3>
                            <p className="c-mut mt-1 text-sm">Add an endpoint and give your frontend a working response today.</p>
                            <button type="button" onClick={() => setActiveView("apis")} className="btn btn-pur mt-5"><Plus className="h-4 w-4" /> Create your first API</button>
                        </div>
                      )}
                    </section>
                  </>
                ) : null}

                {activeView === "settings" ? (
                  <section className="max-w-3xl">
                    <h1 className="c-ink text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1] tracking-[-0.045em]">Settings</h1>
                    <p className="c-mut mt-3 text-lg">Manage your profile, project key and data.</p>

                    <div className="card mt-8 flex items-center gap-4 p-5">
                      <span className="avatar h-12 w-12 text-lg">{authUser.name.trim().slice(0, 1).toUpperCase() || "P"}</span>
                      <div className="min-w-0">
                        <h2 className="c-ink text-base font-semibold">{authUser.name}</h2>
                        <p className="c-zinc mt-0.5 truncate text-sm">{authUser.email}</p>
                      </div>
                      <span className="pill ml-auto">Profile</span>
                    </div>

                    <div className="card mt-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="c-ink text-base font-semibold">Project endpoint key</h2>
                          <p className="c-mut mt-1 text-sm">This public key is part of every mock URL in this project.</p>
                        </div>
                        <span className="pill">Public</span>
                      </div>
                      <div className="mt-4 flex min-w-0 items-center gap-2 rounded-2xl border p-2 hr" style={{ background: "#fafafa" }}>
                        <code className="c-mut min-w-0 flex-1 truncate px-2 text-sm">{apiKeyRevealed ? selectedProject.publicKey : `••••••••${selectedProject.publicKey.slice(-6)}`}</code>
                        <button type="button" className="btn btn-out btn-sm" onClick={() => setApiKeyRevealed((visible) => !visible)}>{apiKeyRevealed ? "Hide" : "Reveal"}</button>
                        <button type="button" className="ibtn" onClick={() => void copyText(selectedProject.publicKey, "Project key copied")} aria-label="Copy project endpoint key"><Copy className="h-4 w-4" /></button>
                      </div>
                    </div>

                    <div className="card mt-4 p-5">
                      <h2 className="c-ink text-base font-semibold">Workspace</h2>
                      <p className="c-mut mt-1 text-sm">{selectedProject.name} · stored in your PostgreSQL database.</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" onClick={() => void handleExportProject()} className="btn btn-out btn-sm">Export workspace</button>
                        <label className="btn btn-out btn-sm cursor-pointer">Import APIs<input type="file" accept="application/json,.json" onChange={handleImportFile} className="sr-only" /></label>
                      </div>
                    </div>

                    <div className="card mt-4 p-5">
                      <h2 className="c-ink text-base font-semibold">Change history</h2>
                      <p className="c-mut mt-1 text-sm">Recent changes to this workspace.</p>
                      <div className="mt-3">
                        {auditEvents.length ? auditEvents.map((event) => (
                          <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 border-t py-3 hr">
                            <div>
                              <p className="c-ink text-sm">{event.summary}</p>
                              <p className="c-zinc mt-0.5 text-xs">{event.actor?.name ?? "You"} · {event.action}</p>
                            </div>
                            <time className="c-zinc mono text-xs">{new Date(event.createdAt).toLocaleString()}</time>
                          </div>
                        )) : <p className="c-zinc border-t py-4 text-sm hr">No changes recorded yet.</p>}
                      </div>
                    </div>
                  </section>
                ) : null}

                {activeView === "apis" ? (
                  <>
                    <section>
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                        <div>
                          <p className="c-zinc mono text-sm">{selectedProject.name}</p>
                          <h1 className="c-ink mt-2 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1] tracking-[-0.045em]">APIs</h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="relative">
                            <Search className="c-zinc pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2" />
                            <input value={apiSearch} onChange={(event) => setApiSearch(event.target.value)} placeholder="Search APIs" aria-label="Search APIs" className="field field-sm !w-full !pl-9 sm:!w-56" />
                          </label>
                          <Select small label="Filter APIs by method" value={apiMethodFilter} onChange={setApiMethodFilter} options={METHOD_FILTER_OPTIONS} />
                          <Select small label="Sort APIs" value={apiSort} onChange={setApiSort} options={SORT_OPTIONS} />
                          <button type="button" onClick={() => { setEditingApiId(null); setApiForm(defaultApiForm); document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="btn btn-pur btn-sm"><Plus className="h-3.5 w-3.5" /> Create API</button>
                        </div>
                      </div>

                      <div className="card card-shadow mt-6 overflow-hidden">
                        {visibleApis.map((api) => (
                          <button
                            key={api.id}
                            type="button"
                            onClick={() => selectApi(api.id)}
                            className={`row grid w-full grid-cols-[64px_minmax(0,1fr)_56px] items-center gap-3 border-b bg-transparent px-6 py-4 text-left last:border-b-0 hr ${selectedApi?.id === api.id ? "on" : ""}`}
                          >
                            <span className={`badge ${methodClass(api.method)}`}>{api.method}</span>
                            <span className="c-ink mono min-w-0 truncate text-sm">{api.path}<span className="c-zinc ml-3 font-sans text-xs">{api.name}</span></span>
                            <span className={`pill justify-center ${statusClass(api.statusCode)}`}>{api.statusCode}</span>
                          </button>
                        ))}
                        {!visibleApis.length ? <p className="c-zinc px-6 py-10 text-center text-sm">{selectedProject.mockApis.length ? "No APIs match that search." : "No APIs yet. Create your first endpoint below."}</p> : null}
                      </div>
                    </section>

                    <section className="grid min-w-0 scroll-mt-24 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" id="create-api-form">
                      <form onSubmit={handleCreateApi} className="card min-w-0 p-5 sm:p-7">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                          <h2 className="c-ink flex flex-wrap items-center gap-3 text-2xl font-bold tracking-[-0.03em]">
                            {editingApiId ? "Edit API" : "Create API"}
                            {editingApiId ? <span className={`pill ${apiJsonError ? "s-err" : "s-ok"}`}>{apiJsonError ? "Fix JSON to save" : hasUnsavedApiChanges ? "Saving changes…" : "Saved automatically"}</span> : null}
                          </h2>
                          <Settings2 className="c-zinc h-4 w-4" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="lbl">API name
                            <input value={apiForm.name} onChange={(event) => setApiForm((current) => ({ ...current, name: event.target.value }))} aria-label="API name" className="field" placeholder="Users list" />
                          </label>
                          <div className="lbl"><span>Method</span>
                            <Select label="HTTP method" value={apiForm.method} onChange={(value) => setApiForm((current) => ({ ...current, method: value }))} options={METHOD_OPTIONS} />
                          </div>
                          <label className="lbl md:col-span-2">Path
                            <input value={apiForm.path} onChange={(event) => setApiForm((current) => ({ ...current, path: event.target.value }))} aria-label="API path" className="field field-mono" placeholder="/users or /users/:id" />
                          </label>
                          <div className="lbl"><span>Status code</span>
                            <Select
                              label="Response status code"
                              value={apiForm.statusCode}
                              onChange={(value) => setApiForm((current) => ({ ...current, statusCode: value }))}
                              options={[
                                ...(responseStatusOptions.some(([status]) => status === apiForm.statusCode) ? [] : [{ value: apiForm.statusCode, label: `${apiForm.statusCode} · Custom` }]),
                                ...responseStatusOptions.map(([status, text]) => ({ value: status as number, label: `${status} · ${text}` })),
                              ]}
                            />
                          </div>
                          <label className="lbl">Delay (ms)
                            <input type="number" min={0} max={60000} value={apiForm.delayMs} onChange={(event) => setApiForm((current) => ({ ...current, delayMs: Math.min(60000, Math.max(0, Math.floor(Number(event.target.value) || 0))) }))} aria-label="Simulated response delay in milliseconds" className="field field-mono" />
                          </label>
                          <div className="lbl"><span>Response items</span>
                            <Select
                              label="Number of generated response items"
                              value={customCount ? "custom" : String(apiForm.generationCount ?? 20)}
                              onChange={(next) => { const current = apiForm.generationCount ?? 20; const value = next === "custom" ? (PRESET_COUNTS.includes(current) ? 30 : current) : Number(next); setApiForm((form) => ({ ...form, generationCount: value })); }}
                              options={[...PRESET_COUNTS.map((count) => ({ value: String(count), label: `${count} items` })), { value: "custom", label: "Custom…" }]}
                            />
                          </div>
                          {customCount ? (
                            <label className="lbl">Custom item count
                              <input type="number" min={1} max={1000} value={apiForm.generationCount ?? 20} onChange={(event) => setApiForm((current) => ({ ...current, generationCount: Math.min(1000, Math.max(1, Number(event.target.value) || 1)) }))} aria-label="Custom response item count" className="field field-mono" />
                            </label>
                          ) : null}
                          <div className="md:col-span-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label htmlFor="api-body" className="lbl">Response body (JSON)</label>
                              <span className="flex flex-wrap items-center gap-4">
                                <span className={`text-xs font-semibold ${apiJsonError ? "c-err" : "c-ok"}`}>{apiJsonError ? "Invalid JSON" : "Valid JSON"}</span>
                                <button type="button" disabled={Boolean(apiJsonError)} onClick={() => setApiForm((current) => ({ ...current, responseBody: JSON.stringify(JSON.parse(current.responseBody), null, 2) }))} className="tlink">Format</button>
                                <button type="button" disabled={Boolean(apiJsonError)} onClick={handleGenerateFromReference} className="tlink !text-[#7C3AED]">Generate records</button>
                              </span>
                            </div>
                            <textarea id="api-body" value={apiForm.responseBody} onChange={(event) => setApiForm((current) => ({ ...current, responseBody: event.target.value }))} aria-label="JSON response body" className="field" rows={10} spellCheck={false} placeholder={'{"success": true}'} />
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3">
                          {editingApiId ? <p className="c-zinc text-sm">Changes update this endpoint automatically.</p> : <span />}
                          {!editingApiId ? <button type="submit" className="btn btn-pur" disabled={pendingAction !== null || Boolean(apiJsonError)}><Plus className="h-4 w-4" />Create API</button> : null}
                        </div>
                      </form>

                      <div className="min-w-0">
                        <section className="dark-panel">
                          {selectedApi ? (
                            <div className="dark-bar">
                              <span className={`badge ${methodClass(selectedApi.method)} shrink-0`}>{selectedApi.method}</span>
                              <code className="min-w-0 flex-1 truncate text-xs sm:text-sm" style={{ color: "#d4d4d8" }}>{endpointFor(selectedApi)}</code>
                              <button type="button" onClick={() => void copyText(endpointFor(selectedApi), "Endpoint copied")} className="ibtn shrink-0" aria-label="Copy endpoint">{copied ? <Check className="h-4 w-4" style={{ color: "#c4b5fd" }} /> : <Copy className="h-4 w-4" />}</button>
                              <button type="button" onClick={handleTestEndpoint} disabled={pendingAction !== null} className="btn btn-pur btn-sm shrink-0">
                                {pendingAction === "test" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                {pendingAction === "test" ? "Sending…" : "Send"}
                              </button>
                            </div>
                          ) : null}

                          <div className="dark-bar">
                            <div role="tablist" aria-label="Response view" className="flex gap-1">
                              <button type="button" role="tab" aria-selected={panelTab === "preview"} onClick={() => setPanelTab("preview")} className={`tab ${panelTab === "preview" ? "on" : ""}`}>Preview</button>
                              <button type="button" role="tab" aria-selected={panelTab === "response"} onClick={() => setPanelTab("response")} className={`tab ${panelTab === "response" ? "on" : ""}`}>Response</button>
                            </div>
                            {panelTab === "preview" ? (
                              <span className="mono rounded-md px-2 py-1 text-xs font-bold" style={darkPill(apiForm.statusCode)}>{apiForm.statusCode} {statusLabel(apiForm.statusCode)}</span>
                            ) : apiResponse ? (
                              <span className="mono rounded-md px-2 py-1 text-xs font-bold" style={darkPill(apiResponse.status)}>{apiResponse.status} · {apiResponse.elapsedMs} ms</span>
                            ) : null}
                          </div>

                          {panelTab === "preview" ? (
                            <>
                              <p className="mono px-5 pt-4 text-xs" style={{ color: "#a1a1aa" }}>
                                What this form returns · {apiForm.generationCount ?? 20} items · {apiForm.delayMs} ms delay
                              </p>
                              {apiJsonError ? (
                                <div role="alert" className="m-5 rounded-2xl p-4 text-sm" style={{ background: "rgba(251,113,133,.12)", color: "#fda4af", border: "1px solid rgba(251,113,133,.3)" }}>
                                  <p className="font-semibold">Invalid JSON</p>
                                  <p className="mt-1">{apiJsonError}</p>
                                  <p className="mt-1 opacity-80">Fix the response body before creating this API.</p>
                                </div>
                              ) : (
                                <pre className="max-h-[28rem] min-h-40">{formatJsonString(apiForm.responseBody)}</pre>
                              )}
                            </>
                          ) : apiResponse ? (
                            <>
                              <p className="mono px-5 pt-4 text-xs" style={{ color: "#a1a1aa" }}>Real response from the saved endpoint</p>
                              <pre className="max-h-[28rem] min-h-40 whitespace-pre-wrap break-words">{apiResponse.body}</pre>
                              <details className="dark-details">
                                <summary>Response headers</summary>
                                <pre className="max-h-40">{JSON.stringify(apiResponse.headers, null, 2)}</pre>
                              </details>
                            </>
                          ) : (
                            <p className="px-5 py-12 text-center text-sm" style={{ color: "#a1a1aa" }}>
                              {selectedApi ? "Press Send to call this endpoint and see the real response here." : "Create an API, then send a request to see its response here."}
                            </p>
                          )}

                          {selectedApi ? (
                            <div className="flex flex-wrap items-center gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
                              <button type="button" onClick={() => { setEditingApiId(selectedApi.id); setApiForm({ name: selectedApi.name, method: selectedApi.method, path: selectedApi.path, statusCode: selectedApi.statusCode, responseBody: selectedApi.responseBody, responseHeaders: selectedApi.responseHeaders, delayMs: selectedApi.delayMs, enabled: true, generationCount: selectedApi.generationCount ?? 20, description: selectedApi.description ?? "" }); setPanelTab("preview"); document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="btn btn-dark btn-sm">Edit API</button>
                              <button type="button" onClick={() => handleDeleteApi(selectedApi.id)} className="btn btn-dark-danger btn-sm"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                            </div>
                          ) : null}
                        </section>
                      </div>
                    </section>
                  </>
                ) : null}
              </>
            ) : bootstrapped ? (
              <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
                <Logo size={56} iconOnly />
                <h2 className="c-ink mt-6 text-4xl font-bold leading-[1] tracking-[-0.045em]">Create your first API</h2>
                <p className="c-mut mt-4 leading-7">Define an endpoint and give your frontend a working response.</p>
                <button type="button" onClick={() => void openApiCreator()} disabled={pendingAction !== null} className="btn btn-pur mt-7"><Plus className="h-4 w-4" /> Create API</button>
              </div>
            ) : (
                  <div role="status" className="card p-6">
                    <div className="flex items-center gap-3">
                      <LoaderCircle className="c-vio h-4 w-4 animate-spin" />
                      <div>
                        <h2 className="c-ink text-sm font-semibold">Loading your workspace</h2>
                        <p className="c-zinc mt-0.5 text-xs">Preparing your projects and API endpoints…</p>
                      </div>
                    </div>
                    <div className="mt-5 space-y-2" aria-hidden="true">
                      <div className="b-gray h-3 w-2/5 animate-pulse rounded" />
                      <div className="b-gray h-10 animate-pulse rounded-xl" />
                      <div className="b-gray h-10 animate-pulse rounded-xl" />
                    </div>
                  </div>
            )}
          </main>
        </div>

        {paletteOpen ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]" style={{ background: "rgba(10,10,15,.5)" }} onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
            <section role="dialog" aria-modal="true" aria-label="Command menu" className="card w-full max-w-xl overflow-hidden" style={{ boxShadow: "0 40px 100px -30px rgba(10,10,15,.55)" }}>
              <div className="flex items-center gap-3 border-b px-5 hr">
                <Search className="c-zinc h-4 w-4 shrink-0" />
                <input
                  autoFocus
                  value={paletteQuery}
                  onChange={(event) => { setPaletteQuery(event.target.value); setPaletteSelectedIndex(0); }}
                  placeholder="Search or jump to…"
                  aria-label="Search commands"
                  className="c-ink h-14 min-w-0 flex-1 border-0 bg-transparent text-base outline-none"
                />
                <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close command menu" className="ibtn"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filteredCommands.map(([label, view, Icon], index) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => {
                      if (label === "Create API") void openApiCreator();
                      else setActiveView(view);
                      setPaletteOpen(false);
                      setPaletteQuery("");
                      setPaletteSelectedIndex(0);
                    }}
                    className={`row flex w-full items-center gap-3 rounded-xl bg-transparent px-3 py-3 text-left text-sm font-medium ${index === paletteSelectedIndex ? "on" : ""}`}
                  >
                    <Icon className="c-zinc h-4 w-4" />
                    <span className="c-ink flex-1">{label}</span>
                    {view === "apis" ? <span className="c-zinc text-xs">New endpoint</span> : null}
                  </button>
                ))}
                {!filteredCommands.length ? <p className="c-zinc px-3 py-6 text-center text-sm">No matching actions.</p> : null}
              </div>
              <div className="c-zinc flex items-center gap-4 border-t px-5 py-3 text-xs hr"><span><kbd>↑↓</kbd> Navigate</span><span><kbd>Enter</kbd> Select</span><span><kbd>Esc</kbd> Close</span><Command className="ml-auto h-3.5 w-3.5" /></div>
            </section>
          </div>
        ) : null}

        {toast ? (
          <div role="status" className="b-ink c-white fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold" style={{ boxShadow: "0 20px 50px -20px rgba(10,10,15,.6)" }}>
            <Check className="h-4 w-4" style={{ color: "#c4b5fd" }} />{toast}
          </div>
        ) : null}
      </div>
    </Root>
  );
}
