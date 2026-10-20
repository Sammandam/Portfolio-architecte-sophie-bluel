const worksUrl = "http://localhost:5678/api/works";
const gallery = document.getElementById("gallery");

function createWorkElement(work) {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
}

function displayWorks(works) {
    gallery.innerHTML = "";
    works.forEach((work) => {
        gallery.appendChild(createWorkElement(work));
    });
}

fetch(worksUrl)
    .then((response) => response.json())
    .then((works) => {
        displayWorks(works);
        allWorks = works; // pour l'etape 3 //

        // la galerie vient de s'afficher : on revient à la section demandée dans l'URL (#contact, #portfolio...)
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView();
            }
        }
    })
    .catch((error) => console.error(error));

// on a remplacé les images fixes du HTML par un affichage dynamique
// le JavaScript va chercher les travaux directement dans le back-end (avec fetch), puis crée et insère automatiquement chaque <figure> dans la galerie.
//--------------------------------//

const categoriesUrl = "http://localhost:5678/api/categories";
const filtersContainer = document.getElementById("filters");

let allWorks = []; // on garde tous les travaux en mémoire pour pouvoir filtrer

// Crée un bouton de filtre, avec sa gestion de clic
function createFilterButton(label, categoryId) {
    const button = document.createElement("button");
    button.textContent = label;

    button.addEventListener("click", () => {
        document.querySelectorAll(".filters button").forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        // Filtrage selon la catégorie cliquée
        if (categoryId === "all") {
            displayWorks(allWorks);
        } else {
            const filtered = allWorks.filter((work) => work.categoryId === categoryId);
            displayWorks(filtered);
        }
    });

    return button;
}

function displayFilters(categories) {// on vide le conteneur de filtres avant d'ajouter les boutons //
    filtersContainer.innerHTML = "";

    const allButton = createFilterButton("Tous", "all");
    allButton.classList.add("active");
    filtersContainer.appendChild(allButton);

    // Un bouton par catégorie reçue de l'API
    categories.forEach((category) => {
        filtersContainer.appendChild(createFilterButton(category.name, category.id));
    });
}
   
// Récupération des catégories
fetch(categoriesUrl)
    .then((response) => response.json())
    .then((categories) => {
        displayFilters(categories);
    })
    .catch((error) => console.error(error));


// On récupère la liste des catégories depuis l'API, on crée un bouton pour chacune (plus un bouton fixe 'Tous')
// et on ajoute à chaque bouton un comportement : au clic, filtrer la liste des travaux déjà en mémoire (allWorks) selon la catégorie choisie, et réafficher seulement ceux-là dans la galerie."
// ---------------------------------------------------------------------------------

/* Mode édition*/


function checkLoginStatus() {// on vérifie si l'utilisateur est connecté en regardant si un token est stocké dans le localStorage //
    const token = localStorage.getItem("token");
    
    return token !== null;// si le token existe, l'utilisateur est connecté //
}

function activateEditMode() {
    // 1. Bandeau noir "Mode édition"
    const editBanner = document.createElement("div");
    editBanner.classList.add("edit-banner");
    editBanner.innerHTML = `<img src="./assets/icons/edit.png" alt=""> Mode édition`;
    document.body.prepend(editBanner);

    // 2. Transformer "login" en "logout"
    const loginLink = document.querySelector('nav ul li a[href="login.html"]');
    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.href = "#";
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    }

    // 3. Cacher les filtres
    const filters = document.getElementById("filters");
    if (filters) {
        filters.style.display = "none";
    }

    // 4. Afficher un bouton "modifier" à côté de "Mes Projets"
    const portfolioTitle = document.querySelector("#portfolio h2"); // on récupère le titre "Mes Projets" pour y ajouter le bouton "modifier" //
    if (portfolioTitle) { // on vérifie que le titre existe avant de continuer //
        const editButton = document.createElement("button"); // on crée le bouton "modifier" //
        editButton.classList.add("edit-mode-btn"); // on lui ajoute la classe "edit-mode-btn" pour le styliser //
        editButton.id = "edit-btn"; // on lui ajoute un ID pour pouvoir le récupérer plus tard //
        editButton.innerHTML = `<img src="./assets/icons/edit.png" alt=""> modifier`; // on lui ajoute le texte "modifier" et l'icône d'édition //
        

        const portfolioHeader = document.createElement("div"); // on crée un conteneur pour le titre et le bouton //
        portfolioHeader.classList.add("portfolio-header"); // on lui ajoute la classe "portfolio-header" pour le styliser //
        portfolioHeader.style.cssText = 
            "display:flex; justify-content:center; align-items:center; gap:30px; margin-bottom:2em;"; 

        portfolioTitle.style.marginBottom = "0"; 
        editButton.style.margin = "0"; 

        portfolioTitle.insertAdjacentElement("beforebegin", portfolioHeader);
        portfolioHeader.appendChild(portfolioTitle); 
        portfolioHeader.appendChild(editButton);
    }
}

// Au chargement de la page, on vérifie si l'utilisateur est connecté
if (checkLoginStatus()) {
    activateEditMode();
}

// --------------------------------- //
/*----------------------------------fenêtre modal galerie photos-----------------------------*/

const modals = document.getElementById("modals");
const editBtn = document.getElementById("edit-btn");
const closeModal = document.getElementById("close-modal");

//ouvrte la modale au clic sur le bouton "modifier"//
if (editBtn) {
    editBtn.addEventListener("click", () => {
        modals.style.display = "flex";
        modals.classList.add("modals");
        modal.classList.add("modal");
        ajouteGalerie()// on appelle la fonction pour afficher les travaux dans la modale //
    });
}

//ferme la modale au clic sur le bouton "X"//
closeModal.addEventListener("click", () => {
    modals.style.display = "none";
    modals.classList.remove("modals");
    modal.classList.remove("modal");
});

function ajouteGalerie() {
    document.querySelector(".modal-content").innerHTML = "";   
    allWorks.forEach((work) => {

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        figure.appendChild(img);

        const deleteIcon = document.createElement("span");
        figure.appendChild(deleteIcon);
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = '<img src="./assets/icons/corbeille.png" alt="supprimer">';

        document.querySelector(".modal-content").appendChild(figure);   

        deleteIcon.addEventListener("click", () => {
            fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, 
                },
            })
            .then((response) => {
                if (response.ok) {
                    figure.remove();
                    allWorks = allWorks.filter((w) => w.id !== work.id);
                    displayWorks(allWorks);
                }
            });
        });
    });
}

/*----------------------------------fenêtre modal ajout photo-----------------------------*/

const addPhotoModal = document.getElementById("modal-ajout-photo");
const addPhotoBtn = document.getElementById("add-photo-btn");
const modal = document.getElementById("modal");
const backModal = document.getElementById("back-modal");
const closeModal2 = document.getElementById("close-modal-2");


addPhotoBtn.addEventListener("click", () => {
    addPhotoModal.style.display = "flex"; // on ouvre la modale ajout photo //
    modal.style.display = "none"; // on ferme la modale galerie photos //
});


backModal.addEventListener("click", () => {
    addPhotoModal.style.display = "none";
    modal.style.display = "block"; // on revient à la modale galerie photos //
    resetAddPhotoForm();
});

closeModal2.addEventListener("click", () => {
    addPhotoModal.style.display = "none"; // on ferme la modale ajout photo //
    modal.style.display = "block"; // on revient à la modale galerie photos //
    modals.style.display = "none"; // on ferme la modale galerie photos //
    resetAddPhotoForm();
});

document.addEventListener("click", (event) => { 
    const isModalOpen = modals.style.display === "flex"; // on vérifie si la modale est ouverte //
    const clickedInsideModal = modals.contains(event.target); // on vérifie si le clic a eu lieu à l'intérieur de la modale //
    const clickedEditBtn = event.target === editBtn || event.target.closest("#edit-btn"); // on vérifie si le clic a eu lieu sur le bouton "modifier" ou à l'intérieur de celui-ci //

    if (isModalOpen && !clickedInsideModal && !clickedEditBtn) { // si la modale est ouverte et que le clic a eu lieu à l'extérieur de celle-ci  //
        modals.style.display = "none"; // on ferme la modale galerie photos //
        addPhotoModal.style.display = "none"; // on ferme la modale ajout photo //
        modal.style.display = "block"; // on revient à la modale galerie photos //
        resetAddPhotoForm();
    }
});

fetch(categoriesUrl) // on récupère les catégories pour le select de la modale ajout photo //
    .then((response) => response.json()) // on convertit la réponse en JSON //
    .then((categories) => { // on parcourt les catégories pour créer les options du select //
        const categorySelect = document.getElementById("category"); // on récupère le select //
        categories.forEach((category) => { // on parcourt les catégories //
            const option = document.createElement("option"); // on crée une option pour chaque catégorie //
            option.value = category.id; // on met l'ID de la catégorie comme valeur de l'option //
            option.textContent = category.name; // on met le nom de la catégorie comme texte de l'option //
            categorySelect.appendChild(option); // on ajoute l'option au select //
        }); 
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
    });
;

const photoInput = document.getElementById("photo");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const validerBtn = document.getElementById("valider-btn")

// vérifie que les 3 champs sont remplis et change la couleur du bouton
function checkFormFilled() {
    const isFilled =
        photoInput.files.length > 0 &&
        titleInput.value.trim() !== "" &&
        categoryInput.value !== "";

    validerBtn.classList.toggle("active", isFilled);
}

photoInput.addEventListener("change", checkFormFilled);
titleInput.addEventListener("input", checkFormFilled);
categoryInput.addEventListener("change", checkFormFilled);


photoInput.addEventListener("change", () => { 
    const file = photoInput.files[0]; 
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById("preview-img");
            previewImg.src = e.target.result;
            previewImg.style.display = "block"; // on affiche l'image de prévisualisation //
            document.getElementById("upload-icon").style.display = "none";
            document.getElementById("upload-btn").style.display = "none";    // ← ajoute
            document.getElementById("upload-info").style.display = "none";
        }
        reader.readAsDataURL(file); 
    }
});

const addPhotoForm = document.getElementById("add-photo-form"); // on récupère le formulaire ajout photo //

function resetAddPhotoForm() { 
    addPhotoForm.reset();
    checkFormFilled();
    document.getElementById("preview-img").style.display = "none"; 
    document.getElementById("upload-icon").style.display = "block";
    document.getElementById("upload-btn").style.display = "block";
    document.getElementById("upload-info").style.display = "block";
}

addPhotoForm.addEventListener("submit", (event) => { 
    event.preventDefault(); // on empêche le rechargement de la page //
    if (!photoInput.files[0]) { // on vérifie si une photo a été sélectionnée //
        alert("Veuillez sélectionner une photo.");
        return;
    } 
    if (!document.getElementById("title").value) { // on vérifie si un titre a été saisi //
        alert("Veuillez saisir un titre.");
        return;
    }
    if (!document.getElementById("category").value) { // on vérifie si une catégorie a été sélectionnée //
        alert("Veuillez sélectionner une catégorie.");
        return;
    }
    
    const formData = new FormData(); // on crée un objet FormData pour envoyer les données du formulaire //
    formData.append("image", photoInput.files[0]); // on ajoute l'image sélectionnée au FormData //
    formData.append("title", document.getElementById("title").value); // on ajoute le titre au FormData //
    formData.append("category", document.getElementById("category").value); // on ajoute la catégorie au FormData //

    const token = localStorage.getItem("token"); // on récupère le token stocké dans le localStorage pour l'authentification //

    fetch("http://localhost:5678/api/works", {
        method: "POST", // on envoie les données du formulaire au serveur pour ajouter un nouveau travail //
        headers: { // on ajoute l'en-tête Authorization avec le token pour l'authentification //
            "Authorization": `Bearer ${token}`
        },
        body: formData // on envoie le FormData contenant l'image, le titre et la catégorie //
    })
    
    .then((response) => { // on traite la réponse du serveur //
        if (!response.ok) { // on vérifie si la réponse est OK, sinon on lance une erreur //
            throw new Error("Erreur lors de l'ajout du travail"); 
        }
        return response.json(); // on convertit la réponse en JSON //
    })
    .then((work) => {  // on récupère le travail ajouté dans la réponse du serveur //
        checkFormFilled(); // le bouton repasse en gris après la réinitialisation
        allWorks.push(work);  // on ajoute le nouveau travail à la liste des travaux en mémoire //
        displayWorks(allWorks);  // on met à jour la galerie principale pour afficher le nouveau travail //
        ajouteGalerie(); // on met à jour la galerie de la modale //
        resetAddPhotoForm();
        addPhotoModal.style.display = "none"; // on ferme la modale ajout photo //
        document.getElementById("add-photo-form").reset(); // on réinitialise le formulaire //
        document.getElementById("preview-img").style.display = "none"; // on cache l'image de prévisualisation //
        document.getElementById("upload-icon").style.display = "block"; // on réaffiche l'icône d'upload //
        document.getElementById("upload-btn").style.display = "block";  // on réaffiche le bouton d'upload //
        document.getElementById("upload-info").style.display = "block" 
        modal.style.display = "block";
        modals.style.display = "none"; 
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout du travail :", error);
    });


});



