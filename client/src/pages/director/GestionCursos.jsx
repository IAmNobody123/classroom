import { useEffect, useState } from "react";
import "../../styles/director/gestionCursos.css";
import Modal from "../../components/Modal";
import {
  getListCursos,
  getListDocentes,
  insertCurso,
} from "../../front-back/apiDirector";
import Swal from "sweetalert2";

export default function GestionCursos() {
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCursos, setOpenModalCursos] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [nombreCurso, setNombreCurso] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [docente, setDocente] = useState("");
  const [notification, setNotification] = useState("");
  const [grado, setGrado] = useState("");

  const dataDocentes = async () => {
    const res = await getListDocentes();
    setDocentes(res);
  };
  const dataCursos = async () => {
    const res = await getListCursos();
    setCursos(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre: nombreCurso,
      descripcion: descripcion,
      docente: docente,
      grado: grado,
    };
    const response = await insertCurso(data);
    if (response.success) {
      dataCursos();
      setNombreCurso("");
      setDescripcion("");
      setDocente("");
      setNotification("Curso creado exitosamente");
      setOpenModal(false);
      Swal.fire({
        title: notification,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      setNotification(response.error);
    }
  };

  useEffect(() => {
    dataDocentes();
    dataCursos();
  }, []);

  return (
    <div>
      <div className="addCurso">
        <p>Presiona el boton para agregar un nuevo curso</p>
        <button
          className="buttonAddCurso"
          onClick={() => setOpenModal(true)}
        >
          Agregar Curso
        </button>
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title={"Agregar Curso"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-class">
              <label htmlFor="curso">
                Ingrese el nombre del curso:
              </label>
              <input
                type="text"
                name="curso"
                onChange={(e) => setNombreCurso(e.target.value)}
                required
              />
            </div>
            <div className="form-class">
              <label htmlFor="description">
                Ingrese una breve descripcion del curso:
              </label>
              <textarea
                id="description"
                name="description"
                required
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
            <div className="form-class">
              <label>Seleccione el docente a cargo:</label>
              <select
                name="docente"
                required
                onClick={(e) => setDocente(e.target.value)}
              >
                <option value="">Seleccione una opcion</option>
                {docentes.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-class">
              <label>Seleccione el grado del curso:</label>
              <select
                name="grado"
                required
                onClick={(e) => setGrado(e.target.value)}
              >
                <option value="">Seleccione una opcion</option>
                <option value="5to grado">5to grado</option>
                <option value="6to grado">6to grado</option>
              </select>
            </div>

            <button type="submit">Agregar</button>
          </form>
        </Modal>
      </div>
      <div className="bodyCursos">
        {cursos && cursos.length > 0 ? (
          cursos.map((curso) => (
            <div className="cardCurso" key={curso.id}>
              <h2>{curso.curso}</h2>
              <p>{curso.description}</p>
              <p>Grado: {curso.grado}</p>
              <button
                className="buttonVerDetalles"
                onClick={() => {
                  setCursoSeleccionado(curso);
                  setOpenModalCursos(true);
                }}
              >
                Ver detalles
              </button>
            </div>
          ))
        ) : (
          <p>No hay cursos disponibles</p>
        )}
        {cursoSeleccionado && (
          <Modal
            isOpen={openModalCursos}
            onClose={() => {
              setOpenModalCursos(false);
              setCursoSeleccionado(null);
            }}
            title={"Detalles del Curso"}
          >
            <p>Nombre: {cursoSeleccionado.nombre}</p>
            <p>Descripción: {cursoSeleccionado.descripcion}</p>
            <p>Docente: {cursoSeleccionado.docente}</p>
            <p>Grado: {cursoSeleccionado.grado}</p>
          </Modal>
        )}
      </div>
    </div>
  );
}
