// Главная: считаем данные для плиток категорий и показываем три товара из каталога.

// Плитки категорий: сколько моделей и от какой цены
const tiles = document.querySelectorAll(".cat[data-category]");
for (let i = 0; i < tiles.length; i++) {
  const category = tiles[i].getAttribute("data-category");
  let count = 0;
  let lowest = 0;
  for (let j = 0; j < products.length; j++) {
    if (products[j].category === category) {
      count++;
      if (products[j].stock > 0 && (lowest === 0 || products[j].price < lowest)) {
        lowest = products[j].price;
      }
    }
  }
  const meta = tiles[i].querySelector(".cat-meta");
  if (category === "pipes") {
    meta.textContent = "from " + formatPrice(lowest) + " per meter, with a beginner's guide";
  } else {
    meta.textContent = count + " models, from " + formatPrice(lowest);
  }
}

// Три товара «From the catalog»
const featuredIds = [1, 9, 11];
const featured = document.getElementById("featured");
for (let i = 0; i < featuredIds.length; i++) {
  for (let j = 0; j < products.length; j++) {
    if (products[j].id === featuredIds[i]) {
      featured.appendChild(createProductCard(products[j], "col-12 col-sm-6 col-lg-4"));
    }
  }
}
