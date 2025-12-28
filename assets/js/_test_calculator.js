let total = 0;
let temp_amount = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../partials/calculator.html")
        .then(response => response.text())
        .then(html => {
            document.querySelector(".calculator").innerHTML = html;

            defineCalculatorFunctions();

        });
});

function defineCalculatorFunctions() {
    const equationInput = document.getElementById("equation");
    const amountInput = document.getElementById("calculator-amount");
    equationInput.addEventListener("input", () => {
        const expression = equationInput.value;
        try {
            if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                const result = eval(expression);
                amountInput.value = result ?? "";
            } else {
                amountInput.value = "Invalid characters";
            }
        } catch {
            amountInput.value = "Error";
        }
    });

    window.appendAmount = function(num) {
        equationInput.value = equationInput.value + num;
        // amountInput.value = amountInput.value + num;
    };

    window.backAmount = function() {
        amountInput.value = amountInput.value.toString(10).slice(0, -1);
        equationInput.value = equationInput.value.slice(0, -1);
    };

    window.plusAmount = function() {
        equationInput.value = equationInput.value + "+";
    };

    window.minusAmount = function() {
        equationInput.value = equationInput.value + "-";
    };

    window.multipleAmount = function() {
        equationInput.value = equationInput.value + "*";
    };

    window.divideAmount = function() {
        equationInput.value = equationInput.value + "/";
    };

    window.clearAmount = function() {
        equationInput.value = "";
        amountInput.value = "";
    };
}



// const equationInput = document.getElementById("equation");
// const amountInput = document.getElementById("calculator-amount");
// equationInput.addEventListener("input", () => {
//     const expression = equationInput.value;
//     try {
//         if (/^[0-9+\-*/().\s]+$/.test(expression)) {
//             const result = eval(expression);
//             amountInput.value = result ?? "";
//         } else {
//             amountInput.value = "Invalid characters";
//         }
//     } catch {
//         amountInput.value = "Error";
//     }
// });


// function appendAmount(num) {
//     equationInput.value = equationInput.value + num;
//     // amountInput.value = amountInput.value + num;
// }

// function backAmount() {
//     amountInput.value = amountInput.value.toString(10).slice(0, -1);
//     equationInput.value = equationInput.value.slice(0, -1);
// }

// function plusAmount() {
//     equationInput.value = equationInput.value + "+";
// }

// function minusAmount() {
//     // if (temp_operator.textContent) {calcAmount()}
//     equationInput.value = equationInput.value + "-";
// }

// function multipleAmount() {
//     equationInput.value = equationInput.value + "*";
// }

// function divideAmount() {
//     equationInput.value = equationInput.value + "/";
// }

// function clearAmount() {
//     equationInput.value = "";
//     amountInput.value = "";
// }
