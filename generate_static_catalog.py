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


cards_html = []

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

static_catalog = "\n".join(cards_html)

with open("index.html", encoding="utf-8") as f:
    index_html = f.read()

pattern = re.compile(r'(<div class="catalog-grid" id="catalogGrid">)(.*?)(</div>)', re.DOTALL)
new_index_html, count = pattern.subn(
    lambda m: m.group(1) + "\n" + static_catalog + "\n" + m.group(3),
    index_html,
    count=1
)

if count == 0:
    raise SystemExit("Could not find #catalogGrid div in index.html")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(new_index_html)

print(f"Injected {len(cards_html)} static product cards into index.html")
