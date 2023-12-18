import { useForm } from "../hook/userForm";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Recover.css";

const MySwal = withReactContent(Swal);

export const RecoverPage = () => {
  const { name, email, apellido, documento, onInputChange, onResetForm } =
    useForm({
      name: "",
      apellido: "",
      email: "",
      documento: "",
    });

  const onRecover = async (e) => {
    e.preventDefault();

    MySwal.fire({
      title: "Enviando datos...",
      text: "Por favor espere",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        MySwal.showLoading();
      },
    });

    try {
      const response = await axios.post("http://localhost:5000/sendmail", {
        name,
        apellido,
        email,
        documento,
      });

      console.log(response);
      MySwal.close();
      MySwal.fire("Éxito", "Datos enviados con éxito", "success");
    } catch (error) {
      console.error(error);
      MySwal.close();
      MySwal.fire(
        "Error",
        "Error al enviar los datos. Por favor, inténtalo de nuevo.",
        "error"
      );
    }

    onResetForm();
  };

  return (
    <div className="wrapper_recover">
      <img
        className="img_recover"
        src="./src/img/edsof.png"
        alt="Logo de edsoft"
      />
      <form onSubmit={onRecover}>
        <h1 className="h1_recover">Recuperar Contraseña</h1>

        <div className="input_group">
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label htmlFor="name">Nombres</label>
        </div>
        <div className="input_group">
          <input
            type="text"
            name="apellido"
            id="apellido"
            value={apellido}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label htmlFor="apellido">Apellidos</label>
        </div>
        <div className="input_group">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label htmlFor="email">Correo</label>
        </div>
        <div className="input_group">
          <input
            type="number"
            name="documento"
            id="documento"
            value={documento}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label htmlFor="documento">Documento</label>
        </div>
        <Button variant="primary" type="submit">
          Recuperar Contraseña
        </Button>
      </form>
    </div>
  );
};
