import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Modal_Guardar_Factura.css";

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

const ModalGuardarFactura = ({ show, handleClose }) => {
  const [facturas, setFacturas] = useState({
    codigoFactura: "",
    facturaPdf: "",
    fecha: "",
  });
  const [facturasEncontradas, setFacturasEncontradas] = useState([]);

  const handleChange = (e) => {
    setFacturas({ ...facturas, [e.target.name]: e.target.value });
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
    if (!facturas.codigoFactura || !facturas.facturaPdf || !facturas.fecha) {
      mostrarMensajeError("Todos los campos son requeridos");
      return;
    }

    const formData = new FormData();
    formData.append("codigoFactura", facturas.codigoFactura);
    formData.append("fecha", facturas.fecha);
    formData.append("facturaPdf", facturas.facturaPdf);

    axios
      .post(`${localhost}/facturas`, formData)
      .then((res) => {
        mostrarMensajeExito("Factura agregada con éxito");
        setFacturasEncontradas(res.data.facturas);
        setFacturas({
          codigoFactura: "",
          facturaPdf: "",
          fecha: "",
        });
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al agregar factura");
      });
  };

  const handleBuscar = () => {
    const { codigoFactura } = facturas;

    axios
      .get(
        `${localhost}/facturas/buscar?codigoFactura=${codigoFactura}`
      )
      .then((res) => {
        if (res.data.facturas.length > 0) {
          mostrarMensajeExito("Facturas cargadas con éxito");
          setFacturasEncontradas(res.data.facturas);
        } else {
          mostrarMensajeError(
            "No se encontró factura con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar la factura");
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title:
        "¿Está seguro que desea borrar los datos de los facturas en la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setFacturas({
          codigoFactura: "",
          facturaPdf: "",
          fecha: "",
        });
        setFacturasEncontradas([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Guardar y Consultar Facturas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Código de Factura</Form.Label>
              <Form.Control
                type="text"
                placeholder="Código de la factura"
                autoFocus
                name="codigoFactura"
                value={facturas.codigoFactura}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Factura PDF</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                name="facturaPdf"
                onChange={(e) =>
                  setFacturas({ ...facturas, facturaPdf: e.target.files[0] })
                }
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Fecha de Creación</Form.Label>
              <Form.Control
                autoComplete="date"
                type="date"
                name="fecha"
                value={facturas.fecha}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Form>

        {/* Tabla para mostrar las facturas encontradas */}
        <Table striped bordered hover className="table_facturas">
          <thead className="thead_facturas">
            <tr>
              <th>Código de Factura</th>
              <th>Factura PDF</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {facturasEncontradas &&
              facturasEncontradas.length > 0 &&
              facturasEncontradas.map((facturasArray, index) => (
                <tr key={index}>
                  <td className="columna-nid-facturas">{facturasArray[0]}</td>
                  <td>
                    <a
                      href={`${localhost}/ruta/del/servidor/archivos/pdf/${facturasArray[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver PDF
                    </a>
                  </td>
                  <td>{formatearFecha(facturasArray[2])}</td>
                </tr>
              ))}
          </tbody>
        </Table>
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

ModalGuardarFactura.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalGuardarFactura;
