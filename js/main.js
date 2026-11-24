// BookNest — 2-кезең: алғашқы JavaScript интерактивтілігі
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("bookSearch");
  const tableRows = document.querySelectorAll(".books-table tbody tr");

  if (searchInput && tableRows.length > 0) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      tableRows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(query) ? "" : "none";
      });
    });
  }
});