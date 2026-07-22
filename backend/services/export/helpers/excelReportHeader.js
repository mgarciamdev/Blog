const { formatDate } = require("../../../utils/exportHelper");

const userColumns = require("./userColumns");

const drawExcelReportHeader = (worksheet, { title, generatedBy, totalUsers, stats, }) => {

    worksheet.mergeCells("A1:I1");
    worksheet.getCell("A1").value = "Blog Platform";
    worksheet.getCell("A1").font = {
        size: 20,
        bold: true,
    };
    worksheet.getCell("A1").alignment = {
        horizontal: "center",
    };

    worksheet.mergeCells("A2:I2");
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

    worksheet.getCell("A8").value = `Usuarios Totales: ${totalUsers}`;
    worksheet.getCell("A9").value = `Super Administradores: ${stats.superadmins}`;
    worksheet.getCell("A10").value = `Administradores: ${stats.admins}`;
    worksheet.getCell("A11").value = `Miembros: ${stats.members}`;
    worksheet.getCell("A12").value = `Usuarios Verificados: ${stats.verified}`;
    worksheet.getCell("A13").value = `Usuarios Baneados: ${stats.banned}`;

    return 15;

};

module.exports = drawExcelReportHeader;