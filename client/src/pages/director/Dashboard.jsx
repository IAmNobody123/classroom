import "../../styles/director.css";
import { useEffect, useState } from "react";
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

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
} from "react-icons/fa";
import { getDataDashboard } from "../../front-back/apiDirector";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const { id } = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  console.log("ID", id);

  // const stats = {
  //   alumnos: 150,
  //   docentes: 12,
  //   cursos: 8,
  // };
  const cards = [
    {
      titulo: "Alumnos",
      cantidad: data.alumnos,
      icon: <FaUserGraduate />,
    },
    {
      titulo: "Docentes",
      cantidad: data.docentes,
      icon: <FaChalkboardTeacher />,
    },
    {
      titulo: "Clases",
      cantidad: data.cursos,
      icon: <FaSchool />,
    },
    {
      titulo: "Plan de trabajo",
      cantidad: data.planTrabajo,
      icon: <FaUserGraduate />,
    }
  ];

  const loadData = async () => {
    const response = await getDataDashboard();
    setData(response);
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

  useEffect(() => {
    loadData();
  }, [id]);
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel del Director</h1>
      <p className="dashboard-subtitle">Sistema de gestion escolar</p>

      <div className="dashboard-cards">
        {cards.map((item, index) => (
          <div className="card" key={index}>
            <div className="card-icon">{item.icon}</div>
            <h4>{item.titulo}</h4>
            <p>{item.cantidad}</p>
          </div>
        ))}

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
