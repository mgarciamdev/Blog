module.exports = { // Ejemplo de Forma Spread
    ...require("./login.controller"),
    ...require("./refresh.controller"),
    ...require("./logout.controller"),
    ...require("./register.controller"),
    ...require("./password.controller"),
    ...require("./verify.controller"),
    ...require("./reactivate.controller"),
};

// Ejemplo de Forma explicita 
// const { loginUser } = require("./login.controller");
// module.exports = { loginUser };

/**
 * Forma explicita: consiste en importa exactamente lo que necesitas desde cada archivo y exportarlo manualmente
 * Ventajas
 * **Muy legible
 * **Ideal para equipos grandes o juniors
 * **Menos riesgo de colisiones de nombres
 * **Facil de debugear
 * 
 * Desventajas
 * ** Mas codigo repetido
 * ** Menos escalable
 * 
 * Cuando usarla
 * **Proyectos pequeños
 * **codigo critico
 * **equipos grandes
 * **cuando quieres maxima claridad
 * 
 * Forma Spread: Utiliza ... para fusionar automaticamente todos los exports de varios archivos en un solo objeto
 * Ventajas
 * ** Automatico
 * ** Escala mejor
 * ** Ideal cuando hay muchos controladores
 * ** Menos mantenimiento
 * 
 * Desventajas
 * ** Si hay nombres respetidos -> se sobreescriben
 * ** Menos explicito
 * ** Requiere disciplina en nombres
 *   
 * Cuando usarla
 * ** Proyectos medianos o grandes
 * ** controllers bien organizados
 * ** cuando los nombres son unicos
 * ** cuando quieres menos boilerplate
 */
