
export default function FormularioPreguntas({ numero }) {
  return (
    <div className="formulario-pregunta-container">
      <div className="formulario-left">
        <h3>Pregunta número {numero}</h3>
        <p><b>(Ingresa tu pregunta aquí)</b></p>

        <ul className="alternativas-list">
          <li>Agrega tus alternativas aquí</li>
          <li>Agrega tus alternativas aquí</li>
          <li>Agrega tus alternativas aquí</li>
        </ul>
      </div>

      <div className="formulario-right">
        <div className="imagen-box">Agrega una imagen aquí</div>
      </div>
    </div>
  );
}
