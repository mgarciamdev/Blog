const { formatDate } = require("../../../utils/exportHelper");

// Convierte un número de columna (1, 2, 3...) a su letra de Excel (A, B, ..., Z, AA...)
// (usada para calcular hasta dónde llega el merge del título, según cuántas columnas tenga la tabla)
const columnLetter = (colNumber) => {
    let letter = "";
    let n = colNumber;
    while (n > 0) {
        const remainder = (n - 1) % 26;
        letter = String.fromCharCode(65 + remainder) + letter;
        n = Math.floor((n - 1) / 26);
    }
    return letter;
};

const drawExcelReportHeader = (worksheet, { title, generatedBy, totalUsers, stats, totalColumns, }) => {

    const lastColumn = columnLetter(totalColumns);

    worksheet.mergeCells(`A1:${lastColumn}1`);
    worksheet.getCell("A1").value = "Blog Platform";
    worksheet.getCell("A1").font = {
        size: 20,
        bold: true,
    };
    worksheet.getCell("A1").alignment = {
        horizontal: "center",
    };

    worksheet.mergeCells(`A2:${lastColumn}2`);
    worksheet.getCell("A2").value = title;
    worksheet.getCell("A2").font = {
        size: 16,
        bold: true,
    };
    worksheet.getCell("A2").alignment = {
        horizontal: "center",
    };

    worksheet.getCell("A4").value = `Generado por: ${generatedBy}`;
    worksheet.getCell("A5").value = `Fecha: ${formatDate(new Date())}`;

    worksheet.getCell("A7").value = "Resumen";
    worksheet.getCell("A7").font = {
        bold: true,
    };

    worksheet.getCell("A8").value = `Total de Cuentas: ${totalUsers}`;
    worksheet.getCell("A9").value = `Cuentas Activas: ${stats.active ?? 0}`;
    worksheet.getCell("A10").value = `Super Administradores: ${stats.superadmins ?? 0}`;
    worksheet.getCell("A11").value = `Administradores: ${stats.admins ?? 0}`;
    worksheet.getCell("A12").value = `Miembros: ${stats.members ?? 0}`;
    worksheet.getCell("A13").value = `Usuarios Verificados: ${stats.verified ?? 0}`;
    worksheet.getCell("A14").value = `Usuarios Baneados: ${stats.banned ?? 0}`;
    worksheet.getCell("A15").value = `Usuarios Eliminados: ${stats.deleted ?? 0}`;

    return 16;

};

module.exports = drawExcelReportHeader;