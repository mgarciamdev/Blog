const express = require("express");
const router = express.Router();

const {
    uploadProfileImage,
    uploadPostCover,
    uploadPDF
} = require("../middlewares/uploads/index");

const { uploadProfile, uploadPostCoverHandler, uploadPDFHandler } = require("../controllers/upload.controller");

router.post(
    "/users/profiles",
    uploadProfileImage.single("image"),
    uploadProfile
);

router.post(
    "/posts/covers",
    uploadPostCover.single("image"),
    uploadPostCoverHandler
);

router.post(
    "/documents/pdfs",
    uploadPDF.single("file"),
    uploadPDFHandler
);

module.exports = router;