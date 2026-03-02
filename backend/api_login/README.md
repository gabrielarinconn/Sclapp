# Documentación del Backend - Endpoint /api/login

## Introducción

Este documento describe la implementación inicial del backend para la plataforma web SPA de automatización del proceso de captación y contacto de empresas con vacantes tecnológicas. Específicamente, se ha desarrollado la funcionalidad de autenticación de usuarios mediante el endpoint `/api/login`, incluyendo el uso de bcrypt para el hashing de contraseñas y un manejo adecuado de errores de autenticación.

El backend se ha construido como un MVP funcional utilizando Python con Flask, y se integra con una base de datos relacional (SQLite en este caso, pero fácilmente adaptable a otras como PostgreSQL o MySQL).

## Tecnologías Implementadas

### Lenguajes y micro-Frameworks
- **Python 3.14.0**: Lenguaje principal para el desarrollo del backend.
- **Flask 2.3.3**: Framework web ligero y flexible para crear APIs RESTful. Se utiliza para manejar rutas, solicitudes HTTP y respuestas JSON.
- **Flask-Bcrypt 1.0.1**: Extensión de Flask para el hashing seguro de contraseñas utilizando el algoritmo bcrypt. Proporciona funciones para generar hashes y verificar contraseñas.
- **Flask-SQLAlchemy 3.0.5**: Extensión de Flask para la integración con SQLAlchemy, un ORM (Object-Relational Mapping) que facilita la interacción con bases de datos relacionales. Permite definir modelos de datos y realizar consultas de manera orientada a objetos.

### Base de Datos
- **SQLite**: Base de datos relacional embebida utilizada para el almacenamiento de datos de usuarios. Es ligera, no requiere servidor separado y es ideal para desarrollo y pruebas. La configuración permite cambiar fácilmente a otras bases de datos relacionales mediante la variable de entorno `DATABASE_URL`.

### Otras Herramientas
- **SQLAlchemy 2.0.46**: ORM subyacente para la gestión de la base de datos, proporcionando una interfaz de alto nivel para crear, leer, actualizar y eliminar registros.
- **Werkzeug 3.1.6**: Biblioteca WSGI utilizada internamente por Flask para el manejo de solicitudes y respuestas HTTP.
- **Jinja2 3.1.6**: Motor de plantillas utilizado por Flask (aunque no se usa en este endpoint API puro).
- **Pip**: Gestor de paquetes de Python para instalar dependencias.

## Pasos de Implementación

### 1. Configuración del Entorno Python
- Se configuró un entorno Python virtual o de sistema para aislar las dependencias del proyecto.
- Se verificó la versión de Python (3.14.0) y se estableció el comando prefix para ejecutar scripts: `C:/Users/INVITADO1/AppData/Local/Programs/Python/Python314/python.exe`.

### 2. Instalación de Dependencias
- Se creó el archivo `requirements.txt` con las versiones específicas de las bibliotecas necesarias:
  ```
  Flask==2.3.3
  Flask-Bcrypt==1.0.1
  Flask-SQLAlchemy==3.0.5
  ```
- Se instalaron las dependencias utilizando pip: `python -m pip install -r requirements.txt`.
- Esto asegura que todas las bibliotecas requeridas estén disponibles en el entorno.

### 3. Configuración de la Aplicación
- **Archivo `config.py`**: Define la configuración de la aplicación Flask.
  - `SECRET_KEY`: Clave secreta para sesiones y tokens (configurable vía variable de entorno).
  - `SQLALCHEMY_DATABASE_URI`: URI de la base de datos (SQLite por defecto, configurable).
  - `SQLALCHEMY_TRACK_MODIFICATIONS`: Deshabilitado para mejorar el rendimiento.
- Esta configuración permite una fácil transición entre entornos (desarrollo, producción) y bases de datos.

### 4. Definición del Modelo de Datos
- **Archivo `models.py`**: Define el modelo `User` utilizando SQLAlchemy.
  - Campos: `id` (clave primaria), `username` (único, no nulo), `password_hash` (hash de la contraseña).
  - Métodos:
    - `set_password(password)`: Genera un hash bcrypt de la contraseña y lo almacena.
    - `check_password(password)`: Verifica si la contraseña proporcionada coincide con el hash almacenado.
- Se inicializan las instancias de `db` (SQLAlchemy) y `bcrypt` (Flask-Bcrypt) para su uso en la aplicación.

### 5. Implementación del Endpoint /api/login
- **Archivo `app.py`**: Contiene la aplicación Flask principal.
  - Se crea la instancia de Flask y se carga la configuración.
  - Se inicializa la base de datos con `db.init_app(app)`.
  - **Endpoint `/api/login`**:
    - Método: POST
    - Procesa solicitudes JSON.
    - Valida la presencia de `username` y `password` en el cuerpo de la solicitud.
    - Consulta la base de datos para encontrar el usuario por `username`.
    - Verifica la contraseña utilizando `user.check_password(password)`.
    - Respuestas:
      - Éxito (200): `{"message": "Login successful", "user_id": <id>}`
      - Error de validación (400): `{"error": "Username and password are required"}`
      - Error de autenticación (401): `{"error": "Invalid username or password"}`
- En el bloque `if __name__ == '__main__'`: Crea las tablas de la base de datos si no existen y ejecuta el servidor en modo debug.

### 6. Inicialización de la Base de Datos (para Pruebas)
- **Archivo `init_db.py`**: Script auxiliar para inicializar la base de datos y crear un usuario de prueba.
  - Crea las tablas si no existen.
  - Inserta un usuario de prueba (`username: testuser`, `password: testpass`) si no existe.
  - Útil para desarrollo y testing.

### 7. Pruebas del Endpoint
- Se ejecutó el servidor Flask: `python app.py`.
- Se inicializó la base de datos con el usuario de prueba.
- Se probaron diferentes escenarios:
  - Login exitoso: Credenciales correctas → Respuesta 200.
  - Login fallido: Contraseña incorrecta → Respuesta 401.
  - Login fallido: Usuario inexistente → Respuesta 401.
  - Solicitud inválida: Campos faltantes → Respuesta 400.
- Las pruebas confirmaron el correcto funcionamiento del hashing con bcrypt y el manejo de errores.

## Archivos Creados

- `requirements.txt`: Lista de dependencias con versiones.
- `config.py`: Configuración de la aplicación.
- `models.py`: Definición del modelo User y funciones de bcrypt.
- `app.py`: Aplicación Flask con el endpoint /api/login.
- `init_db.py`: Script para inicializar la base de datos (opcional para pruebas).

## Cómo Ejecutar el Proyecto

1. Asegúrate de tener Python 3.14.0 instalado.
2. Navega al directorio del proyecto: `cd api_login`.
3. Instala las dependencias: `python -m pip install -r requirements.txt`.
4. Inicializa la base de datos (opcional): `python init_db.py`.
5. Ejecuta el servidor: `python app.py`.
6. El servidor estará disponible en `http://localhost:5000`.
7. Prueba el endpoint con herramientas como curl, Postman o Invoke-WebRequest en PowerShell.

## Manejo de Errores de Autenticación

- **Validación de Entrada**: Se verifica que el JSON contenga `username` y `password`. Si faltan, se devuelve un error 400.
- **Verificación de Credenciales**: Se busca el usuario en la base de datos. Si no existe o la contraseña no coincide (usando bcrypt), se devuelve un error 401.
- **Seguridad**: Las contraseñas nunca se almacenan en texto plano; siempre se hashean con bcrypt, que incluye salting automático para prevenir ataques de rainbow table.
- **Respuestas Consistentes**: Los errores de autenticación (usuario no encontrado vs. contraseña incorrecta) devuelven el mismo mensaje para evitar enumeración de usuarios.

## Consideraciones de Seguridad y Mejoras Futuras

- **JWT Tokens**: Actualmente, el login solo verifica credenciales. Para una SPA completa, se recomienda implementar tokens JWT para mantener sesiones.
- **Rate Limiting**: Agregar límites a las solicitudes de login para prevenir ataques de fuerza bruta.
- **Validación Avanzada**: Usar bibliotecas como Marshmallow para validación de esquemas JSON.
- **Logging**: Implementar logging para auditar intentos de login.
- **Base de Datos**: Migrar a PostgreSQL o MySQL para producción.
- **CORS**: Configurar CORS si el frontend está en un dominio diferente.

Esta implementación proporciona una base sólida y segura para la autenticación en el sistema. El código es modular y extensible para agregar más funcionalidades como registro de usuarios, recuperación de contraseña, etc.