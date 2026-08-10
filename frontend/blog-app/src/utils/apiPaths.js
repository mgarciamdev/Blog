export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    SUPERADMIN: {
        CREAR: "/api/superadmin/admin", // Crea un usuario con rol admin
        ACTUALIZAR_ROL_DE_USUARIO: (id) => `/api/superadmin/users/${id}/rol`, // Actualiza el rol del usuario ADMIN -> MEMBER -> ADMIN
    },

    ADMIN: {
        OBTENER_TODOS_LOS_USUARIOS: "/api/admin/users", // Obtiene todos los usuarios
        OBTENER_USUARIO_POR_ID: (id) => `/api/admin/users/${id}`, // Obtiene al usuario por su id
        ELIMINAR_USUARIO: (id) => `/api/admin/users/${id}`, // Elimina al usuario por su id
        ACTUALIZAR_PERFIL_USUARIO: (id) => `/api/admin/users/${id}/profile`, //Admin o superadmin pueden modificar el perfil si incumple las reglas
        EXPORTAR_REPORTE: (format) => `/api/admin/users/export/${format}`, // Exporta el directorio de Usuarios a formatos distintos cuales como CSV, Excel y PDF
    },

    AUTH: {
        REGISTRAR: "/api/auth/register", // Crea y registra y envia verificacion por email por nuevo usuario
        LOGIN: "/api/auth/login", // Inicio de Sesión, obtenemos access, refresh token, si esta baneado y la información del ban
        REFRESH: "/api/auth/refresh", // Enviamos el refresh token y obtenemos un nuevo access token (cambiar despues por)
        LOGOUT: "/api/auth/logout", // Elimina (invalida) el refresh token
        VERIFICAR_CUENTA: (token) => `/api/auth/verify/${token}`, // Verifica la cuenta mediante token enviado a email y redirecciona a frontend (no se si dejarlo dado que son para redireccion)
        REINTENTAR_VERIFICACION: "/api/auth/retry-verify", // Reenvia un nuevo correo con un token de verificación de cuenta
        RECUPERAR_PASSWORD: "/api/auth/password/recover", // Se envia un correo con un link y token para recuperar la contraseña
        VERIFICAR_TOKEN_DE_RECUPERACION: (token) => `/api/auth/password/recover/${token}`, // Verifica el token enviado a email y redirecciona a frontend (no se si dejarlo  dado que son para redireccion)
        RESETEAR_PASSWORD: (token) => `/api/auth/password/reset-password/${token}`, // Con el token obtenido nos permite cambiar la contraseña, al cambiarla se envia un correo de confirmación de cambio.
    },

    POSTS: {
        CRUD: {
            CREAR_POST: "/api/posts", // Crea un nuevo Blog Post
            ACTUALIZAR_POST: (id) => `/api/posts/${id}`, // Actualiza el post seleccionado por ID
            ELIMINAR_POST: (id) => `/api/posts/${id}`, // Elimina el post seleccionado por ID
        },

        QUERIES: {
            OBTENER_TODOS_LOS_POST: "/api/posts", // Obtiene todos los posts publicados (es posible usar queries como status: all, published, draft y paginacion con page=1 etc..)
            OBTENER_POST_POR_SLUG: (slug) => `/api/posts/${slug}`, // Obtiene un post por su slug
            BUSCAR_POSTS: "/api/posts/search", // Busca el post por su titulo o contenido (no se si colocar de una vez el query params)
            OBTENER_POSTS_EN_TENDENCIA: "/api/posts/trending", // Obtiene todos los posts en tendencia
            OBTENER_POSTS_POR_TAG: (tag) => `/api/posts/tags/${tag}`, // Obtiene los posts especificos por su o sus tags (tiene paginación)
        },

        INTERACCIONES: {
            VISTAS: (id) => `/api/posts/${id}/views`, // Incrementa las vistas de un post especifico
            LIKES: (id) => `/api/posts/${id}/likes`, // Incrementa los likes de un post especifico
            DISLIKES: (id) => `/api/posts/${id}/dislikes`, // Incremente los dislikes de un post especifico
        },

        GUARDADOS: {
            GUARDAR_POST: (id) => `/api/posts/${id}/save`, // Guardar post especifico en favoritos
            ELIMINAR_POST_GUARDADO: (id) => `/api/posts/${id}/save`, // Eliminar post especifico de favoritos
            OBTENER_POSTS_GUARDADOS: "/api/posts/me/saved", // Obtener todos los posts guardados por el usuario
        },
    },

    COMENTARIOS: {
        CREAR_COMENTARIO: (postId) => `/api/comments/${postId}`, // Añade un comentario a un post especifico
        OBTENER_TODOS_LOS_COMENTARIOS: "/api/comments", // Obtiene todos los comentarios realizados
        OBTENER_TODOS_LOS_COMENTARIOS_POR_POST: (postId) => `/api/comments/post/${postId}`, // Obtiene todos los comentarios de un post especifico
        ACTUALIZAR_COMENTARIO: (commentId) => `/api/comments/${commentId}`, // Actualiza el contenido del comentario
        ELIMINAR_COMENTARIO: (commentId) => `/api/comments/${commentId}`, // Elimina el comentario especifico por su id

        REACCION: {
            LIKES: (id) => `/api/comments/${id}/reaction`, // Interacciona con el comentario y aumenta los like del comentario
            DISLIKES: (id) => `/api/comments/${id}/reaction`, // Interacciona con el comentario e incrementa los dislikes del comentario
        },
    },

    DASHBOARD: {
        OBTENER_DASHBOARD: "/api/dashboard", // Obtiene los datos del dashboard segun su rol (superadmin, admin, member)
    },

    USUARIOS: {
        PUBLICOS: {
            VERIFICAR_USERNAME: "/api/users/check", // Verifica si el nombre de usuario esta o no esta disponible
            // OBTENER_PERFIL_PUBLICO: (id) => `/api/users/${id}`, // Obtenemos el perfil publico del usuario(s)
        },

        PRIVADOS: {
            OBTENER_PERFIL: "/api/users/profile", // Obtiene el perfil privado del usuario
            ACTUALIZAR_PERFIL: "/api/users/profile", // Actualiza el perfil privado del usuario
            ACTUALIZAR_USERNAME: "/api/users/username", // Cambia el nombre de usuario (posteriormente se bloquea por 30 dias)
            ACTUALIZAR_PASSWORD: "/api/users/change-password", // Cambio de contraseña del usuario (se envia vieja contraseña)
            ELIMINAR_CUENTA: "/api/users/me", // Elimina mi cuenta (confirmación mediante contraseña)
        },
    },

    FEEDBACK: {
        MIEMBROS: {
            CREAR_FEEDBACK: "/api/feedback", // Crea feedback para dar sugerencias, reportar bugs, hacer preguntas, etc..
            OBTENER_MIS_FEEDBACK: "/api/feedback/my-feedbacks", // Obtiene todos los feedbacks enviados por el usuario 
        },

        ADMINS: {
            OBTENER_CANTIDAD_PENDIENTE_DE_RESPONDER: "/api/feedback/admin/unread-count", // Obtiene la cantidad de feedbacks con estado pending o pendiente
            OBTENER_FEEDBACK: "/api/feedback/admin", // Obtiene todos los feedbacks recibidos
            MARCAR_FEEDBACK_COMO_LEIDO: (id) => `/api/feedback/admin/${id}`,
            RESPONDER_FEEDBACK: (id) => `/api/feedback/admin/${id}/respond`, // Responde el feedback usando id y envia correo de respuesta a usuario
            ELIMINAR_FEEDBACK: (id) => `/api/feedback/admin/${id}`, // Elimina el feedback resuelto
        },
    },

    MODERACION: {
        BANS: {
            CREAR_BAN: "/api/moderation/bans", // Banea a un usuario
            DESBANEAR_USUARIO: (userId) => `/api/moderation/bans/${userId}/unban`, // Desbanea a un usuario especifico
            OBTENER_HISTORIAL_POR_ID: (userId) => `/api/moderation/bans/${userId}`, // Obtiene el historial de bans de un usuario especifico
            OBTENER_MI_HISTORIAL: "/api/moderation/bans/me", // Obtiene el historial de bans de el usuario logueado
        },

        STRIKES: {
            CREAR_STRIKE: "/api/moderation/strikes", // Crear un strike a un usuario
            REMOVER_STRIKE: (strikeId) => `/api/moderation/strikes/${strikeId}`, // Remueve el strike de un usuario especifico
            OBTENER_STRIKES_POR_ID_USUARIO: (userId) => `/api/moderation/strikes/${userId}`, // Obtiene los strikes dados a un usuario especifico
            OBTENER_MIS_STRIKES: "/api/moderation/strikes/me", // Obtiene los strikes recibidos de el usuario logueado

        },

        APPEALS: {
            CREAR_APELACION: "/api/moderation/appeals", // El usuario apela el strike o el ban
            OBTENER_MIS_APELACIONES: "/api/moderation/appeals/me", // El usuario obtiene las apelaciones realizadas
            OBTENER_TODAS_LAS_APELACIONES: "/api/moderation/appeals", // El usuario Admin/Superadmin obtienen las apelaciones realizadas
            RESOLVER_APELACION: (appealId) => `/api/moderation/appeal/${appealId}`, // El usuario Admin/Superadmin resuelven la apelacion realizada por su id
        },

        TIMELINE: {
            OBTENER_TIMELINE_DE_USUARIO: (userId) => `/api/moderation/users/${userId}`, // Obtiene la linea de tiempo de bans y strikes de un usuario especifico (Admin/Superadmin)
        },

        STATS: {
            OBTENER_STATS_DE_USUARIO: (userId) => `/api/moderation/users/${userId}/stats`, // Obtiene las estadisticas de ban y strike de un usuario especifico
            OBTENER_STATS_GLOBALES: "/api/moderation/stats", // Obtiene todas las estadisticas de ban y strike de forma global
        },
    },

    IA: {
        GENERAR_POST: "/api/ai/generate", // Genera un post usando IA
        GENERAR_IDEAS_PARA_POST: "/api/ai/generate-ideas", // Genera ideas para un post usando IA
        GENERAR_RESPUESTA_A_COMENTARIO: "/api/ai/generate-reply", // Genera una respuesta al comentario usando IA
        GENERAR_RESUMEN_DE_POST: "/api/ai/generate-summary", // Genera un resumen del post usando IA
        // GENERAR_TRADUCCION: "/api/ai/translate-post", // Genera traducción en tiempo real del post en el idioma seleccionado
    },

    ARCHIVOS: {
        SUBIR_IMAGEN_PERFIL: "/api/upload/users/profiles", // Subir imagen de perfil
        SUBIR_PORTADA: "/api/upload/posts/covers", // Subir imagen de portada de el o los posts
        SUBIR_ARCHIVOS: "/api/upload/documents/pdfs", // Subir archivos pdf (puede ser a los posts)
    },
};