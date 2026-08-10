# Blog Platform Backend API (Node.js, Express, MongoDB)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

Backend completo para una plataforma de blogs con sistema de moderación avanzada, autenticación segura e integración de inteligencia artificial.
> ⚠️ Este proyecto corresponde únicamente al backend. El frontend se esta implementado, 👷‍♂️ trabajo en proceso.

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
  - Generación de respuesta a comentarios
  - Generación de resumen del post
- 📊 Dashboard dinámico con estadísticas
- 📤 Subida de archivos (imágenes, PDFs) con validación
- 🛡️ Middleware de seguridad (validación, control de baneos, etc.)
- 🗑️ Eliminación de cuentas con Soft Delete y reactivación dentro de un periodo de gracia

---
## 🧠 Arquitectura

El proyecto sigue una arquitectura modular basada en:

- Controllers
- Services (lógica de negocio)
- Middlewares
- Models (Mongoose)
- Utils reutilizables
---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Multer (upload de archivos)
- Google Gemini API (IA)
- nodemailer (envio de correos)
- bcryptjs (encriptación)

---

## 📁 Estructura del proyecto

```bash
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── scripts/
├── services/
├── uploads/
└── utils/
server.js
```

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

## 🗑️ Eliminación de cuentas (Soft Delete)

Las cuentas de usuario nunca se eliminan físicamente al momento de la baja. En su lugar:

- Se marcan como `isDeleted: true` y se registra `deletedAt`
- El email y username quedan disponibles para un nuevo registro (índices únicos parciales)
- El usuario queda excluido automáticamente de logins, perfiles públicos y consultas generales
- Los paneles de moderación y auditoría (strikes, bans, apelaciones, feedback) siguen mostrando el historial de cuentas eliminadas
- Los posts y comentarios de una cuenta eliminada se conservan, mostrando el autor como "Usuario eliminado"

**Reactivación:** dentro de un periodo de gracia de 30 días, el usuario puede reactivar su cuenta con `POST /api/auth/reactivate` usando su email y contraseña. Pasado ese periodo, la cuenta queda sujeta a purga definitiva.

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
- POST `/api/auth/reactivate`

### Users
- GET `/api/users/profile`
- PUT `/api/users/profile`
- PUT `/api/users/username`
- PUT `/api/users/change-password`
- DELETE `/api/users/me` *(soft delete)*

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
git clone https://github.com/mgarciamdev/Blog.git
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

EMAIL_USER=tu_user_email
EMAIL_PASSWORD=tu_user_password
```
---

## 🔐 Generar secretos seguros

Para JWT_SECRET y JWT_REFRESH_SECRET
```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
---

## 🛠️ CLI de Administración

El proyecto incluye una herramienta CLI para gestionar tareas administrativas desde consola.

### 📦 Uso básico

```bash
npm run cli <comando>
```

### 🚀 Comandos disponibles

Crear SuperAdmin

```bash
npm run cli create-superadmin
```
- Crea el primer usuario con rol ``superadmin``
- Solicita:
  - Email
  - Nombre
  - Bio (opcional)
  - Contraseña segura

Resetear SuperAdmin

```bash
npm run cli reset-superadmin
```
- Elimina el usuario con rol ``superadmin`` actual
- Crea uno nuevo desde cero

Purgar cuentas eliminadas

```bash
npm run cli purge-expired-accounts -- --dry-run   # previsualiza sin borrar nada
npm run cli purge-expired-accounts                # ejecuta (pide confirmación escrita)
```
- Elimina físicamente las cuentas con ``isDeleted: true`` cuyo periodo de gracia (30 días) ya expiró
- Limpia también sus ``SavedPost`` y ``CommentReaction`` asociados
- Conserva el historial de moderación (strikes, bans, apelaciones, feedback) como auditoría
- Siempre muestra un preview antes de pedir confirmación

### ⚡ Uso avanzado

```bash
npx blog-cli create-superadmin
```

### 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- No se almacenan en ``.env``
- No se exponen en logs

### ⚠️ Recomendaciones

- Ejecutar solo en entornos seguros
- No exponer como endpoint HTTP

### 🗑️ Migración de Soft Delete

Script de una sola ejecución (fuera de la CLI, se corre una única vez al desplegar el feature) para asegurar que los usuarios existentes tengan los campos `isDeleted`/`deletedAt` y sincronizar los índices únicos parciales.

```bash
# Verifica qué se actualizaría, sin aplicar cambios
node scripts/migrate-soft-delete-fields.js --dry-run

# Aplica la migración
node scripts/migrate-soft-delete-fields.js
```

```bash
# Verifica qué se actualizaría, sin aplicar cambios
node scripts/migrate-soft-delete-fields.js --dry-run

# Aplica la migración
node scripts/migrate-soft-delete-fields.js
```

### 👑 Gestión de SuperAdmin

### 🆕 Crear superadmin (primera instalación)

```bash
npm run cli create-superadmin
```

### 🔄 Resetear superadmin

```bash
npm run cli reset-superadmin
```

### 🗑️ Purgar cuentas eliminadas

```bash
npm run cli purge-expired-accounts
```

> También corre automáticamente todos los días a las 3:00 AM mediante un cron job (`jobs/purgeAccounts.job.js`), registrado al iniciar el servidor.

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
