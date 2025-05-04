let result = document.getElementById('result');
let buttons = document.querySelectorAll('button');
let operatorDisplay = document.getElementById('operator');
let previousDisplay = document.getElementById('previous');

let operator = '';
let firstInput = '';
let currentInput = '';
let lastWasEquals = false;

buttons.forEach(button => {
    button.addEventListener('click', function () {
        let input = button.value;

        if (input === "allclear") {
            result.innerText = "0";
            currentInput = "";
            operator = "";
            firstInput = "";
            previousDisplay.innerText = "";
            operatorDisplay.innerText = "";
            lastWasEquals = false;
        }

        else if (input === "clear") {
            // If last operation was equals, edit result instead of clearing everything
            if (lastWasEquals) {
                currentInput = result.innerText;
                lastWasEquals = false;
            }
            currentInput = currentInput.slice(0, -1);
            result.innerText = currentInput || '0';
        }

        else if (input === "sqrt") {
            if (result.innerText !== "0") {
                currentInput = parseFloat(result.innerText);
                result.innerText = Math.sqrt(currentInput).toString();
                operatorDisplay.innerText = "√";
                previousDisplay.innerText = "";
                currentInput = result.innerText;
                lastWasEquals = true;
            }
        }

        else if (input === "mod") {
            firstInput = parseFloat(result.innerText);
            operator = "mod";
            operatorDisplay.innerText = "%";
            previousDisplay.innerText = firstInput;
            currentInput = "";
            result.innerText = "0";
            lastWasEquals = false;
        }

        else if (["+", "-", "÷", "×"].includes(input)) {
            firstInput = parseFloat(result.innerText);
            operator = input;
            operatorDisplay.innerText = operator;
            previousDisplay.innerText = firstInput;
            currentInput = "";
            result.innerText = "0";
            lastWasEquals = false;
        }

        else if (input === "equals") {
            if (previousDisplay.innerText) {
                firstInput = parseFloat(previousDisplay.innerText);
                let secondInput = parseFloat(result.innerText);
                let output;

                switch (operator) {
                    case '+':
                        output = firstInput + secondInput;
                        break;
                    case '-':
                        output = firstInput - secondInput;
                        break;
                    case '×':
                        output = firstInput * secondInput;
                        break;
                    case '÷':
                        output = secondInput !== 0 ? firstInput / secondInput : "Error";
                        break;
                    case 'mod':
                        output = firstInput % secondInput;
                        break;
                    default:
                        output = result.innerText;
                }

                result.innerText = output.toString();
                currentInput = output.toString(); // ← this is key!
                previousDisplay.innerText = '';
                operatorDisplay.innerText = '';
                operator = '';
                lastWasEquals = true;
            }
        }

        else {
            if (lastWasEquals) {
                currentInput = "";
                result.innerText = "";
                lastWasEquals = false;
            }
            currentInput += input;
            result.innerText = currentInput;
        }
    });
});
