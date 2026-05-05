# Blog Platform Backend API (Node.js, Express, MongoDB)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

Backend completo para una plataforma de blogs con sistema de moderación avanzada, autenticación segura e integración de inteligencia artificial.
> ⚠️ Este proyecto corresponde únicamente al backend. El frontend será implementado posteriormente.

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

backend/<br>
│<br> 
├── config/<br>
├── controllers/<br>
├── middlewares/<br>
├── models/<br>
├── routes/<br>
├── scripts/<br>
├── services/<br>
├── uploads/<br>
└── utils/<br>
server.js

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
- Dashboard dinamico con métricas globales y por usuario
- Bloqueo de funcionalidades si hay ban

---

## 🤖 IA (Inteligencia Artificial)

Integración con Google Gemini para:

- Generación automática de ideas
- Generación de contenido basado en prompts
- Generación de resumenes
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
- POST `/api/comments/:id`
- DELETE `/api/comments/:id`

### Moderation
- POST `/api/moderation/strikes`
- DELETE `/api/moderation/strikes/:id`
- GET `/api/moderation/stats`
- GET `/api/moderation/users/:id/timeline`

### AI
- POST `/api/ai/generate`
- POST `/api/ai/generate-ideas`

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

```
PORT=8000
MONGO_URI=tu_mongodb_uri
JWT_SECRET=tu_secret
JWT_REFRESH_SECRET=tu_refresh_secret
GEMINI_API_KEY=tu_api_key

SUPERADMIN_EMAIL=tu_superadmin_email
SUPERADMIN_PASSWORD=tu_superadmin_password

EMAIL_USER=tu_user_email
EMAIL_PASSWORD=tu_user_password
```
---

## 🔐 Generar secretos seguros

Para JWT_SECRET y JWT_REFRESH_SECRET

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

---

## 👑 Gestión de SuperAdmin
### 🆕 Crear superadmin (primera instalación)

```bash
node scripts/createSuperAdmin.js
```
- Crea el primer usuario con rol ``superadmin``
- Solicita email y contraseña
- Aplica validación de seguridad

### 🆕 Resetear superadmin

```bash
node scripts/resetSuperAdmin.js
```
- Elimina al usuario con rol ``superadmin``
- Crea uno nuevo desde cero
- Solicita email y contraseña

### ⚠️ Seguridad

- Ejecutar solo en entornos seguros
- No exponer como endpoint públic

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

Desarrollado por mgarciamdev

---
