const express = require("express");
const rutaPeliculas = require("./routes/ruta-peliculas");
const app = express();
const port = 3500;

//middleware globales
app.use(express.json()) //parsea el json en el body


//RUTAS
app.use("/peliculas", rutaPeliculas)

//definimos un endpoin con cada app.
app.get('/', (req, res) => {
    res.json({
        mensaje:"API de peliculas funcionando",
        endpoint: {
            peliculas:"/peliculas"
        }
    })
/*   res.send('Hello World!'); */
});
//el servicio escucha
app.listen(port, () => {
    console.log(`Servidor corriendo correctamente en http://localhost:${port}`);
});