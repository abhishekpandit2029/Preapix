import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type WorkspaceProject = { id: string; mockApis?: Array<{ id: string; scenarios?: Array<{ id: string }> }> };

async function getWorkspaceProjects(userId: string): Promise<WorkspaceProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("preapix_workspaces").select("data").eq("user_id", userId).maybeSingle();
  if (error) return [];
  return (data?.data as { projects?: WorkspaceProject[] } | undefined)?.projects ?? [];
}

export async function getSessionUser(_request?: Request) {
  void _request;
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims) return null;
  const id = claims?.sub;
  const email = typeof claims?.email === "string" ? claims.email.trim().toLowerCase() : "";
  if (typeof id !== "string" || !email) return null;
  const metadata = claims.user_metadata as { name?: unknown; full_name?: unknown } | undefined;
  const preferredName = typeof metadata?.name === "string" ? metadata.name : typeof metadata?.full_name === "string" ? metadata.full_name : "";
  const name = (preferredName.trim() || email.split("@")[0]).slice(0, 80);
  const createdAt = typeof claims.created_at === "string" ? new Date(claims.created_at) : new Date();
  return { id, email, name, createdAt };
}

export async function canAccessProject(userId: string, projectId: string, minimumRole: "viewer" | "editor" = "viewer") {
  void minimumRole;
  return (await getWorkspaceProjects(userId)).some((project) => project.id === projectId);
}

export async function getProjectRole(userId: string, projectId: string) {
  return await canAccessProject(userId, projectId) ? "owner" : null;
}

export async function canAccessMockApi(userId: string, projectId: string, mockApiId: string, minimumRole: "viewer" | "editor" = "viewer") {
  void minimumRole;
  const project = (await getWorkspaceProjects(userId)).find((item) => item.id === projectId);
  return Boolean(project?.mockApis?.some((api) => api.id === mockApiId));
}

export async function canAccessScenario(userId: string, projectId: string, mockApiId: string, scenarioId: string, minimumRole: "viewer" | "editor" = "viewer") {
  void minimumRole;
  const project = (await getWorkspaceProjects(userId)).find((item) => item.id === projectId);
  const api = project?.mockApis?.find((item) => item.id === mockApiId);
  return Boolean(api?.scenarios?.some((scenario) => scenario.id === scenarioId));
}
