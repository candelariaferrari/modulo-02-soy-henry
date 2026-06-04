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

//GET - LISTAR TODAS LAS PELICULAS 
router.get("/", (req, res) => {
  let peliculas = leerPeliculas()
  const { genre } = req.query  // extraemos el query param si viene
 console.log(` genero ${genre}`);
 
  if (genre) {
    // .toLowerCase() en los dos lados → así "Action", "action" y "ACTION" coinciden igual
    peliculas = peliculas.filter((peli) => peli.genre.toLowerCase() === genre.toLowerCase())
    //http://localhost:3500/peliculas?genre=Action
  }

  if (peliculas.length === 0) {
    return res.status(404).json({ error: `No se encontraron películas del género: ${genre}` })
  }

  res.status(200).json({
    total: peliculas.length,
    peliculas,
  })
})

//GET - MOVIED/:ID  pelicula por id 
router.get("/:id", (req, res) => {
  const id = Number(req.params.id); // req.params.id siempre llega como string, lo convertimos a número


  // Validamos que el ID sea un número válido (si pasaron letras, Number() devuelve NaN)
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID debe ser un numero valido" });
  }

  const peliculas = leerPeliculas();

  // .find() recorre el array y devuelve el primer elemento que cumpla la condición, o undefined si no encuentra
  pelicula = peliculas.find((peli) => peli.id === id);

  // Si no se encontró ninguna tarea con ese ID, devolvemos 404
  if (!pelicula) {
    return res
      .status(400)
      .json({ error: `No se encontro la pelicula con el ID ${id}` });
  }

  return res.status(200).json(pelicula); // Devolvemos la tarea encontrada
  console.log("ID PELICULA:" + id);
});
/*
//GET - MOVIED/:GENRE  pelicula por genero
router.get("/:genre", (req, res) => {
  const genre = req.params.genre
  console.log("GENERO PELICULA:" + genre)

  const peliculas = leerPeliculas()

  // filter() devuelve un array con TODAS las películas que coincidan con el género
  const peliculasFiltradas = peliculas.filter((peli) => peli.genre === genre)

  if (peliculasFiltradas.length === 0) {
    return res.status(404).json({ error: `No se encontraron películas del género: ${genre}` })
  }

  return res.status(200).json({
    total: peliculasFiltradas.length,
    peliculas: peliculasFiltradas
  })
}) */

module.exports = router;