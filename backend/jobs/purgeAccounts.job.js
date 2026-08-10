const cron = require("node-cron");
const { purgeExpiredAccounts } = require("../services/purge.service");

const schedulePurgeJob = () => {
    // Corre todos los días a las 3:00 AM
    cron.schedule("0 3 * * *", async () => {
        console.log(`[purge-job] Iniciando purga de cuentas - ${new Date().toISOString()}`);

        try {
            const result = await purgeExpiredAccounts();
            console.log(`[purge-job] Cuentas purgadas: ${result.purged}`);
        } catch (error) {
            console.error("[purge-job] Error durante la purga:", error.message);
        }
    });

    console.log("[purge-job] Job de purga programado (diario, 3:00 AM).");
};

module.exports = { schedulePurgeJob };