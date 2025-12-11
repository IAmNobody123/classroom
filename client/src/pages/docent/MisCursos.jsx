import { useEffect, useState } from "react";
import {
  getListCursosDocente,
  insertAlumnoCurso,
  listAlumnosCursos,
} from "../../front-back/apiDocenteCursos";
import "../../styles/docente/misCursos.css";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import ModalAsistencia from "../../components/docente/ModalAsistencia";

export default function MisCursos() {
  const [misCursos, setMisCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");
  const [discapacidad, setDiscapacidad] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [apellidoAlumno, setApellidoAlumno] = useState("");
  const [isOpenAgregar, setIsOpenAgregar] = useState(false);
  const [isOpenAsistencia, setIsOpenAsistencia] = useState(false);
  const [isOpenDetalles, setIsOpenDetalles] = useState(false);
  const [notification, setNotification] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [nombreCurso, setNombreCurso] = useState("");
  const [alumnos, setAlumnos] = useState([]);

  const user = localStorage.getItem("user");
  const id = JSON.parse(user).id;

  const dataCursos = async (id) => {
    console.log(id);
    const res = await getListCursosDocente(id);
    setMisCursos(res);
  };

  const handleCloseAgregar = () => {
    setPreview(null);
    setIsOpenAgregar(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleAgregarAlumno = (id) => {
    setIdCurso(id);
    setIsOpenAgregar(true);
  };

  const handleAsistencia =  async(nombre,idCurso) => {
    setNombreCurso(nombre);
    setIdCurso(idCurso);
    const response = await listAlumnosCursos(idCurso);
    setAlumnos(response);
    setIsOpenAsistencia(true);
  };

  const hanldleSubmit = async () => {
    const formData = new FormData();

    formData.append("discapacidad", discapacidad);
    formData.append("nombre", nombreAlumno);
    formData.append("apellido", apellidoAlumno);
    formData.append("image", file);
    formData.append("curso", idCurso);
    try {
      const response = await insertAlumnoCurso(formData);
      if (response.error) {
        setNotification(response.error);
      }
      setNotification("Alumno agregado exitosamente");
      setPreview(null);
      setIsOpenAgregar(false);
    } catch (error) {
      console.log(error);
      setNotification("Error al agregar alumno");
    }
  };

  useEffect(() => {
    dataCursos(id);
  }, [id]);

  useEffect(() => {
    if (notification) {
      Swal.fire({
        title: notification,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }, [notification]);

  return (
    <div className="misCursos">
      <h2>Cursos asignados</h2>
      <div className="containerCursosDocente">
        {misCursos.map((curso) => (
          <div className="cursoCard" key={curso.id}>
            <h2>{curso.nombre}</h2>
            <p>{curso.descripcion}</p>
            <div className="botonesCurso">
              <button onClick={() => setIsOpenDetalles(true)}>
                Ver detalles
              </button>
              <button onClick={() => handleAgregarAlumno(curso.id)}>
                Agregar alumnos
              </button>
              <button onClick={() => handleAsistencia(curso.nombre, curso.id)}>
                Asistencia
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* modal agregar alumnos */}
      <Modal
        isOpen={isOpenAgregar}
        onClose={() => {
          handleCloseAgregar();
        }}
        title="Agregar alumnos"
        className="modalAgregarAlumnos"
      >
        <form action="" className="agregarEstudiante">
          <div className="informacionEstudiante">
            <div className="form-class">
              <label htmlFor="">Ingresa el nombre del alumno</label>
              <input
                type="text"
                placeholder="Ingresa el nombre"
                required
                onChange={(e) => setNombreAlumno(e.target.value)}
              />
            </div>
            <div className="form-class">
              <label htmlFor="">Ingresa el apellido del alumno</label>
              <input
                type="text"
                placeholder="Ingresa el apellido"
                required
                onChange={(e) => setApellidoAlumno(e.target.value)}
              />
            </div>
            <div className="form-class">
              <label htmlFor="discapacidad">
                Seleccione la discapacidad:
              </label>
              <select
                id="discapacidad"
                name="discapacidad"
                required
                onChange={(e) => setDiscapacidad(e.target.value)}
              >
                <option value="">Elige una discapacidad</option>
                <option value="TDAH">TDAH</option>
                <option value="Trisomia 21">Trisomia 21</option>
              </select>
            </div>
          </div>
          <div className="imagenEstudiante">
            <label htmlFor="imagen">Selecciona una imagen:</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              required
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="previewImage">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="imagenPreview"
                />
              ) : (
                <p>No se ha seleccionado ninguna imagen.</p>
              )}
            </div>
          </div>
          <button
            type="button"
            className="botonAgregar"
            onClick={()=>hanldleSubmit()}
          >
            Agregar
          </button>
        </form>
      </Modal>

      {/* modal asistencia */}
       <ModalAsistencia
        isOpen={isOpenAsistencia}
        onClose={() => setIsOpenAsistencia(false)}
        nombreCurso={nombreCurso}
        alumnos={alumnos}
        idCurso={idCurso}
      />

      {/* modal detalles del curso */}
      <Modal
        isOpen={isOpenDetalles}
        onClose={() => {
          setIsOpenDetalles(false);
        }}
        title="Ver detalles"
      >
        <div className="containerDetallesCurso">
          <p>Detalles del curso</p>
          <div className="informacion">
            <p>nombre del curso</p>
            <p>descripcion del curso</p>
            <p>docente del curso</p>
            <p>grado del curso</p>
            <p>cantidad de alumnos</p>
            <p>promedio de notas</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
