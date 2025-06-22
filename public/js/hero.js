// Hero Component JavaScript

class HeroComponent {
  constructor() {
    this.hero = document.querySelector(".hero");
    this.stats = document.querySelectorAll(".stat-number");
    this.floatingElements = document.querySelectorAll(".float-element");

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupParallaxEffect();
    this.setupStatsAnimation();
    this.setupButtonEffects();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateStatsCounters();
            this.animateFloatingElements();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    if (this.hero) {
      observer.observe(this.hero);
    }
  }

  setupParallaxEffect() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      // Parallax background elements
      this.floatingElements.forEach((element, index) => {
        const speed = 0.3 + index * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
      });

      // Parallax hero image
      const heroImg = document.querySelector(".hero-img");
      if (heroImg) {
        heroImg.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  setupStatsAnimation() {
    // Prepare stats for animation
    this.stats.forEach((stat) => {
      const finalValue = stat.textContent;
      stat.setAttribute("data-target", finalValue);
      stat.textContent = "0";
    });
  }

  animateStatsCounters() {
    this.stats.forEach((stat) => {
      const target = stat.getAttribute("data-target");
      const numericTarget = parseInt(target.replace(/[^\d]/g, ""));
      const suffix = target.replace(/[\d,]/g, "");

      this.animateCounter(stat, 0, numericTarget, suffix, 2000);
    });
  }

  animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }

  animateFloatingElements() {
    this.floatingElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1";
        element.style.animation = `float 6s ease-in-out infinite ${index * 2}s`;
      }, index * 500);
    });
  }

  setupButtonEffects() {
    const buttons = document.querySelectorAll(".hero .btn");

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", (e) => {
        this.createRippleEffect(e);
      });

      button.addEventListener("click", (e) => {
        this.createClickEffect(e);
      });
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.offsetWidth, button.offsetHeight);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    // Add ripple keyframes if not already added
    if (!document.querySelector("#ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  createClickEffect(e) {
    const button = e.currentTarget;
    button.style.transform = "scale(0.95)";

    setTimeout(() => {
      button.style.transform = "";
    }, 150);
  }

  // Public methods for external control
  resetAnimations() {
    this.stats.forEach((stat) => {
      const target = stat.getAttribute("data-target");
      stat.textContent = target;
    });
  }

  playStatsAnimation() {
    this.animateStatsCounters();
  }
}

// Initialize hero component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.hero = new HeroComponent();
});

// Export for Builder.io or other usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = HeroComponent;
}
