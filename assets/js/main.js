/* to do 
total in a week
total in a month
budget
balance
graph
change the format of date to date-time
add category one-touch button
add one touch button for changing date forward and backward
*/

let total = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../partials/calculator.html")
        .then(response => response.text())
        .then(html => {
            document.querySelector(".calculator").innerHTML = html;
        })

    document.getElementById("date").value = new Date().toISOString().split("T")[0];
    loadFromLocalStorage();
    const buttonOpen = document.getElementById("modalOpen");
    const buttonClose = document.getElementById("modalClose");
    const modal = document.getElementById("calcModal");
    
    buttonOpen.addEventListener("click", modalOpen);
    function modalOpen() {
        // modal.style.display = "block";
        modal.style.display = "flex";
    }

    buttonClose.addEventListener("click", modalClose);
    function modalClose() {
        modal.style.display = "none";
    }

    document.addEventListener("click", outsideClose);
    function outsideClose(e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }
});

const equationInput = document.getElementById("equation");
const resultDisplay = document.getElementById("result");
equationInput.addEventListener("input", () => {
    const expression = equationInput.value;
    try {
        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
            const result = eval(expression);
            resultDisplay.textContent = result ?? "";
        } else {
            resultDisplay.textContent = "Invalid characters";
        }
    } catch {
        resultDisplay.textContent = "Error";
    }
});

// calculator
function appendAmount(num) {
    const amountInput = document.getElementById("calculator-amount");
    amountInput.value = amountInput.value + num;
}

function backAmount() {
    const amountInput = document.getElementById("calculator-amount");
    amountInput.value = amountInput.value.toString(10).slice(0, -1);
}

function plusAmount() {
    const amountInput = document.getElementById("calculator-amount");
    console.log("plus");

    const temp_amount = document.getElementById("temp_amount");
    const temp_operator = document.getElementById("temp_operator");
    // if (temp_operator.textContent) {calcAmount()}
    temp_operator.textContent = "+";
    temp_amount.textContent = amountInput.value;

    equationInput.value = "+";

    amountInput.value = "";
}

// function plusAmount() {
//     const amountInput = document.getElementById("calculator-amount");
//     const temp_amount = document.getElementById("temp_amount");
//     const temp_operator = document.getElementById("temp_operator");
//     if (temp_operator.textContent) {calcAmount()}
//     temp_operator.textContent = "+";
//     temp_amount.textContent = amountInput.value;
//     amountInput.value = "";
// }

function minusAmount() {
    const amountInput = document.getElementById("calculator-amount");
    const temp_amount = document.getElementById("temp_amount");
    const temp_operator = document.getElementById("temp_operator");
    if (temp_operator.textContent) {calcAmount()}
    temp_operator.textContent = "-";
    temp_amount.textContent = amountInput.value;
    amountInput.value = "";
}

function multipleAmount() {
    const amountInput = document.getElementById("calculator-amount");
    const temp_amount = document.getElementById("temp_amount");
    const temp_operator = document.getElementById("temp_operator");
    if (temp_operator.textContent) {calcAmount()}
    temp_operator.textContent = "*";
    temp_amount.textContent = amountInput.value;
    amountInput.value = "";
}

function divideAmount() {
    const amountInput = document.getElementById("calculator-amount");
    const temp_amount = document.getElementById("temp_amount");
    const temp_operator = document.getElementById("temp_operator");
    if (temp_operator.textContent) {calcAmount()}
    temp_operator.textContent = "/";
    temp_amount.textContent = amountInput.value;
    amountInput.value = "";
}

function calcAmount() {
    const amountInput = document.getElementById("calculator-amount");
    const temp_amount = document.getElementById("temp_amount");
    const temp_operator = document.getElementById("temp_operator");
    if (temp_operator.textContent == "+") {
        amountInput.value = Number(temp_amount.textContent) + Number(amountInput.value);
    } else if (temp_operator.textContent == "-") {
        amountInput.value = Number(temp_amount.textContent) - Number(amountInput.value);
    } else if (temp_operator.textContent == "*") {
        amountInput.value = Number(temp_amount.textContent) * Number(amountInput.value);
    } else if (temp_operator.textContent == "/") {
        amountInput.value = Number(temp_amount.textContent) / Number(amountInput.value);
    } else {return}
    temp_amount.textContent = amountInput.value;
    temp_operator.textContent = "";
    // amountInput.value = "";
}

function clearAmount() {
    document.getElementById("calculator-amount").value = "";
    document.getElementById("temp_amount").textContent = "";
    document.getElementById("temp_operator").textContent = "";
}