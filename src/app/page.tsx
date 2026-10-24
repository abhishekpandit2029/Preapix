"use client";

import Link from "next/link";
import { useState } from "react";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--f-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono" });

/* Every color below is set with !important under .pxl so old rules in
   globals.css (body/main/button/a/pre styles) cannot override them. */
const css = `
.pxl{background:#fff!important;color:#0A0A0F!important;color-scheme:light;font-family:var(--f-sans),system-ui,sans-serif}
.pxl a{text-decoration:none!important}
.pxl button{font:inherit;border:0;cursor:pointer}
.pxl .c-ink{color:#0A0A0F!important}.pxl .c-white{color:#fff!important}.pxl .c-mut{color:#52525b!important}
.pxl .c-zinc{color:#71717a!important}.pxl .c-soft{color:#d4d4d8!important}.pxl .c-vio{color:#c4b5fd!important}
.pxl .b-ink{background:#0A0A0F!important}.pxl .b-white{background:#fff!important}.pxl .b-gray{background:#f4f4f5!important}
.pxl .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:999px;padding:1rem 1.75rem;font-weight:600;border:1px solid transparent;transition:background .15s,border-color .15s}
.pxl .btn-pur{background:#7C3AED!important;color:#fff!important;box-shadow:0 14px 40px -12px rgba(124,58,237,.8)}
.pxl .btn-pur:hover{background:#6D28D9!important}
.pxl .btn-ink{background:#0A0A0F!important;color:#fff!important;padding:.65rem 1.25rem;font-size:.875rem}
.pxl .btn-ink:hover{background:#3f3f46!important}
.pxl .btn-out{background:#fff!important;color:#0A0A0F!important;border-color:#d4d4d8!important}
.pxl .btn-out:hover{border-color:#0A0A0F!important}
.pxl .send{background:#7C3AED!important;color:#fff!important;border-radius:.5rem;padding:.4rem 1rem;font-size:.875rem;font-weight:600}
.pxl .send:hover{background:#6D28D9!important}
.pxl .scn{background:transparent!important;color:#52525b!important}
.pxl .scn:hover{background:#f4f4f5!important}
.pxl .scn .code{color:#71717a!important}.pxl .scn .code.err{color:#e11d48!important}
.pxl .scn.on{background:#0A0A0F!important;color:#fff!important}
.pxl .scn.on .code{color:#c4b5fd!important}
.pxl .tab{background:transparent!important;color:#a1a1aa!important;border-radius:.375rem;padding:.25rem .75rem;font-family:var(--f-mono);font-size:.75rem}
.pxl .tab:hover{color:#fff!important}
.pxl .tab.on{background:#fff!important;color:#0A0A0F!important}
.pxl .copy{background:transparent!important;color:#a1a1aa!important;display:inline-flex;align-items:center;gap:.375rem;padding:0 .5rem;font-family:var(--f-mono);font-size:.75rem}
.pxl .copy:hover{color:#fff!important}
.pxl .badge{background:#0A0A0F!important;color:#fff!important}
.pxl .navlink{color:#52525b!important}.pxl .navlink:hover{color:#0A0A0F!important}
.pxl .flink{color:#0A0A0F!important}.pxl .flink:hover{color:#7C3AED!important}
.pxl .row:hover{background:#fafafa!important}
.pxl pre,.pxl code{background:transparent!important;font-family:var(--f-mono),ui-monospace,monospace}
.pxl .ln{color:#52525b!important;user-select:none;display:inline-block;width:1.75rem;text-align:right;margin-right:1.25rem}
.pxl .dl{display:flex;gap:.75rem;padding:.75rem 1rem;font-family:var(--f-mono),ui-monospace,monospace;font-size:.8rem;overflow-x:auto;white-space:nowrap}
.pxl .dl-del{background:#fff!important;color:#71717a!important}.pxl .dl-del span.t{text-decoration:line-through}
.pxl .dl-add{background:#f5f3ff!important;color:#6d28d9!important}
.pxl .seg{display:inline-flex;padding:.25rem;border-radius:999px;background:#e4e4e7!important}
.pxl .seg button{background:transparent!important;color:#52525b!important;border-radius:999px;padding:.4rem 1.1rem;font-size:.875rem;font-weight:600}
.pxl .seg button.on{background:#0A0A0F!important;color:#fff!important}
.pxl .envbox{background:#fff!important;color:#0A0A0F!important;border:1px solid #e4e4e7;border-radius:.75rem;padding:1rem 1.1rem;font-family:var(--f-mono),ui-monospace,monospace;font-size:.8rem;line-height:1.8;overflow-x:auto;white-space:nowrap}
.pxl .envbox .k{color:#71717a!important}.pxl .envbox .v{color:#7C3AED!important;font-weight:600}
`;

function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="18" fill="#7C3AED" />
        <path
          d="M22 47V17h11a10 10 0 0 1 0 20H22"
          fill="none"
          stroke="#fff"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="45"
          cy="46"
          r="5"
          fill="#0A0A0F"
          stroke="#fff"
          strokeWidth="3"
        />
      </svg>
      <span
        className="text-[22px] font-bold tracking-tight"
        style={{ color: "#0A0A0F" }}
      >
        preapix
      </span>
    </span>
  );
}

const scenarios = [
  {
    code: 200,
    label: "Success",
    ms: 142,
    body: `{\n  "success": true,\n  "data": [\n    { "id": 1, "name": "Jordan Lee" },\n    { "id": 2, "name": "Priya Nair" }\n  ]\n}`,
  },
  {
    code: 204,
    label: "Empty",
    ms: 96,
    body: `{\n  "success": true,\n  "data": []\n}`,
  },
  {
    code: 422,
    label: "Validation",
    ms: 120,
    body: `{\n  "success": false,\n  "errors": {\n    "email": "Enter a valid email"\n  }\n}`,
  },
  {
    code: 500,
    label: "Server error",
    ms: 310,
    body: `{\n  "success": false,\n  "error": "INTERNAL_ERROR"\n}`,
  },
];

const log = [
  [
    "200",
    "Real endpoints",
    "Every mock gets a URL your app can call. Choose the method, route, headers and status.",
  ],
  [
    "404",
    "Every state",
    "Save success, empty and error scenarios per endpoint and switch between them while you build.",
  ],
  [
    "429",
    "Slow on purpose",
    "Add a delay to see how loading skeletons and retries behave on a bad connection.",
  ],
  [
    "201",
    "Shared contracts",
    "Keep endpoints in one project so designers, frontend and QA call the same data.",
  ],
];

const snippets: Record<string, string> = {
  fetch: `const res = await fetch("https://preapix.app/api/mock/px_key/users");\nconst users = await res.json();`,
  axios: `const { data } = await axios.get(\n  "https://preapix.app/api/mock/px_key/users"\n);`,
  curl: `curl https://preapix.app/api/mock/px_key/users`,
};

export default function PreapixLanding() {
  const [i, setI] = useState(0);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("fetch");
  const [copied, setCopied] = useState(false);
  const [env, setEnv] = useState<"mock" | "live">("mock");
  const s = scenarios[i];
  const bad = s.code >= 400;

  const send = () => {
    setBusy(true);
    setTimeout(() => setBusy(false), 600);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[tab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { }
  };

  return (
    <div
      className={`pxl ${sans.variable} ${mono.variable} min-h-screen antialiased`}
      style={{ overflowX: "clip" }}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <header className="flex items-center justify-between py-5">
          <Link href="/" aria-label="Preapix home">
            <Logo />
          </Link>
          <nav
            className="hidden gap-8 text-[15px] font-medium md:flex"
            aria-label="Main"
          >
            <a href="#log" className="navlink">
              Features
            </a>
            <a href="#flow" className="navlink">
              How it works
            </a>
            <a href="#code" className="navlink">
              Developers
            </a>
          </nav>
          <Link href="/dashboard" className="btn btn-ink">
            Open workspace
          </Link>
        </header>

        <section className="pb-12 pt-10 sm:pb-14 sm:pt-16">
          <h1 className="c-ink max-w-[14ch] text-[clamp(3rem,8.5vw,7.4rem)] font-bold leading-[.92] tracking-[-0.055em]">
            Don&rsquo;t wait for the backend.
          </h1>
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="c-mut max-w-[44ch] text-xl leading-8">
              Describe a response and get a live endpoint in seconds. Test
              success, empty, error and slow states before the real API exists.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn btn-pur">
                Create your first API <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#flow" className="btn btn-out">
                See how it works
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Live example">
          <div className="b-white overflow-hidden rounded-[28px] border border-zinc-200 shadow-[0_30px_80px_-40px_rgba(10,10,15,.35)]">
            <div
              className="flex items-center gap-3 border-b border-zinc-200 p-3 sm:p-4"
              style={{ background: "#fafafa" }}
            >
              <span className="badge rounded-lg px-3 py-1.5 font-mono text-xs font-bold">
                GET
              </span>
              <code className="c-mut min-w-0 flex-1 truncate text-sm">
                https://preapix.app/api/mock/px_a81b2/users
              </code>
              <button onClick={send} className="send">
                Send
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
              <div
                role="tablist"
                aria-label="Scenario"
                className="flex min-w-0 gap-1 overflow-x-auto border-b border-zinc-200 p-3 md:flex-col md:border-b-0 md:border-r"
              >
                {scenarios.map((sc, n) => (
                  <button
                    key={sc.code}
                    role="tab"
                    aria-selected={n === i}
                    onClick={() => {
                      setI(n);
                      send();
                    }}
                    className={`scn flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition ${n === i ? "on" : ""}`}
                  >
                    <span
                      className={`code font-mono text-xs font-bold ${sc.code >= 400 ? "err" : ""}`}
                    >
                      {sc.code}
                    </span>
                    <span className="font-medium">{sc.label}</span>
                  </button>
                ))}
              </div>
              <div className="b-ink min-w-0 p-5 sm:p-7">
                <div className="flex items-center gap-3 text-sm">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: busy
                        ? "#71717a"
                        : bad
                          ? "#fb7185"
                          : "#a78bfa",
                    }}
                  />
                  <span className="c-soft font-mono">
                    {busy ? "Sending…" : `${s.code} · ${s.ms} ms`}
                  </span>
                </div>
                <pre
                  className={`mt-4 min-h-[190px] overflow-x-auto text-[13.5px] leading-7 transition-opacity ${busy ? "opacity-30" : ""}`}
                  style={{ color: "#f4f4f5" }}
                >
                  {s.body}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="log" className="pt-16 sm:pt-24">
          <h2 className="c-ink max-w-[16ch] text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.045em]">
            Built the way your network tab reads.
          </h2>
          <ul className="mt-8 border-t border-zinc-200">
            {log.map(([code, title, text]) => (
              <li
                key={title}
                className="row grid grid-cols-1 items-center gap-3 border-b border-zinc-200 py-7 transition-colors sm:grid-cols-[110px_1fr_1.3fr] sm:gap-8 sm:px-4"
              >
                <span className="badge w-fit rounded-md px-2.5 py-1 font-mono text-sm font-bold">
                  {code}
                </span>
                <h3 className="c-ink text-2xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="c-mut leading-7">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section id="flow" className="b-gray mt-16 py-14 sm:mt-24 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <h2 className="c-ink max-w-[16ch] text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.045em]">
            From idea to endpoint in three moves.
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              [
                "Paste the JSON",
                "Start with the response your screen needs. No schema first.",
              ],
              [
                "Pick the behavior",
                "Set the status code, delay and extra scenarios.",
              ],
              [
                "Call it",
                "Use the URL in your app. Swap the base URL when the real API ships.",
              ],
            ].map(([t, d], n) => (
              <li
                key={t}
                className="relative pt-6"
                style={{ borderTop: "2px solid #0A0A0F" }}
              >
                <span
                  className="absolute -top-[7px] left-0 h-3 w-3 rounded-full"
                  style={{
                    background: "#7C3AED",
                    boxShadow: "0 0 0 4px #f4f4f5",
                  }}
                />
                <span className="c-zinc font-mono text-sm">Step {n + 1}</span>
                <h3 className="c-ink mt-3 text-2xl font-semibold tracking-tight">
                  {t}
                </h3>
                <p className="c-mut mt-3 leading-7">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="code" className="b-white py-14 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <div className="mx-auto max-w-[640px] text-center">
            <h2 className="c-ink text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[1] tracking-[-0.045em]">
              One fetch call. Zero waiting.
            </h2>
            <p className="c-mut mt-5 text-lg leading-8">
              Use the mock URL wherever you would call your real API. Your app
              code stays exactly the same.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
            <div className="b-ink flex min-w-0 flex-col overflow-hidden rounded-3xl shadow-[0_40px_80px_-30px_rgba(10,10,15,.45)]">
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,.12)" }}
              >
                <div role="tablist" className="flex gap-1">
                  {Object.keys(snippets).map((k) => (
                    <button
                      key={k}
                      role="tab"
                      aria-selected={tab === k}
                      onClick={() => setTab(k)}
                      className={`tab ${tab === k ? "on" : ""}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
                <button
                  onClick={copy}
                  className="copy"
                  aria-label="Copy snippet"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre
                className="overflow-x-auto px-5 py-6 text-[13.5px] leading-7"
                style={{ color: "#e4e4e7" }}
              >
                <code>
                  {snippets[tab].split("\n").map((line, n) => (
                    <div key={n}>
                      <span className="ln">{n + 1}</span>
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
              <div
                className="flex flex-1 flex-col px-5 py-5"
                style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}
              >
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: "#a78bfa" }}
                  />
                  <span className="c-soft font-mono">
                    Response &middot; 200 &middot; 142 ms
                  </span>
                </div>
                <pre
                  className="mt-3 overflow-x-auto text-[13px] leading-6"
                  style={{ color: "#a1a1aa" }}
                >
                  {scenarios[0].body}
                </pre>
              </div>
            </div>

            <div className="b-gray flex min-w-0 flex-col justify-between rounded-3xl p-7 sm:p-9">
              <div>
                <h3 className="c-ink text-2xl font-semibold tracking-tight">
                  Going live is one line
                </h3>
                <p className="c-mut mt-3 leading-7">
                  Keep the base URL in one place. Point it at Preapix while you
                  build, then at your real API when it ships.
                </p>
                <div
                  className="seg mt-6"
                  role="tablist"
                  aria-label="Environment"
                >
                  <button
                    role="tab"
                    aria-selected={env === "mock"}
                    className={env === "mock" ? "on" : ""}
                    onClick={() => setEnv("mock")}
                  >
                    While building
                  </button>
                  <button
                    role="tab"
                    aria-selected={env === "live"}
                    className={env === "live" ? "on" : ""}
                    onClick={() => setEnv("live")}
                  >
                    At launch
                  </button>
                </div>
                <div className="envbox mt-4">
                  <div>
                    <span className="k">.env</span>
                  </div>
                  <div>
                    <span className="k">API_URL=</span>
                    <span className="v">
                      {env === "mock"
                        ? "https://preapix.app/api/mock/px_key"
                        : "https://your-production-api"}
                    </span>
                  </div>
                </div>
                <p className="c-zinc mt-3 text-sm">
                  Your code keeps calling <code>{"${API_URL}/users"}</code>.
                  Nothing else changes.
                </p>
              </div>
              <Link href="/dashboard" className="btn btn-pur mt-8 self-start">
                Open the workspace <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <Link href="/" aria-label="Preapix home">
          <Logo />
        </Link>
        <p className="c-zinc text-sm">
          Mock APIs for the work between design and delivery.
        </p>
        <Link href="/dashboard" className="flink text-sm font-semibold">
          Open workspace
        </Link>
      </footer>
    </div>
  );
}
