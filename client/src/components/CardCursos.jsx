import { useEffect, useState } from "react";
import Modal from "./Modal";
import Swal from "sweetalert2";
import { materialCurso } from "../front-back/apiDocenteCursos";

export default function CardCursos({
  id,
  nombreCurso,
  idDocente,
  grado,
  button,
  onMaterialAdded,
}) {
  const [isOpenAgregar, setIsOpenAgregar] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorNotifiacion, setErrorNotifiacion] = useState("");
  const [nombreMaterial, setNombreMaterial] = useState("");
  const [material, setMaterial] = useState(null);

  const validateForm = () => {
    if (!nombreMaterial || !material) {
      setErrorNotifiacion("Todos los campos son obligatorios");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombreMaterial);
    formData.append("archivo", material);
    formData.append("curso", id);
    formData.append("gradoCurso", grado);
    formData.append("idDocente", idDocente);

    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await materialCurso(formData);

    Swal.close();

    if (response.error) {
      setErrorNotifiacion(response.error);
      return;
    }

    setNotification("Material agregado exitosamente");
    setIsOpenAgregar(false);
    if (onMaterialAdded) {
      onMaterialAdded();
    }
  };

  const handleCerrar = () => {
    setIsOpenAgregar(false);
  };

  useEffect(() => {
    if (notification) {
      Swal.fire({
        title: notification,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setNotification("");
    }
  }, [notification]);
  useEffect(() => {
    if (errorNotifiacion) {
      Swal.fire({
        title: errorNotifiacion,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
      setErrorNotifiacion("");
    }
  }, [errorNotifiacion]);

  return (
    <div>
      <div className="cardCurso">
        <div className="tituloCurso">
          <p>{nombreCurso}</p>
        </div>
        <div className="gradoCurso">
          <p>{grado}</p>
        </div>
        <div className="botonCurso">
          <button className="boton-add-material" onClick={() => setIsOpenAgregar(true)}>
            {button}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpenAgregar}
        onClose={() => handleCerrar()}
        title="Agregar material"
      >
        <div className="containerSubirMaterial">
          <div className="form-class">
            <label for="material">Nombre del material:</label>
            <input
              required
              type="text"
              id="material"
              name="material"
              onChange={(e) => setNombreMaterial(e.target.value)}
            />
          </div>

          <div className="form-class">
            <label htmlFor="material">Seleccione el archivo:</label>
            <input
              type="file"
              id="material"
              name="material"
              onChange={(e) => setMaterial(e.target.files[0])}
            />
          </div>
          <button className="boton-add-material" onClick={() => handleSubmit()}>Agregar</button>
        </div>
      </Modal>
    </div>
  );
}
