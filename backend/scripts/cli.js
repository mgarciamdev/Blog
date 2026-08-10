#!/usr/bin/env node
require("dotenv").config();

const createSuperAdmin = require("./commands/createSuperAdmin");
const resetSuperAdmin = require("./commands/resetSuperAdmin");
const purgeExpiredAccounts = require("./commands/purgeExpiredAccounts");

const command = process.argv[2];

const run = async () => {
    switch (command) {
        case "create-superadmin":
            await createSuperAdmin();
            break;

        case "reset-superadmin":
            await resetSuperAdmin();
            break;

        case "purge-expired-accounts": // <-- nuevo
            await purgeExpiredAccounts();
            break;

        default:
            console.log(`
                    🛠️ CLI de Administración

                    Comandos disponibles:

                    - create-superadmin         Crear SuperAdmin
                    - reset-superadmin          Resetear SuperAdmin
                    - purge-expired-accounts    Purgar cuentas eliminadas (usa --dry-run para previsualizar)

                    Uso:
                    node scripts/cls.js <comando>
                `)
                process.exit(0);
    }
};

run();