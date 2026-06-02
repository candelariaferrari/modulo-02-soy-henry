const fs = require('fs/promises');
const os = require('os'); //Te dice dónde está la carpeta del usuario del sistema
const path = require('path');
const chalk = require('chalk');

async function listarDirectorio() {
  try {

    const direccionUsuario = os.homedir(); // Obtiene carpeta de usuario
    const items = await fs.readdir(direccionUsuario);  // Lee todos los archivos/carpetas que hay ahí
    
    console.log(`${chalk.bgRed.white(' Contenido de computadora: ')} ${chalk.bgRed(direccionUsuario)}}`);
    console.log('─'.repeat(40));

    for (const item of items) {
      console.log(item);
    }

  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDirectorio();