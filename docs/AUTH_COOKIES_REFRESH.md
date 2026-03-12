# Autenticación con cookies HttpOnly y refresh token

## 1. Archivos modificados / creados

### Backend
- **backend/db/schema.sql** – Añadida tabla `refresh_tokens`.
- **backend/db/migrations/0002_refresh_tokens.sql** – Migración opcional para DB existente.
- **backend/core/config.py** – `refresh_secret_key`, `cookie_secure`.
- **backend/core/security.py** – Reescrito: JWT access/refresh (generate + verify), cookies por nombre, `get_current_user_from_cookie`.
- **backend/modules/auth/auth_service.py** – Register con werkzeug; login genera access+refresh, guarda hash del refresh en DB; `store_refresh_token`, `revoke_refresh_token`, `get_user_id_by_refresh_token`.
- **backend/api/v1/auth.py** – Endpoints: register, login (setea cookies), refresh, me, logout (revoca y limpia cookies).
- **backend/api/v1/profile.py** – `GET /profile/me` y `PUT /profile/me` usan `get_current_user_from_cookie`.
- **backend/requirements.txt** – `werkzeug`, `PyJWT` (sustituyen bcrypt para auth).

### Frontend
- **frontend/assets/js/apiClient.js** – Todas las peticiones con `credentials: 'include'`; en 401 intenta `POST /auth/refresh` y reintenta una vez; `setSessionExpiredHandler` para redirigir a login.
- **frontend/assets/js/main.js** – Arranque con `GET /auth/me`; sin localStorage; login/logout llaman a la API; `showAppShell(user)` recibe usuario para mostrar nombre/iniciales.

### Config
- **.env.example** – Comentarios para `REFRESH_SECRET_KEY` y `COOKIE_SECURE`.

---

## 2. Resumen de cambios

- **Login:** Tras validar credenciales se generan access token (15 min) y refresh token (7 días). El refresh se guarda hasheado en `refresh_tokens`. Ambos se envían en cookies HttpOnly (`sclapp_access_token`, `sclapp_refresh_token`). La respuesta JSON solo incluye `message` y `user` (sin tokens en el body).
- **Refresh:** `POST /auth/refresh` lee el refresh token de la cookie, lo valida (JWT + existencia en DB sin revocar), revoca el anterior, emite nuevo access y nuevo refresh y los envía en cookies.
- **Me:** `GET /auth/me` lee el access token de la cookie y devuelve el usuario actual.
- **Logout:** `POST /auth/logout` revoca el refresh token en DB y borra las cookies de auth.
- **Frontend:** Sin localStorage/sessionStorage para sesión; todas las peticiones con `credentials: 'include'`; al cargar se llama a `/auth/me`; si una petición devuelve 401 se intenta refresh y se reintenta una vez; si el refresh falla se redirige a login.

---

## 3. Flujo de auth

```
[App load]
  → GET /auth/me (cookie access_token)
  → 200: showAppShell(user)
  → 401: showLoginScreen()

[Login]
  → POST /auth/login { email, password }
  → 200: Set-Cookie access_token, refresh_token; body { message, user }
  → Frontend: showAppShell(user)

[Request con token expirado]
  → Cualquier GET/POST devuelve 401
  → Frontend: POST /auth/refresh (cookie refresh_token)
  → 200: Set-Cookie nuevos access y refresh; reintentar request original
  → 401: onSessionExpired() → showLoginScreen()

[Logout]
  → POST /auth/logout (cookie refresh_token)
  → Backend: revoca refresh en DB, Clear-Site-Data / delete cookies
  → Frontend: showLoginScreen()
```

---

## 4. SQL (tabla refresh_tokens)

Si la base ya existía antes de añadir la tabla en `schema.sql`, ejecuta la migración:

**backend/db/migrations/0002_refresh_tokens.sql**

```sql
create table if not exists refresh_tokens (
  id_refresh int generated always as identity primary key,
  id_user int not null,
  token_hash varchar(255) not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default current_timestamp,
  revoked_at timestamptz,
  constraint fk_refresh_user foreign key (id_user) references users(id_user) on update cascade on delete cascade
);
create index if not exists idx_refresh_tokens_id_user on refresh_tokens (id_user);
create index if not exists idx_refresh_tokens_token_hash on refresh_tokens (token_hash);
create index if not exists idx_refresh_tokens_expires_at on refresh_tokens (expires_at);
```

---

## 5. Ejemplos de prueba

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Julio Ramirez","email":"julio@email.com","password":"123456"}'
```
Respuesta esperada: `201` y `{"message":"User registered successfully"}`.

### Login (guardar cookies en archivo para siguientes llamadas)
```bash
curl -c cookies.txt -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"julio@email.com","password":"123456"}'
```
Respuesta: `200` y `{"message":"Login successful","user":{...}}`; cookies `sclapp_access_token` y `sclapp_refresh_token` en `cookies.txt`.

### Me
```bash
curl -b cookies.txt http://localhost:8000/api/auth/me
```
Respuesta: `200` y `{"user":{"id_user":1,"full_name":"Julio Ramirez","email":"julio@email.com"}}`.

### Refresh
```bash
curl -b cookies.txt -c cookies.txt -X POST http://localhost:8000/api/auth/refresh
```
Respuesta: `200` y `{"message":"Token refreshed"}`; nuevas cookies enviadas.

### Logout
```bash
curl -b cookies.txt -X POST http://localhost:8000/api/auth/logout
```
Respuesta: `200` y `{"message":"Logout successful"}`; cookies de auth eliminadas.

---

## 6. Pendientes / segunda fase

- **Rotación de refresh:** Ya se revoca el refresh anterior y se emite uno nuevo en cada refresh; opcionalmente limitar a un refresh token válido por usuario.
- **Limpieza de tokens vencidos:** Job periódico que borre filas de `refresh_tokens` con `expires_at < now()` o `revoked_at` antiguos.
- **Secure en producción:** Poner `COOKIE_SECURE=true` cuando la app se sirva por HTTPS.
- **Mismo origen:** La app está pensada para mismo origen (API y SPA en el mismo host). Si el front se sirve en otro dominio, habría que configurar CORS y posiblemente SameSite en cookies.
