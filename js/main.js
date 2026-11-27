// js/main.js — Негізгі интерактивті логика және себет
function syncCart() {
  if (typeof saveCartToStorage === "function") {
    saveCartToStorage(cartItems);
  }
  if (typeof renderCartView === "function") {
    renderCartView(cartItems);
  }
}

function addToCart(bookId) {
  if (typeof booksData === "undefined" || typeof cartItems === "undefined") return;
  const book = booksData.find((item) => Number(item.id) === Number(bookId));
  if (!book) return;

  const existing = cartItems.find((item) => Number(item.id) === Number(book.id));
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({
      id: book.id,
      title: book.title,
      price: Number(book.price),
      qty: 1
    });
  }
  syncCart();
}

function updateCartQty(bookId, delta) {
  if (typeof cartItems === "undefined") return;
  const target = cartItems.find((item) => Number(item.id) === Number(bookId));
  if (!target) return;

  target.qty += delta;
  if (target.qty <= 0) {
    removeFromCart(bookId);
    return;
  }
  syncCart();
}

function removeFromCart(bookId) {
  if (typeof cartItems === "undefined") return;
  cartItems = cartItems.filter((item) => Number(item.id) !== Number(bookId));
  syncCart();
}

document.addEventListener("DOMContentLoaded", () => {
  const searchKey =
    typeof STORAGE_KEYS !== "undefined" ? STORAGE_KEYS.searchQuery : "booknestSearchQuery";
  const rulesKey =
    typeof STORAGE_KEYS !== "undefined"
      ? STORAGE_KEYS.clubRulesAccepted
      : "booknestClubRulesAccepted";

  // 1. Кітап кестесін іздеу
  const searchInput =
    document.getElementById("bookSearch") ||
    document.querySelector('input[type="search"]');
  const tableRows = Array.from(document.querySelectorAll(".books-table tbody tr"));

  if (searchInput && tableRows.length > 0) {
    const emptyMessage =
      typeof createElementWithProps === "function"
        ? createElementWithProps(
            "p",
            { id: "emptySearchMessage", textContent: "Мұндай кітап табылмады." },
            { display: "none", marginTop: "12px" }
          )
        : document.createElement("p");

    if (!emptyMessage.id) {
      emptyMessage.id = "emptySearchMessage";
      emptyMessage.textContent = "Мұндай кітап табылмады.";
      emptyMessage.style.display = "none";
      emptyMessage.style.marginTop = "12px";
    }

    const tableWrapper = document.querySelector(".table-wrapper");
    if (tableWrapper && !document.getElementById("emptySearchMessage")) {
      tableWrapper.insertAdjacentElement("afterend", emptyMessage);
    }

    const savedQuery = localStorage.getItem(searchKey);
    if (savedQuery) {
      searchInput.value = savedQuery;
    }

    const filterBooks = () => {
      const query = searchInput.value.trim().toLowerCase();
      localStorage.setItem(searchKey, searchInput.value);

      let visibleCount = 0;
      tableRows.forEach((row) => {
        const matches = row.textContent.toLowerCase().includes(query);
        row.style.display = matches ? "" : "none";
        if (matches) visibleCount += 1;
      });

      if (!document.getElementById("clearSearchBtn")) {
        const clearBtn =
          typeof createElementWithProps === "function"
            ? createElementWithProps(
                "button",
                { type: "button", id: "clearSearchBtn", textContent: "Тазарту" },
                { marginTop: "8px", padding: "6px 12px", cursor: "pointer" }
              )
            : document.createElement("button");

        if (!clearBtn.id) {
          clearBtn.type = "button";
          clearBtn.id = "clearSearchBtn";
          clearBtn.textContent = "Тазарту";
          clearBtn.style.marginTop = "8px";
          clearBtn.style.padding = "6px 12px";
          clearBtn.style.cursor = "pointer";
        }

        searchInput.insertAdjacentElement("afterend", clearBtn);

        clearBtn.addEventListener("click", () => {
          searchInput.value = "";
          localStorage.removeItem(searchKey);
          filterBooks();
          searchInput.focus();
        });
      }

      emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
    };

    searchInput.addEventListener("input", filterBooks);
    searchInput.addEventListener("keyup", filterBooks);
    filterBooks();
  }

  // 2. Кесте бағандарын сұрыптау
  const booksTable = document.querySelector(".books-table");
  const tableHeaders = booksTable
    ? Array.from(booksTable.querySelectorAll("thead th"))
    : [];
  const tableBody = booksTable ? booksTable.querySelector("tbody") : null;

  let sortColumnIndex = null;
  let sortDirection = "asc";

  const compareRows = (rowA, rowB, colIndex, direction) => {
    const cellA = rowA.children[colIndex] ? rowA.children[colIndex].textContent.trim() : "";
    const cellB = rowB.children[colIndex] ? rowB.children[colIndex].textContent.trim() : "";

    const numA = Number(cellA.replace(/\s+/g, ""));
    const numB = Number(cellB.replace(/\s+/g, ""));
    const bothNumeric =
      cellA !== "" && cellB !== "" && !Number.isNaN(numA) && !Number.isNaN(numB);

    const comparison = bothNumeric
      ? numA - numB
      : cellA.localeCompare(cellB, "kk", { sensitivity: "base" });

    return direction === "asc" ? comparison : -comparison;
  };

  tableHeaders.forEach((th, index) => {
    th.style.cursor = "pointer";
    th.title = "Сұрыптау үшін басыңыз";
    th.addEventListener("click", () => {
      if (sortColumnIndex === index) {
        sortDirection = sortDirection === "asc" ? "desc" : "asc";
      } else {
        sortColumnIndex = index;
        sortDirection = "asc";
      }

      const sortedRows = [...tableRows].sort((a, b) =>
        compareRows(a, b, index, sortDirection)
      );

      if (tableBody) {
        sortedRows.forEach((row) => tableBody.appendChild(row));
      }
    });
  });

  // 3. Оқу клубы ережесін растау
  const rulesList = document.querySelector(".rules-list");
  if (rulesList && !document.getElementById("clubConfirmBtn")) {
    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.id = "clubConfirmBtn";
    confirmBtn.textContent = "Клуб ережесімен таныстым";
    confirmBtn.style.marginTop = "14px";
    confirmBtn.style.padding = "10px 16px";
    confirmBtn.style.cursor = "pointer";

    const statusMsg = document.createElement("p");
    statusMsg.id = "clubConfirmStatus";
    statusMsg.style.marginTop = "10px";
    statusMsg.style.fontWeight = "600";

    if (localStorage.getItem(rulesKey) === "true") {
      statusMsg.textContent =
        "Клуб ережесі расталды — сенбілік кездесуге дайынсыз!";
    }

    rulesList.insertAdjacentElement("afterend", confirmBtn);
    confirmBtn.insertAdjacentElement("afterend", statusMsg);

    confirmBtn.addEventListener("click", () => {
      localStorage.setItem(rulesKey, "true");
      statusMsg.textContent =
        "Клуб ережесі расталды — сенбілік кездесуге дайынсыз!";
    });
  }

  // 4. Байланыс формасы
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    let statusEl = document.getElementById("contactFormStatus");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.id = "contactFormStatus";
      statusEl.style.marginTop = "12px";
      statusEl.style.padding = "10px 14px";
      statusEl.style.borderRadius = "6px";
      statusEl.style.fontWeight = "600";
      contactForm.insertAdjacentElement("afterend", statusEl);
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const topicSelect = document.getElementById("topic");
      const messageInput = document.getElementById("message");

      const nameValue = nameInput ? nameInput.value.trim() : "";
      const emailValue = emailInput ? emailInput.value.trim() : "";
      const topicValue = topicSelect ? topicSelect.value : "";
      const topicLabel =
        topicSelect && topicSelect.selectedIndex > 0
          ? topicSelect.options[topicSelect.selectedIndex].textContent.trim()
          : "";
      const messageValue = messageInput ? messageInput.value.trim() : "";

      if (!nameValue || !emailValue || !topicValue || !messageValue) {
        if (typeof setStatusMessage === "function") {
          setStatusMessage(
            statusEl,
            "Барлық міндетті өрісті толтырып, тақырыпты таңдаңыз.",
            "error"
          );
        } else {
          statusEl.textContent =
            "Барлық міндетті өрісті толтырып, тақырыпты таңдаңыз.";
        }
        return;
      }

      if (typeof setStatusMessage === "function") {
        setStatusMessage(
          statusEl,
          `${nameValue}, «${topicLabel}» бойынша хабарламаңыз қабылданды (${emailValue}). Жақын арада хабарласамыз!`,
          "success"
        );
      } else {
        statusEl.textContent = `${nameValue}, «${topicLabel}» бойынша хабарламаңыз қабылданды (${emailValue}). Жақын арада хабарласамыз!`;
      }
      contactForm.reset();
    });
  }

  // 5. Себетті бастапқы рендерлеу және оқиғалар
  if (typeof renderCartView === "function" && typeof cartItems !== "undefined") {
    renderCartView(cartItems);
  }

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add-to-cart]");
    if (addBtn) {
      addToCart(addBtn.dataset.addToCart);
      return;
    }

    const incBtn = event.target.closest(".cart-inc");
    if (incBtn) {
      updateCartQty(incBtn.dataset.id, 1);
      return;
    }

    const decBtn = event.target.closest(".cart-dec");
    if (decBtn) {
      updateCartQty(decBtn.dataset.id, -1);
      return;
    }

    const removeBtn = event.target.closest(".cart-remove");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
    }
  });
  const cartDrawer = document.getElementById("cartDrawer");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const cartToggleBtn = document.getElementById("cartToggleBtn");
  const cartCloseBtn = document.getElementById("cartCloseBtn");

  function setCartDrawerOpen(isOpen) {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.classList.toggle("open", isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
    cartBackdrop.hidden = !isOpen;
    if (cartToggleBtn) {
      cartToggleBtn.setAttribute("aria-expanded", String(isOpen));
    }
  }

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener("click", () => {
      const nextState = cartDrawer ? !cartDrawer.classList.contains("open") : true;
      setCartDrawerOpen(nextState);
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", () => setCartDrawerOpen(false));
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", () => setCartDrawerOpen(false));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setCartDrawerOpen(false);
    }
  });
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const THEME_STORAGE_KEY = "booknestTheme";

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
      themeToggleBtn.setAttribute("aria-pressed", String(isDark));
    }
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "light";
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  }
  const CART_STORAGE_KEY = "booknest_cart_v1";

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  function formatKZT(amount) {
    return `${Number(amount || 0).toLocaleString("ru-RU").replace(/,/g, " ")} ₸`;
  }

  function syncCartUI() {
    const items = readCart();
    const totalQty = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const totalPrice = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);

    const badge = document.getElementById("cartBadgeCount");
    if (badge) {
      badge.textContent = String(totalQty);
    }

    const drawerTotal = document.getElementById("cartDrawerTotal");
    if (drawerTotal) {
      drawerTotal.textContent = formatKZT(totalPrice);
    }

    const drawerItems = document.getElementById("cartDrawerItems");
    if (drawerItems) {
      if (items.length === 0) {
        drawerItems.innerHTML = `<p>Себет бос</p>`;
      } else {
        drawerItems.innerHTML = items
          .map(
            (item) => `
          <div class="cart-drawer-item" data-id="${item.id}">
            <div>
              <strong>${item.title}</strong>
              <div>${formatKZT(item.price)} × ${item.qty}</div>
            </div>
            <div>
              <button type="button" class="cart-qty-dec" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button type="button" class="cart-qty-inc" data-id="${item.id}">+</button>
              <button type="button" class="cart-item-remove" data-id="${item.id}">Жою</button>
            </div>
          </div>
        `
          )
          .join("");
      }
    }
  }

  function parsePriceFromText(text) {
    const digits = String(text || "").replace(/[^\d]/g, "");
    return Number(digits || 0);
  }

  document.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add-to-cart]");
    if (addBtn) {
      const id = String(addBtn.dataset.addToCart || addBtn.dataset.id || "").trim();
      const row = addBtn.closest("tr, .book-card, article, .card");
      const cells = row ? [...row.querySelectorAll("td")] : [];

      const title =
        addBtn.dataset.title ||
        row?.querySelector("h2, h3, .book-title")?.textContent?.trim() ||
        cells[0]?.textContent?.trim() ||
        `Кітап #${id}`;

      const priceText =
        addBtn.dataset.price ||
        row?.querySelector(".price-tag, .book-price")?.textContent ||
        cells.find((td) => td.textContent.includes("₸"))?.textContent ||
        "0";

      const price = parsePriceFromText(priceText);
      if (!id) return;

      const items = readCart();
      const existing = items.find((item) => String(item.id) === id);
      if (existing) {
        existing.qty = Number(existing.qty || 0) + 1;
        if (price > 0) existing.price = price;
        if (title) existing.title = title;
      } else {
        items.push({ id, title, price, qty: 1 });
      }

      writeCart(items);
      syncCartUI();
      return;
    }

    const incBtn = event.target.closest(".cart-qty-inc");
    if (incBtn) {
      const id = String(incBtn.dataset.id || "");
      const items = readCart().map((item) =>
        String(item.id) === id ? { ...item, qty: Number(item.qty || 0) + 1 } : item
      );
      writeCart(items);
      syncCartUI();
      return;
    }

    const decBtn = event.target.closest(".cart-qty-dec");
    if (decBtn) {
      const id = String(decBtn.dataset.id || "");
      const items = readCart()
        .map((item) => (String(item.id) === id ? { ...item, qty: Number(item.qty || 0) - 1 } : item))
        .filter((item) => Number(item.qty || 0) > 0);
      writeCart(items);
      syncCartUI();
      return;
    }

    const removeBtn = event.target.closest(".cart-item-remove");
    if (removeBtn) {
      const id = String(removeBtn.dataset.id || "");
      const items = readCart().filter((item) => String(item.id) !== id);
      writeCart(items);
      syncCartUI();
    }
  });

  syncCartUI();
});