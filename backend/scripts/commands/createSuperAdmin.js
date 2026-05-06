require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const connectDB = require("../../config/db.config");
const { ask, validatePassword, updateEnvValue } = require("../utils/cliHelper");

const createSuperAdmin = async () => {
    try {
        console.log("\n 🛡️ CREACIÓN INTERACTIVA DEL SUPERADMIN \n")

        await connectDB();

        const exists = await User.findOne({ role: "superadmin" });

        if (exists) {
            console.log("Ya existe el SuperAdmin. No se creó uno nuevo.");
            process.exit(0);
        }

        /**
         * 1) Solicitamos los datos
        */

        const email = await ask("Ingrea el email del SuperAdmin: ");
        const name = await ask("Ingrese tu nombre:");
        const bio = await ask("Ingresa tu Biografia:" || "Super Admin");

        if (!email || !email.includes("@")) {
            console.log("Email invalido");
            process.exit(1);
        }

        /**
         * 2) Solicitamos la Contraseña
        */

        let password;

        while (true) {
            password = await ask("Ingresa la contraseña para el SuperAdmin: ");

            const validationErrors = validatePassword(password);

            if (validationErrors.length === 0) break;

            console.log("\n La contraseña no cumple con los requisitos: ");
            validationErrors.forEach((error) => console.log("  -" + error));
            console.log("\n Intenta nuevamente. \n");
        }

        /**
         * 3) Guardamos en el archivo .env
        */

        updateEnvValue("SUPERADMIN_EMAIL", email.toLowerCase());

        /**
         * 4) Creamos el Superadmin en la BD
        */

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: "superadmin",
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            bio,
            role: "superadmin",
            isVerified: true,
        });

        console.log("Superadmin creado exitosamente:");
        console.log("Email:", user.email);
        console.log("\n📝 Archivo .env actualizado correctamente.\n");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

module.exports = createSuperAdmin;