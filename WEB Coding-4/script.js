let pokemonContainer = document.getElementById("pokemonContainer");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");

async function fetchPokemon() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150");
    let data = await response.json();
    let pokemonList = data.results;

    displayPokemon(pokemonList);
}

async function fetchTypes() {
    let response = await fetch("https://pokeapi.co/api/v2/type/");
    let data = await response.json();
    populateTypeFilter(data.results);
}

function displayPokemon(pokemonList) {
    pokemonContainer.innerHTML = "";
    pokemonList.forEach(async (pokemon) => {
        let pokemonDetails = await fetch(pokemon.url).then((res) => res.json());
        let { id, name, types, sprites } = pokemonDetails;

        let card = document.createElement("div");
        card.classList.add("pokemon-card");

        card.innerHTML = `
            <img src="${sprites.front_default}" alt="${name}">
            <h3>${name.toUpperCase()}</h3>
            <p>Type: ${types.map(t => t.type.name).join(", ")}</p>
        `;
        pokemonContainer.appendChild(card);
    });
}

function populateTypeFilter(types) {
    types.forEach(type => {
        let option = document.createElement("option");
        option.value = type.name;
        option.textContent = type.name;
        typeFilter.appendChild(option);
    });
}

searchInput.addEventListener("input", () => {
    let searchTerm = searchInput.value.toLowerCase();
    Array.from(pokemonContainer.children).forEach(card => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = name.includes(searchTerm) ? "" : "none";
    });
});

typeFilter.addEventListener("change", async () => {
    let selectedType = typeFilter.value;
    if (!selectedType) {
        fetchPokemon();
        return;
    }

    let response = await fetch(`${typeApiUrl}${selectedType}`);
    let data = await response.json();
    displayPokemon(data.pokemon.map(p => p.pokemon));
});

fetchPokemon();
fetchTypes();