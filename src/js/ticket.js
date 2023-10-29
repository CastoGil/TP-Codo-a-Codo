document.addEventListener("DOMContentLoaded", function () {
  const ticketForm = document.getElementById("ticketForm");
  const alertContainer = document.querySelector(".sale.alert");

  function validarFormulario() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const cantidad = document.getElementById("cantidad").value;
    const categoria = document.getElementById("categoria").value;

    if (!nombre || !apellido || !email || !cantidad || categoria === "0") {
      alertContainer.innerHTML = `
          <p >
            Completa todos los campos del formulario!!!
          </p>
        `;
      return false;
    } else {
      alertContainer.innerHTML = "";
      return true;
    }
  }

  function calcularTotal() {
    if (validarFormulario()) {
      const cantidad = parseInt(document.getElementById("cantidad").value);
      const categoria = document.getElementById("categoria").value;
      const precios = {
        1: 200,
        2: 200,
        3: 200,
      };
      const descuentos = {
        1: 0.8,
        2: 0.5,
        3: 0.15,
      };

      if (!isNaN(cantidad)) {
        const precioConDescuento =
          precios[categoria] * (1 - descuentos[categoria]);
        const total = precioConDescuento * cantidad;
        const totalRedondeado = Math.round(total);
        alertContainer.innerHTML = `Total a Pagar: $${totalRedondeado}`;
      }
    }
  }

  document
    .querySelector(".resumen:last-child")
    .addEventListener("click", function (event) {
      event.preventDefault();
      calcularTotal();
    });

  document
    .querySelector(".btn_enviar")
    .addEventListener("click", function (event) {
      event.preventDefault();
      ticketForm.reset();
      alertContainer.innerHTML = `Total a Pagar: $`;
    });
});
