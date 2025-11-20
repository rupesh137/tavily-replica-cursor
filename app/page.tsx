import Link from "next/link";

const navLinks = [
  "Features",
  "Use Cases",
  "Benchmarks",
  "Pricing",
  "Enterprise",
  "Careers",
  "Blog",
];

const highlightStats = [
  { label: "Requests / day", value: "2B+" },
  { label: "Avg latency", value: "110ms" },
  { label: "SLA uptime", value: "99.99%" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6">
        <div className="my-6 flex items-center justify-between rounded-full bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-200 px-6 py-2 text-sm font-medium text-slate-800 shadow-lg">
          <span className="text-lg">🎉</span>
          <p className="flex-1 px-4 text-center">
            Tavily-style relaunch · Manage secure web access for your agents.{" "}
            <a
              href="https://nextjs.org/blog"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Read more
            </a>
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-between rounded-full border border-slate-200 bg-white px-6 py-3 shadow-lg">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-sky-400 to-amber-300 text-white">
              ↑
            </span>
            Tavily-esque
          </Link>
          <div className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            {navLinks.map((item) => (
              <button
                key={item}
                className="transition hover:text-slate-900"
                type="button"
              >
                {item}
              </button>
            ))}
            <div className="flex items-center gap-1">
              <span>Docs</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-slate-500">Operational</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
              Log in
            </button>
            <button className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black">
              Sign up
            </button>
          </div>
        </nav>

        <header className="grid gap-10 py-16 md:grid-cols-[1.25fr,1fr] md:items-center">
          <div className="space-y-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Connect Your Agent to the Web
            </p>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold leading-tight text-slate-900 md:text-6xl">
                Power web access with fast, secure API keys.
              </h1>
              <p className="text-lg text-slate-600">
                Build the Internet of Agents with managed web access, search,
                and monitoring APIs that scale effortlessly and stay compliant.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-400/50 transition hover:bg-black"
              >
                Go to Dashboard
              </Link>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Talk to sales
              </button>
            </div>
            <div className="flex flex-wrap gap-6 rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-inner">
              {highlightStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-100 to-slate-200 p-6 shadow-2xl shadow-indigo-200">
              <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-400 to-sky-300 shadow-xl md:block"></div>
              <div className="absolute -right-8 bottom-12 hidden h-32 w-32 rounded-3xl bg-gradient-to-br from-amber-200 to-orange-300 shadow-xl md:block"></div>
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Real-time status
                  </p>
                  <p className="text-3xl font-semibold text-slate-900">Operational</p>
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-500">
                    API key activity
                  </p>
                  <div className="space-y-2">
                    {["Production", "Sandbox", "Internal QA"].map((label, index) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span>{label}</span>
                        <span
                          className={`flex h-2 w-20 overflow-hidden rounded-full bg-slate-200`}
                        >
                          <span
                            className={`h-full rounded-full ${
                              index === 0
                                ? "w-3/4 bg-emerald-400"
                                : index === 1
                                  ? "w-2/4 bg-indigo-400"
                                  : "w-1/3 bg-rose-300"
                            }`}
                          ></span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="text-sm font-semibold text-slate-500">Next-gen stack</p>
                  <p className="text-lg font-medium text-slate-900">
                    Built with streaming search, live browsing, and safe execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
