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
  const [urlVideo, setUrlVideo] = useState("");
  // const [urlJuego, setUrlJuego] = useState("");

  const juegosPorCurso = {
    matematica: [
      {
        nombre: "Juego de sumas",
        url: "https://arbolabc.com/juegos-de-sumas",
      },
      {
        nombre: "Juego de restas",
        url: "https://arbolabc.com/juegos-de-restas",
      },
      {
        nombre: "Figuras geométricas",
        url: "https://arbolabc.com/figuras-geometricas",
      },
    ],

    comunicacion: [
      {
        nombre: "Sílabas encantadas",
        url: "https://arbolabc.com/lectores-emergentes/silibas-encantadas",
      },
      {
        nombre: "Ordenar alfabeto",
        url: "https://arbolabc.com/juegos-del-abecedario/que-desorden-alfabeto",
      },
      {
        nombre: "Ordena letras",
        url: "https://www.cokitos.com/alfabeto-en-orden-ordena-las-letras-del-alfabeto/",
      },
      {
        nombre: "Mayúsculas y minúsculas",
        url: "https://www.cokitos.com/unir-letras-mayusculas-y-minusculas/play/",
      },
    ],

    "personal social": [
      {
        nombre: "Rutinas diarias",
        url: "https://www.cokitos.com/juego-de-rutinas-diarias/play/",
      },
      {
        nombre: "Miembros de la familia",
        url: "https://www.cokitos.com/miembros-familia/play/",
      },
      {
        nombre: "Tiempo y clima",
        url: "https://www.cokitos.com/tiempo-y-clima-empareja-con-la-imagen/play/",
      },
    ],

    "ciencia y ambiente": [
      {
        nombre: "Hábitat de animales",
        url: "https://www.cokitos.com/habitat-donde-viven-los-animales/play/",
      },
      {
        nombre: "Huesos del cuerpo",
        url: "https://www.juegosarcoiris.com/juegos/cuerpo/huesos",
      },
      {
        nombre: "Día o noche",
        url: "https://www.cokitos.com/dia-o-noche/play/",
      },
      {
        nombre: "Partes del cuerpo",
        url: "https://www.juegosarcoiris.com/juegos/cuerpo",
      },
    ],

    motricidad: [
      {
        nombre: "Rompecabezas",
        url: "https://arbolabc.com/rompecabezas-para-ni%C3%B1os",
      },
    ],
  };
  const nombreCursoNormalizado = nombreCurso
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const juegosCurso = juegosPorCurso[nombreCursoNormalizado] || [];

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
    formData.append("urlVideo", urlVideo);

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

    setMaterial(null);
    setIsOpenAgregar(false);
    setErrorNotifiacion("");
    setUrlVideo("");
    setNombreMaterial("");
  };
  const handleOpenModal = () => {
    console.log(nombreCursoNormalizado);
    setIsOpenAgregar(true);
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
          <button
            className="boton-add-material"
            onClick={() => handleOpenModal()}
          >
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
          <div className="form-class">
            <label>Seleccionar juego educativo (opcional):</label>

            <select
              onChange={(e) => setUrlVideo(e.target.value)}
              defaultValue=""
            >
              <option value="">Seleccione un juego</option>

              {juegosCurso.map((juego, index) => (
                <option key={index} value={juego.url}>
                  {juego.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            className="boton-add-material"
            onClick={() => handleSubmit()}
          >
            Agregar
          </button>
        </div>
      </Modal>
    </div>
  );
}
