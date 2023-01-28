document.addEventListener("DOMContentLoaded", () => {
  App.init();
});

/**
 * Tarea form
 */
const tareaForm = document.querySelector("#tareaForm");

tareaForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = tareaForm["titulo"].value;
  const descripcion = tareaForm["descripcion"].value;
  App.crearTarea(titulo, descripcion);
});
