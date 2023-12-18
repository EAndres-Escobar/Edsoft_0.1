import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import jsPDF from "jspdf";
import Table from "react-bootstrap/Table";
import "jspdf-autotable";
import logoImage from "../img/logo.png";
import "../css/Modal_Facturas.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST;

const generateRandomCode = () => {
  const generatedCodes = new Set();
  let randomCode = Math.floor(1000 + Math.random() * 9000).toString();

  while (generatedCodes.has(randomCode)) {
    randomCode = Math.floor(1000 + Math.random() * 9000).toString();
  }

  generatedCodes.add(randomCode);
  return randomCode;
};

const ModalFacturas = ({ show, handleClose }) => {
  const [empleados, setEmpleados] = useState({
    documentoid: "",
    nombres: "",
    apellidos: "",
  });

  const [clientes, setClientes] = useState({
    documentoid: "",
    nombres: "",
    apellidos: "",
  });

  const [inventario, setInventario] = useState({
    codigoP: "",
    nombreProducto: "",
    laboratorio: "",
    precioVenta: 0,
    Cantidad: 0,
    totalVenta: 0,
  });

  const [facturas, setFacturas] = useState([]);

  const [codigoFactura, setCodigoFactura] = useState(generateRandomCode());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpleados((prevEmpleados) => ({
      ...prevEmpleados,
      [name]: value,
    }));
  };

  const handleChanger = (e) => {
    const { name, value } = e.target;
    setClientes((prevClientes) => ({
      ...prevClientes,
      [name]: value,
    }));
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;

    setInventario((prevInventario) => {
      const updatedInventario = { ...prevInventario, [name]: value };

      const precioVenta = parseFloat(updatedInventario.precioVenta);
      const cantidad = parseFloat(updatedInventario.Cantidad);

      if (!isNaN(cantidad) && !isNaN(precioVenta)) {
        const totalVenta = cantidad * precioVenta;
        updatedInventario.totalVenta = totalVenta;
      }

      return updatedInventario;
    });
  };

  const handleAgregarProducto = () => {
    // Verificar que los campos no estén vacíos
    if (
      inventario.codigoP &&
      inventario.nombreProducto &&
      inventario.laboratorio &&
      inventario.precioVenta > 0 &&
      inventario.Cantidad > 0
    ) {
      setFacturas((prevFacturas) => [...prevFacturas, { ...inventario }]);
    } else {
      // Mostrar un mensaje de error o realizar alguna acción si los campos están vacíos
      mostrarMensajeError(
        "Todos los campos son necesarios para agregar un producto."
      );
    }

    // Limpiar el estado de inventario después de agregar el producto
    setInventario({
      codigoP: "",
      nombreProducto: "",
      laboratorio: "",
      precioVenta: 0,
      Cantidad: 0,
      totalVenta: 0,
    });
  };
  const mostrarMensajeExito = (mensaje) => {
    MySwal.fire({
      title: mensaje,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const mostrarMensajeError = (mensaje) => {
    MySwal.fire({
      title: mensaje,
      icon: "error",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleBuscarEmpleados = () => {
    const { documentoid } = empleados;
    if (!documentoid) {
      mostrarMensajeError("El documento del empleado no puede estar vacío.");
      return;
    }

    axios
      .get(
        `${localhost}/empleados/buscar/facturar?documentoid=${documentoid}`
      )
      .then((res) => {
        if (res.data.empleados && res.data.empleados.length > 0) {
          const empleadoEncontrado = res.data.empleados[0];
          setEmpleados({
            documentoid: empleadoEncontrado.documentoid || "",
            nombres: empleadoEncontrado.nombres || "",
            apellidos: empleadoEncontrado.apellidos || "",
          });
          mostrarMensajeExito("Empleados cargados con éxito");
        } else {
          mostrarMensajeError(
            "No se encontraron empleados con los datos suministrados"
          );
        }
      })
      .catch((error) => {
        console.error("Error al buscar empleados:", error);
        mostrarMensajeError(
          error.message || "Error al realizar la búsqueda de empleados"
        );
      });
  };

  const handleBuscarClientes = () => {
    const { documentoid } = clientes;
    if (!documentoid) {
      mostrarMensajeError("El documento del cliente no puede estar vacío.");
      return;
    }

    axios
      .get(
        `${localhost}/clientes/buscar/facturar?documentoid=${documentoid}`
      )
      .then((res) => {
        if (res.data.clientes && res.data.clientes.length > 0) {
          const clientesEncontrado = res.data.clientes[0];
          setClientes({
            documentoid: clientesEncontrado.documentoid || "",
            nombres: clientesEncontrado.nombres || "",
            apellidos: clientesEncontrado.apellidos || "",
          });
          mostrarMensajeExito("Clientes cargados con éxito");
        } else {
          mostrarMensajeError(
            "No se encontraron clientes con los datos suministrados"
          );
        }
      })
      .catch((error) => {
        console.error("Error al buscar clientes:", error);
        mostrarMensajeError(
          error.message || "Error al realizar la búsqueda de clientes"
        );
      });
  };

  const handleBuscarInventario = () => {
    const { codigoP } = inventario;
    if (!codigoP) {
      mostrarMensajeError("El código del producto no puede estar vacío.");
      return;
    }

    axios
      .get(
        `${localhost}/inventario/buscar/facturar?codigoP=${codigoP}`
      )
      .then((res) => {
        if (res.data.Inventario && res.data.Inventario.length > 0) {
          const inventarioEncontrado = res.data.Inventario[0];
          setInventario(inventarioEncontrado);
          mostrarMensajeExito("Productos cargados con éxito");
        } else {
          mostrarMensajeError(
            "No se encontraron productos con los datos suministrados"
          );
        }
      })
      .catch((error) => {
        console.error("Error al buscar productos:", error);
        mostrarMensajeError(
          error.message || "Error al realizar la búsqueda de productos"
        );
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title: "¿Está seguro que desea borrar los datos en la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados({
          documentoid: "",
          nombres: "",
          apellidos: "",
        });
        setClientes({
          documentoid: "",
          nombres: "",
          apellidos: "",
        });
        setInventario({
          codigoP: "",
          nombreProducto: "",
          laboratorio: "",
          precioVenta: 0,
          Cantidad: 0,
          totalVenta: 0,
        });
        setFacturas([]);
        setCodigoFactura(generateRandomCode());
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  const handleGenerarPDF = () => {
    const {
      nombres: nombreVendedor,
      apellidos,
      documentoid: idVendedor,
    } = empleados;
    const {
      nombres: nombreCliente,
      apellidos: apellidosCliente,
      documentoid: idCliente,
    } = clientes;

    // Verificar si todos los campos requeridos están presentes
    if (
      !nombreVendedor ||
      !apellidos ||
      !idVendedor ||
      !nombreCliente ||
      !apellidosCliente ||
      !idCliente ||
      !codigoFactura ||
      facturas.length === 0
    ) {
      mostrarMensajeError(
        "Todos los campos son requeridos para generar la factura."
      );
      return; // Detener la ejecución si falta algún campo
    }

    // agregar la factura
    const pdf = new jsPDF();

    // Establecer color de fondo
    pdf.setFillColor(255, 255, 200); // Un color amarillo claro como ejemplo
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      "F"
    );

    // Añadir imagen
    pdf.addImage(logoImage, "JPEG", 10, 10, 30, 30);

    // Añadir texto con tamaño de fuente más grande y encabezados en negrita
    const pageWidth = pdf.internal.pageSize.getWidth();
    const fontSize = 16; // Tamaño de fuente más grande
    const titleFontSize = 22; // Tamaño de fuente aún más grande para títulos
    pdf.setFontSize(titleFontSize);
    pdf.setFont("times", "bolditalic");

    // Función para centrar texto
    const centerText = (text, y, isBold = false) => {
      if (isBold) {
        pdf.setFont("times", "bolditalic");
        pdf.setFontSize(titleFontSize);
      } else {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize);
      }
      const textWidth =
        (pdf.getStringUnitWidth(text) * pdf.internal.getFontSize()) /
        pdf.internal.scaleFactor;
      const textOffset = (pageWidth - textWidth) / 2;
      pdf.text(text, textOffset, y);
    };

    // Añadir una línea decorativa debajo del título
    pdf.setDrawColor(0, 0, 0); // Color negro para la línea
    pdf.setLineWidth(1.5); // Grosor de la línea
    pdf.line(20, 55, pageWidth - 20, 55); // Dibujar la línea

    // Usar la función centerText para cada línea de texto
    centerText(`Factura # ${codigoFactura}`, 50, true); // Encabezado en negrita
    centerText(
      `Vendedor: ${nombreVendedor} ${apellidos} - ID: ${idVendedor}`,
      70
    );
    centerText(
      `Cliente: ${nombreCliente} ${apellidosCliente} - ID: ${idCliente}`,
      90
    );

    // Añadir la fecha actual
    const fechaActual = new Date().toLocaleDateString("es-ES");
    centerText(`Fecha: ${fechaActual}`, 110);

    // Añadir la tabla de inventario
    const startY = 150; // Posición inicial en Y para la tabla
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Código", 20, startY);
    pdf.text("Producto", 50, startY);
    pdf.text("Laboratorio", 80, startY);
    pdf.text("Precio Unitario", 110, startY);
    pdf.text("Cantidad", 140, startY);
    pdf.text("Total", 170, startY);

    // Añadir filas de la tabla y calcular el total a pagar
    let currentY = startY + 10; // Incrementar en Y para cada nueva fila
    let totalAPagar = 0;
    pdf.setFont("helvetica", "normal");
    facturas.forEach((producto) => {
      pdf.text(producto.codigoP.toString(), 20, currentY);
      pdf.text(producto.nombreProducto, 50, currentY);
      pdf.text(producto.laboratorio, 80, currentY);
      pdf.text(producto.precioVenta.toString(), 110, currentY);
      pdf.text(producto.Cantidad.toString(), 140, currentY);
      pdf.text(producto.totalVenta.toString(), 170, currentY);
      totalAPagar += producto.totalVenta;
      currentY += 10; // Incrementar en Y para la siguiente fila
    });

    // Mostrar el total a pagar
    centerText(`Total a Pagar: $${totalAPagar.toFixed(0)}`, currentY + 10);

    // Guardar el PDF
    pdf.save(`factura${codigoFactura}.pdf`);

    // Mostrar mensaje de éxito
    mostrarMensajeExito("Factura generada con éxito.");
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Facturar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group
              className="mb-3_idVendedor"
              controlId="exampleForm.ControlInput2"
            >
              <Form.Label>Id Vendedor</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cédula"
                name="documentoid"
                value={empleados.documentoid}
                onChange={handleChange}
              />
              <span
                role="img"
                aria-label="search"
                className="buscador_factura"
                onClick={handleBuscarEmpleados}
              >
                🔍
              </span>
            </Form.Group>
            <Form.Group
              className="mb-3_formGroup"
              controlId="exampleForm.ControlInput3"
            >
              <Form.Label>Nombre Vendedor</Form.Label>
              <Form.Control
                type="text"
                className="mb-3_form_control"
                placeholder="Nombre Vendedor"
                name="nombres"
                value={
                  empleados.nombres || empleados.apellidos
                    ? `${empleados.nombres} ${empleados.apellidos}`
                    : ""
                }
                readOnly
              />
            </Form.Group>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Form.Group
              className="mb-3_idCliente"
              controlId="exampleForm.ControlInput4"
            >
              <Form.Label>Id Cliente</Form.Label>
              <Form.Control
                type="number"
                placeholder="Cédula"
                name="documentoid"
                value={clientes.documentoid}
                onChange={handleChanger}
              />
              <span
                role="img"
                aria-label="search"
                className="buscador_factura"
                onClick={handleBuscarClientes}
              >
                🔍
              </span>
            </Form.Group>
            <Form.Group
              className="mb-3_formGroup"
              controlId="exampleForm.ControlInput5"
            >
              <Form.Label>Nombre Cliente</Form.Label>
              <Form.Control
                type="text"
                className="mb-3_form_control"
                placeholder="Nombre Cliente"
                name="nombres"
                value={
                  clientes.nombres || clientes.apellidos
                    ? `${clientes.nombres} ${clientes.apellidos}`
                    : ""
                }
                readOnly
              />
            </Form.Group>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Form.Group
              className="mb-3_codigoProducto"
              controlId="exampleForm.ControlInput6"
            >
              <Form.Label>Codigo Producto</Form.Label>
              <Form.Control
                type="number"
                placeholder="Código"
                name="codigoP"
                value={inventario.codigoP || ""}
                onChange={handleChanges}
              />
              <span
                role="img"
                aria-label="search"
                className="buscador_factura"
                onClick={handleBuscarInventario}
              >
                🔍
              </span>
            </Form.Group>
            <Form.Group
              className="mb-3_formGroup"
              controlId="exampleForm.ControlInput7"
            >
              <Form.Label>Producto</Form.Label>
              <Form.Control
                type="text"
                className="mb-3_form_control"
                name="nombreProducto"
                value={inventario.nombreProducto}
                onChange={handleChanges}
                readOnly
              />
            </Form.Group>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Form.Group
              className="mb-3_laboratorio"
              controlId="exampleForm.ControlInput8"
            >
              <Form.Label>Laboratorio</Form.Label>
              <Form.Control
                type="text"
                className="mb-3"
                name="laboratorio"
                value={inventario.laboratorio}
                onChange={handleChanges}
                readOnly
              />
            </Form.Group>
            <Form.Group
              className="mb-3_values"
              controlId="exampleForm.ControlInput9"
            >
              <Form.Label>Precio Venta</Form.Label>
              <Form.Control
                type="number"
                className="mb-3"
                name="precioVenta"
                value={inventario.precioVenta || ""}
                onChange={handleChanges}
                readOnly
              />
            </Form.Group>
            <Form.Group
              className="mb-3_values"
              controlId="exampleForm.ControlInput10"
            >
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                className="mb-3"
                name="Cantidad"
                value={inventario.Cantidad || ""}
                onChange={handleChanges}
              />
            </Form.Group>
            <Form.Group
              className="mb-3_values_total"
              controlId="exampleForm.ControlInput11"
            >
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="number"
                className="mb-3"
                name="totalVenta"
                value={inventario.totalVenta || ""}
                onChange={handleChanges}
                readOnly
              />
            </Form.Group>
          </div>
        </Form>
        <div className="table_inventario_container">
          <Table striped bordered hover className="table_inventario">
            <thead className="thead_inventario">
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Laboratorio</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.codigoP}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>{producto.laboratorio}</td>
                  <td>{producto.precioVenta}</td>
                  <td>{producto.Cantidad}</td>
                  <td>{producto.totalVenta}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={handleGenerarPDF}>
          Generar Factura
        </Button>
        <Button variant="outline-primary" onClick={handleAgregarProducto}>
          Agregar Producto
        </Button>
        <Button variant="outline-warning" onClick={handleBorrar}>
          Borrar
        </Button>
        <Button variant="outline-danger" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalFacturas.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalFacturas;
