import React, { useState, useEffect } from 'react';
import useAuth from "../../context/useAuth";
import {
  getListCursosDocente,
  uploadPlanTrabajo,
  listPlanesTrabajo
} from "../../front-back/apiDocenteCursos";
import Modal from "../../components/Modal";
import '../../styles/docente/PlanTrabajo.css';
import mammoth from "mammoth";

export default function PlanTrabajo() {
  const { user } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewType, setPreviewType] = useState(""); // 'pdf' or 'html'
  const [previewTitle, setPreviewTitle] = useState("");

  // Form State
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const hoy = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoy);
  const [cursoId, setCursoId] = useState("");
  const [archivo, setArchivo] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      getListCursosDocente(user.id).then(data => setCursos(data));
      listaPlanes(user.id);
    }
  }, [user]);

  // Refresh plans
  const listaPlanes = (userId) => {
    const uid = userId || user?.id;
    if (uid)
      listPlanesTrabajo(uid).then(data => setPlanes(data));
  };
  const closePreviewModal = () => {
    setShowModal(false);
    setTitulo("");
    setDescripcion("");
    setFecha("");
    setCursoId("");
    setArchivo(null);
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !cursoId || !archivo) {
      alert("Complete campos obligatorios");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("fecha", fecha);
    formData.append("curso_id", cursoId);
    formData.append("archivo", archivo);

    try {
      await uploadPlanTrabajo(formData);
      alert("Plan guardado exitosamente");
      setShowModal(false);
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      listaPlanes();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const handleViewPlan = async (plan) => {
    const url = plan.ruta_archivo;
    if (!url) return;

    const lowerUrl = url.toLowerCase();
    const isPdf = lowerUrl.endsWith('.pdf');
    const isDocx = lowerUrl.endsWith('.docx');

    setPreviewTitle(plan.titulo);

    if (isPdf) {
      setPreviewType('pdf');
      setPreviewUrl(url);
      setShowPreviewModal(true);
    } else if (isDocx) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setPreviewType('html');
        setPreviewHtml(result.value);
        setShowPreviewModal(true);
      } catch (error) {
        console.error("Error converting docx:", error);
        if (confirm("No se pudo previsualizar el documento Word. ¿Desea descargarlo?")) {
          window.open(url, '_blank');
        }
      }
    } else {
      // Fallback
      if (confirm("Este archivo no se puede previsualizar. ¿Desea descargarlo?")) {
        window.open(url, '_blank');
      }
    }
  };

  return (
    <div className="planes-page">
      <div className="top-buttons">
        <button className="menu-btn" onClick={() => setShowModal(false)}>Listado de planes de trabajo</button>
        <button className="menu-btn" onClick={() => setShowModal(true)}>Agregar plan de trabajo</button>
      </div>

      <div className="content-box">
        <h2 className="title">Listado de planes de trabajo</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

          {planes.length === 0 ? (
            <p>No hay planes cargados.</p>
          ) : (
            planes.map((p) => (
              <div className="plan-card" key={p.id}>
                <div className="plan-info">
                  <div className="plan-header">
                    <p className="plan-title">{p.titulo}</p>
                    <p className="plan-fecha">Fecha: {p.fecha ? new Date(p.fecha).toLocaleDateString() : 'Sin fecha'}</p>
                  </div>
                  <p className="plan-desc">{p.descripcion}</p>
                  <p className="plan-curso">Curso: {p.curso}</p>
                </div>
                <button
                  onClick={() => handleViewPlan(p)}
                  className="btn-ver-material"
                  style={{ textDecoration: 'none', textAlign: 'center', display: 'block', marginTop: '10px', width: '100%', background: '#007BFF', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '5px' }}
                >
                  Ver Plan
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <Modal isOpen={showModal} onClose={closePreviewModal} title="Agregar Plan de Trabajo">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label>Curso:</label>
              <select value={cursoId} onChange={(e) => setCursoId(e.target.value)} required style={{ width: '100%', padding: '8px' }}>
                <option value="">Seleccione Curso</option>
                {cursos.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Nombre del Material:</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Descripción:</label>
              <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ width: '100%', padding: '8px' }} rows="3" />
            </div>
            <div>
              <label>Fecha:</label>
              <input type="date" value={fecha} onChange={e => setFecha(Date.parse(e.target.value))} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div>
              <label>Documento (Word/PDF):</label>
              <input
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" style={{ background: "#28a745", color: "white", padding: "10px", border: "none", cursor: "pointer", borderRadius: "5px" }}>Guardar Plan</button>
          </form>
        </Modal>
      )}

      {showPreviewModal && (
        <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title={previewTitle || "Vista Previa"}>
          <div style={{ width: '100%', height: '500px', overflowY: 'auto', background: '#fff', padding: '10px', border: '1px solid #ddd' }}>
            {previewType === 'pdf' ? (
              <iframe src={previewUrl} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
            ) : previewType === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p>Formato no compatible para visualización.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
