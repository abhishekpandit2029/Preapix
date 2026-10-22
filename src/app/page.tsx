import Link from "next/link";
import Image from "next/image";
import { ArrowDownRight, ArrowRight, Braces, Check, ChevronRight, CirclePlay, Code2, Database, Layers3, Sparkles, Zap } from "lucide-react";

const features = [
  { icon: Database, number: "01", title: "Real endpoints", text: "Turn an API definition into a URL your app can call. Set the method, route, status, headers, and delay." },
  { icon: Layers3, number: "02", title: "Every state", text: "Build success, empty, and error scenarios so your interface is ready for the real world." },
  { icon: Zap, number: "03", title: "Fast feedback", text: "Run a preview in your workspace and inspect its response before wiring it into your app." },
  { icon: Code2, number: "04", title: "Made to share", text: "Keep endpoint contracts in a project and give teammates a clear path to the data." },
];

const steps = [
  ["Shape the response", "Start with the JSON your interface needs."],
  ["Choose the behavior", "Add status codes, delay, and named scenarios."],
  ["Build against it", "Call your endpoint from the app and keep moving."],
];

export default function Home() {
  return (
    <main className="landing-shell min-h-screen overflow-hidden text-slate-50">
      <div className="landing-wrap mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-12">
        <header className="landing-nav sticky top-0 z-30 -mx-5 flex items-center justify-between px-5 py-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <Link href="/" className="flex items-center" aria-label="Preapix home">
            <Image src="/preapix-logo-light-purple.svg" alt="Preapix" width={170} height={48} className="brand-logo-light h-9 w-auto" />
            <Image src="/preapix-logo-purple.svg" alt="Preapix" width={170} height={48} className="brand-logo-dark h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex" aria-label="Main navigation">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#workflow" className="landing-nav-link">How it works</a>
            <a href="#docs" className="landing-nav-link">For developers</a>
          </nav>
          <Link href="/dashboard" className="landing-nav-cta">Open workspace <ArrowRight className="h-3.5 w-3.5" /></Link>
        </header>

        <section id="product" className="landing-hero-v2 relative mt-5 grid items-center gap-12 rounded-[28px] px-6 py-12 sm:px-10 sm:py-16 lg:min-h-[610px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-14">
          <div className="relative z-10 max-w-xl">
            <div className="landing-kicker"><span className="landing-kicker-dot" /><Sparkles className="h-3.5 w-3.5" /> MOCK APIS FOR PRODUCT TEAMS</div>
            <h1 className="mt-7 max-w-[11ch] text-[clamp(2.7rem,6vw,5.3rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-white">Ship the UI.<br /><span className="landing-gradient-text">Skip the wait.</span></h1>
            <p className="mt-6 max-w-[46ch] text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Build real frontend flows while your backend is still taking shape. Define a response, get a working endpoint, and test every state along the way.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="landing-primary-cta">Create your first API <ArrowRight className="h-4 w-4" /></Link>
              <a href="#workflow" className="landing-secondary-cta"><CirclePlay className="h-4 w-4" /> See how it works</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-400">
              {["Real HTTP endpoints", "Custom response scenarios", "No backend required"].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check className="h-3.5 w-3.5 text-violet-300" />{item}</span>)}
            </div>
          </div>

          <div className="landing-preview-wrap relative mx-auto w-full max-w-[650px] lg:ml-auto">
            <div className="landing-preview-glow" />
            <div className="landing-preview-window relative overflow-hidden rounded-2xl">
              <div className="landing-preview-topbar flex items-center justify-between px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2"><span className="landing-window-dot bg-[#c2a8ff]" /><span className="landing-window-dot bg-[#9b7bdc]" /><span className="landing-window-dot bg-[#6840c8]" /></div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400"><span className="landing-live-dot" /> DEMO WORKSPACE</div>
                <Braces className="h-4 w-4 text-slate-500" />
              </div>
              <div className="grid min-h-[355px] md:grid-cols-[158px_minmax(0,1fr)]">
                <aside className="landing-preview-sidebar hidden p-4 md:block">
                  <p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Workspace</p>
                  <div className="landing-preview-nav active"><Database className="h-3.5 w-3.5" /> My APIs</div>
                  <div className="landing-preview-nav"><Layers3 className="h-3.5 w-3.5" /> Scenarios</div>
                  <div className="landing-preview-nav"><Code2 className="h-3.5 w-3.5" /> Docs</div>
                  <div className="mt-7 border-t border-white/8 pt-4"><p className="px-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Endpoints</p><div className="mt-3 rounded-lg bg-white/[.06] px-2.5 py-2 text-[11px] text-slate-300"><span className="mr-1.5 text-violet-300">GET</span> /users</div><div className="mt-1 rounded-lg px-2.5 py-2 text-[11px] text-slate-500"><span className="mr-1.5 text-violet-300">POST</span> /users</div></div>
                </aside>
                <div className="min-w-0 p-4 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-indigo-300">Endpoint preview</p><h2 className="mt-1.5 text-lg font-semibold tracking-tight text-white">User directory</h2></div><span className="landing-status-pill"><span /> Ready</span></div>
                  <div className="landing-endpoint-bar mt-5 flex min-w-0 items-center gap-3 rounded-lg px-3 py-2.5"><span className="landing-method">GET</span><code className="min-w-0 truncate text-xs text-slate-300">/api/mock/px_a81b2.../users</code><span className="ml-auto shrink-0 rounded-md bg-violet-400/10 px-2 py-1 font-mono text-[10px] text-violet-300">200</span></div>
                  <div className="landing-code-editor mt-3 overflow-hidden rounded-lg">
                    <div className="flex items-center justify-between border-b border-white/[.07] px-4 py-2.5"><span className="text-[10px] font-medium text-slate-500">RESPONSE · JSON</span><span className="text-[10px] text-slate-500">application/json</span></div>
                    <pre className="overflow-x-auto px-4 py-4 font-mono text-[11px] leading-[1.9] text-slate-300 sm:text-xs"><span className="text-slate-500">1  </span><span className="text-slate-400">&#123;</span>{"\n"}<span className="text-slate-500">2  </span>  <span className="text-violet-300">&quot;success&quot;</span>: <span className="text-violet-200">true</span>,{"\n"}<span className="text-slate-500">3  </span>  <span className="text-violet-300">&quot;data&quot;</span>: [&#123;{"\n"}<span className="text-slate-500">4  </span>    <span className="text-violet-300">&quot;id&quot;</span>: <span className="text-violet-200">1</span>, <span className="text-violet-300">&quot;name&quot;</span>: <span className="text-violet-200">&quot;Jordan Lee&quot;</span>,{"\n"}<span className="text-slate-500">5  </span>    <span className="text-violet-300">&quot;email&quot;</span>: <span className="text-violet-200">&quot;jordan@example.com&quot;</span>{"\n"}<span className="text-slate-500">6  </span>  &#125;]{"\n"}<span className="text-slate-500">7  </span><span className="text-slate-400">&#125;</span></pre>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[.07] bg-white/[.025] px-3.5 py-3"><div><p className="text-[10px] text-slate-500">LAST TEST</p><p className="mt-1 text-xs text-slate-300">Response returned in <span className="font-mono text-violet-300">142 ms</span></p></div><span className="landing-run-button"><CirclePlay className="h-3.5 w-3.5" /> Run preview</span></div>
                </div>
              </div>
            </div>
            <div className="landing-floating-note"><span className="landing-note-icon"><Zap className="h-4 w-4" /></span><span><strong>Backend not ready?</strong><small>Your frontend can be.</small></span></div>
          </div>
        </section>

        <section id="features" className="landing-section mt-24 sm:mt-32">
          <div className="landing-section-heading"><div><p className="landing-overline">A better way to build in parallel</p><h2>Everything your frontend<br className="hidden sm:block" /> needs to keep moving.</h2></div><p>From the first response shape to the final integration, keep your team working against a contract that feels real.</p></div>
          <div className="landing-feature-grid mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, number, title, text }) => <article key={number} className="landing-feature-card"><div className="flex items-center justify-between"><span className="landing-feature-number">{number}</span><Icon className="h-5 w-5 text-indigo-300" /></div><h3>{title}</h3><p>{text}</p><ArrowDownRight className="landing-card-arrow h-4 w-4" /></article>)}
          </div>
        </section>

        <section id="workflow" className="landing-workflow mt-24 grid gap-10 rounded-[24px] p-6 sm:mt-32 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:p-14">
          <div><p className="landing-overline">A simple workflow</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">From idea to API<br />in a few minutes.</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">No infrastructure to set up. Just define what your interface needs and make it callable.</p><Link href="/dashboard" className="landing-inline-link mt-7">Build your first endpoint <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="landing-steps">{steps.map(([title, text], index) => <div className="landing-step" key={title}><span className="landing-step-index">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight className="ml-auto h-4 w-4 text-slate-600" /></div>)}</div>
        </section>

        <section id="docs" className="landing-docs mt-24 grid gap-8 overflow-hidden rounded-[24px] p-6 sm:mt-32 sm:p-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:p-12">
          <div><p className="landing-overline">Fits your existing stack</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white">One fetch call.<br />A lot less waiting.</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">Use your mock endpoint anywhere you would call your real API. When the service is ready, switch the base URL.</p><Link href="/dashboard" className="landing-inline-link mt-7">Open the workspace <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="landing-snippet"><div className="flex items-center justify-between border-b border-white/[.07] px-5 py-3"><span className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-500">JavaScript</span><span className="flex items-center gap-1.5 text-[10px] text-slate-500"><span className="landing-live-dot" /> Works with fetch</span></div><pre className="overflow-x-auto p-5 font-mono text-xs leading-7 text-slate-300"><span className="text-violet-300">const</span> response = <span className="text-violet-300">await</span> fetch({"\n"}  <span className="text-violet-200">&quot;https://your-app.com/api/mock/px_key/users&quot;</span>{"\n"});{"\n"}<span className="text-violet-300">const</span> users = <span className="text-violet-300">await</span> response.json();</pre></div>
        </section>

        <footer className="landing-footer mt-20 flex flex-col items-start justify-between gap-5 border-t border-white/[.08] pt-7 sm:mt-28 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center" aria-label="Preapix home"><Image src="/preapix-logo-light-purple.svg" alt="Preapix" width={150} height={43} className="brand-logo-light h-7 w-auto" /><Image src="/preapix-logo-purple.svg" alt="Preapix" width={150} height={43} className="brand-logo-dark h-7 w-auto" /></Link>
          <p>Mock APIs for the work between design and delivery.</p>
          <Link href="/dashboard">Open workspace <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
        </footer>
      </div>
    </main>
  );
}
