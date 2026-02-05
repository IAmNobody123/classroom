import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const images = ["/img3.webp", "/img2.webp", "/fondoLogin.jpg"];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      switch (user.rol) {
        case "director":
          navigate("/dashboard", { replace: true });
          break;
        case "docente":
          navigate("/dashboardDocente", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login(username, password);

    if (res.success) {
      const user = localStorage.getItem("user");
      const user2 = JSON.parse(user).rol;

      switch (user2) {
        case "director":
          navigate("/dashboard", { replace: true });
          break;
        case "docente":
          navigate("/dashboardDocente", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }
    } else {
      setErrorMsg(res.error);
    }
  };

  useEffect(() => {
    if (errorMsg) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMsg,
        confirmButtonText: "Cerrar",
      }).then(() => setErrorMsg(""));
    }
  }, [errorMsg]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  });

  return (
    <div
      className="boxLogin"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      <div className="loginContent">
        <h3>Bienvenido a la plataforma de gestion estudiantil</h3>
        <div className="cardLogin">
          <form onSubmit={handleLogin}>
            <fieldset>
              <legend id="legendLogin">Iniciar sesión</legend>
              <div className="bloqueInput">
                <img
                  className="imagenLogin"
                  src="/login.png"
                  alt=""
                />
              </div>
              <div className="bloqueInput">
                <label className="labelInput" htmlFor="user">
                  usuario
                </label>
                <input
                  type="text"
                  id="user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="bloqueInput">
                <label className="labelInput" htmlFor="pass">
                  contraseña
                </label>
                <input
                  type="password"
                  id="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="bloqueButtonLogin">
                <button className="buttonLogin" type="submit">
                  Ingresar
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
