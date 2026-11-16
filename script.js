
const starterProducts = [
  // ልብስ
  {id: 1, name: "የወንዶች ሸሚዝ", price: 800, category: "ልብስ", image: "👕"},
  {id: 2, name: "የሴቶች ቀሚስ", price: 1500, category: "ልብስ", image: "👗"},
  {id: 3, name: "ጃኬት", price: 2200, category: "ልብስ", image: "🧥"},

  // ጫማ
  {id: 4, name: "ስፖርት ጫማ", price: 1800, category: "ጫማ", image: "👟"},
  {id: 5, name: "የቆዳ ጫማ", price: 2500, category: "ጫማ", image: "👞"},

  // ቦርሳ
  {id: 6, name: "የትምህርት ቦርሳ", price: 1200, category: "ቦርሳ", image: "🎒"},
  {id: 7, name: "የእጅ ቦርሳ", price: 1600, category: "ቦርሳ", image: "👜"},

  // ስልክና አክሰሰሪ
  {id: 8, name: "ስማርት ስልክ", price: 12000, category: "ስልክ", image: "📱"},
  {id: 9, name: "ሄድፎን", price: 900, category: "ስልክ", image: "🎧"},
  {id: 10, name: "ቻርጀር", price: 350, category: "ስልክ", image: "🔌"},

  // የቤት እቃዎች
  {id: 11, name: "ወንበር", price: 1800, category: "የቤት እቃ", image: "🪑"},
  {id: 12, name: "መብራት", price: 700, category: "የቤት እቃ", image: "💡"},
  {id: 13, name: "የማብሰያ ዕቃ", price: 1100, category: "የቤት እቃ", image: "🍳"},

  // የውበት እቃዎች
  {id: 14, name: "የፊት ክሬም", price: 600, category: "የውበት እቃ", image: "🧴"},
  {id: 15, name: "ሽቶ", price: 1300, category: "የውበት እቃ", image: "🌸"},

  // የትምህርት እቃዎች
  {id: 16, name: "ደብተር", price: 100, category: "የትምህርት እቃ", image: "📓"},
  {id: 17, name: "እስክሪብቶ", price: 25, category: "የትምህርት እቃ", image: "🖊️"}
];

// የተቀመጡ ምርቶችን አንድ ጊዜ ብቻ መጠቀም
let products = JSON.parse(localStorage.getItem("suraProducts")) || starterProducts;
let cart = JSON.parse(localStorage.getItem("suraCart")) || [];

const productGrid = document.getElementById("productGrid");
const cartItems = document.getElementById("cartItems");
const totalElement = document.getElementById("total");

function saveProducts() {
  localStorage.setItem("suraProducts", JSON.stringify(products));
}

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

    const category = document.createElement("p");
    category.textContent = product.category;

    const price = document.createElement("p");
    price.textContent = product.price.toLocaleString("en-US") + " ብር";

    const button = document.createElement("button");
    button.textContent = "ወደ ቅርጫት ጨምር";
    button.addEventListener("click", () => addToCart(product.id));

    card.append(image, name, category, price, button);
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
    amount.textContent =
      `${(item.price * item.quantity).toLocaleString("en-US")} ብር`;

    const remove = document.createElement("button");
    remove.textContent = "−";
    remove.addEventListener("click", () => changeQuantity(item.id, -1));

    const add = document.createElement("button");
    add.textContent = "+";
    add.addEventListener("click", () => changeQuantity(item.id, 1));

    row.append(name, amount, remove, add);
    cartItems.appendChild(row);
  });

  totalElement.textContent = total.toLocaleString("en-US") + " ብር";
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
    total: cart.reduce((sum, item) =>
      sum + item.price * item.quantity, 0),
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
    "ትዕዛዝዎ ተመዝግቧል! አመሰግናለሁ።";
});

saveProducts();
showProducts();
showCart();
