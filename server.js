const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;
const HOST = '0.0.0.0';

// Health check endpoint - must respond 200 with non-empty body
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route — serves the calculator UI with fixed button layout and input display
app.get('*', (req, res) => {
  // Inline HTML to deliver the updated calculator UI
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calculator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f0f0f0;
      font-family: Arial, sans-serif;
    }
    .calculator {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      padding: 20px;
      max-width: 320px;
      width: 100%;
    }
    .display {
      background: #e8f0fe;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      word-break: break-all;
    }
    .input-display {
      font-size: 1rem;
      color: #555;
      min-height: 1.2em;
    }
    .result-display {
      font-size: 1.8rem;
      font-weight: bold;
      text-align: right;
    }
    .buttons {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .buttons button {
      padding: 20px 10px;
      font-size: 1.3rem;
      border: none;
      border-radius: 8px;
      background: #f7f7f7;
      cursor: pointer;
      transition: background 0.15s;
    }
    .buttons button:hover {
      background: #e0e0e0;
    }
    .buttons button.operator {
      background: #ffe0b2;
    }
    .buttons button.operator:hover {
      background: #ffcc80;
    }
    .buttons button.equals {
      background: #4caf50;
      color: white;
    }
    .buttons button.equals:hover {
      background: #388e3c;
    }
    .buttons button.clear {
      background: #ef5350;
      color: white;
    }
    .buttons button.clear:hover {
      background: #c62828;
    }
    .buttons button[data-action="backspace"] {
      background: #e0e0e0;
    }
    .span2 {
      grid-column: span 2;
    }
  </style>
</head>
<body>
<div class="calculator" id="app">
  <div class="display">
    <div class="input-display" id="inputDisplay"></div>
    <div class="result-display" id="resultDisplay">0</div>
  </div>
  <div class="buttons" id="buttonPanel">
    <button data-action="clear" class="clear span2">AC</button>
    <button data-action="backspace">⌫</button>
    <button data-action="divide" class="operator">÷</button>
    <button data-action="number" data-value="7">7</button>
    <button data-action="number" data-value="8">8</button>
    <button data-action="number" data-value="9">9</button>
    <button data-action="multiply" class="operator">×</button>
    <button data-action="number" data-value="4">4</button>
    <button data-action="number" data-value="5">5</button>
    <button data-action="number" data-value="6">6</button>
    <button data-action="subtract" class="operator">−</button>
    <button data-action="number" data-value="1">1</button>
    <button data-action="number" data-value="2">2</button>
    <button data-action="number" data-value="3">3</button>
    <button data-action="add" class="operator">+</button>
    <button data-action="number" data-value="0" class="span2">0</button>
    <button data-action="decimal">.</button>
    <button data-action="equals" class="equals">=</button>
  </div>
</div>
<script>
(function() {
  let input = '';
  let result = '0';
  const inputDisplay = document.getElementById('inputDisplay');
  const resultDisplay = document.getElementById('resultDisplay');

  function updateDisplay() {
    inputDisplay.textContent = input || ' ';
    resultDisplay.textContent = result;
  }

  function handleNumber(value) {
    input += value;
    result = input;
    updateDisplay();
  }

  function handleOperator(op) {
    const lastChar = input.slice(-1);
    if ('+-*/'.includes(lastChar)) {
      input = input.slice(0, -1);
    }
    input += op;
    result = input;
    updateDisplay();
  }

  function calculate() {
    try {
      const sanitized = input.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
      let computed = Function('"use strict"; return (' + sanitized + ')')();
      if (!Number.isFinite(computed)) throw new Error('Invalid');
      result = computed.toString();
      input = result;
    } catch (e) {
      result = 'Error';
    }
    updateDisplay();
  }

  document.getElementById('buttonPanel').addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'number') {
      handleNumber(btn.dataset.value);
    } else if (action === 'add') {
      handleOperator('+');
    } else if (action === 'subtract') {
      handleOperator('-');
    } else if (action === 'multiply') {
      handleOperator('*');
    } else if (action === 'divide') {
      handleOperator('/');
    } else if (action === 'decimal') {
      if (!input.endsWith('.')) {
        handleNumber('.');
      }
    } else if (action === 'equals') {
      calculate();
    } else if (action === 'clear') {
      input = '';
      result = '0';
      updateDisplay();
    } else if (action === 'backspace') {
      input = input.slice(0, -1);
      result = input || '0';
      updateDisplay();
    }
  });
})();
</script>
</body>
</html>`;
  res.send(html);
});

app.listen(PORT, HOST, () => {
  console.log(`Calculator server running on http://${HOST}:${PORT}`);
});
