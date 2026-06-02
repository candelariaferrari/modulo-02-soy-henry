Homework
Homework: Explorador de archivos con npm scripts
En esta tarea vas a construir una herramienta de línea de comandos que explora y analiza archivos en tu directorio de usuario. Aprenderás a usar npm scripts de forma práctica, a trabajar con el sistema de archivos de forma asíncrona, y a organizar código que puede ejecutarse de diferentes maneras según tus necesidades.

Objetivo
Crear un proyecto Node.js que liste y analice archivos en tu directorio de usuario, con múltiples comandos npm que ofrecen diferentes niveles de detalle y filtrado. También implementarás un modo de desarrollo que usa node --watch para reiniciar automáticamente cuando edites el código.

Construirás una herramienta con los siguientes comandos:

npm start - Lista archivos y carpetas del directorio de usuario
npm run list:detailed - Muestra información detallada (tamaño, tipo, fecha de modificación)
npm run list:filter - Filtra solo archivos JavaScript
npm run dev - Modo desarrollo con recarga automática al editar código
Parte 1: Configuración inicial del proyecto
Crea una carpeta nueva para tu proyecto:


mkdir explorador-archivos
cd explorador-archivos
Inicializa el proyecto con npm:

npm init -y
Esto crea tu package.json con valores por defecto.

Parte 2: Script básico de listado
Crea un archivo llamado index.js. Este será tu archivo principal que lista el contenido del directorio de usuario.

Tu script debe:

Usar el módulo fs/promises para operaciones asíncronas
Usar os.homedir() para obtener la ruta del directorio de usuario
Leer el contenido del directorio con fs.readdir()
Mostrar cada archivo y carpeta en la consola
Puntos importantes a considerar:

Obtener el directorio de usuario: El módulo os (operating system) tiene un método homedir() que devuelve la ruta del directorio de usuario sin importar si estás en Windows, macOS o Linux. En Windows podría ser C:\Users\tu-nombre, en macOS /Users/tu-nombre, y en Linux /home/tu-nombre. Usando os.homedir() tu código funciona en cualquier sistema.
Usar async/await: Ya que estás trabajando con fs/promises, todas las operaciones devuelven Promises. Envuelve tu código en una función async y usa await para esperar los resultados. Esto hace que tu código asíncrono sea más legible que usar callbacks.
Manejo de errores: Usa try-catch para capturar errores. Si algo falla (permisos insuficientes, directorio no existe), tu programa debe mostrar un mensaje de error claro en vez de terminar abruptamente.
Ejemplo de estructura sugerida:

Explain
Copy
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

async function listarDirectorio() {
  try {
    // Tu código aquí
  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDirectorio();
Cuando ejecutes node index.js, deberías ver una lista de archivos y carpetas en tu directorio de usuario.

Parte 3: Configurar npm scripts
Abre package.json y modifica la sección scripts:

Copy
"scripts": {
  "start": "node index.js"
}
Ahora puedes ejecutar tu script con:

Copy
npm start
Esto es más limpio que recordar el nombre exacto del archivo. Además, si más adelante cambias el nombre del archivo principal o necesitas pasar flags adicionales, solo actualizas el script una vez en package.json.

Parte 4: Modo detallado con información de archivos
Ahora vas a crear una versión más completa que muestre información detallada de cada archivo: si es archivo o directorio, su tamaño, y fecha de última modificación.

Para esto necesitarás usar fs.stat() en cada item. Este método devuelve un objeto con información detallada del archivo.

Crea un archivo nuevo llamado detallado.js. Este archivo debe:

Leer el directorio igual que index.js
Para cada item, llamar a fs.stat() para obtener información adicional
Mostrar de forma organizada:
Si es archivo o directorio
El tamaño (solo para archivos, los directorios muestran guión)
La fecha de última modificación en formato legible
Consideraciones importantes:

Combinar readdir con stat: Primero obtienes la lista de nombres con readdir(). Luego, para cada nombre, construyes la ruta completa usando path.join() y llamas a stat() con esa ruta. No puedes hacer stat de solo el nombre, necesitas la ruta completa.
Formatear tamaños: stats.size devuelve bytes. Un archivo de 5000 bytes es más legible como "5 KB". Puedes crear una función que convierta bytes a KB, MB, etc.
Formatear fechas: stats.mtime devuelve un objeto Date. Puedes usar métodos como toLocaleDateString() o toLocaleString() para mostrarlo en formato legible en vez del formato crudo de Date.
Procesar múltiples archivos: Tienes un array de nombres. Necesitas hacer stat de cada uno. Puedes usar un bucle for...of con await en cada iteración, o usar Promise.all() con map() para procesar todos en paralelo. La versión en paralelo es más rápida pero más compleja.
Ejemplo de estructura:

Explain
Copy
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

function formatearTamano(bytes) {
  // Tu lógica para convertir bytes a formato legible
}

async function listarDetallado() {
  try {
    const dirUsuario = os.homedir();
    const items = await fs.readdir(dirUsuario);
    
    for (const item of items) {
      const rutaCompleta = path.join(dirUsuario, item);
      const stats = await fs.stat(rutaCompleta);
      
      // Formatear y mostrar información
    }
  } catch (error) {
    console.log('Error:', error.message);
  }
}

listarDetallado();
Agrega este script a tu package.json:

Copy
"scripts": {
  "start": "node index.js",
  "list:detailed": "node detallado.js"
}
Ejecuta con:

Copy
npm run list:detailed
Deberías ver una salida más informativa que la versión básica.

Parte 5: Filtrado por tipo de archivo
Crea un tercer archivo llamado filtrar.js que muestre solo archivos con extensión .js (archivos JavaScript).

Este script debe:

Leer el directorio de usuario
Filtrar solo los archivos que terminan en .js
Mostrar cuántos archivos JavaScript encontró
Listar cada uno con su tamaño
Para filtrar por extensión, usa el módulo path. El método path.extname() devuelve la extensión de un archivo incluyendo el punto. Por ejemplo, path.extname('script.js') devuelve '.js'.

Pasos sugeridos:

Obtener items: Usa readdir() como siempre.
Filtrar antes de procesar: Antes de hacer stat() de cada item, verifica si su extensión es .js. Solo procesa los que coincidan. Esto es más eficiente que procesar todo y luego filtrar.
Contar resultados: Lleva un contador de cuántos archivos JS encontraste. Al final, muestra el total. Si encontraste cero, muestra un mensaje indicándolo.
Considerar subcarpetas: Los directorios no tienen extensión, así que path.extname() devuelve string vacío. Tu filtro los ignorará automáticamente, lo cual es correcto ya que solo quieres archivos.
Estructura sugerida:

Explain
Copy
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

async function filtrarJavaScript() {
  try {
    const dirUsuario = os.homedir();
    const items = await fs.readdir(dirUsuario);
    const archivosJS = [];
    
    for (const item of items) {
      if (path.extname(item) === '.js') {
        // Procesar y agregar a archivosJS
      }
    }
    
    console.log(`Encontrados ${archivosJS.length} archivos JavaScript`);
    // Mostrar cada uno
  } catch (error) {
    console.log('Error:', error.message);
  }
}

filtrarJavaScript();
Agrega el script:

Copy
"scripts": {
  "start": "node index.js",
  "list:detailed": "node detallado.js",
  "list:filter": "node filtrar.js"
}
Ejecuta:

Copy
npm run list:filter
Dependiendo de tu directorio de usuario, podrías ver cero archivos JS (lo cual es normal, la mayoría de los usuarios no tienen archivos JS sueltos en su directorio principal) o algunos si tienes scripts ahí.

Parte 6: Modo desarrollo con watch
Finalmente, configura un script de desarrollo que use node --watch. Este script reiniciará automáticamente cuando modifiques tu código.

Agrega a package.json:

Copy
"scripts": {
  "start": "node index.js",
  "list:detailed": "node detallado.js",
  "list:filter": "node filtrar.js",
  "dev": "node --watch index.js"
}
Ahora ejecuta:

Copy
npm run dev
Tu script se ejecuta. Deja la terminal abierta y, en tu editor de texto, modifica algo en index.js. Por ejemplo, cambia el mensaje que se muestra. Guarda el archivo.

Node.js detecta el cambio, reinicia automáticamente el script, y ves la nueva salida. No tuviste que detener y reiniciar manualmente.

Esto es extremadamente útil durante desarrollo. Mientras estás escribiendo y refinando tu código, cada cambio que guardas se refleja inmediatamente en la terminal.

Nota: node --watch solo reinicia cuando editas el archivo que está ejecutando (en este caso index.js) o archivos que ese archivo importa con require(). No reinicia si los archivos en el directorio que estás listando cambian, porque esos no son parte de tu código, son datos externos.

Parte 7: Mejoras opcionales (desafíos extra)
Si terminas rápido y quieres desafiarte más, intenta implementar estas mejoras:

Ordenamiento: Modifica tus scripts para que ordenen los archivos alfabéticamente antes de mostrarlos.
Colores en la terminal: Investiga el paquete chalk (tendrías que instalarlo con npm install chalk). Úsalo para mostrar directorios en un color y archivos en otro. Esto hace la salida mucho más legible.
Argumentos personalizables: Modifica tus scripts para que acepten un argumento de línea de comandos especificando qué directorio listar. Si no se proporciona argumento, usa el directorio de usuario por defecto. Usa process.argv para leer argumentos.
Estadísticas agregadas: Al final del listado, muestra estadísticas: total de archivos, total de directorios, tamaño total combinado de todos los archivos.
Diferentes extensiones: En vez de hardcodear .js en el script de filtrado, acepta la extensión como argumento. Por ejemplo, node filtrar.js .txt mostraría solo archivos de texto.
Consejos para completar la tarea
Empieza simple: Comienza con el listado básico. Asegúrate de que funciona antes de agregar complejidad. No intentes hacer todo de una vez.
Prueba cada parte individualmente: Después de escribir cada script, ejecútalo varias veces. Prueba con diferentes escenarios. ¿Qué pasa si hay un error? ¿Se maneja correctamente?
Lee la documentación: Si no recuerdas cómo funciona un método de fs o path, consulta la documentación de Node.js. No adivines.
Usa console.log para depurar: Si algo no funciona, agrega console.log() para ver qué valores tienen tus variables. Esto te ayudará a identificar dónde está el problema.
El modo watch es tu amigo: Usa npm run dev mientras desarrollas. Cada cambio que guardes se refleja inmediatamente. Esto acelera mucho el desarrollo.
Organiza tu código: Si ves que estás repitiendo código entre los tres archivos (por ejemplo, la función para formatear tamaños), considera crear un archivo separado con funciones compartidas y usar require() para importarlas.
No te frustres con permisos: En algunos sistemas operativos, ciertos archivos en el directorio de usuario podrían no ser legibles. Si fs.stat() falla en un archivo específico, captura ese error individual y continúa con los demás. No dejes que un archivo inaccesible detenga todo el programa.
Reflexión final
Esta tarea te enseña habilidades que usarás constantemente como desarrollador backend:

Trabajar con el sistema de archivos de forma asíncrona
Organizar proyectos con npm scripts
Manejar errores apropiadamente
Procesar y formatear datos para mostrarlos al usuario
Usar herramientas de desarrollo que aceleran tu flujo de trabajo
No es solo una tarea académica. Estás construyendo una herramienta real que podrías extender para hacer cosas útiles: buscar archivos duplicados, encontrar archivos grandes que ocupan espacio, organizar descargas, lo que se te ocurra.

Tómate tu tiempo, lee bien las instrucciones, y construye algo de lo que te sientas orgulloso/a. Buena suerte.

