// Общие функции: цена, корзина, история заказов и всплывающее сообщение.
// Корзина и заказы хранятся в localStorage (бэкенда нет).

const CART_KEY = "amirstroy_cart";
const ORDERS_KEY = "amirstroy_orders";

// 19500 -> "19 500 ₸"
function formatPrice(number) {
  const text = String(Math.round(number));
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (i > 0 && (text.length - i) % 3 === 0) {
      result += " ";
    }
    result += text[i];
  }
  return result + " ₸";
}

function readList(key) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function getCart() {
  return readList(CART_KEY);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function getOrders() {
  return readList(ORDERS_KEY);
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Сколько всего штук в корзине
function countCartItems() {
  const cart = getCart();
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].qty;
  }
  return count;
}


function getCartTotal(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
  }
  return total;
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) {
    return;
  }
  const count = countCartItems();
  badge.textContent = count;
  badge.hidden = count === 0;
}


function addToCart(item, amount) {
  const cart = getCart();
  let found = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === item.id) {
      found = cart[i];
    }
  }

  if (found === null) {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit,
      max: item.max,
      isService: item.isService,
      qty: 0
    });
    found = cart[cart.length - 1];
  }

  if (found.qty + amount > found.max) {
    found.qty = found.max;
    saveCart(cart);
    return "Only " + found.max + " available, so the cart now holds the maximum.";
  }

  found.qty += amount;
  saveCart(cart);
  return item.name + " added to the cart.";
}

// Всплывающее сообщение внизу экрана (jQuery fadeIn / fadeOut)
function showToast(message) {
  let toast = $("#toast");
  if (toast.length === 0) {
    toast = $('<div id="toast" class="toast-message" role="status"></div>');
    $("body").append(toast);
  }
  toast.stop(true, true).text(message).fadeIn(200).delay(2200).fadeOut(400);
}
