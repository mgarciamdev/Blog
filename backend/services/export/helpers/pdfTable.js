const userColumns = require("./userColumns");
const drawPdfWatermark = require("./pdfWatermark");

const rowHeight = 22;

// =====================================
// Encabezado de la tabla
// =====================================
const drawTableHeader = (doc, columns, startX, currentY) => {

    let x = startX;

    columns.forEach((column) => {

        doc
            .rect(x, currentY, column.width, rowHeight)
            .fillAndStroke("#1F2937", "#D1D5DB");

        doc
            .fillColor("white")
            .font("Helvetica-Bold")
            .fontSize(9)
            .text(
                userColumns.find(c => c.key === column.key)?.header ?? "",
                x + 3,
                currentY + 6,
                {
                    width: column.width - 6,
                    align: "center",
                }
            );

        x += column.width;

    });

    return currentY + rowHeight;

};

const drawPdfTable = (doc, users) => {

    const startX = doc.page.margins.left;

    const bottomMargin = 55;

    const columns = [
        { key: "name", width: 120 },
        { key: "username", width: 85 },
        { key: "email", width: 180 },
        { key: "role", width: 100 },
        { key: "status", width: 65 },
        { key: "verified", width: 80 },
        { key: "banned", width: 75 },
        { key: "strikes", width: 55 },
    ];

    // =====================================
    // Primer Encabezado
    // =====================================

    let currentY = doc.y + 20;

    currentY = drawTableHeader(
        doc,
        columns,
        startX,
        currentY
    );

    // ==========================
    // FILAS
    // ==========================

    users.forEach((user, index) => {

        // -----------------------------
        // ¿ Cabe otra fila?
        // -----------------------------
        if (currentY + rowHeight > doc.page.height - bottomMargin) {
            doc.addPage();
            drawPdfWatermark(doc);

            currentY = 40;
            currentY = drawTableHeader(
                doc,
                columns,
                startX,
                currentY
            );
        }

        let x = startX;

        const zebraBackground =
            index % 2 === 0
                ? "#FFFFFF"
                : "#F9FAFB";

        columns.forEach((column) => {

            let cellBackground = zebraBackground;

            // =====================================
            // Rol
            // =====================================

            if (column.key === "role") {

                switch (user.role) {

                    case "Administrador":
                        cellBackground = "#FFF8DC";
                        break;

                    case "Super Administrador":
                        cellBackground = "#FAF5FF";
                        break;

                    case "Miembro":
                        cellBackground = "#ECFDF5";
                        break;

                }

            }

            // =====================================
            // Estado de la cuenta
            // =====================================

            if (column.key === "status") {
                switch (user.status) {
                    case "Activa":
                        cellBackground = "#D1FAE5";
                        break;

                    case "Eliminada":
                        cellBackground = "#E5E7EB";
                        break;
                }
            }

            // =====================================
            // Verificación
            // =====================================

            if (column.key === "verified") {
                cellBackground =
                    user.verified === "Verificado"
                        ? "#ECFDF5"
                        : "#FEF2F2";
            }

            // =====================================
            // Estado
            // =====================================

            if (column.key === "banned") {

                switch (user.banned) {

                    case "Perfecto":
                        cellBackground = "#ECFDF5";
                        break;

                    case "En Peligro":
                        cellBackground = "#FFFBEB";
                        break;

                    case "Riesgo Alto":
                        cellBackground = "#FFF7ED";
                        break;

                    case "Baneado":
                        cellBackground = "#FEF2F2";
                        break;

                }

            }

            // Celda
            doc
                .rect(x, currentY, column.width, rowHeight)
                .fillAndStroke(cellBackground, "#E5E7EB");

            // Texto
            doc
                .fillColor("#111827")
                .font("Helvetica")
                .fontSize(8.5)
                .text(
                    String(user[column.key] ?? ""),
                    x + 3,
                    currentY + 6,
                    {
                        width: column.width - 6,
                        align:
                            column.key === "email"
                                ? "left"
                                : "center",
                    }
                );

            x += column.width;

        });

        currentY += rowHeight;

    });

};

module.exports = drawPdfTable;