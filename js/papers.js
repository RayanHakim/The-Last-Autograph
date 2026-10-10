
/* =========================================================
   THE LAST AUTOGRAPH
   File: js/papers.js

   PAPER RENDERER — REVISED VERSION

   Fitur:
   1. Meja gelap dengan tekstur dan pencahayaan.
   2. Kertas formulir dengan bayangan, tekstur, dan detail.
   3. Empat desain anomali yang berbeda.
   4. Anomali tetap konsisten berdasarkan ID kertas.
   5. Detail abnormal diperjelas saat Inspect Paper.
   6. Mendukung renderCurrentPaper(paper, inspected).
   7. Tidak menggunakan gambar eksternal.
   8. Tidak mendaftarkan event tombol inspeksi kedua kali.
   ========================================================= */


/* =========================================================
   BAGIAN 1 — KONFIGURASI
   ========================================================= */

const PAPER_CONFIG = {
    canvasId: "paperCanvas",

    width: 360,
    height: 250,

    sheet: {
        x: 20,
        y: 11,
        width: 320,
        height: 227
    },

    colors: {
        background: "#111114",
        deskLight: "#29262a",
        deskDark: "#0b0b0e",

        paper: "#e9e1cf",
        paperLight: "#f3ecdc",
        paperShadow: "#b8ad98",
        paperLine: "#c5baa5",

        ink: "#292426",
        fadedInk: "#766d62",

        red: "#a72a38",
        redDark: "#701b29",
        redLight: "#d5a0a0",

        green: "#536d4d",
        greenLight: "#7d9970",

        white: "#fff8ea",
        black: "#110d11"
    }
};


/* =========================================================
   BAGIAN 2 — REFERENSI CANVAS DAN STATE
   ========================================================= */

let paperCanvas = null;
let paperContext = null;

let currentPaperData = null;
let isPaperInspected = false;


/* =========================================================
   BAGIAN 3 — HELPER GAMBAR
   ========================================================= */

function drawPaperRect(
    ctx,
    x,
    y,
    width,
    height,
    color
) {
    ctx.fillStyle = color;

    ctx.fillRect(
        x,
        y,
        width,
        height
    );
}


function drawPaperLine(
    ctx,
    x1,
    y1,
    x2,
    y2,
    color,
    width = 1
) {
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    ctx.stroke();
}


function drawPaperCircle(
    ctx,
    x,
    y,
    radius,
    color
) {
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


function drawPaperEllipse(
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


function drawPaperPolygon(
    ctx,
    points,
    color
) {
    if (!Array.isArray(points) || points.length < 3) {
        return;
    }

    ctx.beginPath();

    ctx.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(
            points[i][0],
            points[i][1]
        );
    }

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}


function drawPaperText(
    ctx,
    text,
    x,
    y,
    options = {}
) {
    ctx.save();

    ctx.font = options.font || "9px monospace";

    ctx.fillStyle =
        options.color || PAPER_CONFIG.colors.ink;

    ctx.textAlign = options.align || "left";

    ctx.textBaseline =
        options.baseline || "alphabetic";

    ctx.globalAlpha = options.alpha ?? 1;

    if (options.maxWidth) {
        ctx.fillText(
            String(text),
            x,
            y,
            options.maxWidth
        );
    } else {
        ctx.fillText(
            String(text),
            x,
            y
        );
    }

    ctx.restore();
}


function drawPaperRotatedText(
    ctx,
    text,
    x,
    y,
    angle,
    options = {}
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);

    ctx.font = options.font || "9px monospace";

    ctx.fillStyle =
        options.color || PAPER_CONFIG.colors.ink;

    ctx.textAlign = options.align || "left";
    ctx.textBaseline = "alphabetic";

    ctx.globalAlpha = options.alpha ?? 1;

    ctx.fillText(
        String(text),
        0,
        0,
        options.maxWidth || 300
    );

    ctx.restore();
}


function drawPaperRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    color
) {
    const r = Math.max(
        0,
        Math.min(radius, width / 2, height / 2)
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

    ctx.quadraticCurveTo(
        x,
        y,
        x + r,
        y
    );

    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}


/* =========================================================
   BAGIAN 4 — MEJA DAN ATMOSFER
   ========================================================= */

function drawPaperDesk(ctx) {
    const width = PAPER_CONFIG.width;
    const height = PAPER_CONFIG.height;

    /*
     * Dasar meja.
     */
    const deskGradient = ctx.createLinearGradient(
        0,
        0,
        width,
        height
    );

    deskGradient.addColorStop(
        0,
        PAPER_CONFIG.colors.deskLight
    );

    deskGradient.addColorStop(
        0.5,
        "#1b191d"
    );

    deskGradient.addColorStop(
        1,
        PAPER_CONFIG.colors.deskDark
    );

    drawPaperRect(
        ctx,
        0,
        0,
        width,
        height,
        deskGradient
    );

    /*
     * Sorotan cahaya di tengah meja.
     */
    const glow = ctx.createRadialGradient(
        178,
        117,
        10,
        178,
        117,
        195
    );

    glow.addColorStop(
        0,
        "rgba(200, 173, 137, 0.13)"
    );

    glow.addColorStop(
        0.55,
        "rgba(123, 88, 73, 0.06)"
    );

    glow.addColorStop(
        1,
        "rgba(0, 0, 0, 0)"
    );

    ctx.fillStyle = glow;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    /*
     * Serat kayu meja.
     */
    ctx.save();

    for (let i = 0; i < 13; i++) {
        const y = 7 + i * 19;

        const offset = (i % 3) * 13;

        ctx.beginPath();

        ctx.moveTo(-10, y);

        ctx.bezierCurveTo(
            70,
            y - 3,
            210,
            y + 4,
            width + 10,
            y - 1
        );

        ctx.strokeStyle =
            i % 2 === 0
                ? "rgba(222,205,183,0.035)"
                : "rgba(0,0,0,0.10)";

        ctx.lineWidth = 1 + (i % 2);

        ctx.stroke();

        /*
         * Garis kedua yang sedikit bergeser.
         */
        if (i % 3 === 0) {
            drawPaperLine(
                ctx,
                offset,
                y + 3,
                342,
                y + 5,
                "rgba(0,0,0,0.08)",
                1
            );
        }
    }

    ctx.restore();

    /*
     * Sudut meja semakin gelap.
     */
    const vignette = ctx.createRadialGradient(
        180,
        125,
        70,
        180,
        125,
        260
    );

    vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
        1,
        "rgba(0,0,0,0.48)"
    );

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
}


/* =========================================================
   BAGIAN 5 — BENTUK KERTAS
   ========================================================= */

function tracePaperShape(ctx) {
    const s = PAPER_CONFIG.sheet;

    /*
     * Sudut dibuat sedikit tidak sempurna agar
     * kertas tidak terlihat seperti kotak digital polos.
     */
    ctx.beginPath();

    ctx.moveTo(s.x + 2, s.y);
    ctx.lineTo(s.x + s.width - 5, s.y + 1);
    ctx.lineTo(s.x + s.width, s.y + 5);

    ctx.lineTo(
        s.x + s.width - 1,
        s.y + s.height - 4
    );

    ctx.lineTo(
        s.x + s.width - 5,
        s.y + s.height
    );

    ctx.lineTo(
        s.x + 5,
        s.y + s.height - 1
    );

    ctx.lineTo(
        s.x,
        s.y + s.height - 5
    );

    ctx.lineTo(s.x + 1, s.y + 5);

    ctx.closePath();
}


function drawPaperSheet(ctx) {
    const s = PAPER_CONFIG.sheet;

    /*
     * Bayangan jatuh ke bawah-kanan kertas.
     */
    ctx.save();

    ctx.shadowColor = "rgba(0,0,0,0.65)";
    ctx.shadowBlur = 13;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 6;

    tracePaperShape(ctx);

    ctx.fillStyle = "#e8e0ce";
    ctx.fill();

    ctx.restore();

    /*
     * Gradient kertas.
     */
    const paperGradient = ctx.createLinearGradient(
        s.x,
        s.y,
        s.x + s.width,
        s.y + s.height
    );

    paperGradient.addColorStop(
        0,
        PAPER_CONFIG.colors.paperLight
    );

    paperGradient.addColorStop(
        0.45,
        PAPER_CONFIG.colors.paper
    );

    paperGradient.addColorStop(
        1,
        "#d9cfba"
    );

    tracePaperShape(ctx);

    ctx.fillStyle = paperGradient;
    ctx.fill();

    /*
     * Tekstur serat dan noda halus.
     */
    ctx.save();

    tracePaperShape(ctx);
    ctx.clip();

    /*
     * Garis serat tipis.
     */
    for (let y = s.y + 3; y < s.y + s.height; y += 7) {
        drawPaperLine(
            ctx,
            s.x + 2,
            y,
            s.x + s.width - 2,
            y + ((Math.floor(y) % 3) - 1) * 0.25,
            "rgba(95,75,54,0.045)",
            0.6
        );
    }

    /*
     * Bintik kecil yang posisinya deterministik.
     * Hasilnya tidak berubah setiap kali kertas dirender.
     */
    for (let i = 0; i < 48; i++) {
        const x =
            s.x + 9 + ((i * 47) % (s.width - 18));

        const y =
            s.y + 7 + ((i * 31) % (s.height - 14));

        const radius =
            i % 5 === 0 ? 0.9 : 0.45;

        drawPaperCircle(
            ctx,
            x,
            y,
            radius,
            i % 2 === 0
                ? "rgba(81,63,46,0.14)"
                : "rgba(255,255,255,0.22)"
        );
    }

    ctx.restore();

    /*
     * Tepi kertas sedikit lebih gelap.
     */
    tracePaperShape(ctx);

    ctx.strokeStyle = "#a89c87";
    ctx.lineWidth = 1;

    ctx.stroke();

    /*
     * Garis pembatas bagian dalam.
     */
    ctx.strokeStyle = "rgba(94,76,58,0.18)";
    ctx.lineWidth = 0.7;

    ctx.strokeRect(
        s.x + 7,
        s.y + 7,
        s.width - 14,
        s.height - 14
    );

    /*
     * Detail sudut kecil seperti formulir tercetak.
     */
    const cornerColor = "rgba(98,80,63,0.38)";

    drawPaperLine(
        ctx,
        s.x + 7,
        s.y + 16,
        s.x + 7,
        s.y + 7,
        cornerColor,
        1
    );

    drawPaperLine(
        ctx,
        s.x + 7,
        s.y + 7,
        s.x + 16,
        s.y + 7,
        cornerColor,
        1
    );

    drawPaperLine(
        ctx,
        s.x + s.width - 16,
        s.y + s.height - 7,
        s.x + s.width - 7,
        s.y + s.height - 7,
        cornerColor,
        1
    );

    drawPaperLine(
        ctx,
        s.x + s.width - 7,
        s.y + s.height - 16,
        s.x + s.width - 7,
        s.y + s.height - 7,
        cornerColor,
        1
    );
}


/* =========================================================
   BAGIAN 6 — HEADER FORMULIR
   ========================================================= */

function getPaperSerial(paper) {
    if (!paper || !paper.id) {
        return "001";
    }

    const match = String(paper.id).match(/(\d+)$/);

    return match
        ? match[1].padStart(3, "0")
        : "001";
}


function drawPaperHeader(ctx, paper) {
    const serial = getPaperSerial(paper);

    /*
     * Simbol kecil di sudut kiri.
     */
    ctx.strokeStyle = "#67584b";
    ctx.lineWidth = 1;

    ctx.strokeRect(
        32,
        23,
        20,
        20
    );

    drawPaperText(
        ctx,
        "LA",
        42,
        36,
        {
            font: "bold 9px monospace",
            color: "#55453d",
            align: "center"
        }
    );

    drawPaperText(
        ctx,
        "THE LAST AUTOGRAPH",
        59,
        30,
        {
            font: "bold 10px monospace",
            color: "#30292a"
        }
    );

    drawPaperText(
        ctx,
        "OFFICIAL SIGNING RECORD",
        59,
        41,
        {
            font: "6px monospace",
            color: "#766c61"
        }
    );

    /*
     * Nomor arsip.
     */
    drawPaperText(
        ctx,
        `NO. ${serial}`,
        324,
        29,
        {
            font: "bold 7px monospace",
            color: "#4d4441",
            align: "right"
        }
    );

    drawPaperText(
        ctx,
        "ARCHIVE A-07",
        324,
        40,
        {
            font: "5px monospace",
            color: "#807366",
            align: "right"
        }
    );

    /*
     * Garis pemisah header.
     */
    drawPaperLine(
        ctx,
        32,
        49,
        328,
        49,
        "#9c907b",
        1
    );

    /*
     * Garis aksen merah kecil.
     */
    drawPaperRect(
        ctx,
        32,
        48,
        43,
        2,
        PAPER_CONFIG.colors.redDark
    );
}


/* =========================================================
   BAGIAN 7 — INFORMASI DASAR FORMULIR
   ========================================================= */

function drawPaperField(
    ctx,
    label,
    value,
    y,
    options = {}
) {
    const labelX = 39;
    const valueX = 112;
    const rightX = 321;

    drawPaperText(
        ctx,
        label,
        labelX,
        y,
        {
            font: "6px monospace",
            color: "#776d60"
        }
    );

    drawPaperText(
        ctx,
        value,
        valueX,
        y,
        {
            font: options.valueFont || "9px monospace",
            color: options.valueColor || "#292426"
        }
    );

    drawPaperLine(
        ctx,
        39,
        y + 6,
        rightX,
        y + 6,
        "rgba(126,110,90,0.32)",
        0.8
    );
}


function drawPaperNormalInformation(ctx, paper) {
    /*
     * Nomor antrean hanya bersifat visual.
     */
    drawPaperText(
        ctx,
        "REQUEST ID",
        39,
        63,
        {
            font: "6px monospace",
            color: "#776d60"
        }
    );

    drawPaperText(
        ctx,
        `REQ-${getPaperSerial(paper)}`,
        112,
        63,
        {
            font: "8px monospace",
            color: "#35302d"
        }
    );

    /*
     * Nama, tanggal, dan permintaan.
     */
    drawPaperField(
        ctx,
        "NAME",
        "VISITOR",
        80
    );

    drawPaperField(
        ctx,
        "EVENT DATE",
        "10 OCT 2026",
        103
    );

    drawPaperField(
        ctx,
        "REQUEST",
        "PERSONAL AUTOGRAPH",
        126,
        {
            valueFont: "8px monospace"
        }
    );

    /*
     * Keterangan kecil di bawah area informasi.
     */
    drawPaperText(
        ctx,
        "PLEASE VERIFY BEFORE SIGNING",
        39,
        143,
        {
            font: "6px monospace",
            color: "#776d60"
        }
    );

    /*
     * Garis tempat tanda tangan.
     */
    drawPaperLine(
        ctx,
        39,
        169,
        195,
        169,
        "#756b5e",
        1
    );

    drawPaperText(
        ctx,
        "AUTHORIZED SIGNATURE",
        39,
        179,
        {
            font: "6px monospace",
            color: "#776d60"
        }
    );

    /*
     * Kotak verifikasi.
     */
    ctx.strokeStyle = "#958775";
    ctx.lineWidth = 1;

    ctx.strokeRect(
        277,
        148,
        37,
        37
    );

    drawPaperText(
        ctx,
        "VERIFY",
        295.5,
        194,
        {
            font: "5px monospace",
            color: "#756957",
            align: "center"
        }
    );

    /*
     * Detail barcode dekoratif.
     */
    drawPaperText(
        ctx,
        "RECORD",
        39,
        210,
        {
            font: "5px monospace",
            color: "#817568"
        }
    );

    let barcodeX = 76;

    const barcodePattern = [
        1, 2, 1, 1, 3, 1, 2, 1, 1, 3,
        2, 1, 1, 2, 1, 3, 1, 2, 1, 1,
        2, 3, 1, 1, 2, 1, 1, 3, 2
    ];

    barcodePattern.forEach((barWidth, index) => {
        drawPaperRect(
            ctx,
            barcodeX,
            199,
            barWidth,
            index % 4 === 0 ? 15 : 12,
            index % 5 === 0
                ? "#716657"
                : "#423a35"
        );

        barcodeX += barWidth + 1;
    });

    drawPaperText(
        ctx,
        "RETAIN THIS FORM",
        324,
        215,
        {
            font: "5px monospace",
            color: "#817568",
            align: "right"
        }
    );

    /*
     * Nomor cetak mikro pada bagian bawah.
     */
    drawPaperText(
        ctx,
        "SIGNING DEPARTMENT  /  FORM 01",
        39,
        228,
        {
            font: "5px monospace",
            color: "#8d8172"
        }
    );
}


/* =========================================================
   BAGIAN 8 — CAP FORMULIR
   ========================================================= */

function drawPaperStamp(
    ctx,
    x,
    y,
    text,
    color,
    angle = -0.08
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);

    /*
     * Bentuk cap.
     */
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        20,
        12,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    /*
     * Bingkai dalam.
     */
    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        17,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = "bold 5.5px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        text,
        0,
        0
    );

    ctx.restore();
}


/* =========================================================
   BAGIAN 9 — TIPE ANOMALI BERDASARKAN ID
   ========================================================= */

/*
 * PEMETAAN DIPERBAIKI:
 *
 * paper_002 -> tipe 1: tanggal yang salah
 * paper_004 -> tipe 2: tanda tangan sudah ada
 * paper_006 -> tipe 3: tulisan terlarang
 * paper_008 -> tipe 4: identitas tidak valid
 *
 * Rumus sebelumnya menggunakan ((nomor - 1) % 4) + 1.
 * Rumus tersebut membuat kertas anomali bertipe 1 dan 3
 * tidak pernah muncul karena ID anomali selalu genap.
 */

function getPaperAnomalyStyle(paper) {
    if (!paper || !paper.id) {
        return 1;
    }

    const match = String(paper.id).match(/(\d+)$/);

    if (!match) {
        return 1;
    }

    const number = Number(match[1]);

    if (!Number.isFinite(number) || number <= 0) {
        return 1;
    }

    /*
     * Untuk ID anomali genap 002, 004, 006, 008,
     * pembagian dua memberi indeks 1, 2, 3, 4.
     */
    if (number % 2 === 0) {
        return Math.min(4, Math.max(1, number / 2));
    }

    /*
     * Fallback untuk ID anomali lain yang mungkin
     * ditambahkan ke database kemudian.
     */
    return ((number - 1) % 4) + 1;
}


/* =========================================================
   BAGIAN 10 — ANOMALI 1: TANGGAL MUSTAHIL
   ========================================================= */

function drawPaperWrongDate(ctx, inspected) {
    /*
     * Tanggal berubah satu hari ke depan.
     */
    drawPaperText(
        ctx,
        "11 OCT 2026",
        112,
        103,
        {
            font: "bold 9px monospace",
            color: inspected
                ? PAPER_CONFIG.colors.redDark
                : "#773a3c"
        }
    );

    /*
     * Jejak tinta tanggal sebelumnya.
     */
    drawPaperText(
        ctx,
        "10 OCT 2026",
        113,
        99,
        {
            font: "5px monospace",
            color: "#907e6e",
            alpha: inspected ? 0.82 : 0.32
        }
    );

    /*
     * Garis koreksi.
     */
    drawPaperLine(
        ctx,
        109,
        106,
        179,
        106,
        "rgba(150,36,48,0.80)",
        1.2
    );

    /*
     * Tanda peringatan kecil.
     */
    charPaperWarning(ctx, 301, 91, inspected);

    /*
     * Tanggal kedua yang berlawanan muncul ketika
     * kertas diperiksa lebih dekat.
     */
    if (inspected) {
        drawPaperRotatedText(
            ctx,
            "DATE DOES NOT MATCH",
            188,
            92,
            -0.07,
            {
                font: "bold 5px monospace",
                color: PAPER_CONFIG.colors.redDark
            }
        );
    }

    /*
     * Noda tinta kecil di tepi baris.
     */
    drawPaperEllipse(
        ctx,
        105,
        98,
        2,
        4,
        "rgba(119,34,43,0.42)",
        0.4
    );
}


/* =========================================================
   BAGIAN 11 — ANOMALI 2: TANDA TANGAN TERDAHULU
   ========================================================= */

function drawPaperExistingSignature(ctx, inspected) {
    /*
     * Coretan tanda tangan yang sudah tertera.
     */
    ctx.save();

    ctx.globalAlpha = inspected ? 0.96 : 0.72;

    ctx.strokeStyle = "#302328";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(45, 163);

    ctx.bezierCurveTo(
        57,
        145,
        62,
        172,
        78,
        158
    );

    ctx.bezierCurveTo(
        88,
        151,
        91,
        170,
        105,
        156
    );

    ctx.bezierCurveTo(
        115,
        147,
        123,
        164,
        139,
        154
    );

    ctx.bezierCurveTo(
        152,
        144,
        162,
        161,
        184,
        149
    );

    ctx.stroke();

    /*
     * Ekstensi tanda tangan yang terlalu panjang.
     */
    ctx.beginPath();

    ctx.moveTo(74, 158);

    ctx.quadraticCurveTo(
        105,
        142,
        126,
        160
    );

    ctx.quadraticCurveTo(
        150,
        175,
        185,
        145
    );

    ctx.stroke();

    ctx.restore();

    /*
     * Cap merah "SIGNED" sebelum pemain memberikan
     * tanda tangannya sendiri.
     */
    drawPaperStamp(
        ctx,
        294,
        162,
        "SIGNED",
        PAPER_CONFIG.colors.redDark,
        0.09
    );

    /*
     * Detail pemeriksaan.
     */
    if (inspected) {
        drawPaperText(
            ctx,
            "ALREADY SIGNED",
            40,
            191,
            {
                font: "bold 6px monospace",
                color: PAPER_CONFIG.colors.redDark
            }
        );

        drawPaperText(
            ctx,
            "INK IS STILL FRESH",
            40,
            199,
            {
                font: "5px monospace",
                color: "#78434a"
            }
        );

        /*
         * Jejak tinta.
         */
        drawPaperEllipse(
            ctx,
            184,
            160,
            5,
            2,
            "rgba(47,26,32,0.45)",
            -0.2
        );

        drawPaperEllipse(
            ctx,
            193,
            156,
            2.5,
            1.5,
            "rgba(47,26,32,0.48)"
        );
    }
}


/* =========================================================
   BAGIAN 12 — ANOMALI 3: TULISAN TERLARANG
   ========================================================= */

function drawPaperExtraWriting(ctx, inspected) {
    /*
     * Coretan tinta yang menembus informasi formulir.
     */
    ctx.save();

    ctx.globalAlpha = inspected ? 1 : 0.78;

    drawPaperRotatedText(
        ctx,
        "DO NOT SIGN",
        164,
        145,
        -0.11,
        {
            font: "bold 12px monospace",
            color: "#8c1f30"
        }
    );

    drawPaperRotatedText(
        ctx,
        "I WAS HERE",
        210,
        196,
        0.08,
        {
            font: "bold 8px monospace",
            color: "#8c1f30"
        }
    );

    /*
     * Goresan kasar di sekitar tulisan.
     */
    drawPaperLine(
        ctx,
        159,
        151,
        271,
        139,
        "rgba(120,22,40,0.76)",
        1.5
    );

    drawPaperLine(
        ctx,
        181,
        133,
        262,
        151,
        "rgba(120,22,40,0.55)",
        1.1
    );

    /*
     * Noda tinta.
     */
    drawPaperEllipse(
        ctx,
        271,
        153,
        4,
        2,
        "rgba(120,22,40,0.52)",
        0.3
    );

    drawPaperEllipse(
        ctx,
        174,
        156,
        2,
        3,
        "rgba(120,22,40,0.42)"
    );

    ctx.restore();

    if (inspected) {
        drawPaperText(
            ctx,
            "MESSAGE NOT IN ORIGINAL PRINT",
            39,
            191,
            {
                font: "bold 5.5px monospace",
                color: PAPER_CONFIG.colors.redDark
            }
        );

        drawPaperText(
            ctx,
            "HANDWRITING SOURCE UNKNOWN",
            39,
            199,
            {
                font: "5px monospace",
                color: "#78434a"
            }
        );
    }
}


/* =========================================================
   BAGIAN 13 — ANOMALI 4: IDENTITAS TIDAK VALID
   ========================================================= */

function drawPaperConflictingIdentity(ctx, inspected) {
    /*
     * Tulisan nama lama yang masih terlihat samar.
     */
    drawPaperText(
        ctx,
        "VISITOR",
        112,
        76,
        {
            font: "6px monospace",
            color: "#8f8273",
            alpha: inspected ? 0.72 : 0.25
        }
    );

    /*
     * Nama yang tercetak sekarang.
     */
    drawPaperRect(
        ctx,
        108,
        68,
        114,
        16,
        PAPER_CONFIG.colors.paper
    );

    drawPaperText(
        ctx,
        "NO ONE",
        112,
        80,
        {
            font: "bold 9px monospace",
            color: PAPER_CONFIG.colors.redDark
        }
    );

    drawPaperLine(
        ctx,
        111,
        83,
        161,
        83,
        PAPER_CONFIG.colors.red,
        1
    );

    /*
     * Nomor arsip diberi tanda silang.
     */
    drawPaperLine(
        ctx,
        294,
        17,
        323,
        43,
        PAPER_CONFIG.colors.redDark,
        1.6
    );

    drawPaperLine(
        ctx,
        294,
        43,
        323,
        17,
        PAPER_CONFIG.colors.redDark,
        1.6
    );

    /*
     * Cap identitas.
     */
    drawPaperStamp(
        ctx,
        290,
        177,
        inspected ? "INVALID" : "VOID",
        PAPER_CONFIG.colors.redDark,
        -0.11
    );

    if (inspected) {
        drawPaperText(
            ctx,
            "NO MATCHING RECORD",
            39,
            191,
            {
                font: "bold 6px monospace",
                color: PAPER_CONFIG.colors.redDark
            }
        );

        drawPaperText(
            ctx,
            "IDENTITY CANNOT BE VERIFIED",
            39,
            199,
            {
                font: "5px monospace",
                color: "#78434a"
            }
        );
    }
}


/* =========================================================
   BAGIAN 14 — IKON PERINGATAN
   ========================================================= */

function charPaperWarning(ctx, x, y, inspected) {
    const size = inspected ? 7 : 5;

    drawPaperPolygon(
        ctx,
        [
            [x, y - size],
            [x + size, y + size],
            [x - size, y + size]
        ],
        PAPER_CONFIG.colors.red
    );

    drawPaperText(
        ctx,
        "!",
        x,
        y + 4,
        {
            font: "bold 7px monospace",
            color: "#fff4e5",
            align: "center"
        }
    );
}


/* =========================================================
   BAGIAN 15 — DETAIL INSPEKSI
   ========================================================= */

function drawPaperInspectionOverlay(ctx, paper) {
    const isAnomaly =
        paper && paper.status === "anomaly";

    /*
     * Bingkai luar saat diperiksa.
     */
    ctx.save();

    ctx.strokeStyle = isAnomaly
        ? "rgba(164,34,51,0.9)"
        : "rgba(71,103,65,0.8)";

    ctx.lineWidth = 1.5;

    ctx.strokeRect(
        26,
        17,
        308,
        219
    );

    /*
     * Panel status di bagian atas kanan.
     */
    const panelColor = isAnomaly
        ? PAPER_CONFIG.colors.redDark
        : "#40573b";

    drawPaperRoundedRect(
        ctx,
        228,
        54,
        92,
        14,
        2,
        panelColor
    );

    drawPaperText(
        ctx,
        isAnomaly ? "DISCREPANCY FOUND" : "VERIFIED",
        274,
        63.5,
        {
            font: "bold 5.5px monospace",
            color: PAPER_CONFIG.colors.white,
            align: "center"
        }
    );

    /*
     * Lingkaran kecil sebagai titik status.
     */
    drawPaperCircle(
        ctx,
        316,
        61,
        1.5,
        isAnomaly
            ? "#ffb1b1"
            : "#c3e0ad"
    );

    /*
     * Fokus area berdasarkan tipe anomali.
     */
    if (isAnomaly) {
        const style = getPaperAnomalyStyle(paper);

        ctx.strokeStyle = "rgba(174,31,48,0.85)";
        ctx.lineWidth = 1.6;
        ctx.setLineDash([3, 2]);

        if (style === 1) {
            ctx.strokeRect(
                105,
                86,
                132,
                24
            );
        } else if (style === 2) {
            ctx.strokeRect(
                34,
                145,
                166,
                39
            );
        } else if (style === 3) {
            ctx.strokeRect(
                153,
                128,
                157,
                72
            );
        } else {
            ctx.strokeRect(
                104,
                65,
                126,
                25
            );
        }

        ctx.setLineDash([]);

        /*
         * Label audit kecil di bagian bawah.
         */
        drawPaperText(
            ctx,
            "INSPECTION FLAG / 01",
            324,
            228,
            {
                font: "5px monospace",
                color: PAPER_CONFIG.colors.redDark,
                align: "right"
            }
        );
    } else {
        /*
         * Cap pemeriksaan untuk kertas normal.
         */
        drawPaperStamp(
            ctx,
            292,
            157,
            "VALID",
            "#536d4d",
            -0.08
        );

        drawPaperText(
            ctx,
            "ALL FIELDS CONSISTENT",
            39,
            191,
            {
                font: "bold 5.5px monospace",
                color: "#526748"
            }
        );

        drawPaperText(
            ctx,
            "NO IRREGULARITY DETECTED",
            39,
            199,
            {
                font: "5px monospace",
                color: "#64745a"
            }
        );
    }

    ctx.restore();
}


/* =========================================================
   BAGIAN 16 — MENGGAMBAR ANOMALI
   ========================================================= */

function drawPaperAnomaly(ctx, paper, inspected) {
    const style = getPaperAnomalyStyle(paper);

    switch (style) {
        case 1:
            drawPaperWrongDate(ctx, inspected);
            break;

        case 2:
            drawPaperExistingSignature(ctx, inspected);
            break;

        case 3:
            drawPaperExtraWriting(ctx, inspected);
            break;

        case 4:
            drawPaperConflictingIdentity(ctx, inspected);
            break;

        default:
            drawPaperWrongDate(ctx, inspected);
            break;
    }
}


/* =========================================================
   BAGIAN 17 — RENDER KERTAS LENGKAP
   ========================================================= */

/**
 * Menggambar ulang kertas berdasarkan data kasus.
 *
 * Pemanggilan:
 * renderCurrentPaper(paper, false)
 *   -> kertas belum diperiksa.
 *
 * renderCurrentPaper(paper, true)
 *   -> kertas sudah diperiksa.
 */

function renderCurrentPaper(
    paper,
    inspected = false
) {
    /*
     * Ambil canvas jika belum tersedia.
     */
    if (!paperCanvas || !paperContext) {
        paperCanvas = document.getElementById(
            PAPER_CONFIG.canvasId
        );

        if (!paperCanvas) {
            console.warn(
                "[THE LAST AUTOGRAPH] paperCanvas tidak ditemukan."
            );

            return;
        }

        paperContext = paperCanvas.getContext("2d");
    }

    if (!paperContext) {
        console.warn(
            "[THE LAST AUTOGRAPH] Canvas 2D tidak tersedia."
        );

        return;
    }

    /*
     * Simpan kasus dan status inspeksi.
     */
    currentPaperData = paper || {
        id: "paper_001",
        status: "normal"
    };

    isPaperInspected = Boolean(inspected);

    const ctx = paperContext;

    /*
     * Bersihkan transformasi lama sebelum menggambar
     * ulang agar gambar tidak menjadi semakin kecil/besar.
     */
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(
        0,
        0,
        paperCanvas.width,
        paperCanvas.height
    );

    /*
     * Sesuaikan koordinat desain dengan ukuran canvas.
     * Desain dasarnya 360 x 250.
     */
    ctx.save();

    ctx.scale(
        paperCanvas.width / PAPER_CONFIG.width,
        paperCanvas.height / PAPER_CONFIG.height
    );

    /*
     * Meja tetap tegak.
     */
    drawPaperDesk(ctx);

    /*
     * Kertas dimiringkan sedikit untuk memberi kesan
     * lembaran fisik di atas meja.
     */
    ctx.save();

    ctx.translate(180, 125);
    ctx.rotate(-0.012);
    ctx.translate(-180, -125);

    /*
     * Urutan menggambar:
     * 1. Kertas.
     * 2. Header.
     * 3. Informasi.
     * 4. Cap dasar.
     * 5. Anomali jika ada.
     * 6. Overlay inspeksi.
     */
    drawPaperSheet(ctx);

    drawPaperHeader(
        ctx,
        currentPaperData
    );

    drawPaperNormalInformation(
        ctx,
        currentPaperData
    );

    /*
     * Cap arsip kecil pada formulir.
     */
    if (currentPaperData.status === "normal") {
        drawPaperStamp(
            ctx,
            295,
            77,
            "FILED",
            "#80735d",
            0.05
        );
    }

    /*
     * Detail abnormal konsisten berdasarkan ID.
     */
    if (currentPaperData.status === "anomaly") {
        drawPaperAnomaly(
            ctx,
            currentPaperData,
            isPaperInspected
        );
    }

    /*
     * Efek pemeriksaan diletakkan paling atas.
     */
    if (isPaperInspected) {
        drawPaperInspectionOverlay(
            ctx,
            currentPaperData
        );
    }

    ctx.restore();
    ctx.restore();
}


/* =========================================================
   BAGIAN 18 — RESET DAN STATUS INSPEKSI
   ========================================================= */

function resetPaperRenderer() {
    isPaperInspected = false;

    renderCurrentPaper(
        currentPaperData,
        false
    );
}


function getPaperRendererState() {
    return {
        paperId: currentPaperData
            ? currentPaperData.id
            : null,

        status: currentPaperData
            ? currentPaperData.status
            : null,

        inspected: isPaperInspected,

        anomalyStyle: currentPaperData &&
            currentPaperData.status === "anomaly"
                ? getPaperAnomalyStyle(currentPaperData)
                : null
    };
}


/* =========================================================
   BAGIAN 19 — INISIALISASI CANVAS
   ========================================================= */

/*
 * Penting:
 *
 * File ini tidak memasang event click pada inspectPaper.
 * Tombol itu sudah ditangani main.js dan game.js.
 *
 * Dengan begitu, klik Inspect Paper tidak menjalankan
 * dua event handler yang saling bertumpuk.
 *
 * Game.js tetap menjadi sumber status dan kasus aktif.
 */

function initializePaperCanvas() {
    paperCanvas = document.getElementById(
        PAPER_CONFIG.canvasId
    );

    if (!paperCanvas) {
        console.warn(
            "[THE LAST AUTOGRAPH] paperCanvas belum tersedia."
        );

        return;
    }

    paperContext = paperCanvas.getContext("2d");

    if (!paperContext) {
        console.warn(
            "[THE LAST AUTOGRAPH] Browser tidak mendukung Canvas 2D."
        );

        return;
    }

    /*
     * Gambar awal netral. Game.js akan menggambar ulang
     * dengan kasus sebenarnya saat inisialisasi.
     */
    renderCurrentPaper(
        {
            id: "paper_001",
            status: "normal"
        },
        false
    );
}


/* =========================================================
   BAGIAN 20 — API UNTUK FILE LAIN
   ========================================================= */

window.renderCurrentPaper = renderCurrentPaper;

window.PaperRenderer = {
    render: renderCurrentPaper,

    reset: resetPaperRenderer,

    getState: getPaperRendererState,

    getAnomalyStyle: getPaperAnomalyStyle,

    initialize: initializePaperCanvas
};


/* =========================================================
   BAGIAN 21 — MULAI
   ========================================================= */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializePaperCanvas
    );
} else {
    initializePaperCanvas();
}
