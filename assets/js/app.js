/* =========================================
   FIN.MANAGEMENT - KHAYALAN GRUP
   Application Engine
========================================= */

"use strict";


// =========================================
// 1. ELEMENTS
// =========================================

const $ = (selector) => document.querySelector(selector);

const elements = {
    totalBalance: $("#totalBalance"),
    totalIncome: $("#totalIncome"),
    totalExpense: $("#totalExpense"),
    remainingBudget: $("#remainingBudget"),

    transactionList: $("#transactionList"),
    transactionEmpty: $("#transactionEmpty"),

    modal: $("#transactionModal"),
    form: $("#transactionForm"),

    description: $("#transactionDescription"),
    type: $("#transactionType"),
    amount: $("#transactionAmount"),
    category: $("#transactionCategory"),
    date: $("#transactionDate"),
    note: $("#transactionNote"),

    addButton: $("#addTransactionBtn"),
    closeModal: $("#closeModal"),

    themeToggle: $("#themeToggle"),
    menuToggle: $("#menuToggle"),
    sidebar: $("#sidebar"),

    pageTitle: $("#pageTitle"),
    pageSubtitle: $("#pageSubtitle"),

    dashboardPage: $("#dashboardPage"),
    otherPage: $("#otherPage"),
    otherPageTitle: $("#otherPageTitle")
};


// =========================================
// 2. APPLICATION DATA
// =========================================

const STORAGE_KEY = "finmanagement_transactions_v1";
const THEME_KEY = "finmanagement_theme_v1";

let transactions = loadTransactions();

const pageNames = {
    dashboard: "Dashboard",
    transactions: "Transaksi",
    budgets: "Anggaran",
    reports: "Laporan",
    reminders: "Pengingat Tagihan",
    wallet: "Dompet Saya",
    family: "Dompet Bersama",
    settings: "Pengaturan"
};


// =========================================
// 3. HELPER FUNCTIONS
// =========================================

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number || 0);
}


function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function isCurrentMonth(dateString) {
    const date = new Date(dateString + "T00:00:00");
    const now = new Date();

    return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}


function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}


function generateId() {
    if (window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }

    return Date.now().toString(36) +
        Math.random().toString(36).slice(2);
}


// =========================================
// 4. LOCAL STORAGE
// =========================================

function loadTransactions() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return [];

        const data = JSON.parse(saved);

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("Gagal membaca transaksi:", error);
        return [];
    }
}


function saveTransactions() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(transactions)
        );

        return true;

    } catch (error) {
        console.error("Gagal menyimpan transaksi:", error);

        alert(
            "Data gagal disimpan. Penyimpanan browser mungkin penuh."
        );

        return false;
    }
}


// =========================================
// 5. DASHBOARD CALCULATION
// =========================================

function calculateSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    transactions.forEach((transaction) => {

        const amount = Number(transaction.amount) || 0;

        if (transaction.type === "income") {
            totalIncome += amount;

            if (isCurrentMonth(transaction.date)) {
                monthlyIncome += amount;
            }

        } else {
            totalExpense += amount;

            if (isCurrentMonth(transaction.date)) {
                monthlyExpense += amount;
            }
        }
    });

    return {
        balance: totalIncome - totalExpense,
        income: monthlyIncome,
        expense: monthlyExpense
    };
}


function updateDashboard() {
    const summary = calculateSummary();

    elements.totalBalance.textContent =
        formatRupiah(summary.balance);

    elements.totalIncome.textContent =
        formatRupiah(summary.income);

    elements.totalExpense.textContent =
        formatRupiah(summary.expense);

    // Anggaran belum terhubung.
    // Nilai ini akan dihitung setelah fitur anggaran dibuat.
    elements.remainingBudget.textContent = formatRupiah(0);

    renderTransactions();
}


// =========================================
// 6. RENDER TRANSACTIONS
// =========================================

function renderTransactions() {

    const sortedTransactions = [...transactions].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const latestTransactions = sortedTransactions.slice(0, 10);

    if (latestTransactions.length === 0) {
        elements.transactionEmpty.classList.remove("hidden");
        elements.transactionList.innerHTML = "";
        return;
    }

    elements.transactionEmpty.classList.add("hidden");

    elements.transactionList.innerHTML =
        latestTransactions.map((transaction) => {

            const isIncome = transaction.type === "income";

            const sign = isIncome ? "+" : "-";

            const color = isIncome
                ? "var(--income)"
                : "var(--expense)";

            const icon = isIncome ? "↗" : "↘";

            const description = escapeHTML(
                transaction.description
            );

            const category = escapeHTML(
                transaction.category
            );

            const date = new Date(
                transaction.date + "T00:00:00"
            ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

            return `
                <div class="transaction-item">

                    <div class="transaction-info">

                        <div class="transaction-icon"
                             style="color:${color}">
                            ${icon}
                        </div>

                        <div>
                            <strong>${description}</strong>
                            <span>${category} · ${date}</span>
                        </div>

                    </div>

                    <div class="transaction-actions">

                        <strong style="color:${color}">
                            ${sign}${formatRupiah(transaction.amount)}
                        </strong>

                        <button
                            class="delete-transaction"
                            data-id="${escapeHTML(transaction.id)}"
                            aria-label="Hapus transaksi"
                            title="Hapus transaksi">
                            ×
                        </button>

                    </div>

                </div>
            `;

        }).join("");
}


// =========================================
// 7. ADD TRANSACTION
// =========================================

function addTransaction(event) {

    event.preventDefault();

    const description = elements.description.value.trim();

    const amount = Number(elements.amount.value);

    const type = elements.type.value;

    const category = elements.category.value;

    const date = elements.date.value;

    const note = elements.note.value.trim();

    if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
        alert("Periksa kembali data transaksi Anda.");
        return;
    }

    const transaction = {
        id: generateId(),
        description,
        amount,
        type,
        category,
        date,
        note,
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);

    if (!saveTransactions()) {
        transactions.pop();
        return;
    }

    updateDashboard();

    closeTransactionModal();

    elements.form.reset();

    elements.date.value = getToday();

    alert("Transaksi berhasil disimpan!");

}


// =========================================
// 8. DELETE TRANSACTION
// =========================================

function deleteTransaction(id) {

    const transaction = transactions.find(
        (item) => item.id === id
    );

    if (!transaction) return;

    const confirmation = confirm(
        `Hapus transaksi "${transaction.description}"?`
    );

    if (!confirmation) return;

    const previousTransactions = [...transactions];

    transactions = transactions.filter(
        (item) => item.id !== id
    );

    if (!saveTransactions()) {
        transactions = previousTransactions;
        return;
    }

    updateDashboard();
}


// =========================================
// 9. NATURAL LANGUAGE INPUT
// =========================================

function detectCategory(text) {

    const value = text.toLowerCase();

    const categories = [
        {
            name: "Makanan",
            keywords: [
                "beras", "nasi", "makan", "sayur",
                "ayam", "ikan", "telur", "roti",
                "kopi", "susu", "buah", "sembako"
            ]
        },
        {
            name: "Transportasi",
            keywords: [
                "bensin", "solar", "parkir",
                "tol", "bus", "kereta", "taksi",
                "grab", "gojek", "transportasi"
            ]
        },
        {
            name: "Belanja",
            keywords: [
                "baju", "sepatu", "celana",
                "tas", "sabun", "belanja"
            ]
        },
        {
            name: "Tagihan",
            keywords: [
                "listrik", "air", "internet",
                "wifi", "pulsa", "tagihan"
            ]
        },
        {
            name: "Kesehatan",
            keywords: [
                "obat", "dokter", "rumah sakit",
                "vitamin", "kesehatan"
            ]
        },
        {
            name: "Pendidikan",
            keywords: [
                "sekolah", "kuliah", "buku",
                "kursus", "pendidikan"
            ]
        },
        {
            name: "Hiburan",
            keywords: [
                "nonton", "bioskop", "game",
                "liburan", "hiburan"
            ]
        },
        {
            name: "Gaji",
            keywords: [
                "gaji", "salary", "upah",
                "honor", "bonus"
            ]
        },
        {
            name: "Bisnis",
            keywords: [
                "jualan", "usaha", "bisnis",
                "modal", "dagangan"
            ]
        }
    ];

    for (const category of categories) {

        if (
            category.keywords.some((keyword) =>
                value.includes(keyword)
            )
        ) {
            return category.name;
        }
    }

    return "Lainnya";
}


function parseNaturalInput() {

    const text = elements.description.value.trim();

    if (!text) return;

    // Ambil angka terakhir yang kemungkinan merupakan nominal.
    const matches = text.match(
        /(?:rp\s*)?\d[\d.,]*/gi
    );

    if (!matches || matches.length === 0) return;

    const rawAmount = matches[matches.length - 1];

    const amount = Number(
        rawAmount.replace(/[^\d]/g, "")
    );

    if (!Number.isFinite(amount) || amount <= 0) return;

    elements.amount.value = amount;

    // Deteksi jenis pemasukan.
    const incomeKeywords = [
        "gaji", "menerima", "pemasukan",
        "bonus", "pendapatan", "dapat uang",
        "hasil jual", "transfer masuk"
    ];

    const lowerText = text.toLowerCase();

    if (
        incomeKeywords.some((keyword) =>
            lowerText.includes(keyword)
        )
    ) {
        elements.type.value = "income";
    } else {
        elements.type.value = "expense";
    }

    elements.category.value = detectCategory(text);

}


// =========================================
// 10. MODAL
// =========================================

function openTransactionModal() {

    elements.modal.classList.remove("hidden");

    elements.date.value = getToday();

    setTimeout(() => {
        elements.description.focus();
    }, 100);

}


function closeTransactionModal() {

    elements.modal.classList.add("hidden");

}


// =========================================
// 11. THEME
// =========================================

function loadTheme() {

    const savedTheme = localStorage.getItem(THEME_KEY);

    const theme = savedTheme || "light";

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

}


function toggleTheme() {

    const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        newTheme
    );

    localStorage.setItem(THEME_KEY, newTheme);

}


// =========================================
// 12. NAVIGATION
// =========================================

function navigateTo(page) {

    if (!pageNames[page]) return;

    document.querySelectorAll(".nav-link").forEach((link) => {

        link.classList.toggle(
            "active",
            link.dataset.page === page
        );

    });

    if (page === "dashboard") {

        elements.dashboardPage.classList.remove("hidden");

        elements.otherPage.classList.add("hidden");

        elements.pageTitle.textContent = "Dashboard";

        elements.pageSubtitle.textContent =
            "Selamat datang di pengelolaan keuangan Anda.";

    } else {

        elements.dashboardPage.classList.add("hidden");

        elements.otherPage.classList.remove("hidden");

        elements.otherPageTitle.textContent = pageNames[page];

        elements.pageTitle.textContent = pageNames[page];

        elements.pageSubtitle.textContent =
            "Kelola keuangan Anda dengan lebih mudah.";

    }

    closeSidebar();

}


// =========================================
// 13. MOBILE SIDEBAR
// =========================================

function openSidebar() {
    elements.sidebar.classList.add("open");
}


function closeSidebar() {
    elements.sidebar.classList.remove("open");
}


// =========================================
// 14. EVENT LISTENERS
// =========================================

// Tambah transaksi.
elements.addButton.addEventListener(
    "click",
    openTransactionModal
);


// Tutup modal.
elements.closeModal.addEventListener(
    "click",
    closeTransactionModal
);


// Klik luar modal.
elements.modal.addEventListener("click", (event) => {

    if (event.target === elements.modal) {
        closeTransactionModal();
    }

});


// Simpan transaksi.
elements.form.addEventListener(
    "submit",
    addTransaction
);


// Baca kalimat transaksi.
elements.description.addEventListener(
    "input",
    parseNaturalInput
);


// Ganti tema.
elements.themeToggle.addEventListener(
    "click",
    toggleTheme
);


// Menu HP.
elements.menuToggle.addEventListener(
    "click",
    openSidebar
);


// Klik navigasi.
document.querySelectorAll("[data-page]").forEach((element) => {

    element.addEventListener("click", (event) => {

        event.preventDefault();

        navigateTo(element.dataset.page);

    });

});


// Hapus transaksi.
elements.transactionList.addEventListener("click", (event) => {

    const button = event.target.closest(
        ".delete-transaction"
    );

    if (!button) return;

    deleteTransaction(button.dataset.id);

});


// Tutup modal dengan tombol Escape.
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeTransactionModal();
        closeSidebar();
    }

});


// =========================================
// 15. INITIALIZE APPLICATION
// =========================================

function initializeApp() {

    loadTheme();

    elements.date.value = getToday();

    updateDashboard();

    console.log(
        "fin.management berhasil dijalankan."
    );

}


initializeApp();
