# Diagnóstico del proyecto Sclapp (MVP por fases)

Estado del código respecto al orden de fases definido para el MVP.

---

## Fase 1 — Base funcional

### 1. Autenticación  
**Estado: Backend listo, frontend desconectado**

| Aspecto | Estado |
|--------|--------|
| **Backend** | Login y registro con **bcrypt** (hash y verificación). Endpoints `POST /api/auth/login` y `POST /api/auth/register` funcionando. |
| **Frontend** | **No usa la API**: login hace comprobación local `admin@sclapp.com` / `123456` y no llama a `apiClient.login`. Registro no llama a `apiClient.register`. |
| **Sesión** | No hay JWT ni token: `apiClient` no envía `Authorization`. El backend no sabe "quién está logueado" en el resto de rutas. |
| **Logout** | Solo cambia de vista; no borra token (comentario TODO en `main.js`). |

**Pendiente:** Conectar login/register al backend, definir sesión (JWT o cookie) y enviar credencial en las peticiones; opcionalmente guardar usuario en `localStorage` para mostrar nombre en sidebar.

---

### 2. Gestión de empresas  
**Estado: Operativa**

| Aspecto | Estado |
|--------|--------|
| **Backend** | `GET /api/companies` con filtros por tecnología, score y búsqueda por nombre. Lee de `company` y `company_technologies`. |
| **Frontend** | Vista Companies con tabla, filtros y modal "Run scraping". Llama a `getCompanies()` y pinta datos. |
| **CRUD** | Solo lectura. No hay endpoints (ni UI) para crear/editar/eliminar empresas; el módulo `company_service` tiene `update_company` pero no está expuesto en la API actual. |

**Pendiente (opcional):** Endpoints y UI para crear/editar empresa si el MVP lo requiere.

---

### 3. Dashboard básico  
**Estado: Operativo**

| Aspecto | Estado |
|--------|--------|
| **Backend** | `GET /api/dashboard/metrics` (totales de empresas, emails enviados, empresas en contacto, open rate). `GET /api/dashboard/ai-report` devuelve ítems fijos (sin modelo real). |
| **Frontend** | Vista Dashboard que llama a `getDashboardMetrics()` y `getDashboardAiReport()` y muestra KPIs y reporte. |
| **Tendencias** | `trend_*` están hardcodeados ("+12.5", "+8.3", etc.). |

**Pendiente (opcional):** Calcular tendencias reales y, si aplica, conectar el reporte a OpenAI.

---

## Fase 2 — Core del negocio

### 4. Scraping manual  
**Estado: Parcial — orquestador listo, API y persistencia desconectadas**

| Aspecto | Estado |
|--------|--------|
| **Orquestador** | `backend/services/scraping/scrape_service.py`: `run_scraping(parameters)` con `example_source.scrape()`, normalización, deduplicación en memoria (`fake_db`). |
| **Fuente** | `example_source.py`: scraping real a una tabla HTML de ejemplo (W3Schools), contrato de empresa cumplido. |
| **API** | `POST /api/scraping/run` **no** llama al orquestador; responde "started" y tiene un TODO. |
| **Persistencia** | El orquestador escribe solo en `fake_db` (memoria). `ScrapingService.start_scraping()` inserta en PostgreSQL pero con datos **fijos** (lista hardcodeada), no el resultado del orquestador. |
| **Frontend** | Modal "Run scraping" en Companies que llama a `apiClient.runScraping()`; la API no ejecuta scraping real ni guarda en DB. |

**Pendiente:** Enlazar `POST /scraping/run` con `run_scraping()`, persistir resultado en `company` (y `scraping_logs` si aplica) y opcionalmente recibir `id_user` desde sesión.

---

### 5. Clasificación con OpenAI  
**Estado: Servicio listo, no integrado**

| Aspecto | Estado |
|--------|--------|
| **Servicio** | `backend/services/ai/company_classifier.py`: `CompanyClassifier.classify(description)` llama a GPT-3.5 y devuelve `industry` y `category`. Si no hay `OPENAI_API_KEY`, devuelve valores por defecto. |
| **Uso** | **Ningún** otro módulo importa ni usa `CompanyClassifier` (ni en scraping ni en empresas). |
| **Score / categoría en empresa** | La tabla `company` tiene `score`, `sector`, `category`; no hay flujo que llame al clasificador al crear/actualizar empresa. |

**Pendiente:** Integrar el clasificador (por ejemplo en el flujo de scraping o al guardar empresa) y rellenar `sector`/`category` o un "score" derivado; exponer en API/UI si el MVP lo pide.

---

## Fase 3 — Outreach

### 6. Envío de correos con Brevo  
**Estado: Clientes listos, flujo de envío no conectado**

| Aspecto | Estado |
|--------|--------|
| **Clientes** | `BrevoClient` (requests a API Brevo) y `BrevoService` (SDK `sib-api-v3-sdk`) existen; envío por API/configuración Brevo implementado. |
| **API** | `POST /api/emails/send-bulk` responde "Bulk send queued" y **no** llama a Brevo ni escribe en `emails`. |
| **Plantilla** | `POST /api/emails/template/ai` devuelve cuerpo fijo; no usa IA ni Brevo templates. |
| **Frontend** | Correos llama a `sendBulkEmails()` y `generateEmailTemplate()`; el backend no envía ni guarda historial. |

**Pendiente:** En `send-bulk` (o en un job asociado): para cada destinatario, generar/enviar con Brevo, insertar fila en `emails` y, si Brevo envía webhooks, registrar eventos en `email_events`. Definir si el template viene de Brevo o del endpoint `template/ai`.

---

### 7. Historial de contactos  
**Estado: Solo esquema y uso en métricas**

| Aspecto | Estado |
|--------|--------|
| **Base de datos** | Tablas `emails` e `email_events` definidas en `schema.sql`. |
| **Uso actual** | Dashboard usa `emails` y `email_events` para métricas (enviados, abiertos). |
| **API** | No hay endpoint tipo "historial de contactos" (lista de envíos por empresa/usuario con eventos). Pipeline de emails devuelve columnas kanban con tarjetas pero no un listado explícito de historial. |
| **Frontend** | Vista Emails con pipeline/kanban; no hay vista dedicada "Historial de contactos". |

**Pendiente:** Endpoint(s) para listar envíos (y eventos) por empresa o usuario y, si aplica, una vista o sección "Historial de contactos" en la UI.

---

## Fase 4 — Cierre visual

### 8. Perfil / configuración mínima  
**Estado: Endpoints y UI presentes, sin sesión real**

| Aspecto | Estado |
|--------|--------|
| **Backend** | `GET /api/profile/me` devuelve el primer usuario (LIMIT 1). `PUT /api/profile/me` y `PUT /api/profile/smtp` devuelven "updated" pero no modifican DB (TODOs). `POST /api/profile/smtp/test` placeholder. |
| **Frontend** | Vista Profile con formulario de perfil y SMTP; llama a `getProfile()`, `updateProfile()`, `updateSmtpConfig()`, `testSmtp()`. |
| **Sesión** | Sin JWT/token, "perfil actual" no existe: todos ven el mismo usuario (el primero). |

**Pendiente:** Identificar usuario con JWT (o sesión) y que `profile/me` y `PUT profile/me` usen ese `id_user`; persistir cambios en `users` (y en tabla de configuración SMTP si la añades). Conectar test SMTP con Brevo o SMTP real.

---

## Resumen por fase

| Fase | Ítem | Estado | Acción prioritaria |
|------|------|--------|--------------------|
| **1** | Autenticación | Backend ok, frontend fake | Conectar login/register al API + JWT/sesión |
| **1** | Gestión empresas | Ok (solo lectura) | Opcional: CRUD si hace falta |
| **1** | Dashboard básico | Ok | Opcional: tendencias y reporte AI reales |
| **2** | Scraping manual | Orquestador ok, API y DB no | Conectar `/scraping/run` → orquestador → PostgreSQL |
| **2** | Clasificación OpenAI | Servicio ok, no usado | Integrar clasificador en scraping o alta/edición empresa |
| **3** | Envío Brevo | Clientes ok, send-bulk no | Implementar envío real y guardado en `emails` |
| **3** | Historial contactos | Solo tablas y métricas | API de historial + vista si aplica |
| **4** | Perfil/config | Placeholders | Sesión por usuario + persistir perfil y SMTP |

Orden sugerido para cerrar el MVP: (1) **autenticación real en frontend + JWT** y (2) **scraping manual completo** (API + persistencia); luego Brevo real, historial y perfil por usuario.
