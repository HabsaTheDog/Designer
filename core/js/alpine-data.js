(function () {
  function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(dateString, offset) {
    const date = new Date(`${dateString}T00:00:00`);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  function normalizeLocation(value) {
    return (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\b(hbf|hb|bahnhof)\b/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function routeKeyFromInputs(from, to) {
    return `${normalizeLocation(from)}-${normalizeLocation(to)}`;
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("de-AT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(dateString, options) {
    return new Intl.DateTimeFormat("de-AT", options).format(new Date(`${dateString}T00:00:00`));
  }

  function formatCalendarLabel(dateString) {
    return formatDate(dateString, { weekday: "short", day: "2-digit", month: "2-digit" });
  }

  function minutesToClock(totalMinutes) {
    const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
    const hours = String(Math.floor(wrapped / 60)).padStart(2, "0");
    const minutes = String(wrapped % 60).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function durationLabel(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${String(mins).padStart(2, "0")}m`;
  }

  function dayNumber(dateString) {
    return Math.floor(new Date(`${dateString}T00:00:00`).getTime() / 86400000);
  }

  const baseOutbound = addDays(isoToday(), 24);
  const baseReturn = addDays(baseOutbound, 3);

  const ROUTES = [
    {
      key: "wien-berlin",
      from: "Wien",
      to: "Berlin",
      stations: "Wien Hbf - Berlin Hbf",
      baseLow: 49,
      floor: 39,
      priceSeed: 2,
      teaser: "Direkte ICE- und Nightjet-Optionen, viele Plattformpreise.",
      insight: "Stark gefragt am Freitagabend, oft guenstiger unter der Woche.",
      accent: "from-coral/85 to-signal/85",
    },
    {
      key: "wien-zuerich",
      from: "Wien",
      to: "Zuerich",
      stations: "Wien Hbf - Zuerich HB",
      baseLow: 54,
      floor: 44,
      priceSeed: 5,
      teaser: "Nachtzug und Tagesverbindungen mit hoher Komfort-Spanne.",
      insight: "Nachtzug lohnt sich frueh, Tageszuege schwanken staerker.",
      accent: "from-sky/90 to-petrol/90",
    },
    {
      key: "salzburg-muenchen",
      from: "Salzburg",
      to: "Muenchen",
      stations: "Salzburg Hbf - Muenchen Hbf",
      baseLow: 21,
      floor: 17,
      priceSeed: 1,
      teaser: "Kurze Strecke, Direktzuege und deutlich sichtbare Reseller-Unterschiede.",
      insight: "Morgens haeufig teurer, mittags oft die guenstigsten Slots.",
      accent: "from-signal/85 to-coral/80",
    },
    {
      key: "graz-prag",
      from: "Graz",
      to: "Prag",
      stations: "Graz Hbf - Praha hl.n.",
      baseLow: 43,
      floor: 34,
      priceSeed: 7,
      teaser: "Mehrere Umstiege, darum lohnt der Vergleich besonders stark.",
      insight: "Direkte Slots sind selten, Flex-Tickets halten Preise stabiler.",
      accent: "from-petrol/85 to-sky/85",
    },
    {
      key: "innsbruck-hamburg",
      from: "Innsbruck",
      to: "Hamburg",
      stations: "Innsbruck Hbf - Hamburg Hbf",
      baseLow: 67,
      floor: 55,
      priceSeed: 4,
      teaser: "Lange Strecke mit klaren Preisabstaenden zwischen Shop und Plattform.",
      insight: "Nachmittags steigen die Preise schnell, fruehe Zuege sind stabiler.",
      accent: "from-sky/75 to-coral/85",
    },
  ];

  const LOCATIONS = Array.from(
    new Set(
      ROUTES.flatMap((route) => [route.from, route.to]).sort((left, right) =>
        left.localeCompare(right, "de"),
      ),
    ),
  );

  const RAW_OFFERS = [
    {
      id: "wb-ber-1",
      routeKey: "wien-berlin",
      provider: "OEBB",
      operator: "Railjet Xpress + ICE",
      departureMinutes: 372,
      duration: 493,
      transfers: 0,
      price: 49,
      originalPrice: 74,
      ticketType: "Sparschiene",
      comfortTags: ["WLAN", "Ruhebereich", "Direkt"],
      badge: "Best Price",
      comfortScore: 86,
    },
    {
      id: "wb-ber-2",
      routeKey: "wien-berlin",
      provider: "Deutsche Bahn",
      operator: "ICE Sprinter",
      departureMinutes: 438,
      duration: 476,
      transfers: 0,
      price: 62,
      originalPrice: 88,
      ticketType: "Flexpreis",
      comfortTags: ["WLAN", "Bordbistro", "Direkt"],
      badge: "Schnell",
      comfortScore: 94,
    },
    {
      id: "wb-ber-3",
      routeKey: "wien-berlin",
      provider: "Trainline",
      operator: "OEBB + Deutsche Bahn",
      departureMinutes: 568,
      duration: 517,
      transfers: 1,
      price: 54,
      originalPrice: 76,
      ticketType: "Smart Flex",
      comfortTags: ["WLAN", "Steckdosen"],
      badge: "Beliebt",
      comfortScore: 84,
    },
    {
      id: "wb-ber-4",
      routeKey: "wien-berlin",
      provider: "Omio",
      operator: "Regiojet + ICE",
      departureMinutes: 670,
      duration: 560,
      transfers: 1,
      price: 45,
      originalPrice: 65,
      ticketType: "Saver",
      comfortTags: ["WLAN", "Familienbereich"],
      badge: "Deal",
      comfortScore: 76,
    },
    {
      id: "wb-ber-5",
      routeKey: "wien-berlin",
      provider: "Westbahn",
      operator: "Westbahn + ICE",
      departureMinutes: 842,
      duration: 525,
      transfers: 1,
      price: 58,
      originalPrice: 81,
      ticketType: "Flex Comfort",
      comfortTags: ["WLAN", "Snackservice", "Ruhebereich"],
      badge: "Komfort",
      comfortScore: 88,
    },
    {
      id: "wb-ber-6",
      routeKey: "wien-berlin",
      provider: "Trainline",
      operator: "Nightjet",
      departureMinutes: 1330,
      duration: 655,
      transfers: 0,
      price: 69,
      originalPrice: 99,
      ticketType: "Night Flex",
      comfortTags: ["Nachtzug", "WLAN", "Direkt"],
      badge: "Nachtzug",
      comfortScore: 89,
    },
    {
      id: "wz-1",
      routeKey: "wien-zuerich",
      provider: "OEBB",
      operator: "Railjet Xpress",
      departureMinutes: 402,
      duration: 468,
      transfers: 0,
      price: 54,
      originalPrice: 81,
      ticketType: "Sparschiene",
      comfortTags: ["WLAN", "Direkt", "Ruhebereich"],
      badge: "Direkt",
      comfortScore: 87,
    },
    {
      id: "wz-2",
      routeKey: "wien-zuerich",
      provider: "Trainline",
      operator: "Railjet Xpress",
      departureMinutes: 525,
      duration: 472,
      transfers: 0,
      price: 57,
      originalPrice: 83,
      ticketType: "Smart Flex",
      comfortTags: ["WLAN", "Direkt", "Steckdosen"],
      badge: "Beliebt",
      comfortScore: 85,
    },
    {
      id: "wz-3",
      routeKey: "wien-zuerich",
      provider: "Omio",
      operator: "Nightjet",
      departureMinutes: 1285,
      duration: 624,
      transfers: 0,
      price: 59,
      originalPrice: 89,
      ticketType: "Night Saver",
      comfortTags: ["Nachtzug", "WLAN", "Direkt"],
      badge: "Night Deal",
      comfortScore: 86,
    },
    {
      id: "wz-4",
      routeKey: "wien-zuerich",
      provider: "Deutsche Bahn",
      operator: "Railjet + ICE",
      departureMinutes: 460,
      duration: 501,
      transfers: 1,
      price: 63,
      originalPrice: 91,
      ticketType: "Flexpreis",
      comfortTags: ["WLAN", "Bordbistro", "Flex"],
      badge: "Flexibel",
      comfortScore: 91,
    },
    {
      id: "wz-5",
      routeKey: "wien-zuerich",
      provider: "OEBB",
      operator: "RJX Panorama",
      departureMinutes: 748,
      duration: 484,
      transfers: 0,
      price: 68,
      originalPrice: 95,
      ticketType: "Relax",
      comfortTags: ["WLAN", "Direkt", "Panoramawagen"],
      badge: "Panorama",
      comfortScore: 93,
    },
    {
      id: "wz-6",
      routeKey: "wien-zuerich",
      provider: "Trainline",
      operator: "Nightjet Premium",
      departureMinutes: 1312,
      duration: 610,
      transfers: 0,
      price: 74,
      originalPrice: 108,
      ticketType: "Night Flex",
      comfortTags: ["Nachtzug", "WLAN", "Privatabteil"],
      badge: "Premium Nacht",
      comfortScore: 95,
    },
    {
      id: "sm-1",
      routeKey: "salzburg-muenchen",
      provider: "Deutsche Bahn",
      operator: "EC Direkt",
      departureMinutes: 394,
      duration: 102,
      transfers: 0,
      price: 21,
      originalPrice: 32,
      ticketType: "Super Sparpreis",
      comfortTags: ["WLAN", "Direkt"],
      badge: "Best Price",
      comfortScore: 80,
    },
    {
      id: "sm-2",
      routeKey: "salzburg-muenchen",
      provider: "OEBB",
      operator: "Railjet Direkt",
      departureMinutes: 460,
      duration: 108,
      transfers: 0,
      price: 24,
      originalPrice: 35,
      ticketType: "Sparschiene",
      comfortTags: ["WLAN", "Direkt", "Ruhebereich"],
      badge: "Direkt",
      comfortScore: 84,
    },
    {
      id: "sm-3",
      routeKey: "salzburg-muenchen",
      provider: "Trainline",
      operator: "Meridian",
      departureMinutes: 611,
      duration: 112,
      transfers: 0,
      price: 23,
      originalPrice: 34,
      ticketType: "Smart Saver",
      comfortTags: ["WLAN", "Direkt"],
      badge: "Beliebt",
      comfortScore: 79,
    },
    {
      id: "sm-4",
      routeKey: "salzburg-muenchen",
      provider: "Westbahn",
      operator: "Westbahn + S-Bahn",
      departureMinutes: 782,
      duration: 134,
      transfers: 1,
      price: 19,
      originalPrice: 31,
      ticketType: "Saver",
      comfortTags: ["WLAN", "Snackservice"],
      badge: "Deal",
      comfortScore: 72,
    },
    {
      id: "sm-5",
      routeKey: "salzburg-muenchen",
      provider: "Omio",
      operator: "EC Flex",
      departureMinutes: 1018,
      duration: 104,
      transfers: 0,
      price: 27,
      originalPrice: 38,
      ticketType: "Flex",
      comfortTags: ["WLAN", "Direkt", "Flex"],
      badge: "Flex",
      comfortScore: 83,
    },
    {
      id: "sm-6",
      routeKey: "salzburg-muenchen",
      provider: "Trainline",
      operator: "Railjet Abend",
      departureMinutes: 1135,
      duration: 109,
      transfers: 0,
      price: 22,
      originalPrice: 34,
      ticketType: "Saver",
      comfortTags: ["WLAN", "Direkt"],
      badge: "Abends guenstig",
      comfortScore: 78,
    },
    {
      id: "gp-1",
      routeKey: "graz-prag",
      provider: "OEBB",
      operator: "Railjet + EuroCity",
      departureMinutes: 371,
      duration: 397,
      transfers: 1,
      price: 43,
      originalPrice: 67,
      ticketType: "Sparschiene",
      comfortTags: ["WLAN", "Ruhebereich"],
      badge: "Best Price",
      comfortScore: 82,
    },
    {
      id: "gp-2",
      routeKey: "graz-prag",
      provider: "Deutsche Bahn",
      operator: "Railjet + ICE",
      departureMinutes: 423,
      duration: 388,
      transfers: 1,
      price: 51,
      originalPrice: 74,
      ticketType: "Flexpreis",
      comfortTags: ["WLAN", "Bordbistro", "Flex"],
      badge: "Beste Gesamtwahl",
      comfortScore: 90,
    },
    {
      id: "gp-3",
      routeKey: "graz-prag",
      provider: "Trainline",
      operator: "EC + Regiojet",
      departureMinutes: 560,
      duration: 422,
      transfers: 1,
      price: 45,
      originalPrice: 69,
      ticketType: "Smart Saver",
      comfortTags: ["WLAN", "Steckdosen"],
      badge: "Beliebt",
      comfortScore: 80,
    },
    {
      id: "gp-4",
      routeKey: "graz-prag",
      provider: "Omio",
      operator: "RJ + Nightjet",
      departureMinutes: 1188,
      duration: 531,
      transfers: 1,
      price: 39,
      originalPrice: 63,
      ticketType: "Night Saver",
      comfortTags: ["Nachtzug", "WLAN"],
      badge: "Nacht Deal",
      comfortScore: 78,
    },
    {
      id: "gp-5",
      routeKey: "graz-prag",
      provider: "OEBB",
      operator: "Railjet Direkt via Wien",
      departureMinutes: 928,
      duration: 405,
      transfers: 0,
      price: 58,
      originalPrice: 79,
      ticketType: "Flex Comfort",
      comfortTags: ["WLAN", "Direkt", "Ruhebereich"],
      badge: "Direkt",
      comfortScore: 88,
    },
    {
      id: "gp-6",
      routeKey: "graz-prag",
      provider: "Trainline",
      operator: "Regiojet Comfort",
      departureMinutes: 1090,
      duration: 412,
      transfers: 1,
      price: 47,
      originalPrice: 70,
      ticketType: "Relax",
      comfortTags: ["WLAN", "Snackservice"],
      badge: "Komfort",
      comfortScore: 85,
    },
    {
      id: "ih-1",
      routeKey: "innsbruck-hamburg",
      provider: "Deutsche Bahn",
      operator: "ICE Direkt",
      departureMinutes: 344,
      duration: 467,
      transfers: 0,
      price: 67,
      originalPrice: 98,
      ticketType: "Super Sparpreis",
      comfortTags: ["WLAN", "Direkt", "Bordbistro"],
      badge: "Schnell",
      comfortScore: 90,
    },
    {
      id: "ih-2",
      routeKey: "innsbruck-hamburg",
      provider: "OEBB",
      operator: "Railjet + ICE",
      departureMinutes: 404,
      duration: 482,
      transfers: 1,
      price: 61,
      originalPrice: 94,
      ticketType: "Sparschiene",
      comfortTags: ["WLAN", "Ruhebereich"],
      badge: "Best Price",
      comfortScore: 84,
    },
    {
      id: "ih-3",
      routeKey: "innsbruck-hamburg",
      provider: "Trainline",
      operator: "ICE + Metronom",
      departureMinutes: 570,
      duration: 498,
      transfers: 1,
      price: 64,
      originalPrice: 95,
      ticketType: "Smart Flex",
      comfortTags: ["WLAN", "Steckdosen"],
      badge: "Beliebt",
      comfortScore: 83,
    },
    {
      id: "ih-4",
      routeKey: "innsbruck-hamburg",
      provider: "Omio",
      operator: "Nightjet + ICE",
      departureMinutes: 1265,
      duration: 699,
      transfers: 1,
      price: 59,
      originalPrice: 87,
      ticketType: "Night Saver",
      comfortTags: ["Nachtzug", "WLAN"],
      badge: "Nacht Deal",
      comfortScore: 79,
    },
    {
      id: "ih-5",
      routeKey: "innsbruck-hamburg",
      provider: "Westbahn",
      operator: "Westbahn + ICE",
      departureMinutes: 815,
      duration: 534,
      transfers: 1,
      price: 70,
      originalPrice: 101,
      ticketType: "Flex Comfort",
      comfortTags: ["WLAN", "Snackservice", "Flex"],
      badge: "Flexibel",
      comfortScore: 86,
    },
    {
      id: "ih-6",
      routeKey: "innsbruck-hamburg",
      provider: "Deutsche Bahn",
      operator: "ICE Ruhebereich",
      departureMinutes: 993,
      duration: 475,
      transfers: 0,
      price: 73,
      originalPrice: 104,
      ticketType: "Komfort",
      comfortTags: ["WLAN", "Direkt", "Ruhebereich"],
      badge: "Komfort",
      comfortScore: 92,
    },
  ];

  const PROVIDERS = ["OEBB", "Deutsche Bahn", "Westbahn", "Trainline", "Omio"];
  const FILTERS = [
    { key: "direct", label: "Direkt" },
    { key: "flex", label: "Flex-Ticket" },
    { key: "morning", label: "Morgens" },
    { key: "evening", label: "Abends" },
    { key: "wifi", label: "WLAN" },
  ];
  const SORT_OPTIONS = [
    { key: "price", label: "Preis" },
    { key: "duration", label: "Dauer" },
    { key: "comfort", label: "Komfort" },
  ];

  function cloneForm(overrides) {
    return {
      from: "Wien",
      to: "Berlin",
      tripType: "oneway",
      outbound: baseOutbound,
      return: baseReturn,
      passengers: "1",
      travelClass: "2",
      sort: "price",
      ...overrides,
    };
  }

  function serializeQuery(form) {
    const params = new URLSearchParams();
    params.set("from", form.from || "");
    params.set("to", form.to || "");
    params.set("tripType", form.tripType || "oneway");
    params.set("outbound", form.outbound || "");
    params.set("return", form.tripType === "return" ? form.return || "" : "");
    params.set("passengers", form.passengers || "1");
    params.set("travelClass", form.travelClass || "2");
    params.set("sort", form.sort || "price");
    return params.toString();
  }

  function buildSearchHref(basePath, form) {
    return `${basePath}?${serializeQuery(form)}`;
  }

  function routeForInputs(from, to) {
    const key = routeKeyFromInputs(from, to);
    return ROUTES.find((route) => route.key === key) || null;
  }

  function routeForKey(routeKey) {
    return ROUTES.find((route) => route.key === routeKey) || null;
  }

  function travelClassAdjustment(travelClass) {
    if (travelClass === "1") return 24;
    if (travelClass === "night") return 12;
    return 0;
  }

  function baseCalendarPrice(route, dateString) {
    const pattern = [-4, 7, 12, -2, 10, 18, 6, -1, 14];
    const date = new Date(`${dateString}T00:00:00`);
    const patternValue = pattern[(dayNumber(dateString) + route.priceSeed) % pattern.length];
    const weekday = date.getDay();
    const weekend = weekday === 5 ? 7 : weekday === 6 ? 12 : 0;
    return Math.max(route.floor, route.baseLow + patternValue + weekend);
  }

  function decorateOffer(offer, dateString, travelClass) {
    const price = Math.max(19, offer.price + (baseCalendarPrice(routeForKey(offer.routeKey), dateString) - routeForKey(offer.routeKey).baseLow) + travelClassAdjustment(travelClass));
    const originalGap = Math.max(9, offer.originalPrice - offer.price);
    const arrivalMinutes = offer.departureMinutes + offer.duration;
    const arrivalOffset = Math.floor(arrivalMinutes / 1440);

    return {
      ...offer,
      price,
      originalPrice: price + originalGap,
      departure: minutesToClock(offer.departureMinutes),
      arrival: `${minutesToClock(arrivalMinutes)}${arrivalOffset > 0 ? ` +${arrivalOffset}` : ""}`,
      durationLabel: durationLabel(offer.duration),
      savings: Math.max(0, originalGap),
      isNight: offer.comfortTags.includes("Nachtzug"),
      hasWifi: offer.comfortTags.includes("WLAN"),
      isDirect: offer.transfers === 0,
      dateLabel: formatDate(dateString, { weekday: "long", day: "2-digit", month: "long" }),
      score: offer.comfortScore - offer.transfers * 5 - price / 6,
    };
  }

  function sortOffers(offers, sortKey) {
    const sorted = [...offers];

    sorted.sort((left, right) => {
      if (sortKey === "duration") {
        return left.duration - right.duration || left.price - right.price;
      }

      if (sortKey === "comfort") {
        return right.comfortScore - left.comfortScore || left.price - right.price;
      }

      return left.price - right.price || left.duration - right.duration;
    });

    return sorted;
  }

  function buildCalendar(routeKey, centerDate) {
    const route = routeForKey(routeKey);
    if (!route) return [];

    const entries = Array.from({ length: 7 }, (_, index) => {
      const offset = index - 3;
      const date = addDays(centerDate, offset);
      return {
        date,
        price: baseCalendarPrice(route, date),
        label: formatCalendarLabel(date),
        longLabel: formatDate(date, { weekday: "long", day: "2-digit", month: "long" }),
      };
    });

    const prices = entries.map((entry) => entry.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return entries.map((entry) => ({
      ...entry,
      active: entry.date === centerDate,
      barHeight: 18 + ((entry.price - min) / Math.max(1, max - min)) * 26,
      delta: entry.price - min,
    }));
  }

  function createBaseSearchState(initialForm) {
    return {
      routes: ROUTES,
      locations: LOCATIONS,
      form: cloneForm(initialForm),
      setTripType(type) {
        this.form.tripType = type;
        if (type !== "return") {
          this.form.return = "";
          return;
        }

        if (!this.form.return || this.form.return <= this.form.outbound) {
          this.form.return = addDays(this.form.outbound, 3);
        }
      },
      applyQuickRoute(route) {
        this.form.from = route.from;
        this.form.to = route.to;
      },
      swapStations() {
        const currentFrom = this.form.from;
        this.form.from = this.form.to;
        this.form.to = currentFrom;
      },
      handleSearchSubmit(resultsHref) {
        if (!this.form.from || !this.form.to) return;

        if (this.form.tripType === "return" && (!this.form.return || this.form.return <= this.form.outbound)) {
          this.form.return = addDays(this.form.outbound, 3);
        }

        const nextLocation = buildSearchHref(resultsHref, this.form);
        window.location.href = nextLocation;
      },
      presetHref(route) {
        return buildSearchHref("./core/pages/ergebnisse.html", {
          ...this.form,
          from: route.from,
          to: route.to,
        });
      },
    };
  }

  function registerGleispreisData() {
    if (!window.Alpine || window.__gleispreisRegistered) return;

    window.__gleispreisRegistered = true;

    window.Alpine.data("trainSearchPage", () => ({
      ...createBaseSearchState(),
      trustProviders: PROVIDERS,
      compareBenefits: [
        {
          title: "Guenstigster Preis zuerst",
          copy: "Wir zeigen zuerst, welcher Anbieter fuer denselben Zug heute den niedrigsten Einstiegspreis simuliert.",
        },
        {
          title: "Betreiber gegen Plattformen",
          copy: "Direkte Bahnanbieter, Reseller und Plattformen stehen sichtbar nebeneinander statt in getrennten Suchen.",
        },
        {
          title: "Flexible Daten statt Preisraten",
          copy: "Die Kalenderleiste macht guenstigere Nachbartage und Preisbewegungen sofort lesbar.",
        },
      ],
      init() {
        const params = new URLSearchParams(window.location.search);
        if (params.get("from")) this.form.from = params.get("from");
        if (params.get("to")) this.form.to = params.get("to");
        if (params.get("tripType")) this.form.tripType = params.get("tripType");
        if (params.get("outbound")) this.form.outbound = params.get("outbound");
        if (params.get("return")) this.form.return = params.get("return");
        if (params.get("passengers")) this.form.passengers = params.get("passengers");
        if (params.get("travelClass")) this.form.travelClass = params.get("travelClass");
        if (params.get("sort")) this.form.sort = params.get("sort");
      },
      topRoutes() {
        return this.routes.map((route) => ({
          ...route,
          teaserPrice: formatPrice(baseCalendarPrice(route, this.form.outbound)),
          nextBestDate: buildCalendar(route.key, this.form.outbound).sort((a, b) => a.price - b.price)[0],
        }));
      },
      teaserCalendar(routeKey) {
        return buildCalendar(routeKey, this.form.outbound).slice(1, 6);
      },
      teaserLabel(routeKey) {
        const route = routeForKey(routeKey);
        if (!route) return "";
        return route.insight;
      },
      formatPrice,
      baseCalendarPrice,
    }));

    window.Alpine.data("trainResultsPage", () => ({
      ...createBaseSearchState(),
      activeDate: baseOutbound,
      activeFilters: {
        direct: false,
        flex: false,
        morning: false,
        evening: false,
        wifi: false,
      },
      filters: FILTERS,
      sortOptions: SORT_OPTIONS,
      modal: {
        open: false,
        title: "",
        copy: "",
      },
      init() {
        const params = new URLSearchParams(window.location.search);
        this.form = cloneForm({
          from: params.get("from") || "Wien",
          to: params.get("to") || "Berlin",
          tripType: params.get("tripType") || "oneway",
          outbound: params.get("outbound") || baseOutbound,
          return: params.get("return") || "",
          passengers: params.get("passengers") || "1",
          travelClass: params.get("travelClass") || "2",
          sort: params.get("sort") || "price",
        });
        this.activeDate = this.form.outbound;

        if (this.form.tripType === "return" && !this.form.return) {
          this.form.return = addDays(this.form.outbound, 3);
        }
      },
      routeConfig() {
        return routeForInputs(this.form.from, this.form.to);
      },
      routeLabel() {
        const route = this.routeConfig();
        if (!route) return `${this.form.from} nach ${this.form.to}`;
        return `${route.from} nach ${route.to}`;
      },
      routeSubline() {
        const route = this.routeConfig();
        if (!route) {
          return "Keine exakte Mock-Strecke gefunden. Wir zeigen nahe Alternativen und andere Reisetage.";
        }

        const total = this.filteredOffers().length;
        return `${route.stations} · ${total} Vergleichsangebote fuer ${formatDate(this.activeDate, {
          day: "2-digit",
          month: "long",
        })}`;
      },
      allOffers() {
        const route = this.routeConfig();
        if (!route) return [];

        return RAW_OFFERS.filter((offer) => offer.routeKey === route.key).map((offer) =>
          decorateOffer(offer, this.activeDate, this.form.travelClass),
        );
      },
      offersForFilters() {
        let offers = this.allOffers();

        if (this.form.travelClass === "night") {
          offers = offers.filter((offer) => offer.isNight);
        }

        if (this.activeFilters.direct) {
          offers = offers.filter((offer) => offer.isDirect);
        }

        if (this.activeFilters.flex) {
          offers = offers.filter((offer) => offer.ticketType.toLowerCase().includes("flex"));
        }

        if (this.activeFilters.wifi) {
          offers = offers.filter((offer) => offer.hasWifi);
        }

        if (this.activeFilters.morning || this.activeFilters.evening) {
          offers = offers.filter((offer) => {
            const isMorning = offer.departureMinutes < 720;
            const isEvening = offer.departureMinutes >= 1020;
            return (
              (this.activeFilters.morning && isMorning) ||
              (this.activeFilters.evening && isEvening)
            );
          });
        }

        return sortOffers(offers, this.form.sort);
      },
      filteredOffers() {
        return this.offersForFilters();
      },
      highlightCards() {
        const offers = this.filteredOffers();
        if (offers.length === 0) return [];

        const cheapest = [...offers].sort((left, right) => left.price - right.price)[0];
        const fastest = [...offers].sort((left, right) => left.duration - right.duration || left.price - right.price)[0];
        const best = [...offers].sort((left, right) => right.score - left.score || left.price - right.price)[0];

        return [
          {
            label: "Guenstigste",
            accent: "bg-signal/22 text-night",
            price: formatPrice(cheapest.price),
            meta: `${cheapest.provider} · ${cheapest.departure} - ${cheapest.arrival}`,
            foot: `${cheapest.durationLabel} · ${cheapest.ticketType}`,
          },
          {
            label: "Schnellste",
            accent: "bg-sky/20 text-night",
            price: fastest.durationLabel,
            meta: `${fastest.provider} · ${formatPrice(fastest.price)}`,
            foot: `${fastest.departure} - ${fastest.arrival} · ${fastest.transfers === 0 ? "Direkt" : `${fastest.transfers} Umstieg`}`,
          },
          {
            label: "Beste Gesamtwahl",
            accent: "bg-coral/14 text-night",
            price: formatPrice(best.price),
            meta: `${best.provider} · Komfort ${best.comfortScore}/100`,
            foot: `${best.durationLabel} · ${best.badge}`,
          },
        ];
      },
      calendarDays() {
        const route = this.routeConfig();
        if (!route) return [];
        return buildCalendar(route.key, this.activeDate);
      },
      setActiveDate(dateString) {
        this.activeDate = dateString;
        this.form.outbound = dateString;
        this.syncQuery();
      },
      toggleFilter(key) {
        this.activeFilters[key] = !this.activeFilters[key];
      },
      setSort(sortKey) {
        this.form.sort = sortKey;
        this.syncQuery();
      },
      syncQuery() {
        const nextQuery = serializeQuery(this.form);
        const nextUrl = `${window.location.pathname}?${nextQuery}`;
        window.history.replaceState({}, "", nextUrl);
      },
      bestDay() {
        const days = this.calendarDays();
        return days.length ? [...days].sort((left, right) => left.price - right.price)[0] : null;
      },
      providerMix() {
        return Array.from(new Set(this.filteredOffers().map((offer) => offer.provider)));
      },
      savingsHeadline() {
        const offers = this.filteredOffers();
        if (offers.length === 0) return "Keine Treffer";

        const cheapest = offers[0];
        return `${formatPrice(cheapest.savings)} unter dem hoechsten Mock-Preis.`;
      },
      tripDescriptor() {
        const returnText =
          this.form.tripType === "return" && this.form.return
            ? `Rueckfahrt ${formatDate(this.form.return, { day: "2-digit", month: "long" })}`
            : "Nur Hinfahrt sichtbar";
        return `${this.form.passengers} Reisende · ${this.form.travelClass === "1" ? "1. Klasse" : this.form.travelClass === "night" ? "Liegewagen" : "2. Klasse"} · ${returnText}`;
      },
      alternativeRoutes() {
        return ROUTES.filter((route) => route.key !== routeKeyFromInputs(this.form.from, this.form.to)).slice(0, 3);
      },
      openPriceAlert() {
        this.modal = {
          open: true,
          title: "Preisalarm ist hier bewusst nur ein UI-Mock.",
          copy: "Im finalen Produkt koennte hier eine E-Mail- oder Push-Benachrichtigung fuer Preisbewegungen eingerichtet werden.",
        };
      },
      openOfferHint(offer) {
        this.modal = {
          open: true,
          title: `${offer.provider} zeigt ${formatPrice(offer.price)} fuer ${offer.operator}.`,
          copy: "Der CTA bleibt im Prototyp rein visuell. In einer echten Version wuerde hier die Weiterleitung zum jeweiligen Anbieter starten.",
        };
      },
      closeModal() {
        this.modal.open = false;
      },
      formatPrice,
      formatDate,
    }));
  }

  document.addEventListener("alpine:init", registerGleispreisData);

  if (window.Alpine) {
    registerGleispreisData();
  }
})();
