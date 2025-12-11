import { useEffect, useState } from "react";
import "../../styles/director/gestionUsuarios.css";
import Modal from "../../components/Modal";
import { getListUsers, registerUser } from "../../front-back/apiDirector";
import Swal from "sweetalert2";
import Table from "../../components/Table";

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
  const [users, setUsers] = useState([]); 
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
      getDataUsers(); // Actualiza la lista de usuarios después de agregar uno nuevo
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

  const columns = ["id", "nombre", "correo","opciones"];

  const getDataUsers = async () => {
    const result = await getListUsers();
    setUsers(result);
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
                <button className="buttonModal" type="submit">
                  Crear
                </button>
              </div>
            </div>

            <div className="boxImg">
              <div className="boxImage">
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Mostrar preview si hay imagen */}
              {data.imagenPreview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={data.imagenPreview}
                    alt="Vista previa"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </Modal>
      </div>
      
      <Table columns={columns} data={users} />

    </div>
  );
}

export default GestionUsuarios;
