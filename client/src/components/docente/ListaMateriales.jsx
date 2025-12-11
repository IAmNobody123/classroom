import { useEffect, useState } from "react";
import { materialPorCurso } from "../../front-back/apiDocenteCursos";

export default function ListaMateriales({ idCurso }) {
  const [materiales, setMateriales] = useState([]);
    
  useEffect(() => {
    const response = materialPorCurso(idCurso);
    response.then((data) => {
      setMateriales(data);
    });
  }, [idCurso]);

  return (
    <div className="lista-materiales">
      {materiales ? (
        materiales.map((m, i) => (
          <div className="material-item" key={i}>
            <div>
              <p className="material-title">{m.titulo}</p>
              <p className="material-curso">Curso: {m.curso}</p>
            </div>
            <button className="btn-agregar">Agregar preguntas</button>
          </div>
        ))
      ) : (
        <p>No hay materiales</p>
      )}
    </div>
  );
}
