import { useEffect, useState } from 'react';
import MaterialItem from './MaterialItem';
import { listadoMaterialCurso } from '../../front-back/apiDocenteCursos';

export default function UltimosMateriales(refresh) {
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    const response = listadoMaterialCurso();
    response.then((data) => {
      setMateriales(data);
    });
  },[refresh]);

  return (
    <div className="ultimos-materiales">

      <h2>Últimos materiales subidos</h2>
      {materiales.map((mat, index) => (
        <MaterialItem
          key={index}
          titulo={mat.titulo}
          fecha={(mat.subido).substring(0, 10)}
          curso={mat.nombre}
        />
      ))}
    </div>
  );
}
