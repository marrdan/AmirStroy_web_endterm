// История заказов: читаем из localStorage, считаем сумму и количество.

const historyBody = document.getElementById("history-body");
const summary = document.getElementById("history-summary");
const clearButton = document.getElementById("clear-history");

function showHistory() {
  const orders = getOrders();
  historyBody.innerHTML = "";

  if (orders.length === 0) {
    const row = makeEl("tr", "empty-row");
    const cell = makeEl("td", "");
    cell.colSpan = 4;
    cell.appendChild(document.createTextNode("No orders yet. "));
    const catalogLink = makeEl("a", "", "Browse the catalog");
    catalogLink.href = "catalog.html";
    cell.appendChild(catalogLink);
    cell.appendChild(document.createTextNode(" or "));
    const servicesLink = makeEl("a", "", "book a plumber");
    servicesLink.href = "services.html";
    cell.appendChild(servicesLink);
    cell.appendChild(document.createTextNode("."));
    row.appendChild(cell);
    historyBody.appendChild(row);
    summary.textContent = "Everything you order will be listed here: what, when and for how much.";
    clearButton.hidden = true;
    return;
  }

  let sum = 0;
  // Новые заказы сверху
  for (let i = orders.length - 1; i >= 0; i--) {
    const order = orders[i];
    sum += order.total;

    const row = document.createElement("tr");
    row.appendChild(makeEl("td", "nowrap", order.date));

    const itemsCell = document.createElement("td");
    itemsCell.appendChild(makeEl("strong", "", order.number));
    const list = makeEl("ul", "order-items");
    for (let j = 0; j < order.items.length; j++) {
      const item = order.items[j];
      let text = item.name;
      if (!item.isService) {
        text += " \u00D7 " + item.qty;
      }
      list.appendChild(makeEl("li", "", text));
    }
    itemsCell.appendChild(list);
    row.appendChild(itemsCell);

    let totalText = formatPrice(order.total);
    if (order.hasQuote) {
      totalText += " + after inspection";
    }
    row.appendChild(makeEl("td", "", totalText));

    const statusCell = document.createElement("td");
    statusCell.appendChild(makeEl("span", "stock", order.status));
    row.appendChild(statusCell);

    historyBody.appendChild(row);
  }

  summary.textContent = "Orders: " + orders.length + ". Total of all orders: " + formatPrice(sum) + ".";
  clearButton.hidden = false;
}

clearButton.addEventListener("click", function () {
  // stop(true, true): повторный быстрый клик не запускает эффект заново
  $("#history-body tr").stop(true, true).fadeOut(250).promise().done(function () {
    saveOrders([]);
    showHistory();
  });
});

showHistory();
