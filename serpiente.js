// 1. Capturamos el canvas y su contexto de dibujo (Paso 2)
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// 4. Constante para el tamaño de cada celda (Paso 4)
const TAMANIO_CELDA = 25;

// Primera pintura del juego al cargar la página
dibujarTodo();

// =========================
// FUNCIONES DE DIBUJO
// =========================
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 5. Función para dibujar el tablero (Pasos 5 al 10)
function dibujarTablero() {
  // Color suave para las líneas de la cuadrícula
  ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
  ctx.lineWidth = 1;

  // Paso 9: Dibujar líneas verticales (avanza en X)
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Paso 10: Dibujar líneas horizontales (avanza en Y)
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Paso 3 y 7: Invocar dibujarTablero dentro de dibujarTodo
function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
}