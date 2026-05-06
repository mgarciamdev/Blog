#!/usr/bin/env node
require("dotenv").config();

const createSuperAdmin = require("./commands/createSuperAdmin");
const resetSuperAdmin = require("./commands/resetSuperAdmin");

const command = process.argv[2];

const run = async () => {
    switch (command) {
        case "create-superadmin":
            await createSuperAdmin();
            break;

        case "reset-superadmin":
            await resetSuperAdmin();
            break;

        default:
            console.log(`
                    🛠️ CLI de Administración

                    Comandos disponibles:

                    - create-superadmin Crear SuperAdmin
                    - reset-superadmin  Resetear SuperAdmin

                    Uso:
                    node scripts/cls.js <comando>
                `)
                process.exit(0);
    }
};

run();