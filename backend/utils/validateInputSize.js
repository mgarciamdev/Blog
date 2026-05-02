const validateInputSize = (text, maxLength = 5000) => {
    if (!text || typeof text !== "string") return false;

    const cleaned = text.trim();

    return cleaned.length > 0 && cleaned.length <= maxLength;
};

module.exports = {
    validateInputSize
};