// Каталог: поиск, фильтр по категории, переключатель «в наличии», сортировка.

const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const stockSwitch = document.getElementById("only-stock");
const chips = document.querySelectorAll(".chip[data-category]");
const countText = document.getElementById("result-count");
const emptyBox = document.getElementById("empty-result");
const emptyText = document.getElementById("empty-text");
const resetButton = document.getElementById("reset-filters");

let activeCategory = "all";

function showProducts() {
  const text = searchInput.value.trim().toLowerCase();
  const list = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (activeCategory !== "all" && p.category !== activeCategory) {
      continue;
    }
    if (stockSwitch.checked && p.stock === 0) {
      continue;
    }
    const searchable = (p.name + " " + p.note + " " + p.code).toLowerCase();
    if (text !== "" && searchable.indexOf(text) === -1) {
      continue;
    }
    list.push(p);
  }

  // Сортировка
  if (sortSelect.value === "cheap") {
    list.sort(function (a, b) { return a.price - b.price; });
  } else if (sortSelect.value === "expensive") {
    list.sort(function (a, b) { return b.price - a.price; });
  } else if (sortSelect.value === "rating") {
    list.sort(function (a, b) { return b.rating - a.rating; });
  }

  // Рисуем карточки
  grid.innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    grid.appendChild(createProductCard(list[i], "col-12 col-sm-6 col-lg-3"));
  }

  // Плавное появление (stop, чтобы быстрый ввод не копил анимации)
  $(grid).stop(true, true).css("opacity", 0).animate({ opacity: 1 }, 200);

  countText.textContent = "Showing " + list.length + " of " + products.length + " items";

  // Пустой результат
  if (list.length === 0) {
    if (text !== "") {
      emptyText.textContent = "Nothing found for \u201C" + searchInput.value.trim() + "\u201D. Check the spelling or try another word.";
    } else {
      emptyText.textContent = "No items match these filters.";
    }
    emptyBox.hidden = false;
  } else {
    emptyBox.hidden = true;
  }
}

function setCategory(category) {
  activeCategory = category;
  for (let i = 0; i < chips.length; i++) {
    const isActive = chips[i].getAttribute("data-category") === category;
    chips[i].classList.toggle("active", isActive);
    chips[i].setAttribute("aria-pressed", isActive);
  }
  showProducts();
}

for (let i = 0; i < chips.length; i++) {
  chips[i].addEventListener("click", function () {
    setCategory(this.getAttribute("data-category"));
  });
}

searchInput.addEventListener("input", showProducts);
sortSelect.addEventListener("change", showProducts);
stockSwitch.addEventListener("change", showProducts);

resetButton.addEventListener("click", function () {
  searchInput.value = "";
  sortSelect.value = "default";
  stockSwitch.checked = false;
  setCategory("all");
  searchInput.focus();
});

// Ссылка с главной: catalog.html?category=toilets
const startCategory = new URLSearchParams(location.search).get("category");
if (startCategory !== null && categoryNames[startCategory] !== undefined) {
  setCategory(startCategory);
} else {
  setCategory("all");
}
