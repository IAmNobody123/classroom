import { useEffect, useState } from "react";
import { materialPorCurso } from "../../front-back/apiDocenteCursos";
import Modal from "../Modal";
import FormularioPreguntas from "./FormularioPreguntas";

export default function ListaMateriales({ idCurso }) {
  const [materiales, setMateriales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [preguntas, setPreguntas] = useState([
    {
      enunciado: "",
      imagen_url: "",
      alternativas: [
        { texto: "", es_correcta: false },
        { texto: "", es_correcta: false }
      ]
    }
  ]);

  useEffect(() => {
    const response = materialPorCurso(idCurso);
    response.then((data) => {
      setMateriales(data);
    });
  }, [idCurso]);

  const handleOpenModal = (materialId, tituloMaterial) => {
    setCurrentMaterialId(materialId);
    setFormTitle(`Examen: ${tituloMaterial}`);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      {
        enunciado: "",
        imagen_url: "",
        alternativas: [{ texto: "", es_correcta: false }]
      }
    ]);
  };

  const handlePreguntaChange = (index, field, value) => {
    const newPreguntas = [...preguntas];
    if (field === "alternativa") {
      const { altIndex, field: altField, value: altValue } = value;
      newPreguntas[index].alternativas[altIndex][altField] = altValue;
      // Si se marca como correcta, desmarcar las otras (opcional, si es single choice)
      if (altField === 'es_correcta' && altValue === true) {
        newPreguntas[index].alternativas.forEach((a, i) => {
          if (i !== altIndex) a.es_correcta = false;
        });
      }
    } else {
      newPreguntas[index][field] = value;
    }
    setPreguntas(newPreguntas);
  };

  const handleDeletePregunta = (index) => {
    const newPreguntas = preguntas.filter((_, i) => i !== index);
    setPreguntas(newPreguntas);
  };

  const handleAddAlternative = (qIndex) => {
    const newPreguntas = [...preguntas];
    newPreguntas[qIndex].alternativas.push({ texto: "", es_correcta: false });
    setPreguntas(newPreguntas);
  };

  const handleRemoveAlternative = (qIndex, altIndex) => {
    const newPreguntas = [...preguntas];
    newPreguntas[qIndex].alternativas = newPreguntas[qIndex].alternativas.filter((_, i) => i !== altIndex);
    setPreguntas(newPreguntas);
  }

  const handleSaveForm = async () => {
    if (!currentMaterialId) return;

    const payload = {
      documento_id: currentMaterialId,
      titulo: formTitle,
      preguntas: preguntas
    };
    try {
      // Asumiendo que existe una variable de entorno o URL base
      const BACKEND_URL = "http://localhost:5000";
      const response = await fetch(`${BACKEND_URL}/api/createFormulario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Formulario guardado exitosamente");
        setShowModal(false);
        setPreguntas([{ enunciado: "", alternativas: [] }]); // Reset
      } else {
        alert("Error al guardar formulario");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="lista-materiales">
      {materiales ? (
        materiales.map((m, i) => (
          <div className="material-item" key={i}>
            <div>
              <p className="material-title">{m.titulo}</p>
              <p className="material-curso">Curso: {m.curso}</p>
            </div>
            {console.log("objeto ", m)}
            <button className="btn-agregar" onClick={() => handleOpenModal(m.id, m.titulo)}>
              Crear formulario
            </button>
          </div>
        ))
      ) : (
        <p>No hay materiales</p>
      )}

      <Modal isOpen={showModal} onClose={handleCloseModal} title={formTitle || "Crear Formulario"}>
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}>
          {preguntas.map((p, i) => (
            <FormularioPreguntas
              key={i}
              index={i}
              pregunta={p}
              onChange={handlePreguntaChange}
              onDelete={handleDeletePregunta}
              onAddAlternative={handleAddAlternative}
              onRemoveAlternative={handleRemoveAlternative}
            />
          ))}
          <button
            className="btn-nueva-pregunta"
            onClick={agregarPregunta}
            style={{ marginTop: "20px", width: "100%" }}
          >
            Nueva pregunta
          </button>
          <button
            className="btn-guardar"
            onClick={handleSaveForm}
            style={{ marginTop: "10px", width: "100%", background: "green", color: "white", padding: "10px", border: "none" }}
          >
            Guardar Formulario
          </button>
        </div>
      </Modal>
    </div>
  );
}
