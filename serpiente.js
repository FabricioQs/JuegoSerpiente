// 1. Capturamos el canvas y su contexto de dibujo
const canvas = document.getElementById("canvasJuego");
const ctx = canvas.getContext("2d");

// 2. Constante para el tamaño de cada celda[cite: 2]
const TAMANIO_CELDA = 25;

// Arreglo de partes de la serpiente (Ejemplo Ejercicio 3: 5 cuadros pegados al borde izquierdo)
const serpiente = [
  { x: 0, y: 2 }, // Cabeza
  { x: 0, y: 3 },
  { x: 0, y: 4 },
  { x: 0, y: 5 },
  { x: 0, y: 6 }  // Cola
];

// =========================
// FUNCIONES DE DIBUJO
// =========================
function limpiarCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function dibujarTablero() {
  ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
  ctx.lineWidth = 1;

  // Líneas verticales[cite: 2]
  for (let x = 0; x <= canvas.width; x += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Líneas horizontales[cite: 2]
  for (let y = 0; y <= canvas.height; y += TAMANIO_CELDA) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function pintarParte(lineaX, lineaY, color = "#ef4444") {
  const x = lineaX * TAMANIO_CELDA;
  const y = lineaY * TAMANIO_CELDA;

  // Relleno
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);

  // Borde
  ctx.strokeStyle = "#020617";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, TAMANIO_CELDA, TAMANIO_CELDA);
}

function pintarSerpiente() {
  for (let i = 0; i < serpiente.length; i++) {
    // Cabeza amarilla (#facc15), cuerpo rojo (#ef4444)
    const color = (i === 0) ? "#facc15" : "#ef4444";
    pintarParte(serpiente[i].x, serpiente[i].y, color);
  }
}

// ÚNICA DEFINICIÓN DE DIBUJAR TODO
function dibujarTodo() {
  limpiarCanvas();
  dibujarTablero();
  pintarSerpiente(); //[cite: 3]
}

// Ejecutar el dibujo inicial[cite: 3]
dibujarTodo();