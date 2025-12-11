import { useState } from "react";
import "../../styles/docente/juegos.css";

export default function Juegos() {
  const [filtro, setFiltro] = useState("TODOS");

  const juegos = [
    {
      id: 1,
      nombre: "Adivina la palabra",
      categoria: "TEA",
      imagen: "/img/adivinaPalabra.png",
    },
    {
      id: 2,
      nombre: "WORDL",
      categoria: "TEA",
      imagen: "/img/wordl.png",
    },
    {
      id: 3,
      nombre: "Secuencia de colores",
      categoria: "TDAH",
      imagen: "/img/secuencia.png",
    },
    {
      id: 4,
      nombre: "MEMORAMA",
      categoria: "TDAH",
      imagen: "/img/memorama.png",
    },
  ];

  const juegosFiltrados =
    filtro === "TODOS"
      ? juegos
      : juegos.filter((juego) => juego.categoria === filtro);

  return (
    <div className="juegos-container">
      <h1 className="titulo">Selecciona el juego</h1>

      {/* Filtros */}
      <div className="filtro-container">
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
      </div>

      {/* Contenedor de tarjetas */}
      <div className="juegos-grid">
        {juegosFiltrados.map((j) => (
          <div className="juego-card" key={j.id}>
            <img src={j.imagen} alt={j.nombre} className="juego-img" />

            <h3 className="juego-nombre">{j.nombre}</h3>

            <button className="btn-escoger">Escoger</button>
          </div>
        ))}
      </div>
    </div>
  );
}
