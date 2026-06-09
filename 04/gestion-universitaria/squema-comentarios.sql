-- =============================================
-- 🎓 SISTEMA DE GESTIÓN UNIVERSITARIA
-- * Paso 1: Creación de tablas (DDL = lenguaje para definir la estructura)
-- =============================================

-- Tabla de profesores
-- Guarda la info básica de cada profesor de la universidad
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY, -- número único que identifica a cada profesor (se genera solo)
    nombre VARCHAR(100) NOT NULL, -- nombre, obligatorio
    apellido VARCHAR(100) NOT NULL, -- apellido, obligatorio
    email VARCHAR(150) UNIQUE NOT NULL, -- email único (no puede repetirse) y obligatorio
    especialidad VARCHAR(100), -- área en la que se especializa (opcional)
    fecha_ingreso DATE DEFAULT CURRENT_DATE -- si no se pone fecha, usa el día de hoy
);

-- Tabla de estudiantes
-- Guarda la info básica de cada estudiante
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    fecha_nacimiento DATE, -- opcional
    ciudad VARCHAR(100) -- ciudad donde vive (opcional)
);

-- Tabla de cursos
-- Guarda cada materia/curso que se ofrece en la universidad
CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT, -- descripción larga del curso (opcional)
    creditos INTEGER CHECK ( -- los créditos deben ser entre 1 y 10
        creditos > 0
        AND creditos <= 10
    ),
    profesor_id INTEGER REFERENCES profesores (id) ON DELETE SET NULL,
    -- profesor_id conecta este curso con un profesor de la tabla profesores
    -- si el profesor se borra, el campo queda en NULL (el curso no se borra)
    fecha_inicio DATE,
    fecha_fin DATE,
    CHECK (fecha_fin > fecha_inicio) -- validación: la fecha de fin debe ser posterior a la de inicio
);

-- Tabla de inscripciones
-- Es la tabla intermedia que conecta estudiantes con cursos (relación muchos a muchos)
-- Un estudiante puede estar en muchos cursos, y un curso puede tener muchos estudiantes
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INTEGER NOT NULL REFERENCES estudiantes (id) ON DELETE CASCADE,
    -- si se borra un estudiante, se borran todas sus inscripciones automáticamente
    curso_id INTEGER NOT NULL REFERENCES cursos (id) ON DELETE CASCADE,
    -- si se borra un curso, se borran todas sus inscripciones automáticamente
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    calificacion DECIMAL(4, 2) CHECK ( -- nota entre 0.00 y 10.00
        calificacion >= 0
        AND calificacion <= 10
    ),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (
        estado IN (
            'activo',
            'completado',
            'abandonado'
        )
        -- solo puede tener uno de estos tres valores
    ),
    UNIQUE (estudiante_id, curso_id) -- un estudiante no puede inscribirse dos veces al mismo curso
);

-- =============================================
-- Paso 2: Carga de datos de prueba
-- =============================================

-- Insertamos 5 profesores con sus datos
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

-- Insertamos 8 estudiantes de distintas ciudades
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

-- Insertamos 6 cursos, cada uno asignado a un profesor (por su id)
-- El curso 6 "Programación Web II" no tendrá inscriptos a propósito,
-- para poder practicar la consulta "cursos vacíos"
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

-- Insertamos las inscripciones de cada estudiante
-- Cada fila representa: qué estudiante está en qué curso, con qué nota y qué estado
INSERT INTO
    inscripciones (
        estudiante_id,
        curso_id,
        fecha_inscripcion,
        calificacion,
        estado
    )
VALUES
    -- Agustín (id=1): muy buen estudiante, completó 3 cursos con notas altas
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

-- Camila (id=2): completó 3 cursos con notas buenas
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

-- Lucas (id=3): completó 2 cursos, pero abandonó uno (calificacion NULL = sin nota)
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

-- Valentina (id=4): está activa en 2 cursos pero todavía no tiene notas
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

-- Mateo (id=5): buen desempeño en 3 cursos
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

-- Julieta (id=6): completó 2 cursos con notas más bajas
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

-- Santiago (id=7): pocos cursos pero las mejores notas
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

-- Lucía (id=8): inscripta en 3 cursos con notas regulares/buenas
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
-- Paso 3: Consultas simples (una sola tabla)
-- =============================================

-- Cuenta cuántos estudiantes hay en total
-- MAX(id) no es la mejor opción si hay registros borrados, COUNT(*) es más preciso
SELECT max(id) AS total_estudiantes FROM estudiantes;

SELECT COUNT(*) AS total_estudiantes FROM estudiantes;

-- ¿Cuántas inscripciones hay por cada estado? (activo, completado, abandonado)
-- GROUP BY agrupa las filas por el valor de "estado" y COUNT cuenta cuántas hay en cada grupo
SELECT estado, COUNT(*) AS cantidad
FROM inscripciones
GROUP BY
    estado
ORDER BY cantidad DESC;

-- ¿Cuántos cursos dicta cada profesor?
-- LEFT JOIN para incluir también a los profesores que no tienen ningún curso asignado
-- GROUP BY agrupa por profesor para contar sus cursos
-- El || es para concatenar (unir) el nombre y el apellido en una sola columna
SELECT
    p.nombre || ' ' || p.apellido AS profesor,
    COUNT(c.id) AS cantidad_cursos
FROM profesores p
    LEFT JOIN cursos c ON c.profesor_id = p.id
GROUP BY
    p.id,
    p.nombre,
    p.apellido
ORDER BY cantidad_cursos DESC;

-- =============================================
-- Paso 4: Consultas cruzando varias tablas (JOINs)
-- =============================================

-- ¿Qué estudiantes están inscriptos en cada curso?
-- Cruzamos 3 tablas: inscripciones + estudiantes + cursos
-- INNER JOIN porque solo nos interesan las inscripciones que existen
SELECT c.nombre AS curso, e.nombre || ' ' || e.apellido AS estudiante, i.calificacion, i.estado
FROM
    inscripciones i
    INNER JOIN estudiantes e ON e.id = i.estudiante_id -- conecta inscripcion con el estudiante
    INNER JOIN cursos c ON c.id = i.curso_id -- conecta inscripcion con el curso
ORDER BY c.nombre, e.apellido;

-- ¿Qué cursos dicta cada profesor?
-- INNER JOIN porque solo queremos profesores que tienen cursos asignados
SELECT p.nombre || ' ' || p.apellido AS profesor, p.especialidad, c.nombre AS curso, c.creditos
FROM profesores p
    INNER JOIN cursos c ON c.profesor_id = p.id
ORDER BY p.apellido, c.nombre;

-- ¿Qué cursos no tienen ningún inscripto?
-- LEFT JOIN desde cursos hacia inscripciones: trae todos los cursos aunque no tengan inscripciones
-- WHERE i.id IS NULL filtra solo los que NO tienen ninguna inscripción (los "vacíos")
SELECT c.nombre AS curso, c.fecha_inicio, p.nombre || ' ' || p.apellido AS profesor
FROM
    cursos c
    LEFT JOIN inscripciones i ON i.curso_id = c.id
    LEFT JOIN profesores p ON p.id = c.profesor_id
WHERE
    i.id IS NULL -- si i.id es NULL significa que no hubo ninguna coincidencia = sin inscriptos
ORDER BY c.nombre;

-- ¿Cuántos estudiantes tiene cada curso?
-- LEFT JOIN para incluir también el curso sin inscriptos (Programación Web II)
-- COUNT(i.estudiante_id) cuenta solo las filas que tienen valor (ignora NULL)
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

-- Ranking de estudiantes por promedio general
-- Solo considera inscripciones "completadas" con nota (excluye activos y abandonados)
-- AVG calcula el promedio, ROUND lo redondea a 2 decimales
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
    AND i.calificacion IS NOT NULL -- excluye los abandonados que tienen NULL en calificacion
GROUP BY
    e.id,
    e.nombre,
    e.apellido,
    e.ciudad
ORDER BY promedio_general DESC;

-- Rendimiento por curso: cuántos completaron, abandonaron o siguen activos
-- CASE WHEN funciona como un "si... entonces": cuenta solo los que cumplen la condición
SELECT
    c.nombre AS curso,
    p.nombre || ' ' || p.apellido AS profesor,
    COUNT(
        CASE
            WHEN i.estado = 'completado' THEN 1
        END
    ) AS completados, -- cuenta solo los completados
    COUNT(
        CASE
            WHEN i.estado = 'abandonado' THEN 1
        END
    ) AS abandonados, -- cuenta solo los abandonados
    COUNT(
        CASE
            WHEN i.estado = 'activo' THEN 1
        END
    ) AS activos, -- cuenta solo los activos
    ROUND(
        AVG(
            CASE
                WHEN i.estado = 'completado' THEN i.calificacion
            END
        ), -- promedio solo de completados
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
-- NULLS LAST pone al final los cursos sin promedio (sin inscriptos)

-- Mejor estudiante por curso
-- La subconsulta (SELECT MAX...) busca la nota más alta dentro de ese mismo curso
-- Luego el WHERE compara la calificacion de cada fila con ese máximo
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
        -- subconsulta: busca la calificación más alta del curso actual
        SELECT MAX(i2.calificacion)
        FROM inscripciones i2
        WHERE
            i2.curso_id = i.curso_id -- mismo curso que la fila que estamos evaluando
            AND i2.estado = 'completado'
    )
    AND i.estado = 'completado'
ORDER BY c.nombre;