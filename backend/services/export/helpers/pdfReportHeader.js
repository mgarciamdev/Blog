const { formatDate } = require("../../../utils/exportHelper");

const drawPdfReportHeader = (doc, { title, generatedBy, totalUsers, stats }) => {

    doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#1F2937")
        .text("Blog Platform", {
            align: "center"
        });

    doc.moveDown(0.3);

    doc
        .font("Helvetica")
        .fontSize(15)
        .fillColor("#4B5563")
        .text(title, {
            align: "center"
        });

    doc.moveDown(0.8);

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#111827");

    doc.text(`Generado por: ${generatedBy}`);

    doc.text(`Fecha: ${formatDate(new Date())}`);

    doc.moveDown(0.6);

    doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#1F2937")
        .text("Resumen");

    doc.moveDown(0.3);

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#111827");

    doc.text(`Usuarios Totales: ${totalUsers}`);
    doc.text(`Super Administradores: ${stats.superadmins ?? 0}`);
    doc.text(`Administradores: ${stats.admins ?? 0}`);
    doc.text(`Miembros: ${stats.members ?? 0}`);
    doc.text(`Usuarios Verificados: ${stats.verified ?? 0}`);
    doc.text(`Usuarios Baneados: ${stats.banned ?? 0}`);

    doc.moveDown(0.8);
};

module.exports = drawPdfReportHeader;