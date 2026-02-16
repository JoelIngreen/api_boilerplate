# API Boilerplate (Node + Express + TypeScript + Prisma + PostgreSQL)

Plantilla lista para producción para crear APIs REST modernas con validación tipada, documentación automática y soporte opcional de base de datos.

---

## ✨ Características

* **Node 20 + TypeScript (ESM)**
* **Express 5**
* **Prisma 7 con adapter-pg (sin driver interno)**
* **PostgreSQL** (opcional – la API puede funcionar sin DB)
* **Zod** validación tipada
* **Swagger / OpenAPI** documentación automática
* **Docker & Docker Compose ready**
* **Healthcheck real de base de datos**
* **Modo memoria si DB deshabilitada** (perfecto para tests o desarrollo rápido)
* **CI build de imagen Docker incluido**

---

## 📁 Estructura del proyecto

```
src/
 ├─ api/           → Rutas HTTP
 ├─ core/          → Configuración, DB, swagger
 ├─ models/        → Schemas Zod + tipos
 ├─ services/      → Lógica de negocio
 └─ index.ts       → Bootstrap del servidor

prisma/
 └─ schema.prisma  → Modelo de datos

storage/           → Volumen persistente para archivos
```

---

## 🚀 Quick Start (Docker recomendado)

### 1. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` si es necesario.

### 2. Levantar el proyecto

```bash
docker compose up -d --build
```

La API estará disponible en:

```
http://localhost:20000
http://localhost:20000/docs
```

---

## 💻 Desarrollo local (sin Docker)

### Requisitos

* Node 20+
* PostgreSQL (opcional)

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

### Build producción

```bash
npm run build
npm start
```

---

## ⚙️ Variables de entorno

| Variable          | Descripción                     |
| ----------------- | ------------------------------- |
| API_PORT          | Puerto del servidor             |
| ENABLE_DATABASE   | 1 = usa PostgreSQL, 0 = memoria |
| POSTGRES_USER     | Usuario DB                      |
| POSTGRES_PASSWORD | Password DB                     |
| POSTGRES_DB       | Base de datos                   |
| POSTGRES_HOST     | Host DB                         |
| POSTGRES_PORT     | Puerto DB                       |
| SCHEMA_NAME       | Schema SQL                      |
| STORAGE_PATH      | Ruta almacenamiento             |
| NODE_ENV          | environment                     |

---

## 🧠 Modos de funcionamiento

### DB habilitada

Usa Prisma + PostgreSQL

### DB deshabilitada

La API funciona igual usando memoria interna:

Ideal para:

* tests
* demos
* desarrollo frontend

---

## 🗄️ Prisma & Migraciones

Ejecutadas automáticamente al arrancar el contenedor:

```
prisma migrate deploy
```

### Desarrollo manual

```bash
npx prisma migrate dev
npx prisma studio
```

---

## 📚 Documentación API

Swagger UI disponible en:

```
GET /docs
GET /openapi.json
```

---

## ❤️ Health Check

```
GET /health
```

Respuestas:

| Estado             | Significado |
| ------------------ | ----------- |
| healthy            | API OK      |
| database connected | DB OK       |
| database disabled  | DB no usada |
| unhealthy          | DB caída    |

---

## 🧪 Requests de ejemplo

Archivo incluido:

```
items.http
```

Compatible con:

* VSCode REST Client
* Jetbrains HTTP Client

---

## 🐳 Docker

La imagen:

* compila TypeScript
* genera Prisma Client
* ejecuta migraciones
* arranca servidor

Puerto interno: **20000**

---

## 🧱 Añadir un nuevo módulo (guía rápida)

1. Crear modelo Zod en `models/`
2. Crear service en `services/`
3. Crear router en `api/`
4. Registrar router en `index.ts`
5. Documentar con Swagger annotations

---

## 🔁 CI/CD

El pipeline construye y publica la imagen Docker en el registry:

```
.gitlab-ci.yml
```

---

## 🛠️ Troubleshooting

### La API arranca pero falla DB

```
ENABLE_DATABASE=0
```

### Prisma error de conexión

Revisar variables `.env`

### Puerto ocupado

Cambiar `API_PORT`

---

## 👨‍💻 Filosofía del proyecto

Este boilerplate intenta ser:

* mínimo pero escalable
* opinionated pero flexible
* usable sin DB
* listo para producción

Pensado para iniciar APIs reales en minutos sin pelearte con configuración.