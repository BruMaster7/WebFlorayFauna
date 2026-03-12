// Menú hamburguesa - Mobile

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


// FetchAPI para trabajar con la base de datos de los animales

async function fetchData() {
  const fauna = document.getElementById('fauna')
  if (fauna) {
    const res = await fetch('http://localhost:3001');
    const data = await res.json()
    for (const animal of data) {
      const card = createCard(animal, 'animal')
      fauna.append(card)
    }
  }
  const flora = document.getElementById('flora')
  if (flora) {
    const res = await fetch('http://localhost:3001/flora');
    const data = await res.json()
    for (const specie of data) {
      const card = createCard(specie, 'floraH')
      flora.append(card)
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => await fetchData());

// Generar las tarjetas de animales al front

function createCard(specie, category) {
  
  const tarjetas = document.createElement('div')
  tarjetas.classList.add('specie', category)
  let caracteristicas = '';
  if (specie.caracteristicas && specie.caracteristicas.length > 0) {
    for (const rawUrl of specie.caracteristicas.split(',')){
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
  modalCategory.textContent = specie.category === 'animalia' ? 'Fauna' : 'Flora';
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

// Event listeners para cerrar el modal
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
    };
});