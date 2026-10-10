
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/characters.js

   CHARACTER RENDERER — REVISED VERSION

   Fitur:
   1. Desain karakter stylized horror tanpa gambar eksternal.
   2. Wajah dengan gradient, bayangan, dan highlight.
   3. Variasi rambut dan pakaian.
   4. Empat desain anomali dengan ciri visual berbeda.
   5. Tampilan konsisten berdasarkan ID pengunjung.
   6. Tidak menggambar placeholder yang menimpa game.js.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KONFIGURASI
   ========================================================= */

const CHARACTER_CONFIG = {
    canvasId: "characterCanvas",
    width: 500,
    height: 560,

    colors: {
        background: "#101114",
        backgroundWarm: "#29201f",
        backgroundHorror: "#260e15",

        outline: "#171316",
        ink: "#09080b",

        skin: "#d7aa8d",
        skinShadow: "#a87564",
        skinLight: "#f0cbb0",

        hairDark: "#191619",
        hairBrown: "#493029",
        hairRed: "#382025",

        shirtDark: "#262629",
        shirtGray: "#484449",
        shirtCream: "#d2c6b3",
        shirtRed: "#75242d",

        accent: "#b52d3b",
        paper: "#e5ddcb"
    }
};


/* =========================================================
   BAGIAN 2 — REFERENSI CANVAS
   ========================================================= */

let characterCanvas = null;
let characterContext = null;


/* =========================================================
   BAGIAN 3 — HELPER GAMBAR
   ========================================================= */

function charEllipse(
    ctx,
    x,
    y,
    radiusX,
    radiusY,
    color,
    rotation = 0
) {
    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        radiusX,
        radiusY,
        rotation,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();
}


function charCircle(ctx, x, y, radius, color) {
    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = color;
    ctx.fill();
}


function charLine(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width = 2
) {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();
}


function charPolygon(
    ctx,
    points,
    fill,
    stroke = null,
    strokeWidth = 1
) {
    if (!Array.isArray(points) || points.length < 3) {
        return;
    }

    ctx.beginPath();

    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }

    ctx.closePath();

    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }

    if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
    }
}


function charRoundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    fill
) {
    const r = Math.min(
        radius,
        width / 2,
        height / 2
    );

    ctx.beginPath();

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + r
    );

    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - r,
        y + height
    );

    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - r
    );

    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);

    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();
}


/* =========================================================
   BAGIAN 4 — BACKGROUND CINEMATIC HORROR
   ========================================================= */

function drawCharacterBackground(ctx, appearance) {
    const width = CHARACTER_CONFIG.width;
    const height = CHARACTER_CONFIG.height;

    ctx.clearRect(0, 0, width, height);

    /*
     * Warna background berbeda antara manusia dan anomali.
     */
    const baseGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    if (appearance.status === "anomaly") {
        baseGradient.addColorStop(0, "#160d12");
        baseGradient.addColorStop(0.55, "#211116");
        baseGradient.addColorStop(1, "#08090b");
    } else {
        baseGradient.addColorStop(0, "#202124");
        baseGradient.addColorStop(0.6, "#19191d");
        baseGradient.addColorStop(1, "#090a0c");
    }

    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, width, height);

    /*
     * Spotlight di belakang kepala.
     */
    const glow = ctx.createRadialGradient(
        250,
        212,
        15,
        250,
        230,
        appearance.status === "anomaly" ? 245 : 215
    );

    if (appearance.status === "anomaly") {
        glow.addColorStop(0, "rgba(126, 24, 39, 0.32)");
        glow.addColorStop(0.5, "rgba(75, 17, 30, 0.16)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
        glow.addColorStop(0, "rgba(186, 154, 120, 0.13)");
        glow.addColorStop(0.55, "rgba(100, 85, 76, 0.08)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    /*
     * Garis ruangan vertikal samar.
     */
    ctx.save();

    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;

    [55, 105, 395, 445].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    });

    /*
     * Scanline tipis untuk atmosfer.
     */
    ctx.strokeStyle = "rgba(0,0,0,0.12)";

    for (let y = 5; y < height; y += 5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    ctx.restore();

    /*
     * Vignette menggelapkan pinggir gambar.
     */
    const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        390
    );

    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.63)");

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    /*
     * Bingkai.
     */
    ctx.strokeStyle = appearance.status === "anomaly"
        ? "rgba(176, 44, 56, 0.35)"
        : "rgba(255,255,255,0.10)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        12,
        12,
        width - 24,
        height - 24
    );
}


/* =========================================================
   BAGIAN 5 — BAYANGAN DI BELAKANG KARAKTER
   ========================================================= */

function drawCharacterSilhouette(ctx, appearance) {
    const isAnomaly = appearance.status === "anomaly";

    ctx.save();

    /*
     * Siluet utama di belakang kepala dan badan.
     */
    ctx.fillStyle = isAnomaly
        ? "rgba(0,0,0,0.68)"
        : "rgba(0,0,0,0.35)";

    ctx.beginPath();

    ctx.ellipse(
        250,
        550,
        isAnomaly ? 177 : 165,
        25,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    if (isAnomaly) {
        /*
         * Bayangan kedua yang sedikit bergeser,
         * memberi kesan siluet tidak cocok dengan tubuh.
         */
        ctx.fillStyle = "rgba(132, 22, 39, 0.12)";

        ctx.beginPath();

        ctx.ellipse(
            261,
            353,
            116,
            185,
            -0.04,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();
}


/* =========================================================
   BAGIAN 6 — TUBUH DAN PAKAIAN
   ========================================================= */

function drawCharacterBody(ctx, appearance) {
    /*
     * Badan dasar.
     */
    const bodyGradient = ctx.createLinearGradient(
        85,
        390,
        420,
        550
    );

    bodyGradient.addColorStop(0, "#151518");
    bodyGradient.addColorStop(0.5, appearance.shirtColor);
    bodyGradient.addColorStop(1, "#101013");

    ctx.beginPath();

    ctx.moveTo(205, 351);
    ctx.lineTo(224, 367);
    ctx.lineTo(276, 367);
    ctx.lineTo(295, 351);

    ctx.lineTo(338, 375);
    ctx.quadraticCurveTo(378, 386, 405, 430);

    ctx.lineTo(425, 560);
    ctx.lineTo(75, 560);
    ctx.lineTo(95, 430);

    ctx.quadraticCurveTo(121, 388, 162, 375);

    ctx.closePath();

    ctx.fillStyle = bodyGradient;
    ctx.fill();

    /*
     * Lapisan jaket kiri dan kanan.
     */
    charPolygon(
        ctx,
        [
            [164, 373],
            [204, 362],
            [229, 400],
            [198, 451],
            [178, 560],
            [92, 560],
            [106, 428],
            [132, 393]
        ],
        appearance.jacketColor
    );

    charPolygon(
        ctx,
        [
            [336, 373],
            [296, 362],
            [271, 400],
            [302, 451],
            [322, 560],
            [408, 560],
            [394, 428],
            [368, 393]
        ],
        appearance.jacketColor
    );

    /*
     * Highlight tepi jaket.
     */
    charLine(
        ctx,
        163,
        390,
        134,
        452,
        "rgba(255,255,255,0.08)",
        3
    );

    charLine(
        ctx,
        337,
        390,
        366,
        452,
        "rgba(0,0,0,0.30)",
        4
    );

    /*
     * Leher.
     */
    const neckGradient = ctx.createLinearGradient(
        215,
        320,
        285,
        396
    );

    neckGradient.addColorStop(0, appearance.skinLight);
    neckGradient.addColorStop(0.45, appearance.skinColor);
    neckGradient.addColorStop(1, appearance.skinShadow);

    ctx.beginPath();

    ctx.moveTo(218, 299);
    ctx.lineTo(218, 375);
    ctx.quadraticCurveTo(250, 404, 282, 375);
    ctx.lineTo(282, 299);

    ctx.closePath();

    ctx.fillStyle = neckGradient;
    ctx.fill();

    /*
     * Bayangan tepat di bawah dagu.
     */
    charEllipse(
        ctx,
        250,
        356,
        47,
        20,
        "rgba(30, 12, 15, 0.25)"
    );

    /*
     * Kerah kemeja.
     */
    charPolygon(
        ctx,
        [
            [207, 362],
            [229, 379],
            [250, 400],
            [231, 415],
            [204, 378]
        ],
        appearance.collarColor
    );

    charPolygon(
        ctx,
        [
            [293, 362],
            [271, 379],
            [250, 400],
            [269, 415],
            [296, 378]
        ],
        appearance.collarColor
    );

    /*
     * Beberapa gaya pakaian tambahan.
     */
    if (appearance.clothingStyle === "tie") {
        charPolygon(
            ctx,
            [
                [238, 393],
                [262, 393],
                [257, 416],
                [263, 473],
                [250, 493],
                [237, 473],
                [243, 416]
            ],
            appearance.accentColor
        );

        charLine(
            ctx,
            244,
            420,
            250,
            480,
            "rgba(255,255,255,0.15)",
            2
        );
    }

    if (appearance.clothingStyle === "scarf") {
        charPolygon(
            ctx,
            [
                [212, 381],
                [238, 395],
                [249, 433],
                [233, 463],
                [218, 429]
            ],
            appearance.accentColor
        );

        charPolygon(
            ctx,
            [
                [263, 394],
                [282, 381],
                [291, 424],
                [270, 446],
                [256, 419]
            ],
            appearance.accentColor
        );
    }

    if (appearance.clothingStyle === "coat") {
        charLine(
            ctx,
            218,
            421,
            228,
            548,
            "rgba(235,220,205,0.10)",
            2
        );

        charLine(
            ctx,
            282,
            421,
            272,
            548,
            "rgba(0,0,0,0.26)",
            3
        );
    }

    /*
     * Kancing kecil.
     */
    if (appearance.clothingStyle !== "scarf") {
        [443, 467, 491].forEach((y) => {
            charCircle(ctx, 250, y, 2.2, "#a19a8e");
        });
    }

    /*
     * Jahitan dan lipatan.
     */
    charLine(
        ctx,
        145,
        437,
        159,
        518,
        "rgba(255,255,255,0.055)",
        3
    );

    charLine(
        ctx,
        355,
        437,
        341,
        518,
        "rgba(0,0,0,0.25)",
        3
    );

    /*
     * Untuk karakter anomali, berikan bayangan ekstra
     * pada pakaian supaya menyatu dengan atmosfer.
     */
    if (appearance.status === "anomaly") {
        const coatShade = ctx.createLinearGradient(
            0,
            350,
            0,
            560
        );

        coatShade.addColorStop(0, "rgba(0,0,0,0)");
        coatShade.addColorStop(1, "rgba(0,0,0,0.45)");

        ctx.fillStyle = coatShade;
        ctx.fillRect(70, 350, 360, 210);
    }
}


/* =========================================================
   BAGIAN 7 — RAMBUT BAGIAN BELAKANG
   ========================================================= */

function drawHairBack(ctx, appearance) {
    const hair = appearance.hairColor;

    /*
     * Rambut dasar di atas kepala.
     */
    charEllipse(
        ctx,
        250,
        153,
        96,
        78,
        hair
    );

    if (appearance.hairStyle === "long") {
        /*
         * Rambut panjang jatuh di belakang bahu.
         */
        charPolygon(
            ctx,
            [
                [164, 147],
                [177, 111],
                [205, 93],
                [294, 93],
                [323, 115],
                [340, 158],
                [350, 376],
                [330, 424],
                [310, 368],
                [306, 210],
                [194, 210],
                [190, 368],
                [170, 424],
                [150, 374]
            ],
            hair
        );

        /*
         * Garis helaian rambut.
         */
        charLine(
            ctx,
            173,
            176,
            177,
            369,
            "rgba(255,255,255,0.06)",
            3
        );

        charLine(
            ctx,
            327,
            176,
            323,
            365,
            "rgba(0,0,0,0.25)",
            4
        );
    }

    if (appearance.hairStyle === "messy") {
        charPolygon(
            ctx,
            [
                [165, 159],
                [149, 122],
                [184, 133],
                [194, 91],
                [226, 113],
                [250, 75],
                [270, 111],
                [310, 89],
                [312, 128],
                [350, 120],
                [334, 167]
            ],
            hair
        );
    }
}


/* =========================================================
   BAGIAN 8 — TELINGA
   ========================================================= */

function drawCharacterEars(ctx, appearance) {
    charEllipse(
        ctx,
        166,
        237,
        19,
        31,
        appearance.skinColor
    );

    charEllipse(
        ctx,
        334,
        237,
        19,
        31,
        appearance.skinColor
    );

    charEllipse(
        ctx,
        168,
        239,
        9,
        18,
        appearance.skinShadow
    );

    charEllipse(
        ctx,
        332,
        239,
        9,
        18,
        appearance.skinShadow
    );

    charLine(
        ctx,
        164,
        230,
        173,
        242,
        "rgba(255,224,202,0.35)",
        2
    );

    charLine(
        ctx,
        336,
        230,
        327,
        242,
        "rgba(255,224,202,0.25)",
        2
    );
}


/* =========================================================
   BAGIAN 9 — WAJAH
   ========================================================= */

function drawCharacterFace(ctx, appearance) {
    const faceWidth = appearance.faceWidth || 82;
    const faceTop = appearance.faceTop || 102;
    const faceBottom = appearance.faceBottom || 357;

    const cheekWidth = faceWidth * 0.65;
    const faceHeight = faceBottom - faceTop;

    /*
     * Bentuk wajah dengan rahang, tidak hanya elips.
     */
    ctx.beginPath();

    ctx.moveTo(250, faceTop);

    ctx.bezierCurveTo(
        250 - faceWidth * 0.77,
        faceTop - 3,
        250 - faceWidth,
        faceTop + 48,
        250 - faceWidth,
        faceTop + faceHeight * 0.45
    );

    ctx.bezierCurveTo(
        250 - faceWidth,
        faceBottom - 46,
        250 - cheekWidth,
        faceBottom - 12,
        250,
        faceBottom
    );

    ctx.bezierCurveTo(
        250 + cheekWidth,
        faceBottom - 12,
        250 + faceWidth,
        faceBottom - 46,
        250 + faceWidth,
        faceTop + faceHeight * 0.45
    );

    ctx.bezierCurveTo(
        250 + faceWidth,
        faceTop + 48,
        250 + faceWidth * 0.77,
        faceTop - 3,
        250,
        faceTop
    );

    ctx.closePath();

    const faceGradient = ctx.createLinearGradient(
        170,
        faceTop,
        337,
        faceBottom
    );

    faceGradient.addColorStop(0, appearance.skinLight);
    faceGradient.addColorStop(0.45, appearance.skinColor);
    faceGradient.addColorStop(1, appearance.skinShadow);

    ctx.fillStyle = faceGradient;
    ctx.fill();

    ctx.save();

    /*
     * Bayangan sisi kiri wajah.
     */
    ctx.beginPath();
    ctx.ellipse(
        250 - faceWidth * 0.56,
        faceTop + faceHeight * 0.53,
        29,
        faceHeight * 0.36,
        0.08,
        0,
        Math.PI * 2
    );
    ctx.clip();

    const sideShadow = ctx.createLinearGradient(
        160,
        0,
        230,
        0
    );

    sideShadow.addColorStop(0, "rgba(35,14,19,0.30)");
    sideShadow.addColorStop(1, "rgba(35,14,19,0)");

    ctx.fillStyle = sideShadow;
    ctx.fillRect(150, faceTop, 100, faceHeight);

    ctx.restore();

    /*
     * Highlight lembut di pipi kanan.
     */
    charEllipse(
        ctx,
        281,
        226,
        24,
        55,
        "rgba(255,230,207,0.09)"
    );

    /*
     * Bayangan hidung bagian bawah.
     */
    charEllipse(
        ctx,
        250,
        275,
        18,
        8,
        "rgba(74,35,34,0.10)"
    );

    /*
     * Detail garis pipi karakter normal.
     */
    if (appearance.status === "normal") {
        charEllipse(
            ctx,
            203,
            267,
            16,
            7,
            "rgba(169,83,75,0.10)"
        );

        charEllipse(
            ctx,
            297,
            267,
            16,
            7,
            "rgba(169,83,75,0.08)"
        );
    }
}


/* =========================================================
   BAGIAN 10 — RAMBUT DEPAN
   ========================================================= */

function drawHairFront(ctx, appearance) {
    const hair = appearance.hairColor;

    /*
     * Semua gaya rambut memiliki garis rambut di atas dahi.
     */
    if (appearance.hairStyle === "short") {
        charPolygon(
            ctx,
            [
                [164, 191],
                [159, 157],
                [173, 124],
                [200, 101],
                [232, 88],
                [269, 91],
                [305, 105],
                [328, 136],
                [339, 176],
                [320, 165],
                [304, 144],
                [281, 130],
                [254, 139],
                [230, 128],
                [203, 148],
                [182, 177]
            ],
            hair
        );

        /*
         * Sideburns.
         */
        charPolygon(
            ctx,
            [
                [165, 175],
                [184, 169],
                [183, 229],
                [168, 252]
            ],
            hair
        );

        charPolygon(
            ctx,
            [
                [335, 175],
                [316, 169],
                [317, 229],
                [332, 252]
            ],
            hair
        );
    }

    if (appearance.hairStyle === "parted") {
        charPolygon(
            ctx,
            [
                [161, 187],
                [165, 147],
                [187, 112],
                [219, 92],
                [253, 91],
                [287, 99],
                [319, 123],
                [338, 162],
                [336, 190],
                [314, 160],
                [297, 137],
                [273, 124],
                [262, 146],
                [247, 126],
                [221, 139],
                [193, 153],
                [178, 190]
            ],
            hair
        );

        /*
         * Garis belah samping.
         */
        charLine(
            ctx,
            265,
            103,
            249,
            140,
            "rgba(225,204,181,0.13)",
            2
        );
    }

    if (appearance.hairStyle === "fringe") {
        charPolygon(
            ctx,
            [
                [161, 185],
                [163, 145],
                [186, 109],
                [222, 91],
                [261, 91],
                [300, 107],
                [330, 142],
                [337, 181],
                [311, 157],
                [293, 177],
                [274, 142],
                [254, 183],
                [236, 148],
                [211, 183],
                [191, 154],
                [177, 191]
            ],
            hair
        );
    }

    if (appearance.hairStyle === "long") {
        charPolygon(
            ctx,
            [
                [160, 193],
                [157, 154],
                [172, 119],
                [200, 96],
                [232, 89],
                [267, 92],
                [299, 107],
                [326, 137],
                [339, 184],
                [315, 168],
                [296, 145],
                [278, 136],
                [259, 158],
                [239, 139],
                [216, 165],
                [194, 153],
                [178, 194]
            ],
            hair
        );

        /*
         * Helai depan yang sedikit menutupi dahi.
         */
        charPolygon(
            ctx,
            [
                [211, 119],
                [231, 104],
                [238, 160],
                [222, 178]
            ],
            hair
        );

        charPolygon(
            ctx,
            [
                [288, 119],
                [302, 137],
                [282, 184],
                [270, 164]
            ],
            hair
        );
    }

    if (appearance.hairStyle === "messy") {
        charPolygon(
            ctx,
            [
                [160, 184],
                [156, 151],
                [177, 119],
                [167, 101],
                [206, 111],
                [225, 82],
                [246, 104],
                [276, 82],
                [294, 111],
                [326, 107],
                [316, 139],
                [342, 167],
                [319, 190],
                [295, 151],
                [276, 174],
                [259, 140],
                [239, 174],
                [215, 143],
                [190, 170],
                [176, 192]
            ],
            hair
        );
    }

    /*
     * Tekstur helai rambut.
     */
    ctx.save();

    ctx.strokeStyle = "rgba(235,220,207,0.09)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(204, 111);
    ctx.quadraticCurveTo(224, 94, 246, 102);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(275, 103);
    ctx.quadraticCurveTo(302, 111, 315, 135);
    ctx.stroke();

    ctx.restore();
}


/* =========================================================
   BAGIAN 11 — ALIS
   ========================================================= */

function drawCharacterEyebrows(ctx, appearance) {
    const style = appearance.browStyle || "calm";

    ctx.save();

    ctx.strokeStyle = appearance.hairColor;
    ctx.lineWidth = style === "heavy" ? 7 : 5;
    ctx.lineCap = "round";

    ctx.beginPath();

    if (style === "worried") {
        ctx.moveTo(192, 198);
        ctx.quadraticCurveTo(215, 184, 238, 201);

        ctx.moveTo(262, 201);
        ctx.quadraticCurveTo(285, 184, 308, 198);
    } else if (style === "angry") {
        ctx.moveTo(193, 190);
        ctx.lineTo(238, 204);

        ctx.moveTo(262, 204);
        ctx.lineTo(307, 190);
    } else if (style === "uneven") {
        ctx.moveTo(193, 201);
        ctx.lineTo(239, 194);

        ctx.moveTo(261, 188);
        ctx.lineTo(306, 204);
    } else {
        ctx.moveTo(193, 198);
        ctx.quadraticCurveTo(216, 190, 239, 198);

        ctx.moveTo(261, 198);
        ctx.quadraticCurveTo(284, 190, 307, 198);
    }

    ctx.stroke();

    ctx.restore();
}


/* =========================================================
   BAGIAN 12 — MATA NORMAL
   ========================================================= */

function drawNormalEye(ctx, x, y, appearance) {
    /*
     * Bayangan kelopak.
     */
    charEllipse(
        ctx,
        x,
        y + 2,
        25,
        15,
        "rgba(67,31,32,0.28)"
    );

    /*
     * Putih mata.
     */
    charEllipse(
        ctx,
        x,
        y,
        21,
        10.5,
        "#e9dfd4"
    );

    /*
     * Iris.
     */
    charEllipse(
        ctx,
        x + appearance.gazeOffset,
        y + 1,
        6.5,
        7.2,
        appearance.irisColor
    );

    /*
     * Pupil.
     */
    charEllipse(
        ctx,
        x + appearance.gazeOffset,
        y + 1,
        3.1,
        4.2,
        "#100d10"
    );

    /*
     * Kilau mata.
     */
    charCircle(
        ctx,
        x + appearance.gazeOffset - 1.5,
        y - 1,
        1.8,
        "#ffffff"
    );

    /*
     * Garis kelopak atas.
     */
    ctx.beginPath();

    ctx.moveTo(x - 23, y);
    ctx.quadraticCurveTo(x, y - 15, x + 23, y);

    ctx.strokeStyle = "#392528";
    ctx.lineWidth = 3;
    ctx.stroke();

    /*
     * Garis bawah tipis.
     */
    ctx.beginPath();

    ctx.moveTo(x - 17, y + 7);
    ctx.quadraticCurveTo(x, y + 13, x + 17, y + 7);

    ctx.strokeStyle = "rgba(76,43,42,0.35)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
}


/* =========================================================
   BAGIAN 13 — MATA ANOMALI
   ========================================================= */

function drawHollowEye(ctx, x, y, width = 23, height = 17) {
    /*
     * Rongga mata gelap, tanpa putih mata normal.
     */
    charEllipse(
        ctx,
        x,
        y,
        width + 5,
        height + 5,
        "rgba(46,11,23,0.55)"
    );

    charEllipse(
        ctx,
        x,
        y,
        width,
        height,
        "#050507"
    );

    /*
     * Pinggir merah tipis di dalam rongga.
     */
    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        width - 1,
        height - 1,
        0,
        Math.PI * 1.05,
        Math.PI * 1.95
    );

    ctx.strokeStyle = "rgba(133,25,42,0.50)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
}


function drawCharacterEyes(ctx, appearance) {
    const leftX = appearance.leftEyeX || 218;
    const rightX = appearance.rightEyeX || 282;

    const leftY = appearance.leftEyeY || 224;
    const rightY = appearance.rightEyeY || 224;

    if (appearance.eyeStyle === "void") {
        drawHollowEye(ctx, leftX, leftY, 22, 17);
        drawHollowEye(ctx, rightX, rightY, 22, 17);
        return;
    }

    if (appearance.eyeStyle === "split") {
        /*
         * Satu mata hampir manusia, satu lagi rongga hitam.
         */
        drawNormalEye(ctx, leftX, leftY, appearance);
        drawHollowEye(ctx, rightX, rightY + 3, 22, 18);
        return;
    }

    if (appearance.eyeStyle === "ink") {
        /*
         * Mata besar dan sangat gelap dengan titik merah.
         */
        drawHollowEye(ctx, leftX, leftY, 19, 22);
        drawHollowEye(ctx, rightX, rightY, 19, 22);

        charCircle(
            ctx,
            leftX + 2,
            leftY + 3,
            2.2,
            "#a72a3c"
        );

        charCircle(
            ctx,
            rightX - 2,
            rightY + 3,
            2.2,
            "#a72a3c"
        );

        return;
    }

    if (appearance.eyeStyle === "tiny") {
        /*
         * Mata terlalu kecil dibandingkan dengan wajah.
         */
        charEllipse(
            ctx,
            leftX,
            leftY,
            12,
            6,
            "#e5d8cd"
        );

        charEllipse(
            ctx,
            rightX,
            rightY,
            12,
            6,
            "#e5d8cd"
        );

        charEllipse(
            ctx,
            leftX,
            leftY,
            3,
            5,
            "#080709"
        );

        charEllipse(
            ctx,
            rightX,
            rightY,
            3,
            5,
            "#080709"
        );

        return;
    }

    /*
     * Mata manusia normal.
     */
    drawNormalEye(ctx, leftX, leftY, appearance);
    drawNormalEye(ctx, rightX, rightY, appearance);
}


/* =========================================================
   BAGIAN 14 — HIDUNG
   ========================================================= */

function drawCharacterNose(ctx, appearance) {
    const offset = appearance.noseOffset || 0;

    /*
     * Bayangan dari pangkal hidung.
     */
    ctx.beginPath();

    ctx.moveTo(250, 231);
    ctx.quadraticCurveTo(
        245 + offset,
        252,
        241 + offset,
        269
    );

    ctx.quadraticCurveTo(
        250,
        276,
        260,
        268
    );

    ctx.strokeStyle = appearance.status === "anomaly"
        ? "rgba(54,18,25,0.55)"
        : "rgba(87,48,42,0.40)";

    ctx.lineWidth = 3;
    ctx.stroke();

    /*
     * Lubang hidung.
     */
    charEllipse(
        ctx,
        244 + offset,
        273,
        4,
        2,
        "rgba(54,25,26,0.55)"
    );

    charEllipse(
        ctx,
        256 + offset,
        273,
        4,
        2,
        "rgba(54,25,26,0.55)"
    );

    /*
     * Highlight hidung.
     */
    charLine(
        ctx,
        249,
        244,
        247 + offset,
        263,
        "rgba(255,222,197,0.28)",
        2
    );
}


/* =========================================================
   BAGIAN 15 — MULUT MANUSIA NORMAL
   ========================================================= */

function drawNormalMouth(ctx, appearance) {
    const style = appearance.mouthStyle || "small-smile";

    ctx.save();

    ctx.lineCap = "round";

    if (style === "neutral") {
        charLine(
            ctx,
            231,
            306,
            269,
            306,
            "#753f40",
            2.5
        );
    } else if (style === "soft-smile") {
        ctx.beginPath();

        ctx.moveTo(225, 300);

        ctx.quadraticCurveTo(
            250,
            319,
            275,
            300
        );

        ctx.strokeStyle = "#743c40";
        ctx.lineWidth = 2.8;
        ctx.stroke();
    } else {
        /*
         * Senyum kecil dengan bibir atas dan bawah.
         */
        ctx.beginPath();

        ctx.moveTo(226, 300);

        ctx.quadraticCurveTo(
            250,
            315,
            274,
            300
        );

        ctx.strokeStyle = "#81464a";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(236, 308);

        ctx.quadraticCurveTo(
            250,
            313,
            264,
            308
        );

        ctx.strokeStyle = "rgba(226,168,153,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    ctx.restore();
}


/* =========================================================
   BAGIAN 16 — MULUT ANOMALI
   ========================================================= */

function drawWideSmile(ctx) {
    /*
     * Senyum melebar yang terlalu panjang.
     */
    ctx.beginPath();

    ctx.moveTo(193, 294);

    ctx.bezierCurveTo(
        208,
        306,
        219,
        322,
        250,
        323
    );

    ctx.bezierCurveTo(
        281,
        322,
        292,
        306,
        307,
        294
    );

    ctx.bezierCurveTo(
        302,
        329,
        282,
        342,
        250,
        343
    );

    ctx.bezierCurveTo(
        218,
        342,
        198,
        329,
        193,
        294
    );

    ctx.closePath();

    ctx.fillStyle = "#26080e";
    ctx.fill();

    ctx.strokeStyle = "#71313b";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    /*
     * Barisan gigi pucat yang tidak seragam.
     */
    charPolygon(
        ctx,
        [
            [202, 303],
            [219, 312],
            [235, 316],
            [235, 327],
            [218, 324],
            [208, 315]
        ],
        "#ddd0bd"
    );

    charPolygon(
        ctx,
        [
            [239, 317],
            [255, 318],
            [255, 331],
            [239, 331]
        ],
        "#e1d8c8"
    );

    charPolygon(
        ctx,
        [
            [261, 316],
            [278, 311],
            [292, 302],
            [287, 316],
            [277, 326],
            [261, 330]
        ],
        "#d4c8b8"
    );

    /*
     * Garis darah yang sangat tipis, bergaya ilustrasi.
     */
    charLine(
        ctx,
        202,
        317,
        210,
        327,
        "rgba(137,34,47,0.8)",
        2
    );

    charLine(
        ctx,
        297,
        316,
        290,
        327,
        "rgba(137,34,47,0.8)",
        2
    );
}


function drawSealedMouth(ctx) {
    /*
     * Mulut tipis seperti bekas jahitan.
     */
    ctx.beginPath();

    ctx.moveTo(221, 308);

    ctx.bezierCurveTo(
        237,
        301,
        262,
        313,
        279,
        306
    );

    ctx.strokeStyle = "#17090e";
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.strokeStyle = "#8b2d3c";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < 7; i++) {
        const x = 226 + i * 8;

        charLine(
            ctx,
            x,
            304 + (i % 2) * 2,
            x + 5,
            312 - (i % 2) * 2,
            "#8b2d3c",
            1.5
        );
    }
}


function drawLongMouth(ctx) {
    /*
     * Mulut vertikal yang tidak mengikuti anatomi manusia.
     */
    ctx.save();

    ctx.translate(250, 308);
    ctx.rotate(-0.03);

    const mouthGradient = ctx.createLinearGradient(
        -25,
        0,
        25,
        0
    );

    mouthGradient.addColorStop(0, "#17060b");
    mouthGradient.addColorStop(0.5, "#080609");
    mouthGradient.addColorStop(1, "#2a080f");

    charEllipse(
        ctx,
        0,
        0,
        20,
        36,
        mouthGradient
    );

    ctx.strokeStyle = "#7a2737";
    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        20,
        36,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    /*
     * Gigi-gigi yang hanya tampak sebagai garis.
     */
    for (let y = -21; y <= 21; y += 10) {
        charLine(
            ctx,
            -10,
            y,
            10,
            y + 1,
            "rgba(218,199,183,0.78)",
            2
        );
    }

    ctx.restore();
}


function drawCharacterMouth(ctx, appearance) {
    if (appearance.status === "normal") {
        drawNormalMouth(ctx, appearance);
        return;
    }

    if (appearance.mouthStyle === "wide-smile") {
        drawWideSmile(ctx);
    } else if (appearance.mouthStyle === "sealed") {
        drawSealedMouth(ctx);
    } else if (appearance.mouthStyle === "long") {
        drawLongMouth(ctx);
    } else {
        drawSealedMouth(ctx);
    }
}


/* =========================================================
   BAGIAN 17 — DETAIL WAJAH ANOMALI
   ========================================================= */

function drawAnomalyDetails(ctx, appearance) {
    /*
     * Detail gelap di sekitar mata.
     */
    if (
        appearance.eyeStyle === "void" ||
        appearance.eyeStyle === "ink"
    ) {
        charEllipse(
            ctx,
            218,
            224,
            33,
            25,
            "rgba(20,4,11,0.27)"
        );

        charEllipse(
            ctx,
            282,
            224,
            33,
            25,
            "rgba(20,4,11,0.27)"
        );
    }

    /*
     * Garis-garis retak yang halus.
     */
    if (appearance.cracks) {
        ctx.save();

        ctx.strokeStyle = "rgba(56,13,24,0.72)";
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(194, 173);
        ctx.lineTo(204, 190);
        ctx.lineTo(198, 201);
        ctx.lineTo(211, 215);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(302, 168);
        ctx.lineTo(292, 187);
        ctx.lineTo(303, 201);
        ctx.lineTo(295, 219);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(225, 280);
        ctx.lineTo(215, 292);
        ctx.lineTo(220, 300);
        ctx.stroke();

        ctx.restore();
    }

    /*
     * Garis panjang yang menyerupai urat gelap.
     */
    if (appearance.veins) {
        ctx.save();

        ctx.strokeStyle = "rgba(74,14,29,0.78)";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(205, 209);
        ctx.bezierCurveTo(
            198,
            231,
            205,
            246,
            193,
            264
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(296, 205);
        ctx.bezierCurveTo(
            304,
            226,
            295,
            246,
            307,
            260
        );

        ctx.stroke();

        ctx.restore();
    }

    /*
     * Bayangan wajah ganda.
     */
    if (appearance.doubleShadow) {
        ctx.save();

        ctx.strokeStyle = "rgba(174,31,53,0.24)";
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.ellipse(
            257,
            238,
            appearance.faceWidth + 10,
            133,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();
    }

    /*
     * Bayangan gelap di bawah mulut.
     */
    if (appearance.lowerShadow) {
        charEllipse(
            ctx,
            250,
            343,
            47,
            14,
            "rgba(20,3,8,0.32)"
        );
    }

    /*
     * Tanda di tengah dahi.
     */
    if (appearance.foreheadMark) {
        ctx.save();

        ctx.strokeStyle = "#6f202d";
        ctx.lineWidth = 2.5;

        ctx.beginPath();

        ctx.moveTo(239, 153);
        ctx.lineTo(250, 164);
        ctx.lineTo(260, 151);

        ctx.stroke();

        ctx.restore();
    }

    /*
     * Bekas bayangan vertikal, menciptakan kesan wajah
     * seolah terbelah.
     */
    if (appearance.splitFace) {
        const splitGradient = ctx.createLinearGradient(
            241,
            0,
            263,
            0
        );

        splitGradient.addColorStop(
            0,
            "rgba(0,0,0,0)"
        );

        splitGradient.addColorStop(
            0.5,
            "rgba(12,3,9,0.38)"
        );

        splitGradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );

        ctx.fillStyle = splitGradient;
        ctx.fillRect(235, 111, 30, 235);

        charLine(
            ctx,
            250,
            119,
            247,
            177,
            "rgba(20,5,11,0.48)",
            2
        );

        charLine(
            ctx,
            247,
            177,
            254,
            224,
            "rgba(20,5,11,0.48)",
            2
        );

        charLine(
            ctx,
            254,
            224,
            248,
            274,
            "rgba(20,5,11,0.48)",
            2
        );
    }
}


/* =========================================================
   BAGIAN 18 — DATA DESAIN KARAKTER
   ========================================================= */

/*
 * Setiap pengunjung menggunakan desain yang tetap.
 *
 * visitor_001 = normal
 * visitor_002 = anomaly
 * visitor_003 = normal
 * visitor_004 = anomaly
 * visitor_005 = normal
 * visitor_006 = anomaly
 * visitor_007 = normal
 * visitor_008 = anomaly
 */

const NORMAL_CHARACTER_APPEARANCES = [
    {
        hairStyle: "short",

        skinColor: "#d3a487",
        skinShadow: "#986957",
        skinLight: "#f0c6a6",

        hairColor: "#211b1d",

        shirtColor: "#353236",
        jacketColor: "#29272b",
        collarColor: "#d8c9b5",

        accentColor: "#8e3038",
        clothingStyle: "tie",

        faceWidth: 82,
        faceTop: 105,
        faceBottom: 350,

        irisColor: "#594036",
        gazeOffset: 0,

        eyeStyle: "normal",
        browStyle: "calm",
        mouthStyle: "small-smile",

        noseOffset: 0
    },

    {
        hairStyle: "parted",

        skinColor: "#c68f74",
        skinShadow: "#87594f",
        skinLight: "#e7b49a",

        hairColor: "#4a3027",

        shirtColor: "#454044",
        jacketColor: "#343035",
        collarColor: "#bfb09e",

        accentColor: "#87353b",
        clothingStyle: "coat",

        faceWidth: 79,
        faceTop: 108,
        faceBottom: 348,

        irisColor: "#3d2e27",
        gazeOffset: -2,

        eyeStyle: "normal",
        browStyle: "worried",
        mouthStyle: "neutral",

        noseOffset: 1
    },

    {
        hairStyle: "messy",

        skinColor: "#d9b092",
        skinShadow: "#a27666",
        skinLight: "#f4d1b2",

        hairColor: "#312529",

        shirtColor: "#36363a",
        jacketColor: "#25252a",
        collarColor: "#c9c1b7",

        accentColor: "#71454a",
        clothingStyle: "scarf",

        faceWidth: 81,
        faceTop: 102,
        faceBottom: 350,

        irisColor: "#493b32",
        gazeOffset: 2,

        eyeStyle: "normal",
        browStyle: "calm",
        mouthStyle: "soft-smile",

        noseOffset: -1
    },

    {
        hairStyle: "long",

        skinColor: "#ddbaa0",
        skinShadow: "#9d7669",
        skinLight: "#f4d5b8",

        hairColor: "#282126",

        shirtColor: "#373236",
        jacketColor: "#262328",
        collarColor: "#d3c4af",

        accentColor: "#80303a",
        clothingStyle: "coat",

        faceWidth: 76,
        faceTop: 107,
        faceBottom: 352,

        irisColor: "#5a3a34",
        gazeOffset: 1,

        eyeStyle: "normal",
        browStyle: "calm",
        mouthStyle: "small-smile",

        noseOffset: 0
    }
];


const ANOMALY_CHARACTER_APPEARANCES = [
    /*
     * ANOMALI 1 — THE IMPOSSIBLE SMILE
     *
     * Wajah masih menyerupai manusia, tetapi:
     * - mata terlalu kecil;
     * - senyum melebar melewati proporsi wajah;
     * - urat gelap muncul di sisi wajah.
     */
    {
        hairStyle: "short",

        skinColor: "#b5a09a",
        skinShadow: "#76616a",
        skinLight: "#d9c5b8",

        hairColor: "#171317",

        shirtColor: "#21181d",
        jacketColor: "#1a1519",
        collarColor: "#8c7779",

        accentColor: "#731d2d",
        clothingStyle: "tie",

        faceWidth: 84,
        faceTop: 103,
        faceBottom: 356,

        irisColor: "#100d10",
        gazeOffset: 0,

        eyeStyle: "tiny",
        browStyle: "uneven",
        mouthStyle: "wide-smile",

        noseOffset: 0,

        veins: true,
        cracks: true,
        lowerShadow: true
    },

    /*
     * ANOMALI 2 — THE FACELESS GUEST
     *
     * Mata menjadi rongga hitam, rambut panjang menutupi
     * sebagian kepala, dan mulut seperti dijahit.
     */
    {
        hairStyle: "long",

        skinColor: "#a99da1",
        skinShadow: "#67545f",
        skinLight: "#c6b9bc",

        hairColor: "#100e13",

        shirtColor: "#19171c",
        jacketColor: "#141217",
        collarColor: "#8c8186",

        accentColor: "#4c1d29",
        clothingStyle: "coat",

        faceWidth: 77,
        faceTop: 104,
        faceBottom: 360,

        irisColor: "#0b090b",
        gazeOffset: 0,

        eyeStyle: "void",
        browStyle: "heavy",
        mouthStyle: "sealed",

        noseOffset: 0,

        cracks: true,
        doubleShadow: true,
        lowerShadow: true
    },

    /*
     * ANOMALI 3 — THE SPLIT FACE
     *
     * Tatapan tidak simetris, satu mata tampak normal
     * dan satu mata berupa rongga gelap.
     */
    {
        hairStyle: "parted",

        skinColor: "#c0a7a3",
        skinShadow: "#775964",
        skinLight: "#e0c1b9",

        hairColor: "#21171d",

        shirtColor: "#282027",
        jacketColor: "#1c171d",
        collarColor: "#9d8a91",

        accentColor: "#8b2939",
        clothingStyle: "scarf",

        faceWidth: 83,
        faceTop: 103,
        faceBottom: 354,

        irisColor: "#3d252b",
        gazeOffset: -3,

        eyeStyle: "split",
        browStyle: "uneven",
        mouthStyle: "sealed",

        leftEyeY: 220,
        rightEyeY: 229,

        noseOffset: 4,

        splitFace: true,
        cracks: true,
        doubleShadow: true
    },

    /*
     * ANOMALI 4 — THE LAST VISITOR
     *
     * Mata hitam besar dan mulut yang memanjang secara
     * vertikal membuat proporsi wajah tampak mustahil.
     */
    {
        hairStyle: "messy",

        skinColor: "#96828d",
        skinShadow: "#59404e",
        skinLight: "#b4a0a6",

        hairColor: "#130f15",

        shirtColor: "#1d151c",
        jacketColor: "#100d12",
        collarColor: "#79636e",

        accentColor: "#912434",
        clothingStyle: "coat",

        faceWidth: 73,
        faceTop: 95,
        faceBottom: 369,

        irisColor: "#170c12",
        gazeOffset: 0,

        eyeStyle: "ink",
        browStyle: "angry",
        mouthStyle: "long",

        noseOffset: -3,

        veins: true,
        cracks: true,
        lowerShadow: true,
        foreheadMark: true
    }
];


/* =========================================================
   BAGIAN 19 — MEMILIH DESAIN BERDASARKAN PENGUNJUNG
   ========================================================= */

function getVisitorNumber(visitor) {
    if (!visitor || !visitor.id) {
        return 1;
    }

    const match = String(visitor.id).match(/\d+/);

    if (!match) {
        return 1;
    }

    const number = Number(match[0]);

    return Number.isFinite(number) && number > 0
        ? number
        : 1;
}


function createCharacterAppearance(visitor) {
    const isAnomaly =
        Boolean(visitor && visitor.status === "anomaly");

    const visitorNumber = getVisitorNumber(visitor);

    let appearanceIndex;

    if (isAnomaly) {
        /*
         * visitor_002 → anomaly index 0
         * visitor_004 → anomaly index 1
         * visitor_006 → anomaly index 2
         * visitor_008 → anomaly index 3
         */
        appearanceIndex = Math.floor(
            (visitorNumber - 2) / 2
        );
    } else {
        /*
         * visitor_001 → normal index 0
         * visitor_003 → normal index 1
         * visitor_005 → normal index 2
         * visitor_007 → normal index 3
         */
        appearanceIndex = Math.floor(
            (visitorNumber - 1) / 2
        );
    }

    const source = isAnomaly
        ? ANOMALY_CHARACTER_APPEARANCES
        : NORMAL_CHARACTER_APPEARANCES;

    const safeIndex =
        ((appearanceIndex % source.length) + source.length) %
        source.length;

    return {
        ...source[safeIndex],
        status: isAnomaly ? "anomaly" : "normal"
    };
}


/* =========================================================
   BAGIAN 20 — LABEL PENGUNJUNG
   ========================================================= */

function drawCharacterLabel(ctx, visitor) {
    const visitorNumber = getVisitorNumber(visitor);

    const label =
        `VISITOR #${String(visitorNumber).padStart(3, "0")}`;

    /*
     * Panel label gelap pada bagian bawah canvas.
     */
    charRoundRect(
        ctx,
        22,
        500,
        456,
        36,
        5,
        "rgba(5,6,8,0.78)"
    );

    ctx.save();

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "12px monospace";

    ctx.fillStyle =
        visitor && visitor.status === "anomaly"
            ? "#d1a3a8"
            : "#c9c3ba";

    ctx.fillText(label, 250, 518);

    /*
     * Garis kecil di kiri dan kanan label.
     */
    ctx.strokeStyle =
        visitor && visitor.status === "anomaly"
            ? "rgba(183,43,58,0.58)"
            : "rgba(255,255,255,0.18)";

    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(40, 518);
    ctx.lineTo(115, 518);
    ctx.moveTo(385, 518);
    ctx.lineTo(460, 518);
    ctx.stroke();

    ctx.restore();
}


/* =========================================================
   BAGIAN 21 — RENDER KARAKTER LENGKAP
   ========================================================= */

function renderCurrentCharacter(visitor) {
    if (!characterCanvas || !characterContext) {
        initializeCharacterCanvas();
    }

    if (!characterCanvas || !characterContext) {
        console.warn(
            "[THE LAST AUTOGRAPH] characterCanvas tidak tersedia."
        );

        return;
    }

    const ctx = characterContext;

    /*
     * Jangan mempertahankan transformasi dari render lama.
     */
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(
        0,
        0,
        characterCanvas.width,
        characterCanvas.height
    );

    /*
     * Skala menyesuaikan ukuran canvas yang sebenarnya.
     */
    ctx.save();

    ctx.scale(
        characterCanvas.width / CHARACTER_CONFIG.width,
        characterCanvas.height / CHARACTER_CONFIG.height
    );

    const currentVisitor = visitor || {
        id: "visitor_001",
        status: "normal"
    };

    const appearance =
        createCharacterAppearance(currentVisitor);

    /*
     * Urutan gambar sangat penting:
     *
     * 1. Background.
     * 2. Bayangan.
     * 3. Tubuh dan pakaian.
     * 4. Rambut belakang.
     * 5. Telinga.
     * 6. Wajah.
     * 7. Rambut depan.
     * 8. Detail wajah.
     * 9. Label.
     */
    drawCharacterBackground(ctx, appearance);

    drawCharacterSilhouette(ctx, appearance);

    drawCharacterBody(ctx, appearance);

    drawHairBack(ctx, appearance);

    drawCharacterEars(ctx, appearance);

    drawCharacterFace(ctx, appearance);

    drawHairFront(ctx, appearance);

    /*
     * Detail mata dan ekspresi digambar setelah rambut
     * agar rambut tidak menutupi semua fitur wajah.
     */
    drawCharacterEyebrows(ctx, appearance);

    drawCharacterEyes(ctx, appearance);

    drawCharacterNose(ctx, appearance);

    drawCharacterMouth(ctx, appearance);

    if (appearance.status === "anomaly") {
        drawAnomalyDetails(ctx, appearance);
    }

    drawCharacterLabel(ctx, currentVisitor);

    ctx.restore();
}


/* =========================================================
   BAGIAN 22 — INISIALISASI CANVAS
   ========================================================= */

/*
 * Penting:
 *
 * Fungsi ini HANYA mengambil referensi canvas.
 *
 * Tidak ada karakter placeholder yang digambar di sini,
 * sebab game.js bertanggung jawab membuat kasus pertama
 * dan memanggil renderCurrentCharacter(visitor).
 *
 * Dengan begitu, gambar awal tidak menimpa pengunjung
 * yang sudah dipilih oleh game.js.
 */

function initializeCharacterCanvas() {
    characterCanvas = document.getElementById(
        CHARACTER_CONFIG.canvasId
    );

    if (!characterCanvas) {
        console.warn(
            "[THE LAST AUTOGRAPH] characterCanvas belum tersedia."
        );

        characterContext = null;
        return;
    }

    characterContext = characterCanvas.getContext("2d");

    if (!characterContext) {
        console.warn(
            "[THE LAST AUTOGRAPH] Canvas 2D tidak tersedia."
        );
    }
}


/* =========================================================
   BAGIAN 23 — API UNTUK FILE LAIN
   ========================================================= */

window.renderCurrentCharacter = renderCurrentCharacter;

window.CharacterRenderer = {
    render: renderCurrentCharacter,
    initialize: initializeCharacterCanvas,
    createAppearance: createCharacterAppearance
};


/* =========================================================
   BAGIAN 24 — MULAI
   ========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCharacterCanvas
    );
} else {
    initializeCharacterCanvas();
}
