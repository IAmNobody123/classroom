import { useState } from "react";
import Modal from "../Modal";
import { getMaterialById } from "../../front-back/apiDocenteCursos";

export default function MaterialItem({
  titulo,
  descripcion,
  fecha,
  curso,
  id,
}) {
  const [showModal, setShowModal] = useState(false);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = "http://localhost:5000/";

  const handleModal = async () => {
    if (!showModal) {
      setShowModal(true);
      setLoading(true);
      setMaterial(null);

      try {
        const res = await getMaterialById(id);
        setMaterial(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className="material-item">
      <div className="material-info">
        <p>
          <strong>
            <em>{titulo}</em>
          </strong>
        </p>
        <p>
          <em>{descripcion}</em>
        </p>
      </div>
      <div className="material-meta">
        <p>
          <strong>Fecha:</strong> {fecha}
        </p>
        <p>
          <strong>Curso:</strong> {curso}
        </p>
      </div>
      <div className="material-button">
        <button onClick={handleModal}>Ver material</button>
      </div>
      <Modal isOpen={showModal} onClose={handleModal} title={titulo}>
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Cargando material...</p>
          </div>
        ) : material ? (
          <iframe
            src={`${BACKEND_URL}${material.pdf}`}
            title={titulo}
            width="100%"
            height="500px"
            style={{ border: "none" }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
