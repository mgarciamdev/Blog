// tests/manual/check-user-account.js
// Script de diagnóstico manual — inspecciona el estado real de una cuenta en Mongo.
// Uso: node tests/manual/check-user-account.js <email> [password]
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const [, , email, password] = process.argv;

if (!email) {
    console.log("Uso: node tests/manual/check-user-account.js <email> [password]");
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a la base de datos:", mongoose.connection.name);

        // 1) Con el hook activo (lo que vería el login real)
        const user = await User.findOne({ email });
        console.log("\n1) Usuario encontrado (con hook isDeleted):", !!user);

        // 2) Documento crudo, sin el hook, para ver el estado real
        const rawUser = await User.collection.findOne({ email });

        if (!rawUser) {
            console.log("2) El documento no existe en la base de datos con ese email.");
            await mongoose.disconnect();
            return;
        }

        console.log("2) Documento crudo:", {
            isDeleted: rawUser.isDeleted,
            deletedAt: rawUser.deletedAt,
            isVerified: rawUser.isVerified,
            isBanned: rawUser.isBanned,
        });

        // 3) Comparación de contraseña, si se proporcionó
        if (password) {
            const isMatch = await bcrypt.compare(password, rawUser.password);
            console.log("3) ¿Contraseña coincide?:", isMatch);
        } else {
            console.log("3) (omitido: no se proporcionó contraseña)");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error en el diagnóstico:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

run();