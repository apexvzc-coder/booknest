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
// 3-кезең: Кітаптар кестесін бағандар бойынша сұрыптау
  const booksTable = document.querySelector(".books-table");
  const tableHeaders = booksTable ? Array.from(booksTable.querySelectorAll("thead th")) : [];
  const tableBody = booksTable ? booksTable.querySelector("tbody") : null;

  let sortColumnIndex = null;
  let sortDirection = "asc";

  const compareRows = (rowA, rowB, colIndex, direction) => {
    const cellA = rowA.children[colIndex] ? rowA.children[colIndex].textContent.trim() : "";
    const cellB = rowB.children[colIndex] ? rowB.children[colIndex].textContent.trim() : "";

    const numA = Number(cellA.replace(/\s+/g, ""));
    const numB = Number(cellB.replace(/\s+/g, ""));
    const bothNumeric = cellA !== "" && cellB !== "" && !Number.isNaN(numA) && !Number.isNaN(numB);

    let comparison = 0;
    if (bothNumeric) {
      comparison = numA - numB;
    } else {
      comparison = cellA.localeCompare(cellB, "kk", { sensitivity: "base" });
    }

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
// 3-кезең: Оқу клубы бетінде қатысуға дайындықты белгілеу
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

    const isConfirmed = localStorage.getItem("booknestClubRulesAccepted") === "true";
    if (isConfirmed) {
      statusMsg.textContent = "Клуб ережесі расталды — сенбілік кездесуге дайынсыз!";
    }

    rulesList.insertAdjacentElement("afterend", confirmBtn);
    confirmBtn.insertAdjacentElement("afterend", statusMsg);

    confirmBtn.addEventListener("click", () => {
      localStorage.setItem("booknestClubRulesAccepted", "true");
      statusMsg.textContent = "Клуб ережесі расталды — сенбілік кездесуге дайынсыз!";
    });
  }
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
        statusEl.textContent = "Барлық міндетті өрісті толтырып, тақырыпты таңдаңыз.";
        statusEl.style.backgroundColor = "#fdecea";
        statusEl.style.color = "#8a1c1c";
        return;
      }

      statusEl.textContent = `${nameValue}, «${topicLabel}» бойынша хабарламаңыз қабылданды (${emailValue}). Жақын арада хабарласамыз!`;
      statusEl.style.backgroundColor = "#eef4f0";
      statusEl.style.color = "#1f4d36";
      contactForm.reset();
    });
  }
}); 