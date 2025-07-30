const search = document.querySelector("#search");
const suggestion = document.querySelector(".suggestion");
const count = document.querySelector(".count");
const typefiltered = document.querySelector("#type-filters");
const container = document.querySelector(".pok-container");
const prevbtn = document.querySelector(".prevbtn");
const nextbtn = document.querySelector(".nextbtn");
const pageinfo = document.querySelector(".pageinfo");

let pokemon = [];
let currentpage = 1;
const perpage = 16;
let currenttype = "all";
let totalpage = 1;

const types = [
  "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

function createbtn() {
  const scrollTrack = document.querySelector(".type-scroll");
  types.forEach(type => {
    const nbtn = document.createElement("button");
    nbtn.textContent = type;
    nbtn.onclick = () => filterbytype(type);
    scrollTrack.appendChild(nbtn);
  });

}

function filterbytype(type) {
  currenttype = type;
  currentpage = 1;
  applyfilter();
}

async function loadpoki(range = 150) {
  for (let i = 1; i <= range; i++) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const info = await res.json();
    pokemon.push(info);
  }
  applyfilter(); 
}

function applyfilter() {
  const name = search.value.toLowerCase();
  let filtered = [...pokemon];

  if (currenttype !== 'all') {
    filtered = filtered.filter(p =>
      p.types.some(t => t.type.name === currenttype)
    );
  }

  if (name) {
    filtered = filtered.filter(p => p.name.includes(name));
  }

  loadingpokemon(filtered);
}

function loadingpokemon(selected){
    container.innerHTML = '';
    const startingrange = (currentpage - 1) * perpage;
    const numberp = selected.slice(startingrange, startingrange + perpage);

    numberp.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card'; 

        const typeText = p.types.map(t => t.type.name).join("   , ");
        
        card.innerHTML = `
  <div class="card-inner" >
    <div class="card-front">
     
      <p class="heading">${p.name}</p>
      <p class="potype" style="text-transform: capitalize;">${typeText}</p>
       <img src="${p.sprites.front_default}" alt="${p.name}">
    </div>
    <div class="card-back">
      <p><strong>Height:</strong> ${p.height / 10} m</p>
      <p><strong>Weight:</strong> ${p.weight / 10} kg</p>
      <p><strong>XP:</strong> ${p.base_experience}</p>
    </div>
  </div>
`;

        card.addEventListener('click', () => {
        showPokemonDetail(p.name);
        });
        container.appendChild(card);
    });

    totalpage = Math.ceil(selected.length / perpage); 
    pageinfo.textContent = `Page ${currentpage} of ${totalpage}`;
}


function suggestpokemon(value) {
  suggestion.innerHTML = '';
  if (!value) return;

  const shown = pokemon
    .map(p => p.name)
    .filter(t => t.startsWith(value))
    .slice(0, 10);

  shown.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => {
      search.value = name;
      suggestion.innerHTML = '';
      applyfilter();
    });

    suggestion.appendChild(li);
  });

}

search.addEventListener('input', () => {
  currentpage = 1;
  applyfilter();
  suggestpokemon(search.value.toLowerCase());
});

prevbtn.addEventListener('click', () => {
  if (currentpage > 1) {
    currentpage--;
    applyfilter();
  }
});

nextbtn.addEventListener('click', () => {
  if (currentpage < totalpage) {
    currentpage++;
    applyfilter();
  }
});



// Select the anchor inside .home without changing layout
const homeLink = document.querySelector(".home a");
homeLink.addEventListener("click", function (e) {
  e.preventDefault();

  const loader = document.querySelector(".loader-screen");
  loader.classList.remove("hidden");

  const url = this.href;

  setTimeout(() => {
    window.open(url, "_blank");
    loader.classList.add("hidden");
  }, 2000); // 2 seconds
});

createbtn();
loadpoki();



