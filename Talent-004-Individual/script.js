let peliculas = [];

// Cargar el JSON de las películas
async function cargarPeliculas() {
    try {
        const response = await fetch('peliculas.json');
        peliculas = await response.json();
        mostrarPeliculas(peliculas);
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
    }
}

// Mostrar las películas en el contenedor
function mostrarPeliculas(peliculas) {
    const contenedor = document.getElementById("contenedorPeliculas");
    contenedor.innerHTML = "";

    if (peliculas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron películas con ese filtro.</p>";
        return;
    }

    peliculas.forEach(pelicula => {
        const div = document.createElement("div");
        div.classList.add("pelicula");

        div.innerHTML = `
            <img src="${pelicula.imagen}" alt="${pelicula.titulo}" class="imagen-pelicula">
            <h3>${pelicula.titulo}</h3>
            <p><strong>Género:</strong> ${pelicula.genero}</p>
            <p><strong>Año:</strong> ${pelicula.año}</p>
        `;

        contenedor.appendChild(div);
    });
}

// Filtrar películas por género
function filtrarPorGenero(genero) {
    const peliculasFiltradas = genero ? peliculas.filter(pelicula => pelicula.genero === genero) : peliculas;
    mostrarPeliculas(peliculasFiltradas);
}

// Buscar películas por título
function buscarPorTitulo() {
    const busqueda = document.getElementById("busquedaTitulo").value.toLowerCase();
    const peliculasFiltradas = peliculas.filter(pelicula => pelicula.titulo.toLowerCase().includes(busqueda));
    mostrarPeliculas(peliculasFiltradas);
}

// Ordenar películas por año
function ordenarPorAnio(ascendente) {
    const peliculasOrdenadas = peliculas.sort((a, b) => ascendente ? a.año - b.año : b.año - a.año);
    mostrarPeliculas(peliculasOrdenadas);
}

// Llamamos a la función para cargar las películas cuando la página cargue
window.onload = cargarPeliculas;
