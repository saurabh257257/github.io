const filterButtons = document.querySelectorAll(".filter-btn");
const catalogCards = document.querySelectorAll(".catalog-card");

const setActiveButton = (button) => {
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");
};

const filterCatalog = (filter) => {
  catalogCards.forEach((card) => {
    const tags = card.dataset.tags || "";
    if (filter === "all" || tags.includes(filter)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    setActiveButton(button);
    filterCatalog(filter);
  });
});
