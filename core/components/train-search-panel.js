class TrainSearchPanel extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const variant = this.dataset.variant || "hero";
    const resultsHref = this.dataset.resultsHref || "./core/pages/ergebnisse.html";
    const locationListId = `locations-${Math.random().toString(36).slice(2, 8)}`;
    const panelClass =
      variant === "compact"
        ? "glass-panel rounded-[1.8rem] border border-white/60 px-4 py-4 shadow-float"
        : "rounded-[2rem] border border-white/12 bg-white/8 p-4 shadow-glow backdrop-blur sm:p-5";
    const layoutClass =
      variant === "compact"
        ? "grid gap-3 xl:grid-cols-[1.15fr_1.15fr_0.95fr_0.95fr_0.8fr_0.8fr_auto]"
        : "grid gap-3 xl:grid-cols-[1.08fr_1.08fr_0.92fr_0.92fr_0.75fr_0.75fr_auto]";
    const inputClass =
      variant === "compact"
        ? "h-14 rounded-[1.25rem] border border-night/10 bg-white px-4 text-sm font-semibold text-night outline-none transition placeholder:text-slate/70 focus:border-coral focus:ring-2 focus:ring-coral/10"
        : "h-14 rounded-[1.25rem] border border-white/10 bg-white/95 px-4 text-sm font-semibold text-night outline-none transition placeholder:text-slate/70 focus:border-coral focus:ring-2 focus:ring-coral/10";
    const selectClass =
      variant === "compact"
        ? "h-14 rounded-[1.25rem] border border-night/10 bg-white px-4 text-sm font-semibold text-night outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10"
        : "h-14 rounded-[1.25rem] border border-white/10 bg-white/95 px-4 text-sm font-semibold text-night outline-none transition focus:border-coral focus:ring-2 focus:ring-coral/10";
    const buttonLabel = variant === "compact" ? "Suche aktualisieren" : "Preise vergleichen";

    this.innerHTML = `
      <section class="${panelClass}">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[11px] font-extrabold uppercase tracking-[0.3em] ${
              variant === "compact" ? "text-slate" : "text-sky/80"
            }">Suchmaske</p>
            <h2 class="mt-1 font-display text-2xl leading-none tracking-[-0.04em] ${
              variant === "compact" ? "text-night" : "text-white"
            }">
              ${
                variant === "compact"
                  ? "Verbindung anpassen"
                  : "Finde guenstigere Zugtickets ohne Angebotschaos."
              }
            </h2>
          </div>

          <div class="inline-flex rounded-full ${
            variant === "compact" ? "bg-night/6" : "bg-white/10"
          } p-1">
            <button
              type="button"
              @click="setTripType('oneway')"
              :class="form.tripType === 'oneway' ? '${variant === "compact" ? "bg-night text-white" : "bg-white text-night"}' : '${
                variant === "compact" ? "text-slate" : "text-white/80"
              }'"
              class="rounded-full px-4 py-2 text-sm font-bold transition"
            >Einfach</button>
            <button
              type="button"
              @click="setTripType('return')"
              :class="form.tripType === 'return' ? '${variant === "compact" ? "bg-night text-white" : "bg-white text-night"}' : '${
                variant === "compact" ? "text-slate" : "text-white/80"
              }'"
              class="rounded-full px-4 py-2 text-sm font-bold transition"
            >Hin und zurueck</button>
          </div>
        </div>

        <form @submit.prevent="handleSearchSubmit('${resultsHref}')" class="mt-4 grid gap-4">
          <div class="${layoutClass}">
            <label class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Von</span>
              <div class="relative">
                <input
                  list="${locationListId}"
                  x-model="form.from"
                  type="text"
                  class="${inputClass}"
                  placeholder="Wien"
                />
              </div>
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Nach</span>
              <div class="relative">
                <input
                  list="${locationListId}"
                  x-model="form.to"
                  type="text"
                  class="${inputClass}"
                  placeholder="Berlin"
                />
                <button
                  type="button"
                  @click="swapStations()"
                  class="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full ${
                    variant === "compact" ? "bg-night/6 text-night" : "bg-night/18 text-white"
                  }"
                  aria-label="Von und Nach tauschen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0-4 4m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" />
                  </svg>
                </button>
              </div>
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Hinfahrt</span>
              <input x-model="form.outbound" type="date" class="${inputClass}" />
            </label>

            <label class="grid gap-2" x-show="form.tripType === 'return'" x-cloak>
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Rueckfahrt</span>
              <input x-model="form.return" type="date" class="${inputClass}" />
            </label>
            <label class="grid gap-2" x-show="form.tripType !== 'return'" x-cloak>
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Rueckfahrt</span>
              <div class="${inputClass} flex items-center text-slate/72">Nur fuer Hin und Rueck</div>
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Reisende</span>
              <select x-model="form.passengers" class="${selectClass}">
                <option value="1">1 Person</option>
                <option value="2">2 Personen</option>
                <option value="3">3 Personen</option>
                <option value="4">4 Personen</option>
              </select>
            </label>

            <label class="grid gap-2">
              <span class="text-xs font-bold uppercase tracking-[0.2em] ${
                variant === "compact" ? "text-slate" : "text-white/68"
              }">Klasse</span>
              <select x-model="form.travelClass" class="${selectClass}">
                <option value="2">2. Klasse</option>
                <option value="1">1. Klasse</option>
                <option value="night">Liegewagen</option>
              </select>
            </label>

            <button
              type="submit"
              class="mt-auto inline-flex h-14 items-center justify-center rounded-[1.25rem] bg-coral px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-coral-deep"
            >${buttonLabel}</button>
          </div>

          <datalist id="${locationListId}">
            <template x-for="location in locations" :key="location">
              <option :value="location"></option>
            </template>
          </datalist>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-2">
              <template x-for="route in routes.slice(0, 4)" :key="route.key">
                <button
                  type="button"
                  @click="applyQuickRoute(route)"
                  class="rail-chip rounded-full ${
                    variant === "compact"
                      ? "border border-night/10 bg-white px-3 py-2 text-sm text-night"
                      : "border border-white/14 bg-white/10 px-3 py-2 text-sm text-white"
                  } transition hover:-translate-y-0.5"
                >
                  <span x-text="route.from + ' nach ' + route.to"></span>
                </button>
              </template>
            </div>

            <p class="text-sm ${
              variant === "compact" ? "text-slate" : "text-white/74"
            }">
              Mock-Daten, offline klickbar, Preisvergleich ueber Betreiber und Plattformen.
            </p>
          </div>
        </form>
      </section>
    `;

    if (window.Alpine && typeof window.Alpine.initTree === "function") {
      window.Alpine.initTree(this);
    }
  }
}

customElements.define("train-search-panel", TrainSearchPanel);
