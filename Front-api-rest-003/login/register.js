document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("email").value;
    const contraseña = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ correo, contraseña })
    });

    const data = await response.json();
    alert(data.mensaje || data.error);

    if (response.ok) {
        window.location.href = "login.html";
    }
});
