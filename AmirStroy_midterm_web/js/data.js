// Данные сайта. Всё содержимое каталога лежит здесь, а карточки создаются через JavaScript.
// stock: 0 = нет в наличии, 1-3 = мало, больше = есть. Для труб stock считается в метрах.

const categoryNames = {
  faucets: "Faucets",
  toilets: "Toilets",
  heaters: "Water heaters",
  pipes: "PPR pipes"
};

const products = [
  {
    id: 1,
    category: "faucets",
    code: "L4319-3",
    name: "Kitchen faucet LEDEME L4319-3",
    note: "Two-handle, for sink",
    price: 19500,
    unit: "pcs",
    rating: 4.5,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=cc6be79473fc30b30256a627cbe24729f1ceb5cc-5232206-images-thumbs&n=13"
  },
  {
    id: 2,
    category: "faucets",
    code: "L4398",
    name: "Kitchen faucet LEDEME L4398",
    note: "Chrome, for sink",
    price: 21000,
    unit: "pcs",
    rating: 4.7,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=b8caf676a9e8d1a6c7d7da9dff2947fc490a41f3-5173517-images-thumbs&n=13"
  },
  {
    id: 3,
    category: "faucets",
    code: "L4069B",
    name: "Kitchen faucet LEDEME L4069B",
    note: "Black, single-lever",
    price: 28730,
    unit: "pcs",
    rating: 4.4,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=8ffaed387ff25b675368f7d122f2d5a89bb3713b-10576628-images-thumbs&n=13"
  },
  {
    id: 4,
    category: "faucets",
    code: "L74004-2",
    name: "Kitchen faucet LEDEME L74004-2",
    note: "Black, single-lever",
    price: 30300,
    unit: "pcs",
    rating: 4.6,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=9e0af054c9fb756e2698fee7d4df567806c73912-8356716-images-thumbs&n=13"
  },
  {
    id: 5,
    category: "toilets",
    code: "LR360",
    name: "Floor-standing toilet Lara LR360",
    note: "Without tank",
    price: 40000,
    unit: "pcs",
    rating: 4.2,
    stock: 3,
    image: "https://avatars.mds.yandex.net/i?id=88e4121ebc869a43954b9fe1f613f155238054a1-5221577-images-thumbs&n=13"
  },
  {
    id: 6,
    category: "toilets",
    code: "Rosa Standard",
    name: "Compact toilet Rosa Standard",
    note: "Angled outlet",
    price: 39590,
    unit: "pcs",
    rating: 4.3,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=495d76ba73fba623a84bb3e9a00ad810ea1f553f-8244093-images-thumbs&n=13"
  },
  {
    id: 7,
    category: "toilets",
    code: "Rosa Lira",
    name: "Compact toilet Rosa Lira",
    note: "Tank included",
    price: 45990,
    unit: "pcs",
    rating: 4.6,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=a555abe2337454ffbb6c648d1c9c95148784a44c-4366165-images-thumbs&n=13"
  },
  {
    id: 8,
    category: "toilets",
    code: "Mito Grey",
    name: "Compact toilet Cersanit Mito Grey",
    note: "Dual flush, grey",
    price: 37170,
    unit: "pcs",
    rating: 4.1,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=398844ecf66ffd9d8b3d7ccacbcfa9e111071566-8340947-images-thumbs&n=13"
  },
  {
    id: 9,
    category: "heaters",
    code: "BLU1 R",
    name: "Water heater Ariston BLU1 R ABS 50 V",
    note: "50 L, storage tank",
    price: 69990,
    unit: "pcs",
    rating: 4.7,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=3b43df82f513bbf261c3703926c0b74a54e5b6e9-5624761-images-thumbs&n=13"
  },
  {
    id: 10,
    category: "heaters",
    code: "PRO R",
    name: "Water heater Ariston ABS PRO R 50 V",
    note: "50 L, storage tank",
    price: 62990,
    unit: "pcs",
    rating: 4.5,
    stock: 10,
    image: "https://avatars.mds.yandex.net/i?id=c8c028e1bd5c2cb6332604e9cffddf75e52a29ab-10936100-images-thumbs&n=13"
  },
  {
    id: 11,
    category: "heaters",
    code: "VELIS TECH",
    name: "Water heater Ariston VELIS TECH PW ABSE 50",
    note: "50 L, flat",
    price: 146000,
    unit: "pcs",
    rating: 4.8,
    stock: 0,
    image: "https://avatars.mds.yandex.net/i?id=75c03cd6273dd395365c70744667b2fa52cc138a-5257754-images-thumbs&n=13"
  },
  {
    id: 12,
    category: "pipes",
    code: "Ø20",
    name: "PPR pipe PN20 Ø20 mm, glass-fibre",
    note: "For hot water and heating",
    price: 286,
    unit: "m",
    rating: 4.6,
    stock: 100,
    image: "https://avatars.mds.yandex.net/i?id=05fa8c07430f9db11b88f796bcca0e70b0e2a19b-4483957-images-thumbs&n=13"
  },
  {
    id: 13,
    category: "pipes",
    code: "Ø32",
    name: "PPR pipe PN20 Kontur Ø32 mm",
    note: "For water supply",
    price: 1412,
    unit: "m",
    rating: 4.5,
    stock: 100,
    image: "https://avatars.mds.yandex.net/i?id=78a5d5c12b5a8c504d2e1ba9b0a28d860d4fe553-5876418-images-thumbs&n=13"
  }
];

// Услуги сантехника. price = 0 значит «цена после осмотра».
const services = [
  { id: 101, name: "Call-out and diagnosis", text: "A plumber comes, finds the problem and tells you the cost before any work starts.", price: 2000, rating: 4.8 },
  { id: 102, name: "Leaks and small repairs", text: "Dripping tap, leaking pipe or toilet tank, worn gaskets and seals.", price: 3000, rating: 4.7 },
  { id: 103, name: "Install a faucet, sink or toilet", text: "We remove the old one and fit the new one, with flexible hoses and a leak check.", price: 5000, rating: 4.6 },
  { id: 104, name: "Unclog a drain", text: "Blocked sink, bathtub or toilet, cleaned out mechanically.", price: 10000, rating: 4.5 },
  { id: 105, name: "Water heater installation", text: "Mounting on the wall, connecting to water and electricity, and a test run.", price: 0, rating: 4.7 },
  { id: 106, name: "PPR pipe laying", text: "New water lines in an apartment or house, welded from PPR pipes.", price: 0, rating: 4.9 }
];

// Размеры PPR труб PN20 (цена за метр). Из них строится таблица и калькулятор на странице труб.
const pipeSizes = [
  { size: 20, use: "A single tap, toilet or washing machine", perMeter: 427, inStock: true },
  { size: 32, use: "Whole apartment or small house", perMeter: 1412, inStock: true },
  { size: 40, use: "Main line of a house", perMeter: 2176, inStock: true },
  { size: 50, use: "Large house or heating mains", perMeter: 3540, inStock: true },
  { size: 75, use: "Apartment blocks, rarely needed at home", perMeter: 7588, inStock: false }
];

// Вопросы и ответы для аккордеона на странице труб.
const pipeQuestions = [
  { question: "What do I need to weld PPR pipes?", answer: "A PPR welding iron with nozzles of the right size, pipe scissors and the fittings. Our plumber can do the welding for you." },
  { question: "How do I connect PPR pipes to a metal tap or a water heater?", answer: "Use a fitting with a threaded brass insert. One side is welded to the pipe, the other screws onto the tap or the heater." },
  { question: "Can I hide PPR pipes inside a wall?", answer: "Yes. A welded joint is permanent, so the pipes can go inside a wall or a floor. Wrap hot-water pipes in insulation so they lose less heat." }
];
