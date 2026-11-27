// js/ui.js — Қайталанатын DOM және хабарлама функциялары
function createElementWithProps(tagName, props = {}, styles = {}) {
  const el = document.createElement(tagName);
  Object.assign(el, props);
  Object.assign(el.style, styles);
  return el;
}

function setStatusMessage(el, text, type = "info") {
  if (!el) return;
  el.textContent = text;

  if (type === "error") {
    el.style.backgroundColor = "#fdecea";
    el.style.color = "#b81c1c";
  } else if (type === "success") {
    el.style.backgroundColor = "#eef4f0";
    el.style.color = "#1f4d3b";
  } else {
    el.style.backgroundColor = "transparent";
    el.style.color = "inherit";
  }
}
// js/ui.js — Себетті рендерле
function formatPriceKZT(amount) {
  return `${Number(amount || 0).toLocaleString("kk-KZ")} ₸`;
}
function renderCartView(items, listSelector = "#cartItems", totalSelector = "#cartTotal") {
  const listEl = document.querySelector(listSelector);
  const totalEl = document.querySelector(totalSelector);
  if (!listEl || !totalEl) return;

  if (!items.length) {
    listEl.innerHTML = `<p class="cart-empty">Себет бос.</p>`;
    totalEl.textContent = formatPriceKZT(0);
    return;
  }

  listEl.innerHTML = items
    .map(
      (item) => `
      <div class="cart-row" data-cart-id="${item.id}">
        <span class="cart-title">${item.title}</span>
        <span class="cart-price">${formatPriceKZT(item.price)}</span>
        <div class="cart-qty-controls">
          <button type="button" class="cart-dec" data-id="${item.id}">-</button>
          <span class="cart-qty">${item.qty}</span>
          <button type="button" class="cart-inc" data-id="${item.id}">+</button>
        </div>
        <button type="button" class="cart-remove" data-id="${item.id}">Жою</button>
      </div>
    `
    )
    .join("");

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = formatPriceKZT(totalAmount);
}