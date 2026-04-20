// Header.jsx
import "../styles/general.css";
import useAuth from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (user?.rol === "director") {
      navigate("/perfil-director");
    }
  };

  return (
    <div className="topHeader">
      <div className="headerRight">
        <img
          src={user?.imagen || "/logo.svg"}
          alt="Usuario"
          className="userAvatar"
          onClick={handleAvatarClick}
          style={user?.rol === "director" ? { cursor: "pointer", transition: "transform 0.2s" } : {}}
          onMouseEnter={(e) => {
            if (user?.rol === "director") e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            if (user?.rol === "director") e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>
    </div>
  );
}