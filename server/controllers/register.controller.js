const pool = require("../db/database");
const bcrypt = require("bcrypt");

const registerUsers = async (req, res) => {
  const { correo, contrasena, rol, nombre, apellido } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 8);

    const query = `INSERT INTO usuarios (username, password_hash, rol, imagen)
     VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await pool.query(query, [
      correo,
      hashedPassword,
      rol,
      image,
    ]);

    if (result.rows.length > 0 && rol === "docente") {
      const newUser = result.rows[0];
      const docenteQuery =
        "INSERT INTO docentes (usuario_id, nombre, correo) VALUES ($1, $2, $3)";
      await pool.query(docenteQuery, [
        newUser.id,
        nombre + " " + apellido,
        correo,
      ]);
      res.status(201).json({ success: true, user: newUser });
      return;
    }

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const listUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.nombre, d.correo, d.estado, u.imagen
      FROM docentes d 
      INNER JOIN usuarios u ON d.usuario_id = u.id
    `);

    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

    const usersWithImageUrl = result.rows.map((user) => ({
      ...user,
      imagen: user.imagen
        ? `${BACKEND_URL}/uploads/img/perfil/${user.imagen}`
        : null,
    }));

    res.status(200).json(usersWithImageUrl);

  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


module.exports = {
  registerUsers,
  listUsers,
};
