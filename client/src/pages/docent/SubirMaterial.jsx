import { useEffect, useState } from "react";
import CardCursos from "../../components/CardCursos";
import "../../styles/docente/subirMaterial.css";
import UltimosMateriales from "../../components/director/UltimosMateriales";
import {  getListCursosDocente } from "../../front-back/apiDocenteCursos";

export default function SubirMaterial() {
  const user = localStorage.getItem("user");
  const id = JSON.parse(user).id;
  const [misCursos, setMisCursos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleMaterialAdded = () => {
    setRefresh(prev => !prev);
  }

    const dataCursos = async (id) => {
      const res = await getListCursosDocente(id);
      setMisCursos(res);
    };
  
    useEffect(() => {
      dataCursos(id);
    }, [id]);
  

  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;
  const endIndex = startIndex + itemsPerPage;

  const handleNext = () => {
    if (endIndex < misCursos.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const visibleCursos = misCursos.slice(startIndex, endIndex);
  
  return (
    <div className="BoxSubirMaterial">
      <div className="carrusel-container">
        <button
          className="nav-button"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          {"<"}
        </button>
        <div className="cursos-wrapper">
          {visibleCursos.map((curso, index) => (
            <CardCursos
              key={index}
              id={curso.id}
              idDocente={id}
              nombreCurso={curso.nombre}
              grado={curso.grado}
              button={"Agregar material"}
              onMaterialAdded={handleMaterialAdded}
            />
          ))}
        </div>
        <button
          className="nav-button"
          onClick={handleNext}
          disabled={endIndex >= misCursos.length}
        >
          {">"}
        </button>
      </div>
      <div className="containerBodySubirMaterial">
        <UltimosMateriales refresh={refresh} idDocente={id} />
      </div>
    </div>
  );
}
