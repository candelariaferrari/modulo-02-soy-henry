const { log } = require("console");
const { Router } = require("express"); // Router permite definir rutas en archivos separados y luego conectarlas al app principal
const fs = require("fs"); // Para leer y escribir el archivo JSON
const path = require("path"); // Para construir rutas de archivos de forma segura
//const { validarTarea } = require("../middlewares/validar-tarea");

const router = Router(); // Creamos el enrutador — es como un "mini express" solo para las rutas de tareas

// Ruta absoluta al archivo donde están guardadas las tareas
// __dirname = carpeta actual (src/ o routes/), luego subimos y entramos a data/
const RUTA_DATOS = path.join(__dirname, "../data/data-peliculas.json");


function leerPeliculas() {
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8"); // Leemos el archivo como texto
  return JSON.parse(contenido); // Convertimos el texto JSON en array de objetos
}

function guardarPeliculas(pelicula) {
  fs.writeFileSync(RUTA_DATOS, JSON.stringify(pelicula, null, 2));
}

router.get("/", (req, res) => {
  let peliculas = leerPeliculas();



  res.status(200).json({
    total: peliculas.length, 
    peliculas,
  });
});

module.exports = router;