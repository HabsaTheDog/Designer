window.tailwind = window.tailwind || {};

window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        night: "#071824",
        petrol: "#0d3645",
        "petrol-deep": "#0a2733",
        sky: "#8fc7ec",
        ice: "#e6f5ff",
        mist: "#93acc0",
        cloud: "#f4fbff",
        coral: "#ff6d57",
        "coral-deep": "#e24e39",
        signal: "#f7cd5e",
        ink: "#14303d",
        slate: "#587287",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        shell: "0 30px 80px rgba(7, 24, 36, 0.22)",
        float: "0 18px 45px rgba(8, 28, 44, 0.18)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(10, 39, 51, 0.35)",
      },
      backgroundImage: {
        "brand-hero":
          "radial-gradient(circle at 14% 18%, rgba(143,199,236,0.28), transparent 24%), radial-gradient(circle at 82% 18%, rgba(255,109,87,0.18), transparent 22%), linear-gradient(140deg, rgba(7,24,36,0.96), rgba(13,54,69,0.94) 52%, rgba(10,39,51,0.98))",
        "panel-frost":
          "linear-gradient(180deg, rgba(244,251,255,0.92), rgba(230,245,255,0.82))",
        "panel-night":
          "radial-gradient(circle at top right, rgba(143,199,236,0.18), transparent 24%), linear-gradient(145deg, rgba(7,24,36,0.96), rgba(13,54,69,0.96))",
      },
      borderRadius: {
        shell: "2rem",
      },
    },
  },
};
