// src/pages/DashboardDocente.jsx
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/docente/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardDocente = () => {
  const [datos, setDatos] = useState({
    cursos: 3,
    alumnos: 72,
    clasesHoy: 2,
  });

  const chartData = {
    labels: ["Matemáticas", "Ciencias", "Lenguaje"],
    datasets: [
      {
        label: "Asistencia promedio (%)",
        data: [87, 92, 78],
        backgroundColor: ["#4a90e2", "#7ed6df", "#f39c12"],
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="dashboard-docente">
      <h1>Panel del Docente</h1>
      <p>
        Bienvenido, aquí puedes visualizar un resumen de tu actividad.
      </p>

      <div className="docente-cards">
        <div className="docente-card">
          <h3>Cursos asignados</h3>
          <p>{datos.cursos}</p>
        </div>
        <div className="docente-card">
          <h3>Total de alumnos</h3>
          <p>{datos.alumnos}</p>
        </div>
        <div className="docente-card">
          <h3>Clases hoy</h3>
          <p>{datos.clasesHoy}</p>
        </div>
      </div>

      <div className="graficos">
        <div className="docente-chart">
          <h2>Asistencia Promedio por Curso</h2>
          <Bar data={chartData} />
        </div>
        <div className="docente-chart">
          <h2> Promedio de notas por Curso</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardDocente;
