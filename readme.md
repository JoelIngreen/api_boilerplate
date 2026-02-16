# API Boilerplate (Node + Express + TypeScript + Prisma + PostgreSQL)

## 🚀 ARRANCAR EN 30 SEGUNDOS (COPIA Y PEGA)

**Linux / macOS**

```bash
git clone https://github.com/JoelIngreen/api_boilerplate
cd api_boilerplate
cp .env.example .env
docker compose pull
docker compose up -d
```

**Windows (PowerShell)**

```powershell
git clone https://github.com/JoelIngreen/api_boilerplate
cd api_boilerplate
copy .env.example .env
docker compose pull
docker compose up -d
```

Luego abre en el navegador:

```
http://localhost:20000/health
http://localhost:20000/docs
```

No necesitas instalar Node, npm, Prisma ni PostgreSQL.
Docker levanta todo automáticamente.

---

## ✨ Qué es este proyecto

Plantilla lista para producción para crear APIs REST modernas con validación tipada, documentación automática y base de datos PostgreSQL opcional.

---

## ✨ Características

* Node 20 + TypeScript (ESM)
* Express 5
* Prisma 7 (adapter‑pg)
* PostgreSQL
* Zod validation
* Swagger / OpenAPI automático
* Docker ready (sin instalación local)
* Healthcheck real
* Funciona incluso sin DB (modo memoria)

---

## 🧠 Cómo funciona internamente

El proyecto arranca dos contenedores:

* **app** → API compilada
* **postgres** → base de datos

El equipo solo levanta docker‑compose. Nada más.

---

## 📁 Estructura

```
src/
 ├─ api/       rutas
 ├─ core/      config y db
 ├─ models/    schemas zod
 ├─ services/  lógica negocio
 └─ index.ts   bootstrap
```

---

## 💻 Desarrollo local (opcional)

Solo si quieres programar dentro del proyecto:

```bash
npm install
npm run dev
```

---

## 🧪 Endpoints útiles

| Endpoint | Descripción     |
| -------- | --------------- |
| /health  | estado servicio |
| /docs    | swagger UI      |

---

## 🐳 Flujo de trabajo del equipo

Tú (dev):

```
git push
→ GitHub construye imagen automáticamente
```

Equipo:

```
git pull
docker compose pull
docker compose up -d
```

Nunca ejecutar la imagen sola con `docker run`.
Siempre usar docker compose.

---

## Problemas comunes

**Puerto ocupado**

Cambiar API_PORT en `.env`

**DB deshabilitada**

Poner `ENABLE_DATABASE=1` en `.env`

---

Este repo está pensado para que cualquier persona pueda levantar la API en menos de 1 minuto.
