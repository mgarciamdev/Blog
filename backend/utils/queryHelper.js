// utils/queryHelpers.js
// Usar en populate({ path: "campo", match: INCLUDE_DELETED })
// para que el populate no filtre usuarios eliminados.
const INCLUDE_DELETED = { isDeleted: { $in: [true, false] } };

module.exports = { INCLUDE_DELETED };