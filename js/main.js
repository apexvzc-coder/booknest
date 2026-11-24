// BookNest — 2-кезең: алғашқы JavaScript интерактивтілігі
document.addEventListener("DOMContentLoaded", () => {
  const searchInput =
    document.getElementById("bookSearch") ||
    document.querySelector('input[type="search"]');
  const tableRows = document.querySelectorAll(".books-table tbody tr");

  if (!searchInput || tableRows.length === 0) return;

  const filterBooks = () => {
    const query = searchInput.value.trim().toLowerCase();

    tableRows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });
  };

  searchInput.addEventListener("input", filterBooks);
  searchInput.addEventListener("keyup", filterBooks);
});
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