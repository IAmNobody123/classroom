import { useState, useEffect, useCallback } from "react";
import useAuth from "../../context/useAuth";
import {
  getListCursosDocente,
  uploadPlanTrabajo,
  listPlanesTrabajo,
} from "../../front-back/apiDocenteCursos";
import Modal from "../../components/Modal";
import "../../styles/docente/PlanTrabajo.css";
import mammoth from "mammoth";
import Toast from "../../components/Toast";

export default function PlanTrabajo() {
  const { user } = useAuth();
  const [planes, setPlanes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewType, setPreviewType] = useState(""); 
  const [previewTitle, setPreviewTitle] = useState("");

  // Form State
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const hoy = new Date().toISOString().split("T")[0];
  const [fecha, setFecha] = useState(hoy);
  const [cursoId, setCursoId] = useState("");
  const [archivo, setArchivo] = useState(null);

  //filtros
  const [search, setSearch] = useState("");
  const [cursoFiltro, setCursoFiltro] = useState("");

  // Refresh plans
  const listaPlanes = useCallback((userId) => {
    if (userId) {
      listPlanesTrabajo(userId).then((data) => setPlanes(data));
    }
  }, []);

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
      const result =await uploadPlanTrabajo(formData);
      if (result.error) {
        alert(result.error);
        return;
      }
      Toast("Guardado", "Plan de trabajo guardado", "success");
      setShowModal(false);
      setTitulo("");
      setDescripcion("");
      setArchivo(null);
      listaPlanes(user.id);
      return;
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  const handleViewPlan = async (plan) => {
    const url = plan.ruta_archivo;
    if (!url) return;

    const lowerUrl = url.toLowerCase();
    const isPdf = lowerUrl.endsWith(".pdf");
    const isDocx = lowerUrl.endsWith(".docx");

    setPreviewTitle(plan.titulo);

    if (isPdf) {
      setPreviewType("pdf");
      setPreviewUrl(url);
      setShowPreviewModal(true);
    } else if (isDocx) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setPreviewType("html");
        setPreviewHtml(result.value);
        setShowPreviewModal(true);
      } catch (error) {
        console.error("Error converting docx:", error);
        if (
          confirm(
            "No se pudo previsualizar el documento Word. ¿Desea descargarlo?",
          )
        ) {
          window.open(url, "_blank");
        }
      }
    } else {
      // Fallback
      if (
        confirm(
          "Este archivo no se puede previsualizar. ¿Desea descargarlo?",
        )
      ) {
        window.open(url, "_blank");
      }
    }
  };
  useEffect(() => {
    if (user && user.id) {
      getListCursosDocente(user.id).then((data) => setCursos(data));
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      listaPlanes(user.id);
    }
  }, [user?.id, listaPlanes]);

  const planesFiltrados = planes.filter((p) => {
    const coincideNombre = p.titulo
      .toLowerCase()
      .includes(search.toLowerCase());

    const coincideCurso = cursoFiltro
      ? p.curso === cursoFiltro
      : true;

    return coincideNombre && coincideCurso;
  });

  return (
    <div className="planes-page">
      <div className="top-buttons">
        <button
          className="menu-btn"
          onClick={() => setShowModal(false)}
        >
          Listado de planes de trabajo
        </button>
        <button
          className="menu-btn"
          onClick={() => setShowModal(true)}
        >
          Agregar plan de trabajo
        </button>
      </div>

      <div className="content-box">
        <h2 className="title">Listado de planes de trabajo</h2>
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={cursoFiltro}
            onChange={(e) => setCursoFiltro(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {[...new Set(planes.map((p) => p.curso))].map(
              (curso, index) => (
                <option key={index} value={curso}>
                  {curso}
                </option>
              ),
            )}
          </select>
        </div>
        <table className="plan-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Curso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {planesFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.titulo}</td>
                <td>
                  {p.fecha
                    ? new Date(p.fecha).toLocaleDateString()
                    : "Sin fecha"}
                </td>
                <td>{p.descripcion}</td>
                <td>{p.curso}</td>
                <td>
                  <button
                    onClick={() => handleViewPlan(p)}
                    className="btn-ver-material"
                  >
                    Ver Plan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={closePreviewModal}
          title="Agregar Plan de Trabajo"
        >
          <form className="formPlanTrabajo" onSubmit={handleSubmit}>
            <div>
              <label>Curso:</label>
              <select
                value={cursoId}
                onChange={(e) => setCursoId(e.target.value)}
                required
              >
                <option value="">Seleccione Curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Nombre del Material:</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Descripción:</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="3"
              />
            </div>
            <div>
              <label>Fecha:</label>
              <input
              readOnly
                type="date"
                value={fecha}
                onChange={(e) => setFecha(Date.parse(e.target.value))}
              />
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
            <button type="submit">Guardar Plan</button>
          </form>
        </Modal>
      )}

      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={previewTitle || "Vista Previa"}
          className="preview-modal"
        >
          <div>
            {previewType === "pdf" ? (
              <iframe
                src={previewUrl}
                style={{
                  width: "100%",
                  height: "100vh",
                  border: "none",
                }}
              ></iframe>
            ) : previewType === "html" ? (
              <div
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p>Formato no compatible para visualización.</p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
