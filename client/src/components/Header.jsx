// Header.jsx
import "../styles/general.css";
import useAuth from "../context/useAuth";

export default function Header() {
  const { user } = useAuth(); 
  

  return (
    <div className="topHeader">
      <div className="headerRight">
        <img
          src={user?.imagen || "/user-default.png"}
          alt="Usuario"
          className="userAvatar"
        />
      </div>
    </div>
  );
}