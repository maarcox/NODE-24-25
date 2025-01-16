// API REST

// IMPORTS EN JAVA
const express = require("express"); // API REST -> NODE JS CON EXPRESS
const { Pool} = require("pg"); // HABLAR BD OG DE AWS

// INSTANCIAR LOS OBJETOS QUE NECESITAMOS
const app = express();
const port = 3000;
// CONFIGURACIÓN DE LA BASE DE DATOS
        const pool = new Pool({
            user: "postgres",
            host: "netflix-01.cj6qyww46nmx.us-east-1.rds.amazonaws.com",
            database: "postgres",
            password: "12345678",
            port: 5432,
        });
    app.get("/peliculas", async (req, res) =>{
        const result = pool.query("SELECT * FROM PELICULAS");
        res.json(result.rows);

    });

    // CONSULTAR -> SELECT * FROM USUARIOS, PELICULAS
    app.get("/usuarios/", (req, res) =>{
        // request -> no lo necesito
        // res -> sí
        res.send('Has solicitado una lista de usuario')
    }) ;

    app.get("/usuarios/:id", (req, res) =>{
        const userID = req.params.id;
        res.send(`EL ID Del usuario es: ${userID}`);
    });
    // ---
    app.listen(port, () =>{
        console.log(`Servidor corriendo en http://localhost:${port}`)
    });

    // LOGIN, PELÍCULAS POR CATEGORIAS
    // ADD -> INSERT
    // app.post("/usuarios/", (req, res) ); 
    
    // ELIMINAR -> DELETE
    //app.delete("/usuarios/", (req, res)); 

    // MODIFICAR -> UPDATE
    //app.put("/usuarios/", (req, res)); 




