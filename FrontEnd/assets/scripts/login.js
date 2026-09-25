const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // empêche le rechargement de la page

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Identifiants incorrects");
            }
            return response.json();
        })
        .then((data) => {
            // Connexion réussie : on stocke le token, puis redirection
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        })
        .catch((error) => {
            errorMessage.textContent = "Email ou mot de passe incorrect.";
            errorMessage.style.display = "block";
        });
});

/*Quand l'utilisateur soumet le formulaire, on récupère ce qu'il a tapé, on l'envoie au serveur pour vérification — si c'est correct, on garde une preuve de connexion (le token) et on le redirige vers l'accueil ; sinon, on lui affiche un message d'erreur, sans recharger la page.*/
