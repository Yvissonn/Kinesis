(function () {
  const selectors = [
    ".hero-eyebrow",
    ".hero-headline",
    ".hero-sub-row",
    ".hero-cta",
    ".services-title",
    ".service-card",
    ".projects-header",
    ".project-card",
    ".method-header",
    ".method-item",
    ".about-content",
    ".about-image",
    ".testimonials-eyebrow",
    ".testimonial-card",
    ".cta-content",
    ".cta-visual",
    ".footer-grid > div",
  ];

  // Add fade-in class + stagger within grid siblings
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      el.classList.add("fade-in");
      const siblings = el.parentElement
        ? el.parentElement.querySelectorAll(":scope > " + sel.split(" ").pop())
        : [];
      if (siblings.length > 1) {
        const idx = Array.from(siblings).indexOf(el);
        if (idx > 0 && idx <= 4) el.dataset.delay = idx;
      }
    });
  });

  // Hero is always visible
  document.querySelectorAll(".hero > *").forEach((el) => {
    el.classList.add("visible");
    el.dataset.heroEl = "1";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Skip hero elements — they never fade out
        if (entry.target.dataset.heroEl) return;

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          // Only fade out if element is above the viewport (user scrolled up past it)
          const rect = entry.target.getBoundingClientRect();
          if (rect.bottom < 0) {
            entry.target.classList.remove("visible");
          }
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
})();

// ─── GSAP VIDEO SCRUB ───
(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
    return;

  gsap.registerPlugin(ScrollTrigger);

  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  const methodVideos = document.querySelectorAll(".method-video");

  methodVideos.forEach((video) => {
    const trigger = video.closest(".method-item");

    if (isDesktop) {
      // Scroll-scrub: avança o vídeo conforme o usuário scrolla
      const initScrub = () => {
        gsap.to(video, {
          currentTime: video.duration,
          ease: "none",
          scrollTrigger: {
            trigger: trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      };

      if (video.readyState >= 1) {
        initScrub();
      } else {
        video.addEventListener("loadedmetadata", initScrub, { once: true });
      }
    } else {
      // Mobile: autoplay/loop simples em vez de scrub
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.play().catch(() => {});
    }
  });
})();
