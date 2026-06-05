CREATE TABLE libros ? (
    id INTEGER PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    anio_publicado INTEGER NOT NULL,
    isbn VARCHAR(17) UNIQUE NOT NULL,
    cantidad_pag INTEGER NOT NULL,
    autor_id INTEGER REFERENCES autores (id)
)

CREATE TABLE autores (
  id INTEGER PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  biografia_breve TEXT NOT NULL
)

CREATE TABLE biblioteca(
    id INTEGER PRIMARY KEY,
    libros INTEGER REFERENCES libros(id),
    fecha_adquision DATE NOT NULL
)