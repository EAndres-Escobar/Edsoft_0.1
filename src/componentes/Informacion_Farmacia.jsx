import  { useState } from "react";

import Offcanvas from "react-bootstrap/Offcanvas";
import "../css/Informacion_Farmacia.css";

function InformacionEdsoft() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <img
        src="./src/img/logo.png" 
        alt="Info Icon"
        className="Button_info_Edsoft"
        onClick={handleShow} 
        style={{ cursor: 'pointer' }} 
      />

      <Offcanvas
        show={show}
        onHide={handleClose}
        name="Offcanvas"
        backdrop="static"
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><h1><b>La Mano Amiga</b></h1></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            La Mano Amiga es una farmacia líder comprometida con la salud y el
            bienestar de la comunidad. Con una sólida reputación en el sector,
            nos enorgullece ofrecer servicios farmacéuticos confiables y
            productos de calidad. Fundada con la misión de brindar atención
            personalizada, La Mano Amiga se destaca por su dedicación a la salud
            y su contribución al cuidado integral de sus clientes.
          </p>

          <h4>
            <b>Principales Características de La Mano Amiga:</b>
          </h4>

          <p>
            <b>Atención Farmacéutica Personalizada:</b>
          </p>
          <p>
            En La Mano Amiga, nos especializamos en proporcionar servicios
            farmacéuticos personalizados, adaptados a las necesidades
            individuales de nuestros clientes. Nuestro equipo de profesionales
            está comprometido con brindar asesoramiento personalizado y
            garantizar que cada cliente reciba la atención farmacéutica que
            merece.
          </p>

          <p>
            <b>Innovación y Variedad de Productos:</b>
          </p>
          <p>
            Estamos a la vanguardia de la innovación en el ámbito farmacéutico,
            ofreciendo una amplia variedad de productos de calidad. En La Mano
            Amiga, nos mantenemos actualizados con las últimas tendencias y
            avances en medicamentos y productos de cuidado personal para
            garantizar opciones variadas y eficaces para nuestros clientes.
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default InformacionEdsoft;
