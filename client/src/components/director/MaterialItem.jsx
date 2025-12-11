export default function MaterialItem({ titulo, descripcion, fecha, curso }) {
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
        <button>Ver material</button>
      </div>
    </div>
  );
}
