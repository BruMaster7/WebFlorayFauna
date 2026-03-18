// ── Loading overlay ──────────────────────────────────────────────────────────
const overlay = document.getElementById('loading-overlay');
const loadingBar = document.getElementById('loading-bar');

function hideOverlay() {
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

// Animate progress bar over 50 seconds (Render cold start worst-case)
if (loadingBar) {
  const DURATION_MS = 50000;
  const start = Date.now();
  const barInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min((elapsed / DURATION_MS) * 95, 95); // cap at 95% until done
    loadingBar.style.width = pct + '%';
    if (elapsed >= DURATION_MS) clearInterval(barInterval);
  }, 300);

  // Store interval so fetchData can clear it and jump to 100%
  window._barInterval = barInterval;
}

// ── Menú hamburguesa - Mobile ─────────────────────────────────────────────────

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("nav-menu_visible");

  if (navMenu.classList.contains("nav-menu_visible")) {
    navToggle.setAttribute("aria-label", "Cerrar menú");
    document.getElementsByTagName('body')[0].classList.add('noscroll');
  } else {
    navToggle.setAttribute("aria-label", "Abrir menú");
    document.getElementsByTagName('body')[0].classList.remove('noscroll');
  }
});


// Definición de URL dinámica asignada en tiempo de compilación para Netlify
let API_URL = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : 'http://localhost:3001';
if (API_URL.endsWith('/')) {
  API_URL = API_URL.slice(0, -1);
}

// FetchAPI para trabajar con la base de datos de los animales

async function fetchData() {
  try {
    const fauna = document.getElementById('fauna')
    if (fauna) {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json()
      for (const animal of data) {
        animal.type = 'animalia';
        const card = createCard(animal, 'animal')
        fauna.append(card)
      }
    }
    const flora = document.getElementById('flora')
    if (flora) {
      const res = await fetch(`${API_URL}/flora`);
      const data = await res.json()
      for (const specie of data) {
        specie.type = 'plantae';
        const card = createCard(specie, 'floraH')
        flora.append(card)
      }
    }
  } finally {
    // Jump bar to 100% and hide overlay
    if (window._barInterval) clearInterval(window._barInterval);
    if (loadingBar) loadingBar.style.width = '100%';
    setTimeout(hideOverlay, 400);
  }
}

document.addEventListener('DOMContentLoaded', async () => await fetchData());

// Generar las tarjetas de animales al front

function createCard(specie, category) {

  const tarjetas = document.createElement('div')
  tarjetas.classList.add('specie', category)
  let caracteristicas = '';
  if (specie.caracteristicas && specie.caracteristicas.length > 0) {
    for (const rawUrl of specie.caracteristicas.split(',')) {
      const localUrl = mapIconUrl(rawUrl);
      const title = getIconTitle(rawUrl);
      caracteristicas += `<img class="habitat-icon" src="${localUrl}" alt="${title}" title="${title}"></img>`
    }
  }

  tarjetas.innerHTML = (`<img src="${specie.img}" alt="${specie.nombre}">` +
    `<h3>${specie.nombre}</h3>` +
    `<p>${specie.nombrecientifico || ''}</p>` +
    '<div class="caracteristicas">' + caracteristicas + "</div>" +
    '<div class="centrar-boton">' +
    '<a class="boton boton2 ver-mas-btn" href="#">Ver más</a>')

  const btn = tarjetas.querySelector('.ver-mas-btn');
  btn.onclick = (e) => {
    e.preventDefault();
    showModal(specie);
  };

  return tarjetas
}

function mapIconUrl(url) {
  if (!url) return '';
  const filename = url.split('/').pop().split('.')[0].toLowerCase();

  // Mapping specific filenames
  const mapping = {
    'diurnos': 'diurno',
    'nocturnos': 'nocturno',
    'autoctonos': 'autoctono',
    'exoticos': 'exotico',
    'nocturnos-y-diurnos': 'nocturno-y-diurno',
    'peligroso': 'Peligroso',
    'raro': 'Raro',
    'en-peligro-de-extincion': 'en_peligro_de_extincion'
  };

  const mappedName = mapping[filename] || filename;
  return `img/caracteristicas/${mappedName}.png`;
}

function getIconTitle(url) {
  const filename = url.split('/').pop().split('.')[0].toLowerCase();
  const title = filename.charAt(0).toUpperCase() + filename.slice(1).replace(/-/g, ' ').replace(/_/g, ' ');
  return title;
}

// Lógica del Modal

function showModal(specie) {
  const modal = document.getElementById('speciesModal');
  const modalHeader = document.getElementById('modalHeader');
  const modalName = document.getElementById('modalName');
  const modalScientificName = document.getElementById('modalScientificName');
  const modalDescription = document.getElementById('modalDescription');
  const modalCategory = document.getElementById('modalCategory');
  const modalReino = document.getElementById('modalReino');
  const modalOrden = document.getElementById('modalOrden');
  const modalFamilia = document.getElementById('modalFamilia');
  const modalGenero = document.getElementById('modalGenero');
  const modalScale = document.getElementById('modalScale');
  const modalMap = document.getElementById('modalMap');
  const modalIcons = document.getElementById('modalIcons');

  // Populate data
  modalHeader.style.backgroundImage = `url(${specie.img})`;
  modalName.textContent = specie.nombre;
  modalScientificName.textContent = specie.nombrecientifico;
  modalDescription.textContent = specie.descripcion;
  modalCategory.textContent = specie.type === 'animalia' ? 'Fauna' : (specie.type === 'plantae' ? 'Flora' : (specie.category === 'animalia' ? 'Fauna' : 'Flora'));
  modalReino.textContent = specie.reino;
  modalOrden.textContent = specie.orden;
  modalFamilia.textContent = specie.familia;
  modalGenero.textContent = specie.genero;

  modalScale.src = specie.escala || '';
  modalMap.src = specie.distribucionuy || '';

  // Icons
  modalIcons.innerHTML = '';
  if (specie.caracteristicas && specie.caracteristicas.length > 0) {
    for (const rawUrl of specie.caracteristicas.split(',')) {
      const localUrl = mapIconUrl(rawUrl);
      const icon = document.createElement('img');
      const title = getIconTitle(rawUrl);
      icon.src = localUrl;
      icon.title = title;
      icon.alt = title;
      modalIcons.appendChild(icon);
    }
  }

  modal.style.display = 'block';
  document.body.classList.add('noscroll');
}

function closeModal() {
  const modal = document.getElementById('speciesModal');
  modal.style.display = 'none';
  document.body.classList.remove('noscroll');
}

// Event listeners para cerrar el modal y búsqueda
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  window.onclick = (event) => {
    const modal = document.getElementById('speciesModal');
    if (event.target == modal) {
      closeModal();
    }

    // Cerrar resultados de búsqueda al hacer clic fuera
    const searchResults = document.getElementById('searchResults');
    if (searchResults && event.target !== searchResults && !searchResults.contains(event.target) && event.target.id !== 'globalSearch') {
      searchResults.style.display = 'none';
    }
  };

  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.oninput = debounce(async (e) => {
      const query = e.target.value.trim();
      if (query.length < 2) {
        hideSearchResults();
        return;
      }
      const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();
      showSearchResults(results);
    }, 300);
  }
});

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function showSearchResults(results) {
  let resultsDiv = document.getElementById('searchResults');
  if (!resultsDiv) {
    resultsDiv = document.createElement('div');
    resultsDiv.id = 'searchResults';
    resultsDiv.className = 'search-results-overlay';
    document.querySelector('.search-container').appendChild(resultsDiv);
  }

  resultsDiv.innerHTML = '';
  if (results.length === 0) {
    resultsDiv.innerHTML = '<p class="no-results">No se encontraron especies.</p>';
  } else {
    results.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
                <img src="${item.img}" alt="${item.nombre}">
                <div>
                    <strong>${item.nombre}</strong>
                    <p>${item.nombrecientifico || ''}</p>
                    <span class="badge ${item.type}">${item.type === 'animalia' ? 'Fauna' : 'Flora'}</span>
                </div>
            `;
      div.onclick = () => {
        showModal(item);
        hideSearchResults();
      };
      resultsDiv.appendChild(div);
    });
  }
  resultsDiv.style.display = 'block';
}

function hideSearchResults() {
  const resultsDiv = document.getElementById('searchResults');
  if (resultsDiv) resultsDiv.style.display = 'none';
}