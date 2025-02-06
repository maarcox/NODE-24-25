document.addEventListener("DOMContentLoaded", () => {
    checkAdminSession();
    loadGenres();
    loadCategories();
    loadMovies();
    document.getElementById("movie-form").addEventListener("submit", saveMovie);
});

async function loadGenres() {
    try {
        const response = await fetch("http://localhost:3000/generos"); // ✅ Nuevo endpoint
        const generos = await response.json();

        const selectGenero = document.getElementById("genero");
        selectGenero.innerHTML = '<option value="">Selecciona un género</option>';
        
        generos.forEach(genero => {
            const option = document.createElement("option");
            option.value = genero.id;  // ID del género
            option.textContent = genero.titulo; // Nombre del género
            selectGenero.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
}

// 🔹 Cargar categorías desde el backend usando el nuevo endpoint
async function loadCategories() {
    try {
        const response = await fetch("http://localhost:3000/categorias"); // ✅ Nuevo endpoint
        const categorias = await response.json();

        const selectCategoria = document.getElementById("categoria");
        selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;  // ID de la categoría
            option.textContent = categoria.nombre; // Nombre de la categoría
            selectCategoria.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}





function checkAdminSession() {
    const usuario_id = localStorage.getItem("usuario_id");
    
    if (!usuario_id) {
        alert("Debes iniciar sesión como administrador para acceder a esta página.");
        window.location.href = "../login/login.html";
        return;
    }

    fetch(`http://localhost:3000/usuarios/${usuario_id}`)
        .then(response => response.json())
        .then(user => {
            if (user.rol !== "admin") {
                alert("No tienes permisos para acceder a esta página.");
                window.location.href = "../index.html";
            }
        })
        .catch(error => console.error("Error al verificar el usuario:", error));
}

document.getElementById("add-movie-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const pelicula = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        anio: parseInt(document.getElementById("anio").value),
        genero_id: parseInt(document.getElementById("genero").value),  // Asegúrate de que sean IDs válidos
        categoria_id: parseInt(document.getElementById("categoria").value),
        imagen_url: document.getElementById("imagen_url").value,
        trailer_url: document.getElementById("trailer_url").value
    };

    try {
        const response = await fetch("http://localhost:3000/peliculas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Película agregada con éxito");
        } else {
            alert("Error al agregar película: " + data.error);
        }
    } catch (error) {
        console.error("Error al enviar la película:", error);
    }
});

let editingMovieId = null; // Variable para saber si estamos editando una película

async function editMovie(id) {
    try {
        const response = await fetch(`http://localhost:3000/peliculas/${id}`);
        const movie = await response.json();

        // Llenar el formulario con los datos de la película
        document.getElementById("titulo").value = movie.titulo;
        document.getElementById("descripcion").value = movie.descripcion;
        document.getElementById("anio").value = movie.anio;
        document.getElementById("genero").value = movie.genero_id;
        document.getElementById("categoria").value = movie.categoria_id;
        document.getElementById("imagen_url").value = movie.imagen_url;
        document.getElementById("trailer_url").value = movie.trailer_url;

        // Guardar el ID de la película en edición
        editingMovieId = id;

        // Cambiar el texto del botón para indicar que es una edición
        document.getElementById("add-movie-btn").textContent = "Guardar Cambios";
    } catch (error) {
        console.error("Error al obtener datos de la película:", error);
    }
}


async function loadMovies() {
    try {
        const response = await fetch("http://localhost:3000/peliculas");
        const movies = await response.json();
        const moviesContainer = document.getElementById("movies-container");
        moviesContainer.innerHTML = "";

        movies.forEach(movie => {
            const movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");
            movieItem.innerHTML = `
                <img src="${movie.imagen_url}" alt="${movie.titulo}">
                <h4>${movie.titulo} (${movie.anio})</h4>
                <button class="edit-btn" onclick="editMovie(${movie.id})">✏️ Editar</button>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})">🗑 Eliminar</button>
            `;
            moviesContainer.appendChild(movieItem);
        });
    } catch (error) {
        console.error("Error al cargar películas:", error);
    }
}

async function saveMovie(event) {
    event.preventDefault();

    const pelicula = {
        titulo: document.getElementById("titulo").value,
        descripcion: document.getElementById("descripcion").value,
        anio: parseInt(document.getElementById("anio").value),
        genero_id: parseInt(document.getElementById("genero").value),
        categoria_id: parseInt(document.getElementById("categoria").value),
        imagen_url: document.getElementById("imagen_url").value,
        trailer_url: document.getElementById("trailer_url").value
    };

    const method = editingMovieId ? "PUT" : "POST";
    const url = editingMovieId
        ? `http://localhost:3000/peliculas/${editingMovieId}`
        : "http://localhost:3000/peliculas";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula)
        });

        const data = await response.json();
        alert(data.mensaje);

        // Reiniciar formulario y actualizar lista de películas
        document.getElementById("add-movie-form").reset();
        document.getElementById("add-movie-btn").textContent = "Agregar Película";
        editingMovieId = null;
        loadMovies();
    } catch (error) {
        console.error("Error al guardar la película:", error);
    }
}

async function deleteMovie(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar esta película?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/peliculas/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        alert(data.mensaje);
        loadMovies(); // Actualizar la lista después de eliminar
    } catch (error) {
        console.error("Error al eliminar la película:", error);
    }
}


function goHome() {
    window.location.href = "../index.html"; // Redirige a la página principal
}

