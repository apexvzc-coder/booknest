// js/data.js — Деректер мен localStorage кілттері
const STORAGE_KEYS = {
  searchQuery: "booknestSearchQuery",
  clubRulesAccepted: "booknestClubRulesAccepted"
};

const booksData = [
  { id: 1, title: "Абай жолы (1-том)", author: "Мұхтар Әуезов", year: 1942, price: 4500 },
  { id: 2, title: "Атомдық әдеттер", author: "Джеймс Клир", year: 2018, price: 5200 },
  { id: 3, title: "Көшпенділер", author: "Ілияс Есенберлин", year: 1976, price: 6000 },
  { id: 4, title: "Махаббат, қызық мол жылдар", author: "Әзілхан Нұршайықов", year: 1970, price: 3800 },
  { id: 5, title: "1984", author: "Джордж Оруэлл", year: 1949, price: 4100 },
  { id: 6, title: "Ұшқан ұя", author: "Бауыржан Момышұлы", year: 1974, price: 3500 },
  { id: 7, title: "Sapiens: Адамзаттың қысқаша тарихы", author: "Юваль Ной Харари", year: 2011, price: 6500 },
  { id: 8, title: "Қан мен тер", author: "Әбдіжәміл Нұрпейісов", year: 1961, price: 4900 }
];
// js/data.js — Себет күйі
const CART_STORAGE_KEY = "booknest_cart_v1";

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    // localStorage қолжетімсіз болса да қате шығармайды
  }
}

let cartItems = loadCartFromStorage();