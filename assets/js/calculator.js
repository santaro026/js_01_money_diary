/* to do
*/

import { modal, activeAmountInput } from "./main.js"

let calcEquationInput;
let calcAmountResultInput;

const calculatorHtmlTemplate = `
<div class="modal-content">
    <div class="modal-header">
        <h2>Calculator</h2>
        <span id="modal-close" class="modal-close">&times;</span>
    </div>
    <div class="modal-body">
        <div class="calculator-display">
            <input type="text" id="calculator-equation" readonly placeholder="0">
            <input type="text" id="calculator-amount" readonly value="0">
        </div>
        <div class="calculator">
            <button type="button" id="button-AC" class="button-calculator operator">AC</button>
            <button type="button" id="button-tax8" class="button-calculator operator">8%</button>
            <button type="button" id="button-tax10" class="button-calculator operator">10%</button>
            <button type="button" id="button-divide" class="button-calculator operator">/</button>
            
            <button type="button" class="button-calculator button-num" data-value="7">7</button>
            <button type="button" class="button-calculator button-num" data-value="8">8</button>
            <button type="button" class="button-calculator button-num" data-value="9">9</button>
            <button type="button" id="button-multiple" class="button-calculator operator">*</button>
            
            <button type="button" class="button-calculator button-num" data-value="4">4</button>
            <button type="button" class="button-calculator button-num" data-value="5">5</button>
            <button type="button" class="button-calculator button-num" data-value="6">6</button>
            <button type="button" id="button-minus" class="button-calculator operator">-</button>
            
            <button type="button" class="button-calculator button-num" data-value="1">1</button>
            <button type="button" class="button-calculator button-num" data-value="2">2</button>
            <button type="button" class="button-calculator button-num" data-value="3">3</button>
            <button type="button" id="button-plus" class="button-calculator operator">+</button>
            
            <button type="button" class="button-calculator button-num" data-value="0">0</button>
            <button type="button" class="button-calculator button-num" data-value="00">00</button>
            <button type="button" id="button-BS" class="button-calculator operator">←</button>
            <button type="button" id="button-equal" class="button-calculator equal">=</button>
        </div>
    </div>
</div>
`

export function initCalculator(selectorClass) {
    const container = document.querySelector(selectorClass);
    if (!container) return;
    container.innerHTML = calculatorHtmlTemplate;
    calcAmountResultInput = document.getElementById("calculator-amount");
    calcEquationInput = document.getElementById("calculator-equation");
    calcEquationInput.addEventListener("input", () => {
        const expression = calcEquationInput.value;
        try {
            const calculatedAmount = myCalculator(expression);
            if (typeof calculatedAmount === "string") {
                calcAmountResultInput.value = calculatedAmount;
            } else if (typeof calculatedAmount == "number") {
                calcAmountResultInput.value = calculatedAmount | 0;
            }
        } catch {
            calcAmountResultInput.value = "Error";
        }
    });
    registerCalcEventListeners(container);
}

function registerCalcEventListeners(container) {
    container.querySelector("#modal-close").addEventListener("click", () => {
        modal.style.display = "none";
    });
    container.querySelector("#button-AC").addEventListener("click", clearAll)
    container.querySelectorAll(".button-num").forEach(button => {
        button.addEventListener("click", () => appendAmount(button.dataset.value));
    });
    container.querySelector("#button-equal").addEventListener("click", calculate);
    container.querySelector("#button-BS").addEventListener("click", backspace);
    container.querySelector("#button-plus").addEventListener("click", plusAmount);
    container.querySelector("#button-minus").addEventListener("click", minusAmount);
    container.querySelector("#button-multiple").addEventListener("click", multipleAmount);
    container.querySelector("#button-divide").addEventListener("click", divideAmount);
    container.querySelector("#button-tax8").addEventListener("click", () => appendTax(8));
    container.querySelector("#button-tax10").addEventListener("click", () => appendTax(10));
}

function fourArithmeticOperator(tokens) {
    let queue = [];
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token === '*' || token ==='/') {
            let prev = parseFloat(queue.pop());
            let next = parseFloat(tokens[++i]);
            let res = token === '*' ? prev * next : prev / next;
            queue.push(res);
        } else {
            queue.push(token);
        }
    }
    let result = parseFloat(queue[0]);
    for (let i = 1; i < queue.length; i += 2) {
        let operator = queue[i];
        let next = parseFloat(queue[i+1]);
        result = operator === "+" ? result + next : result - next;
    }
    return result;
}

function fourArithmeticOperator2(tokens) {
    let queue = [];
    while (tokens.length > 0) {
        let token = tokens.shift()
        if (token === '(' || token === '[' || token === '{') {
            queue.push(fourArithmeticOperator2(tokens));
        } else if (token === ')' || token === ']' || token === '}') {
            break;
        } else if (token === '*' || token === '/') {
            let prev = parseFloat(queue.pop());
            let nextToken = tokens.shift();
            let next = (nextToken === '(' || nextToken === '[' || nextToken === '{') ? fourArithmeticOperator2(tokens) : parseFloat(nextToken);
            queue.push(token === '*' ? prev * next : prev / next);
        } else {
            queue.push(token);
        }
    }
    let result = parseFloat(queue[0]) || 0;
    for (let i = 1; i < queue.length; i += 2) {
        let operator = queue[i];
        let val = parseFloat(queue[i+1]);
        if (operator === '+') result += val;
        if (operator === '-') result -= val;
    }
    return result;
}

function myCalculator(expression) {
    if (/[\+\-\*/]{2,}/.test(expression)) {
        return "error";
    } else if (/[\+\-\*/]$/.test(expression)) {
        return 0;
    }
    const tokens = expression.match(/[()\[\]{}]|[0-9.]+|[\+\-\*/]/g)
    if (!tokens) return 0;
    return fourArithmeticOperator2(tokens);
}

function appendAmount(num) {
    calcEquationInput.value = calcEquationInput.value + num;
    calcEquationInput.dispatchEvent(new Event("input"));
}
function plusAmount() {
    calcEquationInput.value += "+";
}

function minusAmount() {
    calcEquationInput.value += "-";
}

function multipleAmount() {
    calcEquationInput.value += "*";
}

function divideAmount() {
    calcEquationInput.value += "/";
}

function appendTax(rate) {
    calcEquationInput.value = `(${calcEquationInput.value})*(${1+rate/100})`
    calcEquationInput.dispatchEvent(new Event("input"));
}

function backspace() {
    calcEquationInput.value = calcEquationInput.value.toString(10).slice(0, -1);
    calcEquationInput.dispatchEvent(new Event("input"));
}

function clearAll() {
    calcEquationInput.value = "";
    calcAmountResultInput.value = 0;
}

function calculate() {
    modal.style.display = "none";
    activeAmountInput.value = calcAmountResultInput.value;
    activeAmountInput.dispatchEvent(new Event("change", { bubbles: true }));
    activeAmountInput.dispatchEvent(new Event("input", { bubbles: true }));
}
