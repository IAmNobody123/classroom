import { useEffect, useState } from "react";
import { listAllPlanesTrabajo } from "../../front-back/apiDirector";
import mammoth from "mammoth";
import Modal from "../../components/Modal";


export default function PlanTrabajoVer() {
  const [planes, setPlanes] = useState([]);
  const [search, setSearch] = useState(""); // Estado para el filtro de búsqueda
  const [cursoFiltro, setCursoFiltro] = useState(""); // Estado para el filtro de curso
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewType, setPreviewType] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const filteredPlanes = planes.filter((plan) => {
    const searchMatch = plan.titulo
      .toLowerCase()
      .includes(search.toLowerCase());
    const cursoMatch =
      cursoFiltro === "" || plan.curso === cursoFiltro;
    return searchMatch && cursoMatch;
  });

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
    const fetchPlanes = async () => {
      const data = await listAllPlanesTrabajo();
      setPlanes(data);
    };

    fetchPlanes();
  }, []);

  return (
    <div className="planes-page">
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
            {filteredPlanes.map((p) => (
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

      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={previewTitle || "Vista Previa"}
        >
          <div
          >
            {previewType === "pdf" ? (
              <iframe
                src={previewUrl}
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
