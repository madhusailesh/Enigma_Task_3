document.getElementById('fetchBtn').addEventListener('click', async () => {
  const name = document.getElementById('pokemonInput').value.trim().toLowerCase();
  const display = document.getElementById('evolutionChain');
  display.innerHTML = 'Loading...';

  if (!name) {
    display.innerHTML = 'Please enter a Pokémon name.';
    return;
  }

  try {
    
    
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    if (!speciesRes.ok) throw new Error('Pokémon not found');
    const speciesData = await speciesRes.json();

    
    const evoUrl = speciesData.evolution_chain.url;

    
    const evoRes = await fetch(evoUrl);
    const evoData = await evoRes.json();

    
    const chain = [];
    let current = evoData.chain;
    while (current) {
      chain.push(current.species.name);
      current = current.evolves_to[0];
    }

    
    const results = await Promise.all(chain.map(async (pokemonName) => {
      const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const pokeData = await pokeRes.json();
      return {
        name: capitalize(pokemonName),
        image: pokeData.sprites.other['official-artwork'].front_default,
        stats: pokeData.stats // base stats
      };
    }));

    
    display.innerHTML = '';
    results.forEach((pokemon, index) => {
      const block = document.createElement('div');
      block.className = 'pokemon-block';
      const statsHTML = pokemon.stats.slice(0, 3).map(stat =>
        `<div><strong>${capitalize(stat.stat.name)}:</strong> ${stat.base_stat}</div>`
      ).join('');
      block.innerHTML = `
        <img src="${pokemon.image}" alt="${pokemon.name}" />
        <h3>${pokemon.name}</h3>
        <div class="pokemon-stats">${statsHTML}</div>
      `;
      display.appendChild(block);

      if (index < results.length - 1) {
        const arrow = document.createElement('div');


        arrow.className = 'arrow';
        arrow.innerHTML = '&#8594;'; // →
        display.appendChild(arrow);
      }
    });

  } catch (err) {
    console.error(err);
    display.innerHTML = 'Error fetching data. Try a valid Pokémon name.';
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('pokemon-bg-video');
  

  const videoControls = document.createElement('div');
  videoControls.className = 'video-controls';
  
  const toggleButton = document.createElement('button');
  toggleButton.className = 'video-toggle';
  toggleButton.innerHTML = '⏸️';
  toggleButton.title = 'Toggle video playback';
  

  toggleButton.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      toggleButton.innerHTML = '⏸️';
    } else {
      video.pause();
      toggleButton.innerHTML = '▶️';
    }
  });
  
  videoControls.appendChild(toggleButton);
  document.body.appendChild(videoControls);
  
  
  video.addEventListener('loadeddata', function() {
    video.play().catch(function(error) {
      console.log('Video autoplay failed:', error);
    });
  });
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
