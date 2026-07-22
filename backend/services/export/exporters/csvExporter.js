const { Parser } = require("json2csv");
const userColumns = require("../helpers/userColumns");

const csvExporter = (users) => {
    const fields = userColumns.map((column) => ({
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
        filename: "usuarios.csv",
        contentType: "text/csv; charset=utf-8",
    };

};

module.exports = csvExporter;