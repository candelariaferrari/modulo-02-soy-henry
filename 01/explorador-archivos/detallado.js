const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

function formatearTamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function listarDetallado() {
  try {
    const dirUsuario = os.homedir();
    const items = await fs.readdir(dirUsuario);

    console.log(chalk.bold.blue(`Contenido detallado de: ${dirUsuario}`));
    console.log(chalk.gray('─'.repeat(60)));

    for (const item of items) {
      const rutaCompleta = path.join(dirUsuario, item);
      const stats = await fs.stat(rutaCompleta);

      const fecha = stats.mtime.toLocaleDateString();

      if (stats.isDirectory()) {
        console.log(`${chalk.bgYellow.white(' CARPETA ')} ${chalk.red(item)} | ${chalk.gray(fecha)}`);
      } else {
        const tamano = formatearTamano(stats.size);
        console.log(`${chalk.bgRed.white(' ARCHIVO ')} ${chalk.green(item)} | ${chalk.yellow(tamano)} | ${chalk.gray(fecha)}`);
      }
    }

  } catch (error) {
    console.log(chalk.red('Error:'), error.message);
  }
}

listarDetallado();