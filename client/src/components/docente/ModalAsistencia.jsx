import React from "react";
import Modal from "../Modal";
import { marcarAsistencia } from "../../front-back/apiDocenteCursos";
import Swal from "sweetalert2";

export default function ModalAsistencia({
  isOpen,
  onClose,
  nombreCurso,
  alumnos = [],
  idCurso,
}) {
  const fechaActual = new Date().toLocaleDateString();
  const [asistenciasMarcadas, setAsistenciasMarcadas] =
    React.useState([]);

  const onMarcarAsistencia = async (alumnoId, estadoAsistencia) => {
    const data = {
      idCurso,
      alumnoId,
      fechaActual,
      estadoAsistencia,
    };
    const result = await marcarAsistencia(data);
    if (!result.error) {
      setAsistenciasMarcadas((prev) => ({
        ...prev,
        [alumnoId]: true,
      }));
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: "Asistencia registrada",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Modal
      className="modalAsistencia"
      isOpen={isOpen}
      onClose={onClose}
      title={`Asistencia de ${nombreCurso} del día ${fechaActual}`}
    >
      <div className="containerAlumnosCurso">
        <h3>Lista de alumnos de {nombreCurso}</h3>

        {alumnos.length === 0 ? (
          <p>No hay alumnos registrados.</p>
        ) : (
          alumnos.map((alumno) => {
            const marcado = asistenciasMarcadas[alumno.id];
            return (
              <div key={alumno.id} className="alumno">
                <div className="cardAlumno">
                  <img
                    className="imagenAlumno"
                    src={
                      alumno.imagenUrl
                        ? `${alumno.imagenUrl}`
                        : "/default-avatar.png"
                    }
                    alt={alumno.nombre}
                  />
                </div>
                <div className="cardAlumno">
                  <p>
                    {alumno.nombre} {alumno.apellido}
                  </p>
                </div>
                <div className="botonesAsistencia">
                  <button
                    className="presente"
                    onClick={() =>
                      onMarcarAsistencia(alumno.id, true)
                    }
                    disabled={marcado}
                  >
                    Presente
                  </button>
                  <button
                    className="ausente"
                    onClick={() =>
                      onMarcarAsistencia(alumno.id, false)
                    }
                    disabled={marcado}
                  >
                    Ausente
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
