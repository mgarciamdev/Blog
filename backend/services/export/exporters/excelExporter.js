const ExcelJS = require("exceljs");
const drawExcelReportHeader = require("../helpers/excelReportHeader");
const userColumns = require("../helpers/userColumns");

const excelExporter = async (users, currentUser) => {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Blog Platform";
    workbook.company = "Blog Platform";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Usuarios");

    // ==========================================
    // Header del reporte
    // ==========================================

    const stats = {
        superadmins: users.filter(u => u.role === "Super Administrador").length,
        admins: users.filter(u => u.role === "Administrador").length,
        members: users.filter(u => u.role === "Miembro").length,
        verified: users.filter(u => u.verified === "Verificado").length,
        banned: users.filter(u => u.banned === "Baneado").length,
    };

    const tableHeaderRow = drawExcelReportHeader(worksheet, {
        title: "Reporte General de Usuarios",
        generatedBy: currentUser.name,
        totalUsers: users.length,
        stats,
    });

    // ==========================================
    // Encabezados de la tabla
    // ==========================================

    const headerRow = worksheet.getRow(tableHeaderRow);

    userColumns.forEach((column, index) => {

        const cell = headerRow.getCell(index + 1);

        cell.value = column.header;

        worksheet.getColumn(index + 1).width = column.width;

    });

    worksheet.autoFilter = {
        from: {
            row: tableHeaderRow,
            column: 1,
        },
        to: {
            row: tableHeaderRow,
            column: userColumns.length,
        },
    };

    headerRow.eachCell((cell) => {

        cell.font = {
            name: "Calibri",
            size: 11,
            color: {
                argb: "FFFFFFFF",
            },
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "1F2937",
            },
        };

        cell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };

    });

    headerRow.height = 24;

    // ==========================================
    // Datos
    // ==========================================

    let currentRow = tableHeaderRow + 1;

    users.forEach((user) => {

        const row = worksheet.getRow(currentRow++);

        userColumns.forEach((column, index) => {

            row.getCell(index + 1).value = user[column.key];

        });

    });

    // ==========================================
    // Estilo de filas
    // ==========================================

    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber <= tableHeaderRow) return;

        const roleCell = row.getCell(5);
        const verificationCell = row.getCell(6);
        const statusCell = row.getCell(7);

        row.height = 22;

        row.eachCell((cell, colNumber) => {

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            let horizontal = "center";

            // Nombre
            if (colNumber === 2) horizontal = "left";

            // Correo
            if (colNumber === 4) horizontal = "left";

            cell.alignment = {
                vertical: "middle",
                horizontal,
            };

        });

        if (rowNumber % 2 === 0) {

            row.eachCell((cell) => {

                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {
                        argb: "FFF8F9FA",
                    },
                };

            });

        }

        // Rol
        switch (roleCell.value) {

            case "Administrador":
                roleCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFDE68A" },
                };
                break;

            case "Super Administrador":
                roleCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFE9D5FF" },
                };
                break;

            case "Miembro":
                roleCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD1FAE5" },
                };
                break;
        }

        // Verificación
        if (verificationCell.value === "Verificado") {

            verificationCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD1FAE5" },
            };

        } else {

            verificationCell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFEE2E2" },
            };

        }

        // Estado Moderación
        switch (statusCell.value) {

            case "Perfecto":
                statusCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD1FAE5" },
                };
                break;

            case "En Peligro":
                statusCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFEF3C7" },
                };
                break;

            case "Riesgo Alto":
                statusCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFED7AA" },
                };
                break;

            case "Baneado":
                statusCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFEE2E2" },
                };
                break;
        }

    });

    // ==========================================
    // Congelar encabezados
    // ==========================================

    worksheet.views = [
        {
            state: "frozen",
            ySplit: tableHeaderRow,
        },
    ];

    worksheet.pageSetup = {
        paperSize: 9,          // A4
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        horizontalCentered: true,
    };

    const buffer = await workbook.xlsx.writeBuffer();

    return {
        buffer,
        filename: "usuarios.xlsx",
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
};

module.exports = excelExporter;