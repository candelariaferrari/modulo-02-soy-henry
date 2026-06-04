--tabla directores - TABLA PADRE --
CREATE TABLE directors{
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    lastname VARCHAR(100) NOT NULL,
    nationality VARCHAR(50), -- Si no tiene not es que es opcional --
    birthdate DATE
}

