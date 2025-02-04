document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña })
    });

    const data = await response.json();

    if (response.ok) {
        console.log("✅ Sesión iniciada. ID usuario:", data.usuario_id); // 🔥 Verifica el ID en la consola
        localStorage.setItem("usuario_id", data.usuario_id);  // Guarda el usuario en localStorage
        window.location.href = "../index.html";
    } else {
        alert(data.error);
    }
});


// Movimiento de Sonic y cambio de fondo

document.addEventListener("DOMContentLoaded", function() {
    const sonic = document.querySelector(".mickey"); // Ahora es Sonic
    const body = document.body;
    if (!sonic) return;
    
    let position = -150;
    sonic.style.position = "fixed";
    sonic.style.bottom = "10px";
    sonic.style.left = position + "px";

    function moveSonic() {
        position += 6; // Velocidad más rápida para Sonic
        sonic.style.left = position + "px";
        
        if (position < window.innerWidth) {
            requestAnimationFrame(moveSonic);
        } else {
            sonic.style.display = "none"; // Oculta Sonic al final
            setTimeout(() => {
                body.classList.add("dark-mode-transition"); // Aplica el cambio de fondo
                body.style.backgroundColor = "#000";
                body.style.color = "#FFF";
                document.querySelector(".login-container").style.backgroundColor = "#111"; // Cambio en contenedor
                document.querySelector(".login-container").style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)"; // Añade efecto de luz
            }, 500); // Retraso para hacer el cambio más visible
        }
    }
    
    setTimeout(moveSonic, 500); // Inicia la animación con un leve retraso
});
