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
  if (specie.caracteristicas.length > 0) {
    for (const img of specie.caracteristicas.split(',')){
      caracteristicas += `<img class="habitat-icon" src="${img}" alt=""></img>`
    }
  }
  
  tarjetas.innerHTML = (`<img src="${specie.img}" alt=${specie.nombre}">` +
    `<h3>${specie.nombre}</h3>` +
    `<p>${specie.nombreCientifico}</p>` +
    '<div class="caracteristicas">' + caracteristicas + "</div>" +
    '<div class="centrar-boton">' +
    '<a class="boton boton2" href="#">Ver más</a>')
  return tarjetas
}