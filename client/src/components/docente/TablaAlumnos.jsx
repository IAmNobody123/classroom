import Swal from "sweetalert2";
import { deleteAlumnoCurso } from "../../front-back/apiDocenteCursos";

export default function TablaAlumnos({ alumnos, setAlumnos }) {
  const handleEliminarAlumno = (alumnoId) => {
    const response = deleteAlumnoCurso(alumnoId);

    if (response) {
      Swal.fire({
        icon: "success",
        title: "Alumno eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
      setAlumnos((prev) =>
        prev.filter((alumno) => alumno.id !== alumnoId),
      );
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Discapacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{alumno.dni}</td>
              <td>{alumno.discapacidad}</td>
              <td>
                <button
                  onClick={() => handleEliminarAlumno(alumno.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
