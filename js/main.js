
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/main.js

   Tanggung jawab:
   1. Menghubungkan HTML dengan sistem game.
   2. Menghubungkan event tombol.
   3. Memastikan tampilan awal tidak menimpa karakter.
   4. Mengatur zoom kertas.
   5. Membuka dan menutup Anomaly Index.
   6. Menampilkan daftar anomali pengunjung dan kertas.

   Catatan:
   - Karakter digambar oleh characters.js.
   - Kertas digambar oleh papers.js.
   - Logika permainan dikelola oleh game.js.
   - Efek visual dikelola oleh effects.js.
   - Data penyimpanan dikelola oleh storage.js.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KONFIGURASI
   ========================================================= */

const GAME_CONFIG = {
    initialLives: 3,
    initialScore: 0,
    initialVisitorNumber: 1,
    scoreDigits: 3
};


/* =========================================================
   BAGIAN 2 — REFERENSI ELEMEN HTML
   ========================================================= */

const UI = {
    // Informasi permainan.
    score: document.getElementById("score"),
    highScore: document.getElementById("highScore"),
    lives: document.getElementById("lives"),

    // Area permainan.
    game: document.getElementById("game"),
    gameScene: document.getElementById("gameScene"),
    fanArea: document.getElementById("fanArea"),

    // Canvas karakter dan kertas.
    characterCanvas: document.getElementById("characterCanvas"),
    paperCanvas: document.getElementById("paperCanvas"),

    // Informasi pengunjung.
    fanNumber: document.getElementById("fanNumber"),
    fanMessage: document.getElementById("fanMessage"),

    // Tombol keputusan.
    signButton: document.getElementById("signButton"),
    rejectButton: document.getElementById("rejectButton"),
    inspectPaper: document.getElementById("inspectPaper"),

    // Feedback keputusan.
    feedback: document.getElementById("feedback"),
    feedbackTitle: document.getElementById("feedbackTitle"),
    feedbackMessage: document.getElementById("feedbackMessage"),
    nextButton: document.getElementById("nextButton"),

    // Game Over.
    gameOverScreen: document.getElementById("gameOverScreen"),
    finalScore: document.getElementById("finalScore"),
    newRecordMessage: document.getElementById("newRecordMessage"),
    restartButton: document.getElementById("restartButton"),

    // Kontrol zoom kertas.
    zoomOutPaper: document.getElementById("zoomOutPaper"),
    paperZoomValue: document.getElementById("paperZoomValue"),
    zoomInPaper: document.getElementById("zoomInPaper"),
    resetPaperZoom: document.getElementById("resetPaperZoom"),

    // Anomaly Index.
    openAnomalyIndexButton:
        document.getElementById("openAnomalyIndexButton"),

    anomalyIndex:
        document.getElementById("anomalyIndex"),

    closeAnomalyIndexButton:
        document.getElementById("closeAnomalyIndexButton"),

    closeAnomalyIndexFooterButton:
        document.getElementById("closeAnomalyIndexFooterButton"),

    visitorAnomalyIndex:
        document.getElementById("visitorAnomalyIndex"),

    paperAnomalyIndex:
        document.getElementById("paperAnomalyIndex")
};


/* =========================================================
   BAGIAN 3 — VALIDASI HTML
   ========================================================= */

function validateGameElements() {
    const requiredElements = [
        "score",
        "highScore",
        "lives",
        "characterCanvas",
        "paperCanvas",
        "fanNumber",
        "fanMessage",
        "signButton",
        "rejectButton",
        "inspectPaper",
        "nextButton",
        "restartButton",
        "feedback",
        "gameOverScreen"
    ];

    const missingElements = requiredElements.filter(
        (elementName) => !UI[elementName]
    );

    if (missingElements.length > 0) {
        console.error(
            "[THE LAST AUTOGRAPH] Elemen HTML tidak ditemukan:",
            missingElements
        );

        return false;
    }

    return true;
}


/* =========================================================
   BAGIAN 4 — FORMAT ANGKA
   ========================================================= */

function formatScore(score) {
    const safeScore = Number.isFinite(Number(score))
        ? Math.max(0, Math.floor(Number(score)))
        : 0;

    return String(safeScore).padStart(
        GAME_CONFIG.scoreDigits,
        "0"
    );
}


/* =========================================================
   BAGIAN 5 — SINKRONISASI TAMPILAN
   ========================================================= */

/*
 * game.js adalah sumber utama status permainan.
 *
 * Fungsi ini hanya membaca state yang sudah dibuat oleh
 * game.js. Fungsi ini tidak membuat kasus baru dan tidak
 * menggambar placeholder ke canvas.
 */

function syncDisplayFromGame() {
    if (
        !window.Game ||
        typeof window.Game.getState !== "function"
    ) {
        return;
    }

    const state = window.Game.getState();

    if (!state) {
        return;
    }

    if (UI.score) {
        UI.score.textContent = formatScore(state.score);
    }

    if (
        typeof state.visitorNumber === "number" &&
        UI.fanNumber
    ) {
        UI.fanNumber.textContent =
            `VISITOR #${String(state.visitorNumber).padStart(3, "0")}`;
    }

    if (typeof state.lives === "number") {
        updateLivesDisplay(state.lives);
    }
}


/*
 * Memperbarui tampilan nyawa.
 *
 * Mendukung dua bentuk HTML:
 * 1. Kontainer berisi elemen .life.
 * 2. Kontainer yang hanya menampilkan angka.
 */

function updateLivesDisplay(lives) {
    if (!UI.lives) {
        return;
    }

    const safeLives = Math.max(
        0,
        Math.min(
            GAME_CONFIG.initialLives,
            Number(lives) || 0
        )
    );

    const lifeElements = UI.lives.querySelectorAll(".life");

    if (lifeElements.length > 0) {
        lifeElements.forEach((life, index) => {
            life.classList.toggle(
                "lost",
                index >= safeLives
            );
        });
    } else {
        UI.lives.textContent = String(safeLives);
    }

    UI.lives.setAttribute(
        "aria-label",
        `${safeLives} ${
            safeLives === 1 ? "life" : "lives"
        } remaining`
    );
}


/* =========================================================
   BAGIAN 6 — PERSIAPAN LAYAR
   ========================================================= */

function prepareInitialScreen() {
    /*
     * Menyembunyikan panel hasil saat halaman baru dibuka.
     */

    UI.feedback?.classList.add("hidden");
    UI.gameOverScreen?.classList.add("hidden");

    /*
     * Jangan mengubah fanMessage di sini.
     * game.js sudah menampilkan dialog pengunjung yang benar.
     */

    if (UI.signButton) {
        UI.signButton.disabled = false;
    }

    if (UI.rejectButton) {
        UI.rejectButton.disabled = false;
    }
}


/* =========================================================
   BAGIAN 7 — PENGHUBUNG KE GAME.JS
   ========================================================= */

/*
 * Tombol HTML memanggil fungsi melalui window.Game.
 * Jika game.js belum tersedia, tampilkan pesan di Console.
 */

function callGameAction(actionName) {
    if (
        window.Game &&
        typeof window.Game[actionName] === "function"
    ) {
        window.Game[actionName]();
        return;
    }

    console.warn(
        `[THE LAST AUTOGRAPH] Game.${actionName}() tidak tersedia.`
    );
}


/* =========================================================
   BAGIAN 8 — EVENT TOMBOL PERMAINAN
   ========================================================= */

function handleSignButton() {
    callGameAction("sign");
}


function handleRejectButton() {
    callGameAction("reject");
}


function handleNextButton() {
    callGameAction("nextVisitor");
}


function handleRestartButton() {
    callGameAction("restart");

    /*
     * Atur ulang zoom saat memulai permainan baru.
     */

    resetPaperZoomLevel();
}


function handleInspectPaper() {
    callGameAction("inspectPaper");
}


/* =========================================================
   BAGIAN 9 — PAPER ZOOM
   ========================================================= */

/*
 * Zoom mengubah ukuran tampilan canvas lewat CSS transform.
 * Ukuran gambar asli pada canvas tidak berubah.
 *
 * Minimum zoom : 70%
 * Default zoom : 100%
 * Maximum zoom : 220%
 */

const PAPER_ZOOM_CONFIG = {
    min: 0.7,
    max: 2.2,
    step: 0.2,
    initial: 1
};

let currentPaperZoom = PAPER_ZOOM_CONFIG.initial;


function applyPaperZoom() {
    const canvas = UI.paperCanvas;

    if (!canvas) {
        return;
    }

    canvas.style.transformOrigin = "center center";
    canvas.style.transition = "transform 180ms ease";
    canvas.style.transform = `scale(${currentPaperZoom})`;

    /*
     * Perbarui tulisan persentase zoom.
     */

    if (UI.paperZoomValue) {
        UI.paperZoomValue.textContent =
            `${Math.round(currentPaperZoom * 100)}%`;

        UI.paperZoomValue.setAttribute(
            "aria-label",
            `Paper zoom ${Math.round(currentPaperZoom * 100)} percent`
        );
    }

    /*
     * Class ini dapat digunakan oleh style.css
     * untuk mengatur ruang ketika kertas diperbesar.
     */

    canvas.classList.toggle(
        "paper-zoomed",
        currentPaperZoom !== PAPER_ZOOM_CONFIG.initial
    );
}


function zoomPaperIn() {
    currentPaperZoom = Math.min(
        PAPER_ZOOM_CONFIG.max,
        Math.round(
            (currentPaperZoom + PAPER_ZOOM_CONFIG.step) * 100
        ) / 100
    );

    applyPaperZoom();
}


function zoomPaperOut() {
    currentPaperZoom = Math.max(
        PAPER_ZOOM_CONFIG.min,
        Math.round(
            (currentPaperZoom - PAPER_ZOOM_CONFIG.step) * 100
        ) / 100
    );

    applyPaperZoom();
}


function resetPaperZoomLevel() {
    currentPaperZoom = PAPER_ZOOM_CONFIG.initial;

    applyPaperZoom();
}


function initializePaperZoom() {
    /*
     * Tombol zoom bersifat opsional. Jika belum ada di
     * index.html, game tetap dapat dimainkan.
     */

    UI.zoomInPaper?.addEventListener(
        "click",
        zoomPaperIn
    );

    UI.zoomOutPaper?.addEventListener(
        "click",
        zoomPaperOut
    );

    UI.resetPaperZoom?.addEventListener(
        "click",
        resetPaperZoomLevel
    );

    /*
     * Pastikan kertas dimulai dengan zoom 100%.
     */

    applyPaperZoom();
}


/* =========================================================
   BAGIAN 10 — MEMBUAT ITEM ANOMALY INDEX
   ========================================================= */

/*
 * Elemen dibuat melalui DOM API dan textContent.
 * Dengan demikian, teks data tidak dimasukkan sebagai HTML.
 */

function createAnomalyIndexEntry(title, description) {
    const entry = document.createElement("article");

    entry.className = "anomaly-index-entry";

    const heading = document.createElement("h4");

    heading.className = "anomaly-index-entry-title";
    heading.textContent = title;

    const detail = document.createElement("p");

    detail.className = "anomaly-index-entry-description";
    detail.textContent = description;

    entry.appendChild(heading);
    entry.appendChild(detail);

    return entry;
}


function renderAnomalyIndexEntries(
    container,
    entries,
    emptyMessage
) {
    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!entries || entries.length === 0) {
        const emptyText = document.createElement("p");

        emptyText.className = "anomaly-index-empty";
        emptyText.textContent = emptyMessage;

        container.appendChild(emptyText);

        return;
    }

    entries.forEach((entry) => {
        container.appendChild(
            createAnomalyIndexEntry(
                entry.title,
                entry.description
            )
        );
    });
}


/* =========================================================
   BAGIAN 11 — DATA ANOMALI PENGUNJUNG
   Membaca database dari game.js.
   Fallback menyediakan 8 catatan.
   ========================================================= */

function getVisitorAnomalyIndexData() {
    /*
     * VISITOR_DATABASE berasal dari game.js.
     * Ambil hanya pengunjung dengan status anomaly.
     */

    if (
        typeof VISITOR_DATABASE !== "undefined" &&
        Array.isArray(VISITOR_DATABASE)
    ) {
        return VISITOR_DATABASE
            .filter((visitor) => visitor.status === "anomaly")
            .map((visitor) => ({
                title:
                    visitor.name ||
                    visitor.id ||
                    "Unknown Visitor",

                description:
                    visitor.anomalyClue ||
                    visitor.greeting ||
                    "Details about this anomaly remain unknown."
            }));
    }

    /*
     * Fallback jika database game belum tersedia.
     */

    return [
        {
            title: "The Smiling Stranger",
            description:
                "Ia mengaku pernah bertemu kemarin, padahal acara ini baru pertama kali diadakan."
        },
        {
            title: "The Silent Guest",
            description:
                "Ia tidak merespons suara atau gerakan apa pun, tetapi selalu menatapmu."
        },
        {
            title: "The Familiar Face",
            description:
                "Ia berbicara seolah mengetahui kejadian yang belum terjadi."
        },
        {
            title: "The Last Visitor",
            description:
                "Ia menanggapi sesuatu yang tidak pernah kamu tanyakan."
        },
        {
            title: "The Second Smile",
            description:
                "Senyumnya tampak berubah sesaat setelah ia berhenti tersenyum."
        },
        {
            title: "The Hollow Witness",
            description:
                "Tatapannya terlihat kosong, tetapi ia mengetahui setiap gerakanmu."
        },
        {
            title: "The Split Witness",
            description:
                "Satu sisi wajahnya seakan bereaksi berbeda dari sisi lainnya."
        },
        {
            title: "The Mouth That Waits",
            description:
                "Mulutnya bergerak sebelum suaranya terdengar."
        }
    ];
}


/* =========================================================
   BAGIAN 12 — DATA ANOMALI KERTAS
   Membaca database dari game.js.
   Fallback menyediakan 8 catatan.
   ========================================================= */

function getPaperAnomalyIndexData() {
    /*
     * PAPER_DATABASE berasal dari game.js.
     * Status kertas diperiksa terpisah dari pengunjung.
     */

    if (
        typeof PAPER_DATABASE !== "undefined" &&
        Array.isArray(PAPER_DATABASE)
    ) {
        return PAPER_DATABASE
            .filter((paper) => paper.status === "anomaly")
            .map((paper, index) => ({
                title:
                    `Paper Anomaly ${String(index + 1).padStart(2, "0")}`,

                description:
                    paper.clue ||
                    "Unusual details have been detected on this paper."
            }));
    }

    /*
     * Fallback jika database kertas tidak tersedia.
     */

    return [
        {
            title: "Paper Anomaly 01",
            description:
                "Tanggal pada kertas menunjukkan hari esok, bukan tanggal acara."
        },
        {
            title: "Paper Anomaly 02",
            description:
                "Ada tulisan tangan di bagian bawah yang terlihat seperti tanda tanganmu sendiri."
        },
        {
            title: "Paper Anomaly 03",
            description:
                "Bagian belakang kertas memiliki tulisan yang tidak terlihat pada sisi depan."
        },
        {
            title: "Paper Anomaly 04",
            description:
                "Nama yang tercetak pada kertas berubah ketika kamu melihatnya kembali."
        },
        {
            title: "Paper Anomaly 05",
            description:
                "Tanggal yang tercetak berbeda dari tanggal formulir sebelumnya, seolah tanggalnya berubah."
        },
        {
            title: "Paper Anomaly 06",
            description:
                "Ada tanda tangan tambahan yang hampir sama dengan tanda tanganmu, tetapi bentuk hurufnya terbalik."
        },
        {
            title: "Paper Anomaly 07",
            description:
                "Tulisan DO NOT SIGN muncul melintasi garis formulir dengan tinta yang berbeda."
        },
        {
            title: "Paper Anomaly 08",
            description:
                "Kolom nama menampilkan NO ONE, padahal formulir mengidentifikasi pemilik sebagai VISITOR."
        }
    ];
}


/* =========================================================
   BAGIAN 13 — MERENDER ANOMALY INDEX
   ========================================================= */

function renderAnomalyIndex() {
    const visitorEntries = getVisitorAnomalyIndexData();

    const paperEntries = getPaperAnomalyIndexData();

    renderAnomalyIndexEntries(
        UI.visitorAnomalyIndex,
        visitorEntries,
        "No visitor anomalies have been documented yet."
    );

    renderAnomalyIndexEntries(
        UI.paperAnomalyIndex,
        paperEntries,
        "No paper anomalies have been documented yet."
    );
}


/* =========================================================
   BAGIAN 14 — MEMBUKA DAN MENUTUP ANOMALY INDEX
   ========================================================= */

function openAnomalyIndex() {
    if (!UI.anomalyIndex) {
        console.warn(
            "Elemen anomalyIndex belum ditemukan di index.html."
        );

        return;
    }

    renderAnomalyIndex();

    UI.anomalyIndex.classList.remove("hidden");

    UI.anomalyIndex.setAttribute(
        "aria-hidden",
        "false"
    );

    /*
     * Fokuskan tombol close agar navigasi keyboard
     * lebih nyaman.
     */

    UI.closeAnomalyIndexButton?.focus();
}


function closeAnomalyIndex() {
    if (!UI.anomalyIndex) {
        return;
    }

    UI.anomalyIndex.classList.add("hidden");

    UI.anomalyIndex.setAttribute(
        "aria-hidden",
        "true"
    );

    UI.openAnomalyIndexButton?.focus();
}


function handleAnomalyIndexBackdropClick(event) {
    /*
     * Modal hanya ditutup ketika pemain mengeklik bagian
     * latar modal, bukan isi index itu sendiri.
     */

    if (
        UI.anomalyIndex &&
        event.target === UI.anomalyIndex
    ) {
        closeAnomalyIndex();
    }
}


function handleGlobalKeydown(event) {
    if (event.key !== "Escape") {
        return;
    }

    if (
        UI.anomalyIndex &&
        !UI.anomalyIndex.classList.contains("hidden")
    ) {
        closeAnomalyIndex();
    }
}


function initializeAnomalyIndex() {
    UI.openAnomalyIndexButton?.addEventListener(
        "click",
        openAnomalyIndex
    );

    UI.closeAnomalyIndexButton?.addEventListener(
        "click",
        closeAnomalyIndex
    );

    UI.closeAnomalyIndexFooterButton?.addEventListener(
        "click",
        closeAnomalyIndex
    );

    UI.anomalyIndex?.addEventListener(
        "click",
        handleAnomalyIndexBackdropClick
    );

    document.addEventListener(
        "keydown",
        handleGlobalKeydown
    );

    /*
     * Status awal modal adalah tertutup.
     */

    if (UI.anomalyIndex) {
        UI.anomalyIndex.classList.add("hidden");

        UI.anomalyIndex.setAttribute(
            "aria-hidden",
            "true"
        );
    }
}


/* =========================================================
   BAGIAN 15 — MENGHUBUNGKAN EVENT LISTENER
   ========================================================= */

function registerEventListeners() {
    UI.signButton?.addEventListener(
        "click",
        handleSignButton
    );

    UI.rejectButton?.addEventListener(
        "click",
        handleRejectButton
    );

    UI.nextButton?.addEventListener(
        "click",
        handleNextButton
    );

    UI.restartButton?.addEventListener(
        "click",
        handleRestartButton
    );

    UI.inspectPaper?.addEventListener(
        "click",
        handleInspectPaper
    );
}


/* =========================================================
   BAGIAN 16 — INISIALISASI APLIKASI
   ========================================================= */

function initializeGameApplication() {
    console.log("====================================");
    console.log("THE LAST AUTOGRAPH");
    console.log("Initializing application...");
    console.log("====================================");

    if (!validateGameElements()) {
        return;
    }

    /*
     * Penting:
     * Jangan menjalankan drawCharacterPlaceholder().
     * Jangan menjalankan drawPaperPlaceholder().
     *
     * game.js membuat kasus permainan.
     * characters.js dan papers.js menggambar canvas.
     *
     * Menggambar placeholder di sini dapat menimpa
     * karakter dan kertas yang sebenarnya.
     */

    prepareInitialScreen();

    /*
     * Daftarkan event setelah HTML tersedia.
     */

    registerEventListeners();

    /*
     * Aktifkan kontrol tambahan.
     */

    initializePaperZoom();
    initializeAnomalyIndex();

    /*
     * Ambil state yang telah dibuat oleh game.js.
     * Jangan memulai game kedua kali dari main.js.
     */

    syncDisplayFromGame();

    console.log(
        "Application ready. Canvas remains managed by its own modules."
    );
}


/* =========================================================
   BAGIAN 17 — EKSPOR FUNGSI OPSIONAL
   ========================================================= */

/*
 * Fungsi ini dapat dipanggil dari Console browser
 * saat debugging.
 */

window.GameUI = {
    formatScore,
    syncDisplayFromGame,
    updateLivesDisplay,

    zoomPaperIn,
    zoomPaperOut,
    resetPaperZoom: resetPaperZoomLevel,

    openAnomalyIndex,
    closeAnomalyIndex,
    renderAnomalyIndex,

    getVisitorAnomalyIndexData,
    getPaperAnomalyIndexData
};


/* =========================================================
   BAGIAN 18 — MULAI APLIKASI
   ========================================================= */

/*
 * Dengan script defer dan urutan script yang benar,
 * game.js dijalankan lebih dahulu daripada main.js.
 */

initializeGameApplication();
