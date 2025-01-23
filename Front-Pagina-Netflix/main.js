let urlObtenerListaPokemon = 'https://pokeapi.co/api/v2/pokemon/';

function cargarPokemons(){
    alert("LLegó a la función Pokemons")
    // Llamamos a la API de pokemon con Fetch
    fetch(urlObtenerListaPokemon)
        .then(res=>res.json())
        .then(res=>{
            console.log(res)
            let listaPokemon = res.results
            console.log(listaPokemon)
        });
}

function cargarPeliculas(){
    alert("LLegó a la función Peliculas")
    fetch("http://127.0.0.1:3000/peliculas")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    });
}

function cargarPeliculasDrama(){
    alert("Botón películas Drama pulsado")
    fetch("http://127.0.0.1:3000/peliculas/genero/Drama")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    });
}

function cargarPeliculasComedia(){
    alert("Botón películas Comedia pulsado")
    fetch("http://127.0.0.1:3000/peliculas/genero/Comedia")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    });
}

function cargarPeliculasAccion(){
    alert("Botón películas Accion pulsado")
    fetch("http://127.0.0.1:3000/peliculas/genero/Accion")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    });
}