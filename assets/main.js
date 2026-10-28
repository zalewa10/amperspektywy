const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });
}

const consentKey = "amperspektywyConsentV1";

const readConsent = () => {
  try {
    return JSON.parse(localStorage.getItem(consentKey));
  } catch (error) {
    return null;
  }
};

const writeConsent = (settings) => {
  try {
    localStorage.setItem(consentKey, JSON.stringify({
      necessary: true,
      accepted: Boolean(settings.accepted),
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    return;
  }
};

const createCookieBanner = () => {
  if (readConsent()) return;

  const banner = document.createElement("section");
  banner.className = "cookie-consent cookie-consent-simple";
  banner.setAttribute("aria-label", "Informacja o prywatności");
  banner.innerHTML = `
    <div>
      <h2>Informacja o prywatności</h2>
      <p>Strona korzysta z niezbędnych mechanizmów działania oraz z osadzonej mapy Google na stronie kontaktu. Szczegóły znajdziesz w polityce prywatności.</p>
    </div>
    <div class="cookie-actions">
      <a class="button button-secondary" href="polityka-prywatnosci.html">Polityka prywatności</a>
      <button class="button button-primary" type="button" data-cookie-accept>Rozumiem</button>
    </div>
  `;

  document.body.appendChild(banner);

  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => {
    writeConsent({ accepted: true });
    banner.hidden = true;
  });
};

createCookieBanner();

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const status = contactForm.querySelector("[data-form-status]");

  contactForm.addEventListener("submit", async (event) => {
    if (!window.fetch) return;
    event.preventDefault();
    status.textContent = "Wysyłam wiadomość...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { "Accept": "application/json" }
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Błąd wysyłki");
      }
      contactForm.reset();
      status.textContent = "Dziękujemy. Wiadomość została wysłana.";
    } catch (error) {
      status.textContent = "Nie udało się wysłać formularza. Napisz proszę bezpośrednio na amperspektywy@gmail.com.";
    }
  });
}

const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const mainImage = gallery.querySelector("[data-gallery-main]");
  const openButton = gallery.querySelector("[data-gallery-open]");
  const prevButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");
  const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
  const lightbox = gallery.querySelector("[data-gallery-lightbox]");
  const lightboxImage = gallery.querySelector("[data-gallery-lightbox-img]");
  const closeButton = gallery.querySelector("[data-gallery-close]");
  let currentIndex = 0;

  const showImage = (index) => {
    currentIndex = (index + thumbs.length) % thumbs.length;
    const thumb = thumbs[currentIndex];
    mainImage.src = thumb.dataset.src;
    mainImage.alt = thumb.dataset.alt;
    thumbs.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === currentIndex);
    });
  };

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => showImage(index));
  });

  prevButton.addEventListener("click", () => showImage(currentIndex - 1));
  nextButton.addEventListener("click", () => showImage(currentIndex + 1));

  openButton.addEventListener("click", () => {
    lightboxImage.src = mainImage.src;
    lightboxImage.alt = mainImage.alt;
    lightbox.hidden = false;
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
  };

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.hidden && event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });
}

const cabinetButtons = Array.from(document.querySelectorAll("[data-cabinet-src]"));
const cabinetLightbox = document.querySelector("[data-cabinet-lightbox]");

if (cabinetButtons.length && cabinetLightbox) {
  const cabinetLightboxImage = cabinetLightbox.querySelector("[data-cabinet-lightbox-img]");
  const cabinetLightboxClose = cabinetLightbox.querySelector("[data-cabinet-lightbox-close]");

  const closeCabinetLightbox = () => {
    cabinetLightbox.hidden = true;
  };

  cabinetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cabinetLightboxImage.src = button.dataset.cabinetSrc;
      cabinetLightboxImage.alt = button.dataset.cabinetAlt || "";
      cabinetLightbox.hidden = false;
    });
  });

  cabinetLightboxClose.addEventListener("click", closeCabinetLightbox);
  cabinetLightbox.addEventListener("click", (event) => {
    if (event.target === cabinetLightbox) closeCabinetLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!cabinetLightbox.hidden && event.key === "Escape") closeCabinetLightbox();
  });
}

const openAccordionFromHash = () => {
  if (!location.hash) return;
  let target = null;
  try {
    target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch (error) {
    return;
  }
  if (target && target.matches("details.accordion-item")) {
    target.open = true;
    target.scrollIntoView();
  }
};

openAccordionFromHash();
window.addEventListener("hashchange", openAccordionFromHash);
