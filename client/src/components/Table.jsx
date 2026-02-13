import { useState } from "react";
import Modal from "./Modal";

const Table = ({ columns, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [detalles, setDetalles] = useState({});

  const handleDetalles = (usuario) => {
    setDetalles(usuario);
    setIsOpen(true);
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center" }}
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) =>
                  col === "opciones" ? (
                    <td
                      className="opcionesAdminUsuario"
                      key={colIndex}
                    >
                      <button
                        className="action-button ver"
                        onClick={() => handleDetalles(row)}
                      >
                        Ver detalles
                      </button>
                      <button className="action-button eliminar">
                        Eliminar
                      </button>
                    </td>
                  ) : (
                    <td key={colIndex}>{row[col]}</td>
                  ),
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Detalles de ${detalles.nombre || ""}`}
        >
          <p>
            <strong>Nombre:</strong> {detalles.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {detalles.apellido}
          </p>
          <p>
            <strong>Correo:</strong> {detalles.correo}
          </p>
          <p>
            <strong>Rol:</strong> {detalles.rol}
          </p>

          {detalles.imagen && (
            <img
              src={detalles.imagen}
              alt="Usuario"
              style={{ width: "120px", borderRadius: "8px" }}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Table;
