import { useEffect, useState } from "react";
import "../../styles/docente/juegos.css";
import Toast from "../../components/Toast";

export default function Juegos() {
  const [filtro, setFiltro] = useState("TODOS");

  const juegos = [
    {
      id: 1,
      nombre: "COKITOS",
      categoria: "TEA",
      url: "https://www.cokitos.com/juego-clasificar-por-colores/play/",
      imagen: "/juegos/juego1.png",
    },
    {
      id: 2,
      nombre: "BUSCAR ELEMENTOS ESCONDIDOS",
      categoria: "TEA",
      url: "https://www.educaenvivo.com/juegos-educativos-online/juego-buscar-elementos-escondidos/",
      imagen: "/juegos/juego2.png",
    },
    {
      id: 3,
      nombre: "JUEGOS ARCO IRIS",
      categoria: "TDAH",
      url: "https://www.juegosarcoiris.com/juegos",
      imagen: "/juegos/juego3.png",
    },
    {
      id: 4,
      nombre: "ARBOL ABC",
      categoria: "TDAH",
      url: "https://arbolabc.com/",
      imagen: "/juegos/juego4.png",
    },
  ];
  const handleEscoger = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const juegosFiltrados =
    filtro === "TODOS"
      ? juegos
      : juegos.filter((juego) => juego.categoria === filtro);
  useEffect(() => {
    Toast("Juegos", "Juegos cargados", "success");
  },[filtro])

  return (
    <div className="juegos-container">
      <h1 className="titulo">Seccion de Juegos</h1>

      {/* <div className="filtro-container">
        <button
          className={`filtro-btn ${filtro === "TEA" ? "activo" : ""}`}
          onClick={() => setFiltro("TEA")}
        >
          TEA
        </button>

        <button
          className={`filtro-btn ${filtro === "TDAH" ? "activo" : ""}`}
          onClick={() => setFiltro("TDAH")}
        >
          TDAH
        </button>

        <button
          className={`filtro-btn todos ${filtro === "TODOS" ? "activo" : ""}`}
          onClick={() => setFiltro("TODOS")}
        >
          TODOS
        </button>
      </div> */}

      {/* Contenedor de tarjetas */}
      <div className="juegos-grid">
        {juegosFiltrados.map((j) => (
          <div className="juego-card" key={j.id}>
            <img
              src={j.imagen}
              alt={j.nombre}
              className="juego-img"
            />

            <h3 className="juego-nombre">{j.nombre}</h3>

            <button
              className="btn-escoger"
              onClick={() => handleEscoger(j.url)}
            >
              Escoger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
