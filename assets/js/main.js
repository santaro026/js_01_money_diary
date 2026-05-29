/* to do
total in a week
budget
balance
graph
*/

import { initCalculator } from "./calculator.js";

// Exported variables
export const modal = document.querySelector(".calc-modal");
export let activeAmountInput = null;

// DOM Element Selections
const monthlyTotalDisplay = document.getElementById("amount-month");
const monthlyHistoryTableBody = document.getElementById("history-list");
const transactionDateInput = document.getElementById("date");
const transactionTimeInput = document.getElementById("time");
const saveRecordsButton = document.getElementById("button-add");
const addEntryRowButton = document.getElementById("add-entry-row");
const entryContainer = document.getElementById("entry-container");

// Date & Time Variables
const now = new Date();
const offset = now.getTimezoneOffset() * 60000;
const localISODateTime = new Date(now - offset).toISOString().slice(0, 16);
const currentYM = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

// State Variables
let financeRecords = JSON.parse(localStorage.getItem("myFinanceData")) ?? [];

// Initialize Calculator
initCalculator(".calc-modal");

// Set default date/time
if (transactionDateInput) transactionDateInput.value = localISODateTime.slice(0, 10);
if (transactionTimeInput) transactionTimeInput.value = localISODateTime.slice(11, 16);

// Load and Render Records
renderMonthlyRecords();

// Event Listeners
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("button-modal")) {
        const row = e.target.closest(".entry-item");
        activeAmountInput = row.querySelector(".amount");
        modal.querySelectorAll("input").forEach(input => input.value = "");
        modal.style.display = "flex";
    }
});

document.addEventListener("click", (e) => {
    if (e.target == modal) {
        modal.style.display = "none";
    }
});

if (saveRecordsButton) {
    saveRecordsButton.addEventListener("click", addExpenses);
}

if (addEntryRowButton) {
    addEntryRowButton.addEventListener("click", () => {
        const container = document.getElementById("entry-container");
        const originalRow = container.querySelector(".entry-row");
        const newRow = originalRow.cloneNode(true);
        newRow.querySelectorAll("input").forEach(input => input.value = "");
        const totalContainer = document.getElementById("entry-total-container");
        container.insertBefore(newRow, totalContainer);
    });
}

if (monthlyHistoryTableBody) {
    monthlyHistoryTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("button-delete")) {
            const row = e.target.closest("tr");
            if (confirm("Delete this record?")) {
                deleteRecord(row);
            }
        }
    });
}

if (entryContainer) {
    entryContainer.addEventListener("input", (e) => {
        if (e.target.classList.contains("amount")) {
            updateEntryTotal();
        }
    });
    entryContainer.addEventListener("change", (e) => {
        if (e.target.classList.contains("amount")) {
            updateEntryTotal();
        }
    });
}

// Functions
function renderMonthlyRecords() {
    if (!monthlyHistoryTableBody) return;
    const monthlyRecords = financeRecords.filter(recordItem => recordItem.datetime.startsWith(currentYM)).sort((a, b) => b.datetime.localeCompare(a.datetime));
    monthlyHistoryTableBody.innerHTML = monthlyRecords.map((recordItem) => `
        <tr>
            <td data-raw="${recordItem.datetime}">${formatDateTime(recordItem.datetime)}</td>
            <td>${recordItem.category}</td>
            <td>${Number(recordItem.amount).toLocaleString()}</td>
            <td>${recordItem.note}</td>
            <td><button class="button-delete">Delete</button></td>
        </tr>
        `
    ).join('');
    updateAmountMonth();
}

function addExpenses() {
    const items = document.querySelectorAll(".entry-item");
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    let added = false;
    items.forEach(item => {
        const amountInput = item.querySelector(".amount");
        const amount = amountInput.value;
        if (amount > 0) {
            const newRecord = {
                datetime: `${date}-${time}`,
                category: item.querySelector(".category").value,
                amount: amount,
                note: item.querySelector(".note").value
            };
            financeRecords.push(newRecord);
            added = true;
            amountInput.value = "";
            item.querySelector(".note").value = "";
        }
    });
    
    if (added) {
        localStorage.setItem("myFinanceData", JSON.stringify(financeRecords));
        renderMonthlyRecords();
        // Reset rows
        const container = document.getElementById("entry-container");
        const rows = container.querySelectorAll(".entry-row");
        if (rows.length > 1) {
            for (let i = 1; i < rows.length; i++) {
                rows[i].remove();
            }
        }
        updateEntryTotal();
    }
}

function updateAmountMonth() {
    if (!monthlyTotalDisplay) return;
    const monthlyRecords = financeRecords.filter(recordItem => recordItem.datetime.startsWith(currentYM));
    let total = monthlyRecords.reduce((sum, recordItem) => {
        const currentAmount = Number(recordItem.amount) || 0;
        return sum + currentAmount;
    }, 0);
    monthlyTotalDisplay.textContent = total.toLocaleString();
    const currentMonthHeader = document.getElementById("current-month-header");
    if (currentMonthHeader) {
        currentMonthHeader.textContent = `Current Month History (Total: ${total.toLocaleString()})`;
    }
}

function deleteRecord(rowElement) {
    const targetRecordData = {
        datetime: rowElement.cells[0].getAttribute('data-raw'),
        category: rowElement.cells[1].textContent,
        amount: rowElement.cells[2].textContent.replace(/,/g, ''),
        note: rowElement.cells[3].textContent
    };
    
    const matchedRecordIndex = financeRecords.findIndex(recordItem => 
        recordItem.datetime === targetRecordData.datetime && 
        recordItem.category === targetRecordData.category && 
        recordItem.amount == targetRecordData.amount && 
        recordItem.note === targetRecordData.note
    );

    if (matchedRecordIndex !== -1) {
        financeRecords.splice(matchedRecordIndex, 1);
        localStorage.setItem("myFinanceData", JSON.stringify(financeRecords));
        renderMonthlyRecords();
    }
}

window.exportCSV = function() {
    if (financeRecords.length === 0) {
        alert("No records to export.");
        return;
    }
    
    const csvRows = [
        ["Date", "Category", "Amount", "Note"].join(",")
    ];
    
    financeRecords.forEach(recordItem => {
        csvRows.push([
            recordItem.datetime,
            recordItem.category,
            recordItem.amount,
            `"${recordItem.note.replace(/"/g, '""')}"`
        ].join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `money_diary_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "";
    return dateTimeStr.replace("-", "/").replace("-", "/").replace("-", " ");
}

function updateEntryTotal() {
    const amountInputs = document.querySelectorAll("#entry-container .amount");
    let total = 0;
    amountInputs.forEach(input => {
        total += Number(input.value) || 0;
    });
    const entryTotalAmount = document.getElementById("entry-total-amount");
    if (entryTotalAmount) {
        entryTotalAmount.textContent = total.toLocaleString();
    }
}
