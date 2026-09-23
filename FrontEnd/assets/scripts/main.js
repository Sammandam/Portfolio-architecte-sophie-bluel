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
        allWorks = works; // pour l'etape 3
    })
    .catch((error) => console.error(error));

// on a remplacé les images fixes du HTML par un affichage dynamique
// le JavaScript va chercher les travaux directement dans le back-end (avec fetch), puis crée et insère automatiquement chaque <figure> dans la galerie.
//--------------------------------

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

function displayFilters(categories) {
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