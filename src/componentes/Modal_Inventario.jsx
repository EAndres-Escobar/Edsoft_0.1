import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Modal_Inventario.css";

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

const ModalInventario = ({ show, handleClose }) => {
  const [inventario, setInventario] = useState({
    codigoP: "",
    nombreProducto: "",
    fechaVencimiento: "",
    laboratorio: "",
    lote: "",
    registroSanitario: "",
    precioVenta: "",
    fechaIngreso: "",
    Stock: "",
  });
  const [inventarios, setInventarios] = useState([]);
  const [listaProductos, setListaProductos] = useState([]);

  const handleChange = (e) => {
    setInventario({ ...inventario, [e.target.name]: e.target.value.trim() });
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
    const { codigoP, nombreProducto } = inventario;
    axios
      .get(
        `${localhost}/inventario/buscar?codigoP=${codigoP}&nombreProducto=${nombreProducto}`
      )
      .then((res) => {
        if (res.data.inventario.length > 0) {
          mostrarMensajeExito("Producto cargados con éxito");
          const nuevosInventario = res.data.inventario.filter(
            (nuevoInventario) =>
              !inventarios.some(
                (inventario) =>
                  inventario[0] === nuevoInventario[0] &&
                  inventario[1] === nuevoInventario[1]
              )
          );
          if (nuevosInventario.length > 0) {
            setInventarios([...inventarios, ...nuevosInventario]);
          } else {
            mostrarMensajeError("El producto ya existe en la tabla");
          }
        } else {
          mostrarMensajeError(
            "No se encontró producto con los datos suministrados"
          );
        }
      })
      .catch((err) => {
        console.error(err);
        mostrarMensajeError("Error al buscar el producto");
      });
  };

  const handleBorrar = () => {
    MySwal.fire({
      title:
        "¿Está seguro que desea borrar los datos de los productos en la tabla?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setInventario({
          codigoP: "",
          nombreProducto: "",
          fechaVencimiento: "",
          laboratorio: "",
          lote: "",
          registroSanitario: "",
          precioVenta: "",
          fechaIngreso: "",
          Stock: "",
        });
        setInventarios([]);
        mostrarMensajeExito("Datos borrados con éxito");
      }
    });
  };

  useEffect(() => {
    axios
      .get(`${localhost}/inventario/nombres`)
      .then((response) => {
        setListaProductos(response.data.nombres);
      })
      .catch((error) => {
        console.error("Error al obtener los nombres de productos:", error);
      });
  }, []);

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Inventario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="modal-container">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Codigo Producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el código"
                autoFocus
                name="codigoP"
                value={inventario.codigoP}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                as="select"
                name="nombreProducto"
                value={inventario.nombreProducto}
                onChange={handleChange}
              >
                <option value="">Seleccione un producto</option>
                {listaProductos.map((nombreProducto, index) => (
                  <option key={index} value={nombreProducto}>
                    {nombreProducto}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        </Form>
        <div className="table_inventario_container">
          <Table striped bordered hover className="table_inventario">
            <thead className="thead_inventario">
              <tr>
                <th>codigo</th>
                <th>Nombre Producto</th>
                <th>Fecha Vencimiento</th>
                <th>laboratorio</th>
                <th>lote</th>
                <th>registro Sanitario</th>
                <th>precio Venta</th>
                <th>fecha Ingreso</th>
                <th>Existencia</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(inventarios).map((producto, index) => (
                <tr key={index}>
                  {producto.map((productoItem, subIndex) => (
                    <td key={subIndex}>
                      {subIndex === 2 || subIndex === 7
                        ? formatearFecha(productoItem)
                        : productoItem}
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
        <Button variant="outline-danger" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalInventario.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalInventario;
