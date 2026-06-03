// Importamos la función que lee y parsea los archivos de clima desde la carpeta "data"
const { leerArchivosClima } = require("./src/reader.js")
// Importamos la función que genera el reporte final en consola y lo guarda como .txt
const { generarReporte } = require("./src/reporter.js")

console.log("🌤️ Iniciando Agregador de datos climáticos \n")

// Leemos todos los archivos de la carpeta "data" y los convertimos en un array de ciudades
const datosCiudades = leerArchivosClima("data")

// Validación: si el array viene vacío, algo salió mal al leer los archivos
if (datosCiudades.length === 0) {
    console.error("No se pudieron cargar los datos")
    // Nota: podrías agregar un process.exit(1) acá para detener el programa si no hay datos
}

// Confirmamos en consola cuántas ciudades se cargaron exitosamente
console.log(`\n ✅ ${datosCiudades.length} ciudad(es) cargadas correctamente. \n`)

// Ejecutamos el reporte con los datos obtenidos — esta función hace todo el procesamiento y guardado
generarReporte(datosCiudades)