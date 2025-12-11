const pool = require("../db/database");

const getListDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM docentes where estado = 'activo'"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
const getListCursos = async (req, res) => {
  try {
    const result =
      await pool.query(`select c.nombre as curso, c.descripcion as descripcion, d.nombre as docente ,grado 
from clases c inner join docentes d on c.docente_id = d.id`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const insertCurso = async (req, res) => {
  const { nombre, descripcion, docente, grado } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clases (nombre, descripcion, docente_id, grado) VALUES ($1, $2, $3,$4) RETURNING *",
      [nombre, descripcion, docente, grado]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getListDocentes,
  getListCursos,
  insertCurso,
};
