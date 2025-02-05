document.addEventListener("DOMContentLoaded", async () => {
    const usuario_id = localStorage.getItem("usuario_id");
    if (!usuario_id) {
        window.location.href = "login/login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuario_id}`);
        const data = await response.json();

        document.getElementById("edit-name").value = data.nombre;
        document.getElementById("edit-avatar").src = data.avatar_url;
        document.getElementById("edit-avatar-url").value = data.avatar_url;
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
    }
});

async function updateProfile() {
    const usuario_id = localStorage.getItem("usuario_id");
    const nombre = document.getElementById("edit-name").value;
    const avatar_url = document.getElementById("edit-avatar-url").value;

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuario_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, avatar_url })
        });

        const result = await response.json();
        alert(result.mensaje);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
    }
}

function goHome() {
    window.location.href = "index.html";
}
