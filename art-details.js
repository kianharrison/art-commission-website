const ART_DATA = {
  1: {
    title: "Expressive Portrait I",
    image: "art/1.jpg",
    processImages: ["art/1.jpg", "art/1_2.png", "art/1_3.png"],
    description:
      "A bright and expressive headshot centered on emotion, clean lighting, and character personality.",
  },
  2: {
    title: "Expressive Portrait II",
    image: "art/2.jpg",
    processImages: ["art/2.jpg", "art/2_1.png", "art/2_3.png"],
    description:
      "A festive portrait piece with soft tonal blending and playful color atmosphere.",
  },
  3: {
    title: "Character Concept",
    image: "art/3.png",
    processImages: ["art/1.jpg", "art/2.jpg", "art/4.png"],
    description:
      "Stylized character artwork with stronger contrast and cinematic framing.",
  },
  4: {
    title: "City Vibes Illustration",
    image: "art/4.png",
    processImages: ["art/5.jpg", "art/1.jpg", "art/3.png"],
    description:
      "A confident composition combining mood, costume detail, and polished digital rendering.",
  },
  5: {
    title: "Story Panel Artwork",
    image: "art/5.jpg",
    processImages: ["art/2.jpg", "art/1.jpg", "art/3.png"],
    description:
      "Narrative-focused artwork with a balanced composition and smooth painterly finish.",
  },
};

const params = new URLSearchParams(window.location.search);
const artId = params.get("art");
const art = ART_DATA[artId] || ART_DATA[1];

const imageEl = document.getElementById("art-detail-image");
const titleEl = document.getElementById("art-detail-title");
const descEl = document.getElementById("art-detail-description");
const processEls = document.querySelectorAll(".art-process-image");

if (imageEl) {
  imageEl.src = art.image;
  imageEl.alt = art.title;
  imageEl.loading = "lazy";
}

if (titleEl) {
  titleEl.textContent = art.title;
}

if (descEl) {
  descEl.textContent = art.description;
}

if (processEls.length) {
  processEls.forEach((image, index) => {
    image.src = art.processImages[index] || art.image;
    image.alt = `${art.title} process ${index + 1}`;
    image.loading = "lazy";
  });
}

document.title = `${art.title} | KianLooksBetter`;
