import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Modal_Usuarios.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST;

const ModalUsuarios = ({ show, handleClose }) => {
  const [empleados, setEmpleados] = useState({
    nombres: "",
    apellidos: "",
    documentoid: "",
    email: "",
    celular: "",
  });
  const [usuarios, setUsuarios] = useState([]);

  const handleChange = (e) => {
    setEmpleados({ ...empleados, [e.target.name]: e.target.value });
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
  const handleBuscar = () => {
    const { documentoid, nombres } = empleados;
  
    axios
      .get(
        `${localhost}/empleados/buscar?documentoid=${documentoid}&nombres=${nombres}`
      )
      .then((res) => {
        if (res.data.empleados.length > 0) {
          mostrarMensajeExito("Usuarios cargados con éxito");
          const nuevosUsuarios = res.data.empleados.filter(
            (nuevoUsuario) =>
              !usuarios.some(
                (usuario) =>
                  usuario[0] === nuevoUsuario[0] && usuario[1] === nuevoUsuario[1]
              )
          );
  
          if (nuevosUsuarios.length > 0) {
            setUsuarios([...usuarios, ...nuevosUsuarios]);
          } else {
            mostrarMensajeError("El usuario ya existe en la tabla");
          }
        } else {
          mostrarMensajeError(
            "No se encontró usuarios con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar usuarios");
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title:
        "¿Está seguro que desea borrar los datos de los usuarios en la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setEmpleados({
          nombres: "",
          apellidos: "",
          documentoid: "",
          email: "",
          celular: "",
        });
        setUsuarios([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Usuarios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombres del Usuario"
                autoFocus
                name="nombres"
                value={empleados.nombres}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Documento ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento del Usuario"
                name="documentoid"
                value={empleados.documentoid}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Form>
        <React.Fragment>
          <Table striped bordered hover className="table_usuarios">
            <thead className="thead_usuarios">
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Documento</th>
                <th>Email</th>
                <th>Celular</th>
              </tr>
            </thead>
            <tbody>
              {usuarios &&
                usuarios.length > 0 &&
                usuarios.map((usuariosArray, index) => (
                  <tr key={index}>
                    {usuariosArray.slice(1).map((usuariosItem, subIndex) => (
                      <td key={subIndex}>{usuariosItem}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </React.Fragment>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-warning" onClick={handleBorrar}>
          Borrar
        </Button>
        <Button variant="outline-primary" onClick={handleBuscar}>
          Buscar
        </Button>
        <Button variant="outline-danger" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalUsuarios.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalUsuarios;
