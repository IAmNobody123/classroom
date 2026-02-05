const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth.routes');

app.use('/uploads/img/perfil', express.static(path.join(__dirname, 'uploads/img/perfil')));
app.use('/uploads/img/alumnosCursos', express.static(path.join(__dirname, 'uploads/img/alumnosCursos')));
app.use('/uploads/docs', express.static(path.join(__dirname, 'uploads/docs')));
app.use('/uploads/docs/temp', express.static(path.join(__dirname, 'uploads/docs/temp')));
app.use('/api', authRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// ******* * ** * * ver la forma de insertar esto en docente.controller


// import express from "express";
// import multer from "multer";
// import path from "path";
// import { convertirWordAPdf } from "./utils/convertToPdf.js";

// const app = express();
// const upload = multer({ dest: "uploads/material/" });

// app.post("/subir-material", upload.single("archivo"), async (req, res) => {
//   try {
//     let rutaArchivo = path.join(process.cwd(), req.file.path); // ruta absoluta
//     const ext = path.extname(req.file.originalname).toLowerCase();

//     // Si es Word, convertir a PDF
//     if (ext === ".doc" || ext === ".docx") {
//       rutaArchivo = await convertirWordAPdf(rutaArchivo);
//     }

//     // Guardar ruta en BD (opcional)
//     // await pool.query("INSERT INTO documentos (titulo, ruta_archivo) VALUES ($1, $2)", [req.body.titulo, rutaArchivo]);

//     res.json({
//       ok: true,
//       ruta: rutaArchivo.replace(process.cwd(), ""), // ruta relativa para frontend
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error al subir y convertir archivo" });
//   }
// });