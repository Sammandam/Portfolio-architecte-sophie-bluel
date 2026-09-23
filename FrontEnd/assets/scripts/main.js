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
    })
    .catch((error) => console.error(error));

// on a remplacé les images fixes du HTML par un affichage dynamique
// le JavaScript va chercher les travaux directement dans le back-end (avec fetch), puis crée et insère automatiquement chaque <figure> dans la galerie.
//--------------------------------



   