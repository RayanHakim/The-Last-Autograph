
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/anomalies.js

   Tanggung jawab:
   1. Menyediakan katalog jenis anomali.
   2. Memberikan petunjuk visual dan perilaku.
   3. Memilih anomali yang sesuai dengan pengunjung.
   4. Menyediakan fungsi untuk mendapatkan detail anomali.

   File ini tidak menggantikan sistem pengambilan keputusan
   yang sudah ada di game.js.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KATALOG ANOMALI
   ========================================================= */

const ANOMALY_DATABASE = [

    {
        id: "wrong-reflection",
        name: "The Wrong Reflection",
        category: "Visual",

        description:
            "Pantulannya tidak mengikuti gerakannya.",

        visualClue:
            "Pantulan mata atau wajah terlihat tidak wajar.",

        behaviorClue:
            "Dia terlihat terlalu tenang ketika kamu memperhatikannya.",

        difficulty: 1,

        revealMessage:
            "Pantulannya bergerak terlambat."
    },

    {
        id: "extra-eyes",
        name: "The Extra Eyes",
        category: "Physical",

        description:
            "Ada mata tambahan yang tersembunyi di wajahnya.",

        visualClue:
            "Perhatikan area sekitar mata dan rambut.",

        behaviorClue:
            "Dia terus menatapmu tanpa mengalihkan pandangan.",

        difficulty: 2,

        revealMessage:
            "Ada sepasang mata yang seharusnya tidak ada."
    },

    {
        id: "frozen-smile",
        name: "The Frozen Smile",
        category: "Expression",

        description:
            "Senyumnya tidak berubah meskipun ekspresinya seharusnya berubah.",

        visualClue:
            "Senyum tampak terlalu simetris atau tidak alami.",

        behaviorClue:
            "Dia tersenyum bahkan ketika membicarakan hal menyedihkan.",

        difficulty: 1,

        revealMessage:
            "Senyumnya tidak pernah benar-benar berubah."
    },

    {
        id: "wrong-shadow",
        name: "The Wrong Shadow",
        category: "Environmental",

        description:
            "Bayangannya memiliki bentuk yang berbeda dari tubuhnya.",

        visualClue:
            "Bentuk bayangan tidak sesuai dengan posisi tubuh.",

        behaviorClue:
            "Bayangannya tampak bergerak ketika dia diam.",

        difficulty: 2,

        revealMessage:
            "Bayangannya tidak mengikuti bentuk tubuhnya."
    },

    {
        id: "missing-face",
        name: "The Missing Face",
        category: "Physical",

        description:
            "Sebagian ciri wajahnya tampak menghilang.",

        visualClue:
            "Ada bagian wajah yang terlalu kosong atau samar.",

        behaviorClue:
            "Dia bertingkah seolah tidak menyadari kejanggalan itu.",

        difficulty: 3,

        revealMessage:
            "Ada bagian wajahnya yang tidak pernah terbentuk."
    },

    {
        id: "delayed-movement",
        name: "The Delayed Movement",
        category: "Behavior",

        description:
            "Gerakannya seperti tertinggal dari tubuhnya sendiri.",

        visualClue:
            "Posisi mata atau kepala terlihat tidak selaras.",

        behaviorClue:
            "Dia baru bereaksi sesaat setelah kamu berbicara.",

        difficulty: 2,

        revealMessage:
            "Gerakannya tidak terjadi pada waktu yang tepat."
    },

    {
        id: "the-impossible-visitor",
        name: "The Impossible Visitor",
        category: "Identity",

        description:
            "Identitasnya tidak sesuai dengan catatan pengunjung.",

        visualClue:
            "Ada detail penampilan yang tidak cocok dengan kartu identitas.",

        behaviorClue:
            "Dia menyebutkan informasi pribadi yang belum pernah kamu berikan.",

        difficulty: 3,

        revealMessage:
            "Orang ini seharusnya tidak berada dalam daftar pengunjung."
    },

    {
        id: "the-empty-gaze",
        name: "The Empty Gaze",
        category: "Behavior",

        description:
            "Matanya terlihat seperti tidak memiliki fokus.",

        visualClue:
            "Pupil atau arah pandang tidak terlihat alami.",

        behaviorClue:
            "Dia menatap melewati dirimu, seolah kamu tidak ada.",

        difficulty: 1,

        revealMessage:
            "Tidak ada siapa pun di balik tatapan itu."
    }

];


/* =========================================================
   BAGIAN 2 — KATALOG PETUNJUK NORMAL
   =========================================================

   Pengunjung normal juga perlu memiliki variasi.
   Jangan sampai pemain menganggap setiap ciri aneh
   sebagai bukti pasti bahwa seseorang adalah anomali.
   ========================================================= */

const NORMAL_VISITOR_CLUES = [

    {
        id: "nervous-fan",
        description:
            "Tangannya sedikit gemetar karena gugup.",

        explanation:
            "Rasa gugup saat bertemu artis adalah hal yang wajar."
    },

    {
        id: "tired-fan",
        description:
            "Matanya terlihat lelah.",

        explanation:
            "Dia mungkin sudah lama mengantre."
    },

    {
        id: "quiet-fan",
        description:
            "Dia hanya berbicara sedikit.",

        explanation:
            "Tidak semua pengunjung pandai memulai percakapan."
    },

    {
        id: "awkward-smile",
        description:
            "Senyumnya terlihat canggung.",

        explanation:
            "Ekspresinya masih terlihat manusiawi dan konsisten."
    },

    {
        id: "old-paper",
        description:
            "Kertas tanda tangannya terlihat kusut.",

        explanation:
            "Kertas kusut saja bukan bukti adanya anomali."
    }

];


/* =========================================================
   BAGIAN 3 — MEMILIH ANOMALI
   ========================================================= */


/**
 * Mengambil anomali secara acak.
 *
 * @param {Array} excludedIds
 * ID anomali yang tidak ingin dipilih kembali.
 *
 * @returns {Object|null}
 */
function getRandomAnomaly(excludedIds = []) {

    const availableAnomalies = ANOMALY_DATABASE.filter(
        function (anomaly) {
            return !excludedIds.includes(anomaly.id);
        }
    );

    if (availableAnomalies.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(
        Math.random() * availableAnomalies.length
    );

    return {
        ...availableAnomalies[randomIndex]
    };
}


/**
 * Mencari anomali berdasarkan ID.
 */
function getAnomalyById(anomalyId) {

    const anomaly = ANOMALY_DATABASE.find(
        function (item) {
            return item.id === anomalyId;
        }
    );

    return anomaly ? { ...anomaly } : null;
}


/**
 * Mengambil petunjuk normal secara acak.
 */
function getRandomNormalClue() {

    const randomIndex = Math.floor(
        Math.random() * NORMAL_VISITOR_CLUES.length
    );

    return {
        ...NORMAL_VISITOR_CLUES[randomIndex]
    };
}


/* =========================================================
   BAGIAN 4 — MEMBACA STATUS PENGUNJUNG
   ========================================================= */


/**
 * Mendapatkan anomali yang terhubung dengan pengunjung.
 *
 * Catatan:
 * Sistem game.js saat ini hanya menyimpan status
 * "normal" atau "anomaly". Fungsi ini tetap bisa digunakan
 * meskipun pengunjung belum memiliki anomalyId.
 */
function getVisitorAnomaly(visitor) {

    if (!visitor || visitor.status !== "anomaly") {
        return null;
    }

    if (visitor.anomalyId) {
        return getAnomalyById(visitor.anomalyId);
    }

    /*
     * Jika visitor belum memiliki anomalyId, kita pilih
     * anomali secara acak untuk kebutuhan petunjuk.
     *
     * Pemilihan ini belum disimpan ke visitor. Karena itu,
     * pemanggilan ulang bisa menghasilkan anomali berbeda.
     * Gunakan assignAnomalyToVisitor() untuk menyimpannya.
     */
    return getRandomAnomaly();
}


/**
 * Memasang anomali pada objek pengunjung.
 *
 * Fungsi ini mengubah objek visitor yang diberikan.
 * Panggil sekali ketika sebuah kasus baru dibuat.
 */
function assignAnomalyToVisitor(visitor) {

    if (!visitor) {
        return visitor;
    }

    if (visitor.status !== "anomaly") {

        visitor.anomalyId = null;
        visitor.anomaly = null;

        return visitor;
    }

    /*
     * Jangan mengganti anomali yang sudah ditetapkan.
     */
    if (visitor.anomalyId) {

        visitor.anomaly = getAnomalyById(
            visitor.anomalyId
        );

        return visitor;
    }

    const anomaly = getRandomAnomaly();

    if (!anomaly) {
        return visitor;
    }

    visitor.anomalyId = anomaly.id;
    visitor.anomaly = anomaly;

    return visitor;
}


/* =========================================================
   BAGIAN 5 — PETUNJUK UNTUK PEMAIN
   ========================================================= */


/**
 * Menghasilkan petunjuk yang bisa ditampilkan di UI.
 *
 * Fungsi ini tidak langsung menampilkan petunjuk ke layar.
 * Pemanggil menentukan kapan petunjuk boleh diperlihatkan.
 */
function getVisitorClue(visitor) {

    if (!visitor) {
        return {
            type: "unknown",
            text: "Tidak ada informasi pengunjung."
        };
    }

    if (visitor.status === "anomaly") {

        const anomaly = assignAnomalyToVisitor(visitor);

        if (!anomaly) {
            return {
                type: "unknown",
                text: "Detail pengunjung belum tersedia."
            };
        }

        return {
            type: "anomaly",
            anomalyId: anomaly.id,
            text: anomaly.visualClue,
            category: anomaly.category
        };
    }

    const clue = getRandomNormalClue();

    return {
        type: "normal",
        clueId: clue.id,
        text: clue.description
    };
}


/**
 * Mendapatkan pesan pengungkapan setelah keputusan.
 */
function getAnomalyRevealMessage(visitor) {

    if (!visitor || visitor.status !== "anomaly") {
        return null;
    }

    const anomaly = assignAnomalyToVisitor(visitor);

    if (!anomaly) {
        return "Ada sesuatu yang tidak beres.";
    }

    return anomaly.revealMessage;
}


/* =========================================================
   BAGIAN 6 — EKSPOR API
   =========================================================

   API ini bisa dipanggil dari file lain melalui
   window.Anomalies.
   ========================================================= */

window.Anomalies = {

    database: ANOMALY_DATABASE,

    normalClues: NORMAL_VISITOR_CLUES,

    getRandomAnomaly: getRandomAnomaly,

    getAnomalyById: getAnomalyById,

    getRandomNormalClue: getRandomNormalClue,

    getVisitorAnomaly: getVisitorAnomaly,

    assignAnomalyToVisitor: assignAnomalyToVisitor,

    getVisitorClue: getVisitorClue,

    getAnomalyRevealMessage: getAnomalyRevealMessage

};


console.log(
    "THE LAST AUTOGRAPH: anomaly database loaded."
);
