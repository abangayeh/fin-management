"use strict";

// ==========================================
// FIN. MANAGEMENT KHAYALAN GRUP
// APP.JS — BAGIAN 1/7
// KONFIGURASI, BAHASA, DAN FUNGSI DASAR
// ==========================================

// PENGAMAN LOGIN
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

// ==========================================
// ELEMEN HTML DAN KOMPATIBILITAS ID
// ==========================================

const selectorAliases = {
  "#donutTotal": ["#categoryTotal"],
  "#categoryDonut": ["#categoryChart"],
  "#searchTransactions": ["#transactionSearch"],
  "#quickHints": [".quick-hint-container"],
  ".filter": [".filter-button"],
};

const $ = selector => {
  const element = document.querySelector(selector);
  if (element) return element;

  const alternatives = selectorAliases[selector] || [];

  for (const alternative of alternatives) {
    const found = document.querySelector(alternative);
    if (found) return found;
  }

  return null;
};

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function setHTML(selector, value) {
  const element = $(selector);
  if (element) element.innerHTML = value;
}

// ==========================================
// KONFIGURASI APLIKASI
// ==========================================

const THEME_KEY = "finmanagement_theme_v1";
const CYCLE_KEY = "finmanagement_cycle_day_v1";
const LANGUAGE_KEY = "finmanagement_language_v1";

let theme = localStorage.getItem(THEME_KEY) || "dark";
let cycleDay = Number(localStorage.getItem(CYCLE_KEY) || 1);
let periodOffset = 0;
let activeFilter = "all";
let activeCommentTransaction = null;

let currentLanguage =
  localStorage.getItem(LANGUAGE_KEY) || "id";

// ==========================================
// DAFTAR 20 BAHASA
// ==========================================

const FIN_LANGUAGES = {
  id: "Bahasa Indonesia",
  en: "English",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ar: "العربية",
  ms: "Bahasa Melayu",
  th: "ภาษาไทย",
  vi: "Tiếng Việt",
  fil: "Filipino",
  hi: "हिन्दी",
  bn: "বাংলা",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  ru: "Русский",
  tr: "Türkçe",
  nl: "Nederlands"
};

// ==========================================
// WARNA GRAFIK
// ==========================================

const colors = [
  "#9257ed",
  "#f04468",
  "#4388f5",
  "#f4a21b",
  "#e84c9c",
  "#18b6c9",
  "#13bd91",
  "#8b9bad"
];

// ==========================================
// KATEGORI TRANSAKSI
// ==========================================

const categories = [
  ["Makanan", [
    "makan", "beras", "nasi", "sayur", "ayam",
    "ikan", "telur", "roti", "kopi", "susu",
    "buah", "sembako", "food", "restaurant",
    "lunch", "dinner", "breakfast", "食事",
    "弁当", "ご飯", "食品"
  ]],

  ["Transportasi", [
    "bensin", "solar", "parkir", "tol", "bus",
    "kereta", "taksi", "grab", "gojek",
    "transport", "gasoline", "train", "交通費",
    "電車", "ガソリン", "バス"
  ]],

  ["Belanja", [
    "belanja", "baju", "sepatu", "celana",
    "tas", "sabun", "minimarket", "shopping",
    "clothes", "買い物", "服"
  ]],

  ["Tempat Tinggal", [
    "kos", "kontrakan", "sewa", "rumah",
    "properti", "rent", "housing", "家賃"
  ]],

  ["Tagihan", [
    "listrik", "air", "internet", "wifi",
    "pulsa", "tagihan", "bill", "electricity",
    "電気", "水道", "通信費"
  ]],

  ["Kesehatan", [
    "obat", "dokter", "vitamin", "rumah sakit",
    "kesehatan", "medicine", "hospital",
    "病院", "薬"
  ]],

  ["Pendidikan", [
    "sekolah", "kuliah", "buku", "kursus",
    "education", "school", "学校", "授業料"
  ]],

  ["Hiburan", [
    "nonton", "bioskop", "game", "liburan",
    "hiburan", "entertainment", "movie",
    "映画", "旅行"
  ]],

  ["Gaji", [
    "gaji", "salary", "upah", "honor",
    "paycheck", "給料", "給与"
  ]],

  ["Usaha", [
    "jualan", "usaha", "bisnis", "freelance",
    "dagangan", "proyek", "business", "売上"
  ]],

  ["Lainnya", []]
];

// ==========================================
// KAMUS TERJEMAHAN UTAMA
// ==========================================

const FIN_TRANSLATIONS = {
  id: {
    income: "Pemasukan",
    expense: "Pengeluaran",
    balance: "Saldo",
    food: "Makanan",
    transport: "Transportasi",
    shopping: "Belanja",
    housing: "Tempat Tinggal",
    bills: "Tagihan",
    health: "Kesehatan",
    education: "Pendidikan",
    entertainment: "Hiburan",
    salary: "Gaji",
    business: "Usaha",
    other: "Lainnya",
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    search: "Cari transaksi",
    comments: "Komentar Transaksi",
    send: "Kirim Komentar",
    loading: "Memuat...",
    noComments: "Belum ada komentar.",
    addSuccess: "Transaksi berhasil disimpan",
    deleteSuccess: "Transaksi berhasil dihapus",
    saveError: "Gagal menyimpan transaksi",
    deleteError: "Gagal menghapus transaksi",
    now: "Sekarang",
    period: "Periode",
    all: "Semua",
    monthlyReport: "Laporan Bulanan",
    quickEntry: "Catat transaksi cepat"
  },

  en: {
    income: "Income",
    expense: "Expense",
    balance: "Balance",
    food: "Food",
    transport: "Transportation",
    shopping: "Shopping",
    housing: "Housing",
    bills: "Bills",
    health: "Health",
    education: "Education",
    entertainment: "Entertainment",
    salary: "Salary",
    business: "Business",
    other: "Other",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    search: "Search transactions",
    comments: "Transaction Comments",
    send: "Send Comment",
    loading: "Loading...",
    noComments: "No comments yet.",
    addSuccess: "Transaction saved successfully",
    deleteSuccess: "Transaction deleted successfully",
    saveError: "Failed to save transaction",
    deleteError: "Failed to delete transaction",
    now: "Current",
    period: "Period",
    all: "All",
    monthlyReport: "Monthly Report",
    quickEntry: "Quick transaction entry"
  },

  ja: {
    income: "収入",
    expense: "支出",
    balance: "残高",
    food: "食費",
    transport: "交通費",
    shopping: "買い物",
    housing: "住居費",
    bills: "請求",
    health: "健康",
    education: "教育",
    entertainment: "娯楽",
    salary: "給与",
    business: "事業",
    other: "その他",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    search: "取引を検索",
    comments: "取引コメント",
    send: "コメントを送信",
    loading: "読み込み中...",
    noComments: "コメントはありません。",
    addSuccess: "取引を保存しました",
    deleteSuccess: "取引を削除しました",
    saveError: "取引の保存に失敗しました",
    deleteError: "取引の削除に失敗しました",
    now: "現在",
    period: "期間",
    all: "すべて",
    monthlyReport: "月次レポート",
    quickEntry: "クイック入力"
  }
};

// ==========================================
// BAGIAN 2/7 — TERJEMAHAN 20 BAHASA
// ==========================================

const EXTRA_TRANSLATIONS = {
  zh: {
    income:"收入", expense:"支出", balance:"余额",
    categories:"类别", save:"保存", cancel:"取消",
    delete:"删除", search:"搜索交易", comments:"评论",
    send:"发送", loading:"加载中...", noComments:"暂无评论",
    addSuccess:"交易添加成功", deleteSuccess:"交易已删除",
    saveError:"保存失败", deleteError:"删除失败",
    now:"现在", period:"期间", all:"全部",
    monthlyReport:"月度报告", quickEntry:"快速输入"
  },
  ko: {
    income:"수입", expense:"지출", balance:"잔액",
    categories:"카테고리", save:"저장", cancel:"취소",
    delete:"삭제", search:"거래 검색", comments:"댓글",
    send:"보내기", loading:"불러오는 중...", noComments:"댓글이 없습니다",
    addSuccess:"거래가 추가되었습니다", deleteSuccess:"거래가 삭제되었습니다",
    saveError:"저장 실패", deleteError:"삭제 실패",
    now:"지금", period:"기간", all:"전체",
    monthlyReport:"월간 보고서", quickEntry:"빠른 입력"
  },
  ar: {
    income:"الدخل", expense:"المصروفات", balance:"الرصيد",
    categories:"الفئات", save:"حفظ", cancel:"إلغاء",
    delete:"حذف", search:"بحث عن المعاملات", comments:"التعليقات",
    send:"إرسال", loading:"جار التحميل...", noComments:"لا توجد تعليقات",
    addSuccess:"تمت إضافة المعاملة", deleteSuccess:"تم حذف المعاملة",
    saveError:"فشل الحفظ", deleteError:"فشل الحذف",
    now:"الآن", period:"الفترة", all:"الكل",
    monthlyReport:"التقرير الشهري", quickEntry:"إدخال سريع"
  },
  ms: {
    income:"Pendapatan", expense:"Perbelanjaan", balance:"Baki",
    categories:"Kategori", save:"Simpan", cancel:"Batal",
    delete:"Padam", search:"Cari transaksi", comments:"Komen",
    send:"Hantar", loading:"Memuatkan...", noComments:"Tiada komen",
    addSuccess:"Transaksi berjaya ditambah", deleteSuccess:"Transaksi dipadam",
    saveError:"Gagal menyimpan", deleteError:"Gagal memadam",
    now:"Sekarang", period:"Tempoh", all:"Semua",
    monthlyReport:"Laporan bulanan", quickEntry:"Input pantas"
  },
  th: {
    income:"รายรับ", expense:"รายจ่าย", balance:"ยอดคงเหลือ",
    categories:"หมวดหมู่", save:"บันทึก", cancel:"ยกเลิก",
    delete:"ลบ", search:"ค้นหารายการ", comments:"ความคิดเห็น",
    send:"ส่ง", loading:"กำลังโหลด...", noComments:"ไม่มีความคิดเห็น",
    addSuccess:"เพิ่มรายการแล้ว", deleteSuccess:"ลบรายการแล้ว",
    saveError:"บันทึกไม่สำเร็จ", deleteError:"ลบไม่สำเร็จ",
    now:"ตอนนี้", period:"ช่วงเวลา", all:"ทั้งหมด",
    monthlyReport:"รายงานประจำเดือน", quickEntry:"บันทึกด่วน"
  },
  vi: {
    income:"Thu nhập", expense:"Chi tiêu", balance:"Số dư",
    categories:"Danh mục", save:"Lưu", cancel:"Hủy",
    delete:"Xóa", search:"Tìm giao dịch", comments:"Bình luận",
    send:"Gửi", loading:"Đang tải...", noComments:"Chưa có bình luận",
    addSuccess:"Đã thêm giao dịch", deleteSuccess:"Đã xóa giao dịch",
    saveError:"Lưu thất bại", deleteError:"Xóa thất bại",
    now:"Bây giờ", period:"Khoảng thời gian", all:"Tất cả",
    monthlyReport:"Báo cáo hàng tháng", quickEntry:"Nhập nhanh"
  },
  fil: {
    income:"Kita", expense:"Gastos", balance:"Balanse",
    categories:"Mga kategorya", save:"I-save", cancel:"Kanselahin",
    delete:"Tanggalin", search:"Maghanap ng transaksyon", comments:"Mga komento",
    send:"Ipadala", loading:"Naglo-load...", noComments:"Walang komento",
    addSuccess:"Naidagdag ang transaksyon", deleteSuccess:"Natanggal ang transaksyon",
    saveError:"Hindi na-save", deleteError:"Hindi natanggal",
    now:"Ngayon", period:"Panahon", all:"Lahat",
    monthlyReport:"Buwanang ulat", quickEntry:"Mabilis na input"
  },
  hi: {
    income:"आय", expense:"खर्च", balance:"शेष राशि",
    categories:"श्रेणियाँ", save:"सहेजें", cancel:"रद्द करें",
    delete:"हटाएँ", search:"लेन-देन खोजें", comments:"टिप्पणियाँ",
    send:"भेजें", loading:"लोड हो रहा है...", noComments:"कोई टिप्पणी नहीं",
    addSuccess:"लेन-देन जोड़ा गया", deleteSuccess:"लेन-देन हटाया गया",
    saveError:"सहेजना विफल", deleteError:"हटाना विफल",
    now:"अभी", period:"अवधि", all:"सभी",
    monthlyReport:"मासिक रिपोर्ट", quickEntry:"त्वरित प्रविष्टि"
  },
  bn: {
    income:"আয়", expense:"ব্যয়", balance:"ব্যালেন্স",
    categories:"বিভাগ", save:"সংরক্ষণ", cancel:"বাতিল",
    delete:"মুছুন", search:"লেনদেন খুঁজুন", comments:"মন্তব্য",
    send:"পাঠান", loading:"লোড হচ্ছে...", noComments:"কোনো মন্তব্য নেই",
    addSuccess:"লেনদেন যোগ হয়েছে", deleteSuccess:"লেনদেন মুছে ফেলা হয়েছে",
    saveError:"সংরক্ষণ ব্যর্থ", deleteError:"মুছে ফেলা ব্যর্থ",
    now:"এখন", period:"সময়কাল", all:"সব",
    monthlyReport:"মাসিক প্রতিবেদন", quickEntry:"দ্রুত ইনপুট"
  },
  de: {
    income:"Einnahmen", expense:"Ausgaben", balance:"Kontostand",
    categories:"Kategorien", save:"Speichern", cancel:"Abbrechen",
    delete:"Löschen", search:"Transaktionen suchen", comments:"Kommentare",
    send:"Senden", loading:"Wird geladen...", noComments:"Keine Kommentare",
    addSuccess:"Transaktion hinzugefügt", deleteSuccess:"Transaktion gelöscht",
    saveError:"Speichern fehlgeschlagen", deleteError:"Löschen fehlgeschlagen",
    now:"Jetzt", period:"Zeitraum", all:"Alle",
    monthlyReport:"Monatsbericht", quickEntry:"Schnelleingabe"
  },
  fr: {
    income:"Revenus", expense:"Dépenses", balance:"Solde",
    categories:"Catégories", save:"Enregistrer", cancel:"Annuler",
    delete:"Supprimer", search:"Rechercher une transaction", comments:"Commentaires",
    send:"Envoyer", loading:"Chargement...", noComments:"Aucun commentaire",
    addSuccess:"Transaction ajoutée", deleteSuccess:"Transaction supprimée",
    saveError:"Échec de l'enregistrement", deleteError:"Échec de la suppression",
    now:"Maintenant", period:"Période", all:"Tout",
    monthlyReport:"Rapport mensuel", quickEntry:"Saisie rapide"
  },
  es: {
    income:"Ingresos", expense:"Gastos", balance:"Saldo",
    categories:"Categorías", save:"Guardar", cancel:"Cancelar",
    delete:"Eliminar", search:"Buscar transacciones", comments:"Comentarios",
    send:"Enviar", loading:"Cargando...", noComments:"Sin comentarios",
    addSuccess:"Transacción añadida", deleteSuccess:"Transacción eliminada",
    saveError:"Error al guardar", deleteError:"Error al eliminar",
    now:"Ahora", period:"Período", all:"Todos",
    monthlyReport:"Informe mensual", quickEntry:"Entrada rápida"
  },
  pt: {
    income:"Receitas", expense:"Despesas", balance:"Saldo",
    categories:"Categorias", save:"Salvar", cancel:"Cancelar",
    delete:"Excluir", search:"Buscar transações", comments:"Comentários",
    send:"Enviar", loading:"Carregando...", noComments:"Sem comentários",
    addSuccess:"Transação adicionada", deleteSuccess:"Transação excluída",
    saveError:"Falha ao salvar", deleteError:"Falha ao excluir",
    now:"Agora", period:"Período", all:"Todos",
    monthlyReport:"Relatório mensal", quickEntry:"Entrada rápida"
  },
  it: {
    income:"Entrate", expense:"Uscite", balance:"Saldo",
    categories:"Categorie", save:"Salva", cancel:"Annulla",
    delete:"Elimina", search:"Cerca transazioni", comments:"Commenti",
    send:"Invia", loading:"Caricamento...", noComments:"Nessun commento",
    addSuccess:"Transazione aggiunta", deleteSuccess:"Transazione eliminata",
    saveError:"Salvataggio non riuscito", deleteError:"Eliminazione non riuscita",
    now:"Adesso", period:"Periodo", all:"Tutti",
    monthlyReport:"Rapporto mensile", quickEntry:"Inserimento rapido"
  },
  ru: {
    income:"Доходы", expense:"Расходы", balance:"Баланс",
    categories:"Категории", save:"Сохранить", cancel:"Отмена",
    delete:"Удалить", search:"Поиск операций", comments:"Комментарии",
    send:"Отправить", loading:"Загрузка...", noComments:"Нет комментариев",
    addSuccess:"Операция добавлена", deleteSuccess:"Операция удалена",
    saveError:"Ошибка сохранения", deleteError:"Ошибка удаления",
    now:"Сейчас", period:"Период", all:"Все",
    monthlyReport:"Месячный отчет", quickEntry:"Быстрый ввод"
  },
  tr: {
    income:"Gelir", expense:"Gider", balance:"Bakiye",
    categories:"Kategoriler", save:"Kaydet", cancel:"İptal",
    delete:"Sil", search:"İşlem ara", comments:"Yorumlar",
    send:"Gönder", loading:"Yükleniyor...", noComments:"Yorum yok",
    addSuccess:"İşlem eklendi", deleteSuccess:"İşlem silindi",
    saveError:"Kaydetme başarısız", deleteError:"Silme başarısız",
    now:"Şimdi", period:"Dönem", all:"Tümü",
    monthlyReport:"Aylık rapor", quickEntry:"Hızlı giriş"
  },
  nl: {
    income:"Inkomsten", expense:"Uitgaven", balance:"Saldo",
    categories:"Categorieën", save:"Opslaan", cancel:"Annuleren",
    delete:"Verwijderen", search:"Transacties zoeken", comments:"Reacties",
    send:"Verzenden", loading:"Laden...", noComments:"Geen reacties",
    addSuccess:"Transactie toegevoegd", deleteSuccess:"Transactie verwijderd",
    saveError:"Opslaan mislukt", deleteError:"Verwijderen mislukt",
    now:"Nu", period:"Periode", all:"Alles",
    monthlyReport:"Maandrapport", quickEntry:"Snelle invoer"
  }
};

Object.assign(FIN_TRANSLATIONS, EXTRA_TRANSLATIONS);

// Fungsi mengambil teks sesuai bahasa aktif.
// Kalau terjemahan belum tersedia, gunakan bahasa Indonesia.
function t(key) {
  const lang = localStorage.getItem(LANGUAGE_KEY) || "id";
  return FIN_TRANSLATIONS[lang]?.[key]
    || FIN_TRANSLATIONS.id?.[key]
    || key;
}

// Mengambil bahasa aktif.
function getCurrentLanguage() {
  const lang = localStorage.getItem(LANGUAGE_KEY) || "id";
  return FIN_LANGUAGES[lang] ? lang : "id";
}

// Menyimpan pilihan bahasa.
function saveLanguage(lang) {
  if (!FIN_LANGUAGES[lang]) return false;

  localStorage.setItem(LANGUAGE_KEY, lang);
  document.documentElement.lang = lang;
  return true;
}

// ==========================================
// BAGIAN 3/7 — PENGATURAN BAHASA & UTILITAS
// ==========================================

// Mengatur bahasa pada elemen HTML.
function applyLanguage() {
  const lang = getCurrentLanguage();

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.dataset.i18nTitle;
    el.title = t(key);
  });

  const selector = $("#languageSelect");
  if (selector) selector.value = lang;
}

// Menghubungkan pilihan bahasa.
function initializeLanguageSelector() {
  const selector = $("#languageSelect");
  if (!selector) return;

  selector.value = getCurrentLanguage();

  selector.addEventListener("change", () => {
    if (!saveLanguage(selector.value)) return;

    applyLanguage();

    if (typeof render === "function") {
      render();
    }

    toast(
      getCurrentLanguage() === "id"
        ? "Bahasa berhasil diubah."
        : "Language updated."
    );
  });
}

// Format nominal rupiah.
function rupiah(value) {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Format angka biasa.
function numberFormat(value) {
  return new Intl.NumberFormat(
    getCurrentLanguage()
  ).format(Number(value) || 0);
}

// Tanggal hari ini dalam format YYYY-MM-DD.
function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Format tanggal sesuai bahasa.
function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(
    getCurrentLanguage(),
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}

// Membersihkan teks agar aman dimasukkan ke HTML.
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Notifikasi sederhana.
function toast(message) {
  let box = $("#finToast");

  if (!box) {
    box = document.createElement("div");
    box.id = "finToast";
    box.setAttribute("role", "status");

    Object.assign(box.style, {
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "99999",
      padding: "12px 18px",
      borderRadius: "12px",
      background: "#222",
      color: "#fff",
      fontSize: "14px",
      maxWidth: "90%",
      textAlign: "center",
      boxShadow: "0 5px 20px rgba(0,0,0,.25)"
    });

    document.body.appendChild(box);
  }

  box.textContent = message;
  box.style.display = "block";

  clearTimeout(box._timer);

  box._timer = setTimeout(() => {
    box.style.display = "none";
  }, 2800);
}

// Membaca data JSON dari localStorage.
function readJSON(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Data JSON tidak valid:", key, error);
    return fallback;
  }
}

// Membaca pengaturan hari siklus laporan.
function getCycleDay() {
  const value = Number(localStorage.getItem(CYCLE_KEY) || 1);

  return Math.min(28, Math.max(1, value));
}

// Menentukan periode laporan.
function getPeriod(date = new Date()) {
  const cycleDay = getCycleDay();

  let year = date.getFullYear();
  let month = date.getMonth();

  if (date.getDate() < cycleDay) {
    month--;

    if (month < 0) {
      month = 11;
      year--;
    }
  }

  const start = new Date(year, month, cycleDay);
  const end = new Date(year, month + 1, cycleDay - 1);

  return { start, end };
}

// Memeriksa apakah transaksi masuk periode aktif.
function dateInPeriod(value, period = getPeriod()) {
  if (!value) return false;

  const date = new Date(value + "T00:00:00");

  if (Number.isNaN(date.getTime())) return false;

  return date >= period.start && date <= period.end;
}

// Judul periode laporan.
function periodLabel(period = getPeriod()) {
  const start = new Intl.DateTimeFormat(
    getCurrentLanguage(),
    { day: "numeric", month: "short" }
  ).format(period.start);

  const end = new Intl.DateTimeFormat(
    getCurrentLanguage(),
    { day: "numeric", month: "short", year: "numeric" }
  ).format(period.end);

  return `${start} – ${end}`;
}

// Mengubah input nominal seperti 35rb, 2jt, atau 50000.
function parseAmount(value) {
  if (typeof value === "number") {
    return {
      amount: Math.abs(value),
      type: value < 0 ? "expense" : "expense"
    };
  }

  let text = String(value || "")
    .toLowerCase()
    .replace(/\s/g, "")
    .replace(/rp\.?/g, "");

  const negative = text.startsWith("-");

  text = text.replace(/[^0-9.,a-z]/g, "");

  let multiplier = 1;

  if (/jt|juta/.test(text)) {
    multiplier = 1000000;
    text = text.replace(/juta|jt/g, "");
  } else if (/rb|ribu|k/.test(text)) {
    multiplier = 1000;
    text = text.replace(/ribu|rb|k/g, "");
  }

  text = text.replace(",", ".");

  const amount = Number(text) * multiplier;

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    amount: Math.round(amount),
    type: negative ? "expense" : "expense"
  };
}

// ==========================================
// BAGIAN 4/7 — DETEKSI TRANSAKSI & KATEGORI
// ==========================================

// Mendeteksi jenis transaksi dari kalimat.
function detectTransactionType(text) {
  const value = String(text || "").toLowerCase();

  const incomeWords = [
    "gaji", "bonus", "untung", "pemasukan",
    "income", "salary", "bonus", "profit",
    "pendapatan", "hasil jual", "uang masuk",
    "freelance", "refund", "dikembalikan"
  ];

  const expenseWords = [
    "beli", "bayar", "makan", "belanja",
    "pengeluaran", "expense", "spend",
    "purchase", "payment", "tagihan",
    "ongkir", "transport", "bensin",
    "sewa", "obat", "listrik"
  ];

  if (incomeWords.some(word => value.includes(word))) {
    return "income";
  }

  if (expenseWords.some(word => value.includes(word))) {
    return "expense";
  }

  return "expense";
}

// Mendeteksi kategori transaksi.
function detectCategory(text, type = "expense") {
  const value = String(text || "").toLowerCase();

  const rules = [
    {
      category: "Makanan",
      words: [
        "makan", "minum", "restoran", "restaurant",
        "food", "drink", "coffee", "kopi",
        "ランチ", "食事", "コーヒー"
      ]
    },
    {
      category: "Transportasi",
      words: [
        "bensin", "bbm", "transport", "ojek",
        "taxi", "grab", "gojek", "kereta",
        "bus", "toll", "parkir", "gasoline",
        "交通", "電車", "バス", "ガソリン"
      ]
    },
    {
      category: "Belanja",
      words: [
        "belanja", "baju", "sepatu", "shopping",
        "clothes", "shoes", "market", "supermarket",
        "買い物", "服", "靴"
      ]
    },
    {
      category: "Tempat Tinggal",
      words: [
        "sewa", "kontrakan", "kos", "rent",
        "housing", "apartment", "rumah",
        "家賃", "アパート"
      ]
    },
    {
      category: "Tagihan",
      words: [
        "listrik", "air", "internet", "wifi",
        "pulsa", "tagihan", "bill", "electricity",
        "電気", "水道", "請求"
      ]
    },
    {
      category: "Kesehatan",
      words: [
        "dokter", "rumah sakit", "obat",
        "health", "hospital", "medicine",
        "薬", "病院"
      ]
    },
    {
      category: "Pendidikan",
      words: [
        "sekolah", "kuliah", "buku", "kursus",
        "education", "school", "university",
        "学校", "大学"
      ]
    },
    {
      category: "Hiburan",
      words: [
        "bioskop", "game", "liburan",
        "entertainment", "movie", "cinema",
        "映画", "ゲーム"
      ]
    },
    {
      category: "Gaji",
      words: [
        "gaji", "salary", "wage", "payroll",
        "給料", "給与"
      ]
    },
    {
      category: "Usaha",
      words: [
        "usaha", "bisnis", "jualan",
        "business", "sales", "revenue",
        "事業", "売上"
      ]
    }
  ];

  for (const rule of rules) {
    if (rule.words.some(word => value.includes(word))) {
      return rule.category;
    }
  }

  return type === "income" ? "Gaji" : "Lainnya";
}

// Membaca teks transaksi yang diketik pengguna.
function parseQuickTransaction(text) {
  const value = String(text || "").trim();

  if (!value) return null;

  const parsed = parseAmount(value);

  if (!parsed) return null;

  const type = detectTransactionType(value);
  const category = detectCategory(value, type);

  // Hilangkan nominal dari deskripsi.
  const description = value
    .replace(/rp\.?\s*/gi, "")
    .replace(/-?\d[\d.,]*\s*(?:juta|jt|ribu|rb|k)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    description: description || (
      type === "income" ? "Pemasukan" : "Pengeluaran"
    ),
    amount: parsed.amount,
    type,
    category,
    date: todayISO(),
    note: ""
  };
}

// Membuat pilihan bahasa jika elemen belum tersedia.
function createLanguageSelector() {
  let selector = $("#languageSelect");

  if (selector) {
    selector.value = getCurrentLanguage();
    return selector;
  }

  const host =
    $("#settings") ||
    $("#settingsPanel") ||
    $("#profileButton")?.parentElement ||
    $(".topbar") ||
    $("header");

  if (!host) return null;

  const wrapper = document.createElement("label");

  wrapper.id = "languageControl";
  wrapper.style.display = "inline-flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "8px";
  wrapper.style.margin = "8px 0";

  const label = document.createElement("span");
  label.textContent = "🌐";

  selector = document.createElement("select");
  selector.id = "languageSelect";
  selector.setAttribute("aria-label", "Pilih bahasa");

  Object.entries(FIN_LANGUAGES).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    selector.appendChild(option);
  });

  selector.value = getCurrentLanguage();

  wrapper.append(label, selector);
  host.appendChild(wrapper);

  selector.addEventListener("change", () => {
    saveLanguage(selector.value);
    applyLanguage();

    if (typeof render === "function") {
      render();
    }

    toast("Bahasa berhasil diubah.");
  });

  return selector;
}

// Menjalankan pengaturan bahasa.
function initializeMultilingual() {
  createLanguageSelector();
  applyLanguage();
}

// Fungsi untuk mengambil teks kategori sesuai bahasa.
function categoryLabel(category) {
  const translations = {
    "Makanan": {
      en: "Food", ja: "食事", zh: "餐饮", ko: "식비",
      ms: "Makanan", th: "อาหาร", vi: "Ăn uống",
      fil: "Pagkain", hi: "भोजन", bn: "খাবার",
      de: "Essen", fr: "Alimentation", es: "Comida",
      pt: "Alimentação", it: "Cibo", ru: "Еда",
      tr: "Yemek", nl: "Eten", ar: "الطعام"
    },
    "Transportasi": {
      en: "Transport", ja: "交通", zh: "交通",
      ko: "교통", ms: "Pengangkutan", th: "การเดินทาง",
      vi: "Di chuyển", fil: "Transportasyon",
      hi: "परिवहन", bn: "পরিবহন", de: "Transport",
      fr: "Transport", es: "Transporte", pt: "Transporte",
      it: "Trasporti", ru: "Транспорт", tr: "Ulaşım",
      nl: "Vervoer", ar: "المواصلات"
    },
    "Belanja": {
      en: "Shopping", ja: "買い物", zh: "购物",
      ko: "쇼핑", ms: "Membeli-belah", th: "ช้อปปิ้ง",
      vi: "Mua sắm", fil: "Pamimili", hi: "खरीदारी",
      bn: "কেনাকাটা", de: "Einkaufen", fr: "Achats",
      es: "Compras", pt: "Compras", it: "Acquisti",
      ru: "Покупки", tr: "Alışveriş", nl: "Winkelen",
      ar: "التسوق"
    }
  };

  const lang = getCurrentLanguage();

  return translations[category]?.[lang] || category;
}

// ==========================================
// BAGIAN 5/7 — TRANSAKSI & RINGKASAN KEUANGAN
// ==========================================

// Data transaksi aplikasi.
let transactions = [];
let transactionFilter = "all";
let transactionSearch = "";

// Periode yang sedang ditampilkan.
let currentPeriod = new Date();

// Mengambil transaksi dari database.
async function loadTransactions() {
  try {
    transactions = await window.FinDB.getTransactions();

    if (!Array.isArray(transactions)) {
      transactions = [];
    }

    return transactions;
  } catch (error) {
    console.error("Gagal memuat transaksi:", error);
    toast("Gagal memuat transaksi.");
    return [];
  }
}

// Menambahkan transaksi dari input cepat.
async function addQuick(text) {
  const item = parseQuickTransaction(text);

  if (!item) {
    toast("Masukkan keterangan dan nominal transaksi.");
    return false;
  }

  try {
    await window.FinDB.addTransaction(item);
    await loadTransactions();

    if (typeof render === "function") {
      render();
    }

    toast(t("addSuccess"));
    return true;
  } catch (error) {
    console.error("Gagal menambahkan transaksi:", error);
    toast(t("saveError"));
    return false;
  }
}

// Mengambil transaksi dalam periode tertentu.
function getPeriodTransactions() {
  const period = getPeriod(currentPeriod);

  return transactions.filter(item =>
    dateInPeriod(item.date, period)
  );
}

// Menghitung total pemasukan dan pengeluaran.
function calculateSummary(items = getPeriodTransactions()) {
  const income = items
    .filter(item => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const expense = items
    .filter(item => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

// Memperbarui angka ringkasan dashboard.
function renderSummary() {
  const summary = calculateSummary();

  const incomeElement = $("[data-summary-income]") || $("#totalIncome");
  const expenseElement = $("[data-summary-expense]") || $("#totalExpense");
  const balanceElement = $("[data-summary-balance]") || $("#totalBalance");

  if (incomeElement) incomeElement.textContent = rupiah(summary.income);
  if (expenseElement) expenseElement.textContent = rupiah(summary.expense);
  if (balanceElement) balanceElement.textContent = rupiah(summary.balance);

  const periodTitle = $("#periodTitle");
  const periodRange = $("#periodRange");

  if (periodTitle) {
    periodTitle.textContent = t("monthlyReport");
  }

  if (periodRange) {
    periodRange.textContent = periodLabel(getPeriod(currentPeriod));
  }

  return summary;
}

// Menghitung total berdasarkan kategori.
function calculateCategoryTotals(items = getPeriodTransactions()) {
  const totals = {};

  items
    .filter(item => item.type === "expense")
    .forEach(item => {
      const category = item.category || "Lainnya";

      totals[category] =
        (totals[category] || 0) + Number(item.amount || 0);
    });

  return totals;
}

// Membuat data transaksi yang sudah difilter.
function getFilteredTransactions() {
  let result = [...transactions];

  const period = getPeriod(currentPeriod);

  result = result.filter(item => dateInPeriod(item.date, period));

  if (transactionFilter !== "all") {
    result = result.filter(item => item.type === transactionFilter);
  }

  if (transactionSearch) {
    const keyword = transactionSearch.toLowerCase();

    result = result.filter(item => {
      const text = [
        item.description,
        item.category,
        item.note,
        item.amount
      ].join(" ").toLowerCase();

      return text.includes(keyword);
    });
  }

  return result.sort((a, b) =>
    String(b.date || "").localeCompare(String(a.date || ""))
  );
}

// Menghapus transaksi.
async function deleteTransaction(id) {
  if (!id) return false;

  const confirmed = window.confirm(
    getCurrentLanguage() === "id"
      ? "Yakin ingin menghapus transaksi ini?"
      : "Are you sure you want to delete this transaction?"
  );

  if (!confirmed) return false;

  try {
    await window.FinDB.deleteTransaction(id);
    await loadTransactions();

    if (typeof render === "function") {
      render();
    }

    toast(t("deleteSuccess"));
    return true;
  } catch (error) {
    console.error("Gagal menghapus transaksi:", error);
    toast(t("deleteError"));
    return false;
  }
}

// Memilih periode sebelumnya.
function previousPeriod() {
  currentPeriod = new Date(
    currentPeriod.getFullYear(),
    currentPeriod.getMonth() - 1,
    1
  );

  if (typeof render === "function") render();
}

// Memilih periode berikutnya.
function nextPeriod() {
  currentPeriod = new Date(
    currentPeriod.getFullYear(),
    currentPeriod.getMonth() + 1,
    1
  );

  if (typeof render === "function") render();
}

// Kembali ke periode saat ini.
function goToCurrentPeriod() {
  currentPeriod = new Date();

  if (typeof render === "function") render();
}

// ==========================================
// BAGIAN 6/7 — GRAFIK & TAMPILAN DASHBOARD
// ==========================================

// Warna kategori.
const CATEGORY_COLORS = [
  "#8b5cf6", "#06b6d4", "#f59e0b",
  "#10b981", "#ef4444", "#ec4899",
  "#6366f1", "#84cc16", "#f97316"
];

// Grafik donat kategori pengeluaran.
function renderDonut() {
  const canvas = $("#categoryDonut") || $("#categoryChart");
  const totalElement = $("#donutTotal") || $("#categoryTotal");

  if (!canvas) return;

  const totals = calculateCategoryTotals();
  const entries = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  const total = entries.reduce((sum, item) => sum + item[1], 0);

  if (totalElement) totalElement.textContent = rupiah(total);

  if (canvas.tagName === "CANVAS") {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.42;

    ctx.clearRect(0, 0, width, height);

    if (!total) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "#888888";
      ctx.lineWidth = 24;
      ctx.stroke();
      return;
    }

    let angle = -Math.PI / 2;

    entries.forEach(([category, amount], index) => {
      const slice = (amount / total) * Math.PI * 2;

      ctx.beginPath();
      ctx.arc(
        centerX, centerY, radius,
        angle, angle + slice
      );

      ctx.strokeStyle =
        CATEGORY_COLORS[index % CATEGORY_COLORS.length];

      ctx.lineWidth = 24;
      ctx.stroke();

      angle += slice;
    });

    return;
  }

  if (total === 0) {
    canvas.style.background = "conic-gradient(#888888 0deg 360deg)";
  } else {
    let angle = 0;

    const gradients = entries.map(([category, amount], index) => {
      const start = angle;
      angle += (amount / total) * 360;

      return `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]} ${start}deg ${angle}deg`;
    });

    canvas.style.background =
      `conic-gradient(${gradients.join(",")})`;
  }

  const legend = $("#categoryLegend");

  if (legend) {
    legend.innerHTML = entries.map(([category, amount], index) => {
      const percent = total ? Math.round(amount / total * 100) : 0;

      return `
        <div class="category-legend-item">
          <span class="category-dot"
            style="background:${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}">
          </span>
          <span>${esc(categoryLabel(category))}</span>
          <strong>${percent}%</strong>
          <small>${rupiah(amount)}</small>
        </div>
      `;
    }).join("") || `<p>${esc(t("noComments"))}</p>`;
  }
}

// Grafik tren enam bulan.
function renderTrend() {
  const container = $("#trendChart");
  if (!container) return;

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      currentPeriod.getFullYear(),
      currentPeriod.getMonth() - i,
      1
    );

    const year = date.getFullYear();
    const month = date.getMonth();

    const items = transactions.filter(item => {
      const d = new Date(item.date + "T00:00:00");

      return d.getFullYear() === year &&
        d.getMonth() === month;
    });

    const summary = calculateSummary(items);

    months.push({
      label: new Intl.DateTimeFormat(
        getCurrentLanguage(),
        { month: "short" }
      ).format(date),
      income: summary.income,
      expense: summary.expense
    });
  }

  const maximum = Math.max(
    1,
    ...months.map(item => Math.max(item.income, item.expense))
  );

  container.innerHTML = months.map(item => {
    const incomeHeight = item.income / maximum * 100;
    const expenseHeight = item.expense / maximum * 100;

    return `
      <div class="trend-month">
        <div class="trend-bars">
          <div class="trend-bar income"
            style="height:${incomeHeight}%"
            title="${esc(t("income"))}: ${rupiah(item.income)}">
          </div>
          <div class="trend-bar expense"
            style="height:${expenseHeight}%"
            title="${esc(t("expense"))}: ${rupiah(item.expense)}">
          </div>
        </div>
        <span>${esc(item.label)}</span>
      </div>
    `;
  }).join("");
}

// Daftar transaksi.
function renderHistory() {
  const container = $("#transactionList");
  if (!container) return;

  const items = getFilteredTransactions();

  if (!items.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div>📭</div>
        <p>${getCurrentLanguage() === "id"
          ? "Belum ada transaksi pada periode ini."
          : "No transactions in this period."}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const income = item.type === "income";

    return `
      <article class="transaction-item">
        <div class="transaction-icon">
          ${income ? "💰" : "💸"}
        </div>

        <div class="transaction-info">
          <strong>${esc(item.description || "Transaksi")}</strong>
          <span>
            ${esc(categoryLabel(item.category || "Lainnya"))}
            · ${esc(formatDate(item.date))}
          </span>
          ${item.note ? `<small>${esc(item.note)}</small>` : ""}
        </div>

        <div class="transaction-amount ${income ? "income" : "expense"}">
          ${income ? "+" : "-"}${rupiah(item.amount)}
        </div>

        <div class="transaction-actions">
          <button type="button"
            data-comment="${esc(item.id)}"
            aria-label="Komentar">💬</button>

          <button type="button"
            data-delete="${esc(item.id)}"
            aria-label="${esc(t("delete"))}">🗑️</button>
        </div>
      </article>
    `;
  }).join("");
}

// Render semua bagian dashboard.
function render() {
  renderSummary();
  renderDonut();
  renderTrend();
  renderHistory();

  const categoryPeriod = $("#categoryPeriod");

  if (categoryPeriod) {
    categoryPeriod.textContent = periodLabel(getPeriod(currentPeriod));
  }
}

// ==========================================
// BAGIAN 7/7 — EVENT & INISIALISASI APLIKASI
// ==========================================

// Event listener aman: tidak error jika elemen tidak ditemukan.
function on(selector, event, callback) {
  const element = $(selector);
  if (!element) return;

  element.addEventListener(event, callback);
}

// Event listener untuk banyak elemen.
function onAll(selector, event, callback) {
  document.querySelectorAll(selector).forEach(element => {
    element.addEventListener(event, callback);
  });
}

// Mengatur tema.
function setTheme(selectedTheme) {
  const selected = selectedTheme ||
    localStorage.getItem(THEME_KEY) ||
    "dark";

  theme = selected;
  document.documentElement.dataset.theme = selected;
  localStorage.setItem(THEME_KEY, selected);

  const button = $("#themeToggle");

  if (button) {
    button.textContent = selected === "dark" ? "☀️" : "🌙";
  }
}

// Memuat aktivitas transaksi.
async function loadTransactionActivity() {
  try {
    if (!window.FinDB.getTransactionLogs) return;

    const logs = await window.FinDB.getTransactionLogs();
    const container = $("#activityList");
    const empty = $("#activityEmpty");

    if (!container) return;

    if (!Array.isArray(logs) || logs.length === 0) {
      container.innerHTML = "";
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    container.innerHTML = logs.map(log => `
      <div class="activity-item">
        <span>📝</span>
        <div>
          <strong>${esc(log.action || "Aktivitas")}</strong>
          <small>${esc(log.created_at || "")}</small>
        </div>
      </div>
    `).join("");

  } catch (error) {
    console.warn("Aktivitas belum dapat dimuat:", error);
  }
}

// Membuka dialog komentar transaksi.
async function openTransactionComments(id) {
  try {
    const comments = await window.FinDB.getTransactionComments(id);

    let dialog = $("#commentDialog");

    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "commentDialog";

      dialog.innerHTML = `
        <form method="dialog">
          <h3>Komentar transaksi</h3>
          <div id="commentItems"></div>
          <textarea id="commentInput"
            placeholder="Tulis komentar..."
            required></textarea>
          <button type="button" id="sendComment">Kirim</button>
          <button type="submit">Tutup</button>
        </form>
      `;

      document.body.appendChild(dialog);
    }

    const list = $("#commentItems");

    if (list) {
      list.innerHTML = (comments || []).map(comment => `
        <p>${esc(comment.comment || comment.content || "")}</p>
      `).join("") || "<p>Belum ada komentar.</p>";
    }

    const sendButton = $("#sendComment");

    if (sendButton) {
      sendButton.onclick = async () => {
        const input = $("#commentInput");
        const value = input?.value.trim();

        if (!value) return;

        try {
          await window.FinDB.addTransactionComment(id, value);

          if (input) input.value = "";

          await openTransactionComments(id);
          toast("Komentar berhasil dikirim.");
        } catch (error) {
          console.error(error);
          toast("Komentar gagal dikirim.");
        }
      };
    }

    if (!dialog.open) dialog.showModal();

  } catch (error) {
    console.error("Gagal membuka komentar:", error);
    toast("Komentar tidak dapat dimuat.");
  }
}

// Input transaksi cepat.
on("#quickForm", "submit", async event => {
  event.preventDefault();

  const input = $("#quickInput");
  if (!input) return;

  const success = await addQuick(input.value);

  if (success) input.value = "";
});

// Pencarian transaksi.
const searchInput = $("#searchTransactions") ||
  $("#transactionSearch");

if (searchInput) {
  searchInput.addEventListener("input", event => {
    transactionSearch = event.target.value.trim().toLowerCase();
    renderHistory();
  });
}

// Filter pemasukan dan pengeluaran.
onAll(".filter, .filter-button", "click", event => {
  const button = event.currentTarget;

  transactionFilter =
    button.dataset.filter ||
    button.dataset.type ||
    "all";


  document.querySelectorAll(".filter, .filter-button")
    .forEach(item => item.classList.remove("active"));

  button.classList.add("active");

  renderHistory();
});

// Tombol contoh input cepat.
onAll("[data-example]", "click", event => {
  const input = $("#quickInput");
  if (!input) return;

  input.value = event.currentTarget.dataset.example || "";
  input.focus();
});

// Tema.
on("#themeToggle", "click", () => {
  const current =
    document.documentElement.dataset.theme || "dark";

  setTheme(current === "dark" ? "light" : "dark");
});

// Navigasi periode.
on("#previousPeriod", "click", previousPeriod);
on("#prevPeriod", "click", previousPeriod);

on("#nextPeriod", "click", nextPeriod);
on("#nextPeriodButton", "click", nextPeriod);

on("#currentPeriod", "click", goToCurrentPeriod);

// Hapus transaksi dan buka komentar.
on("#transactionList", "click", async event => {
  const deleteButton = event.target.closest("[data-delete]");
  const commentButton = event.target.closest("[data-comment]");

  if (deleteButton) {
    await deleteTransaction(deleteButton.dataset.delete);
  }

  if (commentButton) {
    await openTransactionComments(commentButton.dataset.comment);
  }
});

// Pengaturan siklus laporan.
on("#cycleButton", "click", () => {
  const dialog = $("#cycleDialog");
  const input = $("#cycleDay");

  if (!dialog) return;

  if (input) input.value = String(getCycleDay());

  dialog.showModal();
});

on("#saveCycle", "click", () => {
  const input = $("#cycleDay");
  if (!input) return;

  const value = Math.min(28, Math.max(1, Number(input.value) || 1));

  localStorage.setItem(CYCLE_KEY, String(value));

  const dialog = $("#cycleDialog");
  if (dialog) dialog.close();

  render();
  toast("Periode laporan berhasil diperbarui.");
});

// Ekspor CSV.
on("#exportButton", "click", () => {
  const items = getFilteredTransactions();

  if (!items.length) {
    toast("Tidak ada transaksi untuk diekspor.");
    return;
  }

  const headers = [
    "Tanggal", "Deskripsi", "Jenis",
    "Kategori", "Nominal", "Catatan"
  ];

  const rows = items.map(item => [
    item.date,
    item.description,
    item.type,
    item.category,
    item.amount,
    item.note || ""
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value =>
      `"${String(value ?? "").replace(/"/g, '""')}"`
    ).join(","))
    .join("\n");

  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "laporan-keuangan.csv";
  link.click();

  URL.revokeObjectURL(url);
});

// Profil.
on("#profileButton", "click", () => {
  const panel = $("#profilePanel");

  if (panel) {
    panel.hidden = !panel.hidden;
  }
});

// Logout.
on("#logoutButton", "click", async () => {
  const confirmed = confirm("Yakin ingin keluar?");

  if (!confirmed) return;

  try {
    await window.FinAuth.logout();
  } catch (error) {
    console.error("Logout gagal:", error);
  }

  window.location.replace("login.html");
});

// Inisialisasi dashboard.
async function initializeDashboard() {
  try {
    if (!window.FinDB || !window.FinAuth) {
      throw new Error("Modul autentikasi atau database tidak ditemukan.");
    }

    await window.FinDB.initialize();

    initializeMultilingual();

    setTheme();

    await loadTransactions();
    await loadTransactionActivity();

    const user = window.FinDB.getCurrentUser?.();

    const greeting = $("#userGreeting");

    if (greeting && user) {
      greeting.textContent =
        user.user_metadata?.full_name ||
        user.email ||
        "Pengguna";
    }

    render();

  } catch (error) {
    console.error("Inisialisasi dashboard gagal:", error);
    toast("Dashboard gagal dimuat. Periksa koneksi dan database.");
  }
}

// Periksa login sebelum membuka dashboard.
if (window.FinAuth) {
  document.documentElement.style.visibility = "hidden";

  checkDashboardAccess().then(authorized => {
    if (!authorized) return;

    document.documentElement.style.visibility = "visible";
    initializeDashboard();
  });
}
