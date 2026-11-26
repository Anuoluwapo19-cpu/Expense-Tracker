let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const transactionsTableBody = document.getElementById("transactionsTableBody");

const transactionFilterButtons = document.querySelectorAll(".filter-btn");

let activeTransactionFilter = "all";

// ======================================
// HEADER CURRENCY
// ======================================

const currencySelect = document.getElementById("currencySelect");

const selectedCurrency = localStorage.getItem("selectedCurrency") || "NGN";

if (currencySelect) {
  currencySelect.value = selectedCurrency;

  currencySelect.addEventListener("change", () => {
    localStorage.setItem("selectedCurrency", currencySelect.value);
    renderTransactions();
  });
}

// ======================================
// FORMAT CURRENCY
// ======================================

function formatCurrency(amount) {
  const selectedCurrency = localStorage.getItem("selectedCurrency") || "NGN";

  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    GBP: "£",
    EUR: "€",
    GHS: "₵",
    KES: "KSh",
  };

  const symbol = currencySymbols[selectedCurrency] || "₦";

  return `${symbol}${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ======================================
//  TRANSACTIONS
// ======================================

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  if (!transactionsTableBody) return;

  transactionsTableBody.innerHTML = "";

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTransactionFilter === "all") {
      return true;
    }

    return transaction.type === activeTransactionFilter;
  });

  if (filteredTransactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.classList.add("empty-transactions");

    if (activeTransactionFilter === "income") {
      cell.textContent = "No income transactions found.";
    } else if (activeTransactionFilter === "expense") {
      cell.textContent = "No expense transactions found.";
    } else {
      cell.textContent = "No transactions yet. Add your first transaction.";
    }

    row.appendChild(cell);
    transactionsTableBody.appendChild(row);

    return;
  }

  // ===== DISPLAY EACH TRANSACTION =====
  filteredTransactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    const descriptionCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const typeCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const actionsCell = document.createElement("td");

    const formattedDate = transaction.date
      ? transaction.date.split("-").reverse().join("/")
      : "-";

    dateCell.textContent = formattedDate;

    // DISPLAY DESCRIPTION
    descriptionCell.textContent = transaction.description || "-";

    // DISPLAY CATEGORY
    categoryCell.textContent = transaction.category || "-";

    // DISPLAY TYPE
    typeCell.textContent =
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);

    // DISPLAY AMOUNT
    amountCell.textContent = formatCurrency(transaction.amount);

    typeCell.classList.add(
      transaction.type === "income" ? "income-text" : "expense-text",
    );

    // ======================================
    // EDIT BUTTON
    // ======================================

    const editButton = document.createElement("button");

    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.type = "button";

    editButton.addEventListener("click", () => {
      editTransaction(transaction);
    });

    // ======================================
    // DELETE BUTTON
    // ======================================

    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      deleteTransaction(transaction);
    });

    // ADD BUTTONS TO ACTIONS CELL
    actionsCell.classList.add("actions-cell");
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // ADD CELLS TO ROW
    row.appendChild(dateCell);
    row.appendChild(descriptionCell);
    row.appendChild(categoryCell);
    row.appendChild(typeCell);
    row.appendChild(amountCell);
    row.appendChild(actionsCell);

    transactionsTableBody.appendChild(row);
  });
}

// ======================================
// EDIT TRANSACTION
// ======================================

function editTransaction(transaction) {
  const newDescription = prompt(
    "Edit transaction description:",
    transaction.description,
  );

  if (newDescription === null) return;

  const newCategory = prompt(
    "Edit transaction category:",
    transaction.category,
  );

  if (newCategory === null) return;

  const newAmount = prompt("Edit transaction amount:", transaction.amount);

  if (newAmount === null) return;

  const newDate = prompt(
    "Edit transaction date (YYYY-MM-DD):",
    transaction.date,
  );

  if (newDate === null) return;

  const amount = Number(newAmount);

  if (newAmount.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  // UPDATE TRANSACTION
  transaction.description = newDescription.trim();
  transaction.category = newCategory.trim();
  transaction.amount = amount;
  transaction.date = newDate;

  saveTransactions();

  renderTransactions();

  alert("Transaction updated successfully!");
}

// ======================================
// DELETE TRANSACTION
// ======================================

function deleteTransaction(transaction) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this transaction?",
  );

  if (!confirmDelete) return;

  transactions = transactions.filter((item) => item !== transaction);

  saveTransactions();
  renderTransactions();
}

// ======================================
// FILTER BUTTON FUNCTIONALITY
// ======================================

transactionFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeTransactionFilter = button.dataset.filter;

    transactionFilterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTransactions();
  });
});

renderTransactions();
