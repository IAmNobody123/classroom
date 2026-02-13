const pool = require("../db/database");

const getListDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM docentes where estado = 'activo'",
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
      [nombre, descripcion, docente, grado],
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const dataDashboard = async (req, res) => {
  try {
    const alumnos = await pool.query(
      `select count(*) from alumnos 
      `,
    );
    const docentes = await pool.query(
      `select count(*) from docentes 
      `,
    );
    const cursos = await pool.query(
      `select count(*) from clases 
      `,
    );
    res.status(200).json({
      alumnos: alumnos.rows[0].count,
      docentes: docentes.rows[0].count,
      cursos: cursos.rows[0].count,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
const listAllPlanesTrabajo = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.titulo, p.descripcion, p.fecha, p.ruta_archivo, c.nombre as curso
          FROM planes_trabajo p
          JOIN clases c ON p.curso_id = c.id
          JOIN docentes d ON c.docente_id = d.id
          `,
    );

    const BACKEND_URL =
      process.env.BACKEND_URL || "http://localhost:5000";

    const planesWithUrl = result.rows.map((plan) => {
      const normalizedPath = plan.ruta_archivo.replace(/\\/g, "/");
      return {
        ...plan,
        ruta_archivo: `${BACKEND_URL}/${normalizedPath}`,
      };
    });

    res.status(200).json(planesWithUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al listar planes" });
  }
};

module.exports = {
  getListDocentes,
  getListCursos,
  insertCurso,
  dataDashboard,
  listAllPlanesTrabajo,
};
