import { useEffect, useState } from "react";
import { getListCursosDocente } from "../../front-back/apiDocenteCursos";

export default function CursoCarousel( {setIdCurso} ) {
  const user = localStorage.getItem("user");
  const id = JSON.parse(user).id;
  const [misCursos, setMisCursos] = useState([]);
  
    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 1;
    const endIndex = startIndex + itemsPerPage;


  const dataCursos = async (id) => {
      const res = await getListCursosDocente(id);
      console.log(res);
      setMisCursos(res);
  };

  useEffect(() => {
    dataCursos(id);
  }, [id]);

  const handleClickId = (id) => {
    setIdCurso(id);
    console.log(id);
  };

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
    <div className="seleccionarCurso">
      <p>Selecciona el curso</p>
      <div className="carousel-box">
        <button
          className="nav-button"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          {"<"}
        </button>

        {visibleCursos.map((curso) => (
          <div className="curso-card" key={curso.id}>
            <h3>{curso.nombre}</h3>
            <p>{curso.grado}</p>
            <button className="btn-ver" onClick={() => handleClickId(curso.id)}>Ver material</button>
          </div>
        ))}


        <button
          className="nav-button"
          onClick={handleNext}
          disabled={endIndex >= misCursos.length}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
