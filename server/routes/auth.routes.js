const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const {
  login,
  validateToken,
  register,
} = require("../controllers/auth.controller");
const {
  registerUsers,
  listUsers,
} = require("../controllers/register.controller");
const {
  getListDocentes,
  getListCursos,
  insertCurso,
} = require("../controllers/director.controller");
// docente
const {
  listCursosDocente,
  insertAlumnoCurso,
  listAlumnosCursos,
  marcarAsistencia,
  materialCurso,
  listadoMaterialCurso,
  materialPorCurso,
} = require("../controllers/docente.controller");

// imagenes de docentes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img/perfil");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

// imagenes de alumnos
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/img/alumnosCursos");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
const upload2 = multer({ storage: storage2 });

// middleware para subir material de trabajo

const storageMaterial = multer.diskStorage({
  destination: (req, file, cb) =>{
    // const {idDocente,gradoCurso} = req.body;
    // console.log(idDocente,gradoCurso);
    // const dir = path.join("uploads", "docs", `${idDocente}`, `${gradoCurso}`);
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir, { recursive: true });
    // }

    // cb(null, dir);
    cb(null, "uploads/docs/temp");
    if(!fs.existsSync("uploads/docs/temp")){
      fs.mkdirSync("uploads/docs/temp", { recursive: true });
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(ext, "")
      .trim()
      .replace(/\s+/g, "_"); // reemplaza espacios por _
    cb(null, `${sanitizedName}_${timestamp}${ext}`);
  },
})
const uploadMaterial = multer({ storage: storageMaterial });

router.post("/login", login);
router.post("/register", register);
router.get("/validateToken", validateToken);

router.post("/registerUsers", upload.single("image"), registerUsers);
router.get("/listUsers", listUsers);

// director
router.get("/listDocentes", getListDocentes);
router.get("/listCursos", getListCursos);
router.post("/insertCurso", insertCurso);

// docentes
router.get("/listCursosDocente/:id", listCursosDocente);
router.post(
  "/insertAlumnoCursos",
  upload2.single("image"),
  insertAlumnoCurso
);
router.get("/listAlumnosCursos/:id", listAlumnosCursos);
router.post("/marcarAsistencia", marcarAsistencia);
router.post("/materialCurso", uploadMaterial.single("material"), materialCurso);
router.get("/listadoMaterialCurso", listadoMaterialCurso);
router.get("/materialPorCurso/:id", materialPorCurso);

module.exports = router;
