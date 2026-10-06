import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, CheckCircle2, Code2, Database, Layers3, Sparkles, Zap } from "lucide-react";

const featureList = [
  "Define mock APIs with real HTTP methods and routes",
  "Generate production-like endpoints instantly",
  "Test loading, empty, and error states before backend is ready",
  "Capture request logs for debugging and QA",
];

const workflowSteps = [
  { title: "Define API", detail: "Set method, path, status code and response JSON" },
  { title: "Generate endpoint", detail: "Share a short URL that reads the saved API from Supabase" },
  { title: "Consume in UI", detail: "Hook it into your frontend and exercise edge cases" },
  { title: "Swap later", detail: "Replace the mock base URL with the real backend when ready" },
];

export default function Home() {
  return (
    <main className="landing-shell min-h-screen text-slate-50">
      <div className="app-shell px-4 pb-28 pt-5 sm:px-8 lg:px-10">
        <header className="glass-panel sticky top-4 z-20 mb-10 rounded-xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center" aria-label="Preapix home"><Image src="/preapix-logo-primary.svg" alt="Preapix" width={170} height={48} className="brand-logo-light h-10 w-auto" /><Image src="/preapix-logo-primary-dark.svg" alt="Preapix" width={170} height={48} className="brand-logo-dark h-10 w-auto" /></Link>

            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <a href="#product" className="transition hover:text-white">Product</a>
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#how-it-works" className="transition hover:text-white">How it works</a>
              <a href="#docs" className="transition hover:text-white">Docs</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <section id="product" className="landing-hero grid items-center gap-12 rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 px-5 py-10 sm:px-9 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12 lg:py-16">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/8 px-3 py-1.5 text-micro font-semibold uppercase tracking-[0.16em] text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              A mock backend for frontend teams
            </div>

            <h1 className="max-w-[12ch] text-3xl font-semibold leading-[1.06] tracking-[-0.055em] text-white sm:text-6xl">
              Build the interface. Let the backend catch up.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              Define an API contract, get a real endpoint, and keep shipping while the service is still in progress. Exercise success, empty, and failure states with responses you control.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_5px_18px_rgba(37,99,235,0.18)] transition hover:bg-blue-600"
              >
                Create your first API
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/50 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/80"
              >
                Explore dashboard
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
              {featureList.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="landing-code-card overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--background)] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-micro uppercase tracking-[0.2em] text-slate-300">
                  Demo project
                </div>
              </div>

              <div className="code-surface overflow-x-auto rounded-lg p-4 font-mono text-sm text-slate-200">
                <div className="flex items-center justify-between pb-4 text-slate-400">
                  <span className="flex items-center gap-2"><span className="method-badge method-get">GET</span><code>/users</code></span>
                  <span className="status-success rounded-md px-2 py-1 text-micro font-semibold">200 OK</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div>{"{"}</div>
                  <div className="pl-4 text-blue-300">&quot;success&quot;: true,</div>
                  <div className="pl-4 text-sky-300">&quot;data&quot;: [</div>
                  <div className="pl-8 text-slate-200">{'{ "id": 1, "name": "Abhishek", "email": "abhishek@example.com" }'}</div>
                  <div className="pl-4 text-sky-300">]</div>
                  <div>{"}"}</div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Example endpoint</span>
                  <span className="status-text-info">GET · 200</span>
                </div>
                <div className="mt-3 break-all text-sm text-slate-200">
                  https://your-app.com/api/mock/px_project_key/users
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Database, title: "Real endpoints", text: "Turn definitions into working HTTP routes with realistic responses and delays." },
            { icon: Layers3, title: "Scenarios", text: "Create success, error and empty states for every API contract." },
            { icon: Zap, title: "Fast iteration", text: "Validate loading states, status handling and UI flows before backend integration." },
            { icon: Code2, title: "Developer workflow", text: "Document and share endpoints with QA, frontend and backend teams in one place." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-panel rounded-xl p-5">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-400/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </section>

        <section id="how-it-works" className="mt-12 sm:mt-16">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">How it works</p>
            <h2 className="text-3xl font-semibold text-white">DEFINE API → GENERATE REAL ENDPOINT</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="glass-panel rounded-xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Step {index + 1}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{step.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="docs" className="mt-12 rounded-xl border border-slate-700 bg-slate-900/70 p-5 sm:mt-16 sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Developer-first docs</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Use mock data in the real app flow</h2>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 code-surface overflow-x-auto rounded-lg p-5 font-mono text-sm text-slate-200">
            <div className="text-blue-300">const response = await fetch(</div>
            <div className="break-all pl-6 text-sky-300">&quot;https://your-app.com/api/mock/px_project_key/users&quot;</div>
            <div className="text-blue-300">);</div>
            <div className="mt-2 text-blue-300">const data = await response.json();</div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 rounded-3xl border border-[var(--border)] bg-gradient-to-br from-blue-500/10 via-[var(--surface)] to-[var(--surface)] p-6 sm:mt-16 sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Made for the in-between</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Keep your frontend moving while services take shape.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">Build against realistic response shapes, cover edge cases early, then switch to the production API when it is ready.</p>
            <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600">Start building <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Frontend teams", "QA and test flows", "Backend integration", "Design prototypes"].map((item) => <div key={item} className="glass-panel rounded-xl p-4 text-sm font-medium text-slate-200"><CheckCircle2 className="mb-3 h-4 w-4 text-emerald-400" />{item}</div>)}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-3xl sm:mt-16" aria-labelledby="faq-heading">
          <div className="mb-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Frequently asked</p><h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight text-white">A few useful details</h2></div>
          <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]/75 px-5">
            {[
              ["Where is my mock data stored?", "Your projects, API definitions, and request previews are stored in your Supabase database and are available when you sign in on another device."],
              ["Can I generate realistic collections?", "Yes. Add a representative JSON object and use Generate 20+ random records to expand arrays while keeping the same response structure."],
              ["What happens when the backend is ready?", "Replace the mock base URL in your frontend with the production service. Your definitions stay in Supabase for later development and QA."],
            ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-200"><span>{question}</span><ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-open:rotate-90" /></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{answer}</p></details>)}
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] py-8 text-xs text-slate-500 sm:mt-16 sm:flex-row">
          <Link href="/" className="font-semibold tracking-[0.16em] text-slate-300">PREAPIX</Link>
          <p>Mock APIs for the work between design and delivery.</p>
          <Link href="/dashboard" className="text-slate-400 transition hover:text-white">Open workspace <ArrowRight className="ml-1 inline h-3 w-3" /></Link>
        </footer>
      </div>
    </main>
  );
}
