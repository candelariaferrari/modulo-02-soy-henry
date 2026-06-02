const { log } = require("console");
const fs = require("fs")
const path = requiere("path")

function leerArchivosClima(carpeta){ /*  que lea los archivos de cualquier carpeta y devuelva los json parseados */
    const rutaCarpeta = path.join(__dirname, "..", carpeta)

    console.log(`leyendo archivos desde: ${rutaCarpeta}`);

    let archivos;
    try{ //el cod se va a intentar ejecutar
        archivos = fs.readdirSync(rutaCarpeta);
    }catch(error){ // si no lo logra cae aca 
        console.error(`no se pudo leer la carpeta: ${rutaCarpeta}`);
        console.error(error.message); //explicacion del error
        return[];        //retornamos array vacio
    }
    const archivosJSON = archivos.filter(archivo => archivo.endsWith('.json')); //tomamos el array de archivos que recibimos, y por cada archivo se va a fihjar los que terminan en .json 

    if(archivosJSON.length === 0){ //si no encuentra archivos
        console.warn('no se encontraron archivos JSON en la carpeta');
        return [];
        
    }
    console.log(`archivos encontrados: ${archivosJSON.join(', ')}`); //si si encuentra archivos los muestra en string 
    
    //mappeamos
    //pasamos los objetos de formato json a js
    const datos = archivosJSON.map(nombreArchivo => {
        const rutaArchivo = path.join(rutaCarpeta, nombreArchivo);
        try{ //intentamos leer cada archivo con fs 
            const contenidoRaw = fs.readFileSync(rutaArchivo, 'utf8');
            const datosClima = JSON.parse(contenidoRaw); //convierte el objeto json a js

            console.log(` Leido: ${nombreArchivo} -> ${datosClima.ciudad}, ${datosClima.pais}` );
            
            return datosClima
            
        }catch(error){
            console.error(`Error leyendo ${nombreArchivo}: ${error.message}`);
            return null;  //aca retornamos lo que no funciono
            
        }
    });
    return datos.filter(dato => dato !== null); //leemos los archivos correctos 
}

module.exports = { //exporto el archivo para poder leerlo
    leerArchivosClima
}
