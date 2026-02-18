import { useState, useEffect } from "react";
import CursoCarousel from "../../components/docente/CursoCarousel";
import {
  getMaterialesPendientes,
  getAlumnosSinNota,
  getFormularioByDocumento,
  submitExamen,
} from "../../front-back/apiDocenteCursos";
import Modal from "../../components/Modal";
import "../../styles/docente/formularPreguntas.css"; // Reuse existing styles
import Swal from "sweetalert2";

export default function CalificarAlumnos() {
  const [idCurso, setIdCurso] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  // Modal & Selection State
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'students', 'exam'
  const [formulario, setFormulario] = useState(null);
  const [respuestas, setRespuestas] = useState({}); // { preguntaId: alternativaId }

  useEffect(() => {
    if (idCurso) {
      // Updated to fetch only pending materials
      getMaterialesPendientes(idCurso).then((data) =>
        setMateriales(data || []),
      );

      // Reset
      setSelectedMaterial(null);
      setFormulario(null);
      setAlumnos([]);
      setActiveModal(null);
    }
  }, [idCurso]);

  const handleOpenStudentList = async (material) => {
    setSelectedMaterial(material);
    try {
      // Updated to fetch ONLY students without grades for this form
      // 'material' object from getMaterialesPendientes includes 'formulario_id'
      if (!material.formulario_id) {
        alert(
          "Error: Material sin formulario ID (backend logic info missing)",
        );
        return;
      }

      const alumnosData = await getAlumnosSinNota({
        cursoId: idCurso,
        formularioId: material.formulario_id,
      });
      setAlumnos(alumnosData);

      // Fetch Formulario
      const formData = await getFormularioByDocumento(material.id);
      if (formData && formData.id) {
        if (formData.preguntas && formData.preguntas.length > 0) {
          setFormulario(formData);
          setActiveModal("students");
        } else {
          setFormulario(null);
          alert("El examen no tiene preguntas cargadas.");
        }
      } else {
        setFormulario(null);
        alert("Este material no tiene un formulario asociado.");
      }
    } catch (error) {
      console.error(error);
      setFormulario(null);
      alert("Error al obtener datos");
    }
  };

  const handleStartGrading = (student) => {
    setSelectedStudent(student);
    setRespuestas({});
    setActiveModal("exam");
  };

  const handleOptionChange = (preguntaId, alternativaId) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: alternativaId,
    }));
  };

  const handleSubmitExam = async () => {
    if (!formulario || !selectedStudent) return;

    const payload = {
      alumno_id: selectedStudent.id,
      formulario_id: formulario.id,
      respuestas: Object.keys(respuestas).map((pId) => ({
        pregunta_id: parseInt(pId),
        alternativa_id: respuestas[pId],
      })),
    };

    try {
      const result = await submitExamen(payload);
      if (result && result.nota !== undefined) {
        Swal.fire({
          icon: "success",
          title: "Calificación guardada, nota estudiantil: " + result.nota,
          showConfirmButton: false,
          timer: 1500,
        });

        setAlumnos((prev) =>
          prev.filter((a) => a.id !== selectedStudent.id),
        );

        if (alumnos.length <= 1) {
          getMaterialesPendientes(idCurso).then((data) =>
            setMateriales(data || []),
          );
          setActiveModal(null);
        } else {
          setActiveModal("students");
        }

        setSelectedStudent(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al guardar la calificación",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error de conexion",
        showConfirmButton: false,
        timer: 1500,
      })
    }
  };

  return (
    <div
      className="calificar-alumnos-page"
      style={{ padding: "20px" }}
    >
      <h1 className="title">Calificar Alumnos (Manual)</h1>

      <div className="top-section">
        <CursoCarousel setIdCurso={setIdCurso} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Materiales con Pendientes</h3>
        {materiales.length > 0 ? (
          materiales.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px",
                borderBottom: "1px solid red",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{m.titulo}</span>
              <button
                onClick={() => handleOpenStudentList(m)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Calificar
              </button>
            </div>
          ))
        ) : (
          <p>
            Todos los materiales están calificados o no hay
            materiales.
          </p>
        )}
      </div>

      {/* Modal: List of Students */}
      {activeModal === "students" && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Alumnos Pendientes - ${selectedMaterial?.titulo}`}
        >
          {alumnos.length > 0 ? (
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th>Alumno</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnos.map((alum) => (
                  <tr
                    key={alum.id}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "10px" }}>
                      {alum.nombre} {alum.apellido}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        onClick={() => handleStartGrading(alum)}
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "3px",
                          cursor: "pointer",
                        }}
                      >
                        Calificar (Examen)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay alumnos pendientes para este material.</p>
          )}
        </Modal>
      )}

      {/* Modal: Exam Interface */}
      {activeModal === "exam" && formulario && selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal("students")}
          title={`Evaluando a: ${selectedStudent.nombre} ${selectedStudent.apellido}`}
        >
          <div
            className="exam-container"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <p>
              <strong>Formulario:</strong> {formulario.titulo}
            </p>
            <hr />
            {formulario.preguntas.map((p, index) => (
              <div
                key={p.id}
                className="pregunta-block"
                style={{ marginBottom: "20px" }}
              >
                <p style={{ fontWeight: "bold" }}>
                  {index + 1}. {p.enunciado}
                </p>
                {p.imagen_url && (
                  <img
                    src={p.imagen_url}
                    alt="Pregunta"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                )}
                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                  {p.alternativas.map((alt) => (
                    <li key={alt.id} style={{ margin: "5px 0" }}>
                      <label
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          name={`pregunta_${p.id}`}
                          value={alt.id}
                          checked={respuestas[p.id] === alt.id}
                          onChange={() =>
                            handleOptionChange(p.id, alt.id)
                          }
                          style={{ marginRight: "10px" }}
                        />
                        {alt.texto}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={handleSubmitExam}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
                width: "fit-content",
              }}
            >
              Guardar Notas
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
