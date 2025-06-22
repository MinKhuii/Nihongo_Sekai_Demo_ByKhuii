// Call-to-Action Banner Component JavaScript

class CTAComponent {
  constructor() {
    this.ctaSection = document.querySelector(".cta-section");
    this.ctaButtons = document.querySelectorAll(".cta-section .btn");
    this.testimonialWidget = document.querySelector(".testimonial-widget");
    this.floatingShapes = document.querySelectorAll(".shape");

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupButtonInteractions();
    this.setupParallaxEffect();
    this.setupTestimonialRotation();
    this.setupAccessibility();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCtaElements();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    if (this.ctaSection) {
      observer.observe(this.ctaSection);
    }
  }

  animateCtaElements() {
    // Animate CTA content
    const ctaText = document.querySelector(".cta-text");
    const ctaActions = document.querySelector(".cta-actions");

    if (ctaText) {
      ctaText.classList.add("fade-in-cta");
    }

    if (ctaActions) {
      setTimeout(() => {
        ctaActions.classList.add("fade-in-cta", "delay-1");
      }, 200);
    }

    if (this.testimonialWidget) {
      setTimeout(() => {
        this.testimonialWidget.classList.add("fade-in-cta", "delay-2");
      }, 400);
    }

    // Animate floating shapes
    this.floatingShapes.forEach((shape, index) => {
      setTimeout(
        () => {
          shape.style.opacity = "1";
          shape.style.animation = `floatShape 8s ease-in-out infinite ${index * 2}s`;
        },
        600 + index * 200,
      );
    });
  }

  setupButtonInteractions() {
    this.ctaButtons.forEach((button) => {
      // Enhanced hover effects
      button.addEventListener("mouseenter", (e) => {
        this.createHoverEffect(e);
      });

      button.addEventListener("mouseleave", (e) => {
        this.removeHoverEffect(e);
      });

      // Click effects
      button.addEventListener("click", (e) => {
        this.createClickEffect(e);
        this.trackButtonClick(button);
      });

      // Keyboard navigation
      button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          this.createClickEffect(e);
        }
      });
    });
  }

  createHoverEffect(e) {
    const button = e.currentTarget;

    // Add glow effect
    button.style.boxShadow =
      "0 8px 25px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2)";

    // Scale effect
    button.style.transform = "translateY(-2px) scale(1.02)";

    // Create magnetic effect based on mouse position
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.1;
    const deltaY = (e.clientY - centerY) * 0.1;

    button.style.transform += ` translate(${deltaX}px, ${deltaY}px)`;
  }

  removeHoverEffect(e) {
    const button = e.currentTarget;
    button.style.boxShadow = "";
    button.style.transform = "";
  }

  createClickEffect(e) {
    const button = e.currentTarget;

    // Scale down effect
    button.style.transform = "scale(0.95)";

    setTimeout(() => {
      button.style.transform = "";
    }, 150);

    // Ripple effect
    this.createRipple(e);
  }

  createRipple(e) {
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
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleEffect 0.6s ease-out;
      pointer-events: none;
      z-index: 0;
    `;

    // Add ripple animation if not already added
    if (!document.querySelector("#cta-ripple-styles")) {
      const style = document.createElement("style");
      style.id = "cta-ripple-styles";
      style.textContent = `
        @keyframes rippleEffect {
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

  setupParallaxEffect() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // Skip parallax for users who prefer reduced motion
    }

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const ctaTop = this.ctaSection.offsetTop;
      const ctaHeight = this.ctaSection.offsetHeight;
      const windowHeight = window.innerHeight;

      // Only apply parallax when CTA section is visible
      if (scrolled + windowHeight > ctaTop && scrolled < ctaTop + ctaHeight) {
        const parallaxSpeed = (scrolled - ctaTop) * 0.5;

        // Move floating shapes
        this.floatingShapes.forEach((shape, index) => {
          const speed = 0.3 + index * 0.1;
          const direction = index % 2 === 0 ? 1 : -1;
          shape.style.transform = `translateY(${parallaxSpeed * speed * direction}px) rotate(${scrolled * 0.02}deg)`;
        });

        // Subtle background movement
        const bgPattern = document.querySelector(".bg-pattern");
        if (bgPattern) {
          bgPattern.style.transform = `translateY(${parallaxSpeed * 0.2}px)`;
        }
      }
    });
  }

  setupTestimonialRotation() {
    const testimonials = [
      {
        quote:
          "Nihongo Sekai transformed my Japanese learning experience. The live conversations with native speakers made all the difference!",
        author: "Sarah Chen",
        role: "Student, JLPT N2 Certified",
        avatar: "/assets/testimonial-avatar.jpg",
      },
      {
        quote:
          "The structured courses and interactive approach helped me achieve fluency faster than I ever imagined possible.",
        author: "Michael Rodriguez",
        role: "Business Professional",
        avatar: "/assets/testimonial-avatar-2.jpg",
      },
      {
        quote:
          "From zero knowledge to conversational Japanese in 6 months. The quality of instruction is outstanding!",
        author: "Emma Thompson",
        role: "University Student",
        avatar: "/assets/testimonial-avatar-3.jpg",
      },
    ];

    let currentTestimonial = 0;

    const rotateTestimonial = () => {
      if (!this.testimonialWidget) return;

      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      const testimonial = testimonials[currentTestimonial];

      // Fade out
      this.testimonialWidget.style.opacity = "0";
      this.testimonialWidget.style.transform = "translateY(10px)";

      setTimeout(() => {
        // Update content
        const quote =
          this.testimonialWidget.querySelector(".testimonial-quote");
        const name = this.testimonialWidget.querySelector(".author-name");
        const role = this.testimonialWidget.querySelector(".author-role");
        const avatar = this.testimonialWidget.querySelector(".author-avatar");

        if (quote) quote.textContent = testimonial.quote;
        if (name) name.textContent = testimonial.author;
        if (role) role.textContent = testimonial.role;
        if (avatar) avatar.src = testimonial.avatar;

        // Fade in
        this.testimonialWidget.style.opacity = "1";
        this.testimonialWidget.style.transform = "translateY(0)";
      }, 300);
    };

    // Rotate testimonials every 8 seconds
    setInterval(rotateTestimonial, 8000);
  }

  setupAccessibility() {
    // Add proper ARIA labels and keyboard navigation
    this.ctaButtons.forEach((button, index) => {
      if (!button.getAttribute("aria-label")) {
        const buttonText = button.textContent.trim();
        button.setAttribute(
          "aria-label",
          `${buttonText} - Start your Japanese learning journey`,
        );
      }

      // Add role if not present
      if (!button.getAttribute("role")) {
        button.setAttribute("role", "button");
      }
    });

    // Add keyboard navigation for testimonial
    if (this.testimonialWidget) {
      this.testimonialWidget.setAttribute("role", "region");
      this.testimonialWidget.setAttribute("aria-label", "Student testimonial");
    }
  }

  trackButtonClick(button) {
    // Analytics tracking (would integrate with your analytics service)
    const buttonText = button.textContent.trim();
    const buttonType = button.classList.contains("btn-primary")
      ? "primary"
      : "secondary";

    // Example: Google Analytics event
    if (typeof gtag !== "undefined") {
      gtag("event", "cta_click", {
        button_text: buttonText,
        button_type: buttonType,
        section: "cta_banner",
      });
    }

    // Example: Custom analytics
    console.log("CTA Button clicked:", {
      text: buttonText,
      type: buttonType,
      timestamp: new Date().toISOString(),
    });
  }

  // Public methods for external control
  animateIn() {
    this.animateCtaElements();
  }

  updateTestimonial(testimonialData) {
    if (!this.testimonialWidget || !testimonialData) return;

    const quote = this.testimonialWidget.querySelector(".testimonial-quote");
    const name = this.testimonialWidget.querySelector(".author-name");
    const role = this.testimonialWidget.querySelector(".author-role");
    const avatar = this.testimonialWidget.querySelector(".author-avatar");

    if (quote) quote.textContent = testimonialData.quote;
    if (name) name.textContent = testimonialData.author;
    if (role) role.textContent = testimonialData.role;
    if (avatar) avatar.src = testimonialData.avatar;
  }

  highlightPrimaryButton() {
    const primaryButton = document.querySelector(".cta-primary");
    if (primaryButton) {
      primaryButton.style.animation = "pulse 2s infinite";

      // Add pulse animation if not already added
      if (!document.querySelector("#cta-pulse-styles")) {
        const style = document.createElement("style");
        style.id = "cta-pulse-styles";
        style.textContent = `
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
}

// Initialize CTA component when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.cta = new CTAComponent();
});

// Export for Builder.io or other usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = CTAComponent;
}
