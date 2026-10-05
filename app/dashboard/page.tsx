"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { deleteLocalApi, deleteLocalProject, deleteLocalScenario, loadWorkspaceProjects, exportLocalProject, getPublishedSnapshot, importLocalApis, listActivity, listPublished, publishLocalApi, runLocalMock, saveMockApi, saveProject, saveScenario, seedLocalWorkspace } from "@/lib/workspace-db";
import { generateFromReference } from "@/lib/mock-generator";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  ChevronDown,
  Command,
  Copy,
  Code2,
  Database,
  FileText,
  LayoutDashboard,
  LoaderCircle,
  Play,
  Plus,
  Search,
  Settings2,
  Sun,
  Moon,
  Trash2,
  X,
} from "lucide-react";

type Scenario = {
  id: string;
  name: string;
  description?: string | null;
  statusCode: number;
  responseBody: string;
  responseHeaders: string;
  delayMs: number;
  enabled: boolean;
};

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
  scenarios: Scenario[];
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
type PublishedVersion = { slug: string; version: number; publishedAt: string };
type AuditEvent = { id: string; summary: string; action: string; createdAt: string; actor: { name: string; email: string } | null };
type Analytics = { totalRequests: number; lastDayRequests: number; averageLatencyMs: number; statusCounts: { status: number; count: number }[]; topEndpoints: { id?: string; name?: string; method?: string; path?: string; count: number }[] };
type DashboardView = "overview" | "projects" | "apis" | "requests" | "docs" | "settings";
type DocsLanguage = "JavaScript" | "cURL" | "Python" | "TypeScript";

const defaultProjectForm = { name: "", description: "" };
const ANALYTICS_REFERENCE_TIME = Date.now();
const defaultApiForm = {
  name: "Users list",
  method: "GET",
  path: "/users",
  statusCode: 200,
  responseBody: JSON.stringify({ success: true, data: [{ id: 1, name: "Abhishek", email: "abhishek@example.com" }] }, null, 2),
  responseHeaders: JSON.stringify({ "Content-Type": "application/json" }, null, 2),
  delayMs: 150,
  enabled: true,
  description: "Returns a list of users",
};
const defaultScenarioForm = {
  name: "error",
  description: "Empty state or error simulation",
  statusCode: 500,
  responseBody: JSON.stringify({ success: false, message: "Something went wrong" }, null, 2),
  responseHeaders: JSON.stringify({ "Content-Type": "application/json" }, null, 2),
  delayMs: 400,
  enabled: false,
};
const commandActions = [
  ["Create API", "apis", Code2],
  ["Open Overview", "overview", LayoutDashboard],
  ["Manage Projects", "projects", Database],
  ["Open Requests", "requests", Activity],
  ["Documentation", "docs", BookOpen],
] as const;

function methodClass(method: string) {
  switch (method.toUpperCase()) {
    case "GET":
      return "method-get";
    case "POST":
      return "method-post";
    case "PUT":
      return "method-put";
    case "PATCH":
      return "method-patch";
    case "DELETE":
      return "method-delete";
    default:
      return "text-slate-400 bg-slate-800";
  }
}

function statusClass(status: number) {
  if (status >= 500) return "status-danger";
  if (status >= 400) return "status-warning";
  if (status >= 300) return "status-info";
  return "status-success";
}

function statusTextClass(status: number) {
  if (status >= 500) return "status-text-danger";
  if (status >= 400) return "status-text-warning";
  if (status >= 300) return "status-text-info";
  return "status-text-success";
}

function formatJsonString(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [apiForm, setApiForm] = useState(defaultApiForm);
  const [scenarioForm, setScenarioForm] = useState(defaultScenarioForm);
  const [selectedApiId, setSelectedApiId] = useState<string>("");
  const [editingApiId, setEditingApiId] = useState<string | null>(null);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [testScenario, setTestScenario] = useState("");
  const [apiResponse, setApiResponse] = useState<{ status: number; headers: Record<string, string>; body: string; elapsedMs: number } | null>(null);
  const [pendingAction, setPendingAction] = useState<"project" | "api" | "scenario" | "test" | null>(null);
  const [error, setError] = useState<string>("");
  const [bootstrapped, setBootstrapped] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("overview");
  const [apiSearch, setApiSearch] = useState("");
  const [docsLanguage, setDocsLanguage] = useState<DocsLanguage>("JavaScript");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const [publishedVersions, setPublishedVersions] = useState<PublishedVersion[]>([]);
  const [publishedLink, setPublishedLink] = useState("");
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  );

  const selectedApi = useMemo(
    () => selectedProject?.mockApis.find((api) => api.id === selectedApiId) ?? selectedProject?.mockApis[0] ?? null,
    [selectedApiId, selectedProject],
  );

  const ensureProjectSelected = useCallback((nextProjects: Project[]) => {
    if (nextProjects.length === 0) {
      setSelectedProjectId("");
      setSelectedApiId("");
      setEditingApiId(null);
      setEditingScenarioId(null);
      setTestScenario("");
      setApiResponse(null);
      return;
    }

    const nextSelection = nextProjects.find((project) => project.id === selectedProjectId) ?? nextProjects[0];
    const nextApiId = nextSelection.mockApis.some((api) => api.id === selectedApiId) ? selectedApiId : nextSelection.mockApis[0]?.id ?? "";
    if (nextSelection.id !== selectedProjectId) { setEditingApiId(null); setApiForm(defaultApiForm); }
    if (nextApiId !== selectedApiId) { setEditingScenarioId(null); setScenarioForm(defaultScenarioForm); setTestScenario(""); setApiResponse(null); }
    setSelectedProjectId(nextSelection.id);
    setSelectedApiId(nextApiId);
  }, [selectedApiId, selectedProjectId]);

  const selectProject = (project: Project) => {
    setSelectedProjectId(project.id);
    setSelectedApiId(project.mockApis[0]?.id ?? "");
    setEditingApiId(null);
    setEditingScenarioId(null);
    setApiForm(defaultApiForm);
    setScenarioForm(defaultScenarioForm);
    setTestScenario("");
    setApiResponse(null);
  };

  const selectApi = (apiId: string) => {
    setSelectedApiId(apiId);
    setEditingApiId(null);
    setEditingScenarioId(null);
    setApiForm(defaultApiForm);
    setScenarioForm(defaultScenarioForm);
    setTestScenario("");
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

  useEffect(() => {
    window.queueMicrotask(() => {
      const storedTheme = window.localStorage.getItem("preapix-theme");
      if (storedTheme === "dark" || storedTheme === "light") setTheme(storedTheme);
      setThemeLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (activeView !== "docs" || !selectedProject || !selectedApi) return;
    let active = true;
    if (authUser) void listPublished(authUser.id, selectedApi.id).then((versions) => { if (active) setPublishedVersions(versions); }).catch(() => { if (active) setPublishedVersions([]); });
    return () => { active = false; };
  }, [activeView, authUser, selectedApi, selectedProject]);

  useEffect(() => {
    if (activeView !== "settings" || !selectedProject) return;
    let active = true;
    if (authUser) void listActivity(authUser.id).then((events) => { if (active) setAuditEvents(events); }).catch(() => { if (active) setAuditEvents([]); });
    return () => { active = false; };
  }, [activeView, authUser, selectedProject]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (themeLoaded) window.localStorage.setItem("preapix-theme", theme);
  }, [theme, themeLoaded]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const matchingCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
        setPaletteSelectedIndex(0);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
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
        setActiveView(matchingCommands[paletteSelectedIndex][1]);
        setPaletteOpen(false);
        setPaletteQuery("");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paletteOpen, paletteQuery, paletteSelectedIndex]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const visibleApis = useMemo(() => {
    const apis = selectedProject?.mockApis ?? [];
    const query = apiSearch.trim().toLowerCase();
    if (!query) {
      return apis;
    }
    return apis.filter((api) => `${api.name} ${api.method} ${api.path}`.toLowerCase().includes(query));
  }, [apiSearch, selectedProject]);
  const filteredCommands = commandActions.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase()));

  const recentRequests = useMemo(
    () => (selectedProject?.mockApis ?? [])
      .flatMap((api) => api.requestLogs.map((log) => ({ ...log, apiName: api.name })))
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    [selectedProject],
  );

  const analytics = useMemo<Analytics | null>(() => {
    if (!selectedProject) return null;
    const logs = selectedProject.mockApis.flatMap((api) => api.requestLogs.map((log) => ({ ...log, api })));
    const counts = new Map<number, number>();
    logs.forEach((log) => counts.set(log.statusCode, (counts.get(log.statusCode) ?? 0) + 1));
    return { totalRequests: logs.length, lastDayRequests: logs.filter((log) => ANALYTICS_REFERENCE_TIME - new Date(log.createdAt).getTime() <= 86400000).length, averageLatencyMs: logs.length ? Math.round(logs.reduce((sum, log) => sum + (log.responseTimeMs ?? 0), 0) / logs.length) : 0, statusCounts: [...counts].map(([status, count]) => ({ status, count })), topEndpoints: [...new Set(logs.map((log) => log.api.id))].map((apiId) => { const api = logs.find((log) => log.api.id === apiId)?.api; return { id: apiId, name: api?.name, method: api?.method, path: api?.path, count: logs.filter((log) => log.api.id === apiId).length }; }).sort((a, b) => b.count - a.count).slice(0, 5) };
  }, [selectedProject]);
  const requestCount = analytics?.totalRequests ?? 0;
  const activeApiCount = (selectedProject?.mockApis ?? []).filter((api) => api.enabled).length;
  const apiJsonError = useMemo(() => {
    try {
      JSON.parse(apiForm.responseBody);
    } catch (jsonError) {
      return `Response body: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
    }
    try {
      JSON.parse(apiForm.responseHeaders);
    } catch (jsonError) {
      return `Response headers: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
    }
    return "";
  }, [apiForm.responseBody, apiForm.responseHeaders]);
  const scenarioJsonError = useMemo(() => {
    try {
      JSON.parse(scenarioForm.responseBody);
    } catch (jsonError) {
      return `Response body: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
    }
    try {
      JSON.parse(scenarioForm.responseHeaders);
    } catch (jsonError) {
      return `Response headers: ${jsonError instanceof Error ? jsonError.message : "Check the JSON syntax."}`;
    }
    return "";
  }, [scenarioForm.responseBody, scenarioForm.responseHeaders]);

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
  const selectedEndpoint = selectedApi ? endpointFor(selectedApi) : "";
  const docsCode = selectedApi
    ? ({
        JavaScript: `fetch("${selectedEndpoint}")\n  .then((response) => response.json())\n  .then(console.log);`,
        cURL: `curl -X ${selectedApi.method} "${selectedEndpoint}" -H "Accept: application/json"`,
        Python: `import requests\n\nresponse = requests.${selectedApi.method.toLowerCase()}("${selectedEndpoint}")\nprint(response.json())`,
        TypeScript: `const response = await fetch("${selectedEndpoint}");\nconst data: unknown = await response.json();\nconsole.log(data);`,
      })[docsLanguage]
    : "";

  useEffect(() => {
    let active = true;
    void fetch("/api/auth/me").then((response) => response.json()).then((payload) => {
      if (active) {
        setAuthUser(payload.user ?? null);
        setSupabaseConfigured(Boolean(payload.configured));
        if (new URLSearchParams(window.location.search).has("auth_error")) setAuthError("We could not confirm that email. Please try signing in or request a new confirmation email.");
      }
    }).catch(() => { if (active) setAuthError("Could not connect to the account service. Refresh and try again."); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (bootstrapped) {
      return;
    }
    if (!authUser) return;

    const seedProject = async () => {
      try {
        await seedLocalWorkspace(authUser.id);
        await loadProjects();
        setBootstrapped(true);
      } catch (seedError) {
        setError(seedError instanceof Error ? seedError.message : "Failed to seed project data.");
      }
    };

    void seedProject();
  }, [authUser, bootstrapped, loadProjects]);

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAuthBusy(true);
    setAuthError("");
    setAuthNotice("");
    try {
      const supabase = createSupabaseClient();
      const email = String(form.get("email") ?? "").trim();
      const password = String(form.get("password") ?? "");
      if (authMode === "register") {
        const name = String(form.get("name") ?? "").trim();
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard` } });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setAuthNotice("Check your email for a confirmation link. You can sign in after confirming your address.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      const response = await fetch("/api/auth/me");
      const payload = await response.json();
      if (!response.ok || !payload.user) throw new Error("Signed in, but the server could not verify the Supabase session. Refresh and try again.");
      setAuthUser(payload.user);
      setBootstrapped(false);
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : "Account request failed.");
    } finally { setAuthBusy(false); }
  };

  const handleSignOut = async () => {
    const { error: signOutError } = await createSupabaseClient().auth.signOut();
    if (signOutError) { setError(`Could not sign out: ${signOutError.message}`); return; }
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
    try { setApiForm((current) => ({ ...current, responseBody: JSON.stringify(generateFromReference(JSON.parse(current.responseBody)), null, 2) })); setToast("Random sample generated with the same JSON structure"); }
    catch { setError("Add valid JSON reference data before generating a sample."); }
  };

  const handlePublishDocs = async () => {
    if (!selectedProject || !selectedApi) return;
    try {
      const version = await publishLocalApi(authUser!.id, selectedProject.id, selectedApi.id);
      setPublishedVersions(await listPublished(authUser!.id, selectedApi.id));
      setPublishedLink(`Version ${version.version} saved to your Supabase workspace. Download it from Published history.`);
      setToast(`Documentation snapshot v${version.version} saved`);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "Could not save this documentation snapshot.");
    }
  };

  const downloadPublishedSnapshot = async (apiId: string, version: number) => {
    if (!authUser) return;
    try {
      const snapshot = await getPublishedSnapshot(authUser.id, apiId, version);
      if (!snapshot) { setError("This documentation snapshot is unavailable."); return; }
      const url = URL.createObjectURL(new Blob([JSON.stringify({ format: "preapix-export", version, api: snapshot }, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${snapshot.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-v${version}.json`; anchor.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "Could not download this documentation snapshot.");
    }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setPendingAction("project");
      setError("");

      const project = await saveProject(authUser!.id, { id: editingProjectId ?? undefined, ...projectForm });

      setProjectForm(defaultProjectForm);
      setEditingProjectId(null);
      await loadProjects();
      selectProject(project);
      setToast(editingProjectId ? "Project updated successfully" : "Project created successfully");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Project creation failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleCreateApi = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProject) {
      return;
    }
    if (apiJsonError) {
      setError(`Invalid JSON in response body or headers: ${apiJsonError}`);
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

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!window.confirm(`Delete "${project?.name ?? "this project"}" and all of its APIs? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteLocalProject(authUser!.id, projectId);
      await loadProjects();
      setToast("Project deleted");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  };

  const handleDeleteApi = async (mockApiId: string) => {
    if (!selectedProject) {
      return;
    }
    const api = selectedProject.mockApis.find((item) => item.id === mockApiId);
    if (!window.confirm(`Delete "${api?.name ?? "this API"}" and its scenarios? This cannot be undone.`)) {
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

  const handleCreateScenario = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedApi || !selectedProject) {
      return;
    }
    if (scenarioJsonError) {
      setError(`Invalid scenario JSON. ${scenarioJsonError}`);
      return;
    }

    try {
      setPendingAction("scenario");
      setError("");

      await saveScenario(authUser!.id, selectedProject.id, selectedApi.id, { ...scenarioForm, id: editingScenarioId ?? crypto.randomUUID(), responseBody: formatJsonString(scenarioForm.responseBody), responseHeaders: formatJsonString(scenarioForm.responseHeaders) });

      setScenarioForm(defaultScenarioForm);
      setEditingScenarioId(null);
      await loadProjects();
      setToast(editingScenarioId ? "Scenario updated successfully" : "Scenario created successfully");
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Scenario creation failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleDeleteScenario = async (scenario: Scenario) => {
    if (!selectedProject || !selectedApi || !window.confirm(`Delete scenario "${scenario.name}"? This cannot be undone.`)) return;
    try {
      setPendingAction("scenario");
      await deleteLocalScenario(authUser!.id, selectedProject.id, selectedApi.id, scenario.id);
      if (editingScenarioId === scenario.id) { setEditingScenarioId(null); setScenarioForm(defaultScenarioForm); }
      await loadProjects();
      setToast("Scenario deleted");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Scenario deletion failed.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleTestEndpoint = async () => {
    if (!selectedProject || !selectedApi) {
      return;
    }

    try {
      setPendingAction("test");
      const result = await runLocalMock(authUser!.id, selectedProject.id, selectedApi.id, testScenario);
      setApiResponse({
        status: result.status,
        headers: result.headers,
        body: JSON.stringify(result.body, null, 2),
        elapsedMs: result.responseTimeMs,
      });
      await loadProjects();
    } catch (testError) {
      setError(testError instanceof Error ? testError.message : "Endpoint test failed.");
    } finally {
      setPendingAction(null);
    }
  };

  if (authLoading) return <main className="grid min-h-screen place-items-center bg-[#08090c] text-slate-300"><div role="status" className="flex items-center gap-3 rounded-xl border border-[#202630] bg-[#0d1117] px-5 py-4 text-sm"><LoaderCircle className="h-4 w-4 animate-spin text-blue-400" />Loading your account…</div></main>;

  if (!supabaseConfigured) return <main className="grid min-h-screen place-items-center bg-[#08090c] px-4 text-slate-100"><section className="w-full max-w-lg rounded-2xl border border-[#202630] bg-[#0d1117] p-7 shadow-2xl"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Code2 className="h-5 w-5" /></span><span className="font-semibold text-white">Preapix setup</span></div><h1 className="text-xl font-semibold text-white">Connect Supabase Auth</h1><p className="mt-2 text-sm leading-6 text-slate-400">Add the Supabase project URL and publishable key to your local environment file, then restart the development server.</p><div className="mt-5 rounded-xl border border-[#252d38] bg-[#08090c] p-4 font-mono text-xs leading-6 text-slate-300">NEXT_PUBLIC_SUPABASE_URL=https://fjaiimwhuixfeaazkrwg.supabase.co<br />NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key</div><p className="mt-4 text-xs text-slate-500">Find the publishable key in Supabase Dashboard → Project Settings → API Keys. Keep secret and service_role keys private.</p></section></main>;

  if (!authUser) return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#08090c] px-4 py-12 text-slate-100">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_52%)]" />
      <section className="relative w-full max-w-md rounded-2xl border border-[#202630] bg-[#0d1117] p-6 shadow-2xl sm:p-8">
        <div className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300"><Code2 className="h-5 w-5" /></span><div><p className="font-semibold tracking-tight text-white">Preapix</p><p className="text-xs text-slate-500">Your mock API workspace</p></div></div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-blue-400">{authMode === "register" ? "Get started" : "Welcome back"}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">{authMode === "register" ? "Create your account" : "Sign in to Preapix"}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">{authMode === "register" ? "Save your APIs, scenarios, and workspace settings in a private account." : "Continue building against your mock APIs."}</p>
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          {authMode === "register" ? <label className="block space-y-1.5 text-xs text-slate-400">Name<input name="name" autoComplete="name" required minLength={2} maxLength={80} className="w-full rounded-lg border border-[#2a323d] bg-[#08090c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder="Your name" /></label> : null}
          <label className="block space-y-1.5 text-xs text-slate-400">Email<input name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-[#2a323d] bg-[#08090c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder="you@company.com" /></label>
          <label className="block space-y-1.5 text-xs text-slate-400">Password<input name="password" type="password" autoComplete={authMode === "register" ? "new-password" : "current-password"} required minLength={authMode === "register" ? 10 : 1} maxLength={200} className="w-full rounded-lg border border-[#2a323d] bg-[#08090c] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder={authMode === "register" ? "At least 10 characters" : "Your password"} /></label>
          {authError ? <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{authError}</p> : null}
          {authNotice ? <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{authNotice}</p> : null}
          <button disabled={authBusy} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60">{authBusy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{authMode === "register" ? "Create account" : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">{authMode === "register" ? "Already have an account?" : "New to Preapix?"}<button type="button" onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }} className="ml-1.5 font-medium text-blue-400 hover:text-blue-300">{authMode === "register" ? "Sign in" : "Create an account"}</button></p>
      </section>
    </main>
  );

  return (
    <div className="dashboard-shell min-h-screen bg-[#08090c] text-slate-100">
      <div className="app-shell min-h-screen px-3 sm:px-5 lg:px-8">
        <header className="dashboard-topbar sticky top-0 z-20 -mx-3 mb-6 flex min-h-[68px] items-center justify-between gap-4 border-b border-[#202630] bg-[#08090c]/90 px-4 backdrop-blur-xl sm:-mx-5 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[inset_0_1px_rgba(255,255,255,0.08)]">
              <Code2 className="h-[17px] w-[17px]" />
            </div>
            <div className="hidden min-w-0 sm:block"><span className="block font-semibold tracking-tight text-white">Preapix</span><span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">API workspace</span></div>
            <span className="text-slate-700">/</span>
            <div className="min-w-0"><span className="block max-w-48 truncate text-sm font-medium text-slate-200 sm:max-w-64">{selectedProject?.name ?? "Workspace"}</span><span className="block text-[10px] text-slate-600">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</span></div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#202630] bg-[#0d1117] px-3 text-sm text-slate-400 hover:border-[#2a323d] hover:text-slate-200"
              aria-label="Search and quick actions"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-2 hidden rounded border border-[#2a323d] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">Ctrl K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#202630] bg-[#0d1117] text-slate-400 hover:text-slate-100"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" onClick={handleSignOut} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-xs text-slate-400 hover:bg-[#151b23] hover:text-slate-200 sm:w-auto sm:px-2" title={`Sign out ${authUser.email}`} aria-label="Sign out"><span className="hidden sm:inline">{authUser.name} · Sign out</span><span className="sm:hidden">{authUser.name.slice(0, 1).toUpperCase()}</span></button>
            <Link href="/" className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-slate-400 hover:bg-[#11161d] hover:text-white">Home</Link>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        ) : null}

        <div className="grid min-h-[calc(100vh-6rem)] gap-6 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-8">
          <aside className="dashboard-sidebar flex flex-col gap-5 border-b border-[#202630] pb-4 lg:sticky lg:top-[84px] lg:h-[calc(100vh-100px)] lg:overflow-y-auto lg:border-b-0 lg:pr-4">
            <nav aria-label="Workspace navigation" className="dashboard-nav grid grid-cols-3 gap-1 sm:grid-cols-6 lg:grid-cols-1">
              {([
                ["overview", "Overview", LayoutDashboard],
                ["projects", "Projects", Database],
                ["apis", "APIs", Code2],
                ["requests", "Requests", Activity],
                ["docs", "Documentation", BookOpen],
                ["settings", "Settings", Settings2],
              ] as const).map(([view, label, Icon]) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  aria-label={label}
                  title={label}
                  aria-current={activeView === view ? "page" : undefined}
                  className={`flex min-h-9 min-w-9 items-center justify-center gap-2 rounded-lg px-2 text-xs transition sm:text-sm lg:justify-start lg:px-3 ${activeView === view ? "bg-[#151b23] text-white" : "text-slate-400 hover:bg-[#11161d] hover:text-slate-200"}`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${activeView === view ? "text-blue-400" : ""}`} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>

            <div className="hidden border-t border-[#202630] pt-4 lg:block">
              <div className="mb-3 flex items-center justify-between px-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Projects</h2>
                <button
                  type="button"
                  onClick={() => { setEditingProjectId(null); setProjectForm(defaultProjectForm); setActiveView("projects"); const details = document.getElementById("project-form-details") as HTMLDetailsElement | null; if (details) details.open = true; }}
                  className="rounded-md p-1 text-slate-500 hover:bg-[#151b23] hover:text-slate-200"
                  aria-label="Create or manage projects"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => selectProject(project)}
                  className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${selectedProject?.id === project.id ? "bg-[#11161d] text-white" : "text-slate-400 hover:bg-[#11161d] hover:text-slate-200"}`}
                >
                  <Database className="h-4 w-4 shrink-0 text-slate-500" />
                  <span className="min-w-0 flex-1 truncate">{project.name}</span>
                  <span className="text-[11px] text-slate-600">{project.mockApis.length}</span>
                </button>
              ))}
            </div>

            <details id="project-form-details" className="group rounded-lg border border-[#202630] bg-[#0d1117] p-3 lg:mt-auto">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2"><Plus className="h-4 w-4 text-blue-400" /> {editingProjectId ? "Edit project" : "New project"}</span>
                <ChevronDown className="h-4 w-4 text-slate-500 transition group-open:rotate-180" />
              </summary>
              <form onSubmit={handleCreateProject} className="mt-3 space-y-2">
              <input
                value={projectForm.name}
                onChange={(event) => setProjectForm((current) => ({ ...current, name: event.target.value }))}
                aria-label="Project name"
                placeholder="Project name"
                className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500"
              />
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((current) => ({ ...current, description: event.target.value }))}
                aria-label="Project description"
                placeholder="Project description"
                rows={2}
                className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={pendingAction !== null}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {pendingAction === "project" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingProjectId ? "Save project" : "Create project"}
              </button>
              </form>
            </details>
          </aside>

          <main className="min-w-0 space-y-5 pb-10">
            {selectedProject ? (
              <>
                {activeView === "overview" ? (
                  <>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-400">Workspace overview</p>
                        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-white">Good to see you, {authUser.name.split(" ")[0]}</h1>
                        <p className="mt-1 text-sm text-slate-500">Here’s what’s happening in {selectedProject.name}.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveView("apis")}
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4" /> Create API
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <article className="metric-card"><div className="flex items-center justify-between"><span className="metric-label">Endpoints</span><Code2 className="h-4 w-4 text-blue-400" /></div><div className="mt-3 flex items-baseline gap-2"><strong className="metric-value">{selectedProject.mockApis.length}</strong><span className="text-xs text-slate-500">{activeApiCount} active</span></div></article>
                      <article className="metric-card"><div className="flex items-center justify-between"><span className="metric-label">Test runs</span><Activity className="h-4 w-4 text-cyan-400" /></div><div className="mt-3 flex items-baseline gap-2"><strong className="metric-value">{requestCount}</strong><span className="text-xs text-slate-500">saved previews</span></div></article>
                      <article className="metric-card"><div className="flex items-center justify-between"><span className="metric-label">Last 24 hours</span><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.55)]" /></div><div className="mt-3 flex items-baseline gap-2"><strong className="metric-value">{analytics?.lastDayRequests ?? 0}</strong><span className="text-xs text-slate-500">requests</span></div></article>
                      <article className="metric-card"><div className="flex items-center justify-between"><span className="metric-label">Avg. latency</span><LoaderCircle className="h-4 w-4 text-slate-500" /></div><div className="mt-3 flex items-baseline gap-2"><strong className="metric-value">{analytics?.averageLatencyMs ?? 0}<span className="ml-1 text-base font-medium text-slate-500">ms</span></strong></div></article>
                    </div>

                    <section className="overflow-hidden rounded-xl border border-[#202630] bg-[#0d1117]">
                      <div className="flex items-center justify-between border-b border-[#202630] px-4 py-3">
                        <h2 className="text-sm font-semibold text-white">Recent APIs</h2>
                        <button type="button" onClick={() => setActiveView("apis")} className="text-xs text-blue-400 hover:text-blue-300">View all</button>
                      </div>
                      {selectedProject.mockApis.length ? (
                        <div className="divide-y divide-[#202630]">
                          {selectedProject.mockApis.slice(0, 6).map((api) => (
                            <button
                              key={api.id}
                              type="button"
                              onClick={() => { selectApi(api.id); setActiveView("apis"); }}
                              className="grid w-full grid-cols-[58px_minmax(0,1fr)_68px_70px_20px] items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#11161d]"
                            >
                              <span className={`method-badge ${methodClass(api.method)}`}>{api.method}</span>
                              <span className="min-w-0 truncate font-mono text-slate-200">{api.path}<span className="ml-2 font-sans text-slate-500">{api.name}</span></span>
                              <span className={`text-xs ${statusTextClass(api.statusCode)}`}>{api.statusCode}</span>
                              <span className={`text-xs ${api.enabled ? "text-emerald-400" : "text-slate-500"}`}>{api.enabled ? "Active" : "Disabled"}</span>
                              <ArrowRight className="h-4 w-4 text-slate-600" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-10 text-center">
                          <Code2 className="mx-auto h-6 w-6 text-slate-600" />
                          <h3 className="mt-3 text-sm font-medium text-slate-200">No mock APIs yet</h3>
                          <p className="mt-1 text-sm text-slate-500">Create an endpoint to start building against a live mock.</p>
                          <button type="button" onClick={() => setActiveView("apis")} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"><Plus className="h-4 w-4" /> Create your first API</button>
                        </div>
                      )}
                    </section>

                    <section className="overflow-hidden rounded-xl border border-[#202630] bg-[#0d1117]">
                      <div className="flex items-center justify-between border-b border-[#202630] px-4 py-3">
                        <h2 className="text-sm font-semibold text-white">Recent activity</h2>
                        <button type="button" onClick={() => setActiveView("requests")} className="text-xs text-blue-400 hover:text-blue-300">All requests</button>
                      </div>
                      {recentRequests.length ? (
                        <div className="divide-y divide-[#202630]">
                          {recentRequests.slice(0, 5).map((log) => (
                            <div key={log.id} className="grid grid-cols-[58px_minmax(0,1fr)_56px_56px] items-center gap-3 px-4 py-3 text-xs">
                              <span className={`method-badge ${methodClass(log.method)}`}>{log.method}</span>
                              <span className="truncate font-mono text-slate-400">{log.path}</span>
                              <span className={statusTextClass(log.statusCode)}>{log.statusCode}</span>
                              <span className="text-right text-slate-500">{log.responseTimeMs ?? 0}ms</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-sm text-slate-500">No requests yet. Requests will appear here when your endpoints receive traffic.</div>
                      )}
                    </section>
                  </>
                ) : null}

                {activeView === "projects" ? (
                  <section>
                    <div className="mb-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Workspace</p>
                      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Projects</h1>
                      <p className="mt-1 text-sm text-slate-500">Organize mock APIs by application or environment.</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {projects.map((project) => (
                        <article key={project.id} className={`rounded-xl border bg-[#0d1117] p-4 ${selectedProject.id === project.id ? "border-blue-500/50" : "border-[#202630]"}`}>
                          <button type="button" onClick={() => selectProject(project)} className="w-full text-left">
                            <div className="flex items-center justify-between">
                              <h2 className="truncate font-medium text-white">{project.name}</h2>
                              <span className="text-xs text-slate-500">{project.mockApis.length} APIs</span>
                            </div>
                            <p className="mt-2 min-h-5 truncate text-sm text-slate-500">{project.description || "No description"}</p>
                            <p className="mt-4 font-mono text-xs text-slate-500">key: {project.publicKey}</p>
                          </button>
                          <div className="mt-4 flex justify-end border-t border-[#202630] pt-3">
                            <button type="button" onClick={() => { setEditingProjectId(project.id); setProjectForm({ name: project.name, description: project.description ?? "" }); setActiveView("projects"); const details = document.getElementById("project-form-details") as HTMLDetailsElement | null; if (details) details.open = true; }} className="mr-auto rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-[#151b23]">Edit details</button>
                            <button type="button" onClick={() => handleDeleteProject(project.id)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /> Delete project</button>
                          </div>
                        </article>
                      ))}
                    </div>
                    {!projects.length ? <p className="rounded-xl border border-dashed border-[#2a323d] p-8 text-center text-sm text-slate-500">Create a project to organize your first mock API.</p> : null}
                  </section>
                ) : null}

                {activeView === "requests" ? (
                  <section>
                    <div className="mb-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Activity</p>
                      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Requests</h1>
                      <p className="mt-1 text-sm text-slate-500">Browser test history for {selectedProject.name}; external endpoint calls are not captured here.</p>
                    </div>
                    {recentRequests.length ? (
                      <div className="overflow-x-auto rounded-xl border border-[#202630] bg-[#0d1117]">
                        <table className="w-full min-w-155 text-left text-sm">
                          <thead className="border-b border-[#202630] text-xs text-slate-500">
                            <tr><th className="px-4 py-3 font-medium">Method</th><th className="px-4 py-3 font-medium">Endpoint</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Latency</th><th className="px-4 py-3 font-medium">Time</th></tr>
                          </thead>
                          <tbody className="divide-y divide-[#202630]">
                            {recentRequests.map((log) => (
                              <tr key={log.id} className="hover:bg-[#11161d]">
                                <td className="px-4 py-3"><span className={`method-badge ${methodClass(log.method)}`}>{log.method}</span></td>
                                <td className="px-4 py-3">
                                  <details className="group">
                                    <summary className="cursor-pointer list-none">
                                      <span className="font-mono text-xs text-slate-200">{log.path}</span>
                                      <span className="ml-2 text-xs text-slate-600">{log.apiName}</span>
                                    </summary>
                                    <div className="mt-3 grid gap-3 rounded-lg border border-[#202630] bg-[#08090c] p-3 lg:grid-cols-2">
                                      {[
                                        ["Request headers", log.requestHeaders],
                                        ["Query parameters", log.queryParams],
                                        ["Request body", log.requestBody],
                                        ["Response headers", log.responseHeaders],
                                        ["Response body", log.responseBody],
                                      ].map(([label, content]) => (
                                        <div key={label}>
                                          <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</h4>
                                          <pre className="max-h-36 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-[11px] leading-4 text-slate-400">{content ? formatJsonString(content) : "{}"}</pre>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                </td>
                                <td className={`px-4 py-3 text-xs ${statusTextClass(log.statusCode)}`}>{log.statusCode}</td>
                                <td className="px-4 py-3 text-xs text-slate-400">{log.responseTimeMs ?? 0}ms</td>
                                <td className="px-4 py-3 text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#2a323d] px-5 py-12 text-center">
                        <Activity className="mx-auto h-6 w-6 text-slate-600" />
                        <h2 className="mt-3 text-sm font-medium text-slate-200">No requests yet</h2>
                          <p className="mt-1 text-sm text-slate-500">Run a local endpoint preview from APIs to see its request and response details here.</p>
                        <button type="button" onClick={() => setActiveView("apis")} className="mt-4 text-sm text-blue-400 hover:text-blue-300">Open API tester <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </section>
                ) : null}

                {activeView === "docs" ? (
                  <section>
                    <div className="mb-4">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Resources</p>
                      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">API documentation</h1>
                      <p className="mt-1 text-sm text-slate-500">Generated from the selected endpoint configuration.</p>
                    </div>
                    {selectedApi ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#202630] bg-[#0d1117] p-4"><div><h2 className="text-sm font-medium text-white">Save documentation snapshot</h2><p className="mt-1 text-xs text-slate-500">Keep a versioned copy in Supabase, then download it from history.</p>{publishedLink ? <p role="status" className="mt-2 text-xs text-emerald-300">{publishedLink}</p> : null}</div><button type="button" onClick={() => void handlePublishDocs()} className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600">Save version {((publishedVersions[0]?.version ?? 0) + 1)}</button></div> : null}
                    {publishedVersions.length ? <div className="mb-4 rounded-xl border border-[#202630] bg-[#0d1117] px-4 py-3"><p className="text-xs font-medium text-slate-400">Saved history · Supabase</p><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{publishedVersions.map((version) => <button type="button" key={`${version.slug}-${version.version}`} onClick={() => void downloadPublishedSnapshot(selectedApi!.id, version.version)} className="text-xs text-blue-400 hover:text-blue-300">Download v{version.version} · {new Date(version.publishedAt).toLocaleDateString()}</button>)}</div></div> : null}
                    {selectedApi ? (
                      <article className="overflow-hidden rounded-xl border border-[#202630] bg-[#0d1117]">
                        <div className="border-b border-[#202630] p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`method-badge ${methodClass(selectedApi.method)}`}>{selectedApi.method}</span>
                            <code className="font-mono text-sm text-white">{selectedApi.path}</code>
                          </div>
                          <h2 className="mt-4 text-lg font-semibold text-white">{selectedApi.name}</h2>
                          <p className="mt-1 text-sm text-slate-400">{selectedApi.description || "Mock endpoint documentation."}</p>
                        </div>
                        <div className="grid gap-5 p-5 lg:grid-cols-2">
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Endpoint</h3>
                            <div className="mt-2 break-all rounded-lg border border-[#202630] bg-[#08090c] p-3 font-mono text-xs text-slate-300">{endpointFor(selectedApi)}</div>
                            <button type="button" onClick={() => void copyText(endpointFor(selectedApi), "Endpoint copied")} className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#2a323d] px-3 py-2 text-xs text-slate-300 hover:bg-[#151b23]">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy endpoint</button>
                            <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">Response</h3>
                            <p className="mt-2 text-sm text-slate-300"><span className={statusTextClass(selectedApi.statusCode)}>{selectedApi.statusCode}</span> · {selectedApi.delayMs}ms simulated delay</p>
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Code example</h3>
                              <div className="flex items-center gap-1">
                                {(["JavaScript", "cURL", "Python", "TypeScript"] as const).map((language) => (
                                  <button key={language} type="button" onClick={() => setDocsLanguage(language)} aria-pressed={docsLanguage === language} className={`rounded-md px-2 py-1 text-[11px] ${docsLanguage === language ? "bg-[#202630] text-slate-100" : "text-slate-500 hover:text-slate-300"}`}>{language}</button>
                                ))}
                                <button type="button" onClick={() => void copyText(docsCode, "Example copied")} className="rounded-md p-1.5 text-slate-500 hover:bg-[#151b23] hover:text-slate-200" aria-label={`Copy ${docsLanguage} example`}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
                              </div>
                            </div>
                            <pre className="mt-2 overflow-x-auto rounded-lg border border-[#202630] bg-[#08090c] p-3 font-mono text-xs leading-6 text-slate-300">{docsCode}</pre>
                            <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Response body</h3>
                            <pre className="mt-2 max-h-72 overflow-auto rounded-lg border border-[#202630] bg-[#08090c] p-3 font-mono text-xs leading-5 text-slate-300">{formatJsonString(selectedApi.responseBody)}</pre>
                          </div>
                        </div>
                      </article>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#2a323d] p-8 text-center text-sm text-slate-500">Create or select an API to generate documentation.</div>
                    )}
                  </section>
                ) : null}

                {activeView === "settings" ? (
                  <section className="max-w-3xl">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Preferences</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Settings</h1>
                    <p className="mt-1 text-sm text-slate-500">Personalize your Preapix workspace.</p>
                    <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#202630] bg-[#0d1117] p-5">
                      <div><h2 className="text-sm font-medium text-white">Appearance</h2><p className="mt-1 text-xs text-slate-500">Your preference is saved on this device.</p></div>
                      <button type="button" onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")} className="inline-flex items-center gap-2 rounded-lg border border-[#2a323d] px-3 py-2 text-sm text-slate-200 hover:bg-[#151b23]">{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}{theme === "dark" ? "Dark" : "Light"}</button>
                    </div>
                    <div className="mt-4 rounded-xl border border-[#202630] bg-[#0d1117] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-sm font-medium text-white">Workspace</h2><p className="mt-1 text-sm text-slate-400">{selectedProject?.name ?? "No project selected"}</p><p className="mt-3 text-xs text-slate-500">Stored securely in your Supabase database.</p></div><div className="flex flex-wrap gap-2">{selectedProject ? <button type="button" onClick={() => void handleExportProject()} className="rounded-lg border border-[#2a323d] px-3 py-2 text-xs text-slate-300 hover:bg-[#151b23]">Export workspace</button> : null}</div></div><label className="mt-4 inline-flex cursor-pointer items-center rounded-lg border border-[#2a323d] px-3 py-2 text-xs text-slate-300 hover:bg-[#151b23]">Import APIs and scenarios<input type="file" accept="application/json,.json" onChange={handleImportFile} className="sr-only" /></label></div>
                    <div className="mt-4 rounded-xl border border-[#202630] bg-[#0d1117] p-5">
                      <div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-medium text-white">Supabase workspace</h2><p className="mt-1 text-xs text-slate-500">Workspace data syncs for this account across signed-in devices.</p></div><span className="rounded-md border border-[#2a323d] px-2 py-1 text-[11px] capitalize text-slate-400">{authUser?.email}</span></div>
                      <div className="mt-4 rounded-lg border border-[#202630] bg-[#08090c] px-3 py-3 text-sm text-slate-400">Mock endpoints read their saved response configuration from your Supabase database.</div>
                    </div>
                    <div className="mt-4 rounded-xl border border-[#202630] bg-[#0d1117] p-5"><h2 className="text-sm font-medium text-white">Change history</h2><p className="mt-1 text-xs text-slate-500">Recent changes to this workspace.</p><div className="mt-3 divide-y divide-[#202630]">{auditEvents.length ? auditEvents.map((event) => <div key={event.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><div><p className="text-sm text-slate-300">{event.summary}</p><p className="mt-1 text-xs text-slate-500">{event.actor?.name ?? "You"} · {event.action}</p></div><time className="text-xs text-slate-500">{new Date(event.createdAt).toLocaleString()}</time></div>) : <p className="py-3 text-sm text-slate-500">No changes recorded yet.</p>}</div></div>
                  </section>
                ) : null}

                {activeView === "apis" ? (
                  <>
                <section className="overflow-hidden rounded-xl border border-[#202630] bg-[#0d1117]">
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Workspace / {selectedProject.name}</p>
                      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">APIs</h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <input value={apiSearch} onChange={(event) => setApiSearch(event.target.value)} placeholder="Search APIs" aria-label="Search APIs" className="h-9 w-full border border-[#2a323d] bg-[#08090c] pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 sm:w-56" />
                      </label>
                      <button type="button" onClick={() => document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3 text-sm font-medium text-white hover:bg-blue-600"><Plus className="h-4 w-4" /> Create API</button>
                    </div>
                  </div>

                  <div className="mt-4 divide-y divide-[#202630] border-t border-[#202630]">
                    {visibleApis.map((api) => (
                      <button
                        key={api.id}
                        type="button"
                        onClick={() => selectApi(api.id)}
                        className={`grid w-full grid-cols-[58px_minmax(0,1fr)_80px_70px] items-center gap-3 px-4 py-3 text-left transition hover:bg-[#11161d] ${selectedApi?.id === api.id ? "bg-blue-500/6" : ""}`}
                      >
                        <span className={`method-badge ${methodClass(api.method)}`}>{api.method}</span>
                        <span className="min-w-0 truncate font-mono text-sm text-slate-200">{api.path}<span className="ml-2 font-sans text-xs text-slate-500">{api.name}</span></span>
                        <span className="text-xs text-slate-400">{api.statusCode}</span>
                        <span className={`text-xs ${api.enabled ? "text-emerald-400" : "text-slate-500"}`}>{api.enabled ? "Active" : "Disabled"}</span>
                      </button>
                    ))}
                    {!visibleApis.length ? <p className="px-4 py-8 text-center text-sm text-slate-500">{selectedProject.mockApis.length ? "No APIs match that search." : "No APIs yet. Create your first endpoint below."}</p> : null}
                  </div>
                </section>

                <section className="grid min-w-0 scroll-mt-20 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]" id="create-api-form">
                  <form onSubmit={handleCreateApi} className="min-w-0 rounded-xl border border-[#202630] bg-[#0d1117] p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Configuration</p>
                        <h2 className="mt-1 text-base font-semibold text-white">{editingApiId ? "Edit API" : "Create API"}</h2>
                      </div>
                      <Settings2 className="h-4 w-4 text-slate-500" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-1.5 text-xs text-slate-500">
                        API name
                        <input value={apiForm.name} onChange={(event) => setApiForm((current) => ({ ...current, name: event.target.value }))} aria-label="API name" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 focus:border-blue-500" placeholder="Users list" />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500">
                        Method
                        <select value={apiForm.method} onChange={(event) => setApiForm((current) => ({ ...current, method: event.target.value }))} aria-label="HTTP method" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 focus:border-blue-500">
                          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => <option key={method} value={method}>{method}</option>)}
                        </select>
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500 md:col-span-2">
                        Path
                        <input value={apiForm.path} onChange={(event) => setApiForm((current) => ({ ...current, path: event.target.value }))} aria-label="API path" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500" placeholder="/users or /users/:id" />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500">
                        Status code
                        <input type="number" min={200} max={599} value={apiForm.statusCode} onChange={(event) => setApiForm((current) => ({ ...current, statusCode: Number(event.target.value) }))} aria-label="Response status code" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 focus:border-blue-500" />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500">
                        Delay (ms)
                        <input type="number" min={0} max={60000} value={apiForm.delayMs} onChange={(event) => setApiForm((current) => ({ ...current, delayMs: Number(event.target.value) }))} aria-label="Response delay in milliseconds" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 focus:border-blue-500" />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500 md:col-span-2">
                        Description
                        <textarea value={apiForm.description} onChange={(event) => setApiForm((current) => ({ ...current, description: event.target.value }))} aria-label="API description" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 text-sm text-slate-100 focus:border-blue-500" rows={2} placeholder="Describe what this endpoint returns" />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500 md:col-span-2">
                          <span className="flex items-center justify-between">
                          <span>Response body · JSON</span>
                          <span className="flex items-center gap-3"><span className={`text-[11px] ${apiJsonError ? "text-rose-300" : "text-emerald-400"}`}>{apiJsonError ? "Invalid JSON" : "Valid JSON"}</span><button type="button" onClick={handleGenerateFromReference} className="text-[11px] font-medium text-blue-400 hover:text-blue-300">Generate 20+ random records</button></span>
                        </span>
                        <textarea value={apiForm.responseBody} onChange={(event) => setApiForm((current) => ({ ...current, responseBody: event.target.value }))} aria-label="JSON response body" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 font-mono text-xs leading-5 text-slate-100 focus:border-blue-500" rows={9} spellCheck={false} placeholder={'{"success": true}'} />
                      </label>
                      <label className="space-y-1.5 text-xs text-slate-500 md:col-span-2">
                        Response headers · JSON
                        <textarea value={apiForm.responseHeaders} onChange={(event) => setApiForm((current) => ({ ...current, responseHeaders: event.target.value }))} aria-label="JSON response headers" className="w-full border border-[#2a323d] bg-[#08090c] px-3 py-2 font-mono text-xs leading-5 text-slate-100 focus:border-blue-500" rows={2} spellCheck={false} placeholder={'{"Content-Type": "application/json"}'} />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={apiForm.enabled}
                          onChange={(event) => setApiForm((current) => ({ ...current, enabled: event.target.checked }))}
                          className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                        />
                        Enabled
                      </label>

                      <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60" disabled={pendingAction !== null || Boolean(apiJsonError)}>
                        {pendingAction === "api" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        {pendingAction === "api" ? "Saving..." : editingApiId ? "Save changes" : "Create API"}
                      </button>
                    </div>
                  </form>

                  <div className="min-w-0 space-y-4">
                    <section className="rounded-xl border border-[#202630] bg-[#0d1117] p-4 sm:p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Signature feature</p>
                          <h3 className="mt-1 text-sm font-semibold text-white">Live response preview</h3>
                        </div>
                        <span className={`rounded-md px-2 py-1 font-mono text-xs ${statusClass(apiForm.statusCode)}`}>{apiForm.statusCode} {apiForm.statusCode < 300 ? "OK" : apiForm.statusCode < 400 ? "Redirect" : apiForm.statusCode < 500 ? "Client error" : "Server error"}</span>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                        <span>application/json</span>
                        <span>{apiForm.delayMs}ms simulated delay</span>
                      </div>
                      {apiJsonError ? (
                        <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/6 p-3 text-xs text-rose-300">
                          <p className="font-medium">Invalid JSON</p>
                          <p className="mt-1 text-rose-200/80">{apiJsonError}</p>
                          <p className="mt-1 text-rose-200/70">Fix the response body or headers before creating this API.</p>
                        </div>
                      ) : (
                        <pre className="max-h-90 min-h-40 overflow-auto rounded-lg border border-[#202630] bg-[#08090c] p-3 font-mono text-xs leading-5 text-slate-300">{formatJsonString(apiForm.responseBody)}</pre>
                      )}
                    </section>

                    {selectedApi ? (
                      <>
                        <section className="rounded-xl border border-[#202630] bg-[#0d1117] p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-white">Test endpoint</h3>
                            <div className="flex items-center gap-2">
                              {selectedApi.scenarios.length ? (
                                <select aria-label="Scenario for endpoint test" value={testScenario} onChange={(event) => setTestScenario(event.target.value)} className="h-8 max-w-40 border border-[#2a323d] bg-[#08090c] px-2 text-xs text-slate-300">
                                  <option value="">Default response</option>
                                  {selectedApi.scenarios.map((scenario) => <option key={scenario.id} value={scenario.name} disabled={!scenario.enabled}>{scenario.name}{scenario.enabled ? "" : " (disabled)"}</option>)}
                                </select>
                              ) : null}
                              <button type="button" onClick={handleTestEndpoint} disabled={pendingAction !== null} className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#151b23] px-3 text-xs font-medium text-slate-200 hover:bg-[#202630] disabled:opacity-60">
                                {pendingAction === "test" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                {pendingAction === "test" ? "Sending..." : "Send"}
                              </button>
                            </div>
                          </div>
                          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[#202630] bg-[#08090c] p-2">
                            <span className={`method-badge shrink-0 ${methodClass(selectedApi.method)}`}>{selectedApi.method}</span>
                            <code className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-400">{endpointFor(selectedApi)}</code>
                            <button type="button" onClick={() => void copyText(endpointFor(selectedApi), "Endpoint copied")} className="shrink-0 rounded-md p-1.5 text-slate-500 hover:bg-[#151b23] hover:text-slate-200" aria-label="Copy endpoint">{copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}</button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <button type="button" onClick={() => setActiveView("docs")} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"><FileText className="h-3.5 w-3.5" /> View docs</button>
                            <div className="flex items-center gap-1"><button type="button" onClick={() => { setEditingApiId(selectedApi.id); setApiForm({ name: selectedApi.name, method: selectedApi.method, path: selectedApi.path, statusCode: selectedApi.statusCode, responseBody: selectedApi.responseBody, responseHeaders: selectedApi.responseHeaders, delayMs: selectedApi.delayMs, enabled: selectedApi.enabled, description: selectedApi.description ?? "" }); document.getElementById("create-api-form")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-[#151b23]">Edit API</button><button type="button" onClick={() => handleDeleteApi(selectedApi.id)} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div>
                          </div>

                        {apiResponse ? (
                          <div className="mt-4 border-t border-[#202630] pt-3">
                            <div className="mb-2 flex items-center justify-between text-xs">
                              <span className="text-slate-400">Last response</span>
                              <span className={statusTextClass(apiResponse.status)}>{apiResponse.status} · {apiResponse.elapsedMs}ms</span>
                            </div>
                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap wrap-break-word rounded-lg border border-[#202630] bg-[#08090c] p-3 font-mono text-xs leading-5 text-slate-300">{apiResponse.body}</pre>
                            <details className="mt-3">
                              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">Response headers</summary>
                              <pre className="mt-2 max-h-28 overflow-auto rounded-lg border border-[#202630] bg-[#08090c] p-2 font-mono text-[11px] leading-4 text-slate-400">{JSON.stringify(apiResponse.headers, null, 2)}</pre>
                            </details>
                          </div>
                        ) : null}
                        </section>
                      </>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#2a323d] p-6 text-sm text-slate-500">Create an API, then test its endpoint here.</div>
                    )}
                  </div>
                </section>

                {selectedApi ? (
                  <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                    <form onSubmit={handleCreateScenario} className="glass-panel p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-white">Response scenarios</h3>
                          <p className="mt-1 text-xs text-slate-500">Choose an alternate response for QA using <code className="font-mono">?scenario=name</code>.</p>
                        </div>
                        <Braces className="h-4 w-4 text-slate-500" />
                      </div>

                      <div className="space-y-4">
                        <input
                          value={scenarioForm.name}
                          onChange={(event) => setScenarioForm((current) => ({ ...current, name: event.target.value }))}
                          aria-label="Scenario name"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500"
                          placeholder="Scenario name (e.g. error)"
                        />
                        <textarea
                          value={scenarioForm.responseBody}
                          onChange={(event) => setScenarioForm((current) => ({ ...current, responseBody: event.target.value }))}
                          aria-label="Scenario response body"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500"
                          rows={6}
                          placeholder={'{"success": false}'}
                        />
                        <textarea
                          value={scenarioForm.responseHeaders}
                          onChange={(event) => setScenarioForm((current) => ({ ...current, responseHeaders: event.target.value }))}
                          aria-label="Scenario response headers"
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500"
                          rows={3}
                          placeholder={'{"Content-Type": "application/json"}'}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            type="number"
                            min={200}
                            max={599}
                            value={scenarioForm.statusCode}
                            onChange={(event) => setScenarioForm((current) => ({ ...current, statusCode: Number(event.target.value) }))}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500"
                          />
                          <input
                            type="number"
                            min={0}
                            max={60000}
                            value={scenarioForm.delayMs}
                            onChange={(event) => setScenarioForm((current) => ({ ...current, delayMs: Number(event.target.value) }))}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {scenarioJsonError ? <p role="alert" className="text-xs text-rose-300">Invalid scenario JSON. {scenarioJsonError}</p> : null}

                      <div className="mt-4 flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-slate-300">
                          <input
                            type="checkbox"
                            checked={scenarioForm.enabled}
                            onChange={(event) => setScenarioForm((current) => ({ ...current, enabled: event.target.checked }))}
                            className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                          />
                          Enabled
                        </label>
                        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60" disabled={pendingAction !== null || Boolean(scenarioJsonError)}>
                          <Plus className="h-4 w-4" />
                          {editingScenarioId ? "Save changes" : "Save scenario"}
                        </button>
                      </div>
                    </form>

                    <div className="rounded-xl border border-[#202630] bg-[#0d1117] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Saved scenarios</h3>
                        <span className="text-xs text-slate-500">{selectedApi.scenarios.length}</span>
                      </div>
                      {selectedApi.scenarios.length ? (
                        <div className="divide-y divide-[#202630]">
                          {selectedApi.scenarios.map((scenario) => (
                            <div key={scenario.id} className="flex items-center justify-between gap-3 py-2.5">
                              <div className="min-w-0">
                                <p className="truncate text-sm text-slate-200">{scenario.name}</p>
                                <p className="mt-0.5 truncate text-xs text-slate-500">{scenario.description || "Alternate response"} · {scenario.delayMs}ms</p>
                              </div>
                              <div className="flex shrink-0 items-center gap-1"><span className={`rounded-md px-2 py-1 font-mono text-[11px] ${statusClass(scenario.statusCode)}`}>{scenario.statusCode}{scenario.enabled ? "" : " · Off"}</span><button type="button" onClick={() => { setEditingScenarioId(scenario.id); setScenarioForm({ name: scenario.name, description: scenario.description ?? "", statusCode: scenario.statusCode, responseBody: scenario.responseBody, responseHeaders: scenario.responseHeaders, delayMs: scenario.delayMs, enabled: scenario.enabled }); }} className="rounded px-2 py-1 text-xs text-slate-300 hover:bg-[#151b23]">Edit</button><button type="button" disabled={pendingAction !== null} aria-label={`Delete scenario ${scenario.name}`} onClick={() => void handleDeleteScenario(scenario)} className="rounded px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-50">Delete</button></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No scenarios yet. Add one to simulate an error or an alternate state.</p>
                      )}
                    </div>

                    <div className="glass-panel p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white">Recent requests</h3>
                        <button type="button" onClick={() => setActiveView("requests")} className="text-xs text-blue-400 hover:text-blue-300">View all</button>
                      </div>

                      <div className="space-y-3">
                        {selectedApi.requestLogs.length > 0 ? (
                          selectedApi.requestLogs.map((log) => (
                            <div key={log.id} className="rounded-lg border border-[#202630] bg-[#08090c] p-3">
                              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                                <span>{log.method} {log.path}</span>
                                <span className={`rounded-md px-2 py-1 ${statusClass(log.statusCode)}`}>{log.statusCode}</span>
                              </div>
                              <div className="mt-2 text-xs text-slate-300">Response: {log.responseTimeMs ?? 0} ms</div>
                              <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap wrap-break-word text-[11px] text-slate-200">
                                {log.responseBody ? formatJsonString(log.responseBody) : "{}"}
                              </pre>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg border border-dashed border-[#2a323d] p-6 text-sm text-slate-500">No requests logged yet.</div>
                        )}
                      </div>
                    </div>
                  </section>
                ) : null}
                  </>
                ) : null}
              </>
            ) : (
              bootstrapped ? (
                <div className="rounded-xl border border-dashed border-[#2a323d] p-8 text-center">
                  <Database className="mx-auto h-6 w-6 text-slate-600" />
                  <h2 className="mt-3 text-base font-medium text-white">Create your first project</h2>
                  <p className="mt-1 text-sm text-slate-500">Projects keep your mock APIs organized in one workspace.</p>
                </div>
              ) : (
                <div role="status" className="rounded-xl border border-[#202630] bg-[#0d1117] p-5">
                  <div className="flex items-center gap-3">
                    <LoaderCircle className="h-4 w-4 animate-spin text-blue-400" />
                    <div>
                      <h2 className="text-sm font-medium text-white">Loading your workspace</h2>
                      <p className="mt-1 text-xs text-slate-500">Preparing your projects and API endpoints…</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2" aria-hidden="true">
                    <div className="h-3 w-2/5 animate-pulse rounded bg-[#151b23]" />
                    <div className="h-10 animate-pulse rounded-lg bg-[#11161d]" />
                    <div className="h-10 animate-pulse rounded-lg bg-[#11161d]" />
                  </div>
                </div>
              )
            )}
          </main>
        </div>

        {paletteOpen ? (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) setPaletteOpen(false); }}>
            <section role="dialog" aria-modal="true" aria-label="Command menu" className="w-full max-w-xl overflow-hidden rounded-xl border border-[#2a323d] bg-[#0d1117] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-[#202630] px-4">
                <Search className="h-4 w-4 shrink-0 text-slate-500" />
                <input
                  autoFocus
                  value={paletteQuery}
                  onChange={(event) => {
                    setPaletteQuery(event.target.value);
                    setPaletteSelectedIndex(0);
                  }}
                  placeholder="Search or jump to..."
                  aria-label="Search commands"
                  className="h-12 min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
                <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close command menu" className="rounded-md p-1 text-slate-500 hover:bg-[#151b23] hover:text-slate-200"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {filteredCommands.map(([label, view, Icon], index) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => {
                        setActiveView(view);
                        setPaletteOpen(false);
                        setPaletteQuery("");
                        setPaletteSelectedIndex(0);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-[#151b23] hover:text-white ${index === paletteSelectedIndex ? "bg-[#151b23] text-white" : "text-slate-300"}`}
                    >
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className="flex-1">{label}</span>
                      {view === "apis" ? <span className="text-xs text-slate-600">New endpoint</span> : null}
                    </button>
                  ))}
                {!filteredCommands.length ? <p className="px-3 py-6 text-center text-sm text-slate-500">No matching actions.</p> : null}
              </div>
              <div className="flex items-center gap-4 border-t border-[#202630] px-4 py-2.5 text-[11px] text-slate-600"><span><kbd className="font-mono">↑↓</kbd> Navigate</span><span><kbd className="font-mono">Enter</kbd> Select</span><span><kbd className="font-mono">Esc</kbd> Close</span><Command className="ml-auto h-3.5 w-3.5" /></div>
            </section>
          </div>
        ) : null}
        {toast ? <div role="status" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-[#2a323d] bg-[#11161d] px-4 py-3 text-sm text-slate-200 shadow-xl"><Check className="h-4 w-4 text-emerald-400" />{toast}</div> : null}
      </div>
    </div>
  );
}
