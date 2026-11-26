// ======================================
// HEADER
// ======================================

const currencySelect = document.getElementById("currencySelect");

let selectedCurrency = localStorage.getItem("selectedCurrency") || "NGN";

if (currencySelect) {
  currencySelect.value = selectedCurrency;

  currencySelect.addEventListener("change", () => {
    selectedCurrency = currencySelect.value;

    localStorage.setItem("selectedCurrency", selectedCurrency);

    updateSummary();
  });
}

// ======================================
// CURRENCY FORMATTER
// ======================================

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  GHS: "₵",
  KES: "KSh",
};

function formatCurrency(amount) {
  const symbol = currencySymbols[selectedCurrency] || "₦";

  return `${symbol}${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ======================================
// MONTH SELECTOR
// ======================================

const monthSelect = document.getElementById("monthSelect");

function getSelectedMonth() {
  return monthSelect.value;
}

if (monthSelect) {
  monthSelect.addEventListener("change", () => {
    updateSummary();
  });
}

// ======================================
// MONTHLY INCOME
// ======================================

const setIncomeBtn = document.getElementById("setIncomeBtn");
const monthlyIncomeDisplay = document.getElementById("monthlyIncome");

let monthlyIncomes = JSON.parse(localStorage.getItem("monthlyIncomes")) || {};

if (setIncomeBtn) {
  setIncomeBtn.addEventListener("click", () => {
    const selectedMonth = getSelectedMonth();

    const currentIncome = monthlyIncomes[selectedMonth] || 0;

    const incomeInput = prompt("Enter your monthly income:", currentIncome);

    if (incomeInput === null) {
      return;
    }

    const income = Number(incomeInput);

    if (incomeInput.trim() === "" || !Number.isFinite(income) || income < 0) {
      alert("Please enter a valid income.");
      return;
    }

    monthlyIncomes[selectedMonth] = income;

    localStorage.setItem("monthlyIncomes", JSON.stringify(monthlyIncomes));

    updateSummary();
  });
}

// ======================================
// TRANSACTIONS
// ======================================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ======================================
// UPDATE FINANCIAL SUMMARY
// ======================================

const totalExpensesDisplay = document.getElementById("totalExpenses");
const remainingBalanceDisplay = document.getElementById("remainingBalance");

function updateSummary() {
  const selectedMonth = getSelectedMonth();

  const income = Number(monthlyIncomes[selectedMonth] || 0);

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date && transaction.date.startsWith(selectedMonth);
  });

  // Calculate expenses
  const expenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  // Calculate balance
  const balance = income - expenses;

  // Display income
  if (monthlyIncomeDisplay) {
    monthlyIncomeDisplay.textContent = formatCurrency(income);
  }

  // Display expenses
  if (totalExpensesDisplay) {
    totalExpensesDisplay.textContent = formatCurrency(expenses);
  }

  // Display balance
  if (remainingBalanceDisplay) {
    remainingBalanceDisplay.textContent = formatCurrency(balance);
  }
}

// ======================================
// ADD TRANSACTION SECTION
// ======================================

const openTransactionModal = document.getElementById("openTransactionModal");
const transactionModal = document.getElementById("transactionModal");
const closeTransactionModal = document.getElementById("closeTransactionModal");
const cancelTransaction = document.getElementById("cancelTransaction");

// OPEN TRANSACTION SECTION
if (openTransactionModal && transactionModal) {
  openTransactionModal.addEventListener("click", () => {
    transactionModal.classList.add("show");
  });
}

// CLOSE TRANSACTION SECTION
function closeTransactionSection() {
  transactionModal.classList.remove("show");
}

if (closeTransactionModal) {
  closeTransactionModal.addEventListener("click", closeTransactionSection);
}

if (cancelTransaction) {
  cancelTransaction.addEventListener("click", closeTransactionSection);
}

// ADD TRANSACTION
const transactionForm = document.getElementById("transactionForm");

if (transactionForm) {
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const type = document.getElementById("transactionType").value;
    const category = document.getElementById("transactionCategory").value;
    const description = document.getElementById("transactionDescription").value;
    const amount = Number(document.getElementById("transactionAmount").value);
    const date = document.getElementById("transactionDate").value;

    const newTransaction = {
      id: Date.now(),
      type,
      category,
      description,
      amount,
      date,
    };

    transactions.push(newTransaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateSummary();

    transactionForm.reset();

    closeTransactionSection();
  });
}

updateSummary();
