
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
    <div className="formulario-pregunta-container" >
      <div className="formulario-left">
        <h3>Pregunta número {index + 1}</h3>
        <input
          type="text"
          placeholder="Ingresa tu pregunta aquí"
          value={pregunta.enunciado}
          onChange={handlePreguntaChange}
        />

        <ul className="alternativas-list">
          {pregunta.alternativas.map((alt, altIndex) => (
            <li>
              <input
                type="radio"
                name={`correcta-${index}`}
                checked={alt.es_correcta}
                onChange={(e) => handleAlternativeChange(altIndex, "es_correcta", e.target.checked)}
              />
              <input
                type="text"
                value={alt.texto}
                onChange={(e) => handleAlternativeChange(altIndex, "texto", e.target.value)}
                placeholder={`Alternativa ${altIndex + 1}`}
              />
              <button
                onClick={() => onRemoveAlternative(index, altIndex)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => onAddAlternative(index)}
        >
          + Agregar Alternativa
        </button>
      </div>

      <div className="formulario-right">
        <div className="imagen-box">
          Imagen (Opcional)
          <input type="file" accept="image/*" />
        </div>
      </div>
      <button
        onClick={() => onDelete(index)}
      >
        Eliminar Pregunta
      </button>
      <div ></div>
    </div>
  );
}
