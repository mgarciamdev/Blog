const { formatDate } = require("../../../utils/exportHelper");

const drawPdfReportHeader = (doc, { title, generatedBy, totalUsers, stats }) => {

    const SPACING_SMALL = 0.5;
    const SPACING_MEDIUM = 1;
    const SPACING_LARGE = 1.5;

    doc
        .fontSize(20)
        .fillColor("#1F2937")
        .text("Blog Platform", {
            align: "center"
        });

    doc.moveDown(SPACING_SMALL);

    doc
        .fontSize(16)
        .fillColor("#374151")
        .text(title, {
            align: "center"
        });

    doc.moveDown(SPACING_LARGE);

    doc
        .fontSize(11)
        .fillColor("black");

    doc.text(`Generado por: ${generatedBy || "Sistema"}`);

    doc.text(`Fecha: ${formatDate(new Date())}`);

    doc.moveDown();

    doc
        .fontSize(13)
        .fillColor("#1F2937")
        .text("Resumen");

    doc.moveDown(SPACING_SMALL);

    doc
        .fontSize(11)
        .fillColor("black");

    doc.text(`Usuarios Totales: ${totalUsers}`);

    doc.text(`Super Administradores: ${stats.superadmins ?? 0}`);

    doc.text(`Administradores: ${stats.admins ?? 0}`);

    doc.text(`Miembros: ${stats.members ?? 0}`);

    doc.text(`Usuarios Verificados: ${stats.verified ?? 0}`);

    doc.text(`Usuarios Baneados: ${stats.banned ?? 0}`);

    doc.moveDown(SPACING_LARGE);
};

module.exports = drawPdfReportHeader;