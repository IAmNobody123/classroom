const { exec } = require("child_process");
const path = require("path");

const LO_COMMAND = "soffice";
/**
 * Convierte un archivo Word (.doc o .docx) a PDF
 * @param {string} inputPath - ruta absoluta del archivo Word
 * @returns {Promise<string>} - ruta absoluta del PDF generado
 */
const convertirWordAPdf = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(inputPath); // misma carpeta de salida
    const command = `${LO_COMMAND} --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

    exec(command, (error) => {
      if (error) {
        console.error("Error al convertir a PDF:", error);
        reject(error);
      } else {
        // cambiar extensión a .pdf
        const pdfPath = inputPath.replace(/\.(docx?|DOCX?)$/, ".pdf");
        resolve(pdfPath);
      }
    });
  });
};

module.exports = convertirWordAPdf;
