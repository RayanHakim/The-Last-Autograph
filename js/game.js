

/* =========================================================

   THE LAST AUTOGRAPH

   File: js/game.js

   Tanggung jawab:

   1. Mengatur pengunjung dan kertas.

   2. Memeriksa keputusan SIGN atau REJECT.

   3. Mengatur skor, nyawa, dan high score.

   4. Memainkan efek suara dan musik latar.

   5. Menampilkan feedback dan petunjuk.

   6. Mengatur pergantian pengunjung, restart, dan game over.

   ========================================================= */

/* =========================================================

   BAGIAN 1 — KONFIGURASI GAME

   ========================================================= */

const GAME_SETTINGS = {

    initialLives: 3,

    initialScore: 0,

    storageKey: "theLastAutographHighScore",

    actions: {

        sign: "SIGN",

        reject: "REJECT"

    }

};

/* =========================================================

   BAGIAN 2 — REFERENSI ELEMEN HTML

   ========================================================= */

const GAME_UI = {

    score: document.getElementById("score"),

    highScore: document.getElementById("highScore"),

    lives: document.getElementById("lives"),

    gameScene: document.getElementById("gameScene"),

    fanArea: document.getElementById("fanArea"),

    fanNumber: document.getElementById("fanNumber"),

    fanMessage: document.getElementById("fanMessage"),

    characterCanvas: document.getElementById("characterCanvas"),

    paperCanvas: document.getElementById("paperCanvas"),

    inspectPaper: document.getElementById("inspectPaper"),

    signButton: document.getElementById("signButton"),

    rejectButton: document.getElementById("rejectButton"),

    feedback: document.getElementById("feedback"),

    feedbackTitle: document.getElementById("feedbackTitle"),

    feedbackMessage: document.getElementById("feedbackMessage"),

    nextButton: document.getElementById("nextButton"),

    gameOverScreen: document.getElementById("gameOverScreen"),

    finalScore: document.getElementById("finalScore"),

    newRecordMessage: document.getElementById("newRecordMessage"),

    restartButton: document.getElementById("restartButton"),

    backgroundMusic: document.getElementById("backgroundMusic"),

    wrongSound: document.getElementById("wrongSound"),

    correctSound: document.getElementById("correctSound")

};

/* =========================================================

   BAGIAN 3 — DATA PENGUNJUNG

   ========================================================= */

const VISITOR_DATABASE = [

    {

        id: "visitor_001",

        name: "The Quiet Fan",

        status: "normal",

        greeting:

            '"I have been waiting all day. Thank you for seeing me."',

        normalClue:

            "Gerak-geriknya terlihat wajar. Ia tampak gugup saat menunggu giliran.",

        anomalyClue:

            "Ada sesuatu yang terasa tidak konsisten dari cara ia memperhatikanmu."

    },

    {

        id: "visitor_002",

        name: "The Smiling Stranger",

        status: "anomaly",

        greeting:

            '"You remember me, right? We met here yesterday."',

        normalClue:

            "Ia mengingat detail acara dan berbicara dengan santai.",

        anomalyClue:

            "Ia mengaku pernah bertemu kemarin, padahal acara ini baru pertama kali diadakan."

    },

    {

        id: "visitor_003",

        name: "The Nervous Collector",

        status: "normal",

        greeting:

            '"Could you write my name? I want to keep this forever."',

        normalClue:

            "Ia membawa koleksi lama dan meminta namanya ditulis dengan benar.",

        anomalyClue:

            "Ia menyebut namamu sebelum kamu memperkenalkan diri."

    },

    {

        id: "visitor_004",

        name: "The Silent Guest",

        status: "anomaly",

        greeting: '"..."',

        normalClue:

            "Ia tampak pendiam, tetapi masih merespons saat diajak bicara.",

        anomalyClue:

            "Ia tidak merespons suara atau gerakan apa pun, tetapi selalu menatapmu."

    },

    {

        id: "visitor_005",

        name: "The Old Supporter",

        status: "normal",

        greeting:

            '"I have followed your work for years. It is nice to meet you."',

        normalClue:

            "Ia bercerita tentang karya lama dan mengingat detail yang masuk akal.",

        anomalyClue:

            "Ia mengetahui sesuatu yang belum pernah kamu ceritakan kepada siapa pun."

    },

    {

        id: "visitor_006",

        name: "The Familiar Face",

        status: "anomaly",

        greeting:

            '"You look tired. You should not have come back tonight."',

        normalClue:

            "Ia menyampaikan kekhawatiran dengan cara yang wajar.",

        anomalyClue:

            "Ia berbicara seolah mengetahui kejadian yang belum terjadi."

    },

    {

        id: "visitor_007",

        name: "The Young Artist",

        status: "normal",

        greeting:

            '"I hope I can become an artist like you someday."',

        normalClue:

            "Ia membawa sketsa buatannya sendiri dan meminta pendapatmu.",

        anomalyClue:

            "Sketsanya menggambarkan ruangan ini dari sudut yang tidak mungkin ia lihat."

    },

    {

        id: "visitor_008",

        name: "The Last Visitor",

        status: "anomaly",

        greeting:

            '"There is no one behind me. You can stop looking now."',

        normalClue:

            "Ia datang sendirian dan menjawab pertanyaan dengan masuk akal.",

        anomalyClue:

            "Ia menanggapi sesuatu yang tidak pernah kamu tanyakan."

    },

    // Pengunjung normal tambahan — The Patient Collector
    {
        id: "visitor_009",
        name: "The Patient Collector",
        status: "normal",

        greeting:
            '"Take your time. I can wait."',

        normalClue:
            "Ia tetap tenang meskipun antrean semakin panjang.",

        anomalyClue:
            "Ia mengetahui berapa lama seseorang akan menunggu."
    },

    // ANOMALI 05 — The Second Smile
    {
        id: "visitor_010",
        name: "The Second Smile",
        status: "anomaly",

        greeting:
            '"Did you see me smiling before I arrived?"',

        normalClue:
            "Ekspresinya terlihat seperti senyum biasa.",

        anomalyClue:
            "Senyumnya tampak berubah sesaat setelah ia berhenti tersenyum."
    },

    // Pengunjung normal tambahan — The Careful Guest
    {
        id: "visitor_011",
        name: "The Careful Guest",
        status: "normal",

        greeting:
            '"I checked the form twice. Everything should be correct."',

        normalClue:
            "Ia memeriksa informasi pada formulir dengan teliti.",

        anomalyClue:
            "Ia terus mengoreksi kata-kata yang belum diucapkan."
    },

    // ANOMALI 06 — The Hollow Witness
    {
        id: "visitor_012",
        name: "The Hollow Witness",
        status: "anomaly",

        greeting:
            '"There is nothing behind my eyes. You already know that."',

        normalClue:
            "Ia menghindari kontak mata ketika berbicara.",

        anomalyClue:
            "Tatapannya terlihat kosong, tetapi ia mengetahui setiap gerakanmu."
    },

    // Pengunjung normal tambahan — The Young Archivist
    {
        id: "visitor_013",
        name: "The Young Archivist",
        status: "normal",

        greeting:
            '"I collect signed papers from every event I visit."',

        normalClue:
            "Ia menyimpan dokumen dalam map yang tersusun rapi.",

        anomalyClue:
            "Salah satu dokumennya memiliki nomor arsip yang belum dibuat."
    },

    // ANOMALI 07 — The Split Witness
    {
        id: "visitor_014",
        name: "The Split Witness",
        status: "anomaly",

        greeting:
            '"One of us has already spoken to you."',

        normalClue:
            "Ia terlihat gelisah ketika membicarakan orang lain.",

        anomalyClue:
            "Satu sisi wajahnya seakan bereaksi berbeda dari sisi lainnya."
    },

    // Pengunjung normal tambahan — The Late Supporter
    {
        id: "visitor_015",
        name: "The Late Supporter",
        status: "normal",

        greeting:
            '"I am sorry I arrived so late. Is there still time?"',

        normalClue:
            "Ia datang terlambat dan meminta maaf dengan sopan.",

        anomalyClue:
            "Jam tangannya berhenti pada waktu yang sama dengan waktu kedatanganmu."
    },

    // ANOMALI 08 — The Mouth That Waits
    {
        id: "visitor_016",
        name: "The Mouth That Waits",
        status: "anomaly",

        greeting:
            '"Do not listen to what I say next."',

        normalClue:
            "Ia berbicara pelan dan tampak kelelahan.",

        anomalyClue:
            "Mulutnya bergerak sebelum suaranya terdengar."
    }
];

/* =========================================================

   BAGIAN 4 — DATA KERTAS

   ========================================================= */

const PAPER_DATABASE = [

    {

        id: "paper_001",

        status: "normal",

        clue:

            "Kertas terlihat bersih. Nama dan tanggal pada formulir sesuai dengan acara."

    },

    {

        id: "paper_002",

        status: "anomaly",

        clue:

            "Tanggal pada kertas menunjukkan hari esok, bukan tanggal acara."

    },

    {

        id: "paper_003",

        status: "normal",

        clue:

            "Permukaan kertas biasa. Tidak ada tulisan lain selain identitas pemiliknya."

    },

    {

        id: "paper_004",

        status: "anomaly",

        clue:

            "Ada tulisan tangan di bagian bawah yang terlihat seperti tanda tanganmu sendiri."

    },

    {

        id: "paper_005",

        status: "normal",

        clue:

            "Nomor formulir dan nama pemilik terlihat konsisten."

    },

    {

        id: "paper_006",

        status: "anomaly",

        clue:

            "Bagian belakang kertas memiliki tulisan yang tidak terlihat pada sisi depan."

    },

    {

        id: "paper_007",

        status: "normal",

        clue:

            "Kertas tampak seperti formulir resmi acara dengan informasi yang masuk akal."

    },

    {

        id: "paper_008",

        status: "anomaly",

        clue:

            "Nama yang tercetak pada kertas berubah ketika kamu melihatnya kembali."

    },

    // Kertas normal tambahan
    {
        id: "paper_009",
        status: "normal",

        clue:
            "Nomor formulir, tanggal, dan identitas pengunjung terlihat konsisten."
    },

    // PAPER ANOMALY 05
    {
        id: "paper_010",
        status: "anomaly",

        clue:
            "Tanggal yang tercetak berbeda dari tanggal formulir sebelumnya, seolah tanggalnya berubah."
    },

    // Kertas normal tambahan
    {
        id: "paper_011",
        status: "normal",

        clue:
            "Garis tanda tangan masih kosong dan tidak ada cap yang mencurigakan."
    },

    // PAPER ANOMALY 06
    {
        id: "paper_012",
        status: "anomaly",

        clue:
            "Ada tanda tangan tambahan yang hampir sama dengan tanda tanganmu, tetapi bentuk hurufnya terbalik."
    },

    // Kertas normal tambahan
    {
        id: "paper_013",
        status: "normal",

        clue:
            "Semua tulisan mengikuti format formulir resmi dan berada pada kolom yang tepat."
    },

    // PAPER ANOMALY 07
    {
        id: "paper_014",
        status: "anomaly",

        clue:
            "Tulisan 'DO NOT SIGN' muncul melintasi garis formulir dengan tinta yang berbeda."
    },

    // Kertas normal tambahan
    {
        id: "paper_015",
        status: "normal",

        clue:
            "Nama pengunjung dan nomor arsip tercetak dengan rapi."
    },

    // PAPER ANOMALY 08
    {
        id: "paper_016",
        status: "anomaly",

        clue:
            "Kolom nama menampilkan 'NO ONE', padahal formulir mengidentifikasi pemilik sebagai VISITOR."
    }
];

/* =========================================================

   BAGIAN 5 — STATE GAME

   ========================================================= */

const GAME_STATE = {

    score: GAME_SETTINGS.initialScore,

    lives: GAME_SETTINGS.initialLives,

    visitorNumber: 1,

    currentVisitor: null,

    currentPaper: null,

    isWaitingForDecision: true,

    isGameOver: false,

    paperInspected: false,

    highScore: 0,

    newRecord: false

};

/* =========================================================

   BAGIAN 6 — AUDIO

   ========================================================= */

/*

 * Musik latar dicoba diputar setelah interaksi pertama

 * pemain karena browser biasanya memblokir autoplay.

 *

 * Nama file harus sesuai dengan file yang ada di folder

 * audio/ dan src pada index.html.

 */

let backgroundMusicStarted = false;

function playSound(audioElement) {

    if (!audioElement) {

        return;

    }

    try {

        audioElement.pause();

        audioElement.currentTime = 0;

        const playPromise = audioElement.play();

        if (playPromise && typeof playPromise.catch === "function") {

            playPromise.catch((error) => {

                console.warn("Audio tidak dapat diputar:", error);

            });

        }

    } catch (error) {

        console.warn("Gagal memutar audio:", error);

    }

}

function startBackgroundMusic() {

    const music = GAME_UI.backgroundMusic;

    if (!music || backgroundMusicStarted) {

        return;

    }

    music.volume = 0.25;

    const playPromise = music.play();

    if (playPromise && typeof playPromise.then === "function") {

        playPromise

            .then(() => {

                backgroundMusicStarted = true;

            })

            .catch((error) => {

                /*

                 * Jika browser menolak autoplay, kesempatan

                 * berikutnya akan dicoba pada interaksi lain.

                 */

                console.warn(

                    "Musik latar belum bisa diputar:",

                    error

                );

            });

    } else {

        backgroundMusicStarted = true;

    }

}

function initializeAudio() {

    /*

     * Musik baru dimulai setelah pemain berinteraksi

     * dengan halaman.

     */

    const startMusicOnInteraction = () => {

        startBackgroundMusic();

    };

    document.addEventListener(

        "pointerdown",

        startMusicOnInteraction

    );

    document.addEventListener(

        "keydown",

        startMusicOnInteraction

    );

}

/* =========================================================

   BAGIAN 7 — PENYIMPANAN HIGH SCORE

   ========================================================= */

function getSavedHighScore() {

    /*

     * Gunakan GameStorage jika tersedia.

     */

    if (

        window.GameStorage &&

        typeof window.GameStorage.loadHighScore === "function"

    ) {

        return window.GameStorage.loadHighScore();

    }

    /*

     * Fallback jika storage.js belum tersedia.

     */

    try {

        const savedScore = localStorage.getItem(

            GAME_SETTINGS.storageKey

        );

        const parsedScore = Number(savedScore);

        if (

            savedScore === null ||

            !Number.isFinite(parsedScore) ||

            parsedScore < 0

        ) {

            return 0;

        }

        return parsedScore;

    } catch (error) {

        console.warn("High score tidak dapat dibaca.", error);

        return 0;

    }

}

function saveHighScore(score) {

    /*

     * Gunakan GameStorage jika tersedia.

     */

    if (

        window.GameStorage &&

        typeof window.GameStorage.saveHighScore === "function"

    ) {

        window.GameStorage.saveHighScore(score);

        return;

    }

    try {

        localStorage.setItem(

            GAME_SETTINGS.storageKey,

            String(score)

        );

    } catch (error) {

        console.warn("High score tidak dapat disimpan.", error);

    }

}

/* =========================================================

   BAGIAN 8 — FUNGSI BANTUAN

   ========================================================= */

function getRandomItem(items) {

    const randomIndex = Math.floor(

        Math.random() * items.length

    );

    return items[randomIndex];

}

function generateCase() {

    /*

     * Pengunjung dan kertas dipilih secara independen.

     * Keduanya tidak harus memiliki status yang sama.

     */

    GAME_STATE.currentVisitor = {

        ...getRandomItem(VISITOR_DATABASE)

    };

    GAME_STATE.currentPaper = {

        ...getRandomItem(PAPER_DATABASE)

    };

    GAME_STATE.paperInspected = false;

}

function isGameUIReady() {

    const requiredElements = [

        GAME_UI.score,

        GAME_UI.highScore,

        GAME_UI.lives,

        GAME_UI.fanNumber,

        GAME_UI.fanMessage,

        GAME_UI.signButton,

        GAME_UI.rejectButton,

        GAME_UI.feedback,

        GAME_UI.gameOverScreen

    ];

    return requiredElements.every(

        (element) => element !== null

    );

}

/* =========================================================

   BAGIAN 9 — MEMPERBARUI TAMPILAN

   ========================================================= */

function renderScore() {

    if (GAME_UI.score) {

        GAME_UI.score.textContent = String(

            GAME_STATE.score

        ).padStart(3, "0");

    }

}

function renderHighScore() {

    if (GAME_UI.highScore) {

        GAME_UI.highScore.textContent = String(

            GAME_STATE.highScore

        ).padStart(3, "0");

    }

}

function renderLives() {

    if (GAME_UI.lives) {

        GAME_UI.lives.textContent = String(

            GAME_STATE.lives

        );

    }

}

function renderGameStatus() {

    renderScore();

    renderHighScore();

    renderLives();

}

/* =========================================================

   BAGIAN 10 — MENAMPILKAN PENGUNJUNG

   ========================================================= */

function getVisitorClueElement() {

    let clueElement = document.getElementById("visitorClue");

    if (clueElement) {

        return clueElement;

    }

    clueElement = document.createElement("p");

    clueElement.id = "visitorClue";

    clueElement.className = "game-clue visitor-clue";

    if (

        GAME_UI.fanMessage &&

        GAME_UI.fanMessage.parentElement

    ) {

        GAME_UI.fanMessage.parentElement.appendChild(

            clueElement

        );

    } else if (GAME_UI.fanArea) {

        GAME_UI.fanArea.appendChild(clueElement);

    }

    return clueElement;

}

function renderVisitor() {

    const visitor = GAME_STATE.currentVisitor;

    if (!visitor) {

        return;

    }

    if (GAME_UI.fanNumber) {

        GAME_UI.fanNumber.textContent =

            `VISITOR #${String(

                GAME_STATE.visitorNumber

            ).padStart(3, "0")}`;

    }

    if (GAME_UI.fanMessage) {

        GAME_UI.fanMessage.textContent = visitor.greeting;

    }

    const clueElement = getVisitorClueElement();

    if (clueElement) {

        const clueText =

            visitor.status === "anomaly"

                ? visitor.anomalyClue

                : visitor.normalClue;

        clueElement.textContent = `OBSERVATION: ${clueText}`;

    }

}

/* =========================================================

   BAGIAN 11 — MEMERIKSA KERTAS

   ========================================================= */

function getPaperClueElement() {

    let clueElement = document.getElementById("paperClue");

    if (clueElement) {

        return clueElement;

    }

    clueElement = document.createElement("p");

    clueElement.id = "paperClue";

    clueElement.className = "game-clue paper-clue";

    clueElement.textContent =

        "Inspect the paper before making your decision.";

    if (

        GAME_UI.paperCanvas &&

        GAME_UI.paperCanvas.parentElement

    ) {

        GAME_UI.paperCanvas.parentElement.appendChild(

            clueElement

        );

    }

    return clueElement;

}

function inspectCurrentPaper() {

    if (

        GAME_STATE.isGameOver ||

        !GAME_STATE.isWaitingForDecision

    ) {

        return;

    }

    GAME_STATE.paperInspected = true;

    const clueElement = getPaperClueElement();

    if (clueElement && GAME_STATE.currentPaper) {

        clueElement.textContent =

            `PAPER OBSERVATION: ${GAME_STATE.currentPaper.clue}`;

        clueElement.classList.add("is-inspected");

    }

    if (GAME_UI.paperCanvas) {

        GAME_UI.paperCanvas.classList.add("paper-inspected");

    }

    /*

     * Meminta papers.js menggambar detail pemeriksaan,

     * jika fungsi tersebut tersedia.

     */

    if (typeof window.renderCurrentPaper === "function") {

        window.renderCurrentPaper(

            GAME_STATE.currentPaper,

            true

        );

    }

    /*

     * Memainkan efek visual pemeriksaan jika tersedia.

     */

    if (

        window.GameEffects &&

        typeof window.GameEffects.playPaperInspectionEffect === "function"

    ) {

        window.GameEffects.playPaperInspectionEffect();

    }

}

function resetPaperInspection() {

    GAME_STATE.paperInspected = false;

    const clueElement = document.getElementById("paperClue");

    if (clueElement) {

        clueElement.textContent =

            "Inspect the paper before making your decision.";

        clueElement.classList.remove("is-inspected");

    }

    if (GAME_UI.paperCanvas) {

        GAME_UI.paperCanvas.classList.remove("paper-inspected");

    }

}

/* =========================================================

   BAGIAN 12 — ATURAN KEPUTUSAN

   ========================================================= */

/*

 * SIGN hanya benar jika pengunjung DAN kertas normal.

 */

function shouldSignCurrentCase() {

    if (

        !GAME_STATE.currentVisitor ||

        !GAME_STATE.currentPaper

    ) {

        return false;

    }

    const visitorIsNormal =

        GAME_STATE.currentVisitor.status === "normal";

    const paperIsNormal =

        GAME_STATE.currentPaper.status === "normal";

    return visitorIsNormal && paperIsNormal;

}

/*

 * REJECT benar jika pengunjung ATAU kertas anomali.

 */

function shouldRejectCurrentCase() {

    return !shouldSignCurrentCase();

}

function getCorrectDecisionExplanation() {

    const visitor = GAME_STATE.currentVisitor;

    const paper = GAME_STATE.currentPaper;

    if (!visitor || !paper) {

        return "The case could not be evaluated.";

    }

    const visitorIsNormal = visitor.status === "normal";

    const paperIsNormal = paper.status === "normal";

    if (visitorIsNormal && paperIsNormal) {

        return (

            "The visitor and the paper are both normal. " +

            "The autograph was safe to give."

        );

    }

    if (!visitorIsNormal && !paperIsNormal) {

        return (

            "Both the visitor and the paper were anomalous. " +

            "Either one would have been enough to reject the case."

        );

    }

    if (!visitorIsNormal) {

        return (

            "The paper was normal, but the visitor was an anomaly. " +

            "A normal paper does not make an unsafe visitor safe."

        );

    }

    return (

        "The visitor was normal, but the paper was anomalous. " +

        "Never sign a suspicious paper."

    );

}

/* =========================================================

   BAGIAN 13 — FEEDBACK KEPUTUSAN

   ========================================================= */

function showDecisionFeedback(isCorrect, action) {

    if (!GAME_UI.feedback) {

        return;

    }

    if (GAME_UI.feedbackTitle) {

        GAME_UI.feedbackTitle.textContent =

            isCorrect

                ? "DECISION ACCEPTED"

                : "DECISION FAILED";

    }

    if (GAME_UI.feedbackMessage) {

        const explanation = getCorrectDecisionExplanation();

        if (isCorrect) {

            GAME_UI.feedbackMessage.textContent =

                `Correct decision. +1 POINT. ${explanation}`;

        } else {

            GAME_UI.feedbackMessage.textContent =

                `Wrong decision. -1 LIFE. ${explanation}`;

        }

    }

    GAME_UI.feedback.classList.remove("hidden");

    if (GAME_UI.gameScene) {

        GAME_UI.gameScene.classList.toggle(

            "shake",

            !isCorrect

        );

    }

    if (GAME_UI.nextButton) {

        GAME_UI.nextButton.textContent =

            GAME_STATE.lives <= 0

                ? "VIEW RESULTS"

                : "NEXT VISITOR";

    }

    /*

     * action tetap menjadi parameter supaya mudah

     * digunakan untuk pengembangan feedback berikutnya.

     */

    void action;

}

function hideDecisionFeedback() {

    if (GAME_UI.feedback) {

        GAME_UI.feedback.classList.add("hidden");

    }

    if (GAME_UI.gameScene) {

        GAME_UI.gameScene.classList.remove("shake");

    }

}

/* =========================================================

   BAGIAN 14 — STATISTIK KEPUTUSAN

   ========================================================= */

function recordDecisionStatistics(action, isCorrect) {

    if (

        window.GameStorage &&

        typeof window.GameStorage.recordDecision === "function"

    ) {

        const isAnomaly =

            shouldRejectCurrentCase();

        window.GameStorage.recordDecision(

            action,

            isCorrect,

            isAnomaly

        );

    }

}

/* =========================================================

   BAGIAN 15 — MEMPROSES KEPUTUSAN

   ========================================================= */

function processDecision(action) {

    /*

     * Mencegah pemain memproses keputusan lebih dari

     * sekali untuk pengunjung yang sama.

     */

    if (

        !GAME_STATE.isWaitingForDecision ||

        GAME_STATE.isGameOver

    ) {

        return;

    }

    /*

     * Pastikan hanya SIGN atau REJECT yang diterima.

     */

    if (

        action !== GAME_SETTINGS.actions.sign &&

        action !== GAME_SETTINGS.actions.reject

    ) {

        console.warn("Aksi tidak dikenal:", action);

        return;

    }

    GAME_STATE.isWaitingForDecision = false;

    const correctAction = shouldSignCurrentCase()

        ? GAME_SETTINGS.actions.sign

        : GAME_SETTINGS.actions.reject;

    const isCorrect = action === correctAction;

    /*

     * ATURAN SKOR:

     *

     * Setiap keputusan benar mendapat +1.

     * Ini termasuk REJECT jika terdapat anomali.

     *

     * Keputusan salah tidak menambah skor dan mengurangi

     * satu nyawa.

     */

    if (isCorrect) {

        GAME_STATE.score += 1;

        playSound(GAME_UI.correctSound);

    } else {

        GAME_STATE.lives = Math.max(

            0,

            GAME_STATE.lives - 1

        );

        playSound(GAME_UI.wrongSound);

    }

    /*

     * Catat statistik apabila storage.js tersedia.

     */

    recordDecisionStatistics(action, isCorrect);

    /*

     * Perbarui high score.

     */

    if (GAME_STATE.score > GAME_STATE.highScore) {

        GAME_STATE.highScore = GAME_STATE.score;

        GAME_STATE.newRecord = true;

        saveHighScore(GAME_STATE.highScore);

    }

    /*

     * Perbarui header dan tampilkan feedback.

     */

    renderGameStatus();

    showDecisionFeedback(isCorrect, action);

    /*

     * Jika nyawa habis, permainan berakhir setelah

     * pemain membuka hasil melalui tombol berikutnya.

     */

    if (GAME_STATE.lives <= 0) {

        GAME_STATE.isGameOver = true;

    }

}

/* =========================================================

   BAGIAN 16 — AKSI SIGN DAN REJECT

   ========================================================= */

function signCurrentCase() {

    processDecision(GAME_SETTINGS.actions.sign);

}

function rejectCurrentCase() {

    processDecision(GAME_SETTINGS.actions.reject);

}

/* =========================================================

   BAGIAN 17 — RENDER KASUS SAAT INI

   ========================================================= */

function renderCurrentCase() {

    renderVisitor();

    resetPaperInspection();

    if (typeof window.renderCurrentCharacter === "function") {

        window.renderCurrentCharacter(

            GAME_STATE.currentVisitor

        );

    }

    if (typeof window.renderCurrentPaper === "function") {

        window.renderCurrentPaper(

            GAME_STATE.currentPaper

        );

    }

}

/* =========================================================

   BAGIAN 18 — PENGUNJUNG BERIKUTNYA

   ========================================================= */

function nextVisitor() {

    if (GAME_STATE.isGameOver) {

        showGameOver();

        return;

    }

    hideDecisionFeedback();

    GAME_STATE.visitorNumber += 1;

    GAME_STATE.isWaitingForDecision = true;

    generateCase();

    renderCurrentCase();

}

/* =========================================================

   BAGIAN 19 — GAME OVER

   ========================================================= */

function showGameOver() {

    GAME_STATE.isGameOver = true;

    if (GAME_UI.feedback) {

        GAME_UI.feedback.classList.add("hidden");

    }

    if (GAME_UI.gameOverScreen) {

        GAME_UI.gameOverScreen.classList.remove("hidden");

    }

    if (GAME_UI.finalScore) {

        GAME_UI.finalScore.textContent = String(

            GAME_STATE.score

        ).padStart(3, "0");

    }

    if (GAME_UI.newRecordMessage) {

        GAME_UI.newRecordMessage.textContent =

            GAME_STATE.newRecord

                ? "NEW HIGH SCORE"

                : "";

    }

    renderGameStatus();

}

/* =========================================================

   BAGIAN 20 — RESTART GAME

   ========================================================= */

function restartGame() {

    GAME_STATE.score = GAME_SETTINGS.initialScore;

    GAME_STATE.lives = GAME_SETTINGS.initialLives;

    GAME_STATE.visitorNumber = 1;

    GAME_STATE.isWaitingForDecision = true;

    GAME_STATE.isGameOver = false;

    GAME_STATE.paperInspected = false;

    GAME_STATE.newRecord = false;

    GAME_STATE.highScore = getSavedHighScore();

    if (GAME_UI.gameOverScreen) {

        GAME_UI.gameOverScreen.classList.add("hidden");

    }

    hideDecisionFeedback();

    generateCase();

    renderGameStatus();

    renderCurrentCase();

    /*

     * Musik latar tidak di-reset saat restart agar

     * pengalaman bermain tetap berlanjut.

     */

    startBackgroundMusic();

}

/* =========================================================

   BAGIAN 21 — INISIALISASI GAME

   ========================================================= */

function initializeGameLogic() {

    if (!isGameUIReady()) {

        console.error(

            "Game tidak dapat dimulai. " +

            "Periksa kembali ID elemen di index.html."

        );

        return;

    }

    GAME_STATE.highScore = getSavedHighScore();

    generateCase();

    renderGameStatus();

    renderCurrentCase();

    GAME_UI.signButton.disabled = false;

    GAME_UI.rejectButton.disabled = false;

    /*

     * Catat game dimulai jika storage.js mendukungnya.

     */

    if (

        window.GameStorage &&

        typeof window.GameStorage.recordGameStarted === "function"

    ) {

        window.GameStorage.recordGameStarted();

    }

    console.log(

        "THE LAST AUTOGRAPH: game logic initialized."

    );

}

/* =========================================================

   BAGIAN 22 — API GAME

   ========================================================= */

window.Game = {

    init: initializeGameLogic,

    sign: signCurrentCase,

    reject: rejectCurrentCase,

    nextVisitor: nextVisitor,

    restart: restartGame,

    inspectPaper: inspectCurrentPaper,

    getState: function () {

        return {

            score: GAME_STATE.score,

            lives: GAME_STATE.lives,

            visitorNumber: GAME_STATE.visitorNumber,

            isWaitingForDecision:

                GAME_STATE.isWaitingForDecision,

            isGameOver: GAME_STATE.isGameOver,

            paperInspected:

                GAME_STATE.paperInspected,

            visitorStatus:

                GAME_STATE.currentVisitor

                    ? GAME_STATE.currentVisitor.status

                    : null,

            paperStatus:

                GAME_STATE.currentPaper

                    ? GAME_STATE.currentPaper.status

                    : null

        };

    }

};

/* =========================================================

   BAGIAN 23 — MULAI GAME

   ========================================================= */

initializeAudio();

initializeGameLogic();
