const fs = require('fs/promises');
const os = require('os');
const path = require('path');

function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function filtrarJavaScript() {
  try {
    const dirUsuario = os.homedir();
    const items = await fs.readdir(dirUsuario);
    const archivosJS = [];

    for (const item of items) {
      if (path.extname(item) === '.js') {
        const rutaCompleta = path.join(dirUsuario, item);
        const stats = await fs.stat(rutaCompleta);
        archivosJS.push({ nombre: item, tamano: formatearTamano(stats.size) });
      }
    }

    console.log(`Archivos JavaScript encontrados: ${archivosJS.length}`);
    console.log('─'.repeat(40));

    if (archivosJS.length === 0) {
      console.log('No hay archivos .js en tu directorio de usuario.');
    } else {
      for (const archivo of archivosJS) {
        console.log(`${archivo.nombre} | ${archivo.tamano}`);
      }
    }

  } catch (error) {
    console.log('Error:', error.message);
  }
}

filtrarJavaScript();