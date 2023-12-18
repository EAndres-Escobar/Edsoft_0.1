import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Modal_Clientes.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST;

const ModalCliente = ({ show, handleClose }) => {
  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    documentoid: "",
    email: "",
    celular: "",
    fecha: "",
  });
  const [clientesEncontrados, setClientesEncontrados] = useState([]);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
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
      !cliente.nombres ||
      !cliente.apellidos ||
      !cliente.documentoid ||
      !cliente.email ||
      !cliente.celular ||
      !cliente.fecha
    ) {
      mostrarMensajeError("Todos los campos son requeridos");
      return;
    }

    // Verificar si el cliente ya existe
    axios
      .get(`${localhost}/clientes/buscar?documentoid=${cliente.documentoid}`)
      .then((res) => {
        if (res.data.clientes.length > 0) {
          mostrarMensajeError("El cliente ya existe en la base de datos");
        } else {
          // El cliente no existe, proceder con la solicitud POST
          axios
            .post(`${localhost}/clientes`, cliente)
            .then((res) => {
              mostrarMensajeExito("Cliente agregado con éxito");
              setClientesEncontrados(res.data.clientes);
              setCliente({
                nombres: "",
                apellidos: "",
                documentoid: "",
                email: "",
                celular: "",
                fecha: "",
              });
            })
            .catch((err) => {
              console.error(err);
              mostrarMensajeError("Error al agregar el cliente");
            });
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al verificar si el cliente ya existe");
      });
  };

  const handleBuscar = () => {
    const { documentoid, nombres } = cliente;

    axios
      .get(
        `${localhost}/clientes/buscar?documentoid=${documentoid}&nombres=${nombres}`
      )
      .then((res) => {
        if (res.data.clientes.length > 0) {
          mostrarMensajeExito("Clientes cargados con éxito");
          setClientesEncontrados(res.data.clientes);
        } else {
          mostrarMensajeError(
            "No se encontró cliente con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar clientes");
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title: "¿Está seguro que desea borrar los datos del cliente de la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setCliente({
          nombres: "",
          apellidos: "",
          documentoid: "",
          email: "",
          celular: "",
          fecha: "",
        });
        setClientesEncontrados([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombres del cliente"
                autoFocus
                name="nombres"
                value={cliente.nombres}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellidos del cliente"
                name="apellidos"
                value={cliente.apellidos}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Documento ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento del cliente"
                name="documentoid"
                value={cliente.documentoid}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                autoComplete="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                name="email"
                value={cliente.email}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Celular del Cliente"
                name="celular"
                value={cliente.celular}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Fecha de Registro</Form.Label>
              <Form.Control
                type="date"
                className="mb-3"
                name="fecha"
                value={cliente.fecha}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Form>

        {/* Tabla para mostrar los clientes encontrados */}
        <Table striped bordered hover className="table_clientes">
          <thead className="thead_clientes">
            <tr>
              <th className="columna-nid">N_Id</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Celular</th>
            </tr>
          </thead>
          <tbody>
            {clientesEncontrados &&
              clientesEncontrados.length > 0 &&
              clientesEncontrados.map((clienteArray, index) => (
                <tr key={index}>
                  <td className="columna-nid">{clienteArray[0]}</td>
                  {clienteArray.slice(1).map((clienteItem, subIndex) => (
                    <td key={subIndex}>{clienteItem}</td>
                  ))}
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

ModalCliente.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalCliente;
