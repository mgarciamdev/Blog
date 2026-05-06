require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../../config/db.config");
const User = require("../../models/User");
const { ask, validatePassword, updateEnvValue } = require("../utils/cliHelper");

const resetSuperAdmin = async () => {
    try {
        console.log("\n Reset del SUPERADMIN");

        await connectDB();

        /**
         * 1) Solicitamos los nuevos datos
        */

        const email = await ask("Ingresa el nuevo email del SuperAdmin: ");
        const name = await ask("Nombre: ");
        const bio = await ask("Ingresa tu Biografia:" || "Super Admin");

        if (!email.includes("@")) {
            console.log("Email inválido.");
            process.exit(1);
        }

        /**
         * 2) Solicitamos la Contraseña
        */

        let password;

        while (true) {
            password = await ask("Ingresa la nueva contraseña para el(la) SuperAdmin: ");

            const validationErrors = validatePassword(password);

            if (validationErrors.length === 0) break;

            console.log("\n La contraseña no cumple con los requisitos: ");
            validationErrors.forEach((e) => console.log("  - " + e));
            console.log("");
        }

        console.log("Eliminando SuperAdmin existente...");
        await User.deleteMany({ role: "superadmin" });

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

        console.log("\n Nuevo superadmin creado: ");
        console.log("Email: ", user.email);
        console.log("\n📝 Archivo .env actualizado correctamente.\n");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

module.exports = resetSuperAdmin;