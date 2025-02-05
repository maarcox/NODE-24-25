// IMPORTS EN JAVA
const express = require("express"); // API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg");      // HABLAR BD PG DE AWS
const cors = require("cors");
// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    //Disney
    host: "disney.c140s0es0k6p.us-east-1.rds.amazonaws.com",
    //BBDD PRUEBAS host: "netflix-01.cj6qyww46nmx.us-east-1.rds.amazonaws.com",
    database: "postgres",
    //DISNEY
    password: "afm12345",
    //Contraseña BBDD PRUEBA password: "12345678", 
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Cambia a false si tienes problemas de certificados pero trata de evitarlo por seguridad
      // ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
      // Es posible que AWS RDS requiera parámetros SSL específicos o archivos CA.
      // Comprueba la documentación de AWS RDS para obtener los detalles exactos.
    },
  });

  // Registro de usuario
app.post("/register", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Insertar usuario en la base de datos
        await pool.query("INSERT INTO usuarios (correo, contraseña) VALUES ($1, $2)", [correo, hashedPassword]);

        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }
});

// Inicio de sesión
app.post("/login", async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const user = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

        const validPassword = await bcrypt.compare(contraseña, user.rows[0].contraseña);
        if (!validPassword) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

        console.log("Usuario autenticado:", user.rows[0].id); // 🔥 Depuración
        res.json({ mensaje: "Inicio de sesión exitoso", usuario_id: user.rows[0].id });  // ✅ Enviar usuario_id correctamente
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

app.post("/favoritos", async (req, res) => {
    const { usuario_id, pelicula_id } = req.body;

    console.log("🚀 Recibiendo datos del frontend:", { usuario_id, pelicula_id }); // 🔥 Depuración

    try {
        if (!usuario_id || !pelicula_id) {
            console.error("❌ Faltan datos: usuario_id o pelicula_id");
            return res.status(400).json({ error: "Faltan datos: usuario_id o pelicula_id" });
        }

        // Verificar si ya está en favoritos
        const existe = await pool.query(
            "SELECT * FROM favoritos WHERE usuario_id = $1 AND pelicula_id = $2",
            [usuario_id, pelicula_id]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ error: "Esta película ya está en favoritos" });
        }

        // Insertar en la base de datos
        await pool.query(
            "INSERT INTO favoritos (usuario_id, pelicula_id) VALUES ($1, $2)",
            [usuario_id, pelicula_id]
        );

        res.json({ mensaje: "Película añadida a favoritos" });
    } catch (error) {
        console.error("🚨 Error en /favoritos:", error);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});



app.get("/favoritos/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const { rows } = await pool.query(
            `SELECT p.id, p.titulo, p.anio, g.titulo AS genero, p.imagen_url, p.trailer_url
             FROM favoritos f
             JOIN peliculas p ON f.pelicula_id = p.id
             JOIN genero g ON p.genero_id = g.id
             WHERE f.usuario_id = $1`,
            [usuario_id]
        );

        res.json(rows);
    } catch (error) {
        console.error("🚨 Error al obtener favoritos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.delete("/favoritos", async (req, res) => {
    const { usuario_id, pelicula_id } = req.body;

    console.log("🚀 Recibiendo datos para eliminar de favoritos:", req.body);

    if (!usuario_id || !pelicula_id) {
        return res.status(400).json({ error: "Faltan datos: usuario_id o pelicula_id" });
    }

    try {
        const result = await pool.query(
            "DELETE FROM favoritos WHERE usuario_id = $1 AND pelicula_id = $2",
            [usuario_id, pelicula_id]
        );

        if (result.rowCount > 0) {
            res.json({ mensaje: "Película eliminada de favoritos" });
        } else {
            res.status(404).json({ error: "Película no encontrada en favoritos" });
        }
    } catch (error) {
        console.error("🚨 Error en /favoritos DELETE:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});





// Endpoint para obtener las películas por género con el parámetro en la ruta
app.get("/peliculas", async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.id, p.titulo, p.descripcion, p.anio, 
                   g.titulo AS genero, p.imagen_url, p.trailer_url
            FROM peliculas p
            JOIN genero g ON p.genero_id = g.id;
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta de películas:", error);
        res.status(500).json({ error: "Error al obtener las películas" });
    }
});


app.get("/peliculas/trailers", async (req, res) => {
    const {rows} = await pool.query(
        "SELECT id, titulo, trailer_url FROM peliculas WHERE trailer_url IS NOT NULL;"
    );
    res.json(rows);
    // res.send("Bienvenido a mi API DISNEY");
  });
  
  
  
  
  app.get("/peliculas/genero/:genero", async (req, res) => {
    const { genero } = req.params;

    let query = `
        SELECT p.id, p.titulo, p.anio, g.titulo AS genero, p.imagen_url, p.trailer_url
        FROM peliculas p
        JOIN genero g ON p.genero_id = g.id
        WHERE g.titulo ILIKE $1
    `;

    const values = [`%${genero}%`];

    console.log("🛠 Consulta SQL:", query);
    console.log("📌 Valores:", values);

    try {
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            console.log("❌ No se encontraron películas para este género.");
            return res.status(404).json({ error: "No se encontraron películas para este género." });
        }

        console.log("✅ Películas encontradas:", rows);
        res.json(rows);
    } catch (err) {
        console.error("🚨 Error en la consulta SQL:", err);
        res.status(500).json({ error: "Error al obtener las películas por género." });
    }
});


// ✅ **Endpoint para obtener películas por categoría**
app.get("/peliculas/categoria/:categoria", async (req, res) => {
    const { categoria } = req.params;

    try {
        const { rows } = await pool.query(
            `SELECT p.id, p.titulo, p.anio, c.nombre AS categoria, g.titulo AS genero, p.imagen_url, p.trailer_url
             FROM peliculas p
             JOIN categoria c ON p.categoria_id = c.id
             JOIN genero g ON p.genero_id = g.id
             WHERE c.nombre ILIKE $1;`,
            [`%${categoria}%`]
        );

        res.json(rows);
    } catch (err) {
        console.error("🚨 Error en la consulta SQL:", err);
        res.status(500).json({ error: "Error al obtener las películas por categoría." });
    }
});


    

    // CONSULTAR -> SELECT * FROM USUARIOS, PELICULAS
    app.get("/usuarios/", (req, res) =>{
        // req -> no lo necesito
        // res -> sí
        res.send('Has solicitado una lista de usuarios');
    }); 

    app.get("/usuarios/:id", async (req, res) => {
        const { id } = req.params;
    
        try {
            const { rows } = await pool.query(
                "SELECT id, correo, nombre, avatar_url FROM usuarios WHERE id = $1",
                [id]
            );
    
            if (rows.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
    
            res.json(rows[0]);
        } catch (error) {
            console.error("🚨 Error al obtener usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });
    app.put("/usuarios/:id", async (req, res) => {
        const { id } = req.params;
        const { nombre, avatar_url } = req.body;
    
        try {
            await pool.query(
                "UPDATE usuarios SET nombre = $1, avatar_url = $2 WHERE id = $3",
                [nombre, avatar_url, id]
            );
    
            res.json({ mensaje: "Perfil actualizado correctamente" });
        } catch (error) {
            console.error("🚨 Error al actualizar perfil:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    });
     

    

    // ----
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
      });


    
      
    // LOGIN, PELÍCULAS POR CATEGORÍAS
        // ADD -> INSERT
        //     app.post("/usuarios/", (req, res)); 
    // ELIMINAR -> DELETE                            
        // app.delete("/usuarios/", (req, res)); 
    // MODIFICAR -> UPDATE
        // app.put("/usuarios/", (req, res));    

 


/*17-01-2025*/
// listar películas NODE JS CON AWS
// API REST
/* //borrar esto pa descomentar y la del final
// IMPORTS EN JAVA
const express = require("express"); // API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg");      // HABLAR BD PG DE AWS
const cors = require("cors");
// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    host: "netflix-01.cj6qyww46nmx.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "12345678", // Considera usar variables de entorno para gestionar contraseñas
    port: 5432,
    ssl: {
      rejectUnauthorized: false, // Cambia a false si tienes problemas de certificados pero trata de evitarlo por seguridad
      // ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
      // Es posible que AWS RDS requiera parámetros SSL específicos o archivos CA.
      // Comprueba la documentación de AWS RDS para obtener los detalles exactos.
    },
  });
  app.get("/peliculas", async (req, res)=>{
    const {rows} = await pool.query(
        "SELECT * FROM peliculas;"
    );
    res.json(rows);
    // res.send("Bienvenido a mi API DISNEY");
});

app.get("/peliculas/:titulo", async (req, res) => {
    const { titulo } = req.params;  // Obtiene el título de la URL
    const { rows } = await pool.query(
        "SELECT * FROM PELICULAS WHERE titulo = $1", [titulo]
    );
    res.json(rows);
});

app.post("/peliculas/:titulo/:director/:anio/:Genero", async (req, res) => {
    const { titulo, director, anio, Genero } = req.params; // Obtener los parámetros de la URL

    // Validar que todos los parámetros estén presentes
    if (!titulo || !director || !anio || !Genero ) {
        return res.status(400).json({ message: "Todos los parámetros son requeridos" });
    }

    try {
        // Inserción en la base de datos
        const { rows } = await pool.query(
            "INSERT INTO PELICULAS (titulo, director, anio, Genero ) VALUES ($1, $2, $3, $4) RETURNING *",
            [titulo, director, anio, Genero]
        );

        // Devolver la película insertada
        res.status(201).json({ message: "Película añadida exitosamente", pelicula: rows[0] });
    } catch (error) {
        console.error("Error al insertar la película:", error);
        res.status(500).json({ message: "Hubo un error al insertar la película" });
    }

});

app.get("/peliculas/genero/:genero", async (req, res) => {
    const { genero } = req.params;  // Obtener el género de la URL

    if (!genero) {
        return res.status(400).json({ message: "El género es requerido" });
    }

    try {
        // Consulta a la base de datos para buscar películas por género
        const { rows } = await pool.query(
            "SELECT * FROM PELICULAS WHERE genero = $1",
            [genero]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron películas para este género" });
        }

        // Devolver las películas encontradas
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al buscar películas por género:", error);
        res.status(500).json({ message: "Hubo un error al buscar las películas" });
    }
});



    

    // CONSULTAR -> SELECT * FROM USUARIOS, PELICULAS
    app.get("/usuarios/", (req, res) =>{
        // req -> no lo necesito
        // res -> sí
        res.send('Has solicitado una lista de usuarios');
    }); 

    app.get("/usuarios/:id", (req, res) =>{
        const userId = req.params.id;
        res.send(`El ID del usuario es: ${userId}`);
    });

    // ----
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
      });
    // LOGIN, PELÍCULAS POR CATEGORÍAS
        // ADD -> INSERT
        //     app.post("/usuarios/", (req, res)); 
    // ELIMINAR -> DELETE                            
        // app.delete("/usuarios/", (req, res)); 
    // MODIFICAR -> UPDATE
        // app.put("/usuarios/", (req, res));    


  */ 
