const display = document.getElementById('display');
const historyLog = document.getElementById('history-log');
let displayValue = '0';
let lastAnswer = 0;

const operators = ['+', '-', '*', '/', '^', '%'];
const scientificConstants = ['π', 'e', 'Ans'];

function updateDisplay(value = displayValue) {
  display.innerText = value;
}

function append(value) {
  const lastChar = displayValue.slice(-1);

  // Handle EXP button differently
  if (value === 'EXP') {
    if (displayValue === '0') {
      displayValue = '1e';
    } else {
      displayValue += 'e';
    }
    updateDisplay();
    return;
  }

  // Prevent two consecutive operators
  if (operators.includes(lastChar) && operators.includes(value)) return;

  // Prevent operator after scientific constant without proper syntax
  if (scientificConstants.includes(lastChar) && !['(', ')', '+', '-', '×', '÷', '^', '%'].includes(value)) {
    return;
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

    // Replace EXP (scientific notation) with JavaScript syntax
    expression = expression.replace(/(\d+)e([+-]?\d+)/g, '$1e$2');
    expression = expression.replace(/([)πe]|\d)e([+-]?\d+)/g, '$1*10^$2');

    // Replace other math symbols and functions
    expression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e([^0-9]|$)/g, 'Math.E$1') // Only replace 'e' when not part of scientific notation
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
      .replace(/%/g, '/100');

    // Handle scientific notation (like 1.23e4)
    expression = expression.replace(/(\d*\.?\d+)e([+-]?\d+)/g, '$1*10**$2');

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
