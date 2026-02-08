const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");
const sampleList = document.querySelector("#sampleList");
const sampleForm = document.querySelector("#sampleForm");
const sampleClear = document.querySelector("#sampleClear");
const sampleToggle = document.querySelector("#sampleToggle");
const samplePanel = document.querySelector("#samplePanel");

const CART_KEY = "sampleCart";

const placeholderImage = (label) => {
  const safe = encodeURIComponent(label || "Product");
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23f3e9da'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, Arial' font-size='36' fill='%23908a80'>${safe}</text></svg>`;
};

const getCart = () => {
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const setCart = (cart) => {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const renderCart = () => {
  const cart = getCart();
  sampleList.innerHTML = "";

  const entries = Object.values(cart);
  if (entries.length === 0) {
    sampleList.innerHTML = "<p class='form-note'>No samples added yet. Click “+1 Sample” on any product.</p>";
    return;
  }

  entries.forEach((item) => {
    const row = document.createElement("div");
    row.className = "sample-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <div>${item.subtitle || ""}</div>
      </div>
      <div>
        <span>Qty: ${item.qty}</span>
        <button type="button" data-id="${item.id}">-1</button>
      </div>
    `;
    row.querySelector("button").addEventListener("click", () => {
      removeFromCart(item.id);
    });
    sampleList.appendChild(row);
  });
};

const addToCart = (product) => {
  const cart = getCart();
  if (!cart[product.id]) {
    cart[product.id] = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      qty: 0
    };
  }
  cart[product.id].qty += 1;
  setCart(cart);
  renderCart();
};

const removeFromCart = (productId) => {
  const cart = getCart();
  if (!cart[productId]) return;
  cart[productId].qty -= 1;
  if (cart[productId].qty <= 0) {
    delete cart[productId];
  }
  setCart(cart);
  renderCart();
};

const clearCart = () => {
  sessionStorage.removeItem(CART_KEY);
  renderCart();
};

const toggleSamplePanel = () => {
  samplePanel.classList.toggle("is-open");
};

const createCarousel = (images, label) => {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";

  const hint = document.createElement("div");
  hint.className = "zoom-hint";
  hint.textContent = "Hover to zoom";
  wrapper.appendChild(hint);

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
  const priceLine = product.price ? `<p class="sku">Price: ${product.price}</p>` : "";
  const moqLine = product.minQuantity ? `<p class="sku">Min Qty: ${product.minQuantity}</p>` : "";

  card.innerHTML = `
    ${badge}
    <p class="category-title">${categoryName}</p>
    <h3>${product.name}</h3>
    <p class="sku">${product.subtitle || ""}</p>
    ${priceLine}
    ${moqLine}
    <button class="details-toggle" type="button" data-details="${product.id}">
      <span>+</span>
      More details
    </button>
    <div class="details" data-details-panel="${product.id}">
      <p>${product.summary || ""}</p>
      <ul>${specs}</ul>
    </div>
    <div class="card-actions">
      <a class="button ghost" href="mailto:sales@arambhika-enablers.com?subject=Request%20Order%20-%20${encodeURIComponent(product.name)}">Request Order</a>
      <button class="button" type="button" data-sample="${product.id}">+1 Sample</button>
    </div>
  `;

  const carousel = createCarousel(product.images || [], product.name);
  card.insertBefore(carousel, card.firstChild);

  const sampleBtn = card.querySelector("[data-sample]");
  sampleBtn.addEventListener("click", () => {
    addToCart(product);
    samplePanel.classList.add("is-open");
  });

  const detailsToggle = card.querySelector(`[data-details="${product.id}"]`);
  const detailsPanel = card.querySelector(`[data-details-panel="${product.id}"]`);
  detailsToggle.addEventListener("click", () => {
    const isOpen = detailsPanel.classList.toggle("is-open");
    detailsToggle.querySelector("span").textContent = isOpen ? "-" : "+";
  });

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

const buildImageList = (row) => {
  const direct = [row.image_1, row.image_2, row.image_3].filter(Boolean);
  if (direct.length > 0) return direct;
  if (row.image_folder) {
    return [1, 2, 3].map((i) => `${row.image_folder}/${i}.jpg`);
  }
  return [];
};

const loadCatalogFromJson = async () => {
  const response = await fetch("products.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("products.json not found");
  }
  const data = await response.json();
  return (data.categories || []).map((cat) => ({
    name: cat.name,
    products: (cat.products || []).map((product) => ({
      ...product,
      price: product.price || "",
      minQuantity: product.minQuantity || ""
    }))
  }));
};

const renderCatalog = (categories) => {
  catalogGrid.innerHTML = "";
  categories.forEach((category) => {
    (category.products || []).forEach((product) => {
      catalogGrid.appendChild(createCard(product, category.name));
    });
  });
  renderFilters(categories);
  renderCart();
};

const loadCatalog = async () => {
  try {
    const categories = await loadCatalogFromJson();
    renderCatalog(categories);
  } catch (error) {
    catalogGrid.innerHTML = "<p>Unable to load catalog. Please check products.json.</p>";
  }
};

sampleClear.addEventListener("click", clearCart);

sampleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cart = getCart();
  const items = Object.values(cart);
  if (items.length === 0) {
    alert("Add at least one sample before submitting.");
    return;
  }

  const formData = new FormData(sampleForm);
  const lines = items.map((item) => `${item.name} (${item.subtitle || ""}) x ${item.qty}`);
  const body = [
    `Company: ${formData.get("company")}`,
    `Email: ${formData.get("email")}`,
    `Address: ${formData.get("address")}`,
    `Notes: ${formData.get("notes") || ""}`,
    "",
    "Sample Request:",
    ...lines
  ].join("\n");

  const mailto = `mailto:sales@arambhika-enablers.com?subject=${encodeURIComponent("Sample Request")}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});

sampleToggle.addEventListener("click", () => {
  samplePanel.classList.add("drawer");
  toggleSamplePanel();
});

loadCatalog();
