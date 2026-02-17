import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
import {saveAs} from "file-saver";
import { useState, useEffect } from "react";
import "../../styles/director/reportes.css";
import Modal from "../../components/Modal";
import {
  getListCursos,
  getReportes,
} from "../../front-back/apiDirector";
import Toast from "../../components/Toast";

const Reportes = () => {
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipoReporte, setTipoReporte] = useState("asistencia");
  const [reporte, setReporte] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const generarPDF = () => {
  const doc = new jsPDF();

  doc.text("Reporte de Asistencia", 14, 15);

  const tableColumn = ["Alumnos", "Asistencia","fecha"];
  const tableRows = [];

  reporte.forEach((fila) => {
    const asistencia = fila.presente ? "Presente" : "Ausente";

    tableRows.push([
      fila.nombre,
      asistencia,
      fila.hora_registro
    ]);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("reporte.pdf");
};

const generarExcel = () => {
  const datosFormateados = reporte.map((fila) => ({
    Alumno: fila.nombre,
    fecha: fila.hora_registro,
    Asistencia: fila.presente ? "Presente" : "Ausente",
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(data, "reporte.xlsx");
};

  useEffect(() => {
    getListCursos().then((cursos) => setCursos(cursos));
  }, []);

  const generarReporte = async () => {
    if (!cursoSeleccionado) {
      Toast("Error", "Por favor, seleccione un curso", "error");
      return;
    }

    const data = {
      curso: cursoSeleccionado,
      fecha: fecha,
      tipoReporte: tipoReporte,
    };

    const datos = await getReportes(data);

    setReporte(datos); // primero guardamos los datos
    if (datos.length > 0) {
      setIsOpen(true); // luego abrimos el modal
    } else {
      Toast("Info", "No hay datos para este reporte", "info");
    }
  };

  return (
    <div className="reportes-container">
      <h1>Generar Reporte</h1>

      <div className="formulario-reporte">
        <label>Curso:</label>
        <select
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
        >
          <option value="">Seleccione un curso</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.id}>
              {curso.curso}
            </option>
          ))}
        </select>

        <label>Fecha de inicio:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <label>Tipo de reporte:</label>
        <select
          value={tipoReporte}
          onChange={(e) => setTipoReporte(e.target.value)}
        >
          <option key={"asistencia"} value="asistencia">
            Asistencia
          </option>
          <option key={"notas"} value="notas">
            Notas
          </option>
        </select>

        <button className="botonReporte" onClick={generarReporte}>
          Generar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {reporte.length === 0 ? (
          <p>No hay datos para mostrar</p>
        ) : (
          <div className="tabla-reporte">
            <h2>Reporte de {tipoReporte}</h2>
            <table>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>Fecha</th>
                  <th>
                    {tipoReporte === "notas"
                      ? "Nota Promedio"
                      : "Asistencia"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {reporte.map((fila, index) => (
                  <tr key={index}>
                    <td>{fila.nombre}</td>
                    <td>{fila.hora_registro}</td>
                    <td>
                      {tipoReporte === "asistencia"
                        ? fila.presente
                          ? "Presente"
                          : "Ausente"
                        : fila.promedio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="descargar">
              <button className="pdf" onClick={generarPDF}>Descargar PDF</button>
              <button className="excel" onClick={generarExcel}>Descargar Excel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reportes;
