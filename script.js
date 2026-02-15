const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");
const globalSearch = document.querySelector("#globalSearch");
const searchSuggestions = document.querySelector("#searchSuggestions");
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
let productIndex = [];

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
    img.dataset.index = String(index);
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
    prev.className = "carousel-btn prev";
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous image");
    prev.textContent = "‹";

    const next = document.createElement("button");
    next.className = "carousel-btn next";
    next.type = "button";
    next.setAttribute("aria-label", "Next image");
    next.textContent = "›";

    const dots = document.createElement("div");
    dots.className = "carousel-dots";
    safeImages.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = idx === 0 ? "carousel-dot active" : "carousel-dot";
      dots.appendChild(dot);
    });

    const updateActive = (direction) => {
      const imgs = wrapper.querySelectorAll("img");
      const currentIndex = Array.from(imgs).findIndex((img) =>
        img.classList.contains("active")
      );
      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + direction + imgs.length) % imgs.length;
      imgs.forEach((img, idx) => img.classList.toggle("active", idx === nextIndex));
      dots.querySelectorAll(".carousel-dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === nextIndex);
      });
    };

    prev.addEventListener("click", (event) => {
      event.stopPropagation();
      updateActive(-1);
    });
    next.addEventListener("click", (event) => {
      event.stopPropagation();
      updateActive(1);
    });

    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    wrapper.appendChild(controls);
  }

  wrapper.addEventListener("click", (event) => {
    const img = event.target.closest("img");
    if (!img) return;
    const allImgs = Array.from(wrapper.querySelectorAll("img"));
    openLightbox(allImgs, Number(img.dataset.index) || 0);
  });

  return wrapper;
};

const openLightbox = (images, startIndex) => {
  if (!images.length) return;

  const existing = document.querySelector(".lightbox");
  if (existing) existing.remove();

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Close">×</button>
      <button class="lightbox-nav prev" type="button" aria-label="Previous image">‹</button>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-nav next" type="button" aria-label="Next image">›</button>
    </div>
  `;

  const body = document.body;
  body.appendChild(lightbox);
  body.classList.add("lightbox-open");

  const imgEl = lightbox.querySelector(".lightbox-image");
  let index = startIndex;

  const render = () => {
    const src = images[index]?.src || images[0].src;
    imgEl.src = src;
    imgEl.alt = images[index]?.alt || "Product image";
  };

  const close = () => {
    lightbox.remove();
    body.classList.remove("lightbox-open");
    document.removeEventListener("keydown", handleKey);
  };

  const handleKey = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") {
      index = (index - 1 + images.length) % images.length;
      render();
    }
    if (event.key === "ArrowRight") {
      index = (index + 1) % images.length;
      render();
    }
  };

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-nav.prev").addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    render();
  });
  lightbox.querySelector(".lightbox-nav.next").addEventListener("click", () => {
    index = (index + 1) % images.length;
    render();
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", handleKey);

  render();
};

const renderOrderList = () => {
  const targets = [orderList, mobileOrderList].filter(Boolean);
  const order = getOrder();
  const entries = Object.values(order);
  targets.forEach((list) => {
    list.innerHTML = "";
    if (entries.length === 0) {
      list.innerHTML = "<p class='form-note'>No items added yet. Click “Add to Quote” on any product.</p>";
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
  if (mobileFab) {
    mobileFab.classList.remove("is-shake");
    // trigger reflow to restart animation
    void mobileFab.offsetWidth;
    mobileFab.classList.add("is-shake");
  }
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
  const items = Object.values(getOrder());
  const orderCount = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  if (mobileFab) {
    mobileFab.textContent = `View Quote (${orderCount})`;
    mobileFab.classList.toggle("has-items", orderCount > 0);
  }
};

const applySiteConfig = (config) => {
  if (!config) return;
  const brand = config.brand || {};
  const logo = document.getElementById("brandLogo");
  const mark = document.getElementById("brandMark");
  const brandName = document.getElementById("brandName");
  const brandTag = document.getElementById("brandTag");
  if (logo) {
    const logoSrc = brand.logo || "assets/company_logo.jpg";
    logo.src = logoSrc;
    if (mark) mark.classList.add("is-hidden");
    logo.onerror = () => {
      logo.onerror = null;
      logo.src = "assets/company_logo.jpg";
      if (mark) mark.classList.add("is-hidden");
    };
  }
  if (brandName && brand.name) {
    brandName.textContent = brand.name;
  }
  if (brandTag && brand.tagline) {
    brandTag.textContent = brand.tagline;
  }

  const navConfig = config.nav || {};
  const navHome = document.getElementById("navHome");
  const navCatalog = document.getElementById("navCatalog");
  const navCapabilities = document.getElementById("navCapabilities");
  const navAbout = document.getElementById("navAbout");
  if (navHome && navConfig.home) navHome.textContent = navConfig.home;
  if (navCatalog && navConfig.catalog) navCatalog.textContent = navConfig.catalog;
  if (navCapabilities && navConfig.capabilities) navCapabilities.textContent = navConfig.capabilities;
  if (navAbout && navConfig.about) navAbout.textContent = navConfig.about;

  const topBar = config.topBar || {};
  if (Array.isArray(topBar.phones)) {
    const phoneEls = [
      { phone: document.getElementById("topPhone1"), wa: document.getElementById("topWa1") },
      { phone: document.getElementById("topPhone2"), wa: document.getElementById("topWa2") }
    ];
    phoneEls.forEach((els, idx) => {
      const data = topBar.phones[idx];
      if (!data) return;
      if (els.phone) {
        const svg = els.phone.querySelector("svg");
        els.phone.textContent = data.label || data.tel || "";
        if (svg) els.phone.appendChild(svg);
        if (data.tel) els.phone.href = `tel:${data.tel}`;
      }
      if (els.wa && data.whatsapp) {
        const svg = els.wa.querySelector("svg");
        els.wa.textContent = "";
        if (svg) els.wa.appendChild(svg);
        els.wa.href = `https://wa.me/${data.whatsapp}`;
      }
    });
  }

  const solutions = config.solutions || {};
  const solutionsEyebrow = document.getElementById("solutionsEyebrow");
  const solutionsTitle = document.getElementById("solutionsTitle");
  const solutionsSubtitle = document.getElementById("solutionsSubtitle");
  const solutionsCarousel = document.getElementById("solutionsCarousel");
  const solutionsNext = document.getElementById("solutionsNext");

  if (solutionsEyebrow && solutions.eyebrow) {
    solutionsEyebrow.textContent = solutions.eyebrow;
  }
  if (solutionsTitle && solutions.title) {
    solutionsTitle.textContent = solutions.title;
  }
  if (solutionsSubtitle && solutions.subtitle) {
    solutionsSubtitle.textContent = solutions.subtitle;
  }

  if (solutionsCarousel && Array.isArray(solutions.items)) {
    const items = solutions.items;
    const controls = solutionsCarousel.querySelector(".solutions-controls");
    solutionsCarousel.innerHTML = "";
    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = `solution-card${index === 0 ? " is-active" : ""}`;
      card.dataset.solution = item.id || `solution_${index}`;
      card.innerHTML = `
        <div class="solution-media">
          <img src="${item.image || ""}" alt="${item.title || "Solution"}" />
        </div>
        <div class="solution-copy">
          <h3>${item.title || ""}</h3>
          <p class="solution-tag">${item.tag || ""}</p>
          <p class="solution-line">${item.line || ""}</p>
        </div>
      `;
      const img = card.querySelector("img");
      if (img) {
        img.onerror = () => {
          img.onerror = null;
          img.src = placeholderImage(item.title || "Solution");
        };
      }
      solutionsCarousel.appendChild(card);
    });
    if (controls) solutionsCarousel.appendChild(controls);
  }

  if (solutionsNext) {
    solutionsNext.textContent = solutions.nextLabel || solutionsNext.textContent || "Next";
    const advanceSolutions = () => {
      const cards = document.querySelectorAll(".solution-card");
      if (!cards.length) return;
      const currentIndex = Array.from(cards).findIndex((card) =>
        card.classList.contains("is-active")
      );
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % cards.length;
      cards.forEach((card, index) => {
        card.classList.toggle("is-active", index === nextIndex);
      });
    };
    solutionsNext.addEventListener("click", advanceSolutions);
    setInterval(advanceSolutions, 2000);
  }

  const about = config.about || {};
  const aboutEyebrow = document.getElementById("aboutEyebrow");
  const aboutTitle = document.getElementById("aboutTitle");
  const aboutLead = document.getElementById("aboutLead");
  const aboutWhyTitle = document.getElementById("aboutWhyTitle");
  const aboutWhyList = document.getElementById("aboutWhyList");

  if (aboutEyebrow && about.eyebrow) aboutEyebrow.textContent = about.eyebrow;
  if (aboutTitle && about.title) aboutTitle.textContent = about.title;
  if (aboutLead && about.lead) aboutLead.textContent = about.lead;
  if (aboutWhyTitle && about.whyTitle) aboutWhyTitle.textContent = about.whyTitle;

  if (aboutWhyList && Array.isArray(about.whyItems)) {
    aboutWhyList.innerHTML = "";
    const mainItems = [];
    const subItems = [];
    about.whyItems.forEach((item) => {
      if (typeof item !== "string") return;
      if (item.trim().toLowerCase().startsWith("sub:")) {
        subItems.push(item.replace(/^sub:\s*/i, "").trim());
      } else {
        mainItems.push(item);
      }
    });
    mainItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      aboutWhyList.appendChild(li);
    });
    if (subItems.length) {
      const lastItem = aboutWhyList.lastElementChild;
      const subList = document.createElement("ul");
      subList.className = "about-sublist";
      subItems.forEach((sub) => {
        const li = document.createElement("li");
        li.textContent = sub;
        subList.appendChild(li);
      });
      if (lastItem) {
        lastItem.appendChild(subList);
      } else {
        aboutWhyList.appendChild(subList);
      }
    }
  }

  const capabilities = config.capabilities || {};
  const capEyebrow = document.getElementById("capEyebrow");
  const capTitle = document.getElementById("capTitle");
  const capLead = document.getElementById("capLead");
  const capList = document.getElementById("capList");
  if (capEyebrow && capabilities.eyebrow) capEyebrow.textContent = capabilities.eyebrow;
  if (capTitle && capabilities.title) capTitle.textContent = capabilities.title;
  if (capLead && capabilities.lead) capLead.textContent = capabilities.lead;

  const capItems = Array.isArray(capabilities.items) && capabilities.items.length
    ? capabilities.items
    : (Array.isArray(solutions.items) ? solutions.items : []);
  if (capList) {
    capList.innerHTML = "";
    if (!capItems.length) {
      capList.innerHTML = "<li class='cap-item'>No capability items configured.</li>";
      return;
    }
    capItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "cap-item";
      li.innerHTML = `
        <div class="cap-item-media">
          <img src="${item.image || ""}" alt="${item.title || "Capability"}" />
        </div>
        <div class="cap-item-content">
          <h3>${item.title || ""}</h3>
          <p class="cap-item-tag">${item.tag || ""}</p>
          <p class="cap-item-line">${item.line || ""}</p>
        </div>
      `;
      const img = li.querySelector("img");
      if (img) {
        img.onerror = () => {
          img.onerror = null;
          img.src = placeholderImage(item.title || `Capability ${index + 1}`);
        };
      }
      capList.appendChild(li);
    });
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
  card.id = `product-${dataId}`;
  card.dataset.productCode = name;
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
  const availability = product.Availability || "Now";
  const isRequest = availability.toLowerCase() === "on request";
  const availabilityClass = isRequest ? "request" : "now";
  const availabilityLabel = isRequest ? "On request" : "Available";
  const priceText = String(product.Price || "");
  const showUnit = priceText && !/per\s+/i.test(priceText) && !/\//.test(priceText);
  const priceLine = priceText
    ? `<span class="price">Price: ${priceText}${showUnit ? `/${unit}` : ""}</span>`
    : "";
  const moqLine = `<span class="price">Min Qty: ${minQty} ${unit}</span>`;

  card.innerHTML = `
    <span class="badge badge-${availabilityClass}">${availabilityLabel}</span>
    <div class="catalog-body">
      <div class="details-bottom">
        <h3>${name}</h3>
        <p class="sku">${dimensionHtml}</p>
        <div class="price-row">
          ${priceLine}
          ${moqLine}
        </div>
        <div class="details-row">
          <div class="details-block">
            <button class="details-toggle" type="button" data-details="${dataId}">
              <span>+</span>
              More details
            </button>
            <div class="details" data-details-panel="${dataId}">
              <ul>${specs}</ul>
            </div>
          </div>
          <div class="card-actions">
            <div class="order-controls" data-qty="${minQty}">
              <button class="qty-btn" type="button" data-action="dec" aria-label="Decrease quantity">-</button>
              <span class="qty-value">${minQty} ${unit}</span>
              <button class="qty-btn" type="button" data-action="inc" aria-label="Increase quantity">+</button>
            </div>
            <button class="button order-btn" type="button" data-order="${dataId}">Add to Quote</button>
          </div>
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
  productIndex = [];
  let cardCount = 0;
  categories.forEach((category) => {
    (category.products || []).forEach((product) => {
      const card = createCard(product, category.name);
      catalogGrid.appendChild(card);
      if (card.dataset.productCode) {
        productIndex.push({
          code: card.dataset.productCode,
          id: card.id
        });
      }
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
    "Quote Request",
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
  renderSuggestions(currentSearchTerm);
};

if (globalSearch) {
  globalSearch.addEventListener("input", (event) => {
    handleSearchInput(event.target.value);
  });
}

const renderSuggestions = (term) => {
  if (!searchSuggestions) return;
  searchSuggestions.innerHTML = "";
  if (!term) {
    searchSuggestions.classList.remove("is-visible");
    return;
  }
  const matches = productIndex
    .filter((item) => item.code.toLowerCase().includes(term))
    .slice(0, 8);
  if (!matches.length) {
    searchSuggestions.classList.remove("is-visible");
    return;
  }
  matches.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "suggestion-item";
    btn.textContent = item.code;
    btn.addEventListener("click", () => {
      const target = document.getElementById(item.id);
      if (target) {
        document.body.classList.add("search-active");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      searchSuggestions.classList.remove("is-visible");
    });
    searchSuggestions.appendChild(btn);
  });
  searchSuggestions.classList.add("is-visible");
};

document.addEventListener("click", (event) => {
  if (!searchSuggestions) return;
  if (!searchSuggestions.contains(event.target) && event.target !== globalSearch) {
    searchSuggestions.classList.remove("is-visible");
  }
});
