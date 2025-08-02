const pokemonUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";

function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function populateDropdown(dropdown, pokemonList) {
  for (const poke of pokemonList) {
    const option = document.createElement("option");
    option.value = poke.name;
    option.text = capitalizeFirst(poke.name);
    dropdown.appendChild(option);
  }
}

async function getPokemonList() {
  const response = await fetch(pokemonUrl);
  const data = await response.json();
  return data.results;
}

async function getPokemonDetails(name) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  return res.json();
}

function displayResult(message, show = true) {
  const resDiv = document.getElementById("battle-result");
  resDiv.innerHTML = message;
  setTimeout(() => {
    resDiv.style.opacity = show ? "1" : "0.2";
  }, 100);
}

function showStats(statsOBJ, elementId, pokeName) {
  let html = `<span class="stat-title">${capitalizeFirst(
    pokeName
  )}'s Powers:</span>`;
  for (const stat of statsOBJ.stats) {
    html += `<span>${capitalizeFirst(stat.stat.name)}: <b>${
      stat.base_stat
    }</b></span>`;
  }
  document.getElementById(elementId).innerHTML = html;
}

async function updateImageAndStats(selectId, imgId, statsId) {
  const name = document.getElementById(selectId).value;
  if (!name) return;
  const poke = await getPokemonDetails(name);
  const spriteUrl =
    poke.sprites.other["official-artwork"].front_default ||
    poke.sprites.front_default;
  document.getElementById(imgId).style.backgroundImage = `url('${spriteUrl}')`;
  showStats(poke, statsId, poke.name);
}

function getStats(pokemon) {
  let stats = {};
  for (const s of pokemon.stats) {
    stats[s.stat.name] = s.base_stat;
  }
  return stats;
}

function battle(p1, p2) {
  const total1 = Object.values(getStats(p1)).reduce((a, b) => a + b, 0);
  const total2 = Object.values(getStats(p2)).reduce((a, b) => a + b, 0);
  if (total1 === total2) return "It's a tie!";
  return total1 > total2
    ? `${capitalizeFirst(p1.name)} wins!`
    : `${capitalizeFirst(p2.name)} wins!`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const list = await getPokemonList();
  populateDropdown(document.getElementById("pokemon1"), list);
  populateDropdown(document.getElementById("pokemon2"), list);

  // Set up listeners and load default images + stats
  document
    .getElementById("pokemon1")
    .addEventListener("change", () =>
      updateImageAndStats("pokemon1", "img1", "stats1")
    );
  document
    .getElementById("pokemon2")
    .addEventListener("change", () =>
      updateImageAndStats("pokemon2", "img2", "stats2")
    );

  // Initial images and stats for first two Pokémon
  document.getElementById("pokemon1").selectedIndex = 0;
  document.getElementById("pokemon2").selectedIndex = 1;
  await updateImageAndStats("pokemon1", "img1", "stats1");
  await updateImageAndStats("pokemon2", "img2", "stats2");

  document.getElementById("battle-btn").addEventListener("click", async () => {
    const p1 = document.getElementById("pokemon1").value;
    const p2 = document.getElementById("pokemon2").value;
    if (!p1 || !p2) {
      displayResult("Please choose both Pokémon.");
      return;
    }

    // Animate VS and images for battle!
    const card1 = document.getElementById("card1");
    const card2 = document.getElementById("card2");
    card1.classList.remove("winner", "loser", "shake");
    card2.classList.remove("winner", "loser", "shake");
    document.getElementById("battle-result").style.opacity = "0.2";

    card1.classList.add("shake");
    card2.classList.add("shake");
    setTimeout(() => {
      card1.classList.remove("shake");
      card2.classList.remove("shake");
    }, 800);

    displayResult("Battling...", false);

    const [poke1, poke2] = await Promise.all([
      getPokemonDetails(p1),
      getPokemonDetails(p2),
    ]);

    // Update stats display in case user just swapped selection
    showStats(poke1, "stats1", poke1.name);
    showStats(poke2, "stats2", poke2.name);

    const winner =
      battle(poke1, poke2) === `${capitalizeFirst(poke1.name)} wins!`
        ? "card1"
        : battle(poke1, poke2) === `${capitalizeFirst(poke2.name)} wins!`
        ? "card2"
        : "tie";

    setTimeout(() => {
      if (winner === "card1") {
        card1.classList.add("winner");
        card2.classList.add("loser");
      } else if (winner === "card2") {
        card2.classList.add("winner");
        card1.classList.add("loser");
      } else {
        card1.classList.remove("winner", "loser");
        card2.classList.remove("winner", "loser");
      }
      displayResult(battle(poke1, poke2));
    }, 900);
  });

  // Home button
  document.getElementById("home-btn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
});
