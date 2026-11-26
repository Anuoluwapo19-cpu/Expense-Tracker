const yearSelect = document.getElementById("yearSelect");

const yearlyIncomeDisplay = document.getElementById("yearlyIncome");
const yearlyExpensesDisplay = document.getElementById("yearlyExpenses");
const yearlyBalanceDisplay = document.getElementById("yearlyBalance");

const monthlyBreakdown = document.getElementById("monthlyBreakdown");

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

// ===== POPULATE YEAR SELECTOR =====
function populateYears() {
  const currentYear = new Date().getFullYear();

  for (let year = currentYear; year >= currentYear - 5; year--) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = year;

    yearSelect.appendChild(option);
  }

  yearSelect.value = currentYear;
}

function getSelectedYear() {
  return Number(yearSelect.value);
}

function getYearlyTransactions() {
  const selectedYear = String(getSelectedYear());

  return transactions.filter((transaction) => {
    return transaction.date && transaction.date.startsWith(selectedYear);
  });
}

function updateYearlySummary() {
  const selectedYear = getSelectedYear();

  const yearlyTransactions = getYearlyTransactions();

  // CALCULATE YEARLY INCOME
  let income = 0;

  for (let month = 1; month <= 12; month++) {
    const monthKey = `${selectedYear}-${String(month).padStart(2, "0")}`;

    income += Number(monthlyIncomes[monthKey] || 0);
  }

  // CALCULATE YEARLY EXPENSES
  const expenses = yearlyTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => {
      return total + Number(transaction.amount);
    }, 0);

  // CALCULATE BALANCE
  const balance = income - expenses;

  // DISPLAY VALUES
  yearlyIncomeDisplay.textContent = formatCurrency(income);

  yearlyExpensesDisplay.textContent = formatCurrency(expenses);

  yearlyBalanceDisplay.textContent = formatCurrency(balance);

  // UPDATE MONTHLY BREAKDOWN
  renderMonthlyBreakdown(selectedYear, yearlyTransactions);
}

// ===== MONTHLY BREAKDOWN =====
function renderMonthlyBreakdown(year, yearlyTransactions) {
  monthlyBreakdown.innerHTML = "";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // LOOP THROUGH ALL 12 MONTHS
  monthNames.forEach((monthName, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");

    const monthKey = `${year}-${monthNumber}`;

    // GET MONTHLY INCOME
    const income = Number(monthlyIncomes[monthKey] || 0);

    // GET MONTHLY TRANSACTIONS
    const monthTransactions = yearlyTransactions.filter((transaction) => {
      return transaction.date && transaction.date.startsWith(monthKey);
    });

    // CALCULATE MONTHLY EXPENSES
    const expenses = monthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => {
        return total + Number(transaction.amount);
      }, 0);

    // CALCULATE MONTHLY BALANCE
    const balance = income - expenses;

    // CREATE MONTH ROW
    const monthRow = document.createElement("div");
    monthRow.classList.add("month-row");

    monthRow.innerHTML = `
      <div class="month-row-header">
        <span class="month-name">${monthName}</span>

        <span class="month-balance ${balance >= 0 ? "positive" : "negative"}">
          Balance: ${formatCurrency(balance)}
        </span>
      </div>

      <div class="month-details">
        <div class="month-detail">
          <span class="month-detail-label">Income</span>
          <span class="month-income-amount">
            ${formatCurrency(income)}
          </span>
        </div>

        <div class="month-detail">
          <span class="month-detail-label">Expenses</span>
          <span class="month-expense-amount">
            ${formatCurrency(expenses)}
          </span>
        </div>
      </div>
    `;

    monthlyBreakdown.appendChild(monthRow);
  });
}

// ===== YEAR SELECTOR =====
yearSelect.addEventListener("change", () => {
  updateYearlySummary();
});

// ===== INITIALIZE PAGE =====
populateYears();

updateYearlySummary();
