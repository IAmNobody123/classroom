import { useEffect, useState } from "react";
import "../../styles/director/gestionUsuarios.css";
import Modal from "../../components/Modal";
import {
  desactivarUser,
  getListUsers,
  registerUser,
} from "../../front-back/apiDirector";
import Swal from "sweetalert2";
import Table from "../../components/Table";
import Toast from "../../components/Toast";

function GestionUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alerta, setAlerta] = useState({ mensaje: "", error: false });
  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    rol: "director",
    imagen: null,
    imagenPreview: "",
  });
  const columns = ["nombre", "correo", "opciones"];
  const [users, setUsers] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("activo");

  useEffect(() => {
    if (alerta.mensaje) {
      Swal.fire({
        icon: alerta.error ? "error" : "success",
        title: alerta.mensaje,
      });
    }
  }, [alerta]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData((prev) => ({
        ...prev,
        imagen: file,
        imagenPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", data.nombre);
    formData.append("apellido", data.apellido);
    formData.append("correo", data.correo);
    formData.append("contrasena", data.contrasena);
    formData.append("rol", data.rol);

    if (data.imagen) {
      formData.append("image", data.imagen);
    }

    const response = await registerUser(formData);

    if (response.success) {
      getDataUsers();
      handleCerrarModal();
      setAlerta({
        mensaje: "Usuario creado exitosamente",
        error: false,
      });
    }
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setData({
      nombre: "",
      apellido: "",
      correo: "",
      contrasena: "",
      rol: "director",
      imagen: null,
      imagenPreview: "",
    });
  };

  const getDataUsers = async () => {
    const result = await getListUsers();
    setUsers(result);
  };

  const handleDesactivar = async (id) => {
    const response = await desactivarUser(id);
    if (response.success) {
      Toast(
        "Desactivado",
        "El usuario ha sido desactivado",
        "success",
      );
      getDataUsers();
    }
  };

  useEffect(() => {
    getDataUsers();
  }, []);

  return (
    <div className="containerGestion">
      <p className="titleGestion">Administracion de usuarios</p>
      <div className="containerbuttons">
        <div
          className="buttonGestion"
          onClick={() => setIsModalOpen(true)}
        >
          Crear Usuario
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => handleCerrarModal()}
          title="Crear usuario"
        >
          <form className="formModal" onSubmit={handleSubmit}>
            <div className="boxInformacion">
              <div className="inputsForm">
                <div className="formGroup boxName">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={data.nombre}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxLastName">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={data.apellido}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        apellido: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="formGroup boxEmail">
                  <label>Correo</label>
                  <input
                    type="email"
                    placeholder="Correo"
                    value={data.correo}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        correo: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="formGroup boxPassword">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={data.contrasena}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        contrasena: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="formGroup boxRol">
                  <label>Rol</label>
                  <select
                    value={data.rol}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        rol: e.target.value,
                      }))
                    }
                  >
                    <option value="director">Director</option>
                    <option value="docente">Docente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="boxImg">
              <div className="boxImage">
                {data.imagenPreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      className="previewImage"
                      src={data.imagenPreview}
                      alt="Vista previa"
                      style={{
                        maxWidth: "20rem",
                        maxHeight: "20rem",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <button className="buttonModal" type="submit">
                Crear
              </button>
            </div>
          </form>
        </Modal>
      </div>
      <div className="filtro-estado">
        <div
          onClick={() => setFiltroEstado("activo")}
          className="botonFiltro"
        >
          Activos
        </div>

        <div
          onClick={() => setFiltroEstado("inactivo")}
          className="botonFiltro"
        >
          Inactivos
        </div>

        <div
          onClick={() => setFiltroEstado("todos")}
          className="botonFiltro"
        >
          Todos
        </div>
      </div>
      <Table
        columns={columns}
        data={users.filter((user) => {
          if (filtroEstado === "todos") return true;
          return user.estado === filtroEstado;
        })}
        onDesactivar={handleDesactivar}
      />
    </div>
  );
}

export default GestionUsuarios;
