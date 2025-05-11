const display = document.getElementById('display');
const historyLog = document.getElementById('history-log');
let displayValue = '0';
let lastAnswer = 0;

const operators = ['+', '-', '×', '÷', '^', '%'];
const scientificConstants = ['π', 'e', 'Ans'];

function updateDisplay(value = displayValue) {
  display.innerText = value;
}

function append(value) {
  const lastChar = displayValue.slice(-1);


  // Prevent two consecutive operators
  if (operators.includes(lastChar) && operators.includes(value)) return;

  // Prevent operator after scientific constant without proper syntax
  if (scientificConstants.includes(lastChar) && !['(', ')', '+', '-', '×', '÷', '^', '%'].includes(value)) {
    return;
  }

  // Handle decimal points - prevent multiple decimals in a number
  if (value === '.') {
    const parts = displayValue.split(/[\+\-\×\÷\^\%]/);
    if (parts[parts.length - 1].includes('.')) return;
  }

  // Reset display if initial '0'
  if (displayValue === '0' && value !== '.') {
    displayValue = value;
  } else {
    displayValue += value;
  }

  updateDisplay();
}

function clearDisplay() {
  displayValue = '0';
  updateDisplay();
}

function delLast() {
  if (displayValue.length > 1) {
    displayValue = displayValue.slice(0, -1);
  } else {
    displayValue = '0';
  }
  updateDisplay();
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function isBalanced(str) {
  let stack = [];
  for (let char of str) {
    if (char === '(') stack.push(char);
    else if (char === ')') {
      if (!stack.length) return false;
      stack.pop();
    }
  }
  return stack.length === 0;
}

function calculate() {
  try {
    const rawExpression = displayValue;
    let expression = rawExpression;

    // Replace math symbols and constants
    expression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e([^0-9]|$)/g, 'Math.E$1') // avoid breaking scientific notation
      .replace(/Ans/g, lastAnswer)
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/log10\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sinh\(/g, 'Math.sinh(')
      .replace(/cosh\(/g, 'Math.cosh(')
      .replace(/tanh\(/g, 'Math.tanh(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/(\d+)!/g, (_, num) => `factorial(${parseInt(num)})`)
      .replace(/(\d+)\^(\d+)/g, 'Math.pow($1,$2)')
      .replace(/(\d+)²/g, 'Math.pow($1,2)')
      .replace(/(\d*\.?\d+)e([+-]?\d+)/g, '$1*10**$2'); // scientific notation

 // 1. Modulus: number % number → number % number
expression = expression.replace(/(\d+)\s*%\s*(\d+)/g, '($1%$2)');

// 2. Percentage: number% (not followed by another digit) → number / 100
expression = expression.replace(/(\d+(\.\d+)?)%(?!\d)/g, '($1/100)');
    if (!isBalanced(expression)) throw new Error("Unbalanced parentheses");

    const result = eval(expression);
    if (isNaN(result) || !isFinite(result)) throw new Error("Invalid result");

    lastAnswer = result;
    displayValue = result.toString();
    updateDisplay();
    addToHistory(rawExpression, result);
  } catch (e) {
    displayValue = 'Error';
    updateDisplay();
    console.error("Calculation error:", e);
  }
}
function convertDegToRad() {
  try {
    const value = parseFloat(displayValue);
    if (isNaN(value)) throw new Error("Invalid degree value");
    const rad = (value * Math.PI) / 180;
    displayValue = rad.toString();
    updateDisplay();
    addToHistory(`${value}°`, rad);
  } catch (e) {
    displayValue = 'Error';
    updateDisplay();
    console.error("Degree to radian conversion error:", e);
  }
}


function clearHistory() {
  historyLog.innerHTML = '';
}

function addToHistory(expression, result) {
  const historyItem = document.createElement('div');
  historyItem.className = 'history-item';
  historyItem.innerHTML = `
    <span class="history-expression">${expression}</span>
    <span class="history-result">= ${result}</span>
  `;
  historyLog.prepend(historyItem);
}
