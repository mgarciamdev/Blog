require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

// Ejecutar con --dry-run para solo ver qué se actualizaría, sin aplicar cambios
const isDryRun = process.argv.includes("--dry-run");

const migrate = async () => {
    try {
        console.log("Conectando con la base de datos...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado.\n");

        const filter = { isDeleted: { $exists: false } };

        // Contamos primero cuántos documentos serán afectados
        const affectedCount = await User.countDocuments(filter);

        if (affectedCount === 0) {
            console.log("No hay usuarios pendientes de migrar. Todo está al día.");
            await cerrarConexion();
            return;
        }

        console.log(`Usuarios sin campo 'isDeleted': ${affectedCount}`);

        if (isDryRun) {
            console.log("\n--dry-run activado: no se aplicará ningún cambio.");

            // Mostramos una muestra de los usuarios que serían afectados
            const sample = await User.find(filter)
                .select("_id username email")
                .limit(5);

            console.log("\nMuestra de usuarios afectados (máx 5):");
            sample.forEach(u => {
                console.log(`  - ${u._id} | ${u.username} | ${u.email}`);
            });

            await cerrarConexion();
            return;

            console.log("\nAplicando migración...");

            const result = await User.updateMany(
                filter,
                { $set: { isDeleted: false, deletedAt: null } }
            );

            console.log(`Documentos coincidentes: ${result.matchedCount}`);
            console.log(`Documentos modificados: ${result.modifiedCount}`);

            // Verificación post-migración
            const remaining = await User.countDocuments({ isDeleted: { $exists: false } });

            if (remaining > 0) {
                console.warn(`\n⚠ Advertencia: quedan ${remaining} usuarios sin el campo isDeleted.`);
            } else {
                console.log("\n✓ Todos los usuarios tienen el campo isDeleted correctamente.");
            }

            // Sincronizamos los índices (crea el índice parcial si aún no existe)
            console.log("\nSincronizando índices...");
            await User.syncIndexes();
            console.log("✓ Índices sincronizados.");

            await cerrarConexion();
        }
    } catch (error) {
        console.error("\nError durante la migración:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

const cerrarConexion = async () => {
    await mongoose.disconnect();
    console.log("\nConexión cerrada. Migración finalizada.");
};

migrate();