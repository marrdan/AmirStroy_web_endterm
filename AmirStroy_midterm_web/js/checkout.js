// Страница заказа: корзина и форма с проверкой полей.

// ---------- 1. Корзина ----------
const cartList = document.getElementById("cart-list");
const cartBox = document.getElementById("cart-box");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const cartNote = document.getElementById("cart-note");
const cartError = document.getElementById("cart-error");

function changeQty(id, step) {
  const cart = getCart();
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      if (cart[i].qty + step > cart[i].max) {
        showToast("Only " + cart[i].max + " available.");
        return;
      }
      if (cart[i].qty + step < 1) {
        return;
      }
      cart[i].qty += step;
    }
  }
  saveCart(cart);
  showCart();
}

// Удаляем по id. Если товара уже нет, ничего не происходит.
function removeItem(id) {
  const cart = getCart();
  const newCart = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  saveCart(newCart);
  showCart();
}

function createCartRow(item) {
  const row = makeEl("li", "cart-row");
  row.setAttribute("data-id", item.id);

  const info = makeEl("div", "cart-info");
  info.appendChild(makeEl("strong", "", item.name));
  let priceText = "Price after inspection";
  if (item.price > 0) {
    priceText = formatPrice(item.price);
    if (item.isService) {
      priceText = "from " + priceText;
    }
  }
  info.appendChild(makeEl("span", "cart-price", priceText));
  row.appendChild(info);

  const controls = makeEl("div", "cart-qty");
  if (!item.isService) {
    const minus = makeEl("button", "qty-btn", "\u2212");
    minus.type = "button";
    minus.setAttribute("aria-label", "One less: " + item.name);
    minus.disabled = item.qty <= 1;
    minus.addEventListener("click", function () { changeQty(item.id, -1); });

    const plus = makeEl("button", "qty-btn", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", "One more: " + item.name);
    plus.addEventListener("click", function () { changeQty(item.id, 1); });

    controls.appendChild(minus);
    controls.appendChild(makeEl("span", "qty-number", String(item.qty)));
    controls.appendChild(plus);
  } else {
    controls.appendChild(makeEl("span", "qty-number", "1 visit"));
  }
  row.appendChild(controls);

  const lineTotal = item.price > 0 ? formatPrice(item.price * item.qty) : "\u2014";
  row.appendChild(makeEl("span", "cart-line", lineTotal));

  const remove = makeEl("button", "remove-btn", "Remove");
  remove.type = "button";
  remove.setAttribute("aria-label", "Remove from cart: " + item.name);
  remove.addEventListener("click", function () {
    // stop(true, true): быстрые клики не ломают анимацию
    $(row).stop(true, true).slideUp(200, function () {
      removeItem(item.id);
    });
  });
  row.appendChild(remove);

  return row;
}

function showCart() {
  const cart = getCart();
  cartList.innerHTML = "";
  cartBox.hidden = cart.length === 0;
  cartEmpty.hidden = cart.length > 0;

  let hasService = false;
  for (let i = 0; i < cart.length; i++) {
    cartList.appendChild(createCartRow(cart[i]));
    if (cart[i].isService) {
      hasService = true;
    }
  }
  cartTotal.textContent = formatPrice(getCartTotal(cart));
  cartNote.hidden = !hasService;

  if (cart.length > 0) {
    cartError.hidden = true;
  }
}

// ---------- 2. Форма ----------
const form = document.getElementById("order-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const methodSelect = document.getElementById("method");
const addressInput = document.getElementById("address");
const addressWrap = document.getElementById("address-wrap");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");
const agreeInput = document.getElementById("agree");
const sentBox = document.getElementById("sent");
const sentText = document.getElementById("sent-text");

function twoDigits(number) {
  return number < 10 ? "0" + number : String(number);
}

function dateToText(date) {
  return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
}

// Дата заказа: от сегодня до +60 дней
const today = new Date();
const lastDay = new Date();
lastDay.setDate(today.getDate() + 60);
dateInput.min = dateToText(today);
dateInput.max = dateToText(lastDay);

// Каждая проверка возвращает текст ошибки или пустую строку
function checkName() {
  const value = nameInput.value.trim();
  if (value === "") {
    return "Tell us how to address you.";
  }
  if (value.length < 2) {
    return "The name must have at least 2 letters.";
  }
  if (!/^[A-Za-z\u0400-\u04FF\u0492\u0493\u049A\u049B\u04A2\u04A3\u04B0\u04B1\u04E8\u04E9\u04BA\u04BB\u04D8\u04D9\u0406\u0456\u04AE\u04AF\s'-]+$/.test(value)) {
    return "The name can contain only letters.";
  }
  return "";
}

function checkPhone() {
  const value = phoneInput.value.trim();
  if (value === "") {
    return "Enter a phone number so we can call you.";
  }
  const digits = value.replace(/[\s\-()]/g, "");
  if (!/^(\+7|8|7)\d{10}$/.test(digits)) {
    return "Enter a phone number like +7 700 000 00 00.";
  }
  return "";
}

function checkEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    return "Enter your email.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter an email like name@example.com.";
  }
  return "";
}

function checkMethod() {
  if (methodSelect.value === "") {
    return "Choose how you want to receive the order.";
  }
  return "";
}

function needsAddress() {
  return methodSelect.value === "delivery" || methodSelect.value === "visit";
}

function checkAddress() {
  if (!needsAddress()) {
    return "";
  }
  const value = addressInput.value.trim();
  if (value === "") {
    return "Enter the address.";
  }
  if (value.length < 5) {
    return "The address is too short. Add the street and the house number.";
  }
  return "";
}

function checkDate() {
  const value = dateInput.value;
  if (value === "") {
    return "Choose a date.";
  }
  if (value < dateToText(today)) {
    return "The date cannot be in the past.";
  }
  if (value > dateToText(lastDay)) {
    return "We plan up to 60 days ahead. Choose an earlier date.";
  }
  if (new Date(value + "T00:00:00").getDay() === 0) {
    return "We do not work on Sundays. Choose another day.";
  }
  return "";
}

function checkNote() {
  if (noteInput.value.length > 300) {
    return "The comment is too long. Please use up to 300 characters.";
  }
  return "";
}

function checkAgree() {
  if (!agreeInput.checked) {
    return "Please agree so that we can call you about the order.";
  }
  return "";
}

const fields = [
  { input: nameInput, check: checkName },
  { input: phoneInput, check: checkPhone },
  { input: emailInput, check: checkEmail },
  { input: methodSelect, check: checkMethod },
  { input: addressInput, check: checkAddress },
  { input: dateInput, check: checkDate },
  { input: noteInput, check: checkNote },
  { input: agreeInput, check: checkAgree }
];

function showError(input, message) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  document.getElementById(input.id + "-error").textContent = message;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  document.getElementById(input.id + "-error").textContent = "";
}

// Возвращает true, если поле правильное
function validateField(field) {
  const message = field.check();
  if (message === "") {
    clearError(field.input);
    return true;
  }
  showError(field.input, message);
  return false;
}

// Пока ошибки нет, поле не трогаем. Когда ошибка показана, проверяем при каждом вводе,
// чтобы она исчезла сразу после исправления.
for (let i = 0; i < fields.length; i++) {
  const field = fields[i];
  const eventName = (field.input.type === "checkbox" || field.input.tagName === "SELECT") ? "change" : "input";
  field.input.addEventListener(eventName, function () {
    if (field.input.classList.contains("is-invalid")) {
      validateField(field);
    }
  });
  // После ухода из поля тоже проверяем, если в нём что-то ввели
  field.input.addEventListener("blur", function () {
    if (field.input.value !== "" && field.input.type !== "checkbox") {
      validateField(field);
    }
  });
}

// Поле адреса показываем только для доставки и выезда сантехника
methodSelect.addEventListener("change", function () {
  if (needsAddress()) {
    $(addressWrap).stop(true, true).slideDown(200);
  } else {
    $(addressWrap).stop(true, true).slideUp(200);
    clearError(addressInput);
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();

  let firstBad = null;
  for (let i = 0; i < fields.length; i++) {
    if (!validateField(fields[i]) && firstBad === null) {
      firstBad = fields[i].input;
    }
  }

  const cart = getCart();
  if (cart.length === 0) {
    cartError.hidden = false;
    if (firstBad === null) {
      firstBad = cartError;
    }
  }

  if (firstBad !== null) {
    if (firstBad === cartError) {
      firstBad.setAttribute("tabindex", "-1");
    }
    firstBad.focus();
    return;
  }

  // Всё правильно: сохраняем заказ в историю
  const orders = getOrders();
  let hasQuote = false;
  const items = [];
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].price === 0) {
      hasQuote = true;
    }
    items.push({ name: cart[i].name, qty: cart[i].qty, price: cart[i].price, isService: cart[i].isService });
  }
  const order = {
    number: "AS-" + (1001 + orders.length),
    date: new Date().toLocaleDateString("en-GB"),
    items: items,
    total: getCartTotal(cart),
    hasQuote: hasQuote,
    status: "Received"
  };
  orders.push(order);
  saveOrders(orders);
  saveCart([]);

  // Очищаем форму и показываем сообщение
  form.reset();
  for (let i = 0; i < fields.length; i++) {
    clearError(fields[i].input);
  }
  $(addressWrap).hide();
  showCart();

  sentText.textContent = "Order " + order.number + " for " + formatPrice(order.total) +
    " is saved in your order history. We will call you during working hours to confirm availability and price.";
  $(sentBox).stop(true, true).hide().fadeIn(400);
  sentBox.focus();
});

showCart();
