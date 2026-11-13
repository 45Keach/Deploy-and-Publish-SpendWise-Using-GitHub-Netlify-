(() => {
  "use strict";
  const STORAGE_KEY = "spendwise-data-v1";
  const DEFAULT_BUDGET = 50000;
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => new Intl.NumberFormat("en-KE", { style:"currency", currency:"KES", maximumFractionDigits:2 }).format(value);
  const dateLabel = (value) => new Date(value + "T00:00:00").toLocaleDateString("en-KE", { day:"numeric", month:"short", year:"numeric" });
  const today = new Date().toISOString().slice(0,10);
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { state = {}; }
  if (!Array.isArray(state.transactions)) state.transactions = [];
  if (typeof state.budget !== "number") state.budget = DEFAULT_BUDGET;
  let chart = null;
  let toastTimer;
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const expenses = () => state.transactions.filter(t => t.type === "expense");
  const total = (items) => items.reduce((sum,t) => sum + t.amount, 0);
  const categoryIcons = {Food:"☕",Transport:"↗",Housing:"⌂",Shopping:"◇",Health:"✚",Entertainment:"♫",Utilities:"⌁",Salary:"↙",Freelance:"✦",Other:"•"};
  function notify(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function renderSummary() {
    const income = total(state.transactions.filter(t => t.type === "income"));
    const spent = total(expenses());
    $("#balance").textContent = money(income-spent);
    $("#income").textContent = money(income);
    $("#expenses").textContent = money(spent);
    $("#budget-total").textContent = money(state.budget);
    const currentMonth = today.slice(0,7);
    const monthlySpent = total(expenses().filter(t => t.date.slice(0,7) === currentMonth));
    const percent = state.budget > 0 ? Math.min(100, monthlySpent/state.budget*100) : 0;
    $("#budget-progress").style.width = percent + "%";
    $("#budget-caption").textContent = state.budget ? money(Math.max(0,state.budget-monthlySpent)) + " remaining this month" : "No budget set";
  }
  function renderTransactions() {
    const rows = [...state.transactions].sort((a,b) => b.date.localeCompare(a.date) || b.id-a.id).slice(0,6);
    $("#transaction-rows").innerHTML = rows.length ? rows.map(t => `<tr><td><div class="transaction-name"><span class="transaction-symbol">${categoryIcons[t.category] || "•"}</span>${escapeHtml(t.description)}</div></td><td>${escapeHtml(t.category)}</td><td>${dateLabel(t.date)}</td><td class="amount-cell ${t.type === "expense" ? "out" : ""}">${t.type === "expense" ? "−" : "+"}${money(t.amount)}</td><td><button class="delete-btn" data-delete="${t.id}" aria-label="Delete ${escapeHtml(t.description)}" title="Delete transaction">×</button></td></tr>`).join("") : '<tr><td colspan="5" class="empty-table">No transactions yet. Add your first one to get started.</td></tr>';
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function renderCategories() {
    const grouped = {};
    expenses().forEach(t => grouped[t.category] = (grouped[t.category] || 0) + t.amount);
    const entries = Object.entries(grouped).sort((a,b) => b[1]-a[1]);
    const max = entries.length ? entries[0][1] : 1;
    $("#category-list").innerHTML = entries.length ? entries.slice(0,5).map(([name,value]) => `<div class="category-item"><span class="category-symbol">${categoryIcons[name] || "•"}</span><div><div class="category-name">${escapeHtml(name)}</div><div class="category-track"><span style="width:${value/max*100}%"></span></div></div><strong class="category-value">${money(value)}</strong></div>`).join("") : '<div class="empty-state">Your categories will appear here.</div>';
  }
  function renderBudgets() {
    const month = today.slice(0,7);
    const grouped = {};
    expenses().filter(t => t.date.slice(0,7) === month).forEach(t => grouped[t.category] = (grouped[t.category] || 0) + t.amount);
    const entries = Object.entries(grouped).sort((a,b) => b[1]-a[1]);
    $("#budget-details").innerHTML = entries.length ? entries.map(([name,value]) => {
      const limit = state.categoryBudgets && state.categoryBudgets[name] ? state.categoryBudgets[name] : state.budget;
      const pct = limit > 0 ? Math.min(100,value/limit*100) : 100;
      return `<div class="budget-row"><div><strong>${escapeHtml(name)}</strong><small>${money(value)} spent of ${money(limit)}</small></div><strong>${Math.round(pct)}%</strong><div class="budget-track"><span class="${value>limit?"over":""}" style="width:${pct}%"></span></div></div>`;
    }).join("") : '<div class="empty-state">No spending recorded this month. Add an expense to see your budget progress.</div>';
  }
  function renderChart() {
    const canvas = $("#spending-chart");
    const fallback = $("#chart-fallback");
    if (typeof Chart === "undefined") { fallback.textContent = "Chart library unavailable. Your transactions are still saved."; return; }
    const income = total(state.transactions.filter(t => t.type === "income"));
    const spent = total(expenses());
    fallback.style.display = state.transactions.length ? "none" : "grid";
    if (chart) chart.destroy();
    chart = new Chart(canvas, {type:"bar",data:{labels:["Income","Expenses"],datasets:[{data:[income,spent],backgroundColor:["#25b88c","#f0a078"],borderRadius:7,maxBarThickness:65}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>money(ctx.raw)}}},scales:{x:{grid:{display:false},ticks:{color:"#8791a3",font:{family:"DM Sans"}}},y:{beginAtZero:true,grid:{color:"#f0f2f6"},ticks:{color:"#9aa3b2",font:{size:10},callback:(v)=>new Intl.NumberFormat("en-KE",{notation:"compact"}).format(v)}}}}});
  }
  function render() { renderSummary(); renderTransactions(); renderCategories(); renderBudgets(); renderChart(); }
  function openModal() { $("#transaction-modal").classList.add("open"); $("#transaction-modal").setAttribute("aria-hidden","false"); $("#transaction-form").elements.description.focus(); }
  function closeModal() { $("#transaction-modal").classList.remove("open"); $("#transaction-modal").setAttribute("aria-hidden","true"); $("#transaction-form").reset(); $("#transaction-date").value=today; $("#form-error").textContent=""; }
  $("#today-label").textContent = new Date().toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short",year:"numeric"});
  $("#transaction-date").value = today;
  $("#open-modal").addEventListener("click",openModal);
  $("#close-modal").addEventListener("click",closeModal);
  $("#transaction-modal").addEventListener("click",e => { if(e.target.id==="transaction-modal") closeModal(); });
  document.addEventListener("keydown",e => { if(e.key==="Escape") closeModal(); });
  $("#transaction-form").addEventListener("submit",e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const amount = Number(data.get("amount"));
    const description = String(data.get("description")).trim();
    const date = String(data.get("date"));
    if (!description || !Number.isFinite(amount) || amount <= 0 || !date) { $("#form-error").textContent="Enter a description, a valid amount and a date."; return; }
    state.transactions.push({id:Date.now(),description,amount,type:String(data.get("type")),category:String(data.get("category")),date});
    save(); render(); closeModal(); notify("Transaction saved successfully.");
  });
  $("#transaction-rows").addEventListener("click",e => {
    const button = e.target.closest("[data-delete]"); if(!button) return;
    const id = Number(button.dataset.delete);
    state.transactions = state.transactions.filter(t => t.id !== id);
    save(); render(); notify("Transaction deleted.");
  });
  $("#edit-budget").addEventListener("click",() => {
    const answer = prompt("Enter your monthly budget in KSh:",String(state.budget));
    if(answer === null) return;
    const value = Number(answer);
    if(!Number.isFinite(value) || value < 0) { notify("Please enter a valid budget amount."); return; }
    state.budget = value; save(); render(); notify("Monthly budget updated.");
  });
  $("#view-all").addEventListener("click",() => {
    $("#transaction-rows").innerHTML = [...state.transactions].sort((a,b)=>b.date.localeCompare(a.date)).map(t => `<tr><td><div class="transaction-name"><span class="transaction-symbol">${categoryIcons[t.category]||"•"}</span>${escapeHtml(t.description)}</div></td><td>${escapeHtml(t.category)}</td><td>${dateLabel(t.date)}</td><td class="amount-cell ${t.type==="expense"?"out":""}">${t.type==="expense"?"−":"+"}${money(t.amount)}</td><td><button class="delete-btn" data-delete="${t.id}" aria-label="Delete transaction">×</button></td></tr>`).join("") || '<tr><td colspan="5" class="empty-table">No transactions yet.</td></tr>';
    $("#transactions").scrollIntoView({behavior:"smooth"});
  });
  render();
})();