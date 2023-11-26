const MAX_POKEMON = 100;
let offset = 0;
const listWrapper = document.querySelector(".list-wrapper");
const nextButton = document.querySelector("#next-button");
const prevButton = document.querySelector("#prev-button");

let allPokemons = [];


function fetchPokemons() {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      allPokemons = data.results;
      console.log(allPokemons);
      displayPokemons(allPokemons);
    });
}

// Funciones para avanzar y retroceder
function nextPokemons() {
  offset += MAX_POKEMON;
  fetchPokemons();
}

function previousPokemons() {
  if (offset >= MAX_POKEMON) {
    offset -= MAX_POKEMON;
  }
  fetchPokemons();
}

nextButton.addEventListener("click", nextPokemons);
prevButton.addEventListener("click", previousPokemons);

// Cargar inicialmente los Pokémon
fetchPokemons();

async function fetchPokemonDataBeforeRedirect(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
        res.json()
      ),
      fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
        res.json()
      ),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

function displayPokemons(pokemon) {
  listWrapper.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `
        <div class="number-wrap">
            <p class="caption-fonts">#${pokemonID}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/official-artwork/${pokemonID}.png" alt="${pokemon.name}" />
        </div>
        <div class="name-wrap">
            <p class="body3-fonts">${pokemon.name}</p>
        </div>
    `;
    // Note: No need to attach event listener here
    listWrapper.appendChild(listItem);
  });
}

listWrapper.addEventListener('click', async(event) => {
  const listItem = event.target.closest('.list-item');
  if(listItem){
    const pokemonID = listItem.querySelector('.number-wrap p').textContent.substring(1);
    const success = await fetchPokemonDataBeforeRedirect(pokemonID);
    if (success) {
      window.location.href = `./detail.html?id=${pokemonID}`;
    }
  }
});

