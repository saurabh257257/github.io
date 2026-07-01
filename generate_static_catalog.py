"""
Generates static, crawler-visible HTML for the product catalog grid
from products.json, and injects it into index.html's #catalogGrid div.

This is purely for SEO: the existing script.js runs renderCatalog() on
page load, which does catalogGrid.innerHTML = "" and rebuilds everything
from products.json via JS — so JS-enabled visitors see no difference.
Crawlers/bots that don't execute JS now see full product text immediately.

Usage: python generate_static_catalog.py
Run this whenever products.json changes, before committing/pushing.
"""
import json
import re
import html
import urllib.parse

SITE = "https://www.arambhikaenablers.in/"

with open("products.json", encoding="utf-8") as f:
    data = json.load(f)


def esc(s):
    return html.escape(str(s), quote=True)


def to_dom_token(value):
    s = str(value or "").lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def normalize_code(value):
    return re.sub(r"\s+", " ", str(value or "").lower().strip())


def abs_url(path):
    """Build an absolute, percent-encoded URL for an asset path."""
    quoted = urllib.parse.quote(path, safe="/")
    return SITE + quoted


cards_html = []
product_schemas = []
image_sitemap_entries = []

for cat in data.get("categories", []):
    cat_name = cat.get("Category", "Category")
    for p in cat.get("products", []):
        name = p.get("ProductCode", "")
        sku = p.get("SKU", "")
        unit = p.get("Unit", "KG")
        min_qty = p.get("Minimum Quantity", 1)
        dims = (p.get("Product_Dimensions") or "").strip()
        dims_html = dims.replace("\n", "<br>")
        details = p.get("Additional_Details") or []
        if isinstance(details, str):
            details = [details]
        availability = p.get("Availability", "Now")
        is_request = availability.strip().lower() == "on request"
        avail_class = "request" if is_request else "now"
        avail_label = "On request" if is_request else "Available"
        price = str(p.get("Price") or "")
        show_unit = price and "per " not in price.lower() and "/" not in price
        price_line = f'<span class="price">Price: &#8377;{esc(price)}{("/" + esc(unit)) if show_unit else ""}</span>' if price else ""
        moq_line = f'<span class="price">Min Qty: {esc(min_qty)} {esc(unit)}</span>'

        title = f"{esc(name)}"
        if sku:
            title += f' <span style="color:#2d6abf;font-size:0.78em;font-weight:500;">({esc(sku)})</span>'

        specs = "".join(f"<li>{esc(d)}</li>" for d in details)

        img = (p.get("Image_Link") or [None])[0] or "assets/company_logo.jpg"

        data_id = to_dom_token(name) or "product"
        product_id = f"product-{data_id}"
        product_code_key = normalize_code(name)

        card = f'''<article class="catalog-card" data-category="{esc(cat_name)}" id="{esc(product_id)}" data-product-code="{esc(name)}" data-product-code-key="{esc(product_code_key)}">
  <span class="badge badge-{avail_class}">{avail_label}</span>
  <div class="carousel">
    <img src="{esc(img)}" alt="{esc(name)}" loading="lazy" class="active" />
  </div>
  <div class="catalog-body">
    <div class="details-bottom">
      <h3><a class="product-title-link" href="?product={esc(name)}#catalog">{title}</a></h3>
      <p class="sku">{dims_html}</p>
      <div class="price-row">
        {price_line}
        {moq_line}
      </div>
      <div class="details-row">
        <div class="details-block">
          <div class="details"><ul>{specs}</ul></div>
        </div>
      </div>
    </div>
  </div>
</article>'''
        cards_html.append(card)

        # --- Product schema (JSON-LD) ---
        images = p.get("Image_Link") or []
        if not images:
            images = ["assets/company_logo.jpg"]
        availability_url = (
            "https://schema.org/PreOrder" if is_request else "https://schema.org/InStock"
        )
        price_value = re.sub(r"[^\d.]", "", price) or "0"
        product_url = f"{SITE}?product={urllib.parse.quote(name)}#catalog"

        description_parts = [d for d in details]
        if dims:
            description_parts.insert(0, dims)
        description = " | ".join(description_parts) or name

        product_schemas.append({
            "@type": "Product",
            "name": name,
            "sku": sku,
            "image": [abs_url(img) for img in images],
            "description": description,
            "category": cat_name,
            "url": product_url,
            "offers": {
                "@type": "Offer",
                "url": product_url,
                "priceCurrency": "INR",
                "price": price_value,
                "availability": availability_url,
                "itemCondition": "https://schema.org/NewCondition",
                "eligibleQuantity": {
                    "@type": "QuantitativeValue",
                    "minValue": min_qty,
                    "unitCode": unit,
                },
            },
        })

        # --- Image sitemap entries ---
        for img in images:
            image_sitemap_entries.append({
                "loc": SITE,
                "image_loc": abs_url(img),
                "title": name,
                "caption": description[:300],
            })

static_catalog = "\n".join(cards_html)

with open("index.html", encoding="utf-8") as f:
    index_html = f.read()

# --- Inject static product cards into #catalogGrid ---
# Use depth tracking to find the MATCHING </div> for catalogGrid (not just the first one)
GRID_OPEN = '<div class="catalog-grid" id="catalogGrid">'
grid_start = index_html.find(GRID_OPEN)
if grid_start == -1:
    raise SystemExit("Could not find #catalogGrid div in index.html")

search_from = grid_start + len(GRID_OPEN)
depth = 1
grid_end = -1
i = search_from
while i < len(index_html):
    open_pos = index_html.find('<div', i)
    close_pos = index_html.find('</div>', i)
    if close_pos == -1:
        break
    if open_pos != -1 and open_pos < close_pos:
        depth += 1
        i = open_pos + 4
    else:
        depth -= 1
        if depth == 0:
            grid_end = close_pos + len('</div>')
            break
        i = close_pos + 6

if grid_end == -1:
    raise SystemExit("Could not find closing </div> for #catalogGrid")

new_index_html = (
    index_html[:grid_start]
    + GRID_OPEN + "\n" + static_catalog + "\n</div>"
    + index_html[grid_end:]
)
count = 1

# --- Inject Product schema (JSON-LD ItemList) ---
item_list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "item": prod}
        for i, prod in enumerate(product_schemas)
    ],
}
schema_json = json.dumps(item_list, indent=2, ensure_ascii=False)
schema_block = (
    "<!-- PRODUCT_SCHEMA_START -->\n"
    '  <!-- Structured data: Product catalog -->\n'
    '  <script type="application/ld+json">\n'
    f"{schema_json}\n"
    "  </script>\n"
    "  <!-- PRODUCT_SCHEMA_END -->"
)

schema_pattern = re.compile(
    r"<!-- PRODUCT_SCHEMA_START -->.*?<!-- PRODUCT_SCHEMA_END -->", re.DOTALL
)
new_index_html, schema_count = schema_pattern.subn(schema_block, new_index_html, count=1)

if schema_count == 0:
    raise SystemExit("Could not find PRODUCT_SCHEMA placeholder in index.html")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_index_html)

print(f"Injected {len(cards_html)} static product cards into index.html")
print(f"Injected Product schema (JSON-LD) for {len(product_schemas)} products into index.html")

# --- Generate image sitemap ---
img_sitemap_lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    "  <url>",
    f"    <loc>{html.escape(SITE)}</loc>",
]
for entry in image_sitemap_entries:
    img_sitemap_lines.append("    <image:image>")
    img_sitemap_lines.append(f"      <image:loc>{html.escape(entry['image_loc'])}</image:loc>")
    img_sitemap_lines.append(f"      <image:title>{html.escape(entry['title'])}</image:title>")
    img_sitemap_lines.append(f"      <image:caption>{html.escape(entry['caption'])}</image:caption>")
    img_sitemap_lines.append("    </image:image>")
img_sitemap_lines.append("  </url>")
img_sitemap_lines.append("</urlset>")
img_sitemap_lines.append("")

with open("image-sitemap.xml", "w", encoding="utf-8") as f:
    f.write("\n".join(img_sitemap_lines))

print(f"Generated image-sitemap.xml with {len(image_sitemap_entries)} images")
