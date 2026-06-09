-- =============================================
-- ? SISTEMA DE GESTIÓN UNIVERSITARIA
-- * Paso 1: Creación de tablas y validación del modelo (DDL)
-- =============================================

-- ! OJO: CREAR BASE DE DATOS

-- * Tabla de profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    fecha_ingreso DATE DEFAULT CURRENT_DATE
);

--* Tabla de estudiantes
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    ciudad VARCHAR(100)
);

--* Tabla de cursos
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    creditos INTEGER CHECK (
        creditos > 0
        AND creditos <= 10
    ),
    profesor_id INTEGER REFERENCES profesores (id) ON DELETE SET NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    CHECK (fecha_fin > fecha_inicio)
);

--* Tabla de inscripciones (relación muchos a muchos) -- TABLA INTERMEDIA
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes (id) ON DELETE CASCADE,
    curso_id INTEGER NOT NULL REFERENCES cursos (id) ON DELETE CASCADE,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    calificacion DECIMAL(4, 2) CHECK (
        calificacion >= 0
        AND calificacion <= 10
    ),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (
        estado IN (
            'activo',
            'completado',
            'abandonado'
        )
    ),
    UNIQUE (estudiante_id, curso_id) -- un estudiante no puede inscribirse dos veces al mismo curso
);

-- =============================================
--* Paso 2: Carga de datos coherentes
-- =============================================

--* Profesores
INSERT INTO
    profesores (
        nombre,
        apellido,
        email,
        especialidad,
        fecha_ingreso
    )
VALUES (
        'Laura',
        'Gómez',
        'lgomez@universidad.edu',
        'Bases de Datos',
        '2019-03-01'
    ),
    (
        'Martín',
        'Ferreyra',
        'mferreyra@universidad.edu',
        'Algoritmos',
        '2020-07-15'
    ),
    (
        'Valeria',
        'Ríos',
        'vrios@universidad.edu',
        'Desarrollo Web',
        '2021-01-10'
    ),
    (
        'Diego',
        'Castillo',
        'dcastillo@universidad.edu',
        'Redes y Seguridad',
        '2018-09-20'
    ),
    (
        'Sofía',
        'Mendoza',
        'smendoza@universidad.edu',
        'Inteligencia Artificial',
        '2022-04-01'
    );

--* Estudiantes
INSERT INTO
    estudiantes (
        nombre,
        apellido,
        email,
        fecha_nacimiento,
        ciudad
    )
VALUES (
        'Agustín',
        'Peralta',
        'aperalta@mail.com',
        '2001-05-14',
        'Buenos Aires'
    ),
    (
        'Camila',
        'Torres',
        'ctorres@mail.com',
        '2002-11-03',
        'Rosario'
    ),
    (
        'Lucas',
        'Herrera',
        'lherrera@mail.com',
        '2000-08-22',
        'Córdoba'
    ),
    (
        'Valentina',
        'Morales',
        'vmorales@mail.com',
        '2003-02-17',
        'Mendoza'
    ),
    (
        'Mateo',
        'Silva',
        'msilva@mail.com',
        '2001-12-30',
        'Buenos Aires'
    ),
    (
        'Julieta',
        'Romero',
        'jromero@mail.com',
        '2002-06-08',
        'La Plata'
    ),
    (
        'Santiago',
        'López',
        'slopez@mail.com',
        '2000-04-19',
        'Córdoba'
    ),
    (
        'Lucía',
        'Vega',
        'lvega@mail.com',
        '2003-09-25',
        'Buenos Aires'
    );

--* Cursos
INSERT INTO
    cursos (
        nombre,
        descripcion,
        creditos,
        profesor_id,
        fecha_inicio,
        fecha_fin
    )
VALUES (
        'Bases de Datos I',
        'Fundamentos del modelo relacional y SQL',
        6,
        1,
        '2024-03-01',
        '2024-07-31'
    ),
    (
        'Algoritmos II',
        'Estructuras avanzadas y complejidad',
        5,
        2,
        '2024-03-01',
        '2024-07-31'
    ),
    (
        'Desarrollo Web',
        'HTML, CSS, JavaScript y frameworks modernos',
        6,
        3,
        '2024-03-01',
        '2024-07-31'
    ),
    (
        'Redes I',
        'Protocolos y arquitectura de redes',
        4,
        4,
        '2024-03-01',
        '2024-07-31'
    ),
    (
        'Machine Learning',
        'Introducción a ML con Python',
        5,
        5,
        '2024-03-01',
        '2024-07-31'
    ),
    (
        'Programación Web II',
        'Backend y APIs REST',
        6,
        3,
        '2024-08-01',
        '2024-12-31'
    );
--! Nota: el curso 6 no tendrá inscriptos — lo usaremos para detectar cursos vacíos

--* Inscripciones (con calificaciones variadas para generar reportes interesantes)
--* (Antes de ejecutar borrar los comentarios dentro de los inserts. Ej: Agustín: muy buen estudiante)
INSERT INTO
    inscripciones (
        estudiante_id,
        curso_id,
        fecha_inscripcion,
        calificacion,
        estado
    )
VALUES
    -- Agustín: muy buen estudiante
    (
        1,
        1,
        '2024-02-28',
        9.5,
        'completado'
    ),
    (
        1,
        2,
        '2024-02-28',
        8.7,
        'completado'
    ),
    (
        1,
        3,
        '2024-02-28',
        9.0,
        'completado'
    ),
    (
        2,
        1,
        '2024-02-28',
        7.8,
        'completado'
    ),
    (
        2,
        3,
        '2024-02-28',
        8.2,
        'completado'
    ),
    (
        2,
        5,
        '2024-02-28',
        7.5,
        'completado'
    ),

-- Lucas: un curso abandonado
(
    3,
    2,
    '2024-02-28',
    6.5,
    'completado'
),
(
    3,
    4,
    '2024-02-28',
    NULL,
    'abandonado'
),
(
    3,
    5,
    '2024-02-28',
    7.0,
    'completado'
),

-- Valentina: inscripta pero sin calificaciones todavía
(
    4,
    1,
    '2024-02-28',
    NULL,
    'activo'
),
(
    4,
    3,
    '2024-02-28',
    NULL,
    'activo'
),

-- Mateo: buen desempeño
(
    5,
    1,
    '2024-02-28',
    8.0,
    'completado'
),
(
    5,
    2,
    '2024-02-28',
    9.2,
    'completado'
),
(
    5,
    4,
    '2024-02-28',
    8.5,
    'completado'
),

-- Julieta: rendimiento más bajo
(
    6,
    3,
    '2024-02-28',
    5.5,
    'completado'
),
(
    6,
    5,
    '2024-02-28',
    6.0,
    'completado'
),

-- Santiago: pocos cursos pero buenas notas
(
    7,
    1,
    '2024-02-28',
    9.8,
    'completado'
),
(
    7,
    4,
    '2024-02-28',
    8.9,
    'completado'
),

-- Lucía: varios cursos
(
    8,
    2,
    '2024-02-28',
    7.2,
    'completado'
),
(
    8,
    3,
    '2024-02-28',
    8.0,
    'completado'
),
(
    8,
    4,
    '2024-02-28',
    7.5,
    'completado'
);

-- =============================================
--* Paso 3: Consultas
-- =============================================

--* ¿Cuántos estudiantes tenemos?
--* este sirve si el id es de tipo serial
SELECT max(id) as total_estudiantes FROM estudiantes;
--* este sirve si el id es distinto es
SELECT COUNT(*) as total_estudiantes FROM estudiantes;

--* ¿Cuántos profesores tenemos?
SELECT max(id) as total_profesores FROM profesores;

--* ¿Cuántos cursos hay en total?
SELECT COUNT(*) as total_cursos FROM cursos;

--* ¿Cuántas inscripciones hay por estado?
SELECT estado, COUNT(*) AS cantidad
FROM inscripciones
GROUP BY
    estado
ORDER BY cantidad DESC;

--* ¿Cuántos cursos tiene cada profesor?
SELECT p.nombre || p.apellido AS profesor, COUNT(c.id) AS cantidad_cursos
FROM profesores p
    LEFT JOIN cursos c ON c.profesor_id = p.id
GROUP BY
    p.id,
    p.nombre,
    p.apellido
ORDER BY cantidad_cursos DESC;

-- =============================================
--* Paso 4: Cruzar de información entre tablas
-- =============================================

--* ¿Qué estudiantes están inscriptos en cada curso?
SELECT c.nombre AS curso, e.nombre || ' ' || e.apellido AS estudiante, i.calificacion, i.estado
FROM
    inscripciones i
    INNER JOIN estudiantes e ON e.id = i.estudiante_id
    INNER JOIN cursos c ON c.id = i.curso_id
ORDER BY c.nombre, e.apellido;

--* ¿ Qué cursos dicta cada profesor?
SELECT p.nombre || ' ' || p.apellido AS profesor, p.especialidad, c.nombre AS curso, c.creditos
FROM profesores p
    INNER JOIN cursos c ON c.profesor_id = p.id
ORDER BY p.apellido, c.nombre;

--* ¿Qué cursos no tienen ningún inscripto?
SELECT c.nombre AS curso, c.fecha_inicio, p.nombre || ' ' || p.apellido AS profesor
FROM
    cursos c
    LEFT JOIN inscripciones i ON i.curso_id = c.id
    LEFT JOIN profesores p ON p.id = c.profesor_id
WHERE
    i.id IS NULL
ORDER BY c.nombre;

--* ¿Cuántos estudiantes tiene cada curso?
SELECT
    c.nombre AS curso,
    p.nombre || ' ' || p.apellido AS profesor,
    COUNT(i.estudiante_id) AS cantidad_inscriptos
FROM
    cursos c
    LEFT JOIN inscripciones i ON i.curso_id = c.id
    LEFT JOIN profesores p ON p.id = c.profesor_id
GROUP BY
    c.id,
    c.nombre,
    p.nombre,
    p.apellido
ORDER BY cantidad_inscriptos DESC;

--* Ranking de estudiantes por promedio general
-- Solo consideramos calificaciones completadas (no NULL, no abandonadas)
SELECT
    e.nombre || ' ' || e.apellido AS estudiante,
    e.ciudad,
    COUNT(i.id) AS cursos_completados,
    ROUND(AVG(i.calificacion), 2) AS promedio_general,
    MAX(i.calificacion) AS mejor_nota,
    MIN(i.calificacion) AS peor_nota
FROM
    estudiantes e
    INNER JOIN inscripciones i ON i.estudiante_id = e.id
WHERE
    i.estado = 'completado'
    AND i.calificacion IS NOT NULL
GROUP BY
    e.id,
    e.nombre,
    e.apellido,
    e.ciudad
ORDER BY promedio_general DESC;

--* Rendimiento por curso
SELECT
    c.nombre AS curso,
    p.nombre || ' ' || p.apellido AS profesor,
    COUNT(
        CASE
            WHEN i.estado = 'completado' THEN 1
        END
    ) AS completados,
    COUNT(
        CASE
            WHEN i.estado = 'abandonado' THEN 1
        END
    ) AS abandonados,
    COUNT(
        CASE
            WHEN i.estado = 'activo' THEN 1
        END
    ) AS activos,
    ROUND(
        AVG(
            CASE
                WHEN i.estado = 'completado' THEN i.calificacion
            END
        ),
        2
    ) AS promedio_curso
FROM
    cursos c
    LEFT JOIN profesores p ON p.id = c.profesor_id
    LEFT JOIN inscripciones i ON i.curso_id = c.id
GROUP BY
    c.id,
    c.nombre,
    p.nombre,
    p.apellido
ORDER BY promedio_curso DESC NULLS LAST;

--* Mejores estudiantes por curso
-- Usamos una subconsulta para encontrar la calificación máxima por curso
SELECT
    c.nombre AS curso,
    e.nombre || ' ' || e.apellido AS mejor_estudiante,
    i.calificacion AS mejor_nota
FROM
    inscripciones i
    INNER JOIN estudiantes e ON e.id = i.estudiante_id
    INNER JOIN cursos c ON c.id = i.curso_id
WHERE
    i.calificacion = (
        SELECT MAX(i2.calificacion)
        FROM inscripciones i2
        WHERE
            i2.curso_id = i.curso_id
            AND i2.estado = 'completado'
    )
    AND i.estado = 'completado'
ORDER BY c.nombre;