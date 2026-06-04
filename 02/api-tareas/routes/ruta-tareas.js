/* const { log } = require("console");
const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const router = Router(); //enrutador

const RUTA_DATOS = path.join(__dirname, "../data/tareas.json");

function leerTareas() {
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8");
  return JSON.parse(contenido);
}

function guardarTareas(tareas) {
  fs.writeFileSync(RUTA_DATOS, JSON.stringify(tareas, null, 2)); //para que escriba la tarea
}

router.get("/", (req, res) => {
  let tareas = leerTareas();
  //extraer info
  const { completada, prioridad } = req.query;

  if (completada != undefined) {
    const estaCompletada = completada === "true";
    tareas = tareas.filter((tarea) => tarea.completada === estaCompletada);
  }
  if (prioridad) {
    tareas = tareas.filter((tarea) => tarea.prioridad === prioridad);
  }

  //enviamos la respuesta al cliente
  res.status(200).json({
    total: tareas.length,
    tareas,
  });
});

//listar una tarea especifica:
router.get("/:id", (req, res) => {
  //extraer la info de la req
  const id = Number(req.params.id);
  //parsemos
  console.log("id:" + id);
  //ahora validamos
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ error: "El ID de debe ser un numero valido" });
  }
  const tareas = leerTareas();
  tarea = tareas.find((ta) => ta.id === id);
  if (!tarea) {
    return res
      .status(400)
      .json({ error: `No se encontro la tarea con el ID ${id}` });
  }
  return res.status(200).json(tarea);
});
module.exports = router;
 */
const { log } = require("console");
const { Router } = require("express"); // Router permite definir rutas en archivos separados y luego conectarlas al app principal
const fs = require("fs"); // Para leer y escribir el archivo JSON
const path = require("path"); // Para construir rutas de archivos de forma segura
const { validarTarea } = require("../middlewares/validar-tarea");

const router = Router(); // Creamos el enrutador — es como un "mini express" solo para las rutas de tareas

// Ruta absoluta al archivo donde están guardadas las tareas
// __dirname = carpeta actual (src/ o routes/), luego subimos y entramos a data/
const RUTA_DATOS = path.join(__dirname, "../data/tareas.json");

/**
 * Lee el archivo tareas.json y lo devuelve como array de objetos JavaScript.
 * Se llama cada vez que necesitamos consultar las tareas, así siempre tenemos los datos más actualizados.
 */
function leerTareas() {
  const contenido = fs.readFileSync(RUTA_DATOS, "utf-8"); // Leemos el archivo como texto
  return JSON.parse(contenido); // Convertimos el texto JSON en array de objetos
}

/**
 * Recibe el array de tareas actualizado y lo sobreescribe en el archivo JSON.
 * JSON.stringify(tareas, null, 2) → el "2" agrega indentación para que el archivo sea legible
 */
function guardarTareas(tareas) {
  fs.writeFileSync(RUTA_DATOS, JSON.stringify(tareas, null, 2));
}

// --- GET /tareas ---
// Devuelve todas las tareas. Acepta filtros opcionales por query params:
// Ej: /tareas?completada=true  →  solo las completadas
// Ej: /tareas?prioridad=alta   →  solo las de prioridad alta
// Ej: /tareas?completada=false&prioridad=media  →  se pueden combinar
router.get("/", (req, res) => {
  let tareas = leerTareas();

  // Extraemos los query params de la URL (si vienen, si no son undefined)
  const { completada, prioridad } = req.query;

  // Filtro por completada — req.query siempre devuelve strings, por eso comparamos con "true"
  if (completada != undefined) {
    const estaCompletada = completada === "true"; // Convertimos el string "true"/"false" a booleano real
    tareas = tareas.filter((tarea) => tarea.completada === estaCompletada);
  }

  // Filtro por prioridad — si vino el parámetro, filtramos por ese valor (ej: "alta", "media", "baja")
  if (prioridad) {
    tareas = tareas.filter((tarea) => tarea.prioridad === prioridad);
  }

  // Respondemos con el total de resultados y el array de tareas (ya filtrado o completo)
  res.status(200).json({
    total: tareas.length, // Útil para que el cliente sepa cuántas hay sin contar el array
    tareas,
  });
});

// --- GET /tareas/:id ---
// Devuelve una sola tarea según su ID
// Ej: /tareas/2  →  devuelve la tarea con id 2
router.get("/:id", (req, res) => {
  const id = Number(req.params.id); // req.params.id siempre llega como string, lo convertimos a número
  console.log("id:" + id);

  // Validamos que el ID sea un número válido (si pasaron letras, Number() devuelve NaN)
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID debe ser un numero valido" });
  }

  const tareas = leerTareas();

  // .find() recorre el array y devuelve el primer elemento que cumpla la condición, o undefined si no encuentra
  tarea = tareas.find((ta) => ta.id === id);

  // Si no se encontró ninguna tarea con ese ID, devolvemos 404
  if (!tarea) {
    return res
      .status(400)
      .json({ error: `No se encontro la tarea con el ID ${id}` });
  }

  return res.status(200).json(tarea); // Devolvemos la tarea encontrada
});

// --- POST /tareas ---
// Crea una nueva tarea. Pasa primero por el middleware "validarTarea"
// que se encarga de verificar que los datos del body sean correctos antes de llegar acá
router.post("/", validarTarea, (req, res) => {
  // Extraemos solo los campos que nos interesan del body del request
  // (el cliente manda el JSON y Express lo parsea automáticamente)
  const { titulo, descripcion, prioridad } = req.body;

  const tareas = leerTareas();

  // Generamos un ID único basándonos en el mayor ID existente + 1
  // Math.max(...tareas.map(t => t.id)) → spread para "desempaquetar" el array en valores sueltos
  // Si no hay tareas todavía, arrancamos desde 1
  const nuevoId =
    tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) + 1 : 1;

  // Armamos el objeto de la nueva tarea con todos sus campos
  const nuevaTarea = {
    id: nuevoId,
    titulo,
    descripcion,
    completada: false, // Toda tarea nueva arranca como no completada
    prioridad: prioridad || "media", // Si el cliente no mandó prioridad, usamos "media" por defecto
    creadaEn: new Date().toLocaleString("es-ar"),
  };

  tareas.push(nuevaTarea); // Agregamos la nueva tarea al array cargado en memoria
  guardarTareas(tareas); // Sobreescribimos el archivo JSON con el array ya actualizado

  // 201 = "Created" — indica que se creó un recurso nuevo (distinto al 200 que es solo "OK")
  return res.status(201).json(nuevaTarea);
});

// --- PUT /tareas/:id ---
// Reemplaza los datos de una tarea existente con los que manda el cliente en el body
// Ej: PUT /tareas/2 con body { "titulo": "nuevo titulo" }
router.put("/:id", (req, res) => {
  const id = Number(req.params.id); // req.params.id llega como string, lo convertimos a número
  const { titulo } = req.body;

  if (isNaN(id))
    return res.status(400).json({ error: "El ID debe ser numero" });

  const tareas = leerTareas();

  // findIndex() devuelve la POSICIÓN del elemento en el array (0, 1, 2...)
  // a diferencia de find() que devuelve el objeto — necesitamos el índice para poder reemplazarlo después
  const tarea = tareas.findIndex((ta) => ta.id === id);

  // findIndex() devuelve -1 si no encontró ningún elemento
  if (tarea === -1)
    return res
      .status(404)
      .json({ error: `No se encontro la tarea con el ID: ${id}` });

  // Armamos la tarea actualizada combinando los datos viejos con los nuevos
  // El spread "..." copia todas las propiedades del objeto original
  // Si el body manda el mismo campo, lo sobreescribe; si no lo manda, se mantiene el valor anterior
  const tareaActualizada = {
    ...tareas[tarea], // primero copiamos todo lo que ya tenía
    ...req.body, // encima pisamos con lo que mandó el cliente
    id: tareas[tarea].id, // el ID nunca se puede cambiar
    creadaEn: tareas[tarea].creadaEn, // la fecha de creación tampoco se toca
  };

  // Si vino un título nuevo, lo limpiamos de espacios en blanco antes de guardarlo
  if (titulo) {
    tareaActualizada.titulo = titulo.trim();
  }

  /*  tareas[tarea] = tareaActualizada; // Reemplazamos el objeto viejo con el actualizado en el array
   */
  const tareasModificadas = tareas.map((tar) =>
    tar.id === tareaActualizada.id ? tareaActualizada : tar
  );
  guardarTareas(tareasModificadas); // Sobreescribimos el archivo JSON con el array actualizado
  return res.status(200).json(tareaActualizada);
});

// --- DELETE /tareas/:id ---
// Elimina una tarea específica según su ID
// Ej: DELETE /tareas/2  →  elimina la tarea con id 2
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id) // req.params.id llega como string, lo convertimos a número

  if (isNaN(id)) return res.status(400).json({ error: "El ID debe ser un número válido" })

  const tareas = leerTareas()

  // find() → guarda el objeto de la tarea para devolverlo en la respuesta al final
  // findIndex() → guarda la posición para poder eliminarla del array con splice()
  // Necesitamos los dos porque splice() requiere el índice, pero queremos devolver el objeto al cliente
  const tarea = tareas.find((ta) => ta.id === id)
  const indice = tareas.findIndex((ta) => ta.id === id)

  if (indice === -1) return res.status(404).json({ error: `No se encontró la tarea con el ID: ${id}` })

  // splice(indice, 1) → elimina 1 solo elemento en la posición indicada
  // modifica el array original directamente (a diferencia de filter() que crea uno nuevo)
  tareas.splice(indice, 1)

  console.log(tareas) // útil para verificar en consola que la tarea se eliminó correctamente

  guardarTareas(tareas) // sobreescribimos el archivo JSON con el array ya sin la tarea eliminada

  // Devolvemos la tarea que se eliminó para que el cliente sepa exactamente qué se borró
  return res.status(200).json({
    mensaje: "Tarea eliminada exitosamente",
    tarea
  })
})


module.exports = router;

/****** // CREAR UNA NUEVA TAREA , con middelware
router.post("/",validarTarea, (req, res)=>{
  //extraje la info de body
  const {titulo, descripcion , prioridad } = req.body
  //leemos cuantas tareas trae
  const tareas = leerTareas();
  //si hay tareas le sumamos 1 
  const nuevoId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1 
  //armamos el paquete
  const nuevaTarea = {
    id: nuevoId,
    titulo,
    descripcion,
    completada: false,
    prioridad: prioridad || "media", 
    creadaEn: new Date().toLocaleString("es-ar")
  }

  //pusheamos
  tareas.push(nuevaTarea);
  //guardamos el array anterior
  guardarTareas(tareas)

  //retornamos la respuesta
  return res.status(201).json(nuevaTarea)
}) */
// Exportamos el router para conectarlo en index.js con app.use("/tareas", router)
