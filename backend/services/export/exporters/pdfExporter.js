const PDFDocument = require("pdfkit");
const crypto = require("crypto");

const drawPdfCover = require("../helpers/pdfCover");
const drawPdfWatermark = require("../helpers/pdfWatermark");
const drawPdfReportHeader = require("../helpers/pdfReportHeader");
const drawPdfTable = require("../helpers/pdfTable");

const { formatFileDate } = require("../../../utils/exportHelper");

const pdfExporter = async (users, generatedBy) => {

    // ==========================================
    // Crear documento
    // ==========================================

    const doc = new PDFDocument({
        margin: 40,
        size: "A4",
        layout: "landscape",
        bufferPages: true,
    });

    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    // ==========================================
    // Report ID
    // ==========================================

    const reportId =
        `USR-${formatFileDate(new Date())}-${crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase()}`;

    // ==========================================
    // Estadísticas
    // ==========================================

    const stats = {

        superadmins: users.filter(
            u => u.role === "Super Administrador"
        ).length,

        admins: users.filter(
            u => u.role === "Administrador"
        ).length,

        members: users.filter(
            u => u.role === "Miembro"
        ).length,

        verified: users.filter(
            u => u.verified === "Verificado"
        ).length,

        banned: users.filter(
            u => u.banned === "Baneado"
        ).length,

    };

    // ==========================================
    // PORTADA
    // ==========================================

    drawPdfWatermark(doc);

    drawPdfCover(doc, {

        title: "Reporte General de Usuarios",

        generatedBy:
            generatedBy?.name ??
            generatedBy ??
            "Sistema",

        reportId,

    });

    // ==========================================
    // NUEVA PÁGINA
    // ==========================================

    doc.addPage();

    drawPdfWatermark(doc);

    // ==========================================
    // HEADER
    // ==========================================

    drawPdfReportHeader(doc, {

        title: "Reporte General de Usuarios",

        generatedBy:
            generatedBy?.name ??
            generatedBy ??
            "Sistema",

        totalUsers: users.length,

        stats,

    });

    // ==========================================
    // TABLA
    // ==========================================

    drawPdfTable(doc, users);

    // ==========================================
    // FOOTER
    // ==========================================

    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {

        doc.switchToPage(i);
        doc.save();

        // Desactivar temporalmente el margen inferior para que PDFKit no interprete esta posición como
        // overflow
        const originalBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;

        doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#6B7280")
            .text(
                `Página ${i + 1} de ${pages.count}   |   Reporte: ${reportId}`,
                doc.page.margins.left,
                doc.page.height - 28,
                {
                    width:
                        doc.page.width - doc.page.margins.left - doc.page.margins.right,
                    align: "center",
                }
            );

        doc.page.margins.bottom = originalBottomMargin;
        doc.restore();
    }

    // ==========================================
    // FINALIZAR
    // ==========================================
    doc.end();
    return new Promise((resolve, reject) => {
        doc.on("end", () => {
            resolve({
                buffer: Buffer.concat(buffers),
                filename: `usuarios_${formatFileDate(new Date())}.pdf`,
                contentType: "application/pdf",
            });
        });

        doc.on("error", reject);
    });
};

module.exports = pdfExporter;