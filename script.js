// Barra fija: aparece al pasar la portada
const barra = document.getElementById('barra');
new IntersectionObserver(([e]) => barra.classList.toggle('visible', !e.isIntersecting),
  { threshold: 0.15 }).observe(document.querySelector('.hero'));

// Foto ampliada con flechas
const fotos = [...document.querySelectorAll('#carrusel img')];
const visor = document.getElementById('visor'), vImg = document.getElementById('vImg');
let actual = 0;
const mostrar = i => { actual = (i + fotos.length) % fotos.length; vImg.src = fotos[actual].src; vImg.alt = fotos[actual].alt; };
const abrir = i => { mostrar(i); visor.classList.add('abierto'); };
const cerrar = () => visor.classList.remove('abierto');
fotos.forEach((img, i) => {
  img.addEventListener('error', () => img.parentElement.style.display = 'none');
  img.parentElement.addEventListener('click', () => abrir(i));
});
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
if (fotos.length < 2) document.querySelectorAll('.v-flecha').forEach(b => b.style.display = 'none');
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
