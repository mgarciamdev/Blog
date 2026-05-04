const buildFileUrl = (req, file) =>
    `${req.protocol}://${req.get("host")}/uploads/${req.uploadFolder}/${file.filename}`;

const uploadProfile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.status(200).json({
        imageUrl: buildFileUrl(req, req.file)
    });
};

const uploadPostCoverHandler = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.status(200).json({
        imageUrl: buildFileUrl(req, req.file)
    });
};

const uploadPDFHandler = (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.status(200).json({
        fileUrl: buildFileUrl(req, req.file)
    });
};

module.exports = {
    uploadProfile,
    uploadPostCoverHandler,
    uploadPDFHandler
};