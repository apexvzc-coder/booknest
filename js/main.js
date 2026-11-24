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
    let statusEl = document.getElementById("formStatus");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.id = "formStatus";
      statusEl.style.marginTop = "12px";
      contactForm.insertAdjacentElement("afterend", statusEl);
    }
    statusEl.textContent = "Хабарламаңыз сәтті қабылданды! Жақын арада жауап береміз.";
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
};

updateRowsVisibility();
});