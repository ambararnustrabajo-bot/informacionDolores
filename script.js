// Navegación por secciones
const botonesSeccion = [...document.querySelectorAll('.explorar-item')];
const paneles = [...document.querySelectorAll('.panel')];

function mostrarSeccion(id, mover = true) {
  botonesSeccion.forEach(b => {
    const activo = b.dataset.seccion === id;
    b.classList.toggle('activo', activo);
    b.setAttribute('aria-selected', activo ? 'true' : 'false');
  });
  paneles.forEach(p => p.classList.toggle('activo', p.id === id));

  if (mover) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

botonesSeccion.forEach(b => b.addEventListener('click', () => mostrarSeccion(b.dataset.seccion)));
document.getElementById('volverMenu').addEventListener('click', () => {
  document.querySelector('.explorar').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Galería de imágenes y videos
const medios = [...document.querySelectorAll('#galeriaMedios .medio')];
const visor = document.getElementById('visor');
const vImg = document.getElementById('vImg');
const vVideo = document.getElementById('vVideo');
let actual = 0;

function mostrarMedio(i) {
  actual = (i + medios.length) % medios.length;
  const medio = medios[actual];
  const esVideo = medio.dataset.tipo === 'video';

  vImg.classList.toggle('visible', !esVideo);
  vVideo.classList.toggle('visible', esVideo);

  if (esVideo) {
    vImg.removeAttribute('src');
    vVideo.src = medio.dataset.src;
  } else {
    vVideo.pause();
    vVideo.removeAttribute('src');
    vImg.src = medio.dataset.src;
    vImg.alt = medio.dataset.alt || 'Foto de la residencia';
  }
}

function abrirMedio(i) {
  if (!medios.length) return;
  mostrarMedio(i);
  visor.classList.add('abierto');
  document.body.style.overflow = 'hidden';
}

function cerrarVisor() {
  visor.classList.remove('abierto');
  vVideo.pause();
  vVideo.removeAttribute('src');
  document.body.style.overflow = '';
}

medios.forEach((medio, i) => {
  medio.addEventListener('error', () => medio.style.display = 'none', true);
  medio.addEventListener('click', () => abrirMedio(i));
});

document.getElementById('vCerrar').onclick = cerrarVisor;
document.getElementById('vAnt').onclick = () => mostrarMedio(actual - 1);
document.getElementById('vSig').onclick = () => mostrarMedio(actual + 1);
visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });

if (medios.length < 2) {
  document.querySelectorAll('.v-flecha').forEach(b => b.style.display = 'none');
}

let x0 = 0;
visor.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
visor.addEventListener('touchend', e => {
  const d = e.changedTouches[0].clientX - x0;
  if (Math.abs(d) > 50) mostrarMedio(actual + (d < 0 ? 1 : -1));
});

document.addEventListener('keydown', e => {
  if (!visor.classList.contains('abierto')) return;
  if (e.key === 'Escape') cerrarVisor();
  if (e.key === 'ArrowLeft') mostrarMedio(actual - 1);
  if (e.key === 'ArrowRight') mostrarMedio(actual + 1);
});
