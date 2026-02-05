// Sidebar.jsx
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "../styles/general.css";
import useAuth from "../context/useAuth";
const menuItems = {
  docente: [
    { path: "/dashboardDocente", label: "Dashboard" },
    { path: "/mis-cursos", label: "Mis Cursos" },
    { path: "/subir-material", label: "Subir material" },
    { path: "/formular-preguntas", label: "Formular Preguntas" },
    { path: "/calificar-alumnos", label: "Calificar Alumnos" },
    { path: "/plan-trabajo", label: "Plan de trabajo" },
    { path: "/juegos", label: "Juegos disponibles" },
  ],
  director: [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/gestionUsuarios", label: "Gestión de Usuarios" },
    { path: "/cursos", label: "Cursos" },
    { path: "/reportes", label: "Reportes" },
  ],
};

export default function Sidebar({ role }) {
  const items = menuItems[role] || [];
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <div className="sidebarBox">
      <h2 className="sidebarTitle">Menú</h2>
      <ul className="sidebarList">
        {items.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebarLink active" : "sidebarLink"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebarFooter">
        <Link to="/login" className="logoutButton">
          <button
            className="cerrarSesion"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </Link>
      </div>
    </div>
  );
}
