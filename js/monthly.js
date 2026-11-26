const monthSelect = document.getElementById("monthSelect");

const monthlyIncomeDisplay = document.getElementById("monthlyIncome");
const monthlyExpensesDisplay = document.getElementById("monthlyExpenses");
const monthlyBalanceDisplay = document.getElementById("monthlyBalance");

const categoryBreakdown = document.getElementById("categoryBreakdown");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let monthlyIncomes = JSON.parse(localStorage.getItem("monthlyIncomes")) || {};

// ===== CURRENCY FORMATTER =====

const currencySelect = document.getElementById("currencySelect");

const selectedCurrency = localStorage.getItem("selectedCurrency") || "NGN";

if (currencySelect) {
  currencySelect.value = selectedCurrency;

  currencySelect.addEventListener("change", () => {
    localStorage.setItem("selectedCurrency", currencySelect.value);

    updateMonthlySummary();
  });
}

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

const currentDate = new Date();

const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

const currentYear = currentDate.getFullYear();

if (monthSelect) {
  monthSelect.value = currentMonth;
}

function getSelectedMonth() {
  return `${currentYear}-${monthSelect.value}`;
}

// ===== GET MONTHLY TRANSACTIONS =====
function getMonthlyTransactions() {
  const selectedMonth = getSelectedMonth();

  return transactions.filter((transaction) => {
    return transaction.date && transaction.date.startsWith(selectedMonth);
  });
}

// ===== UPDATE MONTHLY SUMMARY =====
function updateMonthlySummary() {
  const selectedMonth = getSelectedMonth();

  const monthlyTransactions = getMonthlyTransactions();

  // GET MONTHLY INCOME FROM BOTH SOURCES
  
const setMonthlyIncome = Number(monthlyIncomes[selectedMonth] || 0);

const transactionIncome = monthlyTransactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);

const income = setMonthlyIncome + transactionIncome;

  // CALCULATE EXPENSES
  const expenses = monthlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  // CALCULATE BALANCE
  const balance = income - expenses;

  // DISPLAY VALUES
  monthlyIncomeDisplay.textContent = formatCurrency(income);

  monthlyExpensesDisplay.textContent = formatCurrency(expenses);

  monthlyBalanceDisplay.textContent = formatCurrency(balance);

  // UPDATE CATEGORY BREAKDOWN
  updateCategoryBreakdown(monthlyTransactions);
}

// ===== CATEGORY BREAKDOWN =====
function updateCategoryBreakdown(monthlyTransactions) {
  categoryBreakdown.innerHTML = "";

  // GET ONLY EXPENSES
  const expenses = monthlyTransactions.filter((transaction) => {
    return transaction.type === "expense";
  });

  if (expenses.length === 0) {
    categoryBreakdown.innerHTML = `
      <p class="empty-category">
        No expenses recorded for this month.
      </p>
    `;
    return;
  }

  // GROUP EXPENSES BY CATEGORY
  const categories = {};

  expenses.forEach((transaction) => {
    const category = transaction.category || "Uncategorized";

    categories[category] =
      (categories[category] || 0) + Number(transaction.amount);
  });

  // GET TOTAL EXPENSES
  const totalExpenses = expenses.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);

  // DISPLAY EACH CATEGORY
  Object.entries(categories).forEach(([category, amount]) => {
    const percentage = (amount / totalExpenses) * 100;

    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");

    categoryItem.innerHTML = `
      <div class="category-info">
        <span class="category-name">${category}</span>
        <span class="category-amount">${formatCurrency(amount)}</span>
      </div>

      <div class="category-progress">
        <div 
          class="category-progress-fill"
          style="width: ${percentage}%"
        ></div>
      </div>
    `;

    categoryBreakdown.appendChild(categoryItem);
  });
}

monthSelect.addEventListener("change", () => {
  updateMonthlySummary();
});

updateMonthlySummary();
