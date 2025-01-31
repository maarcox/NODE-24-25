document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});

function fetchMovies() {
    fetch("http://localhost:3000/peliculas")
        .then(response => response.json())
        .then(data => displayMovies(data))
        .catch(error => console.error("Error al obtener las películas:", error));
}

function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = "";
    
    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <img src="${movie.imagen_url}" alt="${movie.titulo}">
            <h3>${movie.titulo} (${movie.anio})</h3>
            
        `;
        container.appendChild(movieElement);
    });
}

function searchMovies() {
    const query = document.getElementById("search").value;
    fetch(`http://localhost:3000/peliculas`)
        .then(response => response.json())
        .then(data => {
            const filteredMovies = data.filter(movie => movie.titulo.toLowerCase().includes(query.toLowerCase()));
            displayMovies(filteredMovies);
        });
}

function filterByGenre(genre) {
    fetch(`http://localhost:3000/peliculas/genero/${genre}`)
        .then(response => response.json())
        .then(data => displayMovies(data));
}

function filterByCategory(category) {
    fetch(`http://localhost:3000/peliculas/categoria/${category}`)
        .then(response => response.json())
        .then(data => displayMovies(data));
}

document.getElementById("home-btn").addEventListener("click", () => {
    fetchMovies(); // Carga todas las películas
});
