import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Cierre_Diario.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST;

const formatearFecha = (fechaString) => {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const fecha = new Date(fechaString);
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${dia} ${mes} ${año}`;
};

// Función para cargar los empleados desde la API
const cargarEmpleados = async () => {
  const respuesta = await fetch(`${localhost}/empleados/buscar/cierre`);
  const datos = await respuesta.json();
  return datos.empleados;
};

const ModalCaja = ({ show, handleClose }) => {
  const [caja, setCaja] = useState({
    efectivo_inicial: "",
    ventas_efectivo: "",
    ventas_tarjeta: "",
    nombre_gastos: "",
    gasto: "",
    nombre_usuario: "",
    fecha: "",
  });
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados().then(setEmpleados);
  }, []);

  const [cajaEncontrados, setCajaEncontrados] = useState([]);

  const handleChange = (e) => {
    setCaja({ ...caja, [e.target.name]: e.target.value.trim() });
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

  const handleGuardar = () => {
    if (
      !caja.efectivo_inicial ||
      !caja.ventas_efectivo ||
      !caja.ventas_tarjeta ||
      !caja.nombre_gastos ||
      !caja.gasto ||
      !caja.nombre_usuario ||
      !caja.fecha
    ) {
      mostrarMensajeError("Todos los campos son requeridos");
      return;
    }

    axios
      .post(`${localhost}/cierre_diario`, caja)
      .then((res) => {
        mostrarMensajeExito("Cierre diario realizado con éxito");
        setCajaEncontrados(res.data.caja);
        setCaja({
          efectivo_inicial: "",
          ventas_efectivo: "",
          ventas_tarjeta: "",
          nombre_gastos: "",
          gasto: "",
          nombre_usuario: "",
          fecha: "",
        });
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al realizar el cierre de caja ");
      });
  };

  const handleBuscar = () => {
    const { nombre_usuario } = caja;

    axios
      .get(`${localhost}/cierre_diario/buscar?nombre_usuario=${nombre_usuario}`)
      .then((res) => {
        if (res.data.caja.length > 0) {
          mostrarMensajeExito("datos de cierre diario cargados con éxito");
          setCajaEncontrados(res.data.caja);
        } else {
          mostrarMensajeError(
            "No se encontró cierre diario con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar datos del cierre diario");
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
        setCaja({
          efectivo_inicial: "",
          ventas_efectivo: "",
          ventas_tarjeta: "",
          nombre_gastos: "",
          gasto: "",
          nombre_usuario: "",
          fecha: "",
        });
        setCajaEncontrados([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Cierre Diario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Efectivo inicial</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el valor"
                autoFocus
                name="efectivo_inicial"
                value={caja.efectivo_inicial}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Ventas en efectivo</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el valor"
                name="ventas_efectivo"
                value={caja.ventas_efectivo}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>ventas con tarjeta</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el valor"
                name="ventas_tarjeta"
                value={caja.ventas_tarjeta}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Valor del gasto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el valor gastado"
                name="gasto"
                value={caja.gasto}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Usuario que realizó el gasto</Form.Label>
              <Form.Select
                name="nombre_usuario"
                value={caja.nombre_usuario}
                onChange={handleChange}
              >
                <option>Seleccione un usuario</option>
                {empleados.map((empleado, index) => (
                  <option key={index} value={empleado.nombre_completo}>
                    {empleado.nombre_completo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                className="mb-3"
                name="fecha"
                value={caja.fecha}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Descripción del gasto</Form.Label>
              <Form.Control
                as="textarea"
                style={{ resize: "horizontal", width: "100%" }}
                placeholder="Describa en qué realizó el gasto"
                name="nombre_gastos"
                value={caja.nombre_gastos}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Form>

        {/* Tabla para mostrar los cajas encontrados */}
        <div className="table_caja_container">
          <Table striped bordered hover className="table_caja">
            <thead className="thead_caja">
              <tr>
                <th>Efectivo_inicial</th>
                <th>Venta_efectivo</th>
                <th>Venta_tarjeta</th>
                <th>Nombre_gastos</th>
                <th>Gasto</th>
                <th>Nombre_usuario</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {cajaEncontrados &&
                cajaEncontrados.length > 0 &&
                cajaEncontrados.map((cajaArray, index) => (
                  <tr key={index}>
                    {cajaArray.map((cajaItem, subIndex) => (
                      <td key={subIndex}>
                        {subIndex === cajaArray.length - 1 // Asumiendo que la fecha es el último elemento
                          ? formatearFecha(cajaItem)
                          : cajaItem}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={handleBorrar}>
          Borrar
        </Button>
        <Button variant="outline-primary" onClick={handleBuscar}>
          Buscar
        </Button>
        <Button variant="outline-success" onClick={handleGuardar}>
          Guardar
        </Button>
        <Button variant="outline-danger" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalCaja.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalCaja;
