class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const root = this.dataset.root || ".";
    const page = this.dataset.page || "home";
    const homeHref = page === "home" ? "#top" : `${root}/index.html`;
    const searchHref = page === "home" ? "#suche" : "#suchleiste";
    const routesHref = page === "home" ? "#top-strecken" : `${root}/index.html#top-strecken`;
    const compareHref = page === "home" ? "#warum-vergleichen" : `${root}/index.html#warum-vergleichen`;
    const calendarHref = page === "home" ? "#preisradar" : `${root}/index.html#preisradar`;

    const navItems =
      page === "results"
        ? [
            { id: "home", label: "Start", href: homeHref },
            { id: "search", label: "Suche", href: searchHref },
            { id: "routes", label: "Top Strecken", href: routesHref },
            { id: "compare", label: "Warum vergleichen", href: compareHref },
          ]
        : [
            { id: "search", label: "Suche", href: searchHref },
            { id: "routes", label: "Top Strecken", href: routesHref },
            { id: "compare", label: "Warum vergleichen", href: compareHref },
            { id: "calendar", label: "Preisradar", href: calendarHref },
          ];

    const navMarkup = navItems
      .map(
        ({ href, label, id }) => `
          <a
            href="${href}"
            ${page === id ? 'aria-current="page"' : ""}
            class="rounded-full px-4 py-2 text-sm font-semibold transition ${
              page === id
                ? "bg-night text-white shadow-float"
                : "text-slate hover:bg-white/70 hover:text-night"
            }"
          >${label}</a>
        `,
      )
      .join("");

    const ctaHref =
      page === "results"
        ? "#suchleiste"
        : `${root}/core/pages/ergebnisse.html?from=Wien&to=Berlin&tripType=oneway&outbound=2026-04-18&return=&passengers=1&travelClass=2&sort=price`;

    this.innerHTML = `
      <header x-data="{ open: false }" class="relative z-40">
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.8rem] border border-white/60 bg-white/70 px-4 py-3 shadow-shell backdrop-blur md:px-6">
          <a href="${homeHref}" class="flex items-center gap-3">
            <span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-hero font-display text-lg font-bold text-white shadow-float">GP</span>
            <span class="flex flex-col">
              <strong class="font-display text-base font-semibold tracking-[-0.03em] text-night">Gleispreis</strong>
              <span class="text-xs font-medium text-slate">Zugpreise in einem Blick vergleichen</span>
            </span>
          </a>

          <nav class="hidden items-center gap-2 md:flex">
            ${navMarkup}
          </nav>

          <div class="hidden md:block">
            <a
              href="${ctaHref}"
              class="inline-flex min-h-11 items-center justify-center rounded-full bg-coral px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-coral-deep"
            >Preise finden</a>
          </div>

          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-night/10 bg-white/85 text-night md:hidden"
            @click="open = !open"
            :aria-expanded="open.toString()"
            aria-label="Navigation umschalten"
          >
            <svg x-show="!open" x-cloak xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <svg x-show="open" x-cloak xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div x-show="open" x-cloak x-transition.opacity.duration.180ms class="absolute inset-x-0 top-full mt-3 md:hidden">
          <div class="rounded-[1.6rem] border border-white/70 bg-cloud/95 p-3 shadow-shell backdrop-blur">
            <nav class="grid gap-2">
              ${navMarkup}
              <a
                href="${ctaHref}"
                class="inline-flex min-h-11 items-center justify-center rounded-full bg-coral px-5 text-sm font-bold text-white"
              >Preise finden</a>
            </nav>
          </div>
        </div>
      </header>
    `;

    if (window.Alpine && typeof window.Alpine.initTree === "function") {
      window.Alpine.initTree(this);
    }
  }
}

customElements.define("site-header", SiteHeader);
