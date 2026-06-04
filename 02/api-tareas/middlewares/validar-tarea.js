//middelware son funciones que se interponen entre la req y el res para poder validar
//siempre necesita 3 parametros
function validarTarea(req, res, next) {
  const { titulo } = req.body;
  if (!titulo || titulo.trim() === "") {
    return res
      .status(400)
      .json({
        error: "el campo del titulo es requerido y no puede estar vacio",
      });
  }
  if (titulo.length > 100){
    return res
      .status(400)
      .json({ error: "el titulo no puede superar los 100 caracteres" });
  }
  //el middelware dice que puede seguir
  next()
}

module.exports = {
  validarTarea
}