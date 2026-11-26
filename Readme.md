# Expense Tracker

A simple and responsive Expense Tracker built with HTML, CSS, and JavaScript. It helps users manage their finances by recording income and expenses, monitoring transactions, and viewing monthly and yearly financial summaries.

## Overview

The Expense Tracker provides a simple way to keep track of personal finances. Users can record transactions, organize expenses by category, set monthly income, and monitor their financial balance through monthly and yearly reports.

The application uses LocalStorage to save financial data in the browser, allowing information to remain available even after refreshing the page or closing the browser.

## Features

- **Dashboard:** View monthly income, total expenses, and remaining balance.
- **Add Transactions:** Record income and expenses with descriptions, categories, amounts, and dates.
- **Transaction History:** View recorded transactions in an organized table.
- **Transaction Filtering:** Filter transactions to view all transactions, income only, or expenses only.
- **Monthly Overview:** View monthly income, expenses, balance, and expense breakdown by category.
- **Yearly Overview:** View yearly financial summaries and monthly breakdowns.
- **Monthly Income Management:** Set and save income for individual months.
- **Currency Selection:** Display financial amounts in NGN, USD, GBP, EUR, GHS, and KES.
- **Data Persistence:** Save transactions and monthly income using LocalStorage.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser LocalStorage

## Project Structure

```text
Expense-Tracker/
│
├── index.html
├── transactions.html
├── monthly.html
├── yearly.html
│
├── css/
│   ├── style.css
│   ├── monthly.css
│   └── yearly.css
│
└── js/
    ├── home.js
    ├── transactions.js
    ├── monthly.js
    └── yearly.js
```

## How to Use

1. Open the Expense Tracker in your browser.
2. Select your preferred currency.
3. Set your monthly income.
4. Add transactions by selecting the transaction type, category, description, amount, and date.
5. Visit the Transactions page to view and filter your transaction history.
6. Use the Monthly Overview to review your income, expenses, balance, and spending categories.
7. Use the Yearly Overview to track your finances across the year.

## Data Storage

The application uses LocalStorage to store user data directly in the browser.

The following data is saved:

- Transactions
- Monthly income
- Selected currency

Data is stored locally in the browser and is not connected to a backend server or cloud database.

## Future Improvements

- Add transaction editing and deletion.
- Add interactive charts and visual analytics.
- Improve financial insights and spending analysis.
- Add user authentication.
- Connect to a database for online data storage.

## Author

Built as a personal project to practice frontend development, JavaScript logic, DOM manipulation, and browser data storage.

---

*Built with HTML, CSS, and JavaScript.*
