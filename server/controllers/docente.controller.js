const pool = require("../db/database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const listCursosDocente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id as id, c.nombre as nombre, c.descripcion as descripcion, c.grado as grado 
    FROM clases c inner join docentes d on c.docente_id = d.id
    inner join usuarios u on d.usuario_id = u.id
    where u.id = $1`,
      [id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const insertAlumnoCurso = async (req, res) => {
  try {
    const { discapacidad, nombre, apellido, curso } = req.body;
    let imagen = null;

    // Asegurar que la carpeta exista
    const dir = "uploads/img/alumnosCursos";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const sanitizedNombre = nombre.trim().replace(/\s+/g, "_");
      const sanitizedApellido = apellido.trim().replace(/\s+/g, "_");
      const newFileName = `${sanitizedNombre}_${sanitizedApellido}_${curso}${ext}`;
      const newPath = path.join(dir, newFileName);

      // Renombrar archivo
      fs.renameSync(req.file.path, newPath);

      imagen = newFileName;
    }

    const result = await pool.query(
      `INSERT INTO alumnos (nombre, apellido, discapacidad, imagenalumno, clase_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, discapacidad, imagen, curso]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al insertar alumno:", error);
    res.status(500).json({ error: "Error al insertar alumno" });
  }
};

const listAlumnosCursos = async (req, res) => {
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:5000";
  const { id } = req.params;
  try {
    const result = await pool.query(
      `select a.id,a.nombre as nombre, apellido, discapacidad, imagenalumno
      from alumnos a inner join clases c on a.clase_id = c.id
      where a.clase_id = $1`,
      [id]
    );

    const resultImage = result.rows.map((alumno) => ({
      ...alumno,
      imagenUrl: `${BACKEND_URL}/uploads/img/alumnosCursos/${alumno.imagenalumno}`,
    }));

    res.status(200).json(resultImage);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const marcarAsistencia = async (req, res) => {
  const { idCurso, alumnoId, estadoAsistencia } = req.body;
  try {
    const result = await pool.query(
      `insert into asistencias ( alumno_id, clase_id, fecha, presente,hora_registro) 
      values ($1, $2, $3, $4, $5) RETURNING *`,
      [
        alumnoId,
        idCurso,
        new Date(),
        estadoAsistencia,
        new Date().toISOString(),
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// const materialCurso = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ error: "No se envió ningún archivo" });
//     }

//     const { curso, nombre, idDocente, gradoCurso } =
//       req.body;

//     const rutaArchivo = path.join(
//       "uploads",
//       "docs",
//       idDocente,
//       gradoCurso,
//       req.file.filename
//     );

//     const idDocenteLimpio = await pool.query(
//       `select id from docentes where usuario_id = $1`,
//       [idDocente]
//     );
//     idDocente = idDocenteLimpio.rows[0].id;

//     const result = await pool.query(
//       `INSERT INTO documentos (titulo, ruta_archivo, fecha_subida, docente_id, grado, curso_id)
//        VALUES ($1, $2, now(),$3, $4, $5)
//        RETURNING *`,
//       [nombre,rutaArchivo, idDocente, gradoCurso, curso ]
//     );

//     res
//       .status(200)
//       .json({
//         message: "Material agregado exitosamente",
//         data: result.rows[0],
//       });
//   } catch (error) {
//     console.error("Error al subir material:", error);
//     res.status(500).json({ error: "Error en el servidor" });
//   }
// };

const materialCurso = async (req, res) => {
  try {
    const { curso, nombre, idDocente, gradoCurso } = req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se envió ningún archivo" });
    }
    if (!curso || !nombre || !idDocente || !gradoCurso) {
      return res
        .status(400)
        .json({ error: "Faltan datos en la solicitud" });
    }
    const idDocenteLimpio = await pool.query(
      `select id from docentes where usuario_id = $1`,
      [idDocente]
    );
    const idDocenteReal = idDocenteLimpio.rows[0].id;

    // Crear carpeta destino final
    const dir = path.join(
      "uploads",
      "docs",
      idDocenteReal.toString(),
      gradoCurso.toString()
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Mover archivo desde temp
    const tempPath = req.file.path;
    const newPath = path.join(dir, req.file.filename);
    fs.renameSync(tempPath, newPath);

    // Guardar registro en la base de datos
    const result = await pool.query(
      `INSERT INTO documentos (titulo, ruta_archivo, fecha_subida, docente_id, grado, curso_id)
       VALUES ($1, $2, NOW(), $3, $4, $5)
       RETURNING *`,
      [nombre, newPath, idDocenteReal, gradoCurso, curso]
    );

    res.status(201).json({
      message: "Material agregado exitosamente",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al subir material:", error);
    res.status(500).json({ error: "Error al subir material" });
  }
};

const listadoMaterialCurso = async (req, res) => {
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:5000";
  try {
    const result = await pool.query(`
    select d.titulo as titulo, d.ruta_archivo as ruta, d.fecha_subida as subido,
c.nombre, c.grado
from documentos d inner join clases c on d.curso_id = c.id`);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const materialPorCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
    select d.titulo as titulo, d.ruta_archivo as ruta, d.fecha_subida as subido,
    c.nombre, c.grado
    from documentos d inner join clases c on d.curso_id = c.id where c.id = $1`,
      [id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  listCursosDocente,
  insertAlumnoCurso,
  listAlumnosCursos,
  marcarAsistencia,
  materialCurso,
  listadoMaterialCurso,
  materialPorCurso,
};
