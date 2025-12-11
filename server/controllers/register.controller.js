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
    }
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const listUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM docentes");
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  registerUsers,
  listUsers,
};
