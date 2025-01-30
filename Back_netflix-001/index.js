const express = require("express"); // API REST -> NODE JS CON EXPRESS
const { Pool } = require("pg");      // HABLAR BD PG DE AWS

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;
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
        "SELECT * FROM peliculas1;"
    );
    res.json(rows);
    // res.send("Bienvenido a mi API DISNEY");
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
