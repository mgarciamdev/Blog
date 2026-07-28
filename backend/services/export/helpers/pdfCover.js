const { formatDate } = require("../../../utils/exportHelper");

const drawPdfCover = (doc, {
    title,
    generatedBy,
    reportId,
}) => {

    // Posición inicial más controlada
    doc.y = 120;

    doc
        .font("Helvetica-Bold")
        .fontSize(28)
        .fillColor("#1F2937")
        .text("Blog Platform", {
            align: "center",
        });

    doc.moveDown(0.5);

    doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#4B5563")
        .text(title, {
            align: "center",
        });

    // Línea divisoria
    doc.moveDown(2);

    doc
        .moveTo(120, doc.y)
        .lineTo(doc.page.width - 120, doc.y)
        .strokeColor("#D1D5DB")
        .stroke();

    doc.moveDown(2);

    // Información del reporte
    doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#111827")
        .text(`Generado por: ${generatedBy}`, {
            align: "center",
        });

    doc.moveDown(0.8);

    doc.text(
        `Fecha de generación: ${formatDate(new Date())}`,
        {
            align: "center",
        }
    );

    doc.moveDown(0.8);

    doc
        .font("Helvetica-Bold")
        .text(
            `ID del reporte: ${reportId}`,
            {
                align: "center",
            }
        );

    // Nota inferior
    doc.moveDown(3);

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#6B7280")
        .text(
            "Documento generado automáticamente por Blog Platform.",
            {
                align: "center",
            }
        );

};

module.exports = drawPdfCover;