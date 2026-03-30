class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const root = this.dataset.root || ".";

    this.innerHTML = `
      <footer class="mx-auto mt-10 max-w-7xl rounded-[2rem] bg-panel-night px-6 py-8 text-white shadow-shell sm:px-8">
        <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div class="space-y-4">
            <p class="text-xs font-extrabold uppercase tracking-[0.34em] text-sky/80">Gleispreis</p>
            <h2 class="max-w-xl font-display text-4xl leading-none tracking-[-0.04em] text-balance sm:text-5xl">
              Preisvergleich fuer Zugreisen in DACH und angrenzendes Europa.
            </h2>
            <p class="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              Dieser Prototyp zeigt einen Meta-Search-Ansatz fuer Bahnpreise:
              mehrere Anbieter, klare Preisfuehrung, flexible Daten und ein
              schneller Weg von der Inspiration zur Verbindung.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <a href="${root}/index.html#suche" class="rounded-[1.4rem] border border-white/12 bg-white/6 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/10">
              <span class="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.25em] text-sky/80">Suche</span>
              <strong class="text-base">Neue Verbindung starten</strong>
            </a>
            <a href="${root}/index.html#top-strecken" class="rounded-[1.4rem] border border-white/12 bg-white/6 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/10">
              <span class="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.25em] text-sky/80">Strecken</span>
              <strong class="text-base">Beliebte Routen ansehen</strong>
            </a>
            <a href="${root}/core/pages/ergebnisse.html?from=Salzburg&to=Muenchen&tripType=oneway&outbound=2026-04-21&return=&passengers=1&travelClass=2&sort=price" class="rounded-[1.4rem] border border-white/12 bg-white/6 px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white/10">
              <span class="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.25em] text-sky/80">Demo Flow</span>
              <strong class="text-base">Beispielsuche oeffnen</strong>
            </a>
            <div class="rounded-[1.4rem] border border-white/12 bg-white/6 px-4 py-4">
              <span class="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.25em] text-sky/80">Hinweis</span>
              <strong class="text-base">Alle Preise und Anbieter sind Mock-Daten.</strong>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
