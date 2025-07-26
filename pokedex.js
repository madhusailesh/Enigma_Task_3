async function getPokemonInfo() {
  const name = document.getElementById("pokemonInput").value.toLowerCase().trim();
  const card = document.getElementById("pokemonCard");
  const img = document.getElementById("pokemonImage");
  const pokeName = document.getElementById("pokemonName");
  const types = document.getElementById("pokemonTypes");
  const stats = document.getElementById("pokemonStats");
  const abilities = document.getElementById("pokemonAbilities");
  const description = document.getElementById("pokemonDescription");

  if (!name) return;

  try {
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemonData = await pokemonRes.json();

    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const speciesData = await speciesRes.json();

    // Set image and name
    img.src = pokemonData.sprites.front_default;
    pokeName.textContent = pokemonData.name.toUpperCase();

    // Set types
    types.innerHTML = "";
    pokemonData.types.forEach((t) => {
      const badge = document.createElement("span");
      badge.textContent = t.type.name;
      badge.className =
        "px-2 py-1 bg-gradient-to-r from-green-300 to-green-500 text-white rounded-full text-xs shadow-md";
      types.appendChild(badge);
    });

    
    abilities.innerHTML = "";
    pokemonData.abilities.forEach((a) => {
      const tag = document.createElement("span");
      tag.textContent = a.ability.name;
      tag.className =
        "px-2 py-1 bg-gradient-to-r from-purple-300 to-purple-500 text-white rounded-full text-xs shadow-md";
      abilities.appendChild(tag);
    });

    // stats
    stats.innerHTML = "";
    pokemonData.stats.forEach((s) => {
      stats.innerHTML += `<li><strong>${s.stat.name}:</strong> ${s.base_stat}</li>`;
    });
    const descEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    description.textContent = descEntry
      ? descEntry.flavor_text.replace(/\f/g, " ")
      : "No description available.";

    card.classList.remove("hidden");
  } catch (err) {
    card.innerHTML = `<p class="text-red-600 text-center">Pokémon not found. Please check the name.</p>`;
    card.classList.remove("hidden");
  }
}
