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