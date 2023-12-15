function validarFormulario() {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const tema = document.getElementById("tema").value;

  if (nombre === "" || apellido === "" || email === "" || tema === "") {
    alert(
      "Por favor, complete todos los campos antes de enviar el formulario."
    );
    return false;
  }

  guardarOrador();

  return false;
}

function guardarOrador() {
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const tema = document.getElementById("tema").value;

  const nuevoOrador = {
    nombre: nombre,
    apellido: apellido,
    email: email,
    tema: tema,
  };

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
  fetch(
    "https://castogil.github.io/Tp_Laconferencia.github.io/src/view/pages/quieroSerOrador.html"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Lista de oradores:", data);

      actualizarTablaOradores(data);
    })
    .catch((error) => {
      console.error("Error al obtener la lista de oradores:", error);
    });
}

function actualizarTablaOradores(oradores) {
  const tabla = document.getElementById("tablaOradores");

  tabla.innerHTML = "";

  const encabezados = ["ID", "Nombre", "Apellido", "Email", "Tema", "Acciones"];
  const encabezadoRow = tabla.insertRow(0);
  encabezados.forEach((encabezado, index) => {
    const cell = encabezadoRow.insertCell(index);
    cell.textContent = encabezado;
  });

  oradores.forEach((orador) => {
    const row = tabla.insertRow();

    Object.keys(orador).forEach((key) => {
      if (key !== "fechaAlta") {
        const cell = row.insertCell();
        cell.textContent = orador[key];
      }
    });

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
  const modalEliminar = new bootstrap.Modal(
    document.getElementById("miModalEliminar")
  );
  modalEliminar.show();

  document.getElementById("botonEliminar").onclick = function () {
    fetch(`http://localhost:8080/web-app/api/orador?id=${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          mostrarModal(`Orador con ID ${id} eliminado exitosamente`);

          mostrarOradores();
        } else {
          console.error("Error al eliminar el orador:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el orador:", error);
      });

    modalEliminar.hide();
  };
}

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
      const orador = oradores.find((o) => o.id === id);

      console.log("Orador seleccionado:", orador);

      if (!orador) {
        console.error(`No se encontró el orador con ID ${id}`);
        return;
      }

      document.getElementById("nuevoNombre").value = orador.nombre || "";
      document.getElementById("nuevoApellido").value = orador.apellido || "";
      document.getElementById("nuevoEmail").value = orador.email || "";
      document.getElementById("nuevoTema").value = orador.tema || "";

      const modalEditar = new bootstrap.Modal(
        document.getElementById("miModalEditar")
      );
      modalEditar.show();

      document.getElementById("botonGuardarEdicion").onclick = function () {
        const nuevoNombre = document.getElementById("nuevoNombre").value;
        const nuevoApellido = document.getElementById("nuevoApellido").value;
        const nuevoEmail = document.getElementById("nuevoEmail").value;
        const nuevoTema = document.getElementById("nuevoTema").value;

        const datosActualizados = {
          nombre: nuevoNombre,
          apellido: nuevoApellido,
          email: nuevoEmail,
          tema: nuevoTema,
        };

        fetch(`http://localhost:8080/web-app/api/orador?id=${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        })
          .then((response) => {
            if (response.ok) {
              mostrarModal(`Orador con ID ${id} editado exitosamente`);

              mostrarOradores();
            } else {
              console.error("Error al editar el orador:", response.statusText);
            }
          })
          .catch((error) => {
            console.error("Error al editar el orador:", error);
          });

        modalEditar.hide();
      };
    })
    .catch((error) => {
      console.error(error.message);
    });
}
