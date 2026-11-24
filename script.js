// Barra fija al pasar la portada
const barra = document.getElementById('barra');
new IntersectionObserver(([e]) => barra.classList.toggle('visible', !e.isIntersecting),
  { threshold: 0.15 }).observe(document.querySelector('.hero'));

// Explorador tipo menú (sin scroll largo)
const tabs = [...document.querySelectorAll('.menu-item')];
const secciones = [...document.querySelectorAll('main section')];
const btnVerTodo = document.getElementById('btnVerTodo');

function activarSeccion(id, desplazar = true) {
  document.body.classList.add('modo-menu');
  btnVerTodo.classList.remove('activo');
  tabs.forEach(t => {
    const esActiva = t.dataset.seccion === id;
    t.classList.toggle('activo', esActiva);
    t.setAttribute('aria-selected', String(esActiva));
  });
  secciones.forEach(sec => {
    sec.classList.toggle('vista-activa', sec.id === id);
  });
  if (desplazar) {
    document.getElementById('menu-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activarSeccion(tab.dataset.seccion));
});

btnVerTodo.addEventListener('click', () => {
  const estaTodo = !document.body.classList.contains('modo-menu');
  if (estaTodo) {
    activarSeccion('intro', false);
  } else {
    document.body.classList.remove('modo-menu');
    btnVerTodo.classList.add('activo');
    tabs.forEach(t => {
      t.classList.remove('activo');
      t.setAttribute('aria-selected', 'false');
    });
  }
});

document.querySelectorAll('[data-ir]').forEach(el => {
  el.addEventListener('click', () => {
    const destino = document.getElementById(el.dataset.ir);
    if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-seccion-rapida]').forEach(el => {
  el.addEventListener('click', () => activarSeccion(el.dataset.seccionRapida));
});

// Foto ampliada con flechas y contador de galería
const fotos = [...document.querySelectorAll('#carrusel img')];
const contadorFotos = document.getElementById('contadorFotos');
const visor = document.getElementById('visor'), vImg = document.getElementById('vImg');
let actual = 0;

function actualizarContador() {
  const visibles = fotos.filter(img => img.parentElement.style.display !== 'none').length;
  if (contadorFotos) {
    contadorFotos.textContent = visibles === 1 ? '1 foto' : `${visibles} fotos`;
  }
  const mostrarFlechas = visibles > 1;
  document.querySelectorAll('.v-flecha').forEach(b => {
    b.style.display = mostrarFlechas ? '' : 'none';
  });
}

const mostrar = i => {
  actual = (i + fotos.length) % fotos.length;
  vImg.src = fotos[actual].src;
  vImg.alt = fotos[actual].alt;
};
const abrir = i => { mostrar(i); visor.classList.add('abierto'); };
const cerrar = () => visor.classList.remove('abierto');

fotos.forEach((img, i) => {
  img.addEventListener('error', () => {
    img.parentElement.style.display = 'none';
    actualizarContador();
  });
  img.parentElement.addEventListener('click', () => abrir(i));
});
actualizarContador();

document.getElementById('vCerrar').onclick = cerrar;
document.getElementById('vAnt').onclick = () => mostrar(actual - 1);
document.getElementById('vSig').onclick = () => mostrar(actual + 1);
visor.addEventListener('click', e => { if (e.target === visor) cerrar(); });
document.addEventListener('keydown', e => {
  if (!visor.classList.contains('abierto')) return;
  if (e.key === 'Escape') cerrar();
  if (e.key === 'ArrowLeft') mostrar(actual - 1);
  if (e.key === 'ArrowRight') mostrar(actual + 1);
});

// Deslizar con el dedo dentro del visor
let x0 = 0;
visor.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
visor.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - x0;
  if (Math.abs(d) > 50) mostrar(actual + (d < 0 ? 1 : -1));
});

// Video con botón de play
const caja = document.getElementById('videoCaja'), vid = document.getElementById('recorrido');
document.getElementById('play').onclick = () => { vid.controls = true; vid.play(); caja.classList.add('activo'); };
