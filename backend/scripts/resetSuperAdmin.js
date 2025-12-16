require("dotenv").config();
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db.config");
const User = require("../models/User");

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

const validatePassword = (password) => {
    const errors = [];

    if (password.length < 10) errors.push("Debe contener al menos 10 caracteres.");
    if (!/[A-Z]/.test(password)) errors.push("Debe contener al menos 1 mayúscula.");
    if (!/[a-z]/.test(password)) errors.push("Debe contener al menos 1 minúscula.");
    if (!/[0-9]/.test(password)) errors.push("Debe contener al menos 1 número.");
    if (!/[!@#$%^&*(),.?\":{}|<>_\-]/.test(password)) errors.push("Debe contener al menos 1 símbolo.");

    return errors;
};

const updateEnvValue = (key, value) => {
    const envPath = path.join(__dirname, "..", ".env");

    let envContent = fs.readFileSync(envPath, "utf-8").split("\n");
    let found = false;

    envContent = envContent.map((line) => {
        if (line.startsWith(`${key}=`)) {
            found = true;
            return `${key}=${value}`;
        }
        return line;
    });

    if (!found) envContent.push(`${key}=${value}`);

    fs.writeFileSync(envPath, envContent.join("\n"));
};

const resetSuperAdmin = async () => {
    try {
        console.log("\n Reset del SUPERADMIN");

        await connectDB();

        /**
         * 1) Solicitamos el Email
        */

        const email = await ask("Ingresa el nuevo email del SuperAdmin: ");

        if (!email.includes("@")) {
            console.log("Email inválido.");
            process.exit(1);
        }

        /**
         * 2) Solicitamos la Contraseña
        */

        let password;

        while (true) {
            password = await ask("Ingresa la nueva contraseña del SuperAdmin: ");

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
            bio: "Nuevo Superadmin generado",
            role: "superadmin",
            isVerified: true,
        });

        console.log("\n Nuevo superadmin creado: ");
        console.log("Email: ", user.email);
        console.log("Contraseña: ", password);
        console.log("\n📝 Archivo .env actualizado correctamente.\n");

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

resetSuperAdmin();