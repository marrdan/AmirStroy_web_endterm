// Услуги сантехника: карточки из массива services.

const serviceGrid = document.getElementById("service-grid");

function isInCart(id) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      return true;
    }
  }
  return false;
}

function createServiceCard(service) {
  const col = makeEl("div", "col-12 col-md-6 col-lg-4");
  const card = makeEl("article", "card product");
  const body = makeEl("div", "card-body");

  body.appendChild(makeEl("h3", "product-name", service.name));
  body.appendChild(makeEl("p", "product-meta", service.text));
  body.appendChild(makeRating(service.rating));

  const buy = makeEl("div", "buy");
  if (service.price > 0) {
    buy.appendChild(makeEl("p", "price", "from " + formatPrice(service.price)));
  } else {
    buy.appendChild(makeEl("p", "price price-quote", "Price after inspection"));
  }

  const button = makeEl("button", "btn btn-main", "Book a plumber");
  button.type = "button";
  button.setAttribute("aria-label", "Book a plumber: " + service.name);
  button.addEventListener("click", function () {
    if (isInCart(service.id)) {
      showToast("This service is already in your cart.");
      return;
    }
    const message = addToCart({
      id: service.id,
      name: "Plumber: " + service.name,
      price: service.price,
      unit: "visit",
      max: 1,
      isService: true
    }, 1);
    showToast(message);
  });
  buy.appendChild(button);

  body.appendChild(buy);
  card.appendChild(body);
  col.appendChild(card);
  return col;
}

for (let i = 0; i < services.length; i++) {
  serviceGrid.appendChild(createServiceCard(services[i]));
}
