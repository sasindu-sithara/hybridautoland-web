(function () {
  "use strict";

  const body = document.body;

  /* Mobile navigation */
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileDrawer = document.querySelector(".mobile-drawer");

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !open);
      mobileDrawer.classList.toggle("open", !open);
      body.classList.toggle("menu-open", !open);
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileDrawer.classList.remove("open");
        body.classList.remove("menu-open");
      });
    });
  }

  /* Accordions */
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".accordion-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          const p = other.querySelector(".accordion-panel");
          if (p) p.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* Testimonial carousel */
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dotsWrap = document.querySelector(".carousel-dots");

  if (track && slides.length > 0) {
    let index = 0;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      document.querySelectorAll(".carousel-dots button").forEach((d, j) => {
        d.classList.toggle("active", j === index);
        d.setAttribute("aria-selected", j === index ? "true" : "false");
      });
    }

    if (dotsWrap && !dotsWrap.querySelector("button")) {
      slides.forEach((_, j) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Slide " + (j + 1));
        b.classList.toggle("active", j === 0);
        b.addEventListener("click", () => goTo(j));
        dotsWrap.appendChild(b);
      });
    } else {
      dotsWrap?.querySelectorAll("button").forEach((b, j) => {
        b.addEventListener("click", () => goTo(j));
      });
    }

    goTo(0);

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    let autoplay = setInterval(() => goTo(index + 1), 6000);
    track.addEventListener("mouseenter", () => clearInterval(autoplay));
    track.addEventListener("mouseleave", () => {
      autoplay = setInterval(() => goTo(index + 1), 6000);
    });
  }

  /* Gallery filters */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach((item) => {
        const match = !cat || cat === "all" || item.dataset.category === cat;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  /* Lightbox */
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox?.querySelector("img");
  const lightboxClose = lightbox?.querySelector(".lightbox-close");

  function openLightboxFromItem(item) {
    const img = item.querySelector("img");
    if (!lightbox || !lightboxImg || !img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightbox.classList.add("open");
    body.style.overflow = "hidden";
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightboxFromItem(item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightboxFromItem(item);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox?.classList.remove("open");
    body.style.overflow = "";
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* Contact form */
  const form = document.querySelector("#contact-form");
  if (form) {
    const msgOk = form.querySelector(".form-msg.success");
    const msgErr = form.querySelector(".form-msg.error");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (msgOk) msgOk.style.display = "none";
      if (msgErr) msgErr.style.display = "none";

      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const ok = name && email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!ok) {
        if (msgErr) {
          msgErr.style.display = "block";
          msgErr.textContent = "Please enter your name and a valid email address.";
        }
        return;
      }

      if (msgOk) {
        msgOk.style.display = "block";
        msgOk.textContent = "Thanks — we will reply within one business day.";
      }
      form.reset();
    });
  }

  /* Scroll reveal */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("visible");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => obs.observe(el));
  }

  /* Back to top */
  const backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener(
      "scroll",
      () => {
        backTop.classList.toggle("visible", window.scrollY > 520);
      },
      { passive: true }
    );
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
