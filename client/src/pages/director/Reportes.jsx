// src/pages/Reportes.jsx
import React, { useState, useEffect } from "react";
import "../../styles/director/reportes.css";
import Modal from "../../components/Modal";

const Reportes = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipoReporte, setTipoReporte] = useState("asistencia");
  const [reporte, setReporte] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Simulación de cursos disponibles
  useEffect(() => {
    setCursos([
      { id: 1, nombre: "Matemáticas" },
      { id: 2, nombre: "Lenguaje" },
      { id: 3, nombre: "Ciencias" },
    ]);
  }, []);

  const generarReporte = () => {
    setIsOpen(true);
    // Simulación de datos
    const datosSimulados = [
      { alumno: "Juan Pérez", valor: "90%" },
      { alumno: "Ana López", valor: "85%" },
      { alumno: "Carlos Ruiz", valor: "95%" },
    ];
    setReporte(datosSimulados);
  };

  return (
    <div className="reportes-container">
      <h1>Generar Reporte</h1>

      <div className="formulario-reporte">
        <label>Curso:</label>
        <select value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}>
          <option value="">Seleccione un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
          ))}
        </select>

        <label>Fecha de inicio:</label>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

        <label>Fecha de fin:</label>
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

        <label>Tipo de reporte:</label>
        <select value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
          <option value="asistencia">Asistencia</option>
          <option value="notas">Notas</option>
          <option value="participacion">Participación</option>
        </select>

        <button className="botonReporte" onClick={generarReporte}>Generar</button>
      </div>

      {reporte.length > 0 && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
          <div className="tabla-reporte">
          <h2>Reporte de {tipoReporte}</h2>
          <table>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>{tipoReporte === "notas" ? "Nota Promedio" : tipoReporte === "participacion" ? "Participación" : "Asistencia"}</th>
              </tr>
            </thead>
            <tbody>
              {reporte.map((fila, index) => (
                <tr key={index}>
                  <td>{fila.alumno}</td>
                  <td>{fila.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="descargar">
            <button className="pdf">Descargar PDF</button>
            <button className="excel">Descargar Excel</button>
          </div>
        </div>
        </Modal>
      )}
    </div>
  );
};

export default Reportes;
