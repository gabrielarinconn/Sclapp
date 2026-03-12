# Integrar n8n en el scraping de Sclapp

[n8n](https://n8n.io) es una herramienta de automatización de flujos (workflow) que puedes autohospedar. Aquí se resume qué hace falta para usarla junto al scraping actual.

---

## Situación actual del scraping

- **API:** `POST /api/scraping/run` recibe `source` y `query` pero aún no ejecuta el orquestador real (hay un TODO).
- **Orquestador:** `backend/services/scraping/scrape_service.py` → `run_scraping(parameters)` usa `example_source.scrape()` y guarda en una base en memoria (`fake_db`).
- **Módulo de negocio:** `ScrapingService.start_scraping(user_id)` escribe en PostgreSQL (tabla `company`, `scraping_logs`) con datos de ejemplo fijos.

Para que n8n sea útil, hay que definir **quién hace qué**: si n8n solo dispara el scraping, o si n8n hace el scraping y Sclapp solo recibe datos.

---

## Opción A: n8n solo dispara el scraping (recomendada para empezar)

n8n llama a tu API para ejecutar el scraping (por horario, webhook, etc.).

### Qué hace falta en Sclapp

1. **Conectar el endpoint con el orquestador real**  
   En `backend/api/v1/scraping.py`, que `POST /run`:
   - Llame a `scrape_service.run_scraping(...)` con `parameters` derivados del body (p. ej. `source`, `query`).
   - Opcional: ejecutar en background (Celery, `asyncio`, o un thread) para no bloquear la respuesta.

2. **Persistir en base de datos**  
   Hoy `scrape_service` usa `fake_db` en memoria. Para que los datos queden en PostgreSQL:
   - Sustituir (o complementar) `mock_upsert` por inserciones/actualizaciones reales en `company` usando `backend.db.connection` o el servicio de empresas.
   - Registrar el resultado en `scraping_logs` (como hace `ScrapingService.start_scraping`).

3. **Autenticación para n8n**  
   Si n8n llama desde fuera:
   - Definir un API key o token (header o query) y validarlo en el endpoint de scraping, **o**
   - Usar el flujo de login existente (JWT) y que n8n guarde y envíe el token en cada request.

4. **Respuesta estable**  
   Devolver JSON con `status`, `job_id` (si es asíncrono), `total_found`, `execution_status`, etc., para que n8n pueda ramificar el flujo o reintentar.

### Qué hace falta en n8n

- **Nodo HTTP Request:**  
  - Método: POST  
  - URL: `http://tu-servidor:8000/api/scraping/run` (o la de tu API).  
  - Body: `{"source": "example_source", "query": "..."}` (según el contrato actual).  
  - Headers: `Authorization: Bearer <token>` o el header que uses para el API key.
- **Trigger:**  
  - Cron/Schedule (ej. cada día a las 6:00) o Webhook (si quieres que algo externo dispare el scraping).

No necesitas instalar nada extra en el backend solo para “recibir la llamada”; solo exponer bien el endpoint y la autenticación.

---

## Opción B: n8n hace el scraping y envía datos a Sclapp

n8n hace las peticiones HTTP, parsea HTML (o JSON) y envía la lista de empresas a Sclapp.

### Qué hace falta en Sclapp

1. **Endpoint de importación masiva**  
   Por ejemplo: `POST /api/companies/import` o `POST /api/scraping/ingest` que reciba un JSON como:

   ```json
   {
     "source": "n8n_linkedin",
     "companies": [
       {
         "name": "...",
         "url": "...",
         "country": "...",
         ...
       }
     }
   }
   ```

2. **Validación y contrato**  
   Aplicar el mismo contrato que usa `_safe_company_contract` (name, nit, email, phone, url, country, sector, technologies, source, source_url) y normalizar con `normalizer.generate_dedupe_key` para deduplicar.

3. **Persistencia y log**  
   Insertar/actualizar en `company` y registrar en `scraping_logs` (con `source` indicando que viene de n8n).

4. **Autenticación**  
   Mismo criterio que en la opción A: API key o JWT para que n8n pueda llamar al endpoint de importación.

### Qué hace falta en n8n

- **Trigger:** Schedule, Webhook o manual.
- **Nodo(s) HTTP Request** para hacer el scraping (las URLs que hoy hace `example_source` o futuras fuentes).
- **Procesamiento:** nodos Code/Set para dar formato a cada ítem al contrato de Sclapp (name, url, country, source, etc.).
- **Nodo HTTP Request final:** POST a `http://tu-servidor:8000/api/companies/import` (o el path que implementes) con el array de empresas y auth.

Aquí no hace falta que el backend tenga lógica de scraping para esa fuente; solo un endpoint claro de importación y el mismo modelo de datos.

---

## Opción C: Híbrido (webhook de callback)

Sclapp ejecuta el scraping en background y al terminar llama a un webhook de n8n con el resultado.

### Qué hace falta en Sclapp

- Tras terminar `run_scraping` (y persistir en DB), hacer una petición HTTP POST a una URL configurable (variable de entorno, p. ej. `N8N_WEBHOOK_URL`) con un payload como:

  ```json
  {
    "event": "scraping.completed",
    "job_id": "...",
    "total_found": 10,
    "total_new": 3,
    "execution_status": "SUCCESS"
  }
  ```

- Manejo de errores y reintentos (y no bloquear el flujo principal si el webhook falla).

### Qué hace falta en n8n

- Un workflow con trigger **Webhook** que reciba ese POST y luego notifique, actualice algo, etc.

---

## Resumen rápido

| Objetivo                         | En Sclapp                                                                 | En n8n                                      |
|----------------------------------|---------------------------------------------------------------------------|---------------------------------------------|
| **A: n8n dispara el scraping**   | Endpoint `/run` conectado a `run_scraping` + persistir en DB + auth        | HTTP Request (POST) + Schedule o Webhook    |
| **B: n8n hace scraping y envía** | Endpoint `POST /api/companies/import` (o similar) + validación + auth      | HTTP Request (scraping) + Code + HTTP (import) |
| **C: Sclapp notifica a n8n**     | Tras scraping, POST a URL de webhook configurada (env var)                 | Webhook trigger                              |

Para implementar n8n en el scraping lo mínimo es:

1. **Decidir el flujo** (A, B o C).
2. **Completar el endpoint** `/api/scraping/run` y/o añadir uno de importación.
3. **Unificar persistencia:** que el resultado del orquestador se guarde en PostgreSQL (company + scraping_logs).
4. **Definir autenticación** (API key o JWT) para las llamadas que haga n8n a tu API.
5. **Documentar** la URL del backend y el formato del body para quien configure n8n.

Si indicas si quieres que n8n “solo dispare” (A) o “también envíe datos” (B), se puede bajar esto a pasos concretos por archivo (qué tocar en `scraping.py`, `scrape_service.py`, etc.).
