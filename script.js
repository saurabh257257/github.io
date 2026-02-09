const categoryFilters = document.querySelector("#categoryFilters");
const catalogGrid = document.querySelector("#catalogGrid");
const sampleList = document.querySelector("#sampleList");
const sampleForm = document.querySelector("#sampleForm");
const sampleClear = document.querySelector("#sampleClear");
const samplePanel = document.querySelector("#samplePanel");
const generateCatalogPdf = document.querySelector("#generateCatalogPdf");
const orderList = document.querySelector("#orderList");
const orderForm = document.querySelector("#orderForm");
const orderClear = document.querySelector("#orderClear");
const orderPanel = document.querySelector("#orderPanel");
const sideTabs = document.querySelectorAll(".side-tab");
const catalogSide = document.querySelector(".catalog-side");

const CART_KEY = "sampleCart";
const ORDER_KEY = "orderCart";

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

const updateSideFormsState = () => {
  if (!catalogSide) return;
  const sampleCount = Object.values(getCart()).reduce((sum, item) => sum + item.qty, 0);
  const orderCount = Object.values(getOrder()).reduce((sum, item) => sum + item.kg, 0);
  const empty = sampleCount === 0 && orderCount === 0;
  catalogSide.classList.toggle("is-empty", empty);
};

const renderCart = () => {
  if (!sampleList) return;
  const cart = getCart();
  sampleList.innerHTML = "";

  const entries = Object.values(cart);
  if (entries.length === 0) {
    sampleList.innerHTML = "<p class='form-note'>No samples added yet. Click “Request Sample” on any product.</p>";
    updateSideFormsState();
    return;
  }

  entries.forEach((item) => {
    const row = document.createElement("div");
    row.className = "sample-item";
    row.innerHTML = `
      <div class="sample-item-header">
        <div>
          <strong>${item.name}</strong>
          <div>${item.subtitle || ""}</div>
        </div>
        <div class="sample-qty">Qty: ${item.qty}</div>
        <button class="remove-item" type="button" data-action="remove" aria-label="Remove item">×</button>
      </div>
      <div class="sample-controls">
        <button type="button" data-action="dec" data-id="${item.id}">-</button>
        <button type="button" data-action="inc" data-id="${item.id}">+</button>
      </div>
    `;
    row.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "remove") {
          updateSampleQty(item.id, -9999);
          return;
        }
        const delta = btn.dataset.action === "inc" ? 1 : -1;
        updateSampleQty(item.id, delta);
      });
    });
    sampleList.appendChild(row);
  });
  updateSideFormsState();
};

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

const renderOrder = () => {
  if (!orderList) return;
  const order = getOrder();
  orderList.innerHTML = "";

  const entries = Object.values(order);
  if (entries.length === 0) {
    orderList.innerHTML = "<p class='form-note'>No items added yet. Click “Add to Quote” on any product.</p>";
    updateSideFormsState();
    return;
  }

  entries.forEach((item) => {
    const row = document.createElement("div");
    row.className = "sample-item";
    row.innerHTML = `
      <div class="sample-item-header">
        <div>
          <strong>${item.name}</strong>
          <div>${item.subtitle || ""}</div>
        </div>
        <div class="sample-qty">${item.kg} kg</div>
        <button class="remove-item" type="button" data-action="remove" aria-label="Remove item">×</button>
      </div>
      <div class="sample-controls">
        <button type="button" data-action="dec" data-id="${item.id}">-</button>
        <button type="button" data-action="inc" data-id="${item.id}">+</button>
      </div>
    `;
    row.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "remove") {
          updateOrderQty(item.id, -9999);
          return;
        }
        const delta = btn.dataset.action === "inc" ? 1 : -1;
        updateOrderQty(item.id, delta);
      });
    });
    orderList.appendChild(row);
  });
  updateSideFormsState();
};

const addToOrder = (product, qty) => {
  const order = getOrder();
  if (!order[product.id]) {
    order[product.id] = {
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      kg: 0
    };
  }
  order[product.id].kg += qty;
  setOrder(order);
  renderOrder();
  setActiveTab("order");
};

const updateOrderQty = (productId, delta) => {
  const order = getOrder();
  if (!order[productId]) return;
  order[productId].kg += delta;
  if (order[productId].kg <= 0) {
    delete order[productId];
  }
  setOrder(order);
  renderOrder();
};

const clearOrder = () => {
  sessionStorage.removeItem(ORDER_KEY);
  renderOrder();
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
  setActiveTab("sample");
};

const updateSampleQty = (productId, delta) => {
  const cart = getCart();
  if (!cart[productId]) return;
  cart[productId].qty += delta;
  if (cart[productId].qty <= 0) {
    delete cart[productId];
  }
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

  const badge = "";
  const specs = (product.specs || []).map((spec) => `<li>${spec}</li>`).join("");
  const priceLine = product.price ? `<span class="price">Price: ${product.price}</span>` : "";
  const minQty = Number(product.minQuantity) || 1;
  const moqLine = product.minQuantity ? `<span class="price">Min Qty: ${minQty} kg</span>` : "";

  card.innerHTML = `
    ${badge}
    <div class="catalog-body">
      <div class="details-bottom">
        <h3>${product.name}</h3>
        <p class="sku">${product.subtitle || ""}</p>
        <p>${product.summary || ""}</p>
        <div class="price-row">
          ${priceLine}
          ${moqLine}
        </div>
        <button class="details-toggle" type="button" data-details="${product.id}">
          <span>+</span>
          More details
        </button>
        <div class="details" data-details-panel="${product.id}">
          <ul>${specs}</ul>
        </div>
        <div class="card-actions">
          <div class="quote-controls" data-qty="${minQty}">
            <button class="qty-btn" type="button" data-action="dec">-</button>
            <span class="qty-value">${minQty} kg</span>
            <button class="qty-btn" type="button" data-action="inc">+</button>
          </div>
          <button class="button" type="button" data-order="${product.id}">Add to Quote</button>
          <button class="button" type="button" data-sample="${product.id}">Request Sample</button>
        </div>
      </div>
    </div>
  `;

  const carousel = createCarousel(product.images || [], product.name);
  card.insertBefore(carousel, card.firstChild);

  const sampleBtn = card.querySelector("[data-sample]");
  sampleBtn.addEventListener("click", () => {
    addToCart(product);
    samplePanel.classList.add("is-open");
  });

  const orderBtn = card.querySelector("[data-order]");
  const qtyControl = card.querySelector(".quote-controls");
  const qtyValue = card.querySelector(".qty-value");
  const updateQty = (delta) => {
    const current = Number(qtyControl.dataset.qty) || minQty;
    const next = Math.max(minQty, current + delta);
    qtyControl.dataset.qty = String(next);
    qtyValue.textContent = `${next} kg`;
  };

  qtyControl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const delta = btn.dataset.action === "inc" ? 1 : -1;
      updateQty(delta);
    });
  });

  orderBtn.addEventListener("click", () => {
    const qty = Number(qtyControl.dataset.qty) || minQty;
    addToOrder(product, qty);
    if (orderPanel) {
      orderPanel.classList.add("is-open");
    }
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
  if (!catalogGrid) return;
  catalogGrid.innerHTML = "";
  categories.forEach((category) => {
    (category.products || []).forEach((product) => {
      catalogGrid.appendChild(createCard(product, category.name));
    });
  });
  if (categoryFilters) {
    renderFilters(categories);
  }
  renderCart();
  renderOrder();
  updateSideFormsState();
  window.catalogData = categories;
};

const buildPdfDom = (categories) => {
  let root = document.querySelector("#pdfRoot");
  if (root) root.remove();
  root = document.createElement("div");
  root.id = "pdfRoot";
  root.className = "pdf-root";

  const header = document.createElement("div");
  header.innerHTML = `
    <h1>Arambhika Enablers</h1>
    <div class="pdf-meta">Product Catalog · sales@arambhika-enablers.com</div>
  `;
  root.appendChild(header);

  const overview = document.createElement("div");
  overview.className = "pdf-category";
  overview.innerHTML = `
    <h2>About Arambhika Enablers</h2>
    <p>Arambhika Enablers supplies precision-rolled nickel strips, copper bus bars, and prismatic cells for battery packs, electronics, and energy storage systems. Consistent thickness, tight tolerances, and reliable fulfillment.</p>
  `;
  root.appendChild(overview);

  const capabilities = document.createElement("div");
  capabilities.className = "pdf-category";
  capabilities.innerHTML = `
    <h2>Capabilities</h2>
    <p>Precision rolling, clean surface finish, custom cut and form, and bulk logistics with flexible MOQ.</p>
  `;
  root.appendChild(capabilities);

  const quality = document.createElement("div");
  quality.className = "pdf-category";
  quality.innerHTML = `
    <h2>Quality & Standards</h2>
    <p>Each batch includes mill test certificates, mechanical properties, and visual inspection reports. ISO-aligned processes available.</p>
  `;
  root.appendChild(quality);

  const applications = document.createElement("div");
  applications.className = "pdf-category";
  applications.innerHTML = `
    <h2>Applications</h2>
    <p>EV and mobility, energy storage systems, consumer devices, and OEM assembly.</p>
  `;
  root.appendChild(applications);

  categories.forEach((category) => {
    const section = document.createElement("div");
    section.className = "pdf-category";
    section.innerHTML = `
      <h2>${category.name}</h2>
      <p>${category.description || ""}</p>
    `;
    root.appendChild(section);

    const grid = document.createElement("div");
    grid.className = "pdf-grid";
    (category.products || []).forEach((product) => {
      const card = document.createElement("div");
      card.className = "pdf-card";
      const specs = (product.specs || []).map((s) => `<li>${s}</li>`).join("");
      const images = (product.images || [])
        .slice(0, 3)
        .map((src) => `<img src="${src}" alt="${product.name}">`)
        .join("");
      card.innerHTML = `
        <h3>${product.name}</h3>
        <div class="sku">${product.subtitle || ""}</div>
        <div>${product.summary || ""}</div>
        <ul class="pdf-specs">${specs}</ul>
        <div class="pdf-images">${images}</div>
      `;
      grid.appendChild(card);
    });
    root.appendChild(grid);
  });

  const contact = document.createElement("div");
  contact.className = "pdf-category";
  contact.innerHTML = `
    <h2>Contact</h2>
    <p>Email: sales@arambhika-enablers.com</p>
    <p>Phone: +91-XXXXXXXXXX</p>
    <p>Location: Pune, India (global shipping)</p>
  `;
  root.appendChild(contact);

  document.body.appendChild(root);
  return root;
};

const generatePdf = async () => {
  if (!window.catalogData || window.catalogData.length === 0) {
    alert("Catalog data not loaded yet.");
    return;
  }

  generateCatalogPdf.disabled = true;
  generateCatalogPdf.textContent = "Generating...";

  const root = buildPdfDom(window.catalogData);
  const canvas = await html2canvas(root, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("catalog.pdf");
  root.remove();

  generateCatalogPdf.disabled = false;
  generateCatalogPdf.textContent = "Generate PDF";
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

if (sampleClear) {
  sampleClear.addEventListener("click", clearCart);
}

if (sampleForm) {
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
    const countryCode = formData.get("countryCode") === "other"
      ? (formData.get("countryOther") || "+91")
      : (formData.get("countryCode") || "+91");
    const mobile = formData.get("mobile") || "";
    const description = formData.get("notes");
    const body = [
      "Sample Request",
      "",
      "Selected products:",
      ...lines,
      "",
      `Mobile: ${countryCode} ${mobile}`.trim(),
      `Email: ${formData.get("email") || "N/A"}`
    ]
      .concat(description ? [`Description: ${description}`] : [])
      .join("\n");

    const whatsapp = `https://wa.me/918882162827?text=${encodeURIComponent(body)}`;
    window.open(whatsapp, "_blank");
    sampleForm.reset();
  });
}

const setActiveTab = (key) => {
  sideTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === key);
  });
  if (samplePanel) {
    samplePanel.classList.toggle("is-active", key === "sample");
  }
  if (orderPanel) {
    orderPanel.classList.toggle("is-active", key === "order");
  }
};

sideTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(tab.dataset.tab);
  });
});

if (generateCatalogPdf) {
  generateCatalogPdf.addEventListener("click", generatePdf);
}

if (orderClear) {
  orderClear.addEventListener("click", clearOrder);
}

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const order = getOrder();
    const items = Object.values(order);
    if (items.length === 0) {
      alert("Add at least one item before submitting.");
      return;
    }

    const formData = new FormData(orderForm);
    const lines = items.map((item) => `${item.name} (${item.subtitle || ""}) x ${item.kg} kg`);
    const countryCode = formData.get("countryCode") === "other"
      ? (formData.get("countryOther") || "+91")
      : (formData.get("countryCode") || "+91");
    const mobile = formData.get("mobile") || "";
    const description = formData.get("notes");
    const body = [
      "Quote Request",
      "",
      "Selected products:",
      ...lines,
      "",
      `Mobile: ${countryCode} ${mobile}`.trim(),
      `Email: ${formData.get("email") || "N/A"}`
    ]
      .concat(description ? [`Description: ${description}`] : [])
      .join("\n");

    const whatsapp = `https://wa.me/918882162827?text=${encodeURIComponent(body)}`;
    window.open(whatsapp, "_blank");
    orderForm.reset();
  });
}

const aboutContactForm = document.querySelector("#aboutContactForm");
if (aboutContactForm) {
  aboutContactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(aboutContactForm);
    const countryCode = formData.get("countryCode") === "other"
      ? (formData.get("countryOther") || "+91")
      : (formData.get("countryCode") || "+91");
    const mobile = formData.get("mobile") || "";
    const description = formData.get("notes");
    const body = [
      "General Inquiry",
      "",
      "Selected products: None",
      "",
      `Mobile: ${countryCode} ${mobile}`.trim(),
      `Email: ${formData.get("email") || "N/A"}`
    ]
      .concat(description ? [`Description: ${description}`] : [])
      .join("\n");

    const whatsapp = `https://wa.me/918882162827?text=${encodeURIComponent(body)}`;
    window.open(whatsapp, "_blank");
    aboutContactForm.reset();
  });
}

document.querySelectorAll("[data-explore]").forEach((button) => {
  const key = button.dataset.explore;
  const panel = document.querySelector(`[data-explore-panel="${key}"]`);
  if (!panel) return;
  button.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

loadCatalog();

document.querySelectorAll(".phone-row select").forEach((select) => {
  const wrapper = select.closest("form");
  if (!wrapper) return;
  const otherField = wrapper.querySelector(".country-other");
  const update = () => {
    if (!otherField) return;
    otherField.classList.toggle("is-visible", select.value === "other");
  };
  select.addEventListener("change", update);
  update();
});
