import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import Modal from "../../components/Modal";
import { materialPorCurso, getFormularioByDocumento, submitExamen } from "../../front-back/apiDocenteCursos";
import "../../styles/docente/formularPreguntas.css";

export default function MaterialesAlumno() {
    const { cursoId } = useParams();
    const { user } = useAuth();
    const [materiales, setMateriales] = useState([]);
    const [showExamModal, setShowExamModal] = useState(false);
    const [currentForm, setCurrentForm] = useState(null);
    const [currentMaterialTitle, setCurrentMaterialTitle] = useState("");
    const [respuestas, setRespuestas] = useState({}); // { preguntaId: alternativaId }

    useEffect(() => {
        if (cursoId) {
            materialPorCurso(cursoId).then(data => setMateriales(data));
        }
    }, [cursoId]);

    const handleOpenExam = async (materialId, title) => {
        try {
            const form = await getFormularioByDocumento(materialId);
            if (form && form.id) {
                if (form.preguntas && form.preguntas.length > 0) {
                    setCurrentForm(form);
                    setCurrentMaterialTitle(title);
                    setRespuestas({});
                    setShowExamModal(true);
                } else {
                    alert("El examen no tiene preguntas cargadas.");
                }
            } else {
                alert("Este material no tiene examen.");
            }
        } catch (e) {
            console.error(e);
            alert("Error al cargar examen o no existe.");
        }
    };

    const handleOptionChange = (preguntaId, alternativaId) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: alternativaId
        }));
    };

    const handleSubmitExam = async () => {
        if (!currentForm) return;

        // Validation: Answer all questions?
        if (Object.keys(respuestas).length < currentForm.preguntas.length) {
            if (!window.confirm("No has respondido todas las preguntas. ¿Estás seguro de enviar?")) {
                return;
            }
        }

        const payload = {
            alumno_id: user.id, // Assuming user.id is valid logic per our backend findings
            formulario_id: currentForm.id,
            respuestas: Object.keys(respuestas).map(pId => ({
                pregunta_id: parseInt(pId),
                alternativa_id: respuestas[pId]
            }))
        };

        try {
            const result = await submitExamen(payload);
            if (result && result.nota !== undefined) {
                alert(`Examen enviado. Tu nota es: ${result.nota}`);
                setShowExamModal(false);
                setCurrentForm(null);
            } else {
                alert("Error al enviar el examen.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="materiales-alumno-page" style={{ padding: "20px" }}>
            <h1>Materiales del Curso</h1>
            <div className="lista-materiales">
                {materiales.length > 0 ? (
                    materiales.map((m, i) => (
                        <div className="material-item" key={i} style={{ display: "flex", justifyContent: "space-between", padding: "15px", borderBottom: "1px solid #eee" }}>
                            <div>
                                <p className="material-title" style={{ fontWeight: "bold" }}>{m.titulo}</p>
                                <p className="material-curso">Subido: {new Date(m.subido).toLocaleDateString()}</p>
                            </div>
                            <button
                                className="btn-responder"
                                onClick={() => handleOpenExam(m.id, m.titulo)}
                                style={{ background: "#28a745", color: "white", border: "none", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}
                            >
                                Responder Examen
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No hay materiales.</p>
                )}
            </div>

            {showExamModal && currentForm && (
                <Modal isOpen={showExamModal} onClose={() => setShowExamModal(false)} title={`Examen: ${currentMaterialTitle}`}>
                    <div className="exam-container">
                        {currentForm.preguntas.map((p, index) => (
                            <div key={p.id} className="pregunta-block" style={{ marginBottom: "20px" }}>
                                <p style={{ fontWeight: "bold" }}>{index + 1}. {p.enunciado}</p>
                                {p.imagen_url && <img src={p.imagen_url} alt="Pregunta" style={{ maxWidth: "100%", maxHeight: "200px" }} />}
                                <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                                    {p.alternativas.map((alt) => (
                                        <li key={alt.id} style={{ margin: "5px 0" }}>
                                            <label style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                                <input
                                                    type="radio"
                                                    name={`pregunta_${p.id}`}
                                                    value={alt.id}
                                                    checked={respuestas[p.id] === alt.id}
                                                    onChange={() => handleOptionChange(p.id, alt.id)}
                                                    style={{ marginRight: "10px" }}
                                                />
                                                {alt.texto}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <button
                            onClick={handleSubmitExam}
                            style={{ background: "#007bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginTop: "10px", width: "100%" }}
                        >
                            Enviar Examen
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
