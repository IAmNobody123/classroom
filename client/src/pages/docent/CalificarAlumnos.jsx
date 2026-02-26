import { useState, useEffect } from "react";
import CursoCarousel from "../../components/docente/CursoCarousel";
import {
  getAlumnosConParticipaciones,
  finalizarRevision,
  sumarParticipacion,
  getAllMaterialesPendientes,
} from "../../front-back/apiDocenteCursos";
import Modal from "../../components/Modal";
import "../../styles/docente/formularPreguntas.css"; // Reuse existing styles
import Swal from "sweetalert2";

export default function CalificarAlumnos() {
  const [idCurso, setIdCurso] = useState("");
  const [materiales, setMateriales] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (idCurso) {
      getAllMaterialesPendientes(idCurso).then((data) =>
        setMateriales(data || []),
      );
      setActiveModal(null);
      setSelectedMaterial(null);
    }
  }, [idCurso]);

  const handleOpenStudentList = async (material) => {
    setSelectedMaterial(material);

    try {
      const alumnosData = await getAlumnosConParticipaciones(
        material.id,
        idCurso,
      );
      setAlumnos(alumnosData || []);
      setActiveModal("students");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudieron cargar los alumnos",
        "error",
      );
    }
  };

  const handleSumarParticipacion = async (alumnoId) => {
    try {
      await sumarParticipacion({
        alumno_id: alumnoId,
        documento_id: selectedMaterial.id,
      });

      setAlumnos((prev) =>
        prev.map((a) =>
          a.id === alumnoId
            ? { ...a, participaciones: a.participaciones + 1 }
            : a,
        ),
      );
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo registrar la participación",
        "error",
      );
    }
  };

  const handleFinalizarRevision = async () => {
    try {
      await finalizarRevision(selectedMaterial.id);

      Swal.fire({
        icon: "success",
        title: "Revisión finalizada",
        timer: 1500,
        showConfirmButton: false,
      });

      // Recargar materiales
      const data = await getAllMaterialesPendientes(idCurso);
      setMateriales(data || []);

      setActiveModal(null);
      setSelectedMaterial(null);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo finalizar la revisión", "error");
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Calificar Participaciones</h1>

      <CursoCarousel setIdCurso={setIdCurso} />

      <div style={{ marginTop: "20px" }}>
        <h3>Materiales Pendientes</h3>

        {materiales.length > 0 ? (
          materiales.map((m) => (
            <div
              key={m.id}
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{m.titulo}</span>
              <button
                onClick={() => handleOpenStudentList(m)}
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Calificar
              </button>
            </div>
          ))
        ) : (
          <p>No hay materiales pendientes.</p>
        )}
      </div>

      {activeModal === "students" && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Participaciones - ${selectedMaterial?.titulo}`}
        >
          {alumnos.length > 0 ? (
            <>
              <table
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th>Alumno</th>
                    <th>Participaciones</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((alum) => (
                    <tr
                      key={alum.id}
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <td style={{ padding: "8px" }}>
                        {alum.nombre} {alum.apellido}
                      </td>

                      <td style={{ padding: "8px" }}>
                        {alum.participaciones}
                      </td>

                      <td style={{ padding: "8px" }}>
                        <button
                          onClick={() =>
                            handleSumarParticipacion(alum.id)
                          }
                          style={{
                            background: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          +1
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                  onClick={handleFinalizarRevision}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "8px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Finalizar Revisión
                </button>
              </div>
            </>
          ) : (
            <p>No hay alumnos en este curso.</p>
          )}
        </Modal>
      )}
    </div>
  );
}
