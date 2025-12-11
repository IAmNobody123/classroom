
const Table= ({ columns, data }) => {
    
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
              <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  col === "opciones" ? (
                    <td key={colIndex}>
                      <button className="action-button">Ver detalles</button>
                      <button className="action-button">Eliminar</button>
                    </td>
                  ) : (
                    <td key={colIndex}>{row[col]}</td>
                  )
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
