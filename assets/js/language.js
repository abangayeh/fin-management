"use strict";

(function () {
  const STORAGE_KEY = "finmanagement_language_v1";

  const languages = {
    id: "Bahasa Indonesia",
    en: "English",
    ja: "日本語",
    zh: "中文",
    ko: "한국어",
    ar: "العربية",
    ms: "Bahasa Melayu",
    th: "ไทย",
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

  /*
   * Setiap baris berisi:
   * [Bahasa Indonesia, English, Japanese, Chinese, Korean,
   * Arabic, Malay, Thai, Vietnamese, Filipino, Hindi,
   * Bengali, German, French, Spanish, Portuguese,
   * Italian, Russian, Turkish, Dutch]
   */

  const phrases = [
    ["Catat keuangan. Cukup ketik.", "Track your finances. Just type.", "家計を記録。入力するだけ。", "记录财务，只需输入。", "재정을 기록하세요. 입력만 하면 됩니다.", "سجّل أموالك. اكتب فقط.", "Rekod kewangan. Taip sahaja.", "บันทึกการเงิน เพียงพิมพ์", "Ghi chép tài chính. Chỉ cần nhập.", "Itala ang pananalapi. Mag-type lang.", "वित्त दर्ज करें। बस टाइप करें।", "অর্থের হিসাব রাখুন। শুধু টাইপ করুন।", "Finanzen erfassen. Einfach tippen.", "Suivez vos finances. Tapez simplement.", "Registra tus finanzas. Solo escribe.", "Registre suas finanças. Basta digitar.", "Registra le tue finanze. Basta digitare.", "Учитывайте финансы. Просто введите.", "Finanslarınızı kaydedin. Sadece yazın.", "Houd je financiën bij. Typ gewoon."],
    ["Memuat profil...", "Loading profile...", "プロフィールを読み込み中...", "正在加载个人资料...", "프로필 불러오는 중...", "جارٍ تحميل الملف الشخصي...", "Memuatkan profil...", "กำลังโหลดโปรไฟล์...", "Đang tải hồ sơ...", "Nilo-load ang profile...", "प्रोफ़ाइल लोड हो रही है...", "প্রোফাইল লোড হচ্ছে...", "Profil wird geladen...", "Chargement du profil...", "Cargando perfil...", "Carregando perfil...", "Caricamento del profilo...", "Загрузка профиля...", "Profil yükleniyor...", "Profiel laden..."],
    ["Profil", "Profile", "プロフィール", "个人资料", "프로필", "الملف الشخصي", "Profil", "โปรไฟล์", "Hồ sơ", "Profile", "प्रोफ़ाइल", "প্রোফাইল", "Profil", "Profil", "Perfil", "Perfil", "Profilo", "Профиль", "Profil", "Profiel"],
    ["Ganti tema", "Change theme", "テーマを変更", "更改主题", "테마 변경", "تغيير المظهر", "Tukar tema", "เปลี่ยนธีม", "Đổi giao diện", "Palitan ang tema", "थीम बदलें", "থিম পরিবর্তন করুন", "Design ändern", "Changer le thème", "Cambiar tema", "Mudar tema", "Cambia tema", "Изменить тему", "Temayı değiştir", "Thema wijzigen"],
    ["Keluar", "Log out", "ログアウト", "退出登录", "로그아웃", "تسجيل الخروج", "Log keluar", "ออกจากระบบ", "Đăng xuất", "Mag-log out", "लॉग आउट", "লগ আউট", "Abmelden", "Déconnexion", "Cerrar sesión", "Sair", "Esci", "Выйти", "Çıkış yap", "Uitloggen"],
    ["Dompet Keluarga", "Family Wallet", "家族の財布", "家庭钱包", "가족 지갑", "محفظة العائلة", "Dompet Keluarga", "กระเป๋าเงินครอบครัว", "Ví gia đình", "Wallet ng pamilya", "परिवार का वॉलेट", "পরিবারের ওয়ালেট", "Familien-Wallet", "Portefeuille familial", "Cartera familiar", "Carteira familiar", "Portafoglio familiare", "Семейный кошелёк", "Aile cüzdanı", "Gezinsportemonnee"],
    ["Kelola keuangan bersama pasangan", "Manage finances with your partner", "パートナーと家計を管理", "与伴侣共同管理财务", "배우자와 함께 재정 관리", "إدارة الأموال مع شريك حياتك", "Urus kewangan bersama pasangan", "จัดการการเงินร่วมกับคู่ของคุณ", "Quản lý tài chính cùng người thân", "Pamahalaan ang pananalapi kasama ang kapareha", "अपने साथी के साथ वित्त प्रबंधित करें", "সঙ্গীর সঙ্গে অর্থ ব্যবস্থাপনা", "Finanzen gemeinsam verwalten", "Gérez vos finances à deux", "Gestiona las finanzas en pareja", "Gerencie as finanças em conjunto", "Gestisci le finanze insieme", "Управляйте финансами вместе", "Partnerinizle finansları yönetin", "Beheer financiën samen"],
    ["Memuat dompet...", "Loading wallet...", "ウォレットを読み込み中...", "正在加载钱包...", "지갑 불러오는 중...", "جارٍ تحميل المحفظة...", "Memuatkan dompet...", "กำลังโหลดกระเป๋าเงิน...", "Đang tải ví...", "Nilo-load ang wallet...", "वॉलेट लोड हो रहा है...", "ওয়ালেট লোড হচ্ছে...", "Wallet wird geladen...", "Chargement du portefeuille...", "Cargando cartera...", "Carregando carteira...", "Caricamento portafoglio...", "Загрузка кошелька...", "Cüzdan yükleniyor...", "Portemonnee laden..."],
    ["Memuat status...", "Loading status...", "ステータスを読み込み中...", "正在加载状态...", "상태 불러오는 중...", "جارٍ تحميل الحالة...", "Memuatkan status...", "กำลังโหลดสถานะ...", "Đang tải trạng thái...", "Nilo-load ang status...", "स्थिति लोड हो रही है...", "স্ট্যাটাস লোড হচ্ছে...", "Status wird geladen...", "Chargement du statut...", "Cargando estado...", "Carregando status...", "Caricamento stato...", "Загрузка статуса...", "Durum yükleniyor...", "Status laden..."],
    ["+ Buat Kode Undangan", "+ Create Invite Code", "+ 招待コードを作成", "+ 创建邀请代码", "+ 초대 코드 만들기", "+ إنشاء رمز دعوة", "+ Cipta Kod Jemputan", "+ สร้างรหัสเชิญ", "+ Tạo mã lời mời", "+ Gumawa ng invite code", "+ आमंत्रण कोड बनाएँ", "+ আমন্ত্রণ কোড তৈরি করুন", "+ Einladungscode erstellen", "+ Créer un code d'invitation", "+ Crear código de invitación", "+ Criar código de convite", "+ Crea codice invito", "+ Создать код приглашения", "+ Davet kodu oluştur", "+ Uitnodigingscode maken"],
    ["Kode undangan:", "Invitation code:", "招待コード:", "邀请码：", "초대 코드:", "رمز الدعوة:", "Kod jemputan:", "รหัสเชิญ:", "Mã lời mời:", "Invite code:", "आमंत्रण कोड:", "আমন্ত্রণ কোড:", "Einladungscode:", "Code d'invitation :", "Código de invitación:", "Código de convite:", "Codice invito:", "Код приглашения:", "Davet kodu:", "Uitnodigingscode:"],
    ["Kode berlaku selama 7 hari.", "Code valid for 7 days.", "コードの有効期限は7日間です。", "代码有效期为7天。", "코드는 7일 동안 유효합니다.", "الرمز صالح لمدة 7 أيام.", "Kod sah selama 7 hari.", "รหัสใช้ได้ 7 วัน", "Mã có hiệu lực trong 7 ngày.", "May bisa ang code sa loob ng 7 araw.", "कोड 7 दिनों तक मान्य है।", "কোডটি ৭ দিন বৈধ থাকবে।", "Der Code ist 7 Tage gültig.", "Le code est valable 7 jours.", "El código es válido durante 7 días.", "O código é válido por 7 dias.", "Il codice è valido per 7 giorni.", "Код действителен 7 дней.", "Kod 7 gün geçerlidir.", "De code is 7 dagen geldig."],
    ["Periode laporan", "Report period", "レポート期間", "报告周期", "보고 기간", "فترة التقرير", "Tempoh laporan", "รอบรายงาน", "Kỳ báo cáo", "Panahon ng ulat", "रिपोर्ट अवधि", "রিপোর্টের সময়কাল", "Berichtszeitraum", "Période du rapport", "Periodo del informe", "Período do relatório", "Periodo del rapporto", "Отчётный период", "Rapor dönemi", "Rapportperiode"],
    ["⚙ Siklus", "⚙ Cycle", "⚙ サイクル", "⚙ 周期", "⚙ 주기", "⚙ الدورة", "⚙ Kitaran", "⚙ รอบบัญชี", "⚙ Chu kỳ", "⚙ Cycle", "⚙ चक्र", "⚙ চক্র", "⚙ Zyklus", "⚙ Cycle", "⚙ Ciclo", "⚙ Ciclo", "⚙ Ciclo", "⚙ Цикл", "⚙ Döngü", "⚙ Cyclus"],
    ["▤ Laporan", "▤ Reports", "▤ レポート", "▤ 报告", "▤ 보고서", "▤ التقارير", "▤ Laporan", "▤ รายงาน", "▤ Báo cáo", "▤ Mga ulat", "▤ रिपोर्ट", "▤ প্রতিবেদন", "▤ Berichte", "▤ Rapports", "▤ Informes", "▤ Relatórios", "▤ Rapporti", "▤ Отчёты", "▤ Raporlar", "▤ Rapporten"],
    ["Ketik transaksi...", "Enter transaction...", "取引を入力...", "输入交易...", "거래 입력...", "أدخل المعاملة...", "Taip transaksi...", "พิมพ์รายการ...", "Nhập giao dịch...", "Ilagay ang transaksyon...", "लेन-देन लिखें...", "লেনদেন লিখুন...", "Transaktion eingeben...", "Saisir une transaction...", "Escribe una transacción...", "Digite uma transação...", "Inserisci una transazione...", "Введите операцию...", "İşlem girin...", "Transactie invoeren..."],
    ["PEMASUKAN", "INCOME", "収入", "收入", "수입", "الدخل", "PENDAPATAN", "รายรับ", "THU NHẬP", "KITA", "आय", "আয়", "EINNAHMEN", "REVENUS", "INGRESOS", "RECEITAS", "ENTRATE", "ДОХОДЫ", "GELİR", "INKOMSTEN"],
    ["PENGELUARAN", "EXPENSES", "支出", "支出", "지출", "المصروفات", "PERBELANJAAN", "รายจ่าย", "CHI TIÊU", "GASTOS", "खर्च", "ব্যয়", "AUSGABEN", "DÉPENSES", "GASTOS", "DESPESAS", "USCITE", "РАСХОДЫ", "GİDERLER", "UITGAVEN"],
    ["SISA SALDO", "BALANCE", "残高", "余额", "잔액", "الرصيد المتبقي", "BAKI BAKI", "ยอดคงเหลือ", "SỐ DƯ", "BALANSE", "शेष राशि", "অবশিষ্ট ব্যালেন্স", "RESTSALDO", "SOLDE RESTANT", "SALDO RESTANTE", "SALDO RESTANTE", "SALDO RIMANENTE", "ОСТАТОК", "KALAN BAKİYE", "RESTSALDO"],
    ["Pengeluaran per Kategori", "Expenses by Category", "カテゴリー別支出", "分类支出", "카테고리별 지출", "المصروفات حسب الفئة", "Perbelanjaan mengikut Kategori", "ค่าใช้จ่ายตามหมวดหมู่", "Chi tiêu theo danh mục", "Gastos ayon sa Kategorya", "श्रेणी के अनुसार खर्च", "বিভাগ অনুযায়ী ব্যয়", "Ausgaben nach Kategorie", "Dépenses par catégorie", "Gastos por categoría", "Despesas por categoria", "Spese per categoria", "Расходы по категориям", "Kategoriye göre giderler", "Uitgaven per categorie"],
    ["Periode ini", "This period", "この期間", "本期", "이번 기간", "هذه الفترة", "Tempoh ini", "รอบนี้", "Kỳ này", "Panahong ito", "इस अवधि", "এই সময়কাল", "Dieser Zeitraum", "Cette période", "Este período", "Este período", "Questo periodo", "Этот период", "Bu dönem", "Deze periode"],
    ["Total keluar", "Total expenses", "支出合計", "总支出", "총 지출", "إجمالي المصروفات", "Jumlah perbelanjaan", "รายจ่ายทั้งหมด", "Tổng chi tiêu", "Kabuuang gastos", "कुल खर्च", "মোট ব্যয়", "Gesamtausgaben", "Total des dépenses", "Gastos totales", "Despesas totais", "Spese totali", "Общие расходы", "Toplam gider", "Totale uitgaven"],
    ["Belum ada pengeluaran.", "No expenses yet.", "まだ支出はありません。", "暂无支出。", "아직 지출이 없습니다.", "لا توجد مصروفات بعد.", "Belum ada perbelanjaan.", "ยังไม่มีรายจ่าย", "Chưa có chi tiêu.", "Wala pang gastos.", "अभी कोई खर्च नहीं है।", "এখনও কোনো ব্যয় নেই।", "Noch keine Ausgaben.", "Aucune dépense pour le moment.", "Aún no hay gastos.", "Ainda não há despesas.", "Nessuna spesa al momento.", "Расходов пока нет.", "Henüz gider yok.", "Nog geen uitgaven."],
    ["Tren 6 Periode", "6-Period Trend", "6期間の推移", "6期趋势", "6개 기간 추세", "اتجاه 6 فترات", "Trend 6 Tempoh", "แนวโน้ม 6 รอบ", "Xu hướng 6 kỳ", "Trend ng 6 na panahon", "6 अवधि का रुझान", "৬ সময়কালের প্রবণতা", "6-Perioden-Trend", "Tendance sur 6 périodes", "Tendencia de 6 períodos", "Tendência de 6 períodos", "Andamento di 6 periodi", "Тренд за 6 периодов", "6 dönemlik eğilim", "Trend over 6 perioden"],
    ["Pemasukan vs Pengeluaran", "Income vs Expenses", "収入と支出", "收入与支出", "수입 대 지출", "الدخل مقابل المصروفات", "Pendapatan vs Perbelanjaan", "รายรับเทียบกับรายจ่าย", "Thu nhập và chi tiêu", "Kita kumpara sa gastos", "आय बनाम खर्च", "আয় বনাম ব্যয়", "Einnahmen vs. Ausgaben", "Revenus vs dépenses", "Ingresos vs gastos", "Receitas vs despesas", "Entrate vs uscite", "Доходы и расходы", "Gelir ve gider", "Inkomsten versus uitgaven"],
    ["Grafik akan muncul setelah transaksi dicatat.", "The chart will appear after transactions are recorded.", "取引を記録するとグラフが表示されます。", "记录交易后将显示图表。", "거래를 기록하면 차트가 표시됩니다.", "سيظهر الرسم البياني بعد تسجيل المعاملات.", "Graf akan muncul selepas transaksi direkodkan.", "กราฟจะแสดงหลังจากบันทึกรายการ", "Biểu đồ sẽ xuất hiện sau khi ghi giao dịch.", "Lalabas ang chart pagkatapos magtala ng transaksyon.", "लेन-देन दर्ज करने के बाद चार्ट दिखाई देगा।", "লেনদেন নথিভুক্ত করার পর চার্ট দেখা যাবে।", "Das Diagramm erscheint nach der Erfassung von Transaktionen.", "Le graphique apparaîtra après l'enregistrement des transactions.", "El gráfico aparecerá después de registrar transacciones.", "O gráfico aparecerá após registrar transações.", "Il grafico apparirà dopo aver registrato le transazioni.", "График появится после записи операций.", "İşlemler kaydedildikten sonra grafik görünecek.", "De grafiek verschijnt nadat transacties zijn vastgelegd."],
    ["Masuk", "Income", "収入", "收入", "수입", "دخل", "Masuk", "รายรับ", "Thu", "Kita", "आय", "আয়", "Einnahmen", "Entrée", "Ingreso", "Entrada", "Entrata", "Доход", "Gelir", "Inkomst"],
    ["Keluar", "Expense", "支出", "支出", "지출", "مصروف", "Keluar", "รายจ่าย", "Chi", "Gastos", "खर्च", "ব্যয়", "Ausgabe", "Dépense", "Gasto", "Despesa", "Uscita", "Расход", "Gider", "Uitgave"],
    ["Riwayat Transaksi", "Transaction History", "取引履歴", "交易记录", "거래 내역", "سجل المعاملات", "Sejarah Transaksi", "ประวัติรายการ", "Lịch sử giao dịch", "Kasaysayan ng transaksyon", "लेन-देन इतिहास", "লেনদেনের ইতিহাস", "Transaktionsverlauf", "Historique des transactions", "Historial de transacciones", "Histórico de transações", "Cronologia delle transazioni", "История операций", "İşlem geçmişi", "Transactiegeschiedenis"],
    ["Catatan keuangan pada periode terpilih", "Financial records for the selected period", "選択した期間の家計記録", "所选期间的财务记录", "선택한 기간의 재정 기록", "السجلات المالية للفترة المحددة", "Rekod kewangan bagi tempoh dipilih", "บันทึกการเงินในรอบที่เลือก", "Ghi chép tài chính trong kỳ đã chọn", "Mga tala sa pananalapi para sa napiling panahon", "चयनित अवधि के वित्तीय रिकॉर्ड", "নির্বাচিত সময়ের আর্থিক রেকর্ড", "Finanzaufzeichnungen für den ausgewählten Zeitraum", "Relevés financiers pour la période sélectionnée", "Registros financieros del período seleccionado", "Registros financeiros do período selecionado", "Registrazioni finanziarie del periodo selezionato", "Финансовые записи за выбранный период", "Seçilen dönemin finans kayıtları", "Financiële gegevens voor de geselecteerde periode"],
    ["Semua", "All", "すべて", "全部", "전체", "الكل", "Semua", "ทั้งหมด", "Tất cả", "Lahat", "सभी", "সব", "Alle", "Tout", "Todos", "Todos", "Tutti", "Все", "Tümü", "Alles"],
    ["Cari transaksi...", "Search transactions...", "取引を検索...", "搜索交易...", "거래 검색...", "ابحث عن المعاملات...", "Cari transaksi...", "ค้นหารายการ...", "Tìm giao dịch...", "Maghanap ng transaksyon...", "लेन-देन खोजें...", "লেনদেন খুঁজুন...", "Transaktionen suchen...", "Rechercher des transactions...", "Buscar transacciones...", "Buscar transações...", "Cerca transazioni...", "Поиск операций...", "İşlem ara...", "Transacties zoeken..."],
    ["Belum ada transaksi.", "No transactions yet.", "取引はまだありません。", "暂无交易。", "아직 거래가 없습니다.", "لا توجد معاملات بعد.", "Belum ada transaksi.", "ยังไม่มีรายการ", "Chưa có giao dịch.", "Wala pang transaksyon.", "अभी कोई लेन-देन नहीं है।", "এখনও কোনো লেনদেন নেই।", "Noch keine Transaktionen.", "Aucune transaction pour le moment.", "Aún no hay transacciones.", "Ainda não há transações.", "Nessuna transazione al momento.", "Операций пока нет.", "Henüz işlem yok.", "Nog geen transacties."],
    ["Mulai dengan mengetik di kolom atas.", "Start by typing in the field above.", "上の入力欄から始めましょう。", "从上方输入框开始。", "위 입력栏에 입력하여 시작하세요.", "ابدأ بالكتابة في الحقل أعلاه.", "Mulakan dengan menaip di ruangan atas.", "เริ่มต้นด้วยการพิมพ์ในช่องด้านบน", "Bắt đầu bằng cách nhập vào ô phía trên.", "Magsimula sa pag-type sa kahon sa itaas.", "ऊपर दिए गए बॉक्स में लिखकर शुरू करें।", "উপরের ঘরে লিখে শুরু করুন।", "Beginnen Sie mit der Eingabe oben.", "Commencez par saisir du texte dans le champ ci-dessus.", "Comienza escribiendo en el campo superior.", "Comece digitando no campo acima.", "Inizia digitando nel campo qui sopra.", "Начните с ввода в поле выше.", "Yukarıdaki alana yazarak başlayın.", "Begin met typen in het veld hierboven."],
    ["Aktivitas Transaksi", "Transaction Activity", "取引アクティビティ", "交易活动", "거래 활동", "نشاط المعاملات", "Aktiviti Transaksi", "กิจกรรมรายการ", "Hoạt động giao dịch", "Aktibidad ng transaksyon", "लेन-देन गतिविधि", "লেনদেনের কার্যকলাপ", "Transaktionsaktivität", "Activité des transactions", "Actividad de transacciones", "Atividade de transações", "Attività delle transazioni", "Активность операций", "İşlem etkinliği", "Transactieactiviteit"],
    ["Catatan perubahan aktivitas dompet keluarga", "Family wallet activity log", "家族ウォレットの変更履歴", "家庭钱包活动记录", "가족 지갑 활동 기록", "سجل نشاط محفظة العائلة", "Rekod aktiviti dompet keluarga", "บันทึกกิจกรรมกระเป๋าเงินครอบครัว", "Nhật ký hoạt động ví gia đình", "Talaan ng aktibidad ng wallet ng pamilya", "परिवार वॉलेट गतिविधि लॉग", "পরিবারের ওয়ালেট কার্যকলাপের লগ", "Aktivitätsprotokoll des Familien-Wallets", "Journal d'activité du portefeuille familial", "Registro de actividad de la cartera familiar", "Registro de atividade da carteira familiar", "Registro attività del portafoglio familiare", "Журнал активности семейного кошелька", "Aile cüzdanı etkinlik kaydı", "Activiteitenlog van gezinsportemonnee"],
    ["Memuat aktivitas...", "Loading activity...", "アクティビティを読み込み中...", "正在加载活动...", "활동 불러오는 중...", "جارٍ تحميل النشاط...", "Memuatkan aktiviti...", "กำลังโหลดกิจกรรม...", "Đang tải hoạt động...", "Nilo-load ang aktibidad...", "गतिविधि लोड हो रही है...", "কার্যকলাপ লোড হচ্ছে...", "Aktivitäten werden geladen...", "Chargement de l'activité...", "Cargando actividad...", "Carregando atividade...", "Caricamento attività...", "Загрузка активности...", "Etkinlik yükleniyor...", "Activiteit laden..."],
    ["Belum ada aktivitas transaksi.", "No transaction activity yet.", "取引アクティビティはまだありません。", "暂无交易活动。", "아직 거래 활동이 없습니다.", "لا يوجد نشاط معاملات بعد.", "Belum ada aktiviti transaksi.", "ยังไม่มีกิจกรรมรายการ", "Chưa có hoạt động giao dịch.", "Wala pang aktibidad ng transaksyon.", "अभी कोई लेन-देन गतिविधि नहीं है।", "এখনও কোনো লেনদেন কার্যকলাপ নেই।", "Noch keine Transaktionsaktivität.", "Aucune activité de transaction.", "Aún no hay actividad de transacciones.", "Ainda não há atividade de transações.", "Nessuna attività di transazione.", "Активности операций пока нет.", "Henüz işlem etkinliği yok.", "Nog geen transactieactiviteit."],
    ["Pengaturan siklus laporan", "Report cycle settings", "レポート周期の設定", "报告周期设置", "보고 주기 설정", "إعدادات دورة التقرير", "Tetapan kitaran laporan", "ตั้งค่ารอบรายงาน", "Cài đặt chu kỳ báo cáo", "Mga setting ng cycle ng ulat", "रिपोर्ट चक्र सेटिंग", "রিপোর্ট চক্র সেটিংস", "Einstellungen für Berichtszyklus", "Paramètres du cycle de rapport", "Configuración del ciclo del informe", "Configurações do ciclo do relatório", "Impostazioni del ciclo di report", "Настройки отчётного цикла", "Rapor döngüsü ayarları", "Instellingen rapportcyclus"],
    ["Tentukan tanggal awal periode bulanan.", "Choose the start date of the monthly period.", "月次期間の開始日を選択してください。", "选择每月周期的开始日期。", "월간 기간의 시작 날짜를 선택하세요.", "حدد تاريخ بداية الفترة الشهرية.", "Tentukan tarikh mula tempoh bulanan.", "กำหนดวันที่เริ่มต้นรอบเดือน", "Chọn ngày bắt đầu kỳ hàng tháng.", "Piliin ang petsa ng pagsisimula ng buwanang panahon.", "मासिक अवधि की आरंभ तिथि चुनें।", "মাসিক সময়ের শুরুর তারিখ নির্বাচন করুন।", "Wählen Sie den Starttag des Monatszeitraums.", "Choisissez la date de début de la période mensuelle.", "Elige la fecha de inicio del período mensual.", "Escolha a data inicial do período mensal.", "Scegli il giorno iniziale del periodo mensile.", "Выберите дату начала месячного периода.", "Aylık dönemin başlangıç tarihini seçin.", "Kies de startdatum van de maandperiode."],
    ["Tanggal mulai siklus", "Cycle start date", "サイクル開始日", "周期开始日期", "주기 시작일", "تاريخ بدء الدورة", "Tarikh mula kitaran", "วันที่เริ่มรอบ", "Ngày bắt đầu chu kỳ", "Petsa ng pagsisimula ng cycle", "चक्र प्रारंभ तिथि", "চক্র শুরুর তারিখ", "Startdatum des Zyklus", "Date de début du cycle", "Fecha de inicio del ciclo", "Data de início do ciclo", "Data di inizio del ciclo", "Дата начала цикла", "Döngü başlangıç tarihi", "Startdatum cyclus"],
    ["Tanggal 1", "Day 1", "1日", "1日", "1일", "اليوم 1", "Hari 1", "วันที่ 1", "Ngày 1", "Araw 1", "दिन 1", "১ তারিখ", "Tag 1", "Jour 1", "Día 1", "Dia 1", "Giorno 1", "1-й день", "1. gün", "Dag 1"],
    ["Tanggal 25", "Day 25", "25日", "25日", "25일", "اليوم 25", "Hari 25", "วันที่ 25", "Ngày 25", "Araw 25", "दिन 25", "২৫ তারিখ", "Tag 25", "Jour 25", "Día 25", "Dia 25", "Giorno 25", "25-й день", "25. gün", "Dag 25"],
    ["Tanggal 28", "Day 28", "28日", "28日", "28일", "اليوم 28", "Hari 28", "วันที่ 28", "Ngày 28", "Araw 28", "दिन 28", "২৮ তারিখ", "Tag 28", "Jour 28", "Día 28", "Dia 28", "Giorno 28", "28-й день", "28. gün", "Dag 28"],
    ["Batal", "Cancel", "キャンセル", "取消", "취소", "إلغاء", "Batal", "ยกเลิก", "Hủy", "Kanselahin", "रद्द करें", "বাতিল", "Abbrechen", "Annuler", "Cancelar", "Cancelar", "Annulla", "Отмена", "İptal", "Annuleren"],
    ["Simpan", "Save", "保存", "保存", "저장", "حفظ", "Simpan", "บันทึก", "Lưu", "I-save", "सहेजें", "সংরক্ষণ", "Speichern", "Enregistrer", "Guardar", "Salvar", "Salva", "Сохранить", "Kaydet", "Opslaan"],
    ["Komentar Transaksi", "Transaction Comments", "取引コメント", "交易评论", "거래 댓글", "تعليقات المعاملة", "Komen Transaksi", "ความคิดเห็นรายการ", "Bình luận giao dịch", "Mga komento sa transaksyon", "लेन-देन टिप्पणियाँ", "লেনদেনের মন্তব্য", "Transaktionskommentare", "Commentaires sur la transaction", "Comentarios de transacción", "Comentários da transação", "Commenti sulla transazione", "Комментарии к операции", "İşlem yorumları", "Transactieopmerkingen"],
    ["Tulis komentar...", "Write a comment...", "コメントを書く...", "写评论...", "댓글 작성...", "اكتب تعليقًا...", "Tulis komen...", "เขียนความคิดเห็น...", "Viết bình luận...", "Magsulat ng komento...", "टिप्पणी लिखें...", "মন্তব্য লিখুন...", "Kommentar schreiben...", "Écrire un commentaire...", "Escribe un comentario...", "Escreva um comentário...", "Scrivi un commento...", "Написать комментарий...", "Yorum yaz...", "Schrijf een opmerking..."],
    ["Kirim Komentar", "Send Comment", "コメントを送信", "发送评论", "댓글 보내기", "إرسال التعليق", "Hantar Komen", "ส่งความคิดเห็น", "Gửi bình luận", "Ipadala ang komento", "टिप्पणी भेजें", "মন্তব্য পাঠান", "Kommentar senden", "Envoyer le commentaire", "Enviar comentario", "Enviar comentário", "Invia commento", "Отправить комментарий", "Yorum gönder", "Opmerking verzenden"],
    ["Memuat komentar...", "Loading comments...", "コメントを読み込み中...", "正在加载评论...", "댓글 불러오는 중...", "جارٍ تحميل التعليقات...", "Memuatkan komen...", "กำลังโหลดความคิดเห็น...", "Đang tải bình luận...", "Nilo-load ang mga komento...", "टिप्पणियाँ लोड हो रही हैं...", "মন্তব্য লোড হচ্ছে...", "Kommentare werden geladen...", "Chargement des commentaires...", "Cargando comentarios...", "Carregando comentários...", "Caricamento commenti...", "Загрузка комментариев...", "Yorumlar yükleniyor...", "Opmerkingen laden..."],
    ["Belum ada komentar. Jadilah yang pertama berkomentar.", "No comments yet. Be the first to comment.", "まだコメントはありません。最初にコメントしましょう。", "暂无评论。成为第一个评论的人。", "아직 댓글이 없습니다. 첫 댓글을 남겨보세요.", "لا توجد تعليقات بعد. كن أول من يعلق.", "Belum ada komen. Jadilah yang pertama memberi komen.", "ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น", "Chưa có bình luận. Hãy là người đầu tiên bình luận.", "Wala pang komento. Ikaw ang unang magkomento.", "अभी कोई टिप्पणी नहीं है। पहली टिप्पणी करें।", "এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন।", "Noch keine Kommentare. Schreiben Sie den ersten Kommentar.", "Aucun commentaire. Soyez le premier à commenter.", "Aún no hay comentarios. Sé el primero en comentar.", "Ainda não há comentários. Seja o primeiro a comentar.", "Nessun commento. Sii il primo a commentare.", "Комментариев пока нет. Оставьте первый комментарий.", "Henüz yorum yok. İlk yorumu siz yapın.", "Nog geen opmerkingen. Plaats de eerste opmerking."],
    ["Mengirim...", "Sending...", "送信中...", "正在发送...", "전송 중...", "جارٍ الإرسال...", "Menghantar...", "กำลังส่ง...", "Đang gửi...", "Ipinapadala...", "भेजा जा रहा है...", "পাঠানো হচ্ছে...", "Wird gesendet...", "Envoi en cours...", "Enviando...", "Enviando...", "Invio in corso...", "Отправка...", "Gönderiliyor...", "Verzenden..."],
    ["Halo,", "Hello,", "こんにちは、", "你好，", "안녕하세요,", "مرحبًا،", "Helo,", "สวัสดี,", "Xin chào,", "Kumusta,", "नमस्ते,", "হ্যালো,", "Hallo,", "Bonjour,", "Hola,", "Olá,", "Ciao,", "Здравствуйте,", "Merhaba,", "Hallo,"],
    ["Oleh:", "By:", "投稿者:", "由：", "작성자:", "بواسطة:", "Oleh:", "โดย:", "Bởi:", "Ni:", "द्वारा:", "দ্বারা:", "Von:", "Par :", "Por:", "Por:", "Da:", "Автор:", "Tarafından:", "Door:"],
    ["Menambahkan transaksi", "Added a transaction", "取引を追加しました", "添加了一笔交易", "거래를 추가했습니다", "أضاف معاملة", "Menambah transaksi", "เพิ่มรายการ", "Đã thêm giao dịch", "Nagdagdag ng transaksyon", "लेन-देन जोड़ा", "লেনদেন যোগ করেছেন", "Transaktion hinzugefügt", "Transaction ajoutée", "Añadió una transacción", "Adicionou uma transação", "Ha aggiunto una transazione", "Добавлена операция", "İşlem eklendi", "Transactie toegevoegd"],
    ["Mengubah transaksi", "Updated a transaction", "取引を変更しました", "修改了一笔交易", "거래를 수정했습니다", "عدّل معاملة", "Mengubah transaksi", "แก้ไขรายการ", "Đã cập nhật giao dịch", "Nag-update ng transaksyon", "लेन-देन अपडेट किया", "লেনদেন আপডেট করেছেন", "Transaktion geändert", "Transaction modifiée", "Actualizó una transacción", "Atualizou uma transação", "Ha aggiornato una transazione", "Изменена операция", "İşlem güncellendi", "Transactie bijgewerkt"],
    ["Menghapus transaksi", "Deleted a transaction", "取引を削除しました", "删除了一笔交易", "거래를 삭제했습니다", "حذف معاملة", "Memadam transaksi", "ลบรายการ", "Đã xóa giao dịch", "Nag-delete ng transaksyon", "लेन-देन हटाया", "লেনদেন মুছে ফেলেছেন", "Transaktion gelöscht", "Transaction supprimée", "Eliminó una transacción", "Excluiu uma transação", "Ha eliminato una transazione", "Удалена операция", "İşlem silindi", "Transactie verwijderd"],
    ["Aktivitas transaksi", "Transaction activity", "取引アクティビティ", "交易活动", "거래 활동", "نشاط المعاملة", "Aktiviti transaksi", "กิจกรรมรายการ", "Hoạt động giao dịch", "Aktibidad ng transaksyon", "लेन-देन गतिविधि", "লেনদেনের কার্যকলাপ", "Transaktionsaktivität", "Activité de transaction", "Actividad de transacción", "Atividade de transação", "Attività transazione", "Активность операции", "İşlem etkinliği", "Transactieactiviteit"],
    ["Pengguna", "User", "ユーザー", "用户", "사용자", "مستخدم", "Pengguna", "ผู้ใช้", "Người dùng", "Gumagamit", "उपयोगकर्ता", "ব্যবহারকারী", "Benutzer", "Utilisateur", "Usuario", "Usuário", "Utente", "Пользователь", "Kullanıcı", "Gebruiker"],
    ["Pemilik dompet", "Wallet owner", "ウォレット所有者", "钱包所有者", "지갑 소유자", "مالك المحفظة", "Pemilik dompet", "เจ้าของกระเป๋าเงิน", "Chủ ví", "May-ari ng wallet", "वॉलेट मालिक", "ওয়ালেটের মালিক", "Wallet-Inhaber", "Propriétaire du portefeuille", "Propietario de la cartera", "Proprietário da carteira", "Proprietario del portafoglio", "Владелец кошелька", "Cüzdan sahibi", "Eigenaar van portemonnee"],
    ["Anggota dompet", "Wallet member", "ウォレットメンバー", "钱包成员", "지갑 구성원", "عضو المحفظة", "Ahli dompet", "สมาชิกกระเป๋าเงิน", "Thành viên ví", "Miyembro ng wallet", "वॉलेट सदस्य", "ওয়ালেট সদস্য", "Wallet-Mitglied", "Membre du portefeuille", "Miembro de la cartera", "Membro da carteira", "Membro del portafoglio", "Участник кошелька", "Cüzdan üyesi", "Portemonneelid"],
    ["Transaksi berhasil disimpan", "Transaction saved successfully", "取引を保存しました", "交易保存成功", "거래가 저장되었습니다", "تم حفظ المعاملة بنجاح", "Transaksi berjaya disimpan", "บันทึกรายการสำเร็จ", "Đã lưu giao dịch thành công", "Matagumpay na-save ang transaksyon", "लेन-देन सफलतापूर्वक सहेजा गया", "লেনদেন সফলভাবে সংরক্ষিত হয়েছে", "Transaktion erfolgreich gespeichert", "Transaction enregistrée avec succès", "Transacción guardada correctamente", "Transação salva com sucesso", "Transazione salvata correttamente", "Операция успешно сохранена", "İşlem başarıyla kaydedildi", "Transactie succesvol opgeslagen"],
    ["Gagal menyimpan transaksi ke database", "Failed to save transaction to database", "データベースへの保存に失敗しました", "无法将交易保存到数据库", "데이터베이스에 거래를 저장하지 못했습니다", "فشل حفظ المعاملة في قاعدة البيانات", "Gagal menyimpan transaksi ke pangkalan data", "บันทึกรายการลงฐานข้อมูลไม่สำเร็จ", "Không thể lưu giao dịch vào cơ sở dữ liệu", "Hindi na-save ang transaksyon sa database", "डेटाबेस में लेन-देन सहेजने में विफल", "ডেটাবেসে লেনদেন সংরক্ষণ ব্যর্থ হয়েছে", "Transaktion konnte nicht gespeichert werden", "Échec de l'enregistrement dans la base de données", "No se pudo guardar la transacción", "Falha ao salvar a transação", "Impossibile salvare la transazione", "Не удалось сохранить операцию", "İşlem veritabanına kaydedilemedi", "Transactie opslaan in database mislukt"],
    ["Nominal belum terbaca. Coba: Makan 35rb, Bensin 100rb, atau Gaji 8jt.", "Amount not recognized. Try: Food 35k, Fuel 100k, or Salary 8m.", "金額を認識できません。例：食事 35、燃料 100、給料 8000。", "无法识别金额。请尝试输入食物35、燃油100或工资8000。", "금액을 인식하지 못했습니다. 식사 35, 연료 100, 급여 8000을 입력해 보세요.", "لم يتم التعرف على المبلغ. جرّب إدخال الطعام 35 أو الوقود 100 أو الراتب 8000.", "Jumlah tidak dikenal pasti. Cuba: Makan 35, Minyak 100 atau Gaji 8000.", "ไม่พบจำนวนเงิน ลองพิมพ์ค่าอาหาร 35 ค่าน้ำมัน 100 หรือเงินเดือน 8000", "Không nhận diện được số tiền. Hãy thử nhập Ăn 35, Xăng 100 hoặc Lương 8000.", "Hindi nakilala ang halaga. Subukan ang Pagkain 35, Gasolina 100, o Sahod 8000.", "राशि पहचानी नहीं गई। भोजन 35, ईंधन 100 या वेतन 8000 आज़माएँ।", "পরিমাণ বোঝা যায়নি। খাবার ৩৫, জ্বালানি ১০০ বা বেতন ৮০০০ লিখুন।", "Betrag nicht erkannt. Versuchen Sie Essen 35, Kraftstoff 100 oder Gehalt 8000.", "Montant non reconnu. Essayez Repas 35, Carburant 100 ou Salaire 8000.", "Importe no reconocido. Prueba Comida 35, Combustible 100 o Salario 8000.", "Valor não reconhecido. Tente Comida 35, Combustível 100 ou Salário 8000.", "Importo non riconosciuto. Prova Cibo 35, Carburante 100 o Stipendio 8000.", "Сумма не распознана. Попробуйте: еда 35, топливо 100 или зарплата 8000.", "Tutar tanınmadı. Yemek 35, Yakıt 100 veya Maaş 8000 deneyin.", "Bedrag niet herkend. Probeer Eten 35, Brandstof 100 of Salaris 8000."]
  ];

  const dictionary = {};

  phrases.forEach(row => {
    const source = row[0];

    dictionary[source] = {};

    Object.keys(languages).forEach((code, index) => {
      dictionary[source][code] = row[index] || source;
    });
  });

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();

  function getLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return Object.prototype.hasOwnProperty.call(languages, saved)
      ? saved
      : "id";
  }

  function translateText(text, language) {
    const trimmed = text.trim();

    if (!trimmed) return text;

    const translation = dictionary[trimmed]?.[language];

    if (!translation) return text;

    return text.replace(trimmed, translation);
  }

  function translateNode(node, language) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!originalText.has(node)) {
        originalText.set(node, node.nodeValue);
      }

      const original = originalText.get(node);
      const translated = translateText(original, language);

      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }

      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const ignored = ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"];

    if (ignored.includes(node.tagName)) return;

    ["placeholder", "title", "aria-label"].forEach(attribute => {
      if (!node.hasAttribute(attribute)) return;

      let saved = originalAttributes.get(node);

      if (!saved) {
        saved = {};
        originalAttributes.set(node, saved);
      }

      if (!(attribute in saved)) {
        saved[attribute] = node.getAttribute(attribute);
      }

      const original = saved[attribute];
      const translated = translateText(original, language);

      if (node.getAttribute(attribute) !== translated) {
        node.setAttribute(attribute, translated);
      }
    });

    Array.from(node.childNodes).forEach(child => {
      translateNode(child, language);
    });
  }

  function applyLanguage(language = getLanguage()) {
    if (!languages[language]) language = "id";

    document.documentElement.lang = language;

    if (language === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    translateNode(document.body, language);

    document.querySelectorAll("option").forEach(option => {
      translateNode(option, language);
    });
  }

  function setLanguage(language) {
    if (!languages[language]) {
      throw new Error("Bahasa tidak didukung.");
    }

    localStorage.setItem(STORAGE_KEY, language);

    applyLanguage(language);

    window.dispatchEvent(
      new CustomEvent("fin:language-change", {
        detail: { language }
      })
    );
  }

  function getLanguages() {
    return { ...languages };
  }

  let observer;

  function startObserver() {
    if (observer || !document.body) return;

    observer = new MutationObserver(records => {
      const language = getLanguage();

      records.forEach(record => {
        if (record.type === "childList") {
          record.addedNodes.forEach(node => {
            translateNode(node, language);
          });
        }

        if (record.type === "characterData") {
          translateNode(record.target, language);
        }

        if (record.type === "attributes") {
          translateNode(record.target, language);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"]
    });
  }

  window.FinLanguage = {
    getLanguage,
    setLanguage,
    getLanguages,
    applyLanguage
  };

  function initialize() {
    applyLanguage();
    startObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
