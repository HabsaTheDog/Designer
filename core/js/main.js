document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) return;

  const hero = document.querySelector("[data-hero]");
  if (hero) {
    const copyNodes = hero.querySelectorAll("[data-hero-copy] > *");
    const visualNodes = hero.querySelectorAll("[data-hero-visual]");

    gsap.from(copyNodes, {
      y: 30,
      opacity: 0,
      duration: 0.95,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "all",
    });

    gsap.from(visualNodes, {
      y: 18,
      opacity: 0,
      scale: 0.98,
      duration: 1.05,
      stagger: 0.1,
      ease: "power3.out",
      clearProps: "all",
    });
  }

  const floatingNodes = document.querySelectorAll("[data-float]");
  if (floatingNodes.length > 0) {
    gsap.to(floatingNodes, {
      y: -12,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "sine.inOut",
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const staggerItems = entry.target.querySelectorAll("[data-stagger-item]");
        if (staggerItems.length > 0) {
          gsap.from(staggerItems, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: "power3.out",
            clearProps: "all",
          });
        } else {
          gsap.fromTo(
            entry.target,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
});
