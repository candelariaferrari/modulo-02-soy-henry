// Módulos nativos de Node.js (no necesitan instalarse)
const fs = require("fs")     // Permite leer archivos y carpetas del sistema
const path = require("path") // Permite construir rutas de forma segura en cualquier sistema operativo

/**
 * Lee todos los archivos .json de una carpeta y los devuelve como un array de objetos.
 * Si la carpeta no existe o no hay JSONs, devuelve un array vacío en lugar de romper el programa.
 */
function leerArchivosClima(carpeta) {

    // Construimos la ruta absoluta a la carpeta "data"
    // __dirname = carpeta donde está este archivo (src/)
    // ".." = subimos un nivel (a la raíz del proyecto)
    // carpeta = "data" (el parámetro que recibimos)
    const rutaCarpeta = path.join(__dirname, "..", carpeta)
    console.log(`📁 leyendo archivos desde: ${rutaCarpeta}`)

    // --- Paso 1: Leer el contenido de la carpeta ---
    let archivos;
    try {
        archivos = fs.readdirSync(rutaCarpeta) // Devuelve un array con los nombres de todos los archivos de la carpeta
    } catch (error) {
        // Si la carpeta no existe o no tenemos permisos, capturamos el error sin romper el programa
        console.error(`❌ No se pudo leer la carpeta: ${rutaCarpeta}`)
        console.error(error.message)
        return [] // Devolvemos array vacío para que el programa pueda seguir
    }

    // --- Paso 2: Filtrar solo los archivos .json ---
    // .filter() recorre el array y se queda solo con los que terminan en ".json"
    const archivosJSON = archivos.filter(archivo => archivo.endsWith('.json'))

    if (archivosJSON.length === 0) {
        console.warn('⚠️  No se encontraron archivos JSON en la carpeta.')
        return [] // No hay nada que procesar, devolvemos vacío
    }

    console.log(`📄 Archivos encontrados: ${archivosJSON.join(', ')}`) // Ej: "bsas.json, rosario.json"

    // --- Paso 3: Leer y parsear cada archivo JSON ---
    // .map() transforma cada nombre de archivo en el objeto de datos que contiene
    const datos = archivosJSON.map(nombreArchivo => {
        const rutaArchivo = path.join(rutaCarpeta, nombreArchivo) // Ruta completa al archivo

        try {
            const contenidoRaw = fs.readFileSync(rutaArchivo, 'utf8') // Leemos el archivo como texto plano
            const datosClima = JSON.parse(contenidoRaw)               // Convertimos el texto JSON en un objeto JavaScript
            console.log(`  ✅ Leído: ${nombreArchivo} → ${datosClima.ciudad}, ${datosClima.pais}`)
            return datosClima // Devolvemos el objeto para que .map() lo agregue al array
        } catch (error) {
            // Si el archivo tiene un JSON malformado o no se puede leer, lo saltamos
            console.error(`  ❌ Error leyendo ${nombreArchivo}: ${error.message}`)
            return null // Marcamos este archivo como fallido con null
        }
    })

    // --- Paso 4: Limpiar los archivos que fallaron ---
    // .filter() elimina todos los null que dejaron los archivos con error
    // Así el array final solo contiene objetos válidos
    return datos.filter(dato => dato !== null)
}

// Exportamos la función para que index.js pueda importarla con require()
module.exports = {
    leerArchivosClima
}