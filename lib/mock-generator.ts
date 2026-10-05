export function generateFromReference(reference: unknown): unknown {
  const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
  const words = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Quinn", "Reese"];
  const domains = ["example.com", "sample.dev", "mail.test"];
  const visit = (value: unknown, keyName = ""): unknown => {
    const key = keyName.toLowerCase();
    if (Array.isArray(value)) {
      if (value.length > 0 && value.length < 20 && value.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
        return Array.from({ length: 20 }, (_, index) => visit(value[index % value.length], keyName));
      }
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
