const API_URL = "http://127.0.0.1:3000";
const GET_PELICULAS = API_URL + "/peliculas";
const GET_PELICULAS_BY_GENERO = "";
const GET_PELICULAS_FAVORITAS =  "";
const INSERT_PELICULAS = "";
const GET_USUARIOS = API_URL + "/usuarios/:id";


function getPeliculas(){
    alert("PASO 1");
    /*fetch()
        .then()
        .then(
         (data) =>{
                
            }
        )
        .catch()*/
        // http://127.0.0.1:3000/peliculas
        fetch(GET_PELICULAS)
        .then(response => response.json())
        .then(
            (data) =>{
                let idPelicula = data[0].id;
                let tituloPelicula = data[0].titulo;
            }
        )
        .catch()
}