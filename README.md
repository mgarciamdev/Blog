# Blog Platform Backend API (Node.js, Express, MongoDB)

Backend completo para una plataforma de blogs con sistema de moderación avanzada, autenticación segura e integración de inteligencia artificial.

---

## 🚀 Características principales

- 🔐 Autenticación con JWT (Access + Refresh Tokens)
- 📧 Verificación de email y recuperación de contraseña
- 🧑‍💻 Sistema de roles (member, admin, superadmin)
- 📝 Gestión de posts (crear, editar, eliminar, interactuar)
- 💬 Sistema de comentarios con respuestas
- ⚖️ Moderación avanzada:
  - Strikes (sistema de puntos)
  - Bans automáticos y manuales
  - Apelaciones (appeals)
  - Historial (timeline)
- 🤖 Integración con IA (Google Gemini API)
  - Generación de posts
  - Generación de contenido (Ideas)
  - Generación de Respuesta a comentarios
  - Generación de resumen del post
- 📊 Dashboard dinámico con estadísticas
- 📤 Subida de archivos (imágenes, PDFs) con validación
- 🛡️ Middleware de seguridad (validación, control de baneos, etc.)

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB + mongoose
- JSON Web Tokens (JWT)
- Multer (upload de archivos)
- Google Gemini API (IA)
- nodemailer (envio de correos)
- bcryptjs (encriptación)

---

## 📁 Estructura del proyecto

src/<br>
│<br> 
├── controllers/<br>
├── models/<br>
├── routes/<br>
├── middlewares/<br>
├── services/<br>
├── utils/<br>
└── uploads/<br>

---

## 🔐 Autenticación

El sistema utiliza:

- Access Token (JWT)
- Refresh Token
- Verificación por email
- Protección contra usuarios baneados

---

## ⚖️ Sistema de moderación

Incluye: 

- Sistema de strikes con acumulación de puntos
- Auto-ban al superar límite
- Bans temporales y permanentes
- Sistema de apelaciones
- Dashboard con métricas globales y por usuario

---

## 🤖 IA (Inteligencia Artificial)

Integración con Google Gemini para:

- Generación automática de posts
- Generación de contenido basado en prompts
- Respuestas inteligentes

---

## 📤 Subida de archivos

Soporta:

- Imágenes de perfil
- Portadas de posts
- Documentos PDF

Con validación de:
- Tipo de archivo
- Tamaño máximo

---

## 📌 Endpoints principales

### Auth
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/refresh`
- POST `/api/auth/retry-verify`
- POST `/api/auth/password/recover`

### Posts
- GET `/api/posts`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`

### Comments
- POST `/api/comments`
- DELETE `/api/comments/:id`

### Moderation
- POST `/api/moderation/strikes`
- DELETE `/api/moderation/strikes/:id`
- GET `/api/moderation/stats`
- GET `/api/moderation/users/:id/timeline`

### AI
- POST `/api/ai/generate-post`
- POST `/api/ai/generate-content`

### Uploads
- POST `/api/uploads/users/profiles`
- POST `/api/uploads/posts/covers`

---

## ⚙️ Instalación

```bash
git https://github.com/mgarciamdev/Blog.git
cd blog/backend
npm install
```

---

## 🔑 Variables de entorno

Crea un archivo ```.env``` con:

#### .env
```
PORT=8000
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_secret
JWT_REFRESH_SECRET=tu_refresh_secret
GEMINI_API_KEY=tu_api_key

SUPERADMIN_EMAIL=tu_superadmin_email
SUPERADMIN_PASSWORD=tu_superadmin_password

envio de correo con nodemailer
EMAIL_USER=tu_user_email
EMAIL_PASSWORD=tu_user_password
```
---

## ▶️ Ejecución

```bash
npm run dev
```

---

## 🧪 Testing

- Se recomienda usar Postman para probar los endpoints.

---

## 📄 Licencia

- Este proyecto está bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado por Mario Rubén García Monzón

---
