/**
 * Módulo para gestionar la edición de datos del perfil de usuario
 */

// Función autoinvocada para cargar los datos al iniciar
(function init() {
  if (document.getElementById('cambiarDatos')) {
    cargarCambiarDatos();
  }
})();

// Carga el HTML dinámico de la sección de cambiar datos
async function cargarCambiarDatos() {
  const contenedor = document.getElementById('cambiarDatos');

  if (!contenedor) {
    console.error('No se encontró la sección #cambiarDatos');
    return;
  }

  try {
    const response = await fetch('/frontend/html/link-barra-tareas-html/cambiarDatos.html');
    if (!response.ok) {
      throw new Error(`Error al cargar CambiarDatos: ${response.statusText}, ${response.status}`);
    }

    const html = await response.text();
    contenedor.innerHTML = html;

    // Configuraciones después de cargar el HTML
    setTimeout(function() {
      configurarToggleFormularioPassword();
      configurarValidacionPassword();
      cargarDatosUsuario();
      configurarFormulario();
    }, 0);

  } catch (error) {
    console.error('Error al cargar CambiarDatos:', error);
    contenedor.innerHTML = '<p>Error al cargar la sección de perfil.</p>';
  }
}

// Configura el toggle para mostrar/ocultar campos de contraseña
function configurarToggleFormularioPassword() {
  const boton = document.getElementById('perfil-toggle-password');
  const contenedorPassword = document.getElementById('perfil-password-container');
  const inputPassword = document.getElementById('perfil-password');
  const inputConfirmacion = document.getElementById('perfil-confirmacion');

  if (!boton || !contenedorPassword) return;

  // Estado inicial
  boton.textContent = 'Cambiar Contraseña';

  // Evento click para alternar visibilidad
  boton.addEventListener('click', function() {
    if (contenedorPassword.classList.contains('oculto')) {
      // Mostrar campos de contraseña
      contenedorPassword.classList.remove('oculto');
      boton.textContent = 'Cancelar';
      if (inputPassword) inputPassword.value = '';
      if (inputConfirmacion) inputConfirmacion.value = '';
      setTimeout(function() {
        if (inputPassword) inputPassword.focus();
      }, 50);
    } else {
      // Ocultar campos de contraseña
      contenedorPassword.classList.add('oculto');
      boton.textContent = 'Cambiar Contraseña';
      if (inputPassword) inputPassword.value = '';
      if (inputConfirmacion) inputConfirmacion.value = '';
    }
  });
}

// Configura la validación en tiempo real de la contraseña
function configurarValidacionPassword() {
  const inputPassword = document.getElementById('perfil-password');
  const inputConfirmacion = document.getElementById('perfil-confirmacion');
  const hint = document.querySelector('.password-hint');

  if (!inputPassword || !inputConfirmacion || !hint) return;

  inputPassword.addEventListener('input', validarPassword);
  inputConfirmacion.addEventListener('input', validarConfirmacion);

  function validarPassword() {
    const value = inputPassword.value;
    
    // Validaciones
    const longitudValida = value.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(value);
    const tieneNumero = /\d/.test(value);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    // Actualizar mensaje
    hint.innerHTML = 
      '<span class="' + (longitudValida ? 'valido' : 'invalido') + '">✓ 8+ caracteres</span><br>' +
      '<span class="' + (tieneMayuscula ? 'valido' : 'invalido') + '">✓ Mayúscula</span><br>' +
      '<span class="' + (tieneNumero ? 'valido' : 'invalido') + '">✓ Número</span><br>' +
      '<span class="' + (tieneEspecial ? 'valido' : 'invalido') + '">✓ Carácter especial</span>';
  }

  function validarConfirmacion() {
    const password = inputPassword.value;
    const confirmacion = inputConfirmacion.value;
    
    if (confirmacion && password !== confirmacion) {
      inputConfirmacion.setCustomValidity("Las contraseñas no coinciden");
    } else {
      inputConfirmacion.setCustomValidity("");
    }
  }
}

// Configura el envío del formulario
function configurarFormulario() {
  const formulario = document.getElementById('perfil-formulario');
  if (!formulario) return;

  formulario.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener valores de los campos
    const nombre = document.getElementById('perfil-nombre') ? document.getElementById('perfil-nombre').value.trim() : '';
    const telefono = document.getElementById('perfil-telefono') ? document.getElementById('perfil-telefono').value.trim() : '';
    const direccion = document.getElementById('perfil-direccion') ? document.getElementById('perfil-direccion').value.trim() : '';
    const correo = document.getElementById('perfil-email') ? document.getElementById('perfil-email').value.trim() : '';
    const nuevaContrasena = document.getElementById('perfil-password') ? document.getElementById('perfil-password').value.trim() : '';
    const confirmarContrasena = document.getElementById('perfil-confirmacion') ? document.getElementById('perfil-confirmacion').value.trim() : '';

    // Validación básica de campos obligatorios
    if (!nombre || !telefono || !direccion || !correo) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    // Validación de contraseña si se está cambiando
    if (nuevaContrasena) {
      if (nuevaContrasena.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (!/[A-Z]/.test(nuevaContrasena)) {
        alert("La contraseña debe contener al menos una mayúscula.");
        return;
      }
      if (!/\d/.test(nuevaContrasena)) {
        alert("La contraseña debe contener al menos un número.");
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(nuevaContrasena)) {
        alert("La contraseña debe contener al menos un carácter especial.");
        return;
      }
      if (nuevaContrasena !== confirmarContrasena) {
        alert("Las contraseñas no coinciden.");
        return;
      }
    }

    try {
      // Enviar datos al servidor
      const response = await fetch('http://localhost:3000/api/usuarios/actualizar-datos', {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          telefono: telefono,
          direccion: direccion,
          correo: correo,
          nuevaContrasena: nuevaContrasena || undefined,
          confirmarContrasena: confirmarContrasena || undefined
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al actualizar los datos.");
      }

      if (result.success) {
        alert("Datos actualizados correctamente.");
        // Limpiar y ocultar campos de contraseña
        const contenedorPassword = document.getElementById('perfil-password-container');
        const botonPassword = document.getElementById('perfil-toggle-password');
        if (contenedorPassword) contenedorPassword.classList.add('oculto');
        if (botonPassword) botonPassword.textContent = 'Cambiar Contraseña';
        document.getElementById('perfil-password').value = '';
        document.getElementById('perfil-confirmacion').value = '';
        
        // Recargar datos
        await cargarDatosUsuario();
      } else {
        alert(result.message || "Error al actualizar los datos.");
      }

    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert(error.message || "Error al actualizar los datos.");
    }
  });
}

// Carga los datos del usuario desde el servidor
async function cargarDatosUsuario() {
  try {
    const response = await fetch('http://localhost:3000/api/usuarios/obtener-datos');
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al cargar los datos.");
    }

    if (result.success && result.datos) {
      // Asegurarse de mostrar el ID (1 en modo prueba)
      document.getElementById('perfil-user-id').textContent = "ID del Usuario: " + (result.datos.id || 1);
      document.getElementById('perfil-nombre').value = result.datos.nombre || '';
      document.getElementById('perfil-telefono').value = result.datos.telefono || '';
      document.getElementById('perfil-email').value = result.datos.correo || '';
      document.getElementById('perfil-direccion').value = result.datos.direccion || '';
    } else {
      throw new Error(result.message || "Error al cargar los datos del perfil.");
    }

  } catch (error) {
    console.error('Error al cargar los datos del perfil:', error);
    alert("Error al cargar los datos del perfil. Recargando...");
    setTimeout(function() {
      window.location.reload();
    }, 2000);
  }
}
