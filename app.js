const hamburger = document.querySelector(".header .nav-bar .nav-list .hamburger");
const mobileMenu = document.querySelector(".header .nav-bar .nav-list ul");
const menuItems = document.querySelectorAll(".header .nav-bar .nav-list ul li a");
const header = document.querySelector(".header.container");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });
}

if (header) {
  document.addEventListener("scroll", () => {
    const scrollPosition = window.scrollY;
    header.style.backgroundColor = scrollPosition > 250 ? "#29323c" : "transparent";
  });
}

if (hamburger && mobileMenu && menuItems.length) {
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("active");
    });
  });
}

const revealSelectors = [
  "#gallery",
  "#services",
  "#contact",
  "#footer",
  ".section-title",
  ".gallery-filter-row",
  ".photo-gallery > div",
  ".photo-gallery2 .card",
  "#services .service-item",
  "#contact .contact-item",
  ".button",
  ".selected-img-section",
  ".art-detail-image-wrap",
  ".art-detail-info-wrap",
  ".service-detail-panel",
  ".service-samples-title",
  ".sample-card",
];

const revealTargets = document.querySelectorAll(revealSelectors.join(", "));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const applyStagger = (selector, step) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
};

applyStagger(".photo-gallery > div", 80);
applyStagger(".photo-gallery2 .card", 70);
applyStagger("#services .service-item", 90);
applyStagger("#contact .contact-item", 110);
applyStagger(".process-image", 60);
applyStagger(".sample-card", 70);

revealTargets.forEach((element) => {
  element.classList.add("reveal-ready");
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((element) => {
    element.classList.add("revealed");
  });
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
  });
}

const previewModal = document.getElementById("image-preview-modal");
const previewImage = document.getElementById("image-preview-img");
const previewStage = document.getElementById("image-preview-stage");
const previewClose = document.getElementById("image-preview-close");

if (previewModal && previewImage && previewStage && previewClose) {
  const previewableImages = document.querySelectorAll(".selected-img, .process-image, #art-detail-image");
  let currentZoom = 1;

  const setZoom = (zoomLevel) => {
    currentZoom = Math.max(1, Math.min(4, zoomLevel));
    previewImage.style.transform = `scale(${currentZoom})`;
  };

  const openPreview = (image) => {
    previewImage.src = image.src;
    previewImage.alt = image.alt || "Artwork preview";
    previewModal.classList.add("open");
    previewModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setZoom(1);
  };

  const closePreview = () => {
    previewModal.classList.remove("open");
    previewModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    previewImage.src = "";
    setZoom(1);
  };

  previewableImages.forEach((image) => {
    image.addEventListener("click", () => openPreview(image));
  });

  previewClose.addEventListener("click", closePreview);

  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      closePreview();
    }
  });

  previewStage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const direction = event.deltaY < 0 ? 0.18 : -0.18;
      setZoom(currentZoom + direction);
    },
    { passive: false }
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && previewModal.classList.contains("open")) {
      closePreview();
    }
  });
}

const galleryCategorySelect = document.getElementById("gallery-category");
const artSubcategorySelect = document.getElementById("art-subcategory");
const artSubcategoryGroup = document.getElementById("art-subcategory-group");
const galleryGrid = document.getElementById("gallery-grid");
const galleryEmptyState = document.getElementById("gallery-empty-state");

if (galleryCategorySelect && artSubcategorySelect && galleryGrid) {
  const YOUTUBE_ANIMATION_CONFIG = {
    // Add your real channel id (UC...) and YouTube Data API key to auto-load videos.
    channelId: "UCufJo4cDL_B6-X8lgVWNsQQ",
    apiKey: "AIzaSyDrzZBSBVhDkenFhkfDObQy2kA1TEEPWe0",
    maxResults: 24,
    fallbackVideoIds: [],
  };

  const createVideoCard = (videoId, title) => {
    const card = document.createElement("div");
    card.className = "card video-card";
    card.dataset.category = "animation";
    card.dataset.artType = "all";
    card.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${videoId}"
        title="${title || "Animation video"}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
    return card;
  };

  const addFallbackAnimationCards = () => {
    if (!YOUTUBE_ANIMATION_CONFIG.fallbackVideoIds.length) {
      return;
    }

    YOUTUBE_ANIMATION_CONFIG.fallbackVideoIds.forEach((videoId, index) => {
      galleryGrid.appendChild(
        createVideoCard(videoId, `Animation video ${index + 1}`)
      );
    });
  };

  const fetchYoutubeJson = async (endpoint, params) => {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
    url.search = new URLSearchParams({
      ...params,
      key: YOUTUBE_ANIMATION_CONFIG.apiKey,
    }).toString();

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Unable to load YouTube ${endpoint}.`);
    }

    return response.json();
  };

  const getUploadsPlaylistId = async () => {
    const data = await fetchYoutubeJson("channels", {
      part: "contentDetails",
      id: YOUTUBE_ANIMATION_CONFIG.channelId,
      maxResults: "1",
    });

    const channel = (data.items || [])[0];
    return (
      channel &&
      channel.contentDetails &&
      channel.contentDetails.relatedPlaylists &&
      channel.contentDetails.relatedPlaylists.uploads
    );
  };

  const getChannelUploadVideos = async () => {
    const getVideoTypeFromUrl = (url) => {
      if (url.includes("/shorts/")) {
        return "shorts";
      }
      if (url.includes("watch?v=")) {
        return "long_form";
      }
      return "unknown";
    };

    const uploadsPlaylistId = await getUploadsPlaylistId();
    if (!uploadsPlaylistId) {
      return [];
    }

    const collected = [];
    const seen = new Set();
    let pageToken = "";

    while (collected.length < YOUTUBE_ANIMATION_CONFIG.maxResults) {
      const data = await fetchYoutubeJson("playlistItems", {
        part: "snippet,contentDetails",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
        pageToken,
      });

      const items = data.items || [];
      items.forEach((item) => {
        const videoId =
          (item.contentDetails && item.contentDetails.videoId) ||
          (item.snippet &&
            item.snippet.resourceId &&
            item.snippet.resourceId.videoId);
        const title = item.snippet && item.snippet.title;
        const watchUrl = videoId
          ? `https://www.youtube.com/watch?v=${videoId}`
          : "";
        const videoType = getVideoTypeFromUrl(watchUrl);

        if (!videoId || seen.has(videoId)) {
          return;
        }

        if (videoType !== "long_form") {
          return;
        }

        seen.add(videoId);
        collected.push({ videoId, title, watchUrl, videoType });
      });

      if (!data.nextPageToken || !items.length) {
        break;
      }

      pageToken = data.nextPageToken;
    }

    return collected.slice(0, YOUTUBE_ANIMATION_CONFIG.maxResults);
  };

  const loadAnimationCards = async () => {
    if (!YOUTUBE_ANIMATION_CONFIG.apiKey || !YOUTUBE_ANIMATION_CONFIG.channelId) {
      addFallbackAnimationCards();
      return;
    }

    try {
      const uploadedVideos = await getChannelUploadVideos();
      if (!uploadedVideos.length) {
        addFallbackAnimationCards();
        return;
      }

      uploadedVideos.forEach((video) => {
        galleryGrid.appendChild(
          createVideoCard(video.videoId, video.title || "Animation video")
        );
      });
    } catch (error) {
      addFallbackAnimationCards();
    }
  };

  const getGalleryCards = () => galleryGrid.querySelectorAll(".card");

  const applyGalleryFilters = () => {
    const category = galleryCategorySelect.value;
    const artType = artSubcategorySelect.value;

    if (artSubcategoryGroup) {
      artSubcategoryGroup.style.display = category === "art" ? "flex" : "none";
    }
    galleryGrid.classList.toggle("animation-layout", category === "animation");

    let visibleCount = 0;

    getGalleryCards().forEach((card) => {
      const cardCategory = card.dataset.category || "art";
      const cardArtType = card.dataset.artType || "portrait";

      const matchesCategory = cardCategory === category;
      const matchesArtType =
        category !== "art" || artType === "all" || cardArtType === artType;
      const showCard = matchesCategory && matchesArtType;

      card.classList.toggle("gallery-hidden", !showCard);
      if (showCard) {
        visibleCount += 1;
      }
    });

    if (galleryEmptyState) {
      galleryEmptyState.textContent =
        category === "animation"
          ? "No animation videos available yet. Check back soon."
          : "No items in this category yet. Please check back soon.";
      galleryEmptyState.classList.toggle("show", visibleCount === 0);
    }
  };

  galleryCategorySelect.addEventListener("change", applyGalleryFilters);
  artSubcategorySelect.addEventListener("change", applyGalleryFilters);
  loadAnimationCards().finally(() => {
    applyStagger(".photo-gallery2 .card", 70);
    applyGalleryFilters();
  });
}
