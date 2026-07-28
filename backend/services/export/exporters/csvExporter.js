const { Parser } = require("json2csv");
const userColumns = require("../helpers/userColumns");

const { formatFileDate } = require("../../../utils/exportHelper");

// Mismas columnas que muestran el PDF y el Excel (pdfTable.js / excelExporter.js).
// Si más adelante quieren que el CSV traiga "id" o "createdAt" además, basta con agregarlas aquí.
const EXPORT_COLUMN_KEYS = ["name", "username", "email", "role", "verified", "banned", "strikes"];

const csvExporter = (users) => {
    const exportColumns = userColumns.filter(
        column => EXPORT_COLUMN_KEYS.includes(column.key)
    );

    const fields = exportColumns.map((column) => ({
        label: column.header,
        value: column.key,
    }));

    const parser = new Parser({
        fields,
        withBOM: true,
        delimiter: ";",
    });

    const csv = parser.parse(users);

    return {
        buffer: Buffer.from(csv, "utf-8"),
        filename: `usuarios_${formatFileDate(new Date())}.csv`,
        contentType: "text/csv; charset=utf-8",
    };

};

module.exports = csvExporter;