const allPokemon = [];
let tableauFin = [];
let index = 21;

const searchInput = document.querySelector(".recherche-poke input");
const listePoke = document.querySelector(".liste-poke");
const resetBouton = document.querySelector(".reset-recherche");
const chargement = document.querySelector(".loader");

const types = {
    grass: "#78c850", ground: "#E2BF65", dragon: "#6F35FC", fire: "#F58271",
    electric: "#F7D02C", fairy: "#D685AD", poison: "#966DA3", bug: "#B3F594",
    water: "#6390F0", normal: "#D9D5D8", psychic: "#F95587", flying: "#A98FF3",
    fighting: "#C25956", rock: "#B6A136", ghost: "#735797", ice: "#96D9D6",
};

async function fetchPokemonBase() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const allPoke = await response.json();
        await Promise.all(allPoke.results.map(pokemon => fetchPokemonComplet(pokemon)));
        tableauFin = allPokemon.sort((a, b) => a.id - b.id).slice(0, 21);
        createCard(tableauFin);
        chargement.style.display = "none";
    } catch (error) {
        console.error("Erreur lors du fetch des Pokémon :", error);
    }
}

async function fetchPokemonComplet(pokemon) {
    try {
        const pokeData = await fetch(pokemon.url).then(res => res.json());
        const speciesData = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`)
            .then(res => res.json());

        allPokemon.push({
            id: pokeData.id,
            pic: pokeData.sprites.front_default,
            type: pokeData.types[0].type.name,
            name: speciesData.names[4].name,
        });
    } catch (error) {
        console.error("Erreur lors du fetch du Pokémon :", error);
    }
}

// Création des cartes
function createCard(arr) {
    const fragment = document.createDocumentFragment();

    arr.forEach(p => {
        const carte = document.createElement("li");
        carte.style.background = types[p.type] || "#FFF";

        const txtCarte = document.createElement("h2");
        txtCarte.innerText = p.name;

        const idCarte = document.createElement("p");
        idCarte.innerText = `n° ${p.id}`;

        const imgCarte = document.createElement("img");
        imgCarte.src = p.pic;
        imgCarte.alt = `Représentation de ${p.name}`;

        carte.append(imgCarte, txtCarte, idCarte);
        fragment.appendChild(carte);
    });

    listePoke.appendChild(fragment);
}

// Scroll Infini
window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
        addPoke(6);
    }
});

function addPoke(nb) {
    if (index > allPokemon.length) return;
    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    index += nb;
}

// Recherche
searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toUpperCase();
    const allLi = document.querySelectorAll("li");

    allLi.forEach(li => {
        const name = li.querySelector("h2").innerText.toUpperCase();
        li.style.display = name.includes(filter) ? "flex" : "none";
    });

    searchInput.parentNode.classList.toggle("active-input", filter !== "");
    resetBouton.style.display = filter !== "" ? "inline-block" : "none";
});

// Reset
resetBouton.addEventListener("click", e => {
    e.preventDefault();
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
});

// Lancer le fetch initial
fetchPokemonBase();