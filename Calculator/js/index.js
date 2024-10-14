let result = document.getElementById('result');
let buttons = document.querySelectorAll('button');
let operatorDisplay = document.getElementById('operator');
let previousDisplay = document.getElementById('previous');
let operator = '';
let firstInput = '';
let currentInput = '';

buttons.forEach(button => {
    button.addEventListener('click', function () {
        let input = button.value;

        if (input === "allcler") {
            result.innerText = "0";
            currentInput = "";
            operatorDisplay.innerText = "";
            previousDisplay.innerText = "";
        } else if (input === "clear") {
            currentInput = currentInput.slice(0, -1);
            result.innerText = currentInput || '0';
        } else if (input === "sqrt") {
            if (result.innerText !== "0") {
                currentInput = parseFloat(result.innerText);
                result.innerText = Math.sqrt(currentInput).toString();
                operatorDisplay.innerText = "√";
                previousDisplay.innerText = "";
            }
        } else if (input === "mod") {
            if (result.innerText !== "0") {
                firstInput = parseFloat(result.innerText);
                previousDisplay.innerText = firstInput;
                operatorDisplay.innerText = "%";
                operator = "mod"; 
                currentInput = "";
                result.innerText = "0";
            }
        } else if (["+", "-", "/", "*"].includes(input)) {
            if (result.innerText !== "0") {
                firstInput = parseFloat(result.innerText);
                previousDisplay.innerText = firstInput;
                operator = input;
                operatorDisplay.innerText = operator;
                currentInput = "";
                result.innerText = "0";
            }
        } else if (input === "equals") {
            if (previousDisplay.innerText) {
                firstInput = parseFloat(previousDisplay.innerText);
                currentInput = parseFloat(result.innerText);
                switch (operator) {
                    case '+':
                        result.innerText = (firstInput + currentInput).toString(); 
                        break;
                    case '-':
                        result.innerText = (firstInput - currentInput).toString(); 
                        break;
                    case '*':
                    case 'x':
                        result.innerText = (firstInput * currentInput).toString();
                        break;
                    case '/':
                        if (currentInput !== 0) {
                            result.innerText = (firstInput / currentInput).toString();
                        } else {
                            result.innerText = "Error";
                        }
                        break;
                    case "mod":
                        result.innerText = (firstInput % currentInput).toString();
                        break;
                    default:
                        result.innerText = "0";
                        break;
                }
                operator = '';
                currentInput = '';
                previousDisplay.innerText = '';
            }
        } else {
            currentInput += input;
            result.innerText = currentInput;
        }
    });
});
