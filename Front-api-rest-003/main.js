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



//caRRUSEL


let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const carousel = document.querySelector(".carousel");

function showSlide(index) {
    slideIndex = index;
    const offset = -index * 100;  // 🔥 Mueve el carrusel en lugar de ocultar imágenes
    carousel.style.transform = `translateX(${offset}%)`;
    
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

function moveSlide(step) {
    slideIndex += step;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;
    showSlide(slideIndex);
}

function currentSlide(index) {
    showSlide(index);
}

function autoPlay() {
    moveSlide(1);
    setTimeout(autoPlay, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(slideIndex);
    setTimeout(autoPlay, 4000);
});
