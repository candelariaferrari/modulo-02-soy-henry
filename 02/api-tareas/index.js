
const express = require('express'); //traemos express
const tareasRouter = require("./routes/ruta-tareas");
const app = express(); //para poder usar express
const port = 3000; //definimos el puerto

//middleware globales
app.use(express.json()) //parsea el json en el body


//RUTAS
app.use("/tareas", tareasRouter)

//definimos un endpoin con cada app.
app.get('/', (req, res) => {
    res.json({
        mensaje:"API de tareas funcionando",
        endpoint: {
            tareas:"/tareas"
        }
    })
/*   res.send('Hello World!'); */
});
//el servicio escucha
app.listen(port, () => {
    console.log(`Servidor corriendo correctamente en http://localhost:${port}`);
});