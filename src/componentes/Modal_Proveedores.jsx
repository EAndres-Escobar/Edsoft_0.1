import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaTrash } from "react-icons/fa"; // Importar FontAwesome icon
import "../css/Modal_Proveedores.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST;

const ModalProveedores = ({ show, handleClose }) => {
  const [proveedores, setProveedores] = useState({
    nombres: "",
    apellidos: "",
    documentoid: "",
    email: "",
    celular: "",
    fecha: "",
  });
  const [proveedoresEncontrados, setProveedoresEncontrados] = useState([]);

  const handleChange = (e) => {
    setProveedores({ ...proveedores, [e.target.name]: e.target.value });
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
      !proveedores.nombres ||
      !proveedores.apellidos ||
      !proveedores.documentoid ||
      !proveedores.email ||
      !proveedores.celular ||
      !proveedores.fecha
    ) {
      mostrarMensajeError("Todos los campos son requeridos");
      return;
    }

    axios
      .post(`${localhost}/proveedores`, proveedores)
      .then((res) => {
        mostrarMensajeExito("Proveedor agregado con éxito");
        setProveedoresEncontrados(res.data.proveedores);
        setProveedores({
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
        mostrarMensajeError("Error al agregar proveedor");
      });
  };

  const handleBuscar = () => {
    const { documentoid, nombres } = proveedores;

    axios
      .get(
        `${localhost}/proveedores/buscar?documentoid=${documentoid}&nombres=${nombres}`
      )
      .then((res) => {
        if (res.data.proveedores.length > 0) {
          mostrarMensajeExito("Proveedores cargados con éxito");
          setProveedoresEncontrados(res.data.proveedores);
        } else {
          mostrarMensajeError(
            "No se encontró proveedor con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar proveedor");
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title:
        "¿Está seguro que desea borrar los datos de los proveedores en la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setProveedores({
          nombres: "",
          apellidos: "",
          documentoid: "",
          email: "",
          celular: "",
          fecha: "",
        });
        setProveedoresEncontrados([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  const handleEliminarProveedor = (index) => {
    const proveedorId = proveedoresEncontrados[index][0];
    const proveedorNombre = proveedoresEncontrados[index][1];
    const nuevosProveedores = [...proveedoresEncontrados];
    nuevosProveedores.splice(index, 1);
    setProveedoresEncontrados(nuevosProveedores);

    axios
      .delete(`${localhost}/proveedores/${proveedorId}`)
      .then(() => {
        mostrarMensajeExito(`Proveedor eliminado ${proveedorNombre} con éxito`);
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al eliminar el proveedor");
      });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Proveedores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombres del Proveedor"
                autoFocus
                name="nombres"
                value={proveedores.nombres}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellidos del Proveedor"
                name="apellidos"
                value={proveedores.apellidos}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Documento ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Documento del Proveedor"
                name="documentoid"
                value={proveedores.documentoid}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                autoComplete="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                name="email"
                value={proveedores.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput5">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Celular del Proveedor"
                name="celular"
                value={proveedores.celular}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput6">
              <Form.Label>Fecha de Registro</Form.Label>
              <Form.Control
                type="date"
                className="mb-3"
                name="fecha"
                value={proveedores.fecha}
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Form>

        {/* Tabla para mostrar los proveedores encontrados */}
        <Table striped bordered hover className="table_proveedores">
          <thead className="thead_proveedores">
            <tr>
              <th className="columna-nid-proveedores">N_Id</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Celular</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresEncontrados &&
              proveedoresEncontrados.length > 0 &&
              proveedoresEncontrados.map((proveedoresArray, index) => (
                <tr key={index}>
                  <td className="columna-nid-proveedores">
                    {proveedoresArray[0]}
                  </td>
                  {proveedoresArray
                    .slice(1)
                    .map((proveedoresItem, subIndex) => (
                      <td key={subIndex}>{proveedoresItem}</td>
                    ))}
                  <td>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleEliminarProveedor(index)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
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

ModalProveedores.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalProveedores;
