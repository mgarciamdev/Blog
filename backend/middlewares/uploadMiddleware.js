const multer = require('multer');
const path = require("path");

const createUpload = ({ folder, allowedTypes, maxSize }) => {
    // Configurar almacenamiento
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folder}`);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        }
    });

    // Filtro de archivos
    const fileFilter = (req, file, cb) => {
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de archivo no permitido"), false);
        }
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSize },
    });

};

module.exports = createUpload;