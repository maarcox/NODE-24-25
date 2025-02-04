document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchMovies();
    setupCarousel();
});
function goHome() {
    window.location.href = "index.html"; // Redirige a la página principal
}

function checkSession() {
    const usuario_id = localStorage.getItem("usuario_id");

    console.log("Verificando sesión, usuario_id:", usuario_id); // 🔥 Depuración

    if (!usuario_id) {
        alert("Debes iniciar sesión para acceder a la página.");
        window.location.href = "login/login.html";  // Redirige si no hay sesión
    }
}

document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("usuario_id");  // 🔥 Elimina la sesión
    localStorage.removeItem("correo");
    window.location.href = "login/login.html";  // 🔥 Redirige al login
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

    const usuario_id = localStorage.getItem("usuario_id");

    movies.forEach(async movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        // Comprobar si la película está en favoritos
        let isFavorite = await checkIfFavorite(usuario_id, movie.id);

        movieElement.innerHTML = `
            <img src="${movie.imagen_url}" alt="${movie.titulo}">
            <div class="movie-info">
                <h3>${movie.titulo}</h3>
                <p>Año: ${movie.anio}</p>
                <p>Género: ${movie.genero}</p>
                  <button class="play-btn" 
                    onclick="playTrailer('${movie.trailer_url}', '${movie.titulo}', '${movie.genero}', '${movie.anio}', '${movie.imagen_url}')">
                    ▶ Ver Tráiler
                </button>
                <button class="fav-btn" onclick="${isFavorite ? `removeFromFavorites(${movie.id})` : `addToFavorites(${movie.id})`}">
                    ${isFavorite ? "❌ Quitar de Favoritos" : "❤️ Añadir a Favoritos"}
                </button>
            </div>
        `;

        container.appendChild(movieElement);
    });
}

async function checkIfFavorite(usuario_id, pelicula_id) {
    if (!usuario_id) return false;

    try {
        const response = await fetch(`http://localhost:3000/favoritos/${usuario_id}`);
        const favoritos = await response.json();

        return favoritos.some(fav => fav.id === pelicula_id);
    } catch (error) {
        console.error("Error al comprobar favoritos:", error);
        return false;
    }
}

function removeFromFavorites(pelicula_id) {
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
        alert("Debes iniciar sesión para gestionar favoritos.");
        return;
    }

    console.log("📤 Enviando petición para eliminar de favoritos:", { usuario_id, pelicula_id });

    fetch("http://localhost:3000/favoritos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: Number(usuario_id), pelicula_id: Number(pelicula_id) })
    })
    .then(response => response.json())
    .then(data => {
        console.log("📥 Respuesta del servidor:", data);
        if (data.mensaje) {
            alert(data.mensaje);
            fetchMovies(); // 🔄 Recargar la lista de películas para reflejar cambios
        } else {
            alert(data.error);
        }
    })
    .catch(error => console.error("Error al quitar de favoritos:", error));
}



function playTrailer(trailerUrl, titulo, genero, anio, imagenUrl) {
    if (!trailerUrl || trailerUrl === "null") {
        alert("No hay tráiler disponible para esta película.");
        return;
    }

    // Elimina cualquier modal previo
    const existingModal = document.querySelector(".modal");
    if (existingModal) existingModal.remove();

    // Crear el modal con la nueva estructura
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal()">&times;</span>
            <div class="modal-body">
                <div class="modal-left">
                    <img src="${imagenUrl}" class="modal-img" alt="${titulo}">
                </div>
                <div class="modal-right">
                    <div class="modal-info">
                        <h2>${titulo}</h2>
                        <p><strong>Género:</strong> ${genero || "Desconocido"}</p>
                        <p><strong>Año:</strong> ${anio}</p>
                    </div>
                    <div class="video-container">
                        <iframe src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Agregar el modal al body
    document.body.appendChild(modal);
}



function closeModal() {
    document.querySelector(".modal").remove();
}
function addToFavorites(pelicula_id) {
    const usuario_id = localStorage.getItem("usuario_id"); // Obtiene el ID del usuario logueado

    console.log("📤 Enviando a favoritos:", { usuario_id, pelicula_id }); // 🔥 Depuración

    if (!usuario_id || !pelicula_id) {  // Verifica si alguno es null o undefined
        alert("Error: usuario_id o pelicula_id no válidos.");
        return;
    }

    fetch("http://localhost:3000/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: Number(usuario_id), pelicula_id: Number(pelicula_id) }) // Convertir a número
    })
    .then(response => response.json())
    .then(data => {
        console.log("📥 Respuesta del servidor:", data); // 🔥 Verificar la respuesta del backend
        alert(data.mensaje || data.error);
    })
    .catch(error => console.error("Error al agregar a favoritos:", error));
}




function showFavorites() {
    const usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
        alert("Debes iniciar sesión para ver tus favoritos");
        return;
    }

    fetch(`http://localhost:3000/favoritos/${usuario_id}`)
        .then(response => response.json())
        .then(data => displayMovies(data))
        .catch(error => console.error("Error al obtener favoritos:", error));
}



        // Evento para mostrar la información al pasar el mouse
        movieElement.addEventListener("mouseover", () => {
            movieElement.querySelector(".movie-info").style.opacity = "1";
        });

        // Evento para ocultar la información al salir el mouse
        movieElement.addEventListener("mouseleave", () => {
            movieElement.querySelector(".movie-info").style.opacity = "0";
        });

        container.appendChild(movieElement);
        

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

displayMovies

document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchMovies();
    setupCarousel();
});

// ✅ Variables globales para el carrusel
let slideIndex = 0;
let slides, dots, carouselTimer;

// ✅ Configurar carrusel después de cargar la página
function setupCarousel() {
    slides = document.querySelectorAll(".slide");
    dots = document.querySelectorAll(".dot");

    if (slides.length > 0) {
        showSlide(slideIndex);
        carouselTimer = setInterval(() => moveSlide(1), 4000);
    }
}

// ✅ Mueve el carrusel adelante o atrás
function moveSlide(step) {
    slideIndex += step;
    if (slideIndex >= slides.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = slides.length - 1;

    showSlide(slideIndex);
}

// ✅ Cambia a una imagen específica
function currentSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
}

// ✅ Función para mostrar un slide específico
function showSlide(index) {
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));

    slides[index].style.display = "block";
    dots[index].classList.add("active");
}

// ✅ Resetear el temporizador cuando el usuario navega manualmente
function resetTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => moveSlide(1), 4000);
}


