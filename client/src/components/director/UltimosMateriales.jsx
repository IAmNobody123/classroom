import { useEffect, useState } from 'react';
import MaterialItem from './MaterialItem';
import { listadoMaterialCurso } from '../../front-back/apiDocenteCursos';

export default function UltimosMateriales({ refresh, idDocente }) {
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    const response = listadoMaterialCurso( idDocente );
    response.then((data) => {
      setMateriales(data);
    });
  }, [refresh, idDocente]);

  return (
    <div className="ultimos-materiales">

      <h2>Últimos materiales subidos</h2>
      {materiales.map((mat, index) => (
        <MaterialItem
          key={index}
          id={mat.id}
          titulo={mat.titulo}
          fecha={mat.subido ? mat.subido.substring(0, 10) : ""}
          curso={mat.nombre}
        />
      ))}
    </div>
  );
}
