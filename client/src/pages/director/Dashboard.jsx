import "../../styles/director.css";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/director/dashboard.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const stats = {
    alumnos: 150,
    docentes: 12,
    cursos: 8,
  };

  const chartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Asistencias promedio",
        data: [85, 90, 80, 88, 92, 87],
        backgroundColor: "#4A90E2",
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel del Director</h1>
      <p className="dashboard-subtitle">
        Sistema de gestion escolar
      </p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Alumnos</h3>
          <p>{stats.alumnos}</p>
        </div>
        <div className="card">
          <h3>Docentes</h3>
          <p>{stats.docentes}</p>
        </div>
        <div className="card">
          <h3>Cursos</h3>
          <p>{stats.cursos}</p>
        </div>
      </div>

      <div className="graficos">
        <div className="dashboard-chart">
          <h2>Resumen de Asistencias</h2>
          <Bar data={chartData} />
        </div>
        <div className="dashboard-chart">
          <h2>Resumen de Asistencias</h2>
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
