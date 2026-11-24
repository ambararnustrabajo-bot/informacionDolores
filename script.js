const body = document.body;
const secciones = [...document.querySelectorAll('.vista-seccion')];
const vistaNombre = document.getElementById('vistaNombre');

function irAPortada() {
  body.classList.remove('vista-menu', 'vista-seccion-activa');
  body.classList.add('vista-portada');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function irAMenu() {
  body.classList.remove('vista-portada', 'vista-seccion-activa');
  body.classList.add('vista-menu');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function abrirSeccion(id) {
  const objetivo = secciones.find(s => s.id === id);
  if (!objetivo) return;
  secciones.forEach(s => s.classList.toggle('activa', s.id === id));
  if (vistaNombre && objetivo.dataset.titulo) {
    vistaNombre.textContent = objetivo.dataset.titulo;
  }
  body.classList.remove('vista-portada', 'vista-menu');
  body.classList.add('vista-seccion-activa');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Estado inicial: portada a pantalla completa sin scroll largo
irAPortada();

document.getElementById('btnAbrirMenu')?.addEventListener('click', irAMenu);
document.getElementById('btnFlechaMenu')?.addEventListener('click', irAMenu);
document.getElementById('btnVolverPortada')?.addEventListener('click', irAPortada);
document.getElementById('btnVolverAlMenu')?.addEventListener('click', irAMenu);
document.getElementById('barraBtnMenu')?.addEventListener('click', () => {
  if (body.classList.contains('vista-menu')) {
    irAPortada();
  } else {
    irAMenu();
  }
});
document.getElementById('barraBtnUbicacion')?.addEventListener('click', () => abrirSeccion('lugar'));

document.querySelectorAll('.menu-item').forEach(btn => {
  btn.addEventListener('click', () => abrirSeccion(btn.dataset.seccion));
});

// Foto ampliada con flechas y contador de galería + precarga instantánea
const fotos = [...document.querySelectorAll('#carrusel img')];
const contadorFotos = document.getElementById('contadorFotos');
const visor = document.getElementById('visor'), vImg = document.getElementById('vImg');
let actual = 0;

function prepararFotosRapido() {
  fotos.forEach(img => {
    if (img.hasAttribute('loading')) img.removeAttribute('loading');
    img.decoding = 'sync';
    if (typeof img.decode === 'function') {
      img.decode().catch(() => {});
    }
  });
}

if (document.readyState === 'complete') {
  prepararFotosRapido();
} else {
  window.addEventListener('load', prepararFotosRapido, { once: true });
}

document.querySelectorAll('[data-seccion="galeria"]').forEach(btn => {
  btn.addEventListener('click', prepararFotosRapido);
});

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
