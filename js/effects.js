
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/effects.js

   Tanggung jawab:
   1. Membuat efek glitch visual.
   2. Memberi respons saat tombol ditekan.
   3. Membuat efek inspeksi kertas.
   4. Memberi efek ketika keputusan pemain salah.
   5. Menambahkan suasana psikologis tanpa aset eksternal.

   Efek dibuat dengan CSS dan JavaScript.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KONFIGURASI EFEK
   ========================================================= */

const EFFECT_CONFIG = {
    glitchDuration: 450,
    buttonDuration: 180,
    inspectDuration: 600,
    errorDuration: 500,

    /*
     * Frekuensi gangguan acak.
     * Angka lebih kecil berarti efek lebih sering.
     */
    ambientGlitchChance: 0.12
};


/* =========================================================
   BAGIAN 2 — REFERENSI ELEMEN
   ========================================================= */

const EFFECT_UI = {
    game: document.getElementById("game"),
    gameScene: document.getElementById("gameScene"),

    characterCanvas: document.getElementById("characterCanvas"),
    paperCanvas: document.getElementById("paperCanvas"),

    signButton: document.getElementById("signButton"),
    rejectButton: document.getElementById("rejectButton"),
    inspectPaper: document.getElementById("inspectPaper"),

    feedback: document.getElementById("feedback"),
    feedbackTitle: document.getElementById("feedbackTitle"),
    feedbackMessage: document.getElementById("feedbackMessage")
};


/* =========================================================
   BAGIAN 3 — MEMBUAT CSS EFEK
   =========================================================

   Kita memasukkan CSS dari JavaScript agar tidak perlu
   mengubah style.css pada tahap ini.
   ========================================================= */

function installEffectStyles() {

    if (document.getElementById("lastAutographEffectStyles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "lastAutographEffectStyles";

    style.textContent = `

        /* -----------------------------------------------
           Efek tombol ditekan
           ----------------------------------------------- */

        .la-button-pressed {
            animation: laButtonPressed
                ${EFFECT_CONFIG.buttonDuration}ms
                ease-out;
        }

        @keyframes laButtonPressed {

            0% {
                transform: scale(1);
            }

            45% {
                transform: scale(0.96);
            }

            100% {
                transform: scale(1);
            }

        }


        /* -----------------------------------------------
           Gangguan visual pada karakter
           ----------------------------------------------- */

        .la-character-glitch {
            animation: laCharacterGlitch
                ${EFFECT_CONFIG.glitchDuration}ms
                steps(2, end);
        }

        @keyframes laCharacterGlitch {

            0% {
                filter: none;
                transform: translateX(0);
            }

            20% {
                filter:
                    contrast(1.3)
                    saturate(0.5)
                    hue-rotate(-12deg);

                transform: translateX(-3px);
            }

            40% {
                filter:
                    contrast(1.5)
                    hue-rotate(18deg);

                transform: translateX(2px);
            }

            60% {
                filter:
                    brightness(0.8)
                    contrast(1.4);

                transform: translateX(-1px);
            }

            100% {
                filter: none;
                transform: translateX(0);
            }

        }


        /* -----------------------------------------------
           Efek kertas diperiksa
           ----------------------------------------------- */

        .la-paper-inspecting {
            animation: laPaperInspect
                ${EFFECT_CONFIG.inspectDuration}ms
                ease-out;
        }

        @keyframes laPaperInspect {

            0% {
                filter: brightness(1);
                transform: translateY(0);
            }

            25% {
                filter: brightness(1.2);
                transform: translateY(-2px);
            }

            50% {
                filter: brightness(0.92);
                transform: translateY(1px);
            }

            100% {
                filter: brightness(1);
                transform: translateY(0);
            }

        }


        /* -----------------------------------------------
           Gangguan saat keputusan salah
           ----------------------------------------------- */

        .la-error-glitch {
            animation: laErrorGlitch
                ${EFFECT_CONFIG.errorDuration}ms
                steps(2, end);
        }

        @keyframes laErrorGlitch {

            0% {
                filter: none;
                transform: translateX(0);
            }

            15% {
                filter: contrast(1.6);
                transform: translateX(-4px);
            }

            30% {
                filter: hue-rotate(-15deg);
                transform: translateX(3px);
            }

            45% {
                filter: contrast(1.4);
                transform: translateX(-2px);
            }

            60% {
                filter: brightness(0.8);
                transform: translateX(2px);
            }

            100% {
                filter: none;
                transform: translateX(0);
            }

        }


        /* -----------------------------------------------
           Kilatan merah sangat singkat
           ----------------------------------------------- */

        .la-red-flash {
            animation: laRedFlash 300ms ease-out;
        }

        @keyframes laRedFlash {

            0% {
                box-shadow: inset 0 0 0 rgba(160, 20, 30, 0);
            }

            35% {
                box-shadow:
                    inset 0 0 55px rgba(160, 20, 30, 0.2);
            }

            100% {
                box-shadow: inset 0 0 0 rgba(160, 20, 30, 0);
            }

        }


        /* -----------------------------------------------
           Efek inspeksi yang tidak terlalu mencolok
           ----------------------------------------------- */

        .la-inspected-border {
            outline: 1px solid rgba(185, 40, 48, 0.7);
            outline-offset: 2px;
        }


        /* -----------------------------------------------
           Menghormati pengaturan pengurangan animasi
           ----------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {

            .la-button-pressed,
            .la-character-glitch,
            .la-paper-inspecting,
            .la-error-glitch,
            .la-red-flash {
                animation-duration: 1ms !important;
            }

        }

    `;

    document.head.appendChild(style);

}


/* =========================================================
   BAGIAN 4 — HELPER ANIMASI
   ========================================================= */


/**
 * Mengulang animasi dengan menghapus dan memasang kembali
 * class CSS.
 */
function replayEffect(element, className, duration) {

    if (!element) {
        return;
    }

    element.classList.remove(className);

    /*
     * Memaksa browser membaca ukuran elemen agar animasi
     * yang sama dapat dijalankan kembali.
     */
    void element.offsetWidth;

    element.classList.add(className);

    window.setTimeout(function () {

        element.classList.remove(className);

    }, duration);

}


/**
 * Menambahkan animasi pada tombol.
 */
function animateButton(button) {

    replayEffect(
        button,
        "la-button-pressed",
        EFFECT_CONFIG.buttonDuration + 50
    );

}


/* =========================================================
   BAGIAN 5 — EFEK INSPEKSI KERTAS
   ========================================================= */


/**
 * Memberi respons visual ketika pemain menekan
 * Inspect Paper.
 */
function playPaperInspectionEffect() {

    const paper = document.getElementById(
        "paperCanvas"
    );

    if (!paper) {
        return;
    }

    replayEffect(
        paper,
        "la-paper-inspecting",
        EFFECT_CONFIG.inspectDuration + 50
    );

    /*
     * Bingkai ini membantu pemain memahami bahwa
     * kertas sedang diperiksa.
     */
    paper.classList.add("la-inspected-border");

    window.setTimeout(function () {

        paper.classList.remove("la-inspected-border");

    }, EFFECT_CONFIG.inspectDuration);

    /*
     * Jika kertas merupakan anomali, sesekali tambahkan
     * gangguan kecil pada karakter.
     *
     * Efek ini tidak mengubah status kasus.
     */
    if (
        typeof GAME_STATE !== "undefined" &&
        GAME_STATE.currentPaper &&
        GAME_STATE.currentPaper.status === "anomaly"
    ) {

        if (Math.random() < 0.65) {

            playCharacterGlitch();

        }

    }

}


/* =========================================================
   BAGIAN 6 — EFEK KARAKTER
   ========================================================= */


/**
 * Memberi gangguan singkat pada canvas karakter.
 */
function playCharacterGlitch() {

    const character = document.getElementById(
        "characterCanvas"
    );

    replayEffect(
        character,
        "la-character-glitch",
        EFFECT_CONFIG.glitchDuration + 50
    );

}


/**
 * Gangguan visual pada seluruh area permainan.
 */
function playGameErrorEffect() {

    const scene = document.getElementById(
        "gameScene"
    );

    const game = document.getElementById(
        "game"
    );

    replayEffect(
        scene,
        "la-error-glitch",
        EFFECT_CONFIG.errorDuration + 50
    );

    replayEffect(
        game,
        "la-red-flash",
        350
    );

    /*
     * Karakter juga dapat mengalami gangguan saat
     * pemain mengambil keputusan yang salah.
     */
    playCharacterGlitch();

}


/* =========================================================
   BAGIAN 7 — EFEK FEEDBACK
   ========================================================= */


/**
 * Memeriksa judul feedback untuk menentukan apakah
 * pemain membuat kesalahan.
 */
function handleFeedbackChange() {

    const feedback = document.getElementById(
        "feedback"
    );

    const title = document.getElementById(
        "feedbackTitle"
    );

    if (!feedback || !title) {
        return;
    }

    /*
     * Abaikan feedback yang sedang disembunyikan.
     */
    if (feedback.classList.contains("hidden")) {
        return;
    }

    const titleText =
        title.textContent.trim().toUpperCase();

    if (titleText === "DECISION FAILED") {

        playGameErrorEffect();

    }

}


/* =========================================================
   BAGIAN 8 — EFEK SAAT TOMBOL DIKLIK
   ========================================================= */


/**
 * Menghubungkan animasi ke tombol.
 */
function registerEffectButtonEvents() {

    const buttons = [
        EFFECT_UI.signButton,
        EFFECT_UI.rejectButton,
        EFFECT_UI.inspectPaper,
        document.getElementById("nextButton"),
        document.getElementById("restartButton")
    ];

    buttons.forEach(function (button) {

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            function () {

                animateButton(button);

            }
        );

    });


    /*
     * Event khusus untuk inspeksi kertas.
     */
    if (EFFECT_UI.inspectPaper) {

        EFFECT_UI.inspectPaper.addEventListener(
            "click",
            function () {

                playPaperInspectionEffect();

            }
        );

    }

}


/* =========================================================
   BAGIAN 9 — MEMANTAU FEEDBACK
   ========================================================= */


/**
 * Menggunakan MutationObserver agar efek kesalahan
 * dijalankan ketika feedback diperbarui oleh game.js.
 */
function registerFeedbackObserver() {

    const feedback = document.getElementById(
        "feedback"
    );

    const title = document.getElementById(
        "feedbackTitle"
    );

    if (!feedback || !title) {
        return;
    }

    const observer = new MutationObserver(
        function () {

            handleFeedbackChange();

        }
    );

    observer.observe(
        feedback,
        {
            attributes: true,
            attributeFilter: ["class"]
        }
    );

    observer.observe(
        title,
        {
            childList: true,
            characterData: true,
            subtree: true
        }
    );

}


/* =========================================================
   BAGIAN 10 — EFEK AMBIENT
   ========================================================= */


/**
 * Gangguan kecil yang sesekali terjadi ketika kasus
 * anomali sedang aktif.
 *
 * Tidak ada loop animasi terus-menerus agar halaman
 * tetap ringan.
 */
function tryAmbientGlitch() {

    if (
        typeof GAME_STATE === "undefined" ||
        !GAME_STATE.currentVisitor
    ) {
        return;
    }

    if (
        GAME_STATE.currentVisitor.status !== "anomaly"
    ) {
        return;
    }

    if (
        Math.random() <
        EFFECT_CONFIG.ambientGlitchChance
    ) {

        playCharacterGlitch();

    }

}


/* =========================================================
   BAGIAN 11 — INISIALISASI
   ========================================================= */


/**
 * Menyiapkan efek setelah halaman selesai diproses.
 */
function initializeEffects() {

    installEffectStyles();

    registerEffectButtonEvents();

    registerFeedbackObserver();

    console.log(
        "THE LAST AUTOGRAPH: visual effects initialized."
    );

}


/* =========================================================
   BAGIAN 12 — API EFEK
   ========================================================= */

window.GameEffects = {

    init: initializeEffects,

    playCharacterGlitch: playCharacterGlitch,

    playPaperInspectionEffect: playPaperInspectionEffect,

    playGameErrorEffect: playGameErrorEffect,

    tryAmbientGlitch: tryAmbientGlitch

};


/* =========================================================
   BAGIAN 13 — MULAI
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeEffects
    );

} else {

    initializeEffects();

}
