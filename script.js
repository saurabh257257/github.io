const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");
const generateCatalogPdf = document.querySelector("#generateCatalogPdf");
const catalogSearch = document.querySelector("#catalogSearch");
const globalSearch = document.querySelector("#globalSearch");
const orderList = document.querySelector("#orderList");
const mobileOrderList = document.querySelector("#mobileOrderList");
const orderForm = document.querySelector("#orderForm");
const mobileOrderForm = document.querySelector("#mobileOrderForm");
const mobileFab = document.querySelector("#mobileFab");
const mobileSheet = document.querySelector("#mobileSheet");
const mobileSheetClose = document.querySelector("#mobileSheetClose");

const ORDER_KEY = "orderCart";

const getOrder = () => {
  const raw = sessionStorage.getItem(ORDER_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const setOrder = (order) => {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
};

const normalizeCatalogData = (data) => {
  const categories = Array.isArray(data?.categories) ? data.categories : [];
  return categories.map((cat) => {
    const fallbackName =
      cat.Category ||
      (Array.isArray(cat.products) && cat.products[0] && cat.products[0].Category) ||
      "Category";
    return {
      name: cat.name || fallbackName,
      products: (cat.products || []).map((product) => {
        const availabilityRaw = String(product.Availability || "Now").trim();
        const availability =
          availabilityRaw.toLowerCase() === "on request" ? "On Request" : "Now";
        return {
          Category: product.Category || fallbackName,
          ProductCode: product.ProductCode || "",
          Image_Link: Array.isArray(product.Image_Link)
            ? product.Image_Link
            : product.Image_Link
              ? [product.Image_Link]
              : [],
          Price: product.Price || "",
          Availability: availability,
          Unit: product.Unit || "KG",
          "Minimum Quantity": Number(product["Minimum Quantity"] || 1),
          Product_Dimensions: String(product.Product_Dimensions || "").trim(),
          Additional_Details: Array.isArray(product.Additional_Details)
            ? product.Additional_Details
            : product.Additional_Details
              ? String(product.Additional_Details)
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
              : []
        };
      })
    };
  });
};

let currentCategoryFilter = "all";
let currentSearchTerm = "";

const renderFilters = (categories) => {
  if (!categoryFilters) return;
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
      currentCategoryFilter = btn.dataset.filter;
      filterCatalog();
    });
  });
};

const filterCatalog = () => {
  if (!catalogGrid) return;
  const cards = catalogGrid.querySelectorAll(".catalog-card");
  cards.forEach((card) => {
    const matchesCategory =
      currentCategoryFilter === "all" || card.dataset.category === currentCategoryFilter;
    const haystack = `${card.dataset.search || ""}`.toLowerCase();
    const matchesSearch = !currentSearchTerm || haystack.includes(currentSearchTerm);
    if (matchesCategory && matchesSearch) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

const placeholderImage = (label) => {
  const safe = encodeURIComponent(label || "Product");
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='%23f3e9da'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Space Grotesk, Arial' font-size='36' fill='%23908a80'>${safe}</text></svg>`;
};

const createCarousel = (images, label) => {
  const wrapper = document.createElement("div");
  wrapper.className = "carousel";

  const safeImages = images && images.length ? images : [placeholderImage(label)];
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

  return wrapper;
};

const renderOrderList = () => {
  const targets = [orderList, mobileOrderList].filter(Boolean);
  const order = getOrder();
  const entries = Object.values(order);
  targets.forEach((list) => {
    list.innerHTML = "";
    if (entries.length === 0) {
      list.innerHTML = "<p class='form-note'>No items added yet. Click “Order” on any product.</p>";
      return;
    }
    entries.forEach((item) => {
      const row = document.createElement("div");
      row.className = "panel-item";
      row.innerHTML = `
        <div class="panel-item-header">
          <div><strong>${item.name}</strong></div>
          <button class="remove-item" type="button" aria-label="Remove item">×</button>
        </div>
        <div>Qty: ${item.qty} ${item.unit}</div>
      `;
      row.querySelector(".remove-item").addEventListener("click", () => {
        removeFromOrder(item.id);
      });
      list.appendChild(row);
    });
  });
  updateActionCounts();
};

const addToOrder = (product, qty) => {
  const order = getOrder();
  const name = product.ProductCode || "";
  const unit = product.Unit || "KG";
  order[name] = { id: name, name, qty, unit };
  setOrder(order);
  renderOrderList();
};

const removeFromOrder = (productId) => {
  const order = getOrder();
  if (!order[productId]) return;
  delete order[productId];
  setOrder(order);
  renderOrderList();
};

const clearOrder = () => {
  sessionStorage.removeItem(ORDER_KEY);
  renderOrderList();
};

const updateActionCounts = () => {
  const orderCount = Object.keys(getOrder()).length;
  if (mobileFab) {
    mobileFab.textContent = `Order (${orderCount})`;
    mobileFab.classList.toggle("has-items", orderCount > 0);
  }
};

const applySiteConfig = (config) => {
  if (!config) return;
  const brand = config.brand || {};
  const logo = document.getElementById("brandLogo");
  const mark = document.getElementById("brandMark");
  if (logo && brand.logo) {
    logo.src = brand.logo;
    if (mark) mark.classList.add("is-hidden");
  }
};

const loadSiteConfig = async () => {
  try {
    const response = await fetch("site.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    applySiteConfig(data);
  } catch {
    // ignore config errors
  }
};

const createCard = (product, categoryName) => {
  const card = document.createElement("article");
  card.className = "catalog-card";
  card.dataset.category = categoryName;

  const name = product.ProductCode || "";
  const dataId = name
    ? name.toString().trim().replace(/[^a-z0-9_-]+/gi, "_")
    : `product_${Math.random().toString(36).slice(2, 9)}`;
  const unit = product.Unit || "KG";
  const minQty = Number(product["Minimum Quantity"]) || 1;
  const dimensions = product.Product_Dimensions || "";
  const dimensionHtml = dimensions ? dimensions.replace(/\r?\n/g, "<br>") : "";
  const detailsList = Array.isArray(product.Additional_Details)
    ? product.Additional_Details
    : product.Additional_Details
      ? [product.Additional_Details]
      : [];
  const specs = detailsList.map((spec) => `<li>${spec}</li>`).join("");
  const priceText = String(product.Price || "");
  const showUnit = priceText && !/per\s+/i.test(priceText) && !/\//.test(priceText);
  const priceLine = priceText
    ? `<span class="price">Price: ${priceText}${showUnit ? `/${unit}` : ""}</span>`
    : "";
  const moqLine = `<span class="price">Min Qty: ${minQty} ${unit}</span>`;

  card.innerHTML = `
    <div class="catalog-body">
      <div class="details-bottom">
        <h3>${name}</h3>
        <p class="sku">${dimensionHtml}</p>
        <div class="price-row">
          ${priceLine}
          ${moqLine}
        </div>
        <button class="details-toggle" type="button" data-details="${dataId}">
          <span>+</span>
          More details
        </button>
        <div class="details" data-details-panel="${dataId}">
          <ul>${specs}</ul>
        </div>
        <div class="card-actions">
          <div class="order-controls" data-qty="${minQty}">
            <button class="qty-btn" type="button" data-action="dec" aria-label="Decrease quantity">-</button>
            <span class="qty-value">${minQty} ${unit}</span>
            <button class="qty-btn" type="button" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="button order-btn" type="button" data-order="${dataId}">Order</button>
        </div>
      </div>
    </div>
  `;

  const carousel = createCarousel(product.Image_Link || [], name);
  card.insertBefore(carousel, card.firstChild);

  const searchText = [
    name,
    categoryName,
    dimensions,
    detailsList.join(" ")
  ]
    .filter(Boolean)
    .join(" ");
  card.dataset.search = searchText;

  const detailsToggle = card.querySelector(`[data-details="${dataId}"]`);
  const detailsPanel = card.querySelector(`[data-details-panel="${dataId}"]`);
  if (detailsToggle && detailsPanel) {
    detailsToggle.addEventListener("click", () => {
      const isOpen = detailsPanel.classList.toggle("is-open");
      detailsToggle.querySelector("span").textContent = isOpen ? "-" : "+";
    });
  }

  const qtyControl = card.querySelector(".order-controls");
  const qtyValue = card.querySelector(".qty-value");
  const updateQty = (delta) => {
    const current = Number(qtyControl.dataset.qty) || minQty;
    const next = Math.max(minQty, current + delta);
    qtyControl.dataset.qty = String(next);
    qtyValue.textContent = `${next} ${unit}`;
    addToOrder(product, next);
  };
  qtyControl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateQty(delta);
    });
  });

  const orderBtn = card.querySelector("[data-order]");
  orderBtn.addEventListener("click", () => {
    const qty = Number(qtyControl.dataset.qty) || minQty;
    addToOrder(product, qty);
  });

  return card;
};

const renderCatalog = (categories) => {
  if (!catalogGrid) return;
  catalogGrid.innerHTML = "";
  let cardCount = 0;
  categories.forEach((category) => {
    (category.products || []).forEach((product) => {
      catalogGrid.appendChild(createCard(product, category.name));
      cardCount += 1;
    });
  });
  if (cardCount === 0) {
    catalogGrid.innerHTML = "<p>No products found. Please update products.json.</p>";
  }
  renderFilters(categories);
  filterCatalog();
};

const loadCatalogFromJson = async () => {
  const response = await fetch("products.json", { cache: "no-store" });
  if (!response.ok) throw new Error("products.json not found");
  const data = await response.json();
  return normalizeCatalogData(data);
};

const loadCatalog = async () => {
  if (!catalogGrid) return;
  try {
    const categories = await loadCatalogFromJson();
    renderCatalog(categories);
  } catch (error) {
    catalogGrid.innerHTML = "<p>Unable to load catalog. Please check products.json.</p>";
  }
};

const populateCountrySelects = () => {
  const selects = document.querySelectorAll(".phone-row select");
  if (!selects.length) return;
  selects.forEach((select) => {
    select.innerHTML = "";
    const option = document.createElement("option");
    option.value = "+91";
    option.textContent = "🇮🇳 India (+91)";
    option.selected = true;
    select.appendChild(option);
  });
};

const openWhatsApp = (items, form) => {
  const formData = new FormData(form);
  const countryCode = formData.get("countryCode") || "+91";
  const mobile = String(formData.get("mobile") || "").trim();
  if (!mobile) return;
  const lines = items.length ? items : ["No products selected."];
  const body = [
    "Order Request",
    "",
    "Selected products:",
    ...lines,
    "",
    `Mobile: ${countryCode} ${mobile}`.trim()
  ].join("\n");
  const whatsapp = `https://wa.me/918112662827?text=${encodeURIComponent(body)}`;
  window.open(whatsapp, "_blank");
  form.reset();
};

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getOrder()).map((item) => `• ${item.name} (${item.qty} ${item.unit})`);
    if (items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }
    openWhatsApp(items, orderForm);
  });
}

if (mobileOrderForm) {
  mobileOrderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = Object.values(getOrder()).map((item) => `• ${item.name} (${item.qty} ${item.unit})`);
    if (items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }
    openWhatsApp(items, mobileOrderForm);
  });
}

if (mobileFab && mobileSheet) {
  mobileFab.addEventListener("click", () => {
    mobileSheet.classList.add("is-open");
    mobileSheet.setAttribute("aria-hidden", "false");
  });
}

if (mobileSheetClose && mobileSheet) {
  mobileSheetClose.addEventListener("click", () => {
    mobileSheet.classList.remove("is-open");
    mobileSheet.setAttribute("aria-hidden", "true");
  });
}

if (mobileSheet) {
  mobileSheet.addEventListener("click", (event) => {
    if (event.target === mobileSheet) {
      mobileSheet.classList.remove("is-open");
      mobileSheet.setAttribute("aria-hidden", "true");
    }
  });
}

document.querySelectorAll("[data-clear]").forEach((btn) => {
  btn.addEventListener("click", () => {
    clearOrder();
  });
});

const applyMobileFabVisibility = () => {
  const isMobile =
    window.matchMedia("(max-width: 900px)").matches ||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  document.body.classList.toggle("is-mobile", isMobile);
  if (mobileFab) {
    mobileFab.style.display = isMobile ? "inline-flex" : "none";
  }
};

loadCatalog();
populateCountrySelects();
renderOrderList();
applyMobileFabVisibility();
window.addEventListener("resize", applyMobileFabVisibility);
loadSiteConfig();

const handleSearchInput = (value) => {
  currentSearchTerm = String(value || "").trim().toLowerCase();
  filterCatalog();
  if (currentSearchTerm) {
    document.body.classList.add("search-active");
    const catalog = document.querySelector("#catalog");
    if (catalog) catalog.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    document.body.classList.remove("search-active");
  }
};

if (catalogSearch) {
  catalogSearch.addEventListener("input", (event) => {
    handleSearchInput(event.target.value);
  });
}

if (globalSearch) {
  globalSearch.addEventListener("input", (event) => {
    handleSearchInput(event.target.value);
  });
}
