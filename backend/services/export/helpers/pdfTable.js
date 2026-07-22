const userColumns = require("./userColumns");

const drawPdfTable = (doc, users) => {

    const startX = doc.page.margins.left;
    let currentY = doc.y;

    const rowHeight = 22;

    // Columnas que se usarán en el PDF
    const columns = [
        { key: "name", width: 130 },
        { key: "username", width: 90 },
        { key: "email", width: 210 },
        { key: "role", width: 110 },
        { key: "verified", width: 95 },
        { key: "banned", width: 55 },
        { key: "strikes", width: 110 },
    ];

    // ==========================
    // HEADER
    // ==========================

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
                userColumns.find(c => c.key === column.key)?.header || "",
                x + 3,
                currentY + 6,
                {
                    width: column.width - 6,
                    align: "center",
                }
            );

        x += column.width;
    });

    currentY += rowHeight;

    // ==========================
    // FILAS
    // ==========================

    users.forEach((user, index) => {

        // Salto de página automático
        if (currentY > doc.page.height - 70) {
            doc.addPage();
            currentY = 50;
        }

        x = startX;

        const zebraBackground = index % 2 === 0
            ? "#FFFFFF"
            : "#F9FAFB";

        columns.forEach((column) => {

            // Fondo por defecto (zebra)
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
            // Verificación
            // =====================================

            if (column.key === "verified") {

                if (user.verified === "Verificado") {

                    cellBackground = "#ECFDF5";

                } else {

                    cellBackground = "#FEF2F2";

                }

            }

            // =====================================
            // Estado de Moderación
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

            // Dibujar celda
            doc
                .rect(x, currentY, column.width, rowHeight)
                .fillAndStroke(cellBackground, "#E5E7EB");

            // Texto
            doc
                .fillColor("#111827")
                .font("Helvetica")
                .fontSize(8)
                .text(
                    String(user[column.key] ?? ""),
                    x + 3,
                    currentY + 6,
                    {
                        width: column.width - 6,
                        align: column.key === "email"
                            ? "left"
                            : "center",
                    }
                );

            x += column.width;

        });

        currentY += rowHeight;

    });

    doc.moveDown(2);

};

module.exports = drawPdfTable;