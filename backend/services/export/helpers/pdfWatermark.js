const drawPdfWatermark = (doc) => {

    // Guardamos también la posición del cursor de texto, porque save() / restore() No la cubre.
    const startX = doc.x;
    const startY = doc.y;

    const centerX = doc.page.width / 2;
    const centerY = doc.page.height / 2;

    doc.save();

    doc.opacity(0.08);

    doc.rotate(-45, {
        origin: [centerX, centerY],
    });

    doc
        .font("Helvetica-Bold")
        .fontSize(70)
        .fillColor("#FF0000")
        .text("CONFIDENCIAL", centerX - 230, centerY,);

    doc.restore();

    // Restauramos el cursor para que el siguiente contenido dibujado no herede la posición.
    doc.x = startX;
    doc.y = startY;
};

module.exports = drawPdfWatermark;