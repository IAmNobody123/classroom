import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div>
      <h1>home</h1>
      <button onClick={() => navigate("/login")}>
        Iniciar sesión
      </button>
      <button onClick={() => {logout(); navigate("/login", { replace: true })} }>Cerrar sesión</button>
    </div>
  );
}
