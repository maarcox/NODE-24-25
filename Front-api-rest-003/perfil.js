document.addEventListener("DOMContentLoaded", async () => {
    const usuario_id = localStorage.getItem("usuario_id");
    if (!usuario_id) {
        window.location.href = "login/login.html";
        return;
    }

    const avatarInput = document.getElementById("edit-avatar-url");
    const avatarImg = document.getElementById("edit-avatar");
    const nameInput = document.getElementById("edit-name");

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuario_id}`);
        const data = await response.json();

        // Rellenar los campos con los datos actuales
        nameInput.value = data.nombre;
        avatarImg.src = data.avatar_url || "default.png";
        avatarInput.value = data.avatar_url || "";

    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
    }

    // 🔹 Actualiza la imagen en tiempo real al cambiar la URL
    avatarInput.addEventListener("input", () => {
        const newAvatar = avatarInput.value.trim();
        avatarImg.src = newAvatar || "default.png"; // Si borra la URL, se muestra una imagen por defecto
    });
});

async function updateProfile() {
    const usuario_id = localStorage.getItem("usuario_id");
    const nombre = document.getElementById("edit-name").value.trim();
    const avatar_url = document.getElementById("edit-avatar-url").value.trim();

    try {
        const response = await fetch(`http://localhost:3000/usuarios/${usuario_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, avatar_url })
        });

        const result = await response.json();
        alert(result.mensaje);
        window.location.href = "index.html"; // Redirigir a la página principal después de guardar
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
    }
}

function goHome() {
    window.location.href = "index.html";
}


