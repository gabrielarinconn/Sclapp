# Cómo ejecutar el proyecto SCLAPP

Guía paso a paso para levantar el backend (FastAPI), la base de datos (PostgreSQL) y el frontend.

---

## Requisitos previos

- **Python 3.10+** instalado y en el PATH.
- **PostgreSQL** instalado y en ejecución (puerto 5432 por defecto).
- Editor o terminal en la **raíz del proyecto** (carpeta donde están `backend/` y `frontend/`).

---

## Paso 1: Clonar o abrir el proyecto

Abre la carpeta del proyecto en tu editor o terminal:

```bash
cd ruta/donde/esta/Sclapp
```

La raíz debe contener las carpetas `backend` y `frontend`.

---

## Paso 2: Crear la base de datos en PostgreSQL

1. Abre **pgAdmin**, **psql** o cualquier cliente de PostgreSQL.
2. Crea una base de datos nueva (por ejemplo `sclapp`):

   ```sql
   CREATE DATABASE sclapp;
   ```

3. Conéctate a esa base de datos y ejecuta el script de esquema:

   - Archivo: `backend/db/schema.sql`
   - En psql: `\i ruta/completa/backend/db/schema.sql`
   - O copia y pega el contenido del archivo en la consola SQL.

4. (Opcional) Para probar el login con un usuario de ejemplo, inserta un usuario (ajusta el `password_hash` si más adelante implementas verificación real):

   ```sql
   INSERT INTO users (full_name, doc_num, user_name, password_hash, email, id_role)
   VALUES ('Admin', '123', 'admin', 'hash_aqui', 'admin@sclapp.com', 1)
   ON CONFLICT (email) DO NOTHING;
   ```

   Si no creas usuarios, el login de prueba del frontend (usuario falso) seguirá funcionando.

---

## Paso 3: Variables de entorno (.env)

1. En la **raíz del proyecto** (o dentro de `backend/`) crea un archivo llamado `.env`.

2. Añade al menos estas variables (ajusta según tu instalación de PostgreSQL):

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sclapp
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña_postgres
   ```

3. Opcional, si sirves el frontend en otro puerto (por ejemplo Live Server en 5500):

   ```env
   CORS_ORIGINS=http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000
   ```

Guarda el archivo. No subas `.env` a Git (debe estar en `.gitignore`).

---

## Paso 4: Entorno virtual e instalación de dependencias (backend)

1. Abre una terminal en la **raíz del proyecto**.

2. Crea el entorno virtual:

   ```bash
   python -m venv venv
   ```

3. Actívalo:

   - **Windows (CMD):**  
     `venv\Scripts\activate`
   - **Windows (PowerShell):**  
     `venv\Scripts\Activate.ps1`
   - **Linux / macOS:**  
     `source venv/bin/activate`

   Deberías ver `(venv)` al inicio de la línea.

4. Instala las dependencias del backend:

   ```bash
   pip install -r backend/requirements.txt
   ```

---

## Paso 5: Levantar todo con un solo comando

Con el entorno virtual activado y desde la **raíz del proyecto**:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

- **Correcto:** verás algo como `Uvicorn running on http://0.0.0.0:8000`.
- **Una sola URL:** abre en el navegador **http://localhost:8000** — ahí se sirve la aplicación (frontend + API).
- La API está en: **http://localhost:8000/api**
- Documentación interactiva: **http://localhost:8000/docs**
- Deja esta terminal abierta mientras uses la app.

El mismo servidor sirve el frontend (HTML, CSS, JS) y la API; no hace falta abrir otra terminal ni otro puerto.

---

## Paso 6: Probar la aplicación

1. Con el servidor corriendo, abre en el navegador: **http://localhost:8000**
2. Deberías ver la pantalla de login de SCLAPP.
3. Usa (usuario de prueba del frontend):
   - **Email:** `admin@sclapp.com`
   - **Contraseña:** `123456`
4. Entra al dashboard y navega por Companies, Emails, Profile, etc.

---

## Resumen rápido

| Qué   | Dónde ejecutar    | Comando |
|-------|-------------------|--------|
| Todo (API + frontend) | Raíz del proyecto | `uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000` |

Luego abre **http://localhost:8000** en el navegador. 

---

## Errores frecuentes

- **Base de datos:** Si el backend falla al arrancar, comprueba que PostgreSQL esté en marcha, que la base `sclapp` exista y que `DB_*` en `.env` sean correctos.
- **Módulos no encontrados:** Asegúrate de ejecutar `uvicorn` desde la **raíz del proyecto** (donde está la carpeta `backend/`), no desde dentro de `backend/`.
- **Frontend en blanco:** Abre **http://localhost:8000** en el navegador, no el archivo `index.html` con doble clic (`file://`).
- **CORS:** Si más adelante sirves el frontend en otro puerto, añade esa URL en `CORS_ORIGINS` en tu `.env`.
