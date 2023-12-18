import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./css/Navbar.css";

const MySwal = withReactContent(Swal);

export const Navbar = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const onLogout = () => {
    MySwal.fire({
      title: "¿Está seguro que desea cerrar la sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Cerrando sesión",
          text: "Espere un momento...",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
          willOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          navigate("/login", {
            replace: true,
          });
        });
      }
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleToggleText = () => {
    setShowMore(!showMore);
  };
  return (
    <>
      <header>
        <h1>
          <img
            className="img_navbar"
            src="./src/img/edsof.png"
            alt="Logo de edsoft"
            onClick={handleShow}
            style={{ cursor: "pointer" }}
          />
          <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                <h1>Información sobre Edsoft</h1>
              </Modal.Title>
              <img
                className="img_Info"
                src="./src/img/edsof.png"
                alt="Logo de edsoft"
              />
            </Modal.Header>
            <Modal.Body>
              <p>
                Edsoft es una empresa líder en el campo de desarrollo de
                software y servicios de mantenimiento con una sólida trayectoria
                en ofrecer soluciones tecnológicas innovadoras y confiables.
                Fundada con la visión de impulsar la transformación digital,
                Edsoft se ha destacado en el diseño, desarrollo y mantenimiento
                de software para satisfacer las crecientes demandas del mundo
                empresarial moderno.
              </p>

              <h4>
                <b>Principales Características de Edsoft:</b>
              </h4>

              <p>
                <b>Desarrollo de Software Personalizado:</b>
              </p>
              <p>
                Edsoft se especializa en el desarrollo de software
                personalizado, adaptando soluciones a medida para satisfacer las
                necesidades específicas de sus clientes. Su enfoque centrado en
                el cliente garantiza la entrega de productos que optimizan los
                procesos y mejoran la eficiencia operativa.
              </p>

              <p>
                <b>Innovación y Tecnología Avanzada:</b>
              </p>
              <p>
                La empresa está a la vanguardia de la innovación y utiliza
                tecnologías de punta para ofrecer soluciones de software que
                cumplen con los estándares más altos de calidad y seguridad. La
                constante actualización de sus conocimientos tecnológicos
                permite a Edsoft abordar los desafíos empresariales con
                soluciones modernas y eficaces.
              </p>

              {showMore ? (
                <>
                  <p>
                    <b>Mantenimiento y Soporte Continuo:</b>
                  </p>
                  <p>
                    Además del desarrollo de software, Edsoft se compromete a
                    proporcionar servicios integrales de mantenimiento y
                    soporte. Esto garantiza que las soluciones implementadas
                    sigan siendo efectivas a lo largo del tiempo y puedan
                    adaptarse a las cambiantes necesidades del negocio.
                  </p>

                  <p>
                    <b>Enfoque en la Experiencia del Cliente:</b>
                  </p>
                  <p>
                    Edsoft valora la satisfacción del cliente y trabaja
                    estrechamente con sus clientes para comprender sus objetivos
                    comerciales y proporcionar soluciones que no solo cumplan
                    con los requisitos técnicos, sino que también generen un
                    impacto positivo en sus operaciones.
                  </p>

                  <p>
                    <b>Equipo de Desarrollo Altamente Calificado:</b>
                  </p>
                  <p>
                    La fuerza impulsora detrás de Edsoft es un equipo de
                    desarrolladores altamente calificados y experimentados. Su
                    dedicación a la excelencia técnica y la creatividad asegura
                    la entrega de productos de software de alta calidad.
                  </p>

                  <p>
                    Edsoft se ha convertido en un socio confiable para empresas
                    que buscan soluciones tecnológicas personalizadas y
                    servicios de mantenimiento de software a largo plazo. Su
                    compromiso con la calidad, la innovación y la satisfacción
                    del cliente ha consolidado su posición como una empresa
                    líder en el sector de desarrollo de software.
                  </p>
                </>
              ) : null}
              <Button variant="link" onClick={handleToggleText}>
                {showMore ? "Leer menos" : "Leer más"}
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button
                id="button_modal"
                variant="secondary"
                onClick={handleClose}
              >
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </h1>

        {state?.logged ? (
          <div className="user">
            <span className="welcome_navbar">
              {state?.name.toLowerCase() === "lucia del carmene"
                ? "Bienvenida"
                : "Bienvenido"}
            </span>
            <span className="username">{state?.name}</span>
            <div className="button_logout_navbar">
              <Button variant="danger" onClick={onLogout}>
                Cerrar Sesión
              </Button>{" "}
            </div>
          </div>
        ) : (
          <nav className="container_button_nav">
            <NavLink to="/recover" className="nav-link">
              <Button variant="primary">Recuperar Contraseña</Button>
            </NavLink>{" "}
            <NavLink to="/login" className="nav-link">
              <Button variant="success">Iniciar Sesión</Button>
            </NavLink>{" "}
          </nav>
        )}
      </header>

      <Outlet />
    </>
  );
};
