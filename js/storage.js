
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/storage.js

   Tanggung jawab:
   1. Menyimpan dan membaca high score.
   2. Menyimpan statistik permainan.
   3. Menghitung jumlah permainan.
   4. Mencatat jumlah keputusan benar dan salah.
   5. Menyediakan fungsi reset data.

   Penyimpanan menggunakan localStorage browser.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KONFIGURASI PENYIMPANAN
   ========================================================= */

const STORAGE_CONFIG = {

    /*
     * Key high score lama dari game.js.
     * Dipertahankan agar kompatibel dengan penyimpanan lama.
     */
    highScoreKey: "theLastAutographHighScore",

    /*
     * Key untuk statistik permainan.
     */
    statisticsKey: "theLastAutographStatistics",

    /*
     * Versi struktur data.
     * Berguna jika format penyimpanan berubah nanti.
     */
    version: 1

};


/* =========================================================
   BAGIAN 2 — DATA STATISTIK AWAL
   ========================================================= */

function createDefaultStatistics() {

    return {

        version: STORAGE_CONFIG.version,

        totalGames: 0,

        totalCorrectDecisions: 0,

        totalWrongDecisions: 0,

        totalSignedPapers: 0,

        totalRejectedPapers: 0,

        totalAnomaliesDetected: 0,

        totalAnomaliesMissed: 0,

        lastPlayedAt: null

    };

}


/* =========================================================
   BAGIAN 3 — HELPER LOCAL STORAGE
   ========================================================= */


/**
 * Memeriksa apakah localStorage tersedia.
 *
 * Pada browser normal, localStorage tersedia.
 * Namun, browser tertentu bisa membatasi aksesnya.
 */
function isStorageAvailable() {

    try {

        const testKey = "__lastAutographStorageTest__";

        localStorage.setItem(testKey, "test");

        localStorage.removeItem(testKey);

        return true;

    } catch (error) {

        console.warn(
            "THE LAST AUTOGRAPH: localStorage unavailable.",
            error
        );

        return false;

    }

}


/**
 * Membaca JSON dari localStorage.
 *
 * Jika data kosong atau rusak, gunakan nilai cadangan.
 */
function readStoredJSON(key, fallbackValue) {

    if (!isStorageAvailable()) {
        return fallbackValue;
    }

    try {

        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return fallbackValue;
        }

        return JSON.parse(storedValue);

    } catch (error) {

        console.warn(
            `Gagal membaca data penyimpanan: ${key}`,
            error
        );

        return fallbackValue;

    }

}


/**
 * Menyimpan data sebagai JSON.
 *
 * Mengembalikan true jika penyimpanan berhasil.
 */
function writeStoredJSON(key, value) {

    if (!isStorageAvailable()) {
        return false;
    }

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            `Gagal menyimpan data: ${key}`,
            error
        );

        return false;

    }

}


/* =========================================================
   BAGIAN 4 — HIGH SCORE
   ========================================================= */


/**
 * Membaca high score yang tersimpan.
 */
function loadHighScore() {

    if (!isStorageAvailable()) {
        return 0;
    }

    try {

        const storedValue = localStorage.getItem(
            STORAGE_CONFIG.highScoreKey
        );

        if (storedValue === null) {
            return 0;
        }

        const score = Number(storedValue);

        if (!Number.isFinite(score) || score < 0) {
            return 0;
        }

        return Math.floor(score);

    } catch (error) {

        console.warn(
            "Gagal membaca high score.",
            error
        );

        return 0;

    }

}


/**
 * Menyimpan high score baru.
 *
 * High score tidak akan diturunkan oleh fungsi ini.
 */
function saveHighScore(score) {

    const numericScore = Number(score);

    if (
        !Number.isFinite(numericScore) ||
        numericScore < 0
    ) {
        return false;
    }

    const newScore = Math.floor(numericScore);

    const previousScore = loadHighScore();

    if (newScore <= previousScore) {
        return true;
    }

    if (!isStorageAvailable()) {
        return false;
    }

    try {

        localStorage.setItem(
            STORAGE_CONFIG.highScoreKey,
            String(newScore)
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menyimpan high score.",
            error
        );

        return false;

    }

}


/* =========================================================
   BAGIAN 5 — STATISTIK PERMAINAN
   ========================================================= */


/**
 * Membaca statistik permainan.
 */
function loadStatistics() {

    const storedStatistics = readStoredJSON(
        STORAGE_CONFIG.statisticsKey,
        null
    );

    const defaults = createDefaultStatistics();

    if (
        !storedStatistics ||
        typeof storedStatistics !== "object" ||
        Array.isArray(storedStatistics)
    ) {

        return defaults;

    }

    /*
     * Menggabungkan data tersimpan dengan struktur terbaru.
     * Ini membantu saat nanti ada statistik baru.
     */
    return {

        ...defaults,

        ...storedStatistics,

        version: STORAGE_CONFIG.version

    };

}


/**
 * Menyimpan keseluruhan statistik.
 */
function saveStatistics(statistics) {

    if (
        !statistics ||
        typeof statistics !== "object" ||
        Array.isArray(statistics)
    ) {

        return false;

    }

    return writeStoredJSON(
        STORAGE_CONFIG.statisticsKey,
        {
            ...createDefaultStatistics(),
            ...statistics,
            version: STORAGE_CONFIG.version
        }
    );

}


/**
 * Menambah jumlah permainan yang telah dimulai.
 */
function recordGameStarted() {

    const statistics = loadStatistics();

    statistics.totalGames += 1;

    statistics.lastPlayedAt = new Date().toISOString();

    return saveStatistics(statistics);

}


/**
 * Mencatat keputusan pemain.
 *
 * action:
 *   "sign"   = pemain memilih SIGN
 *   "reject" = pemain memilih REJECT
 *
 * isCorrect:
 *   true  = keputusan benar
 *   false = keputusan salah
 *
 * isAnomaly:
 *   true  = kasus mengandung anomali
 *   false = pengunjung dan kertas normal
 */
function recordDecision(
    action,
    isCorrect,
    isAnomaly
) {

    const statistics = loadStatistics();

    if (isCorrect) {

        statistics.totalCorrectDecisions += 1;

    } else {

        statistics.totalWrongDecisions += 1;

    }

    if (action === "sign") {

        statistics.totalSignedPapers += 1;

    } else if (action === "reject") {

        statistics.totalRejectedPapers += 1;

    }

    if (isAnomaly) {

        if (isCorrect && action === "reject") {

            statistics.totalAnomaliesDetected += 1;

        } else if (!isCorrect) {

            statistics.totalAnomaliesMissed += 1;

        }

    }

    return saveStatistics(statistics);

}


/* =========================================================
   BAGIAN 6 — RINGKASAN STATISTIK
   ========================================================= */


/**
 * Menghasilkan ringkasan statistik untuk dashboard.
 */
function getStatisticsSummary() {

    const statistics = loadStatistics();

    const totalDecisions =
        statistics.totalCorrectDecisions +
        statistics.totalWrongDecisions;

    const accuracy = totalDecisions > 0
        ? Math.round(
            (
                statistics.totalCorrectDecisions /
                totalDecisions
            ) * 100
        )
        : 0;

    return {

        totalGames: statistics.totalGames,

        correctDecisions:
            statistics.totalCorrectDecisions,

        wrongDecisions:
            statistics.totalWrongDecisions,

        accuracy: accuracy,

        signedPapers:
            statistics.totalSignedPapers,

        rejectedPapers:
            statistics.totalRejectedPapers,

        anomaliesDetected:
            statistics.totalAnomaliesDetected,

        anomaliesMissed:
            statistics.totalAnomaliesMissed,

        lastPlayedAt:
            statistics.lastPlayedAt

    };

}


/* =========================================================
   BAGIAN 7 — RESET DATA
   ========================================================= */


/**
 * Menghapus statistik permainan.
 *
 * High score sengaja tidak dihapus.
 */
function resetStatistics() {

    if (!isStorageAvailable()) {
        return false;
    }

    try {

        localStorage.removeItem(
            STORAGE_CONFIG.statisticsKey
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menghapus statistik.",
            error
        );

        return false;

    }

}


/**
 * Menghapus semua data game yang dikelola file ini.
 *
 * Panggil hanya ketika pemain benar-benar ingin
 * menghapus high score dan statistik.
 */
function resetAllStorage() {

    if (!isStorageAvailable()) {
        return false;
    }

    try {

        localStorage.removeItem(
            STORAGE_CONFIG.highScoreKey
        );

        localStorage.removeItem(
            STORAGE_CONFIG.statisticsKey
        );

        return true;

    } catch (error) {

        console.error(
            "Gagal menghapus data permainan.",
            error
        );

        return false;

    }

}


/* =========================================================
   BAGIAN 8 — API PENYIMPANAN
   ========================================================= */

window.GameStorage = {

    isAvailable: isStorageAvailable,

    loadHighScore: loadHighScore,

    saveHighScore: saveHighScore,

    loadStatistics: loadStatistics,

    saveStatistics: saveStatistics,

    recordGameStarted: recordGameStarted,

    recordDecision: recordDecision,

    getStatisticsSummary: getStatisticsSummary,

    resetStatistics: resetStatistics,

    resetAllStorage: resetAllStorage

};


console.log(
    "THE LAST AUTOGRAPH: storage module loaded."
);
