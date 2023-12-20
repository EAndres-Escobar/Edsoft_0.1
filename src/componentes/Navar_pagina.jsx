import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalFacturar from "./Modal_Facturar";
import ModalUsuarios from "./Modal_Usuarios";
import ModalCliente from "./Modal_Cliente";
import ModalProveedores from "./Modal_Proveedores";
import ModalInventario from "./Modal_Inventario";
import ModalCaja from "./Cierre_Diario";
import ModalGuardarFactura from "./Modal_Guardar_Factura";

function NavScrollPrincipal() {
  const [showUsuarios, setShowUsuarios] = useState(false);
  const [showFacturar, setShowFacturar] = useState(false);
  const [showCliente, setShowCliente] = useState(false);
  const [showProveedores, setShowProveedores] = useState(false);
  const [showInventario, setShowInventario] = useState(false);
  const [showCaja, setShowCaja] = useState(false);
  const [showFacturas, setShowFacturas] = useState(false);

  const handleCloseProveedores = () => setShowProveedores(false);
  const handleShowProveedores = () => setShowProveedores(true);

  const handleCloseUsuarios = () => setShowUsuarios(false);
  const handleShowUsuarios = () => setShowUsuarios(true);

  const handleCloseFacturar = () => setShowFacturar(false);
  const handleShowFacturar = () => setShowFacturar(true);

  const handleCloseCliente = () => setShowCliente(false);
  const handleShowCliente = () => setShowCliente(true);

  const handleCloseCaja = () => setShowCaja(false);
  const handleShowCaja = () => setShowCaja(true);

  const handleCloseInventario = () => setShowInventario(false);
  const handleShowInventario = () => setShowInventario(true);

  const handleCloseFacturas = () => setShowFacturas(false);
  const handleShowFacturas = () => setShowFacturas(true);

  const handleSearch = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página
    // Lógica para manejar la búsqueda
    const searchValue = e.target.elements.Search.value.toLowerCase();

    // Abre la ventana modal correspondiente según la búsqueda
    switch (searchValue) {
      case "usuario":
        handleShowUsuarios();
        break;
      case "proveedores":
        handleShowProveedores();
        break;
      case "clientes":
        handleShowCliente();
        break;
      case "inventario":
        handleShowInventario();
        break;
      case "cierre diario":
        handleShowCaja();
        break;
      case "facturar":
        handleShowFacturar();
        break;
      case "facturas":
        handleShowFacturas();
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>Navegar</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link onClick={handleShowUsuarios}>Usuario</Nav.Link>
              <Nav.Link onClick={handleShowProveedores}>Proveedores</Nav.Link>
              <Nav.Link onClick={handleShowCliente}>Clientes</Nav.Link>
              <Nav.Link onClick={handleShowInventario}>
                Inventario
              </Nav.Link>{" "}
              <NavDropdown title="Caja" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={handleShowCaja}>
                  Cierre diario
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleShowFacturar}>
                  Facturar
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleShowFacturas}>
                  Registrar y Consultar Facturas
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                name="d-flex"
                id="Search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button type="submit" variant="outline-success">
                Search
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ModalProveedores
        show={showProveedores}
        handleClose={handleCloseProveedores}
      />
      <ModalUsuarios show={showUsuarios} handleClose={handleCloseUsuarios} />
      <ModalFacturar show={showFacturar} handleClose={handleCloseFacturar} />
      <ModalCaja show={showCaja} handleClose={handleCloseCaja} />
      <ModalCliente show={showCliente} handleClose={handleCloseCliente} />
      <ModalInventario
        show={showInventario}
        handleClose={handleCloseInventario}
      />
      <ModalGuardarFactura
        show={showFacturas}
        handleClose={handleCloseFacturas}
      />{" "}
    </>
  );
}

export default NavScrollPrincipal;
