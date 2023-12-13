function validarFormulario() {
  // Obtener los valores de los campos
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const tema = document.getElementById("tema").value;

  // Validar si algún campo está vacío
  if (nombre === "" || apellido === "" || email === "" || tema === "") {
    alert(
      "Por favor, complete todos los campos antes de enviar el formulario."
    );
    return false;
  }

  // Si la validación es exitosa, llama a la función para guardar al orador
  guardarOrador();

  // Evitar que el formulario se envíe automáticamente
  return false;
}

function guardarOrador() {
  // Obtener datos del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const tema = document.getElementById("tema").value;

  // Construir objeto con los datos
  const nuevoOrador = {
    nombre: nombre,
    apellido: apellido,
    email: email,
    tema: tema,
  };

  // Realizar llamada al backend para guardar el orador
  fetch("http://localhost:8080/web-app/api/orador", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoOrador),
  })
    .then((response) => response.json())
    .then((data) => {
      mostrarModal("Orador guardado exitosamente con el numero: " + data.id);
      document.getElementById("nombre").value = "";
      document.getElementById("apellido").value = "";
      document.getElementById("email").value = "";
      document.getElementById("tema").value = "";

      mostrarOradores();
    })
    .catch((error) => {
      console.error("Error al guardar el orador:", error);
    });
}

function mostrarModal(mensaje) {
  const modal = new bootstrap.Modal(document.getElementById("miModal"));
  document.getElementById("modalMensaje").innerText = mensaje;
  modal.show();
}

function mostrarOradores() {
  // Realizar llamada al backend para obtener la lista de oradores
  fetch("http://localhost:8080/web-app/api/orador")
    .then((response) => response.json())
    .then((data) => {
      console.log("Lista de oradores:", data);
      // Puedes actualizar la tabla de oradores o realizar otras acciones
      actualizarTablaOradores(data);
    })
    .catch((error) => {
      console.error("Error al obtener la lista de oradores:", error);
    });
}

function actualizarTablaOradores(oradores) {
  // Obtener referencia a la tabla
  const tabla = document.getElementById("tablaOradores");

  // Limpiar la tabla
  tabla.innerHTML = "";

  // Agregar encabezados
  const encabezados = ["ID", "Nombre", "Apellido", "Email", "Tema", "Acciones"];
  const encabezadoRow = tabla.insertRow(0);
  encabezados.forEach((encabezado, index) => {
    const cell = encabezadoRow.insertCell(index);
    cell.textContent = encabezado;
  });

  // Agregar filas con datos de oradores
  oradores.forEach((orador) => {
    const row = tabla.insertRow();

    // Iterar sobre todas las propiedades del objeto Orador, excepto 'fechaAlta'
    Object.keys(orador).forEach((key) => {
      if (key !== "fechaAlta") {
        const cell = row.insertCell();
        cell.textContent = orador[key];
      }
    });

    // Agregar botones de acciones (eliminar y editar)
    const accionesCell = row.insertCell();

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarOrador(orador.id));
    accionesCell.appendChild(btnEditar);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("delete");
    btnEliminar.addEventListener("click", () => eliminarOrador(orador.id));
    accionesCell.appendChild(btnEliminar);
  });
}

function eliminarOrador(id) {
  // Mostrar el modal de confirmación
  const modalEliminar = new bootstrap.Modal(
    document.getElementById("miModalEliminar")
  );
  modalEliminar.show();

  // Configurar el evento click para el botón "Eliminar"
  document.getElementById("botonEliminar").onclick = function () {
    fetch(`http://localhost:8080/web-app/api/orador?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Mostrar modal con el mensaje
          mostrarModal(`Orador con ID ${id} eliminado exitosamente`);

          // Actualizar la tabla después de la eliminación
          mostrarOradores();
        } else {
          console.error("Error al eliminar el orador:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el orador:", error);
      });

    // Cerrar el modal de confirmación
    modalEliminar.hide();
  };
}

// Función para manejar la edición de un orador
function editarOrador(id) {
  fetch(`http://localhost:8080/web-app/api/orador?id=${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Error al obtener datos del orador: ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((oradores) => {
      // Buscar el orador específico por ID
      const orador = oradores.find((o) => o.id === id);

      console.log("Orador seleccionado:", orador);

      if (!orador) {
        console.error(`No se encontró el orador con ID ${id}`);
        return;
      }

      // Configurar campos de entrada con los datos del orador
      document.getElementById("nuevoNombre").value = orador.nombre || "";
      document.getElementById("nuevoApellido").value = orador.apellido || "";
      document.getElementById("nuevoEmail").value = orador.email || "";
      document.getElementById("nuevoTema").value = orador.tema || "";

      // Mostrar el modal de edición
      const modalEditar = new bootstrap.Modal(
        document.getElementById("miModalEditar")
      );
      modalEditar.show();

      // Configurar el evento click para el botón "Guardar Cambios"
      document.getElementById("botonGuardarEdicion").onclick = function () {
        const nuevoNombre = document.getElementById("nuevoNombre").value;
        const nuevoApellido = document.getElementById("nuevoApellido").value;
        const nuevoEmail = document.getElementById("nuevoEmail").value;
        const nuevoTema = document.getElementById("nuevoTema").value;

        // Construir objeto con los datos actualizados
        const datosActualizados = {
          nombre: nuevoNombre,
          apellido: nuevoApellido,
          email: nuevoEmail,
          tema: nuevoTema,
        };

        // Realizar llamada al backend para actualizar los datos del orador
        fetch(`http://localhost:8080/web-app/api/orador?id=${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        })
          .then((response) => {
            if (response.ok) {
              // Mostrar modal con el mensaje
              mostrarModal(`Orador con ID ${id} editado exitosamente`);

              // Actualizar la tabla después de la edición
              mostrarOradores();
            } else {
              console.error("Error al editar el orador:", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error al editar el orador:", error);
          });

        // Cerrar el modal de edición
        modalEditar.hide();
      };
    })
    .catch((error) => {
      console.error(error.message);
    });
}
