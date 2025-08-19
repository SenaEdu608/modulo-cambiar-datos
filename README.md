# Módulo Cambiar Datos de Usuario

**Evidencia:** Desarrollar software a partir de la integración de sus módulos
componentes.GA8-220501096-AA1-EV01

**Nombre:**  Johna Jairo Zamdudio Agudelo

**Ficha:** 2977467

Este proyecto implementa un **módulo web** que permite a los usuarios **visualizar y actualizar su información personal** (nombre, correo, teléfono, dirección y contraseña).  
Forma parte de un sistema mayor y sigue principios de arquitectura en capas (frontend, backend, base de datos).

---

## Características principales
- Visualización de datos personales desde la base de datos.
- Edición de nombre, correo, teléfono y dirección.
- Cambio opcional de contraseña con validaciones seguras:
  - Mínimo 8 caracteres.
  - Una mayúscula.
  - Un número.
  - Un carácter especial.
- Validaciones en frontend y backend.
- Contraseñas almacenadas con **bcrypt**.
- Arquitectura organizada por capas (controllers, routes, models, db, frontend).

---

## Tecnologías usadas
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js + Express  
- **Base de Datos**: MySQL  
- **Dependencias**:  
  - `express`  
  - `mysql2/promise`  
  - `bcrypt`  
  - `cors`

---

## Instalación y ejecución

### 1. Clonar repositorio
```bash
git clone  https://github.com/SenaEdu608/modulo-cambiar-datos.git
cd modulo-cambiar-datos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos
- Importar el script:
  ```
  /db/modulo-cambiar-datos.sql
  ```
- Revisar archivo `db/conexion.js` y ajustar credenciales de MySQL:
  ```js
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "modulo-cambiar-datos"
  });
  ```

### 4. Ejecutar servidor
```bash
node backend/app.js
```

Servidor corriendo en:
```
http://localhost:3000
```

---

## Endpoints principales

### Obtener datos de usuario
```http
GET /api/usuarios/obtener-datos
```
**Ejemplo de respuesta:**
```json
{
  "success": true,
  "datos": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "3001234567",
    "direccion": "Calle 123 #45-67"
  }
}
```

---

### Actualizar datos de usuario
```http
PUT /api/usuarios/actualizar-datos
```
**Body (JSON):**
```json
{
  "nombre": "Juan Pérez Actualizado",
  "correo": "juan_nuevo@example.com",
  "telefono": "3117654321",
  "direccion": "Carrera 50 #10-20",
  "nuevaContrasena": "Prueba123!",
  "confirmarContrasena": "Prueba123!"
}
```

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "message": "Datos actualizados correctamente.",
  "datos": {
    "id": 1,
    "nombre": "Juan Pérez Actualizado",
    "correo": "juan_nuevo@example.com",
    "telefono": "3117654321",
    "direccion": "Carrera 50 #10-20"
  }
}
```

---

## Pruebas en Postman

Casos cubiertos:
1. Obtener datos (GET).  
2. Actualizar datos (PUT).  
3. Contraseña demasiado corta.  
4. Contraseña sin mayúscula/número/caracter especial.  
5. Contraseñas que no coinciden.  

---

## Estructura del proyecto

```
/backend
  /controllers
    actualizarDatos.controller.js
    perfil.controller.js
  /routes
    usuarios.routes.js
  /db
    conexion.js
  /models
    usuario.model.js
  app.js

/frontend
  /html
    bienvenido.html
    cambiarDatos.html
  /css
    nav.css
    cambiarDatos.css
  /js
    cambiarDatos.js
    mostrarSecciones.js

/db
  modulo-cambiar-datos.sql
```

---

## Buenas prácticas aplicadas
- Separación en capas (MVC simplificado).
- Validaciones en frontend y backend.
- Hashing de contraseñas con `bcrypt`.
- Código comentado y organizado.
- Control de versiones con **Git**.

---


