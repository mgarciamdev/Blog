const fs = require("fs");
const path = require("path");
const readline = require("readline");

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

    if (password.length < 12)
        errors.push("Debe contener al menos 12 caracteres.");
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

// Actualizamos el .env
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

module.exports = {
    ask,
    validatePassword,
    updateEnvValue
};