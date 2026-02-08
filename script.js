const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");

const placeholderImage = (label) => {
  const safe = encodeURIComponent(label || "Product");
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23f3e9da'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, Arial' font-size='36' fill='%23908a80'>${safe}</text></svg>`;
};

const createCarousel = (images, label) => {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";

  const safeImages = (images && images.length ? images : [placeholderImage(label)]);

  safeImages.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = label;
    img.loading = "lazy";
    img.className = index === 0 ? "active" : "";
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholderImage(label);
    };
    wrapper.appendChild(img);
  });

  if (safeImages.length > 1) {
    const controls = document.createElement("div");
    controls.className = "carousel-controls";

    const prev = document.createElement("button");
    prev.className = "carousel-btn";
    prev.type = "button";
    prev.textContent = "Prev";

    const next = document.createElement("button");
    next.className = "carousel-btn";
    next.type = "button";
    next.textContent = "Next";

    const dots = document.createElement("div");
    dots.className = "carousel-dots";

    const dotEls = safeImages.map((_, idx) => {
      const dot = document.createElement("span");
      dot.className = idx === 0 ? "carousel-dot active" : "carousel-dot";
      dots.appendChild(dot);
      return dot;
    });

    let activeIndex = 0;
    const updateActive = (newIndex) => {
      const imgs = wrapper.querySelectorAll("img");
      imgs[activeIndex].classList.remove("active");
      dotEls[activeIndex].classList.remove("active");
      activeIndex = newIndex;
      imgs[activeIndex].classList.add("active");
      dotEls[activeIndex].classList.add("active");
    };

    prev.addEventListener("click", () => {
      const nextIndex = (activeIndex - 1 + safeImages.length) % safeImages.length;
      updateActive(nextIndex);
    });

    next.addEventListener("click", () => {
      const nextIndex = (activeIndex + 1) % safeImages.length;
      updateActive(nextIndex);
    });

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    wrapper.appendChild(controls);
  }

  return wrapper;
};

const createCard = (product, categoryName) => {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.dataset.category = categoryName;

  const badge = product.badge ? `<span class="badge">${product.badge}</span>` : "";
  const specs = (product.specs || []).map((spec) => `<li>${spec}</li>`).join("");

  card.innerHTML = `
    ${badge}
    <p class="category-title">${categoryName}</p>
    <h3>${product.name}</h3>
    <p class="sku">${product.subtitle || ""}</p>
    <p>${product.summary || ""}</p>
    <ul>${specs}</ul>
  `;

  const carousel = createCarousel(product.images || [], product.name);
  card.insertBefore(carousel, card.firstChild);
  return card;
};

const renderFilters = (categories) => {
  categoryFilters.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.filter = "all";
  allBtn.textContent = "All";
  categoryFilters.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = cat.name;
    btn.textContent = cat.name;
    categoryFilters.appendChild(btn);
  });

  const buttons = categoryFilters.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      filterCatalog(filter);
    });
  });
};

const filterCatalog = (filter) => {
  const cards = catalogGrid.querySelectorAll(".catalog-card");
  cards.forEach((card) => {
    if (filter === "all" || card.dataset.category === filter) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const loadCatalog = async () => {
  try {
    const response = await fetch("products.json");
    if (!response.ok) {
      throw new Error("Failed to load products.json");
    }
    const data = await response.json();
    const categories = data.categories || [];

    catalogGrid.innerHTML = "";
    categories.forEach((category) => {
      (category.products || []).forEach((product) => {
        catalogGrid.appendChild(createCard(product, category.name));
      });
    });

    renderFilters(categories);
  } catch (error) {
    catalogGrid.innerHTML = "<p>Unable to load catalog. Please check products.json.</p>";
  }
};

loadCatalog();
