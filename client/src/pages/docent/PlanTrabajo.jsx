import React from 'react'
import '../../styles/docente/PlanTrabajo.css';
export default function PlanTrabajo() {
    const planes = [
    {
      id: 1,
      titulo: "Material didáctico 1",
      descripcion: "material para recreacion de los niños",
      fecha: "12/10/2025",
      curso: "CURSO 1",
    },
  ];
  return (
   <div className="planes-page">
      <div className="top-buttons">
        <button className="menu-btn">Listado de planes de trabajo</button>
        <button className="menu-btn">Editar plan de trabajo</button>
        <button className="menu-btn">Listado de planes de trabajo</button>
      </div>

      <div className="content-box">
        <h2 className="title">Listado de planes de trabajo</h2>

        {planes.map((p) => (
          <div className="plan-card" key={p.id}>
            <div className="plan-info">
              <div className="plan-header">
                <p className="plan-title">{p.titulo}</p>
                <p className="plan-fecha">Fecha: {p.fecha}</p>
              </div>

              <p className="plan-desc">{p.descripcion}</p>

              <p className="plan-curso">Curso: {p.curso}</p>
            </div>

            <button className="btn-ver-material">Ver material</button>
          </div>
        ))}
      </div>
    </div>
  )
}
