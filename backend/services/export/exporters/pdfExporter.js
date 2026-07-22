const PDFDocument = require("pdfkit");
const drawPdfReportHeader = require("../helpers/pdfReportHeader");
const { formatFileDate } = require("../../../utils/exportHelper");
const drawPdfTable = require("../helpers/pdfTable");

const pdfExporter = async (users, generatedBy) => {
    const doc = new PDFDocument({
        margin: 40,
        layout: "landscape",
        size: "legal",
        bufferPages: true,
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    const stats = {

        superadmins: users.filter(
            u => u.role === "Super Administrador"
        ).length,

        admins: users.filter(
            u => u.role === "Administrador"
        ).length,

        members: users.filter(
            u => u.role === "Miembro"
        ).length,

        verified: users.filter(
            u => u.verified === "Verificado"
        ).length,

        banned: users.filter(
            u => u.banned === "Baneado"
        ).length,
    };

    drawPdfReportHeader(doc, {
        title: "Reporte General de Usuarios",
        generatedBy: generatedBy.name,
        totalUsers: users.length,
        stats
    });

    doc.moveDown(2);

    drawPdfTable(doc, users);
   
    // Pie de pagina
    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        
        doc.fontSize(9);

        doc.text(
            `Página ${i + 1} de ${pages.count}`, 
            0, 
            doc.page.height - 30,
            {
                align: "center"
            }
        );
    }

    doc.end();

    return new Promise((resolve) => {
        doc.on("end", () => {
            resolve({
                buffer: Buffer.concat(buffers),
                filename: `usuarios_${formatFileDate(new Date())}.pdf`,
                contentType: "application/pdf",
            });
        });
    });
};

module.exports = pdfExporter;