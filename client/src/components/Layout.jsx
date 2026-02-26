import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import "../App.css";
import Header from "./Header";

export default function Layout() {
  const { user } = useAuth(); 
  
  
  return (
    <div className="contenedorGeneral">
      <Sidebar role={user?.rol} />
      <main className="boxMain">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
