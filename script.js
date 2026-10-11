
const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 499,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Wireless Headphones",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Stylish Watch",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Casual Sneakers",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Smartphone",
    price: 12999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Fashion Handbag",
    price: 1299,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Denim Jacket",
    price: 1799,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 899,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
  }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

// Display products
function displayProducts(items) {
  productGrid.innerHTML = "";

  document.getElementById("emptyMessage").hidden =
    items.length !== 0;

  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/600x400?text=Product";
    };

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-button";
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, button);
    info.append(category, name, bottom);
    card.append(image, info);
    productGrid.appendChild(card);
  });
}

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

// Search and category filter
function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
document.getElementById("searchBtn")
  .addEventListener("click", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

// Add products to cart
function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();

  document.getElementById("checkoutMessage").textContent = "";
}

// Change item quantity
function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  renderCart();
}

// Remove an item
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// Update cart display and total
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let totalQuantity = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    empty.style.padding = "20px 0";
    cartItems.appendChild(empty);
  }

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return;

    totalQuantity += item.quantity;
    totalPrice += product.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");

    const name = document.createElement("h4");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price) + " each";

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");
    minus.addEventListener("click", () =>
      changeQuantity(product.id, -1)
    );

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");
    plus.addEventListener("click", () =>
      changeQuantity(product.id, 1)
    );

    controls.append(minus, quantity, plus);

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () =>
      removeFromCart(product.id)
    );

    details.append(name, price, controls, remove);

    const subtotal = document.createElement("strong");
    subtotal.textContent =
      formatPrice(product.price * item.quantity);

    row.append(details, subtotal);
    cartItems.appendChild(row);
  });

  document.getElementById("cartCount").textContent =
    totalQuantity;

  document.getElementById("cartTotal").textContent =
    formatPrice(totalPrice);
}

// Open and close cart
function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
  cartPanel.setAttribute("aria-hidden", "true");
}

document.getElementById("cartToggle")
  .addEventListener("click", openCart);

document.getElementById("closeCart")
  .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

// Demo checkout
document.getElementById("checkoutBtn")
  .addEventListener("click", () => {
    const message = document.getElementById("checkoutMessage");

    if (cart.length === 0) {
      message.textContent = "Please add a product to your cart first.";
      return;
    }

    message.textContent =
      "Demo only: connect a payment system and backend to place orders.";
  });

// Start website
displayProducts(products);
renderCart();
                
