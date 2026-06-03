// Módulos nativos de Node.js (no necesitan instalarse)
const fs = require("fs")       // fs = filesystem, permite leer y escribir archivos
const path = require("path")   // path permite construir rutas de carpetas/archivos de forma segura

/**
 * Evalúa si las condiciones climáticas representan un riesgo para la logística.
 * Recibe la condición del clima (ej: "lluvia") y la temperatura actual.
 * Devuelve un objeto con el estado (riesgo/precaución/apto) y una recomendación.
 */
function evaluarCondicion(condicion, temperatura) {
  const condicionNormal = condicion.toLowerCase() // Normalizamos a minúsculas para comparar sin importar cómo venga escrito

  // Lista de palabras que indican condiciones peligrosas para el transporte
  const condicionesRiesgo = ["lluvia", "tormenta", "nieve", "granizo"]

  // .some() recorre el array y devuelve true si AL MENOS UNA condición coincide con el clima actual
  // .includes() verifica si la condición actual contiene esa palabra
  const hayRiesgo = condicionesRiesgo.some(cond => condicionNormal.includes(cond))

  // Si alguna palabra de riesgo está presente, retornamos estado ROJO
  if (hayRiesgo) {
    return {
      estado: "🔴 RIESGO",
      recomendacion: "Operaciones demoradas. Evaluar rutas alternativas"
    }
  }

  // Si no hay riesgo climático pero hace mucho calor, retornamos estado AMARILLO
  if (temperatura > 35) {
    return {
      estado: "🟡 PRECAUCIÓN",
      recomendacion: "Calor extremo. Verificar mercadería sensible a temperatura"
    }
  }

  // Si no se cumplió ninguna condición anterior, todo está bien → estado VERDE
  return {
    estado: "🟢 APTO",
    recomendacion: "Condiciones normales. Operaciones sin restricciones."
  }
}

/**
 * Recibe un array de ciudades y devuelve la que tiene mayor temperatura.
 * Usa .reduce() que compara de a pares y se queda con el mayor cada vez,
 * como un torneo: va ganando el que tiene más temperatura hasta que queda uno solo.
 */
function ciudadMasCalida(ciudades) {
  return ciudades.reduce((max, ciudad) => ciudad.temperatura > max.temperatura ? ciudad : max)
  //                       ^ acumulador    ^ elemento actual      si la ciudad actual es más caliente, la usamos como nuevo máximo
}

/**
 * Función principal: genera el reporte completo en consola y lo guarda como archivo .txt
 * Recibe un array de objetos, donde cada uno representa una ciudad con sus datos climáticos.
 */
function generarReporte(datosCiudades) {
  console.log('\n📊 Generando reporte...\n');

  const fechaHoy = new Date().toISOString().split('T')[0] // Obtenemos solo la parte de la fecha: "2025-06-03"
  const generadoEn = new Date().toLocaleString('es-AR')   // Fecha y hora legible en formato argentino
  const reporteLineas = []                                 // Array vacío que iremos llenando línea por línea

  // Encabezado del reporte
  reporteLineas.push('='.repeat(60))           // Línea de 60 signos "="
  reporteLineas.push('  REPORTE CLIMÁTICO LOGÍSTICO')
  reporteLineas.push(`  Fecha    : ${fechaHoy}`)
  reporteLineas.push(`  Generado : ${generadoEn}`)
  reporteLineas.push('='.repeat(60))
  reporteLineas.push('')                       // Línea en blanco para separar visualmente

  // Iteramos sobre cada ciudad del array y generamos su bloque de información
  datosCiudades.forEach(ciudad => {
    // Para cada ciudad, evaluamos sus condiciones climáticas
    const evaluacion = evaluarCondicion(ciudad.condicion, ciudad.temperatura)

    // Armamos el bloque de texto con los datos de esa ciudad
    reporteLineas.push(`📍 ${ciudad.ciudad.toUpperCase()} — ${ciudad.pais}`) // Nombre en mayúsculas
    reporteLineas.push('-'.repeat(40))
    reporteLineas.push(`  Temperatura  : ${ciudad.temperatura}°C`)
    reporteLineas.push(`  Humedad      : ${ciudad.humedad}%`)
    reporteLineas.push(`  Condición    : ${ciudad.condicion}`)
    reporteLineas.push(`  Estado       : ${evaluacion.estado}`)
    reporteLineas.push(`  Recomendación: ${evaluacion.recomendacion}`)
    reporteLineas.push('')  // Separador entre ciudades
  })

  // Buscamos y mostramos la ciudad más caliente del día
  const masCalida = ciudadMasCalida(datosCiudades)
  reporteLineas.push('='.repeat(60))
  reporteLineas.push(`  🌡️  Ciudad más cálida: ${masCalida.ciudad} con ${masCalida.temperatura}°C`)
  reporteLineas.push('='.repeat(60))

  // Unimos todas las líneas del array en un solo string, separadas por salto de línea
  const reporteTexto = reporteLineas.join('\n')

  console.log(reporteTexto) // Mostramos el reporte en consola

  // --- Guardado del archivo ---

  // Construimos la ruta de la carpeta "output" que está un nivel arriba del archivo actual
  const rutaOutput = path.join(__dirname, '..', 'output')  // __dirname = carpeta donde está este archivo
  const nombreArchivo = `reporte-${fechaHoy}.txt`          // Nombre con la fecha: ej "reporte-2025-06-03.txt"
  const rutaArchivo = path.join(rutaOutput, nombreArchivo) // Ruta completa del archivo a guardar

  // Creamos la carpeta "output" si todavía no existe (recursive:true evita error si ya existe)
  fs.mkdirSync(rutaOutput, { recursive: true })

  // Intentamos escribir el archivo; si algo falla, mostramos el error sin romper el programa
  try {
    fs.writeFileSync(rutaArchivo, reporteTexto, 'utf8') // utf8 = codificación estándar, soporta tildes y ñ
    console.log(`\n✅ Reporte guardado en: output/${nombreArchivo}`)
  } catch (error) {
    console.error(`❌ Error al guardar el reporte: ${error.message}`)
  }
}

// Exportamos la función para que otros archivos puedan importarla con require()
module.exports = {
  generarReporte
}