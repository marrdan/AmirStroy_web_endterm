// Страница труб: таблица цен, калькулятор и аккордеон с вопросами.

// 1. Таблица цен из массива pipeSizes
const tableBody = document.getElementById("pipe-table-body");
for (let i = 0; i < pipeSizes.length; i++) {
  const pipe = pipeSizes[i];
  const row = document.createElement("tr");
  if (!pipe.inStock) {
    row.className = "is-out";
  }

  const sizeCell = makeEl("th", "", "\u00D8 " + pipe.size + " mm");
  sizeCell.scope = "row";
  sizeCell.appendChild(makeEl("small", "", pipe.use));
  row.appendChild(sizeCell);

  row.appendChild(makeEl("td", "nowrap", formatPrice(pipe.perMeter)));
  row.appendChild(makeEl("td", "nowrap", formatPrice(pipe.perMeter * 4)));

  const stockCell = document.createElement("td");
  if (pipe.inStock) {
    stockCell.appendChild(makeEl("span", "stock", "In stock"));
  } else {
    stockCell.appendChild(makeEl("span", "stock stock-out", "Out"));
  }
  row.appendChild(stockCell);
  tableBody.appendChild(row);
}

// 2. Калькулятор: сколько труб по 4 метра нужно
const sizeSelect = document.getElementById("calc-size");
const lengthInput = document.getElementById("calc-length");
const reserveBox = document.getElementById("calc-reserve");
const lengthError = document.getElementById("calc-length-error");
const resultBox = document.getElementById("calc-result");
const addButton = document.getElementById("calc-add");

let pipesNeeded = 0; // сколько труб по 4 м сейчас посчитано

for (let i = 0; i < pipeSizes.length; i++) {
  if (pipeSizes[i].inStock) {
    const option = document.createElement("option");
    option.value = pipeSizes[i].size;
    option.textContent = "\u00D8 " + pipeSizes[i].size + " mm";
    sizeSelect.appendChild(option);
  }
}

function findPipe(size) {
  for (let i = 0; i < pipeSizes.length; i++) {
    if (pipeSizes[i].size === size) {
      return pipeSizes[i];
    }
  }
  return null;
}

function showLengthError(message) {
  lengthInput.classList.add("is-invalid");
  lengthInput.setAttribute("aria-invalid", "true");
  lengthError.textContent = message;
  resultBox.textContent = "Enter a correct length to see the result.";
  addButton.disabled = true;
  pipesNeeded = 0;
}

function calculate() {
  const text = lengthInput.value.trim();
  const length = Number(text);

  if (text === "") {
    showLengthError("Enter the length of your pipe route.");
    return;
  }
  if (isNaN(length) || length <= 0) {
    showLengthError("The length must be a number greater than 0.");
    return;
  }
  if (length > 500) {
    showLengthError("For more than 500 m please call us, we will make an offer.");
    return;
  }

  lengthInput.classList.remove("is-invalid");
  lengthInput.removeAttribute("aria-invalid");
  lengthError.textContent = "";

  let meters = length;
  if (reserveBox.checked) {
    meters = length * 1.1;
  }
  pipesNeeded = Math.ceil(meters / 4);
  const pipe = findPipe(Number(sizeSelect.value));
  const price = pipesNeeded * 4 * pipe.perMeter;

  resultBox.textContent = "You need " + pipesNeeded + " pipe" + (pipesNeeded === 1 ? "" : "s") +
    " of 4 m (" + pipesNeeded * 4 + " m in total). Price: " + formatPrice(price) + ".";
  addButton.disabled = false;
}

lengthInput.addEventListener("input", calculate);
sizeSelect.addEventListener("change", function () {
  if (lengthInput.value !== "") {
    calculate();
  }
});
reserveBox.addEventListener("change", function () {
  if (lengthInput.value !== "") {
    calculate();
  }
});

addButton.addEventListener("click", function () {
  if (pipesNeeded === 0) {
    return;
  }
  const pipe = findPipe(Number(sizeSelect.value));
  const message = addToCart({
    id: 1000 + pipe.size,
    name: "PPR pipe PN20 \u00D8" + pipe.size + " mm, 4 m length",
    price: pipe.perMeter * 4,
    unit: "pcs",
    max: 100,
    isService: false
  }, pipesNeeded);
  showToast(message);
});

// 3. Аккордеон (jQuery slideToggle)
const accordion = document.getElementById("faq");
for (let i = 0; i < pipeQuestions.length; i++) {
  const item = makeEl("div", "faq-item");

  const button = makeEl("button", "faq-question", pipeQuestions[i].question);
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.id = "faq-button-" + i;
  button.setAttribute("aria-controls", "faq-answer-" + i);

  const answer = makeEl("div", "faq-answer");
  answer.id = "faq-answer-" + i;
  answer.style.display = "none";
  answer.appendChild(makeEl("p", "", pipeQuestions[i].answer));

  item.appendChild(button);
  item.appendChild(answer);
  accordion.appendChild(item);
}

$("#faq").on("click", ".faq-question", function () {
  const button = $(this);
  const answer = button.next(".faq-answer");
  // stop(true, true): быстрые клики не ломают анимацию
  answer.stop(true, true).slideToggle(250, function () {
    button.attr("aria-expanded", answer.is(":visible"));
  });
  button.toggleClass("open");
});
