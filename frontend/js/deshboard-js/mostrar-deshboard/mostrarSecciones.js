// frontend/js/deshboard-js/mostrar-deshboard/mostrarSecciones.js
function mostrarSeccion(idMostrar) {
  // Ocultar todas las secciones primero
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('oculto');
  });
  
  // Mostrar la sección solicitada
  const seccion = document.getElementById(idMostrar);
  if (seccion) {
    seccion.classList.remove('oculto');
  }
}

// Hacer la función accesible globalmente
window.mostrarSeccion = mostrarSeccion;