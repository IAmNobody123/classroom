const pool = require("../db/database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { convertirWordAPdf } = require("./convertToPdf");

const listCursosDocente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT c.id as id, c.nombre as nombre, c.descripcion as descripcion, c.grado as grado 
    FROM clases c inner join docentes d on c.docente_id = d.id
    inner join usuarios u on d.usuario_id = u.id
    where u.id = $1`,
      [id],
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

      fs.renameSync(req.file.path, newPath);
      imagen = newFileName;
    }
    const result = await pool.query(
      `INSERT INTO alumnos (nombre, apellido, discapacidad, imagenalumno, clase_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, apellido, discapacidad, imagen, curso],
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
      [id],
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
      ],
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


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
      [idDocente],
    );
    const idDocenteReal = idDocenteLimpio.rows[0].id;

    const dir = path.join(
      "uploads",
      "docs",
      idDocenteReal.toString(),
      gradoCurso.toString(),
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempPath = req.file.path;
    const newPath = path.join(dir, req.file.filename);
    fs.renameSync(tempPath, newPath);

    // Guardar registro en la base de datos
    const result = await pool.query(
      `INSERT INTO documentos (titulo, ruta_archivo, fecha_subida, docente_id, grado, curso_id)
       VALUES ($1, $2, NOW(), $3, $4, $5)
       RETURNING *`,
      [nombre, newPath, idDocenteReal, gradoCurso, curso],
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
  const { id } = req.params;
  console.log(id);
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:5000";
  try {
    const result = await pool.query(
      `
      select d.id, d.titulo as titulo, d.fecha_subida as subido,
        c.nombre, c.grado, d.docente_id
        from documentos d 
		inner join clases c on d.curso_id = c.id
		inner join docentes de on de.id = d.docente_id
		inner join usuarios u on u.id = de.usuario_id
    where u.id = $1
      `,
      [id],
    );

    const data = result.rows.map((m) => ({
      id: m.id,
      titulo: m.titulo,
      subido: m.subido,
      nombre: m.nombre,
      grado: m.grado,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
///trabajando aqui -> enviar la url del pdf al frontend
const getMaterialById = async (req, res) => {
  const { id } = req.params;
  const BACKEND_URL =
    process.env.BACKEND_URL || "http://localhost:5000";
  try {
    const result = await pool.query(
      `select d.id, d.titulo as titulo, d.ruta_archivo as ruta, d.fecha_subida as subido,
      c.nombre, c.grado
      from documentos d inner join clases c on d.curso_id = c.id where d.id = $1`,
      [id],
    );
    const convert = convertirWordAPdf(
      BACKEND_URL + result.rows[0].ruta,
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(
      "Error al obtener material de curso del docente:",
      error,
    );
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const materialPorCurso = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
    select d.id, d.titulo as titulo, d.ruta_archivo as ruta, d.fecha_subida as subido,
    c.nombre, c.grado
    from documentos d inner join clases c on d.curso_id = c.id where c.id = $1`,
      [id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener cursos del docente:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const createFormulario = async (req, res) => {
  const { documento_id, titulo, preguntas } = req.body;

  if (
    !documento_id ||
    !titulo ||
    !preguntas ||
    preguntas.length === 0
  ) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // 1. Insertar Formulario
    const formResult = await client.query(
      `INSERT INTO formularios (titulo, documento_id, fecha_creacion) VALUES ($1, $2, $3) RETURNING id`,
      [titulo, documento_id, new Date()],
    );
    const formularioId = formResult.rows[0].id;

    // 2. Insertar Preguntas y Alternativas
    for (const p of preguntas) {
      const pregResult = await client.query(
        `INSERT INTO preguntas (formulario_id, enunciado, imagen_url) VALUES ($1, $2, $3) RETURNING id`,
        [formularioId, p.enunciado, p.imagen_url || null],
      );
      const preguntaId = pregResult.rows[0].id;

      for (const alt of p.alternativas) {
        await client.query(
          `INSERT INTO alternativas (pregunta_id, texto, es_correcta) VALUES ($1, $2, $3)`,
          [preguntaId, alt.texto, alt.es_correcta || false],
        );
      }
    }

    await client.query("COMMIT");
    res.status(201).json({
      message: "Formulario creado exitosamente",
      id: formularioId,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear formulario:", error);
    res.status(500).json({ error: "Error al crear formulario" });
  } finally {
    client.release();
  }
};

const listCursosAlumno = async (req, res) => {
  const { id } = req.params; // Usuario ID (from token)
  try {
    // Asumiendo que se ha agregado usuario_id a la tabla alumnos
    // Si no, esto fallará o requerirá que el ID sea el de 'alumnos' directamente.
    // Vamos a intentar buscar por usuario_id primero.

    // Primero obtenemos el alumno asociado al usuario
    const alumnoResult = await pool.query(
      `SELECT id, clase_id FROM alumnos WHERE usuario_id = $1`,
      [id],
    );

    if (alumnoResult.rows.length === 0) {
      // Fallback: Si no hay usuario_id en alumnos, tal vez el ID pasado sea el del alumno?
      // Pero el login devuelve el ID de usuario.
      // Asumiremos que el usuario ejecutó el SQL necesario.
      return res
        .status(404)
        .json({ message: "Alumno no encontrado para este usuario" });
    }

    const alumno = alumnoResult.rows[0];

    // Obtener la clase del alumno
    // Nota: Si un alumno solo puede estar en una clase (según schema), devolvemos esa.
    const cursosResult = await pool.query(
      `SELECT c.id, c.nombre, c.descripcion, c.grado, d.nombre as docente 
       FROM clases c 
       LEFT JOIN docentes d ON c.docente_id = d.id 
       WHERE c.id = $1`,
      [alumno.clase_id],
    );

    res.status(200).json(cursosResult.rows);
  } catch (error) {
    console.error("Error al obtener cursos del alumno:", error);
    res.status(500).json({ error: "Error en el servidor" }); // Fallback
  }
};

const submitExamen = async (req, res) => {
  const { alumno_id, formulario_id, respuestas } = req.body;
  // respuestas: [{ pregunta_id, alternativa_id }]

  try {
    // Calcular nota
    // 1. Obtener preguntas y correctas
    const preguntasResult = await pool.query(
      `SELECT p.id as pregunta_id, a.id as alternativa_id 
             FROM preguntas p 
             JOIN alternativas a ON a.pregunta_id = p.id 
             WHERE p.formulario_id = $1 AND a.es_correcta = true`,
      [formulario_id],
    );

    const correctasMap = new Map();
    preguntasResult.rows.forEach((row) => {
      correctasMap.set(row.pregunta_id, row.alternativa_id);
    });

    let correctCount = 0;
    let totalQuestions = correctasMap.size;

    if (totalQuestions === 0) {
      return res.status(400).json({
        error:
          "El formulario no tiene preguntas correctas configuradas.",
      });
    }

    respuestas.forEach((r) => {
      if (correctasMap.get(r.pregunta_id) === r.alternativa_id) {
        correctCount++;
      }
    });

    const calificacion = Math.round(
      (correctCount / totalQuestions) * 100,
    );

    // Guardar Nota
    // Verificar si ya existe
    const checkResult = await pool.query(
      `SELECT id FROM notas WHERE alumno_id = $1 AND formulario_id = $2`,
      [alumno_id, formulario_id],
    );

    if (checkResult.rows.length > 0) {
      await pool.query(
        `UPDATE notas SET calificacion = $1, fecha_registro = NOW() WHERE id = $2`,
        [calificacion, checkResult.rows[0].id],
      );
    } else {
      await pool.query(
        `INSERT INTO notas (alumno_id, formulario_id, calificacion, fecha_registro) VALUES ($1, $2, $3, NOW())`,
        [alumno_id, formulario_id, calificacion],
      );
    }

    res
      .status(200)
      .json({ message: "Examen enviado", nota: calificacion });
  } catch (error) {
    console.error("Error al enviar examen:", error);
    res.status(500).json({ error: "Error al procesar el examen" });
  }
};
const getFormularioByDocumento = async (req, res) => {
  const { id } = req.params;
  try {
    const formResult = await pool.query(
      `SELECT * FROM formularios WHERE documento_id = $1`,
      [id],
    );

    if (formResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No existe formulario para este material" });
    }

    const formulario = formResult.rows[0];

    // Obtener preguntas
    const preguntasResult = await pool.query(
      `SELECT * FROM preguntas WHERE formulario_id = $1 ORDER BY id`,
      [formulario.id],
    );

    const preguntas = preguntasResult.rows;

    for (const pregunta of preguntas) {
      const altResult = await pool.query(
        `SELECT id, texto FROM alternativas WHERE pregunta_id = $1 ORDER BY id`,
        [pregunta.id],
      );
      pregunta.alternativas = altResult.rows;
    }

    formulario.preguntas = preguntas;

    res.status(200).json(formulario);
  } catch (error) {
    console.error("Error al obtener formulario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const insertNota = async (req, res) => {
  const {
    alumno_id,
    formulario_id,
    calificacion,
    participaciones_voluntarias,
  } = req.body;

  try {
    // Verificar si ya existe nota para actualizar o insertar
    const checkNote = await pool.query(
      `SELECT id FROM notas WHERE alumno_id = $1 AND formulario_id = $2`,
      [alumno_id, formulario_id],
    );

    if (checkNote.rows.length > 0) {
      // Actualizar
      const result = await pool.query(
        `UPDATE notas SET calificacion = $1, participaciones_voluntarias = $2, fecha_registro = NOW() 
         WHERE id = $3 RETURNING *`,
        [
          calificacion,
          participaciones_voluntarias || 0,
          checkNote.rows[0].id,
        ],
      );
      return res.status(200).json(result.rows[0]);
    } else {
      // Insertar
      const result = await pool.query(
        `INSERT INTO notas (alumno_id, formulario_id, calificacion, participaciones_voluntarias, fecha_registro) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [
          alumno_id,
          formulario_id,
          calificacion,
          participaciones_voluntarias || 0,
        ],
      );
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error al guardar nota:", error);
    res.status(500).json({ error: "Error al guardar nota" });
  }
};

const getMaterialesPendientes = async (req, res) => {
  const { id } = req.params; // Curso ID
  try {
    const result = await pool.query(
      `SELECT d.id, d.titulo, d.fecha_subida as subido, f.id as formulario_id
       FROM documentos d
       JOIN formularios f ON f.documento_id = d.id
       WHERE d.curso_id = $1
       AND (
           SELECT COUNT(*) FROM alumnos a WHERE a.clase_id = d.curso_id
       ) > (
           SELECT COUNT(*) FROM notas n WHERE n.formulario_id = f.id
       )`,
      [id],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener materiales pendientes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getAlumnosSinNota = async (req, res) => {
  const { cursoId, formularioId } = req.body; // POST to allow body
  if (!cursoId || !formularioId)
    return res.status(400).json({ error: "Faltan parámetros" });

  try {
    const result = await pool.query(
      `SELECT a.id, a.nombre, a.apellido 
       FROM alumnos a 
       WHERE a.clase_id = $1
       AND a.id NOT IN (
           SELECT n.alumno_id FROM notas n WHERE n.formulario_id = $2
       )`,
      [cursoId, formularioId],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener alumnos sin nota:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


const uploadPlanTrabajo = async (req, res) => {
  try {
    const { titulo, descripcion, curso_id, fecha } = req.body;
    // fecha might be passed or we use current Date. User said "la fecha", could be manual.
    // metadata: nombre del material (titulo), descripcion, fecha, curso.

    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No se envió ningún archivo" });
    }

    // Move file
    const dir = "uploads/docs/planes";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const ext = path.extname(req.file.originalname);
    const newFileName = `Plan_${Date.now()}${ext}`;
    const newPath = path.join(dir, newFileName);
    fs.renameSync(req.file.path, newPath);

    const result = await pool.query(
      `INSERT INTO planes_trabajo (titulo, descripcion, ruta_archivo, fecha, curso_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, descripcion, newPath, fecha || new Date(), curso_id],
    );

    res.status(201).json({
      message: "Plan de trabajo guardado",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error al subir plan de trabajo:", error);
    res.status(500).json({ error: "Error al subir plan" });
  }
};

const listPlanesTrabajo = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await pool.query(
      `SELECT p.id, p.titulo, p.descripcion, p.fecha, p.ruta_archivo, c.nombre as curso
          FROM planes_trabajo p
          JOIN clases c ON p.curso_id = c.id
          JOIN docentes d ON c.docente_id = d.id
          WHERE d.usuario_id = $1`,
      [id],
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

const getFechasAsistencia = async (req, res) => {
  const { id } = req.params; // Curso ID
  try {
    const result = await pool.query(
      `SELECT DISTINCT DATE(fecha) as fecha FROM asistencias WHERE clase_id = $1 ORDER BY fecha DESC`,
      [id],
    );
    // Format to YYYY-MM-DD
    const fechas = result.rows.map(
      (r) => r.fecha.toISOString().split("T")[0],
    );
    res.status(200).json(fechas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener fechas" });
  }
};

const getAsistenciaFecha = async (req, res) => {
  const { cursoId, fecha } = req.body;
  try {
    const result = await pool.query(
      `SELECT a.nombre, a.apellido, asis.presente 
             FROM asistencias asis 
             JOIN alumnos a ON asis.alumno_id = a.id 
             WHERE asis.clase_id = $1 AND DATE(asis.fecha) = $2`,
      [cursoId, fecha],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener asistencia" });
  }
  try {
    const result = await pool.query(
      `SELECT a.nombre, a.apellido, asis.presente 
             FROM asistencias asis 
             JOIN alumnos a ON asis.alumno_id = a.id 
             WHERE asis.clase_id = $1 AND DATE(asis.fecha) = $2`,
      [cursoId, fecha],
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener asistencia" });
  }
};

const getDashboardStats = async (req, res) => {
  const { id } = req.params; // usuario_id
  try {
    // 1. Get Docente ID
    const docenteRes = await pool.query(
      "SELECT id FROM docentes WHERE usuario_id = $1",
      [id],
    );
    if (docenteRes.rows.length === 0) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }
    const docenteId = docenteRes.rows[0].id;

    // 2. Count Courses
    const cursosRes = await pool.query(
      "SELECT COUNT(*) FROM clases WHERE docente_id = $1",
      [docenteId],
    );
    const totalCursos = parseInt(cursosRes.rows[0].count);

    // 3. Count Students
    const alumnosRes = await pool.query(
      `SELECT COUNT(a.id) 
           FROM alumnos a 
           JOIN clases c ON a.clase_id = c.id 
           WHERE c.docente_id = $1`,
      [docenteId],
    );
    const totalAlumnos = parseInt(alumnosRes.rows[0].count);

    // 4. Clases Hoy (Classes with attendance taken today)
    const hoyRes = await pool.query(
      `SELECT COUNT(DISTINCT clase_id) 
       FROM asistencias 
       WHERE DATE(fecha) = CURRENT_DATE 
       AND clase_id IN (SELECT id FROM clases WHERE docente_id = $1)`,
      [docenteId],
    );
    const clasesHoy = parseInt(hoyRes.rows[0].count);

    // 5. Attendance Stats
    const attendanceRes = await pool.query(
      `SELECT c.nombre, 
              COALESCE(
                (COUNT(CASE WHEN a.presente = true THEN 1 END)::float / NULLIF(COUNT(a.id), 0)) * 100, 
                0
              ) as promedio
           FROM clases c
           LEFT JOIN asistencias a ON c.id = a.clase_id
           WHERE c.docente_id = $1
           GROUP BY c.id, c.nombre`,
      [docenteId],
    );

    // 6. Grades Stats
    const gradesRes = await pool.query(
      `SELECT c.nombre, 
              COALESCE(AVG(n.calificacion), 0) as promedio
           FROM clases c
           LEFT JOIN documentos d ON c.id = d.curso_id
           LEFT JOIN formularios f ON d.id = f.documento_id
           LEFT JOIN notas n ON f.id = n.formulario_id
           WHERE c.docente_id = $1
           GROUP BY c.id, c.nombre`,
      [docenteId],
    );

    const alumnosCountRes = await pool.query(
      `SELECT c.nombre as nombre, 
            COUNT(a.id) as alumnos
          FROM clases c
          LEFT JOIN alumnos a ON c.id = a.clase_id
          WHERE c.docente_id = $1
          GROUP BY c.id, c.nombre`,
      [docenteId],
    );

    res.status(200).json({
      cursos: totalCursos,
      alumnos: totalAlumnos,
      alumnosCount: alumnosCountRes.rows,
      clasesHoy: clasesHoy,
      asistencia: attendanceRes.rows,
      notas: gradesRes.rows,
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
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
  createFormulario,
  getFormularioByDocumento,
  insertNota,
  listCursosAlumno,
  submitExamen,
  getMaterialesPendientes,
  getAlumnosSinNota,
  uploadPlanTrabajo,
  listPlanesTrabajo,
  getFechasAsistencia,
  getAsistenciaFecha,
  getDashboardStats,
  getMaterialById,
};
