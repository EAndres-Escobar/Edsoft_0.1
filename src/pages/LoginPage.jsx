import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../hook/userForm";
import Button from "react-bootstrap/Button";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Login.css";

const MySwal = withReactContent(Swal);
const localhost = import.meta.env.VITE_URL_LOCALHOST

export const LoginPage = () => {
  const navigate = useNavigate();
  const { name, user, password, onInputChange, onResetForm } = useForm({
    name: "",
    user: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [, setMessage] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    MySwal.fire({
      title: "Verificando datos",
      text: "Espere un momento...",
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(`${localhost}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres: name,
          idUsuario: user,
          passwordE: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.close();
        MySwal.fire({
          title: "Inicio de sesión correcto",
          text: "Bienvenido/a " + name,
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        navigate("/dashboard", {
          replace: true,
          state: {
            logged: true,
            name,
          },
        });
        setMessage(data.message);
      } else {
        Swal.close();
        MySwal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      Swal.close();
      MySwal.fire({
        title: "Error",
        text: "No se pudo conectar con el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }

    onResetForm();
  };

  return (
    <div className="wrapper_login">
      <img
        className="img_login"
        src="./src/img/edsof.png"
        alt="Logo de edsoft"
      />
      <form onSubmit={onLogin}>
        <h1 className="h1_login">Inicio de Sesión</h1>

        <div className="input_group" htmlFor="name">
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
          <label id="label_login" htmlFor="name">
            Nombres
          </label>
        </div>
        <div className="input_group">
          <input
            className="input_login"
            type="text"
            name="user"
            id="user"
            value={user}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label id="label_login" htmlFor="user">
            Usuario
          </label>
        </div>
        <div className="input_group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            value={password}
            onChange={onInputChange}
            required
            placeholder=""
            autoComplete="off"
          />
          <label id="label_login" htmlFor="password">
            Contraseña
          </label>
          <div className="eye-icon" onClick={toggleShowPassword}>
            {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
          </div>
        </div>
        <Button variant="success" type="submit">
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
};
