import Carousel from "react-bootstrap/Carousel";
import "../css/Carousels.css";

function UncontrolCarousel() {
  return (
    <Carousel id="carousels_control" className="carousels_control">
      <Carousel.Item id="Carousels_dashboard" className="Carousels_dashboard">
        <img src="./src/img/promociones.png" alt="promociones" />
        <Carousel.Caption id="Carousel.Caption">
          <h3>Ofertas espaciales</h3>
          <p>Valido Por el Mes de Diciembre</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item id="Carousels_dashboard">
        <img src="./src/img/personal_calificado.png" alt="personal de nuestra tienda" />
        <Carousel.Caption id="Carousel.Caption">
          <h3>Personal Calificado</h3>
          <p>En todas nuestras instalaciones</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item id="Carousels_dashboard">
        <img src="/src/img/marcas.png" alt="Marcas aliadas" />
        <Carousel.Caption id="Carousel.Caption">
          <h3>Principales Proveedores</h3>
          <p>Marcas aliadas</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default UncontrolCarousel;
