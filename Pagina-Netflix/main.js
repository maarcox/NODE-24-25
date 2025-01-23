let urlObtenerListaPokemon = 'https://pokeapi.co/api/v2/pokemon/';

function cargarPokemons(){
    alert("LLego a la funcion JAVASCRIPT")
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
    alert("LLego a la funcion Peliculas")
    fetch("http://127.0.0.1:3000/peliculas")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        
    
    });
}

function cargarPeliculasDrama(){
    alert("Boton peliculas pulsado")
    fetch("http://127.0.0.1:3000/peliculas/genero/Drama")
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
    });
}