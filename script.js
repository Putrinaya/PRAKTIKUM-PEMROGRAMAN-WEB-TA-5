let expr = "";
let entry = "";
let history = [];
let memory = 0;

const mainDisplay = document.getElementById("mainDisplay");
const exprPreview = document.getElementById("exprPreview");
const historyList = document.getElementById("historyList");
const memoryDisplay = document.getElementById("memoryDisplay");
const buttons = document.getElementById("buttons");

function updateDisplays() {
  mainDisplay.textContent = entry !== "" ? entry : "0";
  exprPreview.textContent = expr.replace(/\*/g,"×").replace(/\//g,"÷");
  memoryDisplay.textContent = memory;
}

// ======================= INPUT NUMBER ===========================
function pushDigit(d) {
  if (d === "." && entry.includes(".")) return;
  entry += d;
  updateDisplays();
}

// ======================= OPERATORS ==============================
function applyOperator(op) {
  if (entry !== "") {
    expr += entry;
    entry = "";
  }
  expr += op;
  updateDisplays();
}

// ======================= CLEAR FUNCTIONS ========================
function clearEntry() {
  entry = "";
  updateDisplays();
}

function clearAll() {
  entry = "";
  expr = "";
  updateDisplays();
}

// ======================= SAFE EVAL ==============================
function safeEval(e) {
  if (/\/0(?!\.)/.test(e)) {
    alert("Error: Pembagian dengan nol tidak diperbolehkan!");
    return "Error";
  }
  return Function(`return (${e})`)();
}

// ======================= EQUALS =================================
function computeEquals() {
  if (entry !== "") expr += entry;

  try {
    const result = safeEval(expr);

    if (result === "Error") {
      entry = "";
      expr = "";
      updateDisplays();
      return;
    }

    entry = String(result);
    history.unshift(expr.replace(/\*/g,"×").replace(/\//g,"÷") + " = " + result);

    renderHistory();
    expr = "";
    updateDisplays();

  } catch {
    alert("Terjadi kesalahan perhitungan!");
    mainDisplay.textContent = "Error";
  }
}

// ======================= PERCENT ================================
function percent() {
  if (entry === "") return;
  entry = String(parseFloat(entry) / 100);
  updateDisplays();
}

// ======================= HISTORY RENDER ==========================
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(h => {
    let div = document.createElement("div");
    div.className = "hist-item";
    div.textContent = h;
    historyList.appendChild(div);
  });
}

// ======================= MEMORY =================================
document.getElementById("mc").onclick = () => { memory = 0; updateDisplays(); };
document.getElementById("mr").onclick = () => { entry = String(memory); updateDisplays(); };
document.getElementById("mplus").onclick = () => { memory += parseFloat(entry || 0); updateDisplays(); };
document.getElementById("mminus").onclick = () => { memory -= parseFloat(entry || 0); updateDisplays(); };

// ======================= BUTTON CLICKS ===========================
buttons.onclick = (e) => {
  const t = e.target;
  const val = t.dataset.value;
  const act = t.dataset.action;

  if (val) {
    if ("0123456789.".includes(val)) pushDigit(val);
    else applyOperator(val);
  } else if (act) {
    if (act === "clear-entry") clearEntry();
    if (act === "clear-all") clearAll();
    if (act === "percent") percent();
    if (act === "equals") computeEquals();
  }
};

// ======================= KEYBOARD SUPPORT ========================
document.addEventListener("keydown", function(event) {
  const k = event.key;

  if (/[0-9]/.test(k)) pushDigit(k);
  else if (k === ".") pushDigit(".");
  else if (["+", "-", "*", "/"].includes(k)) applyOperator(k);
  else if (k === "Enter") computeEquals();
  else if (k === "Backspace") {
    entry = entry.slice(0, -1);
    updateDisplays();
  }
  else if (k === "Escape") clearAll();
});

updateDisplays();
