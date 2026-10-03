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

    // Bouton "Tous" toujours présent en premier
    filtersContainer.appendChild(createFilterButton("Tous", "all"));

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
    const portfolioTitle = document.querySelector("#portfolio h2");
    if (portfolioTitle) {
        const editButton = document.createElement("button");
        editButton.classList.add("edit-mode-btn");
        editButton.innerHTML = `<img src="./assets/icons/edit.png" alt=""> modifier`;
        portfolioTitle.insertAdjacentElement("afterend", editButton);
        editButton.id = "edit-btn"; 
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
editBtn.addEventListener("click", () => {
    modals.style.display = "flex";
    modals.classList.add("modals");
    modal.classList.add("modal");
    ajouteGalerie()// on appelle la fonction pour afficher les travaux dans la modale //
});

//ferme la modale au clic sur le bouton "X"//
closeModal.addEventListener("click", () => {
    modals.style.display = "none";
    modals.classList.remove("modals");
    modal.classList.remove("modal");
});

let hiddenWorkIds = [] // tableau pour stocker les IDs des travaux supprimés //
function ajouteGalerie() {
    document.querySelector(".modal-content").innerHTML = ""; // on vide le contenu de la modale avant de l'afficher //
    allWorks 
        .filter((work) => !hiddenWorkIds.includes(work.id)) // on filtre les travaux pour ne pas afficher ceux qui ont été supprimés //
        .forEach((work) => { // on parcourt les travaux filtrés //

            const figure = document.createElement("figure"); 
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            figure.appendChild(img);

            const deleteIcon = document.createElement("span");
            figure.appendChild(deleteIcon);
            deleteIcon.classList.add("delete-icon");
            deleteIcon.innerHTML = "&#128465;";

            document.querySelector(".modal-content").appendChild(figure);

            deleteIcon.addEventListener("click", () => { // on ajoute un écouteur d'événement pour le clic sur l'icône de suppression //
                hiddenWorkIds.push(work.id); // on ajoute l'ID du travail supprimé au tableau hiddenWorkIds //
                figure.remove();// on supprime le <figure> correspondant de la modale //
                displayWorks(allWorks.filter((w) => !hiddenWorkIds.includes(w.id)));  // on met à jour la galerie principale pour ne plus afficher le travail supprimé //        
        });

        
    });
};

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
});

closeModal2.addEventListener("click", () => {
    addPhotoModal.style.display = "none"; // on ferme la modale ajout photo //
    modal.style.display = "block"; // on revient à la modale galerie photos //
    modals.style.display = "none"; // on ferme la modale galerie photos //
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

photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById("preview-img");
            previewImg.src = e.target.result;
            previewImg.style.display = "block"; // on affiche l'image de prévisualisation //
            document.getElementById("upload-icon").style.display = "none";
        }
        reader.readAsDataURL(file);
    }
});

const addPhotoForm = document.getElementById("add-photo-form");

addPhotoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("image", photoInput.files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("category", document.getElementById("category").value);

    const token = localStorage.getItem("token");

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    })
    .then((response) => response.json())
    .then((work) => {
        console.log("Travail ajouté avec succès :", work);
        // Mettre à jour l'interface utilisateur avec le nouveau travail
    })
    .catch((error) => {
        console.error("Erreur lors de l'ajout du travail :", error);
    });
});


