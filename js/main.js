// BookNest — 2-кезең: алғашқы JavaScript интерактивтілігі
document.addEventListener("DOMContentLoaded", () => {
  const searchInput =
  document.getElementById("bookSearch") ||
  document.querySelector('input[type="search"]');
const tableRows = Array.from(
  document.querySelectorAll(".books-table tbody tr")
);

if (searchInput && tableRows.length > 0) {
  const emptyMessage = document.createElement("p");
  emptyMessage.id = "emptySearchMessage";
  emptyMessage.textContent = "Мұндай кітап табылмады.";
  emptyMessage.style.display = "none";
  emptyMessage.style.marginTop = "12px";

  const tableWrapper = document.querySelector(".table-wrapper");
  if (tableWrapper && !document.getElementById("emptySearchMessage")) {
    tableWrapper.insertAdjacentElement("afterend", emptyMessage);
  }

  const savedQuery = localStorage.getItem("booknestSearchQuery");
  if (savedQuery) {
    searchInput.value = savedQuery;
  }

  const filterBooks = () => {
    const query = searchInput.value.trim().toLowerCase();
    localStorage.setItem("booknestSearchQuery", searchInput.value);

    let visibleCount = 0;
    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      const matches = text.includes(query);
      row.style.display = matches ? "" : "none";
      if (matches) visibleCount += 1;
    });
    if (searchInput && !document.getElementById("clearSearchBtn")) {
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.id = "clearSearchBtn";
    clearBtn.textContent = "Тазарту";
    clearBtn.style.marginTop = "8px";
    clearBtn.style.padding = "6px 12px";
    clearBtn.style.cursor = "pointer";

    searchInput.insertAdjacentElement("afterend", clearBtn);

    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      localStorage.removeItem("booknestSearchQuery");
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
const contactForm = document.querySelector("form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameField = contactForm.querySelector('input[type="text"], input[name="name"], #name');
    const topicField = contactForm.querySelector("select");

    const nameValue = nameField && nameField.value.trim() ? nameField.value.trim() : "Оқырман";
    const topicValue =
      topicField && topicField.selectedIndex > 0
        ? ` («${topicField.options[topicField.selectedIndex].text.trim()}»)`
        : "";

    let statusEl = document.getElementById("formStatus");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.id = "formStatus";
      statusEl.style.marginTop = "14px";
      statusEl.style.padding = "10px 12px";
      statusEl.style.borderRadius = "6px";
      statusEl.style.backgroundColor = "#eef4f0";
      statusEl.style.fontWeight = "600";
      contactForm.insertAdjacentElement("afterend", statusEl);
    }

    statusEl.textContent = `${nameValue}, хабарламаңыз${topicValue} сәтті қабылданды! Жақын арада жауап береміз.`;
    contactForm.reset();
  });
}
const emptyMessage = document.createElement("p");
emptyMessage.id = "emptySearchMessage";
emptyMessage.textContent = "Мұндай кітап табылмады.";
emptyMessage.style.display = "none";
emptyMessage.style.marginTop = "12px";

const tableWrapper = document.querySelector(".table-wrapper");
if (tableWrapper) {
  tableWrapper.insertAdjacentElement("afterend", emptyMessage);
}

const savedQuery = localStorage.getItem("booknestSearchQuery");
if (savedQuery && searchInput) {
  searchInput.value = savedQuery;
}

const updateRowsVisibility = () => {
  if (!searchInput || tableRows.length === 0) return;
  const query = searchInput.value.trim().toLowerCase();
  localStorage.setItem("booknestSearchQuery", searchInput.value);

  let visibleCount = 0;
  tableRows.forEach((row) => {
    const matches = row.textContent.toLowerCase().includes(query);
    row.style.display = matches ? "" : "none";
    if (matches) visibleCount += 1;
  });

  emptyMessage.style.display = visibleCount === 0 ? "block" : "none";
  emptyMessage.style.padding = "10px 12px";
  emptyMessage.style.borderRadius = "6px";
  emptyMessage.style.backgroundColor = "#f4f6f5";
};

updateRowsVisibility();
});