const fullHistoryTableBody = document.getElementById("full-history-list");
let financeRecords = JSON.parse(localStorage.getItem("myFinanceData")) ?? [];

const categoryColors = {
    food: "#4a90e2",          // Soft Blue
    entertainment: "#9b59b6", // Purple
    leisure: "#e67e22",       // Orange
    transportation: "#f1c40f",// Yellow
    furniture: "#1abc9c",     // Turquoise
    utility: "#2ecc71",       // Green
    others: "#95a5a6"         // Gray
};

function getCategoryColor(category) {
    const defaultColors = ["#34495e", "#e74c3c", "#16a085", "#27ae60", "#2980b9", "#8e44ad"];
    const normalized = category.trim().toLowerCase();
    if (categoryColors[normalized]) {
        return categoryColors[normalized];
    }
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % defaultColors.length;
    return defaultColors[index];
}

function generateDonutChartHtml(categories, total) {
    if (!total || total <= 0) return "";
    
    let gradientParts = [];
    let currentPercent = 0;
    
    const sortedCategories = Object.keys(categories).sort((a, b) => categories[b] - categories[a]);
    
    sortedCategories.forEach(cat => {
        const amount = categories[cat];
        const percent = (amount / total) * 100;
        const color = getCategoryColor(cat);
        gradientParts.push(`${color} ${currentPercent}% ${currentPercent + percent}%`);
        currentPercent += percent;
    });
    
    const gradientString = gradientParts.join(", ");
    
    return `
        <div class="chart-container">
            <div class="donut-chart" style="background: conic-gradient(${gradientString})">
                <div class="donut-center"></div>
            </div>
        </div>
    `;
}

renderAllReports();
setupTabNavigation();

function renderAllReports() {
    renderAllRecords();
    renderWeeklyReport();
    renderMonthlyReport();
    renderYearlyReport();
}

function renderAllRecords() {
    if (!fullHistoryTableBody) return;
    financeRecords.sort((a, b) => b.datetime.localeCompare(a.datetime));

    const monthlyGroupedRecords = financeRecords.reduce((acc, recordItem) => {
        const month = recordItem.datetime.slice(0, 7);
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(recordItem);
        return acc;
    }, {});

    let tableContentHtml = "";
    Object.keys(monthlyGroupedRecords).sort((a, b) => b.localeCompare(a)).forEach(month => {
        const monthlyTotal = monthlyGroupedRecords[month].reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
        tableContentHtml += `
            <tr class="month-header">
                <td colspan="5">${month.replace("-", "/")} (Total: ${monthlyTotal.toLocaleString()})</td>
            </tr>
        `;
        monthlyGroupedRecords[month].forEach(recordItem => {
            tableContentHtml += `
                <tr>
                    <td data-raw="${recordItem.datetime}">${recordItem.datetime.slice(5).replace(/(.*?)-(.*?)-/, "$1/$2 ")}</td>
                    <td>${recordItem.category}</td>
                    <td>${Number(recordItem.amount).toLocaleString()}</td>
                    <td>${recordItem.note}</td>
                    <td><button class="button-delete">Delete</button></td>
                </tr>
            `;
        });
    });
    fullHistoryTableBody.innerHTML = tableContentHtml;
}

function getWeekRange(dateStr) {
    const datePart = dateStr.slice(0, 10);
    const date = new Date(datePart);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Set start of week to Monday
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const format = (d) => `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    return `${format(startOfWeek)} - ${format(endOfWeek)}`;
}

function renderWeeklyReport() {
    const weeklyContainer = document.getElementById("weekly-report-list");
    if (!weeklyContainer) return;
    
    const weeklyGroups = financeRecords.reduce((acc, recordItem) => {
        const range = getWeekRange(recordItem.datetime);
        if (!acc[range]) {
            acc[range] = { total: 0, categories: {} };
        }
        const amount = Number(recordItem.amount) || 0;
        acc[range].total += amount;
        if (!acc[range].categories[recordItem.category]) {
            acc[range].categories[recordItem.category] = 0;
        }
        acc[range].categories[recordItem.category] += amount;
        return acc;
    }, {});
    
    let cardsHtml = "";
    Object.keys(weeklyGroups).sort((a, b) => b.localeCompare(a)).forEach(range => {
        const info = weeklyGroups[range];
        const totalAmount = info.total;
        
        let breakdownHtml = "";
        Object.keys(info.categories).sort((a, b) => info.categories[b] - info.categories[a]).forEach(cat => {
            const color = getCategoryColor(cat);
            breakdownHtml += `
                <div class="breakdown-item">
                    <span class="breakdown-label">
                        <span class="category-legend-color" style="background-color: ${color};"></span>
                        ${cat}
                    </span>
                    <span class="breakdown-val">${Number(info.categories[cat]).toLocaleString()}</span>
                </div>
            `;
        });
        
        const chartHtml = generateDonutChartHtml(info.categories, totalAmount);
        
        cardsHtml += `
            <div class="report-card">
                <h3>${range}</h3>
                <div class="report-total">${Number(totalAmount).toLocaleString()}</div>
                ${chartHtml}
                <div class="report-breakdown">
                    <div class="breakdown-title">By Category</div>
                    ${breakdownHtml}
                </div>
            </div>
        `;
    });
    weeklyContainer.innerHTML = cardsHtml || `<p style="grid-column: 1/-1; text-align: center; color: #777;">No records found.</p>`;
}

function renderMonthlyReport() {
    const monthlyContainer = document.getElementById("monthly-report-list");
    if (!monthlyContainer) return;
    
    const monthlyGroups = financeRecords.reduce((acc, recordItem) => {
        const month = recordItem.datetime.slice(0, 7).replace("-", "/");
        if (!acc[month]) {
            acc[month] = { total: 0, categories: {} };
        }
        const amount = Number(recordItem.amount) || 0;
        acc[month].total += amount;
        if (!acc[month].categories[recordItem.category]) {
            acc[month].categories[recordItem.category] = 0;
        }
        acc[month].categories[recordItem.category] += amount;
        return acc;
    }, {});
    
    let cardsHtml = "";
    Object.keys(monthlyGroups).sort((a, b) => b.localeCompare(a)).forEach(month => {
        const info = monthlyGroups[month];
        const totalAmount = info.total;
        
        let breakdownHtml = "";
        Object.keys(info.categories).sort((a, b) => info.categories[b] - info.categories[a]).forEach(cat => {
            const color = getCategoryColor(cat);
            breakdownHtml += `
                <div class="breakdown-item">
                    <span class="breakdown-label">
                        <span class="category-legend-color" style="background-color: ${color};"></span>
                        ${cat}
                    </span>
                    <span class="breakdown-val">${Number(info.categories[cat]).toLocaleString()}</span>
                </div>
            `;
        });
        
        const chartHtml = generateDonutChartHtml(info.categories, totalAmount);
        
        cardsHtml += `
            <div class="report-card">
                <h3>${month}</h3>
                <div class="report-total">${Number(totalAmount).toLocaleString()}</div>
                ${chartHtml}
                <div class="report-breakdown">
                    <div class="breakdown-title">By Category</div>
                    ${breakdownHtml}
                </div>
            </div>
        `;
    });
    monthlyContainer.innerHTML = cardsHtml || `<p style="grid-column: 1/-1; text-align: center; color: #777;">No records found.</p>`;
}

function renderYearlyReport() {
    const yearlyContainer = document.getElementById("yearly-report-list");
    if (!yearlyContainer) return;
    
    const yearlyGroups = financeRecords.reduce((acc, recordItem) => {
        const year = recordItem.datetime.slice(0, 4);
        if (!acc[year]) {
            acc[year] = { total: 0, categories: {} };
        }
        const amount = Number(recordItem.amount) || 0;
        acc[year].total += amount;
        if (!acc[year].categories[recordItem.category]) {
            acc[year].categories[recordItem.category] = 0;
        }
        acc[year].categories[recordItem.category] += amount;
        return acc;
    }, {});
    
    let cardsHtml = "";
    Object.keys(yearlyGroups).sort((a, b) => b.localeCompare(a)).forEach(year => {
        const info = yearlyGroups[year];
        const totalAmount = info.total;
        
        let breakdownHtml = "";
        Object.keys(info.categories).sort((a, b) => info.categories[b] - info.categories[a]).forEach(cat => {
            const color = getCategoryColor(cat);
            breakdownHtml += `
                <div class="breakdown-item">
                    <span class="breakdown-label">
                        <span class="category-legend-color" style="background-color: ${color};"></span>
                        ${cat}
                    </span>
                    <span class="breakdown-val">${Number(info.categories[cat]).toLocaleString()}</span>
                </div>
            `;
        });
        
        const chartHtml = generateDonutChartHtml(info.categories, totalAmount);
        
        cardsHtml += `
            <div class="report-card">
                <h3>${year}</h3>
                <div class="report-total">${Number(totalAmount).toLocaleString()}</div>
                ${chartHtml}
                <div class="report-breakdown">
                    <div class="breakdown-title">By Category</div>
                    ${breakdownHtml}
                </div>
            </div>
        `;
    });
    yearlyContainer.innerHTML = cardsHtml || `<p style="grid-column: 1/-1; text-align: center; color: #777;">No records found.</p>`;
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");
    
    tabButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetTabId = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove("active"));
            tabContents.forEach(content => content.classList.remove("active"));
            
            button.classList.add("active");
            document.getElementById(`tab-${targetTabId}`).classList.add("active");
        });
    });
}

if (fullHistoryTableBody) {
    fullHistoryTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("button-delete")) {
            const row = e.target.closest("tr");
            if (confirm("Delete this record?")) {
                deleteRecord(row);
            }
        }
    });
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
        renderAllReports();
    }
}
