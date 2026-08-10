require("dotenv").config();
const connectDB = require("../../config/db.config");
const { purgeExpiredAccounts } = require("../../services/purge.service");
const { ask } = require("../utils/cliHelper");

const purgeExpiredAccountsCommand = async () => {
    try {
        console.log("\n PURGA DE CUENTAS ELIMINADAS\n");

        await connectDB();

        // Siempre previsualizamos primero, sin importar el flag
        const preview = await purgeExpiredAccounts({ dryRun: true });

        if (preview.purged === 0) {
            console.log("No hay cuentas pendientes de purga.");
            process.exit(0);
        }

        console.log(`Se encontraron ${preview.purged} cuenta(s) para purgar:\n`);
        preview.users.forEach(u =>
            console.log(`  - ${u._id} | ${u.username} | ${u.email} | eliminada: ${u.deletedAt.toISOString()}`)
        );

        // Si solo quieren ver el preview, terminamos aquí
        if (process.argv.includes("--dry-run")) {
            process.exit(0);
        }

        const confirm = await ask(
            `\n Esto eliminará PERMANENTEMENTE estas cuentas. Escribe "CONFIRMAR" para continuar: `
        );

        if (confirm !== "CONFIRMAR") {
            console.log("Operación cancelada.");
            process.exit(0);
        }

        const result = await purgeExpiredAccounts({ dryRun: false });

        console.log(`\n Cuentas purgadas definitivamente: ${result.purged}`);
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

module.exports = purgeExpiredAccountsCommand;