"use strict";
// ==============================
// PENGAMAN LOGIN DASHBOARD
// ==============================

document.documentElement.style.visibility = "hidden";

async function checkDashboardAccess() {
  try {
    const session = await window.FinAuth.getSession();

    if (!session) {
      window.location.replace("login.html");
      return false;
    }

    window.FIN_CURRENT_USER = session.user;

    document.documentElement.style.visibility = "visible";

    return true;
  } catch (error) {
    console.error("Pemeriksaan login gagal:", error);
    window.location.replace("login.html");
    return false;
  }
}
const $ = s => document.querySelector(s);

const THEME_KEY = "finmanagement_theme_v1";
const CYCLE_KEY = "finmanagement_cycle_day_v1";

let transactions = [];
let theme = localStorage.getItem(THEME_KEY) || "dark";
let cycleDay = Number(localStorage.getItem(CYCLE_KEY) || 1);
let periodOffset = 0;
let activeFilter = "all";

const colors = [
  "#9257ed", "#f04468", "#4388f5", "#f4a21b",
  "#e84c9c", "#18b6c9", "#13bd91", "#8b9bad"
];

const categories = [
  ["Makanan", ["makan", "beras", "nasi", "sayur", "ayam", "ikan", "telur", "roti", "kopi", "susu", "buah", "sembako"]],
  ["Transportasi", ["bensin", "solar", "parkir", "tol", "bus", "kereta", "taksi", "grab", "gojek", "transport"]],
  ["Belanja", ["belanja", "baju", "sepatu", "celana", "tas", "sabun", "minimarket"]],
  ["Tempat Tinggal", ["kos", "kontrakan", "sewa", "rumah", "properti"]],
  ["Tagihan", ["listrik", "air", "internet", "wifi", "pulsa", "tagihan"]],
  ["Kesehatan", ["obat", "dokter", "vitamin", "rumah sakit", "kesehatan"]],
  ["Pendidikan", ["sekolah", "kuliah", "buku", "kursus"]],
  ["Hiburan", ["nonton", "bioskop", "game", "liburan", "hiburan"]],
  ["Gaji", ["gaji", "salary", "upah", "honor"]],
  ["Usaha", ["jualan", "usaha", "bisnis", "freelance", "dagangan", "proyek"]],
  ["Lainnya", []]
];

function readJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));

    return Array.isArray(fallback)
      ? (Array.isArray(value) ? value : fallback)
      : (value ?? fallback);

  } catch {
    return fallback;
  }
}

function rupiah(number) {
  return "Rp " + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(number || 0);
}

function todayISO() {
  const date = new Date();

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function toast(message) {
  const element = $("#toast");

  element.textContent = message;
  element.classList.add("show");

  setTimeout(() => {
    element.classList.remove("show");
  }, 2200);
}

function getPeriod() {
  const now = new Date();
  let start;

  if (cycleDay === 1) {
    start = new Date(
      now.getFullYear(),
      now.getMonth() + periodOffset,
      1
    );

  } else {
    let anchor = new Date(
      now.getFullYear(),
      now.getMonth(),
      cycleDay
    );

    if (now < anchor) {
      anchor.setMonth(anchor.getMonth() - 1);
    }

    anchor.setMonth(anchor.getMonth() + periodOffset);
    start = anchor;
  }

  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    cycleDay === 1 ? 0 : cycleDay - 1
  );

  return { start, end };
}

function dateInPeriod(dateString, period) {
  const date = new Date(dateString + "T12:00:00");

  return date >= period.start && date <= period.end;
}

function periodLabel(period) {
  return `${period.start.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })} – ${period.end.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })}`;
}

function parseAmount(text) {
  const match = text.toLowerCase().match(
    /(\d[\d.,]*)\s*(jt|juta|rb|ribu|k)?\b/i
  );

  if (!match) return 0;

  const raw = match[1];
  const unit = (match[2] || "").toLowerCase();

  let number;

  if (unit) {
    number = Number(raw.replace(",", "."));
  } else {
    number = Number(raw.replace(/[.,]/g, ""));
  }

  if (!Number.isFinite(number)) return 0;

  return Math.round(
    number * (
      ["jt", "juta"].includes(unit)
        ? 1000000
        : ["rb", "ribu", "k"].includes(unit)
          ? 1000
          : 1
    )
  );
}

function infer(text) {
  const value = text.toLowerCase();

  const income = /\b(gaji|terima|menerima|pemasukan|bonus|pendapatan|freelance|hasil jual|transfer masuk|dapat uang)\b/.test(value);

  let category = "Lainnya";

  for (const [name, words] of categories) {
    if (words.some(word => value.includes(word))) {
      category = name;
      break;
    }
  }

  if (income && category === "Lainnya") {
    category = /gaji/.test(value) ? "Gaji" : "Usaha";
  }

  return {
    type: income ? "income" : "expense",
    category,
    amount: parseAmount(text)
  };
}

async function addQuick(text) {
const clean = text.trim();
const parsed = infer(clean);

if (!clean || !parsed.amount) {
$("#entryFeedback").textContent =
"Nominal belum terbaca. Coba: Makan 35rb, Bensin 100rb, atau Gaji 8jt.";

return false;

}

const description = clean
.replace(
/(?:rp\s*)?\d+(?:[.,]\d+)?\s*(?:jt|juta|rb|ribu|k)?\b/i,
""
)
.replace(/\s+/g, " ")
.trim() || clean;

const item = {
description,
amount: parsed.amount,
type: parsed.type,
category: parsed.category,
date: todayISO(),
note: ""
};

try {
await window.FinDB.addTransaction(item);
transactions = await window.FinDB.getTransactions();

$("#quickInput").value = "";

$("#entryFeedback").textContent =
  `Tersimpan: ${description} · ${parsed.category} · ${rupiah(parsed.amount)}`;

render();

toast("Transaksi berhasil disimpan");

return true;

} catch (error) {
console.error("Gagal menyimpan transaksi:", error);

toast("Gagal menyimpan transaksi ke database");

return false;

}
}

function periodTransactions() {
  const period = getPeriod();

  return transactions.filter(transaction =>
    dateInPeriod(transaction.date, period)
  );
}

function renderSummary(list) {
  const income = list
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expense = list
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  $("#totalIncome").textContent = rupiah(income);
  $("#totalExpense").textContent = rupiah(expense);
  $("#totalBalance").textContent = rupiah(income - expense);
}

function renderDonut(list) {
  const totals = {};

  list
    .filter(item => item.type === "expense")
    .forEach(item => {
      totals[item.category] =
        (totals[item.category] || 0) + Number(item.amount);
    });

  const entries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  const total = entries.reduce(
    (sum, item) => sum + item[1],
    0
  );

  $("#donutTotal").textContent = rupiah(total);

  if (!total) {
    $("#categoryDonut").style.background =
      "conic-gradient(var(--panel2) 0 100%)";

    $("#categoryLegend").innerHTML =
      '<p class="muted">Belum ada pengeluaran pada periode ini.</p>';

    return;
  }

  let cursor = 0;

  const parts = entries.map(([name, value], index) => {
    const start = cursor;

    cursor += value / total * 100;

    return `${colors[index % colors.length]} ${start}% ${cursor}%`;
  });

  $("#categoryDonut").style.background =
    `conic-gradient(${parts.join(",")})`;

  $("#categoryLegend").innerHTML = entries
    .map(([name, value], index) => `
      <div class="legend-row">
        <i class="swatch" style="background:${colors[index % colors.length]}"></i>
        <span>${esc(name)}</span>
        <strong>${Math.round(value / total * 100)}%</strong>
      </div>
    `)
    .join("");
}

function renderTrend() {
  const now = new Date();
  const months = [];

  for (let index = 5; index >= 0; index--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - index,
      1
    );

    months.push({
      date,
      label: date.toLocaleDateString("id-ID", {
        month: "short"
      }),
      income: 0,
      expense: 0
    });
  }

  transactions.forEach(item => {
    const date = new Date(item.date + "T12:00:00");

    const month = months.find(value =>
      value.date.getMonth() === date.getMonth() &&
      value.date.getFullYear() === date.getFullYear()
    );

    if (month) {
      month[
        item.type === "income" ? "income" : "expense"
      ] += Number(item.amount) || 0;
    }
  });

  const max = Math.max(
    1,
    ...months.flatMap(month => [
      month.income,
      month.expense
    ])
  );

  $("#trendChart").innerHTML = months.map(month => `
    <div class="bar-group">
      <div class="bars">
        <i class="bar in"
          title="Masuk ${rupiah(month.income)}"
          style="height:${Math.max(1, month.income / max * 100)}%">
        </i>

        <i class="bar out"
          title="Keluar ${rupiah(month.expense)}"
          style="height:${Math.max(1, month.expense / max * 100)}%">
        </i>
      </div>

      <small>${month.label}</small>
    </div>
  `).join("");
}

function renderHistory(list) {
  const query = $("#searchTransactions").value.toLowerCase();

  const shown = list
    .filter(item =>
      (activeFilter === "all" || item.type === activeFilter) &&
      (`${item.description} ${item.category}`)
        .toLowerCase()
        .includes(query)
    )
    .sort((a, b) =>
      b.date.localeCompare(a.date) ||
      String(b.createdAt).localeCompare(String(a.createdAt))
    );

  $("#transactionEmpty").hidden = shown.length > 0;

  $("#transactionList").innerHTML = shown.map(item => `
    <article class="transaction-row">

      <div class="transaction-symbol ${item.type}">
        ${item.type === "income" ? "↙" : "×"}
      </div>

      <div class="transaction-main">
        <strong>${esc(item.description)}</strong>

        <div class="transaction-meta">
          <span class="category-pill">
            ${esc(item.category)}
          </span>

          <span>
            ${new Date(item.date + "T12:00:00")
              .toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short"
              })}
          </span>
        </div>
      </div>

      <span class="transaction-amount ${item.type}">
        ${item.type === "income" ? "+" : "−"}${rupiah(item.amount)}
      </span>

      <button
        class="delete-button"
        data-delete="${esc(item.id)}"
        aria-label="Hapus ${esc(item.description)}">
        ×
      </button>

    </article>
  `).join("");
}
// ==================================
// AKTIVITAS TRANSAKSI
// ==================================

async function loadTransactionActivity() {
  const activityList = $("#activityList");
  const activityEmpty = $("#activityEmpty");

  activityList.innerHTML =
    '<p class="muted">Memuat aktivitas...</p>';

  try {
    const logs = await window.FinDB.getTransactionLogs();

    if (!logs || logs.length === 0) {
      activityList.innerHTML = "";
      activityEmpty.hidden = false;
      return;
    }

    activityEmpty.hidden = true;

    activityList.innerHTML = logs.map(log => {
      let title = "Aktivitas transaksi";

      if (log.action === "INSERT") {
        title = "Menambahkan transaksi";
      } else if (log.action === "UPDATE") {
        title = "Mengubah transaksi";
      } else if (log.action === "DELETE") {
        title = "Menghapus transaksi";
      }

      const transactionData =
        log.new_data || log.old_data || {};

      const description =
        transactionData.description || "Transaksi";

      const date = new Date(log.created_at);

      const formattedDate = date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const userId = log.user_id
        ? log.user_id.slice(0, 8)
        : "Pengguna";

      return `
        <article class="activity-item">
          <div class="activity-icon">
            ${log.action === "INSERT" ? "+" :
              log.action === "DELETE" ? "×" : "✎"}
          </div>

          <div class="activity-content">
            <strong>${esc(title)}</strong>
            <p>${esc(description)}</p>
            <small>
              Oleh: ${esc(userId)} · ${esc(formattedDate)}
            </small>
          </div>
        </article>
      `;
    }).join("");

  } catch (error) {
    console.error("Gagal memuat aktivitas:", error);

    activityList.innerHTML =
      '<p class="muted">Aktivitas gagal dimuat.</p>';
  }
}

function render() {
  const period = getPeriod();
  const list = periodTransactions();

  const current = new Date();

  $("#periodTitle").textContent =
    period.start.getMonth() === current.getMonth() &&
    period.start.getFullYear() === current.getFullYear()
      ? period.start.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric"
        }) + " (Sekarang)"
      : period.start.toLocaleDateString("id-ID", {
          month: "long",
          year: "numeric"
        });

  $("#periodRange").textContent =
    periodLabel(period) + ` · Siklus tgl ${cycleDay}`;

  $("#categoryPeriod").textContent = periodLabel(period);

  renderSummary(list);
  renderDonut(list);
  renderTrend();
  renderHistory(list);
}

function setTheme() {
  document.documentElement.dataset.theme = theme;

  localStorage.setItem(THEME_KEY, theme);

  $("#themeToggle").textContent =
    theme === "dark" ? "☼" : "☾";
}

/* Pencatatan transaksi cepat */

$("#quickForm").addEventListener("submit", async event => {
  event.preventDefault();

  await addQuick($("#quickInput").value);
});

$("#quickHints").addEventListener("click", event => {
  const button = event.target.closest("[data-example]");

  if (button) {
    $("#quickInput").value = button.dataset.example;
    $("#quickInput").focus();
  }
});

/* Filter transaksi */

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderHistory(periodTransactions());
  });
});

$("#searchTransactions").addEventListener("input", () => {
  renderHistory(periodTransactions());
});

/* Hapus transaksi dari Supabase */

$("#transactionList").addEventListener("click", async event => {
  const button = event.target.closest("[data-delete]");

  if (!button) return;

  const item = transactions.find(
    transaction => transaction.id === button.dataset.delete
  );

  if (
    item &&
    confirm(`Hapus transaksi "${item.description}"?`)
  ) {
    try {
      await window.FinDB.deleteTransaction(item.id);

      transactions = await window.FinDB.getTransactions();

      render();

      toast("Transaksi berhasil dihapus");

    } catch (error) {
      console.error("Gagal menghapus transaksi:", error);

      toast("Gagal menghapus transaksi");
    }
  }
});

/* Tema gelap dan terang */

$("#themeToggle").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";

  setTheme();
});

/* Navigasi periode laporan */

$("#prevPeriod").addEventListener("click", () => {
  periodOffset--;

  render();
});

$("#nextPeriod").addEventListener("click", () => {
  if (periodOffset < 0) {
    periodOffset++;
    render();
  }
});

/* Pengaturan siklus bulanan */

$("#cycleButton").addEventListener("click", () => {
  $("#cycleDay").value = String(cycleDay);

  $("#cycleDialog").showModal();
});

$("#saveCycle").addEventListener("click", () => {
  cycleDay = Number($("#cycleDay").value);

  localStorage.setItem(
    CYCLE_KEY,
    String(cycleDay)
  );

  periodOffset = 0;

  setTimeout(render, 0);
});

/* Ekspor laporan CSV */

$("#exportButton").addEventListener("click", () => {
  const list = periodTransactions();

  const rows = [
    ["Tanggal", "Deskripsi", "Jenis", "Kategori", "Nominal"],

    ...list.map(item => [
      item.date,
      item.description,
      item.type === "income"
        ? "Pemasukan"
        : "Pengeluaran",
      item.category,
      item.amount
    ])
  ];

  const csv = rows.map(row =>
    row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(";")
  ).join("\r\n");

  const blob = new Blob(
    ["\ufeff" + csv],
    { type: "text/csv;charset=utf-8" }
  );

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "laporan-fin-management.csv";

  link.click();

  URL.revokeObjectURL(link.href);

  toast("Laporan CSV diunduh");
});

/* Jalankan aplikasi setelah login terverifikasi */

$("#profileButton").addEventListener("click", () => {
  window.location.href = "profile.html";
});
$("#logoutButton").addEventListener("click", async () => {
  try {
    await window.FinAuth.logout();
    window.location.replace("login.html");
  } catch (error) {
    console.error("Gagal logout:", error);
    toast("Gagal keluar dari akun");
  }
});

checkDashboardAccess().then(async authorized => {
if (!authorized) return;

try {
await window.FinDB.initialize();
  // ==================================
// DOMPET KELUARGA
// ==================================

const wallet = window.FinDB.getCurrentWallet();
const walletUser = window.FinDB.getCurrentUser();

const walletName = document.getElementById("walletName");
const walletRole = document.getElementById("walletRole");
const inviteButton = document.getElementById("createInviteButton");
const inviteResult = document.getElementById("inviteResult");
const inviteCode = document.getElementById("inviteCode");
const walletFeedback = document.getElementById("walletFeedback");

if (wallet) {
  walletName.textContent = wallet.name;

  walletRole.textContent =
  wallet.created_by === walletUser.id
    ? "Pemilik dompet"
    : "Anggota dompet";
}

inviteButton.addEventListener("click", async () => {
  inviteButton.disabled = true;
  walletFeedback.textContent = "Membuat kode undangan...";

  try {
    const code = await window.FinDB.createWalletInvite();

    inviteCode.textContent = code;
    inviteResult.hidden = false;
    walletFeedback.textContent = "Kode undangan berhasil dibuat.";
  } catch (error) {
    walletFeedback.textContent = error.message;
  } finally {
    inviteButton.disabled = false;
  }
});

// Tampilkan nama pengguna
const user = window.FIN_CURRENT_USER;
const displayName =
  user?.user_metadata?.full_name ||
  user?.email ||
  "Pengguna";

const greeting = document.getElementById("userGreeting");

if (greeting) {
  greeting.textContent = `Halo, ${displayName}`;
}

transactions = await window.FinDB.getTransactions();

await loadTransactionActivity();

setTheme();
render();
} catch (error) {
  console.error("Gagal memuat data:", error);

  const detail =
    error?.message ||
    error?.details ||
    error?.hint ||
    error?.code ||
    "Kesalahan tidak diketahui";

  toast("Database: " + detail);
}
});
