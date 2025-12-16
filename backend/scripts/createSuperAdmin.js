require("dotenv").config();
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db.config");

// Función para realizar las preguntas por medio de la consola
const ask = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) =>
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        })
    );
};

// Validación fuerte de la contraseña del superadmin
const validatePassword = (password) => {
    const errors = [];

    if (password.length < 10)
        errors.push("Debe contener al menos 10 caracteres.");
    if (!/[A-Z]/.test(password))
        errors.push("Debe contener al menos 1 letra mayúscula.");
    if (!/[a-z]/.test(password))
        errors.push("Debe contener al menos 1 letra minúscula.");
    if (!/[0-9]/.test(password))
        errors.push("Debe contener al menos 1 número.");
    if (!/[!@#$%^&*(),.?\":{}|<>_\-]/.test(password))
        errors.push("Debe contener al menos 1 símbolo.");

    return errors;
};

// Actualizamos el .env sin romperlo
const updateEnvValue = (key, value) => {
    const envPath = path.join(__dirname, "..", ".env");

    let envContent = fs.readFileSync(envPath, "utf8").split("\n");
    let found = false;

    envContent = envContent.map((line) => {
        if (line.startsWith(`${key}=`)) {
            found = true;
            return `${key}=${value}`;
        }
        return line;
    });

    if (!found) {
        envContent.push(`${key}=${value}`);
    }

    fs.writeFileSync(envPath, envContent.join("\n"));
};

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
         * 1) Solicitamos el Email
        */

        const email = await ask("Ingrea el email del SuperAdmin: ");

        if (!email || !email.includes("@")) {
            console.log("Email invalido");
            process.exit(1);
        }

        /**
         * 2) Solicitamos la Contraseña
        */

        let password;

        while (true) {
            password = await ask("Ingresa la contraseña del SuperAdmin: ");

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
        updateEnvValue("SUPERADMIN_PASSWORD", password);

        /**
         * 4) Creamos el Superadmin en la BD
        */

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username: "superadmin",
            name: "Super Admin",
            email: email.toLowerCase(),
            password: hashedPassword,
            bio: "El unico super admin que existe",
            role: "superadmin",
            isVerified: true,
        });

        console.log("Superadmin creado exitosamente:");
        console.log("Email:", user.email);
        console.log("Contraseña:", password);
        console.log("\n📝 Archivo .env actualizado correctamente.\n");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

createSuperAdmin();