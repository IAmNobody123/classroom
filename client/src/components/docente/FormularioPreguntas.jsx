
// Este componente ahora es controlado por ListaMateriales
export default function FormularioPreguntas({ pregunta, index, onChange, onDelete, onAddAlternative, onRemoveAlternative }) {

  const handlePreguntaChange = (e) => {
    onChange(index, "enunciado", e.target.value);
  };

  const handleAlternativeChange = (altIndex, field, value) => {
    // field puede ser 'texto' o 'es_correcta'
    onChange(index, "alternativa", { altIndex, field, value });
  };

  return (
    <div className="formulario-pregunta-container" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px" }}>
      <div className="formulario-left">
        <h3>Pregunta número {index + 1}</h3>
        <input
          type="text"
          placeholder="Ingresa tu pregunta aquí"
          value={pregunta.enunciado}
          onChange={handlePreguntaChange}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <ul className="alternativas-list">
          {pregunta.alternativas.map((alt, altIndex) => (
            <li key={altIndex} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <input
                type="radio"
                name={`correcta-${index}`}
                checked={alt.es_correcta}
                onChange={(e) => handleAlternativeChange(altIndex, "es_correcta", e.target.checked)}
                style={{ marginRight: "10px" }}
              />
              <input
                type="text"
                value={alt.texto}
                onChange={(e) => handleAlternativeChange(altIndex, "texto", e.target.value)}
                placeholder={`Alternativa ${altIndex + 1}`}
                style={{ flex: 1, padding: "5px" }}
              />
              <button
                onClick={() => onRemoveAlternative(index, altIndex)}
                style={{ marginLeft: "10px", background: "red", color: "white", border: "none", cursor: "pointer" }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onAddAlternative(index)}
          style={{ fontSize: "12px", background: "#f0f0f0", border: "1px solid #ccc", padding: "5px" }}
        >
          + Agregar Alternativa
        </button>
      </div>

      <div className="formulario-right">
        <div className="imagen-box">
          {/* Placeholder para imagen */}
          Imagen (Opcional)
          <input type="file" style={{ marginTop: "10px" }} accept="image/*" />
        </div>
      </div>
      <button
        onClick={() => onDelete(index)}
        style={{ marginTop: "10px", background: "darkred", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", float: "right" }}
      >
        Eliminar Pregunta
      </button>
      <div style={{ clear: "both" }}></div>
    </div>
  );
}
