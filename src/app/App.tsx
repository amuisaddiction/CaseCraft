export function App() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <a href="/" className="font-serif text-2xl font-bold tracking-tight">HAQ<span className="text-vermilion">.</span></a>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">The Case File</span>
      </header>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 md:pt-24">
        <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-vermilion">Your complaint. Your next step.</p>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight md:text-7xl">
          Tell me what<br />happened.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
          Start with the story. We’ll help organise the facts, evidence, and next practical step.
        </p>
        <div className="mt-10 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl border border-line bg-card p-5 shadow-sm md:p-8">
          <label htmlFor="complaint" className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted">
            What went wrong?
          </label>
          <textarea
            id="complaint"
            rows={6}
            className="w-full resize-y border-0 bg-transparent text-lg leading-8 outline-none placeholder:text-muted/70 focus:ring-0"
            placeholder="Maine ek phone order kiya tha…"
          />
          <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-sm text-sm text-muted">Use Wispr Flow to dictate, or type here. Review facts before using any draft.</p>
            <button type="button" className="rounded-full bg-vermilion px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-vermilion focus:ring-offset-2">
              Build my case file
            </button>
          </div>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">Process guidance, not legal advice. This starter screen is a UI scaffold; case extraction and saving are not implemented yet.</p>
      </section>
    </main>
  );
}
