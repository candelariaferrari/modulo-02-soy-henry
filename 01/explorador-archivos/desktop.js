const fs = require('fs/promises');
const os = require('os'); //Te dice dónde está la carpeta del usuario del sistema
const path = require('path');
const { log } = require('console');

async function listarDirectorio(carpeta) {
  try {
    const rutaCarpeta = path.join(__dirname, "../../../../../../", carpeta);  // para llegar a desktop por ej
    const items = await fs.readdir(rutaCarpeta);  // ← acá el cambio

    console.log(`leyendo archivos desde: ${rutaCarpeta}`);

    for (const item of items) {
      console.log(item);
    }

  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDirectorio("desktop");  // ← el nombre de la carpeta que quieras, teneiendo en cuenta los ../