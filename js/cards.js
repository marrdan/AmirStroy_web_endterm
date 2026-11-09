// Создание элементов страницы через DOM. Используется на главной и в каталоге.

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text !== undefined) {
    el.textContent = text;
  }
  return el;
}

// Звёзды рейтинга (ширина заливки берётся из CSS-переменной --rating)
function makeRating(rating) {
  const p = makeEl("p", "rating");
  const stars = makeEl("span", "stars");
  stars.style.setProperty("--rating", rating);
  stars.setAttribute("role", "img");
  stars.setAttribute("aria-label", "Rated " + rating + " out of 5");
  p.appendChild(stars);
  const number = makeEl("span", "", String(rating));
  number.setAttribute("aria-hidden", "true");
  p.appendChild(number);
  return p;
}

// Текст про наличие
function getStockText(product) {
  if (product.stock === 0) {
    return "Out of stock";
  }
  if (product.stock <= 3) {
    return product.stock + " left";
  }
  return "In stock";
}

// Одна карточка товара. columnClass задаёт ширину колонки Bootstrap.
function createProductCard(product, columnClass) {
  const col = makeEl("div", columnClass);
  if (product.stock === 0) {
    col.classList.add("is-out");
  }

  const card = makeEl("article", "card product");

  // Фото: под ним заглушка с названием модели
  const photo = makeEl("div", "photo");
  photo.appendChild(makeEl("span", "photo-code", product.code));
  photo.appendChild(makeEl("span", "photo-note", "photo soon"));
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.loading = "lazy";
  img.addEventListener("error", function () {
    img.hidden = true; // если фото не загрузилось, остаётся заглушка
  });
  photo.appendChild(img);
  card.appendChild(photo);

  const body = makeEl("div", "card-body");

  let stockClass = "stock";
  if (product.stock === 0) {
    stockClass += " stock-out";
  } else if (product.stock <= 3) {
    stockClass += " stock-few";
  }
  body.appendChild(makeEl("p", stockClass, getStockText(product)));
  body.appendChild(makeEl("h3", "product-name", product.name));
  body.appendChild(makeEl("p", "product-meta", product.note));
  body.appendChild(makeRating(product.rating));

  const buy = makeEl("div", "buy");
  let priceText = formatPrice(product.price);
  if (product.unit === "m") {
    priceText += "/m";
  }
  buy.appendChild(makeEl("p", "price", priceText));

  const button = makeEl("button", "btn btn-main add-btn");
  button.type = "button";
  if (product.stock === 0) {
    button.className = "btn btn-ghost";
    button.textContent = "Out of stock";
    button.disabled = true;
  } else {
    button.textContent = product.unit === "m" ? "Add 1 m to cart" : "Add to cart";
    button.setAttribute("aria-label", "Add to cart: " + product.name);
    button.addEventListener("click", function () {
      const message = addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        max: product.stock,
        isService: false
      }, 1);
      showToast(message);
    });
  }
  buy.appendChild(button);
  body.appendChild(buy);

  card.appendChild(body);
  col.appendChild(card);
  return col;
}
