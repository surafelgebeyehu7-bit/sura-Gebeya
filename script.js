
const starterProducts = [
  {id: 1, name: "ሸሚዝ", price: 800, category: "ልብስ", image: "👕"},
  {id: 2, name: "ጫማ", price: 1500, category: "ጫማ", image: "👟"},
  {id: 3, name: "ቦርሳ", price: 1200, category: "ቦርሳ", image: "🎒"}
];

let products = JSON.parse(localStorage.getItem("suraProducts")) || starterProducts;
let cart = JSON.parse(localStorage.getItem("suraCart")) || [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");

function saveCart() {
  localStorage.setItem("suraCart", JSON.stringify(cart));
}

function showProducts(list = products) {
  productGrid.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";

    const image = document.createElement("div");
    image.textContent = product.image || "📦";
    image.style.fontSize = "55px";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = product.price + " ብር";

    const button = document.createElement("button");
    button.textContent = "ወደ ቅርጫት ጨምር";
    button.addEventListener("click", () => addToCart(product.id));

    card.append(image, name, price, button);
    productGrid.appendChild(card);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({...product, quantity: 1});
  }

  saveCart();
  showCart();
}

function showCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const name = document.createElement("span");
    name.textContent = `${item.name} × ${item.quantity}`;

    const amount = document.createElement("span");
    amount.textContent = `${item.price * item.quantity} ብር`;

    const remove = document.createElement("button");
    remove.textContent = "−";
    remove.addEventListener("click", () => changeQuantity(item.id, -1));

    const add = document.createElement("button");
    add.textContent = "+";
    add.addEventListener("click", () => changeQuantity(item.id, 1));

    row.append(name, amount, remove, add);
    cartItems.appendChild(row);
  });

  totalElement.textContent = total;
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  showCart();
}

document.getElementById("searchInput").addEventListener("input", event => {
  const word = event.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(word) ||
    p.category.toLowerCase().includes(word)
  );
  showProducts(filtered);
});

document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("እባክዎ መጀመሪያ ምርት ወደ ቅርጫት ይጨምሩ።");
    return;
  }

  const order = {
    id: Date.now(),
    name: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
    items: cart.map(item => ({...item})),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString()
  };

  if (!order.name || !order.phone || !order.address) {
    alert("እባክዎ ሁሉንም ቦታዎች ይሙሉ።");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("suraOrders")) || [];
  orders.push(order);
  localStorage.setItem("suraOrders", JSON.stringify(orders));

  cart = [];
  saveCart();
  showCart();

  document.getElementById("orderForm").reset();
  document.getElementById("orderMessage").textContent =
    "ትዕዛዝዎ ተመዝግቧል! አመሰግናለን።";
});

showProducts();
showCart();
  showCart();
}

function showCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const name = document.createElement("span");
    name.textContent = `${item.name} × ${item.quantity}`;

    const amount = document.createElement("span");
    amount.textContent = `${item.price * item.quantity} ብር`;

    const remove = document.createElement("button");
    remove.textContent = "−";
    remove.addEventListener("click", () => changeQuantity(item.id, -1));

    const add = document.createElement("button");
    add.textContent = "+";
    add.addEventListener("click", () => changeQuantity(item.id, 1));

    row.append(name, amount, remove, add);
    cartItems.appendChild(row);
  });

  totalElement.textContent = total;
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  showCart();
}

document.getElementById("searchInput").addEventListener("input", event => {
  const word = event.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(word) ||
    p.category.toLowerCase().includes(word)
  );
  showProducts(filtered);
});

document.getElementById("orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    alert("እባክዎ መጀመሪያ ምርት ወደ ቅርጫት ይጨምሩ።");
    return;
  }

  const order = {
    id: Date.now(),
    name: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
    items: cart.map(item => ({...item})),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    date: new Date().toLocaleString()
  };

  if (!order.name || !order.phone || !order.address) {
    alert("እባክዎ ሁሉንም ቦታዎች ይሙሉ።");
    return;
  }

  const orders = JSON.parse(localStorage.getItem("suraOrders")) || [];
  orders.push(order);
  localStorage.setItem("suraOrders", JSON.stringify(orders));

  cart = [];
  saveCart();
  showCart();

  document.getElementById("orderForm").reset();
  document.getElementById("orderMessage").textContent =
    "ትዕዛዝዎ ተመዝግቧል! አመሰግናለን።";
});

showProducts();
showCart();
