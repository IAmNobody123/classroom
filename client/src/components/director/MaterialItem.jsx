import { useState } from "react";
import Modal from "../Modal";
import { getMaterialById } from "../../front-back/apiDocenteCursos";

export default function MaterialItem({ titulo, descripcion, fecha, curso, id }) {
  const [showModal, setShowModal] = useState(false);
  const [material, setMaterial] = useState(null);

  const handleModal = async () => {
    const res = await getMaterialById(id);
    setMaterial(res);
    setShowModal(!showModal);
  };
  return (
    <div className="material-item">
      <div className="material-info">
        <p><strong><em>{titulo}</em></strong></p>
        <p><em>{descripcion}</em></p>
      </div>
      <div className="material-meta">
        <p><strong>Fecha:</strong> {fecha}</p>
        <p><strong>Curso:</strong> {curso}</p>
      </div>
      <div className="material-button">
        <button onClick={handleModal}>Ver material</button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={handleModal}
        title={titulo}
      >
        {/* CONTENIDO DEL MODAL */}
        <iframe
          src={``}
          title={titulo}
          width="100%"
          height="500px"
          style={{ border: "none" }}
        />
      </Modal>
    </div>
  );
}
